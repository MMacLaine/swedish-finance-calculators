// @meta {"url":"https://velja.se/lonevaxling","wait":7000,"settle":1500}
// Velja löneväxling: sliders "Bruttolön per månad" and "Löneväxlingsbelopp/mån", typed through their
// exact-value fields. Kommun, matching and pension sliders left as loaded.
window.__A = __mkAdapter({
  roles: {},
  set_gross: __veljaSetter('gross', 'Bruttolön per månad'), set_swap: __veljaSetter('swap', 'Löneväxlingsbelopp'),
  readbackExtra: () => ({ sliders: [...document.querySelectorAll('input[type=range]')].map(r => __labelOf(r) + '=' + r.value) }),
  area: () => document.querySelector('main') || document.body,
  fields: t => ({ pensionLines: t.split('\n').filter(l => /allmän pension|pensionsrätt|tak/i.test(l)).slice(0, 15) }),
});
