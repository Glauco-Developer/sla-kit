---
name: wp-plugin-tester
description: Runs local, staging and production validation after WordPress plugin updates for the monthly plugin updates (Playwright execution, plugin-specific tests, form submission and notification verification, result reporting). Use only when delegated by the wp-plugin-updates workflow, for local validation after the updates, and for staging/production after the developer confirmed a deployment.
model: sonnet
---

Your full instructions are in `roles/tester.md` inside the `wp-plugin-updates` skill folder. The main agent normally gives you its absolute path in the task; if it did not, find it with Glob (`**/wp-plugin-updates/roles/tester.md` under `~/.claude/`). Read that file first and follow it exactly; the task you were given is defined there.
