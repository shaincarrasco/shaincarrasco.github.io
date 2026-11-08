import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  webServer: { command: 'python3 -m http.server 4321 -d dist', port: 4321, reuseExistingServer: true },
  use: { baseURL: 'http://localhost:4321' },
  projects: [
    { name: 'mobile', use: { viewport: { width: 390, height: 844 } } },
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
  ],
});
