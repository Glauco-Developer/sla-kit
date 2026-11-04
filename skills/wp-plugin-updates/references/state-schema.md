# State file: `plugin-updates/YYYY-MM/state.json`

Non-sensitive only. Never store credentials, tokens, cookies, or mailbox contents.

```json
{
  "version": 1,
  "month": "YYYY-MM",
  "project": "<project name>",
  "kitVersion": "<contents of the skill's VERSION file>",
  "hosting": "vip | wpengine | generic (any other host)",
  "baseBranch": "main | master | production",
  "updatesBranch": "plugin-updates/YYYY-MM",
  "phase": "PREPARATION | LOCAL_UPDATES | LOCAL_VALIDATION | AWAITING_STAGING_DEPLOY | STAGING_VALIDATION | AWAITING_PRODUCTION_DEPLOY | PRODUCTION_VALIDATION | COMPLETED | COMPLETED_WITH_WARNINGS | BLOCKED | FAILED",
  "blockedReason": null,
  "startedAt": "ISO-8601",
  "updatedAt": "ISO-8601",
  "approvedPlan": { "update": [], "skip": [], "manual": [] },
  "plugins": [
    {
      "slug": "",
      "name": "",
      "previousVersion": "",
      "targetVersion": "",
      "installedVersion": "",
      "status": "Updated | Skipped | Failed | Manual Update Required | Already Up to Date | Pending",
      "notes": ""
    }
  ],
  "local": { "status": "Not Run | Passed | Failed | Warning | Not Verified", "validatedAt": null, "results": [] },
  "staging": { "status": "Not Run | Passed | Failed | Warning | Not Verified", "deployConfirmedAt": null, "results": [] },
  "production": { "status": "Not Run | Passed | Failed | Warning | Not Verified", "deployConfirmedAt": null, "results": [] },
  "notifications": [],
  "outstandingActions": []
}
```

`results` entries (same shape for `local`, `staging` and `production`, with `environment` set to `local`, `staging` or `production`): `{ "test": "", "environment": "", "url": "", "status": "Passed|Failed|Warning|Not Run|Not Verified|Manual Verification Required", "notes": "" }`.

Rules:
- Write after each phase change and each plugin result.
- On resume, a plugin with status other than `Pending` is **never** updated again; a form submission recorded in `staging.results` is **never** repeated without fresh approval.
- Resume consistency checks: current branch equals `updatesBranch` (or `baseBranch` if the updates branch was merged), `installedVersion` matches the version on disk, `phase` is compatible with the report.
