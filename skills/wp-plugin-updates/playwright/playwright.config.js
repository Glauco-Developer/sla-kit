// Dedicated to the plugin updates. Not related to any other test suite in the repository.
// Usage: PLUGIN_UPDATES_BASE_URL=<url> PLUGIN_UPDATES_MONTH=YYYY-MM npx playwright test
// Optional Basic Auth (terminal runs only): PLUGIN_UPDATES_BASIC_AUTH_USER / PLUGIN_UPDATES_BASIC_AUTH_PASSWORD from the environment.
const { defineConfig } = require('@playwright/test');

const fs = require('fs');
const path = require('path');
const root = process.env.PLUGIN_UPDATES_PROJECT_DIR;
if (!root) throw new Error('PLUGIN_UPDATES_PROJECT_DIR is not set (path of the WordPress project root)');
process.env.PLUGIN_UPDATES_KIT_DIR = __dirname; // lets project specs require the kit helpers
const projectSpecs = path.join(root, 'plugin-updates', 'playwright-project');
const hasProjectSpecs = fs.existsSync(projectSpecs) && fs.readdirSync(projectSpecs).some((f) => f.endsWith('.spec.js'));

const user = process.env.PLUGIN_UPDATES_BASIC_AUTH_USER;
const pass = process.env.PLUGIN_UPDATES_BASIC_AUTH_PASSWORD;

module.exports = defineConfig({
  projects: [
    { name: 'kit', testDir: './tests' },
    ...(hasProjectSpecs ? [{ name: 'project', testDir: projectSpecs }] : []),
  ],
  outputDir: path.join(root, 'plugin-updates', process.env.PLUGIN_UPDATES_MONTH || 'artifacts', 'artifacts', 'playwright'),
  reporter: [['list'], ['./reporters/summary.js']],
  // Be gentle with the target site (production runs are read-only but still real traffic).
  workers: 2,
  timeout: 60000,
  retries: 1,
  use: {
    baseURL: process.env.PLUGIN_UPDATES_BASE_URL,
    ignoreHTTPSErrors: process.env.PLUGIN_UPDATES_BASE_URL?.includes('.lndo.site') || false,
    httpCredentials: user && pass ? { username: user, password: pass } : undefined,
    screenshot: 'only-on-failure',
  },
});
