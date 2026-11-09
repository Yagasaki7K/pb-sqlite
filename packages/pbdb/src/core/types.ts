// === Worker 通信プロトコル ===

export type WorkerRequest =
  | { id: string; type: 'init'; dbName: string; storage: 'auto' | 'opfs' | 'idb' }
  | { id: string; type: 'run'; sql: string; params: unknown[] }
  | { id: string; type: 'query'; sql: string; params: unknown[] }
  | { id: string; type: 'export' }
  | { id: string; type: 'import'; data: Uint8Array }
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

export interface PbdbDatabase {
  run(sql: string, params?: unknown[]): Promise<void>;
  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T[]>;
  getOne<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T | null>;
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

export type PbdbDB = PbdbDatabase;
export type QueryRow = Record<string, unknown>;

export interface PbdbTransaction {
  run(sql: string, params?: unknown[]): Promise<void>;
  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T[]>;
  getOne<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T | null>;
}
