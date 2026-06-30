const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: `file:///${__dirname.replace(/\\/g, '/')}/index.html`,
    browserName: 'chromium',
    headless: true,
  },
});
