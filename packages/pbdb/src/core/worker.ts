import SQLiteESMFactory from 'wa-sqlite/dist/wa-sqlite.mjs';
import * as SQLite from 'wa-sqlite';
import { AccessHandlePoolVFS } from 'wa-sqlite/src/examples/AccessHandlePoolVFS.js';
import type { WorkerRequest, WorkerResponse } from './types';

// wa-sqlite の params 型 (SQLiteCompatibleType[] は export されていない)
type SQLParams = (number | string | Uint8Array | number[] | bigint | null)[];

let sqlite3: ReturnType<typeof SQLite.Factory>;
let db: number | undefined;
let activeDbName = '';

function extractMutatedTables(sql: string): string[] {
  const tables = new Set<string>();
  const patterns = [
    /INSERT\s+(?:OR\s+\w+\s+)?INTO\s+["'`]?(\w+)["'`]?/gi,
    /UPDATE\s+(?:OR\s+\w+\s+)?["'`]?(\w+)["'`]?/gi,
    /DELETE\s+FROM\s+["'`]?(\w+)["'`]?/gi,
    /DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?["'`]?(\w+)["'`]?/gi,
    /ALTER\s+TABLE\s+["'`]?(\w+)["'`]?/gi,
  ];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(sql)) !== null) {
      const name = match[1].toLowerCase();
    if (!name.startsWith('_pbsqlite_')) tables.add(name);
    }
  }
  return Array.from(tables);
}

function respond(msg: WorkerResponse) {
  self.postMessage(msg);
}

function notifyChange(sql: string) {
  const tables = extractMutatedTables(sql);
  if (tables.length > 0) {
    self.postMessage({ type: 'change', tables } as WorkerResponse);
  }
}

// OPFS ディレクトリを再帰的に削除する
async function clearOPFSDirectory(path: string): Promise<void> {
  try {
    const root = await navigator.storage.getDirectory();
    let dir = root;
    for (const segment of path.split('/').filter(Boolean)) {
      dir = await dir.getDirectoryHandle(segment);
    }
    // ディレクトリ内の全エントリを削除
    const entries = dir as FileSystemDirectoryHandle & { entries(): AsyncIterableIterator<[string, FileSystemHandle]> };
    for await (const [name] of entries.entries()) {
      await dir.removeEntry(name, { recursive: true });
    }
  } catch {
    // ディレクトリが存在しない場合は無視
  }
}

async function initDB(dbName: string) {
  if (db !== undefined) return;
  activeDbName = dbName;
  console.debug('[pb-sqlite] initializing...');

  const dirPath = `/pbsqlite/${dbName}`;

  const module = await SQLiteESMFactory();
  sqlite3 = SQLite.Factory(module);

  const vfs = new AccessHandlePoolVFS(dirPath);
  await vfs.isReady;

  // プールに空きスロットがなければ拡張（ジャーナル/一時ファイル用に4つ確保）
  const MIN_FREE_SLOTS = 4;
  const freeSlots = vfs.getCapacity() - vfs.getSize();
  if (freeSlots < MIN_FREE_SLOTS) {
    await vfs.addCapacity(MIN_FREE_SLOTS - freeSlots);
  }

  sqlite3.vfs_register(vfs, true);

  try {
    db = await sqlite3.open_v2(`${dbName}.db`);
  } catch (e) {
    console.error('[pb-sqlite] DB open failed; existing OPFS data was left untouched.');
    throw e;
  }

  await sqlite3.exec(db as number, 'PRAGMA journal_mode=WAL');
  console.debug('[pb-sqlite] DB opened');
}

// === Export: 全テーブルの CREATE 文とデータを JSON として返す ===
async function handleExport(): Promise<Uint8Array> {
  const dump: { schema: string[]; data: Record<string, unknown[][]> } = {
    schema: [],
    data: {},
  };

  // テーブル定義を取得
  const tables: { name: string; sql: string }[] = [];
  await sqlite3.exec(db as number,
    "SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE '_pbsqlite_%' ORDER BY name",
    (row: unknown[], columns: string[]) => {
      tables.push({ name: row[0] as string, sql: row[1] as string });
    }
  );

  for (const table of tables) {
    dump.schema.push(table.sql);

    // テーブルデータを取得
    const rows: unknown[][] = [];
    await sqlite3.exec(db as number, `SELECT * FROM "${table.name}"`,
      (row: unknown[]) => { rows.push([...row]); }
    );
    dump.data[table.name] = rows;
  }

  const json = JSON.stringify(dump);
  return new TextEncoder().encode(json);
}

async function getDatabaseDirectory(): Promise<FileSystemDirectoryHandle> {
  const root = await navigator.storage.getDirectory();
  const pbsqliteDirectory = await root.getDirectoryHandle('pbsqlite');
  return pbsqliteDirectory.getDirectoryHandle(activeDbName);
}

async function handleSQLiteExport(): Promise<Uint8Array> {
  const fileName = `export-${crypto.randomUUID()}.sqlite`;
  await sqlite3.exec(db as number, 'PRAGMA wal_checkpoint(TRUNCATE)');
  await sqlite3.exec(db as number, `VACUUM INTO '${fileName}'`);
  const directory = await getDatabaseDirectory();
  const fileHandle = await directory.getFileHandle(fileName);
  const file = await fileHandle.getFile();
  const bytes = new Uint8Array(await file.arrayBuffer());
  await directory.removeEntry(fileName);
  return bytes;
}

async function handleSQLiteImport(data: Uint8Array): Promise<void> {
  if (db === undefined) throw new Error('Database is not initialized');
  await sqlite3.close(db);
  db = undefined;
  await clearOPFSDirectory(`/pbsqlite/${activeDbName}`);
  const root = await navigator.storage.getDirectory();
  const pbsqliteDirectory = await root.getDirectoryHandle('pbsqlite');
  const directory = await pbsqliteDirectory.getDirectoryHandle(activeDbName, { create: true });
  const fileHandle = await directory.getFileHandle(`${activeDbName}.db`, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(new Uint8Array(data));
  await writable.close();
  await initDB(activeDbName);
}

// === Import: JSON ダンプからテーブルを復元 ===
async function handleImport(data: Uint8Array): Promise<void> {
  const json = new TextDecoder().decode(data);
  const dump: { schema: string[]; data: Record<string, unknown[][]> } = JSON.parse(json);

  // 既存テーブルを全削除
  const existingTables: string[] = [];
  await sqlite3.exec(db as number,
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE '_pbsqlite_%'",
    (row: unknown[]) => { existingTables.push(row[0] as string); }
  );
  for (const name of existingTables) {
    await sqlite3.exec(db as number, `DROP TABLE IF EXISTS "${name}"`);
  }

  // スキーマを復元
  for (const sql of dump.schema) {
    await sqlite3.exec(db as number, sql);
  }

  // データを復元
  for (const [tableName, rows] of Object.entries(dump.data)) {
    if (rows.length === 0) continue;
    const colCount = rows[0].length;
    const placeholders = Array(colCount).fill('?').join(',');
    const insertSql = `INSERT INTO "${tableName}" VALUES (${placeholders})`;
    for (const row of rows) {
      await sqlite3.run(db as number, insertSql, row as SQLParams);
    }
  }
}

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const { id, type } = event.data;

  try {
    switch (type) {
      case 'init': {
        await initDB(event.data.dbName);
        respond({ id, type: 'success' });
        break;
      }

      case 'run': {
        const { sql, params } = event.data;
        await sqlite3.run(db as number, sql, params.length > 0 ? params as SQLParams : undefined);
        respond({ id, type: 'success' });
        notifyChange(sql);
        break;
      }

      case 'query': {
        const { sql, params } = event.data;
        const { rows, columns } = await sqlite3.execWithParams(
          db as number, sql, params.length > 0 ? params as SQLParams : undefined
        );
        const results = rows.map((row: unknown[]) => {
          const obj: Record<string, unknown> = {};
          columns.forEach((col: string, i: number) => {
            obj[col] = row[i];
          });
          return obj;
        });
        respond({ id, type: 'success', result: results });
        break;
      }

      case 'export': {
        const data = await handleExport();
        respond({ id, type: 'success', result: data });
        break;
      }

      case 'exportSQLite': {
        const data = await handleSQLiteExport();
        respond({ id, type: 'success', result: data });
        break;
      }

      case 'import': {
        await handleImport(event.data.data);
        respond({ id, type: 'success' });
        break;
      }

      case 'importSQLite': {
        await handleSQLiteImport(event.data.data);
        respond({ id, type: 'success' });
        break;
      }

      case 'close': {
        await sqlite3.close(db as number);
        respond({ id, type: 'success' });
        break;
      }
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[pb-sqlite] error:', message);
    respond({ id, type: 'error', message });
  }
};
