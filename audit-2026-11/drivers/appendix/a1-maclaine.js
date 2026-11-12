// @meta {"url":"https://maclaine.se/finance/sparande","wait":6000,"settle":1500}
// maclaine.se Sparande: number fields Startkapital, Månadssparande, Förväntad avkastning, Tidshorisont;
// tax-mode buttons ISK / Kapitalvinst / Skattefritt (ISK pressed in prepare).
window.__A = __mkAdapter({
  roles: { capital: () => __byLabel(/^Startkapital/i, { sel: 'input' }), monthly: () => __byLabel(/^Månadssparande/i, { sel: 'input[type=number]' }),
    return: () => __byLabel(/^Förväntad avkastning/i, { sel: 'input[type=number]' }), years: () => __byLabel(/^Tidshorisont/i, { sel: 'input' }) },
  async prep() { const b = __btn(/^ISK$/, 'button'); if (b) { b.click(); await __sleep(400); return 'clicked ISK (' + (b.getAttribute('aria-pressed') || b.className.slice(0, 40)) + ')'; } return 'no ISK button'; },
  area: () => document.querySelector('main') || document.body,
  fields: t => { const g = re => (t.match(re) || [])[1] || null; return { sentence: g(/(Efter \d+ år[^\n]+)/), taxSentence: g(/(ISK-skatten blir[^\n]+)/), heroTax: (document.getElementById('hero-tax') || {}).textContent || null, heroFinal: (document.getElementById('hero-final') || {}).textContent || null }; },
});
