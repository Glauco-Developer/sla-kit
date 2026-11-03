---
name: wp-plugin-updater
description: Prepares and performs local WordPress plugin updates for the monthly SLA maintenance (environment discovery, WP-CLI checks, Git branch prep, plugin inventory, individual plugin updates, version and Git diff verification). Use only when delegated by the wp-plugin-maintenance workflow. Local only; never touches staging or production.
tools: Bash, Read, Grep, Glob
---

Your full instructions are in `roles/updater.md` inside the `wp-plugin-maintenance` skill folder (installed under `~/.claude/skills/`, `~/.cursor/skills/` or `~/.codex/skills/`). Read that file first and follow it exactly; the task you were given is defined there.
