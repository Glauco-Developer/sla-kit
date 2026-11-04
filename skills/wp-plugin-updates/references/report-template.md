# Report template: `plugin-updates/YYYY-MM/plugin-updates-full.md`

Professional English. If the file already exists (for example a second run in the same month), **append** a new `## Maintenance Run N` section and keep earlier runs intact. Never delete history. Never include secrets.

The stakeholder summary is a separate file, `plugin-updates/YYYY-MM/plugin-updates-summary.md` (see the end of this template).

```markdown
# Plugin Updates - YYYY-MM

## Maintenance Run 1

### Project Information

| Field | Value |
|---|---|
| Project | |
| Maintenance month | YYYY-MM |
| Hosting | |
| Base branch | |
| updates branch | plugin-updates/YYYY-MM |
| Execution date | YYYY-MM-DD |
| Current workflow state | |

### Plugin Updates

| Plugin | Previous Version | Target Version | Installed Version | Status | Notes |
|---|---|---|---|---|---|

Statuses: Updated, Skipped, Failed, Manual Update Required, Already Up to Date.
Version columns are never `-`: always fill the installed version (WP-CLI or the `Version:` header); the target is a number or `unknown` (with the vendor named in Notes). Manual Update Required applies only to premium/licensed plugins; in-house plugins are Skipped.

### Manual Actions Required

- None / list

### Local Validation

| Test | URL | Result | Notes |
|---|---|---|---|

Local email delivery is Not Run (verified on staging).

### Staging Validation

| Test | URL | Result | Notes |
|---|---|---|---|

Results: Passed, Failed, Warning, Not Run, Not Verified, Manual Verification Required.

### Gravity Forms Notification Delivery

| Form | Test identifier | Result | Notes |
|---|---|---|---|

Results: Delivered to Inbox (Passed), Delivered to Spam/Junk (Warning), Not Found After Timeout (Failed), Mailbox Access Unavailable (Not Verified).

### Production Validation

| Test | URL | Result | Notes |
|---|---|---|---|

### Outstanding Issues

- None / list

### Final Maintenance Status

- Status: COMPLETED | COMPLETED_WITH_WARNINGS | BLOCKED | FAILED
- Completed: YYYY-MM-DD HH:MM (timezone)
```

Fill sections as phases complete; leave unreached sections as `Not Run`.
## Stakeholder summary: `plugin-updates/YYYY-MM/plugin-updates-summary.md`

Generated at Finish. Written for non-technical readers (clients, project managers). One page at most. No command output, logs, file paths or secrets. Same template for every run:

```markdown
# Plugin Maintenance Summary - YYYY-MM

**Site:** <project name>
**Result:** Completed | Completed with warnings | Blocked | Failed
**Completed:** YYYY-MM-DD

## Updated plugins

| Plugin | Previous version | New version |
|---|---|---|
| <Name> | <old> | <new> |

## Needs attention

- <Plain-language item: a plugin that must be updated manually, a check that could not be verified, an open issue>
- None

## Validation

| Environment | Outcome |
|---|---|
| Local | Passed / Passed with warnings / Not run |
| Staging | Passed / Passed with warnings / Not run |
| Production | Passed / Passed with warnings / Not run |

<One or two sentences: overall assessment and any recommended follow-up.>
```
