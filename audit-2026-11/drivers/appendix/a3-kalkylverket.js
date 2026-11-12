// @meta {"url":"https://kalkylverket.se/kalkylatorer/privatekonomi/lon-och-inkomst/foraldrapenning-kalkylator","wait":7000,"settle":1500}
// Kalkylverket föräldrapenning: text field "Månadslön före skatt (kr)"; days and part-of-day left as loaded.
window.__A = __mkAdapter({
  roles: { gross: () => __byLabel(/^Månadslön före skatt/i, { sel: 'input' }) },
  area: () => __up(__byLabel(/^Månadslön före skatt/i, { sel: 'input' }), [/FÖRÄLDRAPENNING PER MÅNAD/], 9000) || __area([/FÖRÄLDRAPENNING PER MÅNAD/]),
  fields: t => ({ lines: t.split('\n').filter(l => /dag|månad|SGI|tak/i.test(l) && /\d/.test(l)).slice(0, 15) }),
});
