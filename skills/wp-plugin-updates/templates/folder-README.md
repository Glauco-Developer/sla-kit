# Plugin updates

Monthly WordPress plugin maintenance data for this project. The workflow itself lives in the shared `wp-plugin-updates` (installed as a Claude Code plugin on each developer's machine), not in this repository.

- `test-config.json`: project profile, URLs, plugin test pages.
- `YYYY-MM/`: state and reports for each month (the maintenance history).
- `playwright-project/`: optional specs that belong only to this site.

This folder is committed with the site, so the history lives in Git. Test output (`artifacts/`), `local.env` and `node_modules` are ignored by its own `.gitignore`. It contains no secrets.

To run it: open the project and say "Start the monthly WordPress plugin updates".
