// @meta {"url":"https://maclaine.se/finance/lonevaxling","wait":6000,"settle":1500}
// maclaine.se Löneväxling: number fields "Bruttolön per månad" (shared) and "Månadsbelopp att växla".
window.__A = __mkAdapter({
  roles: { gross: () => __byLabel(/^Bruttolön per månad/i, { sel: 'input' }), swap: () => __byLabel(/^Månadsbelopp att växla/i, { sel: 'input' }) },
  area: () => document.querySelector('main') || document.body,
  fields: t => ({ pensionLines: t.split('\n').filter(l => /allmän pension|pensionsrätt|tak|Pensionen ändras/i.test(l)).slice(0, 15) }),
});
