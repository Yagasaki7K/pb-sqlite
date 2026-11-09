import { test, expect } from '@playwright/test';

test('browser test harness is available for OPFS and multi-tab scenarios', async ({ browser }) => {
  const context = await browser.newContext();
  const first = await context.newPage();
  const second = await context.newPage();
  expect(first).toBeTruthy();
  expect(second).toBeTruthy();
  await context.close();
});
