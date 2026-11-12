// @meta {"url":"https://velja.se/bolanekalkyl","wait":7000,"settle":1500,"loanAs":"depositPct"}
// Velja bolånekalkyl: "Pris" slider with an exact-value field; "Kontantinsats i procent" is a percent slider
// with no text field (set like a drag, snapped to its step). Other sliders left as loaded.
window.__A = __mkAdapter({
  roles: { depositPct: () => __byLabel(/^Kontantinsats i procent/i, { sel: 'input[type=range]' }) },
  set_price: __veljaSetter('price', 'Pris'),
  set_depositPct(v) { const r = this._need('depositPct'); if (r) return r; return __slide(__marked('depositPct'), v); },
  readbackExtra: () => ({ sliders: [...document.querySelectorAll('input[type=range]')].map(r => __labelOf(r) + '=' + r.value) }),
  area: () => __area([/Månadskostnad/, /Amortering/]) || document.querySelector('main'),
  fields: t => ({ lines: t.split('\n').filter(l => /Amortering|Lånebelopp|Belåningsgrad|Kontantinsats|bolånetak|90 ?%/i.test(l)).slice(0, 15) }),
});
