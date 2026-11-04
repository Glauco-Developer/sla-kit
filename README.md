# wp-plugin-updates

Monthly WordPress plugin updates workflow for Claude Code, packaged as a plugin.
One copy of the workflow, shared by every site. Nothing from this kit is ever copied into a client repository.

## Install (once per person)

Inside Claude Code:

```
/plugin marketplace add Glauco-Developer/wp-plugin-updates
/plugin install wp-plugin-updates@wp-plugin-updates
```

Requires Git, Node and a local environment for the site (the `wp-local-setup` skill can create it).

The first Playwright run needs its dependencies. The agent asks before installing them; you only answer yes.

## Use (any site)

1. Open the site's repository on its base branch (`main`, `master` or `production`) with a clean working tree.
2. Say: **Start the monthly WordPress plugin updates.**

On a site that has never used it, the first run creates the `plugin-updates/` folder (config, reports) in that site and detects hosting, plugin folder and WP-CLI by itself.

## Update

```
/plugin marketplace update wp-plugin-updates
```

Then restart Claude Code. Each run reports the kit version at the start.

## Improve the workflow (maintainers)

Edit the files in this repository, bump the version in `.claude-plugin/plugin.json` and `skills/wp-plugin-updates/VERSION`, commit and push. Everyone gets it on their next update.

To test local changes without pushing:

```bash
claude --plugin-dir /path/to/wp-plugin-updates
```

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

## What lives in each site

Only its own data: `plugin-updates/test-config.json`, `plugin-updates/YYYY-MM/` (state and reports), and optionally `plugin-updates/playwright-project/` for specs that belong to that site alone.

## Remove

```
/plugin uninstall wp-plugin-updates@wp-plugin-updates
```

If you used the old symlink install (`link.sh`), delete the leftover links (the old skill was called `wp-plugin-maintenance`): `~/.claude/skills/wp-plugin-maintenance`, `~/.claude/agents/wp-plugin-updater.md` and `~/.claude/agents/wp-plugin-tester.md`.
