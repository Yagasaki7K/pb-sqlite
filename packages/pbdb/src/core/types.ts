// === Worker 通信プロトコル ===

export type WorkerRequest =
  | { id: string; type: 'init'; dbName: string; storage?: 'auto' | 'opfs' | 'idb' }
  | { id: string; type: 'run'; sql: string; params: unknown[] }
  | { id: string; type: 'query'; sql: string; params: unknown[] }
  | { id: string; type: 'export' }
  | { id: string; type: 'exportSQLite' }
  | { id: string; type: 'import'; data: Uint8Array }
  | { id: string; type: 'importSQLite'; data: Uint8Array }
  | { id: string; type: 'close' };

export type WorkerResponse =
  | { id: string; type: 'success'; result?: unknown }
  | { id: string; type: 'error'; message: string }
  | { type: 'change'; tables: string[] };

// === リーダー選出: タブ間通信プロトコル ===

export type TabId = string;

export type LeaderMessage =
  | { type: 'heartbeat'; leaderId: TabId }
  | { type: 'leader-ready'; leaderId: TabId }
  | { type: 'leader-closing'; leaderId: TabId }
  | { type: 'change'; tables: string[] }
  | { type: 'request'; tabId: TabId; payload: WorkerRequest }
  | { type: 'response'; tabId: TabId; payload: WorkerResponse };

// === Public API Types ===

export interface CreateDBOptions {
  storage?: 'opfs';
  debug?: boolean;
  queryTimeout?: number;
  onError?: (error: Error) => void;
}

export interface Migration {
  version: number;
  name: string;
  up: string;
  down?: string;
  checksum: string;
}

export interface QueryOptions { tags?: string[] }
export interface ExportPayload {
  version: 1;
  schemaVersion: number;
  createdAt: string;
  data: Uint8Array;
}

export interface PbSqliteDatabase {
  /** Execute DDL or another SQL statement without parameters. */
  exec(sql: string): Promise<void>;
  /** Execute DML with positional parameters. */
  run(sql: string, params?: unknown[]): Promise<void>;
  /** Return all rows from a SELECT statement. */
  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T[]>;
  /** Return the first row or null. */
  getOne<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T | null>;
  /** Commit on success and rollback automatically when the callback throws. */
  transaction(fn: (tx: PbdbTransaction) => Promise<void>): Promise<void>;
  migrate(migrations?: Migration[]): Promise<void>;
  rollback(targetVersion: number, migrations?: Migration[]): Promise<void>;
  export(): Promise<ExportPayload>;
  exportSQLite(): Promise<ArrayBuffer>;
  import(payload: ExportPayload): Promise<void>;
  importSQLite(data: ArrayBuffer): Promise<void>;
  invalidate(tag: string): void;
  invalidateAll(): void;
  purgeSynced(before: Date): Promise<void>;
  close(): Promise<void>;
  onTableChange(listener: (tables: string[]) => void): () => void;
  isReady: boolean;
}

export type PbSqliteDB = PbSqliteDatabase;
export type QueryRow = Record<string, unknown>;

export interface PbdbTransaction {
  run(sql: string, params?: unknown[]): Promise<void>;
  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T[]>;
  getOne<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T | null>;
}

/** @deprecated Use PbSqliteDatabase. */
export type PbdbDatabase = PbSqliteDatabase;
/** @deprecated Use PbSqliteDB. */
export type PbdbDB = PbSqliteDB;
/** @deprecated Use PbSqliteTransaction. */
export type PbSqliteTransaction = PbdbTransaction;
