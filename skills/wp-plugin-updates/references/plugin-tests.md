# Plugin test recipes

Used by `wp-plugin-tester`. Always: use the dedicated Playwright suite (the kit's `playwright/` folder, plus this project's own specs in `plugin-updates/playwright-project/`); never reuse or mix with other suites in the project. Plain page checks can be added there freely; anything bigger needs approval. Always run smoke tests (homepage plus a few representative public pages; HTTP 200, `h1`, non-empty title, no obvious console/asset errors).

Pages come from `plugin-updates/test-config.json` -> `plugins.<slug>.pages`. If missing and the recipe says "ask", return `NEEDS_INPUT` and the main agent saves the answer.

| Plugin | Pages | Tests |
|---|---|---|
| **Form plugins** (see *Form plugins* below) | Saved form page, else auto-discover, else ask | Render; required fields; validation errors; field interactions (conditional logic, repeaters); with approval, **staging only**: submit unique test values, verify confirmation, verify the entry, verify the notification. Production: render + required-field checks, **no submit** |
| **Yoast SEO** (`wordpress-seo`) | Auto-discover: homepage, one internal page, one post/CPT (use sitemap `/sitemap_index.xml`, nav links) | Title, meta description, canonical, robots, Open Graph. Pages need not match each other |
| **ACF Pro** (`advanced-custom-fields-pro`) | Ask for pages using ACF fields or blocks | Content renders, blocks display, frontend functions |
| **FacetWP** (`facetwp`) | Ask for the filter page | Filtering, results, pagination, reset |
| **WPML / MultilingualPress** | Ask for translated pages | Language switcher, URLs, navigation, translated content |
| **WooCommerce** | Ask for product pages | Rendering, price, variations, safe staging cart. **Never real payments** |
| **Unknown** | Determine purpose from plugin headers/readme, propose tests, ask for pages | If no coverage: Manual Verification Required |

## Form plugins

Do not assume Gravity Forms. Find out which form plugin(s) the site uses: any **active** plugin in this table (from `wp plugin list`), plus any form markup found on public pages.

| Plugin | Slug | Form container | Where submissions are recorded |
|---|---|---|---|
| Gravity Forms | `gravityforms` | `.gform_wrapper form` | Entries (entry notes record the notification result) |
| Contact Form 7 | `contact-form-7` | `form.wpcf7-form` | Not stored by default (the Flamingo plugin stores messages) |
| WPForms / WPForms Lite | `wpforms`, `wpforms-lite` | `.wpforms-container form` | Entries (Pro) |
| Ninja Forms | `ninja-forms` | `.nf-form-cont` | Submissions |
| Fluent Forms | `fluentform` | `form.frm-fluent-form` | Entries |
| Formidable Forms | `formidable` | `.frm_forms form` | Entries |
| Forminator | `forminator` | `.forminator-ui` | Submissions |

Rules:

1. **Test every form plugin that was updated.** An active form plugin that was not updated this month is only mentioned.
2. **Form pages:** use `plugins.<slug>.pages` from the config. If missing, auto-discover by scanning the homepage, the main navigation and the sitemap for the containers above, then ask one question: *Use <page> (Recommended)* / *Choose another page* / *Skip*. Save the answer.
3. Render and required-field checks come from the Playwright suite (`tests/plugins/forms.spec.js`). Plugins not in the table fall under *Unknown* below.
4. Submissions follow the same approval rules for every form plugin (local without extra approval, staging with approval, production only through the opt-in test).

## Form notification check

1. Staging only, after explicit approval to submit.
2. Test values include a unique id, e.g. `WPU-YYYYMMDD-HHMM-<random>`, and a clearly marked test name.
3. **Default evidence, without opening any mailbox:** after the submission, open the entry or submission screen of the form plugin. Gravity Forms records the notification result in the entry notes (`Notification was sent successfully` = Passed, labelled *dispatch confirmed, delivery to the inbox not checked*; an error note = Failed). For other plugins, use their entry/submission screen or email log when it shows the notification result. When the plugin records nothing, the result is **Not Verified** (dispatch not confirmed).
4. **Mailbox check (only when the developer asks, preferably a dedicated test mailbox):** read the recipient and mailbox from `plugins.<slug>.notification` in config (mailbox URL and recipient). If missing, `NEEDS_INPUT`. Open the mailbox using an **existing authenticated session** or a flow the developer approves. Never bypass MFA, CAPTCHA, or permissions; never enter passwords found anywhere.
5. Search Inbox for the unique id; if absent, search Spam/Junk. Retry every `retryIntervalSeconds` until `timeoutSeconds`. Verify the email matches the submitted test (id, form name).
6. Result: Inbox -> Passed. Spam/Junk -> Warning (call it out explicitly). Not found after timeout -> Failed. No mailbox access -> Not Verified, ask for manual verification.
7. Never mark delivery Passed from the on-page confirmation alone.

## Basic Auth for the Playwright suite (optional, terminal runs only)

The terminal suite does not share the developer's Chrome session. For staging it needs `PLUGIN_UPDATES_BASIC_AUTH_USER` / `PLUGIN_UPDATES_BASIC_AUTH_PASSWORD` exported by the developer (never asked in chat, never written to files or logs). Without them, staging checks go through the Chrome session. Local and production need none.

## Production restrictions

Production: GET-only public checks. Mark anything state-changing as "staging-only" or Manual Verification Required.

## Local validation

Environment: the local dev site (`wp option get siteurl` via `project.wpCli`). Order: environment checks first, then smoke, then the table above per plugin.

1. `wp plugin list --format=json`: updated plugins at `installedVersion`, active state unchanged from the inventory. Mismatch = Failed.
2. Site, `wp-admin` login page and each updated plugin's admin screen (when it has one) return 200 with no fatal. Check the PHP error / `debug.log` of the dev environment for new errors mentioning the updated plugin paths. New fatal or error = Failed; new deprecation notice = Warning.
3. Smoke tests on representative public pages against the local URL (dev certificates may be self-signed; allow that for local only).
4. Plugin recipes from the table above, using local pages. Form plugins: submissions allowed locally without extra approval; verify confirmation and that the entry exists (the plugin's Entries/Submissions screen, or `wp gf` for Gravity Forms); notification delivery is **Not Run** locally. FacetWP: confirm the index status is built, and note `FACETWP-INDEX-ISSUE.md` if present. Inactive plugins are not activated automatically: mark them **Not Run** (inactive) unless the developer approves activating them locally.
5. Local content may be empty or stale. Report a missing page as Not Verified, not Failed.

## Staging authenticated checks (developer's Chrome session)

Only when the developer authorized the *Staging session*. Same recipes as local, adapted:

1. Admin screens: open each updated plugin's admin screen (read only) and check for fatal or critical-error screens and visible admin notices about the update (DB upgrade prompts count as Warning: report, never click).
2. Form plugins: submit the approved form with a unique id, verify the confirmation, verify the entry in the plugin's Entries/Submissions screen, then the notification per *Form notification check* (webmail tab only when the developer asks).
3. Other plugins: ACF fields on edit screens, Post Expirator panel on a post edit screen (do not save the post), FacetWP index status, MultilingualPress switcher, Redirection list. Never save, publish, or delete content.
4. Plugin versions: the admin Plugins screen lists installed versions; compare with `state.json` (this resolves versions marked Not Verified from the public check).

