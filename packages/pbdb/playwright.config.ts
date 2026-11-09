import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  webServer: {
    command: 'python -m http.server 4173 --directory ../..',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
  },
  use: { browserName: 'chromium' },
});
