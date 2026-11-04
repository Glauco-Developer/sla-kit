// FacetWP: template present, a facet changes the result set (read-only GET filtering).
const { test, expect } = require('@playwright/test');
const { hasPlugin, pluginPages, warn } = require('../lib/site');

test.skip(!hasPlugin('facetwp'), 'facetwp not in test-config.json');

for (const path of pluginPages('facetwp')) {
  test(`facetwp filters ${path}`, async ({ page }, info) => {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('.facetwp-template').first()).toBeVisible();
    const select = page.locator('.facetwp-facet select').first();
    if ((await select.count()) === 0) return warn(info, 'no dropdown facet found, filtering not exercised');
    const values = await select.locator('option').evaluateAll((o) => o.map((x) => x.value).filter(Boolean));
    if (!values.length) return warn(info, 'dropdown facet has no options');
    await select.selectOption(values[0]);
    await expect.poll(() => page.url(), { timeout: 10000 }).toContain('_');
    await expect(page.locator('.facetwp-template').first()).toBeVisible();
  });
}
