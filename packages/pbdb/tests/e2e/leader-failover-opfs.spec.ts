import { expect, test } from '@playwright/test';

const importMapPage = `<!doctype html><html><head><script type="importmap">${JSON.stringify({
  imports: {
    'wa-sqlite': '/node_modules/.bun/wa-sqlite@1.0.0/node_modules/wa-sqlite/src/sqlite-api.js',
    'wa-sqlite/dist/wa-sqlite.mjs': '/node_modules/.bun/wa-sqlite@1.0.0/node_modules/wa-sqlite/dist/wa-sqlite.mjs',
    'wa-sqlite/src/examples/AccessHandlePoolVFS.js': '/node_modules/.bun/wa-sqlite@1.0.0/node_modules/wa-sqlite/src/examples/AccessHandlePoolVFS.js',
    'wa-sqlite/src/VFS.js': '/node_modules/.bun/wa-sqlite@1.0.0/node_modules/wa-sqlite/src/VFS.js',
    'wa-sqlite/src/sqlite-constants.js': '/node_modules/.bun/wa-sqlite@1.0.0/node_modules/wa-sqlite/src/sqlite-constants.js',
  },
})}</script></head><body></body></html>`;

async function openDatabase(page: import('@playwright/test').Page, dbName: string): Promise<void> {
  await page.goto('http://127.0.0.1:4173/');
  await page.evaluate((html: string) => { document.open(); document.write(html); document.close(); }, importMapPage);
  await page.evaluate(async (name: string) => {
    const moduleUrl = 'http://127.0.0.1:4173/packages/pbdb/dist/index.js';
    const { createDB } = await import(moduleUrl);
    const database = await createDB(name);
    await database.exec('CREATE TABLE IF NOT EXISTS failover (id INTEGER PRIMARY KEY, value TEXT NOT NULL)');
    (globalThis as unknown as { database: unknown }).database = database;
  }, dbName);
}

test('keeps OPFS SQLite available across tabs and reopen', async ({ browser }) => {
  const context = await browser.newContext();
  const leader = await context.newPage();
  const follower = await context.newPage();
  const dbName = `e2e-failover-${Date.now()}`;

  await openDatabase(leader, dbName);
  await openDatabase(follower, dbName);
  await leader.evaluate(async () => {
    const database = (globalThis as unknown as { database: { run(sql: string, params?: unknown[]): Promise<void>; transaction(fn: (tx: { run(sql: string, params?: unknown[]): Promise<void> }) => Promise<void>): Promise<void> } }).database;
    await database.run('INSERT INTO failover (value) VALUES (?)', ['before-failover']);
    await database.transaction(async (tx) => {
      await tx.run('INSERT INTO failover (value) VALUES (?)', ['committed']);
    });
    let rolledBack = false;
    try {
      await database.transaction(async (tx) => {
        await tx.run('INSERT INTO failover (value) VALUES (?)', ['rolled-back']);
        throw new Error('rollback test');
      });
    } catch (error) {
      rolledBack = error instanceof Error && error.message === 'rollback test';
    }
    if (!rolledBack) throw new Error('rollback test did not reject');
  });

  await expect.poll(async () => follower.evaluate(async () => {
    const database = (globalThis as unknown as { database: { query<T>(sql: string): Promise<T[]> } }).database;
    const rows = await database.query<{ value: string }>('SELECT value FROM failover ORDER BY id');
    return rows.map((row) => row.value).join(',');
  }), { timeout: 10_000 }).toBe('before-failover,committed');

  await leader.close();
  await follower.close();
  const reopened = await context.newPage();
  await openDatabase(reopened, dbName);
  const persisted = await reopened.evaluate(async () => {
    const database = (globalThis as unknown as { database: { query<T>(sql: string): Promise<T[]> } }).database;
    return database.query<{ value: string }>('SELECT value FROM failover ORDER BY id');
  });
  expect(persisted.map((row) => row.value)).toEqual(['before-failover', 'committed']);
  await context.close();
});
