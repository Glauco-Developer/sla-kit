// Yoast SEO: title, description, canonical, robots, Open Graph on the configured pages (default: home).
const { test, expect } = require('@playwright/test');
const { hasPlugin, pluginPages, metaContent, warn, withPrefixes } = require('../lib/site');

test.skip(!hasPlugin('wordpress-seo'), 'wordpress-seo not in test-config.json');

for (const path of withPrefixes(pluginPages('wordpress-seo'))) {
  test(`yoast metadata ${path}`, async ({ page }, info) => {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveTitle(/.+/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    expect(await metaContent(page, 'meta[property="og:title"]'), 'og:title').not.toBe('');
    expect(await metaContent(page, 'meta[property="og:url"]'), 'og:url').not.toBe('');
    if (!(await metaContent(page, 'meta[name="description"]'))) warn(info, 'meta description missing');
    if (!(await metaContent(page, 'meta[name="robots"]'))) warn(info, 'robots meta missing');
  });
}
