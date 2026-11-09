import type {
  WorkerResponse,
  PbdbDatabase, Migration, ExportPayload,
  PbdbTransaction,
  CreateDBOptions,
} from './types';
import type { Transport } from './transport';
import { LeaderTransport } from './transport';
import { PbdbNotReadyError, PbdbTimeoutError, OPFSUnavailableError } from './errors';
import { electLeader } from './leader-election';
import { runMigrations, rollbackMigrations } from './migration';

const DEFAULT_QUERY_TIMEOUT = 10_000;

class PbdbDatabaseImpl implements PbdbDatabase {
  private transport: Transport;
  private counter = 0;
  private pending = new Map<string, {
    resolve: (v: any) => void;
    reject: (e: Error) => void;
    timer: ReturnType<typeof setTimeout>;
  }>();
  private changeListeners = new Set<(tables: string[]) => void>();
  private _isReady = false;
  private queryTimeout: number;
  private readonly debug: boolean;
  private readonly onError?: (error: Error) => void;
  private invalidationListeners = new Set<(tags: string[]) => void>();

  get isReady() {
    return this._isReady;
  }

  constructor(transport: Transport, queryTimeout = DEFAULT_QUERY_TIMEOUT, options: { debug?: boolean; onError?: (error: Error) => void } = {}) {
    this.transport = transport;
    this.queryTimeout = queryTimeout;
    this.debug = options.debug ?? false;
    this.onError = options.onError;
    this.wireTransport(transport);
  }

  private wireTransport(transport: Transport) {
    transport.onmessage = (e: { data: WorkerResponse }) => {
      if (e.data.type === 'change') {
        const { tables } = e.data as { type: 'change'; tables: string[] };
        for (const listener of this.changeListeners) {
          listener(tables);
        }
        return;
      }

      const { id } = e.data as { id: string; type: string };
      const cb = this.pending.get(id);
      if (!cb) return;
      clearTimeout(cb.timer);
      this.pending.delete(id);

      if (e.data.type === 'success') {
        cb.resolve((e.data as any).result);
      } else {
      const error = new Error((e.data as any).message);
      this.onError?.(error);
      cb.reject(error);
      }
    };
  }

  /** リーダー昇格時にトランスポートを差し替える */
  _replaceTransport(transport: Transport) {
    this.transport = transport;
    this.wireTransport(transport);
  }

  send(msg: Record<string, any>, transfer?: Transferable[]): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = String(++this.counter);
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new PbdbTimeoutError());
      }, this.queryTimeout);

      this.pending.set(id, { resolve, reject, timer });
      this.transport.postMessage({ id, ...msg }, transfer);
    });
  }

  async run(sql: string, params: unknown[] = []): Promise<void> {
    if (!this._isReady) throw new PbdbNotReadyError();
    await this.send({ type: 'run', sql, params });
  }

  async query<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
    if (!this._isReady) throw new PbdbNotReadyError();
    return (await this.send({ type: 'query', sql, params })) as T[];
  }

  async getOne<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T | null> {
    const rows = await this.query<T>(sql, params);
    return rows[0] ?? null;
  }

  async transaction(fn: (tx: PbdbTransaction) => Promise<void>): Promise<void> {
    if (!this._isReady) throw new PbdbNotReadyError();
    await this.send({ type: 'run', sql: 'BEGIN', params: [] });
    try {
      const tx: PbdbTransaction = {
        run: (sql, params = []) => this.send({ type: 'run', sql, params }),
        query: (sql, params = []) => this.send({ type: 'query', sql, params }),
        getOne: async (sql, params = []) => {
          const rows = await this.send({ type: 'query', sql, params });
          return rows[0] ?? null;
        },
      };
      await fn(tx);
      await this.send({ type: 'run', sql: 'COMMIT', params: [] });
      for (const listener of this.invalidationListeners) listener([]);
    } catch (e) {
      await this.send({ type: 'run', sql: 'ROLLBACK', params: [] });
      throw e;
    }
  }

  async export(): Promise<ExportPayload> {
    if (!this._isReady) throw new PbdbNotReadyError();
    const data = (await this.send({ type: 'export' })) as Uint8Array;
    return { version: 1, schemaVersion: 0, createdAt: new Date().toISOString(), data };
  }

  async exportSQLite(): Promise<ArrayBuffer> {
    const payload = await this.export();
    return payload.data.buffer.slice(payload.data.byteOffset, payload.data.byteOffset + payload.data.byteLength) as ArrayBuffer;
  }

  async import(payload: ExportPayload): Promise<void> {
    if (!this._isReady) throw new PbdbNotReadyError();
    await this.send({ type: 'import', data: payload.data });
  }

  async importSQLite(data: ArrayBuffer): Promise<void> {
    await this.import({ version: 1, schemaVersion: 0, createdAt: new Date().toISOString(), data: new Uint8Array(data) });
  }

  async migrate(migrations: Migration[] = []): Promise<void> { await runMigrations(this, migrations); }
  async rollback(targetVersion: number, migrations: Migration[] = []): Promise<void> { await rollbackMigrations(this, targetVersion, migrations); }
  invalidate(tag: string): void { for (const listener of this.invalidationListeners) listener([tag]); }
  invalidateAll(): void { for (const listener of this.invalidationListeners) listener([]); }
  async purgeSynced(before: Date): Promise<void> { await this.run('DELETE FROM vendas WHERE sincronizado = 1 AND updated_at < ?', [before.toISOString()]); }
  onInvalidate(listener: (tags: string[]) => void): () => void { this.invalidationListeners.add(listener); return () => this.invalidationListeners.delete(listener); }

  onTableChange(listener: (tables: string[]) => void): () => void {
    this.changeListeners.add(listener);
    return () => this.changeListeners.delete(listener);
  }

  async close(): Promise<void> {
    this._isReady = false;

    // 全 pending リクエストのタイマーをクリア
    for (const { timer } of this.pending.values()) {
      clearTimeout(timer);
    }
    this.pending.clear();
    this.changeListeners.clear();

    try {
      await this.send({ type: 'close' });
    } catch {
      // close 中のエラーは無視
    }
    this.transport.close();
  }

  /** @internal */
  _markReady() {
    this._isReady = true;
    if (this.debug) console.debug('[pbdb] database ready');
  }
}

/** DB を作成して接続する */
export async function createDB(
  dbName: string,
  options: CreateDBOptions = {}
): Promise<PbdbDatabase> {
  if (typeof navigator === 'undefined' || !navigator.storage?.getDirectory) throw new OPFSUnavailableError();
  let db: PbdbDatabaseImpl;

  // Web Locks API が使えればリーダー選出でマルチタブ対応
  if (typeof navigator !== 'undefined' && navigator.locks) {
    const { transport, cleanup: _cleanup } = await electLeader(dbName, () =>
      new Worker(new URL('./worker.js', import.meta.url), { type: 'module' })
    );
    db = new PbdbDatabaseImpl(transport, DEFAULT_QUERY_TIMEOUT, options);

    // リーダー昇格コールバックを登録
    // electLeader 内の onTransportReady に接続
  } else {
    // フォールバック: シングルタブモード（Web Locks 非対応環境）
    const worker = new Worker(
      new URL('./worker.js', import.meta.url),
      { type: 'module' }
    );
    const channel = new BroadcastChannel(`pbdb:${dbName}`);
    const transport = new LeaderTransport(worker, channel);
    db = new PbdbDatabaseImpl(transport, DEFAULT_QUERY_TIMEOUT, options);
  }

  await db.send({ type: 'init', dbName });
  db._markReady();

  if (typeof navigator !== 'undefined' && navigator.storage?.persist) {
    navigator.storage.persist().catch(() => {});
  }

  return db;
}
