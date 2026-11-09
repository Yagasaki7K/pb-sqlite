// Core
export { createDB } from './core/database';
export { runMigrations, rollbackMigrations, checksumMigration } from './core/migration';

// Errors
export {
  PbSqliteError,
  WorkerCrashedError,
  OPFSUnavailableError,
  QuotaExceededError,
  MigrationChecksumMismatchError,
  SchemaVersionMismatchError,
  LeaderElectionError,
  PbSqliteNotReadyError,
  PbSqliteQueryError,
  PbSqliteStorageError,
  PbSqliteTimeoutError,
} from './core/errors';

// Utilities
export {
  requestPersistence,
  isStoragePersisted,
  getStorageEstimate,
} from './utils/persistence';

// Types
export type {
  PbSqliteDatabase,
  PbSqliteDB,
  PbSqliteTransaction,
  PbdbTransaction,
  CreateDBOptions,
  Migration,
  QueryOptions,
  ExportPayload,
} from './core/types';
