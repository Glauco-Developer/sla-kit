---
name: wp-plugin-updater
description: Prepares and performs local WordPress plugin updates for the monthly plugin updates (environment discovery, WP-CLI checks, Git branch prep, plugin inventory, individual plugin updates, version and Git diff verification). Use only when delegated by the wp-plugin-updates workflow. Local only; never touches staging or production.
tools: Bash, Read, Grep, Glob
---

Your full instructions are in `roles/updater.md` inside the `wp-plugin-updates` skill folder. The main agent normally gives you its absolute path in the task; if it did not, find it with Glob (`**/wp-plugin-updates/roles/updater.md` under `~/.claude/`). Read that file first and follow it exactly; the task you were given is defined there.
