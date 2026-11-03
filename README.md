# sla-kit

Monthly WordPress plugin maintenance (SLA) workflow for Claude Code, Cursor and Codex.
One copy of the workflow, shared by every site. Nothing from this kit is ever copied into a client repository.

## Install (once per person)

```bash
git clone <URL-OF-THIS-REPO> ~/sla-kit
~/sla-kit/link.sh
```

`link.sh` only creates symlinks from your Claude Code / Cursor / Codex folders to `~/sla-kit`. Tools you do not have are skipped. Requires macOS or Linux (on Windows use WSL).

Optional, only when running the Playwright tests for the first time (the agent asks before doing it):

```bash
cd ~/sla-kit/skills/wp-plugin-maintenance/playwright && npm install && npx playwright install chromium
```

## Use (any site)

1. Open the site's repository on its base branch (`main`, `master` or `production`) with a clean working tree.
2. Say: **Start the monthly SLA plugin maintenance.**

On a site that has never used it, the first run creates the `SLA/` folder (config, reports) in that site and detects hosting, plugin folder and WP-CLI by itself.

## Update

Nothing to do. At the start of every run the skill runs `git pull` on the kit and tells you the version. To do it manually: `git -C ~/sla-kit pull`.

## Improve the workflow

Edit the files in `~/sla-kit/skills/wp-plugin-maintenance/`, commit and push. Everyone gets it on their next run.

```
skills/wp-plugin-maintenance/
  SKILL.md        the workflow (phases, rules)
  roles/          instructions for the two roles: updater and tester
  references/     hosting profiles, plugin test recipes, report and state formats
  playwright/     shared test suite (needs SLA_PROJECT_DIR = project root)
  templates/      files created in a new site's SLA/ folder
claude-agents/    thin Claude Code / Cursor subagent files that point to roles/
link.sh           connects the kit to the tools on this machine
```

## What lives in each site

Only its own data: `SLA/test-config.json`, `SLA/YYYY-MM/` (state and reports), and optionally `SLA/playwright-project/` for specs that belong to that site alone.

## Remove

`~/sla-kit/link.sh --uninstall` removes the links. For a site that still has the old per-project kit (`.claude/`, `.cursor/`), run its old `./install-sla-kit.sh --uninstall`; it keeps `SLA/`.
