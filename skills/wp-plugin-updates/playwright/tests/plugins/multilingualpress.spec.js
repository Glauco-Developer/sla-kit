// MultilingualPress: hreflang alternates exist and are reciprocal. Needs testing.languages in test-config.json.
// Reciprocity is checked with plain HTTP requests (no browser navigation), so it stays fast and gentle on the site.
const { test, expect } = require('@playwright/test');
const { hasPlugin, pluginPages, testing } = require('../lib/site');

test.skip(!hasPlugin('multilingualpress') || !(testing.languages || []).length, 'multilingualpress or testing.languages not configured');

const alternatesIn = (html) =>
  [...html.matchAll(/<link[^>]+rel=["']alternate["'][^>]*>/g)]
    .map((m) => ({ lang: (m[0].match(/hreflang=["']([^"']+)/) || [])[1], href: (m[0].match(/href=["']([^"']+)/) || [])[1] }))
    .filter((a) => a.lang && a.href && a.lang !== 'x-default');

for (const path of pluginPages('multilingualpress')) {
  test(`mlp hreflang ${path}`, async ({ request }) => {
    const res = await request.get(path);
    const alternates = alternatesIn(await res.text());
    expect(alternates.length, 'alternates').toBeGreaterThanOrEqual(2);
    const self = new URL(path, res.url()).href;
    for (const alt of alternates.filter((a) => a.href !== self)) {
      const back = alternatesIn(await (await request.get(alt.href)).text()).map((a) => a.href);
      expect(back, `${alt.href} links back to ${self}`).toContain(self);
    }
  });
}
