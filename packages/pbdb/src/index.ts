// Core
export { createDB } from './core/database';
export { runMigrations, rollbackMigrations, checksumMigration } from './core/migration';

// Errors
export {
  PbdbError,
  OPFSUnavailableError,
  QuotaExceededError,
  MigrationChecksumMismatchError,
  SchemaVersionMismatchError,
  LeaderElectionError,
  PbdbNotReadyError,
  PbdbQueryError,
  PbdbStorageError,
  PbdbTimeoutError,
} from './core/errors';

// Utilities
export {
  requestPersistence,
  isStoragePersisted,
  getStorageEstimate,
} from './utils/persistence';

// Types
export type {
  PbdbDatabase,
  PbdbDB,
  PbdbTransaction,
  CreateDBOptions,
  Migration,
  QueryOptions,
  ExportPayload,
} from './core/types';
