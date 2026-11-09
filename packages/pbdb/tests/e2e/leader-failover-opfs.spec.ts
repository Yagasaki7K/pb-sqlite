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
  await page.evaluate((html: string) => { document.open(); document.write(html); document.close(); }, importMapPage);
  await page.evaluate(async (name: string) => {
    const moduleUrl = '/packages/pbdb/dist/index.js';
    const { createDB } = await import(moduleUrl);
    const database = await createDB(name);
    await database.run('CREATE TABLE IF NOT EXISTS failover (id INTEGER PRIMARY KEY, value TEXT NOT NULL)');
    (globalThis as unknown as { database: unknown }).database = database;
  }, dbName);
}

test('keeps OPFS SQLite available after the leader tab closes', async ({ browser }) => {
  const context = await browser.newContext();
  const leader = await context.newPage();
  const follower = await context.newPage();
  const dbName = `e2e-failover-${Date.now()}`;

  await openDatabase(leader, dbName);
  await openDatabase(follower, dbName);
  await leader.evaluate(async () => {
    const database = (globalThis as unknown as { database: { run(sql: string, params?: unknown[]): Promise<void> } }).database;
    await database.run('INSERT INTO failover (value) VALUES (?)', ['before-failover']);
  });

  await leader.close();
  await expect.poll(async () => follower.evaluate(async () => {
    const database = (globalThis as unknown as { database: { query<T>(sql: string): Promise<T[]> } }).database;
    const rows = await database.query<{ value: string }>('SELECT value FROM failover');
    return rows[0]?.value;
  }), { timeout: 10_000 }).toBe('before-failover');

  const exportHeader = await follower.evaluate(async () => {
    const database = (globalThis as unknown as { database: { exportSQLite(): Promise<ArrayBuffer> } }).database;
    const bytes = new Uint8Array(await database.exportSQLite());
    return new TextDecoder().decode(bytes.slice(0, 15));
  });
  expect(exportHeader).toBe('SQLite format 3\0');

  await follower.evaluate(async (name: string) => {
    const moduleUrl = '/packages/pbdb/dist/index.js';
    const { createDB } = await import(moduleUrl);
    const source = (globalThis as unknown as { database: { exportSQLite(): Promise<ArrayBuffer> } }).database;
    const restored = await createDB(`${name}-restored`);
    await restored.importSQLite(await source.exportSQLite());
    const rows = await restored.query('SELECT value FROM failover ORDER BY id') as Array<{ value: string }>;
    if (rows.length !== 1 || rows[0]?.value !== 'before-failover') throw new Error('native SQLite import failed');
    await restored.close();
  }, dbName);

  await follower.evaluate(async () => {
    const database = (globalThis as unknown as { database: { run(sql: string, params?: unknown[]): Promise<void>; query<T>(sql: string): Promise<T[]> } }).database;
    await database.run('INSERT INTO failover (value) VALUES (?)', ['after-failover']);
    const rows = await database.query<{ value: string }>('SELECT value FROM failover ORDER BY id DESC LIMIT 1');
    if (rows[0]?.value !== 'after-failover') throw new Error('writes did not reach the promoted leader');
  });
  await context.close();
});
