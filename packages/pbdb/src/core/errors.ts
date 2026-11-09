export class PbSqliteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class OPFSUnavailableError extends PbSqliteError {
  constructor() { super('pb-sqlite requires Origin Private File System (OPFS); this browser does not provide it.'); }
}
export class QuotaExceededError extends PbSqliteError {}
export class MigrationChecksumMismatchError extends PbSqliteError {
  constructor(public readonly version: number, expected: string, actual: string) {
    super(`Migration ${version} checksum mismatch (expected ${expected}, found ${actual}).`);
  }
}
export class SchemaVersionMismatchError extends PbSqliteError {}
export class LeaderElectionError extends PbSqliteError {}
export class PbSqliteNotReadyError extends PbSqliteError { constructor() { super('Database is not initialized yet'); } }
export class PbSqliteQueryError extends PbSqliteError { constructor(message: string, public readonly sql?: string) { super(message); } }
export class PbSqliteStorageError extends PbSqliteError {}
export class PbSqliteTimeoutError extends PbSqliteError { constructor(message = 'Operation timed out') { super(message); } }
export class WorkerCrashedError extends PbSqliteError { constructor(message = 'SQLite worker stopped unexpectedly') { super(message); } }

/** @deprecated Use PbSqliteError. */
export const PbdbError = PbSqliteError;
/** @deprecated Use PbSqliteNotReadyError. */
export const PbdbNotReadyError = PbSqliteNotReadyError;
/** @deprecated Use PbSqliteQueryError. */
export const PbdbQueryError = PbSqliteQueryError;
/** @deprecated Use PbSqliteStorageError. */
export const PbdbStorageError = PbSqliteStorageError;
/** @deprecated Use PbSqliteTimeoutError. */
export const PbdbTimeoutError = PbSqliteTimeoutError;
