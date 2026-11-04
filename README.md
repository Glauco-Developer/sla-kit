# wp-plugin-updates

**Monthly WordPress plugin updates, done safely, tested properly and reported automatically, by an AI agent that never touches production.**

A plugin for [Claude Code](https://claude.com/claude-code). You say one sentence. The agent updates your plugins one by one on a local copy of the site, tests them, hands you a clean commit, validates staging and production after *you* deploy, and writes the report your client or manager wants to read.

> "Start the monthly WordPress plugin updates."

---

## Why

Plugin updates are the most repetitive, most important and most boring job in WordPress maintenance. Done by hand it means: check what is outdated, update, click through the site, hope nothing broke, deploy, click through staging, deploy, click through production, write it all down. Every month, for every site.

Done carelessly (`wp plugin update --all` straight on production) it means a broken checkout on a Friday.

This plugin gives you the careful version, without the hours.

## What you get

- **Updates one plugin at a time**, locally, with the exact versions recorded. Never `--all`, never force flags.
- **Tests before anything ships.** A dedicated Playwright suite plus per-plugin checks (forms, search and filters, SEO metadata, language switching, PHP errors in the debug log).
- **Gravity Forms notification checks**: it verifies the notification email, including Spam/Junk placement, when a mailbox session is available, and marks it Manual Verification Required when not.
- **A clean commit** that lists only the updated plugins and their versions.
- **Staging and production validation** after you deploy. Production is read-only by default.
- **Two reports**: a full technical report and a one-page summary for stakeholders.
- **Resumable.** Close the laptop mid-run, come back tomorrow, say "resume plugin updates" and it continues exactly where it stopped, without repeating any update.
- **Works with any host.** WordPress VIP and WP Engine have built-in profiles. Everything else (Kinsta, Pantheon, Cloudways, shared hosting, self-hosted) is detected from your repository and local setup.

## How it works

```
 1. PREPARE      Checks you are on the base branch with a clean tree,
                 creates the branch plugin-updates/YYYY-MM
 2. INVENTORY    Lists every plugin: current version, available version, status.
                 Core, themes, MU-plugins and protected plugins are never touched
 3. UPDATE       Updates each plugin individually and verifies the version
                 and the Git diff after every step
 4. TEST LOCAL   Playwright suite + plugin-specific checks on your local site
 5. COMMIT       One commit, only the updated plugins. You approve it. Pushes the branch
                 (plain push, never force). No PR, no merge
 6. STAGING      YOU deploy. The agent verifies the deployment landed,
                 then tests staging (using your own logged-in Chrome session)
 7. PRODUCTION   YOU deploy. The agent runs read-only checks and,
                 only if you say yes, an optional form submission test
 8. REPORT       Full report + stakeholder summary
```

Every phase saves its state to disk, so an interruption never costs you work.

## Safety first

This agent is deliberately limited. It will **never**:

- deploy, merge, force-push, reset or rebase,
- update WordPress core, themes, MU-plugins, drop-ins or protected plugins,
- run updates or WP-CLI against staging or production,
- ask for, type, store or print passwords, tokens or cookies,
- claim a test passed without actually running it.

Results use a fixed vocabulary (Passed, Failed, Warning, Not Run, Not Verified, Manual Verification Required), so a report never hides what was not checked. Premium plugins without a license, custom plugins and Composer-managed plugins are listed for manual handling instead of being forced.

## What the reports look like

| Report | For | Contents |
|---|---|---|
| `plugin-updates-full.md` | You and your team | Every phase, every plugin, test results per environment, notes, outstanding issues |
| `plugin-updates-summary.md` | Clients and managers | Result, updated plugins (previous to new version), what needs attention, validation outcome per environment. Plain language, one page |

## Install

Inside Claude Code:

```
/plugin marketplace add Glauco-Developer/wp-plugin-updates
/plugin install wp-plugin-updates@wp-plugin-updates
```

Requirements: Git, Node.js, and a local environment for the site (Lando, DDEV, Docker, LocalWP or similar). The first time you run the tests, the agent asks before installing the Playwright dependencies; you only answer yes.

## Use

1. Open the site's repository on its base branch (`main`, `master` or `production`) with a clean working tree.
2. Say: **Start the monthly WordPress plugin updates.**

On a site that has never used it, the first run does a one-time setup: it detects the hosting, plugin folder and WP-CLI command by itself, then asks for the staging and production URLs once (you can skip either). Everything lives in a `plugin-updates/` folder inside that site. Nothing from this plugin is ever copied into your repository.

## Update

```
/plugin marketplace update wp-plugin-updates
```

Restart Claude Code afterwards. Each run reports the version in use.

## What lives in each site

Only the site's own data: `plugin-updates/test-config.json`, `plugin-updates/YYYY-MM/` (state and reports), and optionally `plugin-updates/playwright-project/` for tests that belong to that site alone.

## For maintainers

```
.claude-plugin/
  plugin.json       plugin manifest (name, version)
  marketplace.json  makes this repository installable as a marketplace
skills/wp-plugin-updates/
  SKILL.md          the workflow (phases, rules)
  roles/            instructions for the two roles: updater and tester
  references/       hosting profiles, plugin test recipes, report and state formats
  playwright/       shared test suite (needs PLUGIN_UPDATES_PROJECT_DIR = project root)
  templates/        files created in a new site's plugin-updates/ folder
agents/             thin subagent files that point to roles/
```

Edit the files, bump the version in `.claude-plugin/plugin.json` and `skills/wp-plugin-updates/VERSION`, commit and push. To try local changes without pushing:

```bash
claude --plugin-dir /path/to/wp-plugin-updates
```

Contributions are welcome: new hosting profiles, new per-plugin test recipes and bug reports.

## Remove

```
/plugin uninstall wp-plugin-updates@wp-plugin-updates
```

## License

[MIT](LICENSE)
