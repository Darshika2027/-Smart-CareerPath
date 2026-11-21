import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  timeout: 30000,

  workers: 1,

  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],

  use: {
    baseURL: 'http://127.0.0.1:5187',

    browserName: 'chromium',

    headless: true,

    viewport: {
      width: 1366,
      height: 600
    },

    screenshot: 'only-on-failure',

    trace: 'retain-on-failure'
  },

  webServer: {
    command: 'npm.cmd run dev -- --host 127.0.0.1 --port 5187 --strictPort',

    url: 'http://127.0.0.1:5187/',

    reuseExistingServer: false,

    timeout: 60000
  }
});
