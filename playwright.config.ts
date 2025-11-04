import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'src/scenarios',
  timeout: 120_000,
  retries: 0,
  expect: {
    timeout: 30_000,
  },
  use: {
    trace: 'on',
    locale: 'pt-BR',
    headless: true, // 🔹 Mantenha headless no CI
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    screenshot: 'on',
    video: 'off',
  },
  reporter: [
    [
      'html',
      {
        outputFolder: 'artifacts/report',
        open: 'never',
      },
    ],
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
