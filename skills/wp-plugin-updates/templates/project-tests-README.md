# Project-specific Playwright specs

Put `*.spec.js` files here only when a test belongs to this site alone. The shared kit specs are never edited per project.

Helpers: `const { config, hasPlugin, pluginPages, withPrefixes, warn } = require(process.env.PLUGIN_UPDATES_KIT_DIR + '/tests/lib/site');`
Keep specs read-only on production.
