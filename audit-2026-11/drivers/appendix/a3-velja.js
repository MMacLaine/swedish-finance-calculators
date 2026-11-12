// @meta {"url":"https://velja.se/foraldrapenning","wait":7000,"settle":1500}
// Velja föräldrapenning: "Månadslön före skatt" sliders for two parents; parent 1's is typed through its
// exact-value field. Föräldralön unticked, days and percentage left as loaded.
window.__A = __mkAdapter({
  roles: {},
  set_gross: __veljaSetter('gross', 'Månadslön före skatt'),
  readbackExtra: () => ({ sliders: [...document.querySelectorAll('input[type=range]')].map(r => __labelOf(r) + '=' + r.value) }),
  area: () => document.querySelector('main') || document.body,
  fields: t => ({ lines: t.split('\n').filter(l => /dag|per månad|SGI|tak/i.test(l) && /\d/.test(l)).slice(0, 15) }),
});
