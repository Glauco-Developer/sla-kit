# Plugin test recipes

Used by `wp-plugin-tester`. Always: use the dedicated SLA Playwright suite (the kit's `playwright/` folder, plus this project's own specs in `SLA/playwright-project/`); never reuse or mix with other suites in the project. Plain page checks can be added there freely; anything bigger needs approval. Always run smoke tests (homepage plus a few representative public pages; HTTP 200, `h1`, non-empty title, no obvious console/asset errors).

Pages come from `SLA/test-config.json` -> `plugins.<slug>.pages`. If missing and the recipe says "ask", return `NEEDS_INPUT` and the main agent saves the answer.

| Plugin | Pages | Tests |
|---|---|---|
| **Gravity Forms** (`gravityforms`) | Saved form page, else ask | Render; required fields; validation errors; field interactions (conditional logic, repeaters); with approval, **staging only**: submit unique test values, verify confirmation, verify notification email. Production: render + required-field checks, **no submit** |
| **Yoast SEO** (`wordpress-seo`) | Auto-discover: homepage, one internal page, one post/CPT (use sitemap `/sitemap_index.xml`, nav links) | Title, meta description, canonical, robots, Open Graph. Pages need not match each other |
| **ACF Pro** (`advanced-custom-fields-pro`) | Ask for pages using ACF fields or blocks | Content renders, blocks display, frontend functions |
| **FacetWP** (`facetwp`) | Ask for the filter page | Filtering, results, pagination, reset |
| **WPML / MultilingualPress** | Ask for translated pages | Language switcher, URLs, navigation, translated content |
| **WooCommerce** | Ask for product pages | Rendering, price, variations, safe staging cart. **Never real payments** |
| **Unknown** | Determine purpose from plugin headers/readme, propose tests, ask for pages | If no coverage: Manual Verification Required |

## Gravity Forms notification check

1. Staging only, after explicit approval to submit.
2. Test values include a unique id, e.g. `SLA-YYYYMMDD-HHMM-<random>`, and a clearly marked test name.
3. Read the notification recipient from `plugins.gravityforms.notification` in config (mailbox URL and recipient). If missing, `NEEDS_INPUT`.
4. Open the mailbox in the browser using an **existing authenticated session** or a flow the developer approves. Never bypass MFA, CAPTCHA, or permissions; never enter passwords found anywhere.
5. Search Inbox for the unique id; if absent, search Spam/Junk. Retry every `retryIntervalSeconds` until `timeoutSeconds`.
6. Verify the email matches the submitted test (id, form name).
7. Result: Inbox -> Passed. Spam/Junk -> Warning (call it out explicitly). Not found after timeout -> Failed. No mailbox access -> Not Verified, ask for manual verification.
8. Never mark delivery Passed from the on-page confirmation alone.

## Basic Auth for the Playwright suite (optional, terminal runs only)

The terminal suite does not share the developer's Chrome session. For staging it needs `SLA_BASIC_AUTH_USER` / `SLA_BASIC_AUTH_PASSWORD` exported by the developer (never asked in chat, never written to files or logs). Without them, staging checks go through the Chrome session. Local and production need none.

## Production restrictions

Production: GET-only public checks. Mark anything state-changing as "staging-only" or Manual Verification Required.

## Local validation

Environment: the local dev site (`wp option get siteurl` via `project.wpCli`). Order: environment checks first, then smoke, then the table above per plugin.

1. `wp plugin list --format=json`: updated plugins at `installedVersion`, active state unchanged from the inventory. Mismatch = Failed.
2. Site, `wp-admin` login page and each updated plugin's admin screen (when it has one) return 200 with no fatal. Check the PHP error / `debug.log` of the dev environment for new errors mentioning the updated plugin paths. New fatal or error = Failed; new deprecation notice = Warning.
3. Smoke tests on representative public pages against the local URL (dev certificates may be self-signed; allow that for local only).
4. Plugin recipes from the table above, using local pages. Gravity Forms: submissions allowed locally without extra approval; verify confirmation and that the entry exists (`wp gf` or the Entries screen); notification delivery is **Not Run** locally. FacetWP: confirm the index status is built, and note `FACETWP-INDEX-ISSUE.md` if present. Inactive plugins are not activated automatically: mark them **Not Run** (inactive) unless the developer approves activating them locally.
5. Local content may be empty or stale. Report a missing page as Not Verified, not Failed.

## Staging authenticated checks (developer's Chrome session)

Only when the developer authorized the *Staging session*. Same recipes as local, adapted:

1. Admin screens: open each updated plugin's admin screen (read only) and check for fatal or critical-error screens and visible admin notices about the update (DB upgrade prompts count as Warning: report, never click).
2. Gravity Forms: submit the approved form with a unique id, verify the confirmation, verify the entry in Entries, then the notification email per *Gravity Forms notification check* using the developer's logged-in webmail tab.
3. Other plugins: ACF fields on edit screens, Post Expirator panel on a post edit screen (do not save the post), FacetWP index status, MultilingualPress switcher, Redirection list. Never save, publish, or delete content.
4. Plugin versions: the admin Plugins screen lists installed versions; compare with `state.json` (this resolves versions marked Not Verified from the public check).

