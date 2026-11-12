// @meta {"url":"https://smartly.se/tools/parental-leave","wait":7000,"settle":1500}
// Smartly parental leave (English UI): number field "Parent 1" (monthly salary); the rest left as loaded.
window.__A = __mkAdapter({
  roles: { gross: () => __byLabel(/^Parent 1$/i, { sel: 'input[type=number]' }) },
  area: () => document.querySelector('main') || document.body,
  fields: t => ({ lines: t.split('\n').filter(l => /day|SGI|ceiling|SEK/i.test(l) && /\d/.test(l)).slice(0, 20) }),
});
