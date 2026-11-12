// @meta {"url":"https://boio.se/kalkylator/bolan","wait":7000,"settle":1500,"loanAs":"depositPct"}
// Boio bolån: range sliders only: "Bostadens pris", "Kontantinsats" (percent), "Bolåneränta",
// "Månadsavgift / drift". No text fields, so values are set like a drag and the slider's step decides what sticks.
window.__A = __mkAdapter({
  roles: { price: () => __byLabel(/^Bostadens pris/i, { sel: 'input' }), depositPct: () => __byLabel(/^Kontantinsats/i, { sel: 'input' }) },
  set_price(v) { const r = this._need('price'); if (r) return r; return __slide(__marked('price'), v); },
  set_depositPct(v) { const r = this._need('depositPct'); if (r) return r; return __slide(__marked('depositPct'), v); },
  area: () => __up(__byLabel(/^Bostadens pris/i, { sel: 'input' }), [/Kontantinsats \(/, /mortering|Lån/], 8000) || document.querySelector('main'),
  fields: t => ({ amortLines: t.split('\n').filter(l => /mortering|Lånebelopp|Belåningsgrad|Kontantinsats \(/i.test(l)).slice(0, 12) }),
});
