// Gravity Forms: render and required-field markup only. Never submits (submissions are agent-run with approval).
const { test, expect } = require('@playwright/test');
const { hasPlugin, pluginPages, warn } = require('../lib/site');

test.skip(!hasPlugin('gravityforms'), 'gravityforms not in test-config.json');

for (const path of pluginPages('gravityforms')) {
  test(`gravityforms renders ${path}`, async ({ page }, info) => {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.gform_wrapper form').first()).toBeAttached();
    await expect(page.locator('.gform_wrapper form input[type="submit"], .gform_wrapper form button[type="submit"]').first()).toBeAttached();
    if (!(await page.locator('.gform_wrapper form').first().isVisible())) warn(info, 'form is in the DOM but not visible (collapsed or conditional)');
    if ((await page.locator('.gform_wrapper .gfield_required').count()) === 0) warn(info, 'no required-field markers on this form');
  });
}
