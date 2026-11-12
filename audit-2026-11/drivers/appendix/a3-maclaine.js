// @meta {"url":"https://maclaine.se/finance/foraldrapenning","wait":6000,"settle":1500}
// maclaine.se Föräldrapenning: number field "Bruttolön per månad" (shared); SGI fields and day split left as loaded.
window.__A = __mkAdapter({
  roles: { gross: () => __byLabel(/^Bruttolön per månad/i, { sel: 'input' }), sgiA: () => __byLabel(/^SGI Förälder A/i, { sel: 'input' }) },
  area: () => document.querySelector('main') || document.body,
  fields: t => ({ daily: (document.getElementById('fp-a-daily') || {}).textContent || null, lines: t.split('\n').filter(l => /dag|SGI|tak|per månad/i.test(l) && /\d/.test(l)).slice(0, 15) }),
});
