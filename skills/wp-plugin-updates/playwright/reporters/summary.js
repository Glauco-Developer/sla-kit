// Writes a compact summary the agent reads instead of the full log: plugin-updates/<month>/artifacts/playwright-summary.json.
// Labels follow the workflow: Passed, Failed, Warning, Not Run.
const fs = require('fs');
const path = require('path');

class Summary {
  constructor() { this.results = []; }
  onTestEnd(test, result) {
    const warnings = test.annotations.filter((a) => a.type === 'warning').map((a) => a.description);
    let status = { passed: 'Passed', skipped: 'Not Run' }[result.status] || 'Failed';
    let notes = result.status === 'passed' || result.status === 'skipped' ? '' : (result.error?.message || '').split('\n')[0];
    if (status === 'Passed' && warnings.length) { status = 'Warning'; notes = warnings.join('; '); }
    this.results.push({ test: test.titlePath().slice(1).join(' > '), status, notes });
  }
  onEnd() {
    const count = (s) => this.results.filter((r) => r.status === s).length;
    const month = process.env.PLUGIN_UPDATES_MONTH || 'artifacts';
    const out = path.join(process.env.PLUGIN_UPDATES_PROJECT_DIR, 'plugin-updates', month, 'artifacts', 'playwright-summary.json');
    const summary = {
      baseUrl: process.env.PLUGIN_UPDATES_BASE_URL,
      totals: { Passed: count('Passed'), Warning: count('Warning'), Failed: count('Failed'), 'Not Run': count('Not Run') },
      results: this.results.filter((r) => r.status !== 'Passed'),
    };
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, JSON.stringify(summary, null, 2));
    console.log(`Summary: ${JSON.stringify(summary.totals)} -> ${out}`);
  }
}
module.exports = Summary;
