import type { PbdbDatabase, Migration } from './types';
import { MigrationChecksumMismatchError } from './errors';

export async function checksumMigration(migration: Pick<Migration, 'version' | 'name' | 'up'>): Promise<string> {
  const bytes = new TextEncoder().encode(`${migration.version}:${migration.name}:${migration.up}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((value) => value.toString(16).padStart(2, '0')).join('');
}

export async function runMigrations(db: PbdbDatabase, migrations: Migration[]): Promise<void> {
  await db.run(`CREATE TABLE IF NOT EXISTS _pbdb_migrations (version INTEGER PRIMARY KEY, name TEXT NOT NULL, checksum TEXT NOT NULL, applied_at TEXT NOT NULL DEFAULT (datetime('now')))`, []);
  const applied = await db.query<{ version: number; checksum: string }>('SELECT version, checksum FROM _pbdb_migrations ORDER BY version');
  const byVersion = new Map(applied.map((row) => [row.version, row.checksum]));

  for (const migration of [...migrations].sort((a, b) => a.version - b.version)) {
    const expected = await checksumMigration(migration);
    const stored = byVersion.get(migration.version);
    if (stored && stored !== expected && stored !== migration.checksum) {
      throw new MigrationChecksumMismatchError(migration.version, stored, expected);
    }
    if (stored) continue;
    await db.transaction(async (tx) => {
      await tx.run(migration.up);
      await tx.run('INSERT INTO _pbdb_migrations (version, name, checksum) VALUES (?, ?, ?)', [migration.version, migration.name, migration.checksum || expected]);
    });
  }
}

export async function rollbackMigrations(db: PbdbDatabase, targetVersion: number, migrations: Migration[]): Promise<void> {
  const applied = await db.query<{ version: number }>('SELECT version FROM _pbdb_migrations WHERE version > ? ORDER BY version DESC', [targetVersion]);
  const byVersion = new Map(migrations.map((migration) => [migration.version, migration]));
  for (const row of applied) {
    const migration = byVersion.get(row.version);
    if (!migration?.down) throw new Error(`Migration ${row.version} has no down SQL and cannot be rolled back.`);
    await db.transaction(async (tx) => {
      await tx.run(migration.down!);
      await tx.run('DELETE FROM _pbdb_migrations WHERE version = ?', [row.version]);
    });
  }
}
