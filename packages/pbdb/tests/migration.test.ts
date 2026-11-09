import { describe, expect, it } from 'vitest';
import { checksumMigration, runMigrations } from '../src/core/migration';
import { MigrationChecksumMismatchError } from '../src/core/errors';
import type { PbdbDatabase, PbdbTransaction, Migration } from '../src/core/types';

function fakeDb(rows: Array<{ version: number; checksum: string }> = []): PbdbDatabase {
  const statements: string[] = [];
  const db = {
    run: async (sql: string) => { statements.push(sql); },
    query: async <T>(sql: string) => (sql.includes('checksum') ? rows : []) as T[],
    exec: async (sql: string) => { statements.push(sql); },
    transaction: async (fn: (tx: PbdbTransaction) => Promise<void>) => fn({ run: async (sql) => { statements.push(sql); }, query: async () => [], getOne: async () => null }),
    getOne: async () => null,
    migrate: async () => {}, rollback: async () => {}, export: async () => ({ version: 1 as const, schemaVersion: 0, createdAt: '', data: new Uint8Array() }), exportSQLite: async () => new ArrayBuffer(0), import: async () => {}, importSQLite: async () => {}, invalidate: () => {}, invalidateAll: () => {}, purgeSynced: async () => {}, close: async () => {}, onTableChange: () => () => {}, isReady: true,
  } as unknown as PbdbDatabase;
  return db;
}

describe('migrations', () => {
  const migration: Migration = { version: 1, name: 'create todos', up: 'CREATE TABLE todos (id INTEGER)', down: 'DROP TABLE todos', checksum: '' };
  it('calculates a stable SHA-256 checksum and applies pending migrations', async () => {
    migration.checksum = await checksumMigration(migration);
    const db = fakeDb();
    await runMigrations(db, [migration]);
    expect(migration.checksum).toHaveLength(64);
  });

  it('rejects a changed migration checksum', async () => {
    const db = fakeDb([{ version: 1, checksum: 'old' }]);
    await expect(runMigrations(db, [migration])).rejects.toBeInstanceOf(MigrationChecksumMismatchError);
  });
});
