export class PbdbError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class OPFSUnavailableError extends PbdbError {
  constructor() { super('pbdb requires Origin Private File System (OPFS); this browser does not provide it.'); }
}
export class QuotaExceededError extends PbdbError {}
export class MigrationChecksumMismatchError extends PbdbError {
  constructor(public readonly version: number, expected: string, actual: string) {
    super(`Migration ${version} checksum mismatch (expected ${expected}, found ${actual}).`);
  }
}
export class SchemaVersionMismatchError extends PbdbError {}
export class LeaderElectionError extends PbdbError {}
export class PbdbNotReadyError extends PbdbError { constructor() { super('Database is not initialized yet'); } }
export class PbdbQueryError extends PbdbError { constructor(message: string, public readonly sql?: string) { super(message); } }
export class PbdbStorageError extends PbdbError {}
export class PbdbTimeoutError extends PbdbError { constructor(message = 'Operation timed out') { super(message); } }
