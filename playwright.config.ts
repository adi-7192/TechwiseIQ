import { defineConfig } from '@playwright/test'

// Next 16 refuses to start a second dev server; when one is already running
// (or in CI against a deployed build), point tests at it instead:
//   PW_BASE_URL=http://localhost:3000 npx playwright test
const externalBaseURL = process.env.PW_BASE_URL

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  reporter: 'list',
  use: {
    baseURL: externalBaseURL ?? 'http://127.0.0.1:3100',
    channel: 'chrome',
    trace: 'retain-on-failure',
  },
  webServer: externalBaseURL
    ? undefined
    : {
        command: 'npm run dev -- --hostname 127.0.0.1 --port 3100',
        url: 'http://127.0.0.1:3100',
        reuseExistingServer: true,
        timeout: 120_000,
      },
})
