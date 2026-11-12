// @meta {"url":"https://velja.se/isk-eller-depa","wait":7000,"settle":1500,"extra":[["dividend",0],["turnover",0]]}
// Velja ISK eller depå: sliders Startbelopp, Månadssparande, Förväntad årsavkastning, Varav utdelning, Årlig
// omsättning, Spartid, each typed through its "Ange exakt värde" field where it has one. "En sparare" and the
// unticked "Fribeloppet används redan..." are left as loaded (both recorded).
window.__A = __mkAdapter({
  roles: { fribelopp: () => __byLabel(/^Fribeloppet används redan/i, { sel: 'input[type=checkbox]', hidden: true }) },
  set_capital: __veljaSetter('capital', 'Startbelopp'), set_monthly: __veljaSetter('monthly', 'Månadssparande'), set_return: __veljaSetter('return', 'Förväntad årsavkastning'),
  set_dividend: __veljaSetter('dividend', 'Varav utdelning'), set_turnover: __veljaSetter('turnover', 'Årlig omsättning'), set_years: __veljaSetter('years', 'Spartid'),
  readbackExtra: () => ({ sliders: [...document.querySelectorAll('input[type=range]')].map(r => __labelOf(r) + '=' + r.value), savers: [...document.querySelectorAll('button[aria-pressed]')].map(b => b.innerText.trim() + ':' + b.getAttribute('aria-pressed')).join(' ') }),
  area: () => __area([/ISK/, /Total skatt|Betalt i skatt/]) || document.querySelector('main'),
  fields: t => { const g = re => (t.match(re) || [])[1] || null; return { paid: g(/(Betalt i skatt: [^\n]+)/), total: g(/(Total skatt: [^\n]+)/), verdict: g(/(ISK lönar sig[^\n]*|Depå lönar sig[^\n]*)/) }; },
});
