// Shared helpers. Everything project-specific comes from plugin-updates/test-config.json, never from the tests.
const path = require('path');
const projectDir = process.env.PLUGIN_UPDATES_PROJECT_DIR;
if (!projectDir) throw new Error('PLUGIN_UPDATES_PROJECT_DIR is not set (path of the WordPress project root)');
const config = require(path.join(projectDir, 'plugin-updates', 'test-config.json'));

const testing = config.testing || {};
const plugins = config.plugins || {};

// '' is the main site; other entries are language/site path prefixes such as '/ga'.
const prefixes = ['', ...(testing.languages || [])];

const hasPlugin = (slug) => Object.prototype.hasOwnProperty.call(plugins, slug);

// Pages configured for a plugin, or the fallback when none are set.
const pluginPages = (slug, fallback = ['/']) => (plugins[slug] && plugins[slug].pages) || fallback;

// Every path crossed with every language prefix ('/about/' -> '/about/', '/ga/about/').
const withPrefixes = (paths) => paths.flatMap((p) => prefixes.map((x) => x + p));

const allPluginPages = () => Object.values(plugins).flatMap((p) => p.pages || []);

// Returns '' when the tag is absent (no waiting for it to appear).
const metaContent = (page, selector) => page.evaluate((s) => (document.querySelector(s) || {}).content || '', selector);

// Soft findings: reported as Warning in the summary, never fail the run.
const warn = (info, message) => info.annotations.push({ type: 'warning', description: message });

module.exports = { config, testing, prefixes, hasPlugin, pluginPages, withPrefixes, allPluginPages, metaContent, warn };
