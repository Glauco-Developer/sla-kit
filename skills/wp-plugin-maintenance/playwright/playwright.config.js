// Dedicated to the SLA plugin maintenance. Not related to any other test suite in the repository.
// Usage: SLA_BASE_URL=<url> SLA_MONTH=YYYY-MM npx playwright test
// Optional Basic Auth (terminal runs only): SLA_BASIC_AUTH_USER / SLA_BASIC_AUTH_PASSWORD from the environment.
const { defineConfig } = require('@playwright/test');

const fs = require('fs');
const path = require('path');
const root = process.env.SLA_PROJECT_DIR;
if (!root) throw new Error('SLA_PROJECT_DIR is not set (path of the WordPress project root)');
process.env.SLA_KIT_DIR = __dirname; // lets project specs require the kit helpers
const projectSpecs = path.join(root, 'SLA', 'playwright-project');
const hasProjectSpecs = fs.existsSync(projectSpecs) && fs.readdirSync(projectSpecs).some((f) => f.endsWith('.spec.js'));

const user = process.env.SLA_BASIC_AUTH_USER;
const pass = process.env.SLA_BASIC_AUTH_PASSWORD;

module.exports = defineConfig({
  projects: [
    { name: 'kit', testDir: './tests' },
    ...(hasProjectSpecs ? [{ name: 'project', testDir: projectSpecs }] : []),
  ],
  outputDir: path.join(root, 'SLA', process.env.SLA_MONTH || 'artifacts', 'artifacts', 'playwright'),
  reporter: [['list'], ['./reporters/sla-summary.js']],
  // Be gentle with the target site (production runs are read-only but still real traffic).
  workers: 2,
  timeout: 60000,
  retries: 1,
  use: {
    baseURL: process.env.SLA_BASE_URL,
    ignoreHTTPSErrors: process.env.SLA_BASE_URL?.includes('.lndo.site') || false,
    httpCredentials: user && pass ? { username: user, password: pass } : undefined,
    screenshot: 'only-on-failure',
  },
});
