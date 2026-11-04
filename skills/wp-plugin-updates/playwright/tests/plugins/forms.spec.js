// Form plugins: render and required-field markup only. Never submits (submissions are agent-run with approval).
// Any plugin listed in test-config.json under plugins.<slug> that is also in FORM_PLUGINS gets these checks.
const { test, expect } = require('@playwright/test');
const { hasPlugin, pluginPages, warn } = require('../lib/site');

// slug -> selectors. `wrapper` is the plugin's form container, `required` its required-field marker.
const FORM_PLUGINS = {
  gravityforms: { wrapper: '.gform_wrapper form', required: '.gform_wrapper .gfield_required' },
  'contact-form-7': { wrapper: 'form.wpcf7-form', required: '.wpcf7-validates-as-required' },
  wpforms: { wrapper: '.wpforms-container form', required: '.wpforms-required-label' },
  'wpforms-lite': { wrapper: '.wpforms-container form', required: '.wpforms-required-label' },
  'ninja-forms': { wrapper: '.nf-form-cont', required: '.ninja-forms-req-symbol' },
  fluentform: { wrapper: 'form.frm-fluent-form', required: '.ff-el-is-required' },
  formidable: { wrapper: '.frm_forms form', required: '.frm_required' },
  forminator: { wrapper: 'form.forminator-custom-form, .forminator-ui', required: '.forminator-required' },
};

const SUBMIT = 'input[type="submit"], button[type="submit"], button, input[type="button"]';

for (const [slug, sel] of Object.entries(FORM_PLUGINS)) {
  if (!hasPlugin(slug)) continue;
  for (const path of pluginPages(slug)) {
    test(`${slug} renders ${path}`, async ({ page }, info) => {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      const wrapper = page.locator(sel.wrapper).first();
      if ((await wrapper.count()) === 0) {
        // Plugin markup may differ between versions: fall back to any form so a selector change is a Warning, not a false Failed.
        warn(info, `${slug}: expected form container (${sel.wrapper}) not found, falling back to any <form>`);
        await expect(page.locator('form').first()).toBeAttached();
        return;
      }
      await expect(wrapper).toBeAttached();
      await expect(page.locator(SUBMIT).first()).toBeAttached();
      if (!(await wrapper.isVisible())) warn(info, 'form is in the DOM but not visible (collapsed or conditional)');
      if ((await page.locator(sel.required).count()) === 0) warn(info, 'no required-field markers on this form');
    });
  }
}
