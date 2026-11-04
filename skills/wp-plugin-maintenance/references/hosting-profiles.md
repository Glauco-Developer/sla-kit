# Hosting profiles

The workflow is identical on every host. Only these things change: where plugins live in the repo, how WP-CLI is run locally, what is platform-managed (protected), and how deploys happen (always done by the developer).

Store the result in `SLA/test-config.json` under `project`. Detection is a suggestion: verify it with a harmless command (for example `wp core version`) and ask the developer only for what fails or cannot be found.

## Repository layouts

Do not assume where plugins live. Common cases:

| Layout | Example plugin path |
|---|---|
| Repo root is `wp-content` (VIP and some WP Engine repos) | `plugins/<slug>/` |
| Repo root is the WordPress site root | `wp-content/plugins/<slug>/` |
| Composer/Bedrock style | `web/app/plugins/<slug>/` (Composer-managed ones need manual handling) |
| Plugins not tracked in Git | Updates would not appear in a diff: stop and ask the developer how deploys work |

A directory is a plugin directory when its subfolders contain a PHP file with a `Plugin Name:` header. Always confirm the result with the developer.

## Detection hints

| Signal | Likely host |
|---|---|
| `client-mu-plugins/`, `vip-config/`, `.devcontainer` from `vip-codespaces`, remote `wpcomvip/*` | `vip` |
| Remote `git.wpengine.com`, `wpengine` in remotes/docs, `wp-content/mu-plugins/wpengine-common` | `wpengine` |
| Anything else (Kinsta, Pantheon, Cloudways, shared hosting, self-hosted...) | `generic` |

## WordPress VIP (`vip`)

- Repo root maps to `wp-content`: plugins in `plugins/`, themes in `themes/`.
- Protected, never touch: `client-mu-plugins/`, `vip-config/`, `mu-plugins/` (platform, gitignored), `object-cache.php`, `db.php`, and plugins listed as "built-in" in `.gitignore` (Jetpack, Akismet, etc.). Custom/in-house plugins have no remote updates: skip as "not updatable".
- Local WP-CLI: `vip dev-env exec --slug <slug> -- wp ...`, Lando (`lando wp ...`), or Codespaces (`wp ...`). The environment must mount **this repo's** `plugins/` directory.
- Plugins are committed to Git, so every update produces a diff in `plugins/<slug>/`.
- Deploy (developer): merge/push to the environment branch (e.g. `develop`/`preprod`/`production`). Staging is typically the pre-production environment.
- Extra directories (`SLA/`) is not mounted by VIP.

## WP Engine (`wpengine`)

- The repo may be the site root or only `wp-content/`. Determine `pluginsDir` (`wp-content/plugins` or `plugins`).
- Protected: `wp-content/mu-plugins/` (WP Engine managed), drop-ins, WP Engine's disallowed-plugin list, and WordPress core (WP Engine manages core updates).
- Local WP-CLI: LocalWP shell, Lando, DDEV, Docker, or `wp` on the host. The environment must use **this repo's** plugin directory (symlink/mount); confirm before updating.
- Deploy (developer): `git push` to the WP Engine environment remote, SFTP, or CI. Remind the developer to purge caches after deploy. If WP Engine Smart Plugin Manager or auto-updates are enabled on the server, tell the developer, since server-side updates can cause version drift.
- WP Engine Git push deploys what is in the repo. Check that `SLA/` is acceptable to deploy, or are excluded by the project's deploy rules. They contain no secrets.
- Staging basic auth is common; the developer's logged-in Chrome session already holds it (no credentials are asked or stored).

## Generic (`generic`)

Works for any host. Discover first, then ask only for what could not be found, **one question at a time**:

1. Plugin directory: look for a folder whose subfolders contain a PHP file with a `Plugin Name:` header.
2. Local WP-CLI: try the order in `roles/updater.md` (Lando, DDEV, Docker, host `wp`).
3. Protected paths: apply the safe defaults (core, themes, MU-plugins, drop-ins, `vendor/`). Do not ask.
4. Staging and production URLs: asked once in Setup, skippable.
5. Deploys are always done by the developer; never ask how, just say that the developer deploys.

## Required fields in `project`

```json
{
  "configured": true,
  "name": "project name",
  "hosting": "vip | wpengine | generic",
  "wordpressRoot": "path to the WordPress root as seen by WP-CLI",
  "pluginsDir": "repo-relative plugin directory",
  "wpCli": "command prefix used for WP-CLI, e.g. 'wp', 'lando wp', 'vip dev-env exec --slug <slug> -- wp'",
  "protectedPlugins": ["slugs never updated"],
  "protectedPaths": ["repo-relative paths never modified"],
  "allowedBaseBranches": ["main", "master", "production"]
}
```

`allowedBaseBranches` must not be widened by the agent; only the developer may edit it deliberately.

## Plugin classes

| Class | Handling |
|---|---|
| wp.org / updater-capable | `wp plugin update <slug>` |
| Premium with license key (for example ACF Pro, Gravity Forms, SearchWP, Relevanssi Premium) | Try the individual WP-CLI update only if the update is listed as available. If the license/updater is missing, mark **Manual Update Required**; do not hack around it |
| Custom / in-house | Not updatable remotely: **Skipped** (no update source) |
| Composer-managed | Manual handling via Composer, report as such |
