// @meta {"url":"https://kalkylverket.se/kalkylatorer/privatekonomi/lon-och-inkomst/lonevaxlingskalkylator","wait":7000,"settle":1500}
// Kalkylverket löneväxling: text fields "Månadslön före växling" and "Belopp att växla per månad".
window.__A = __mkAdapter({
  roles: { gross: () => __byLabel(/^Månadslön före växling/i, { sel: 'input' }), swap: () => __byLabel(/^Belopp att växla/i, { sel: 'input' }) },
  area: () => document.querySelector('main') || document.body,
  fields: t => ({ pensionLines: t.split('\n').filter(l => /allmän pension|pensionsrätt|tak|pension/i.test(l) && /\d/.test(l)).slice(0, 15) }),
});
