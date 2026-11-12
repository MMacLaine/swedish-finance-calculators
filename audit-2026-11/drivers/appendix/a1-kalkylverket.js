// @meta {"url":"https://kalkylverket.se/kalkylatorer/skatt/kapitalskatt/isk-skatt-kalkylator","wait":7000,"settle":1500}
// Kalkylverket ISK-skatt: text field "Kapitalunderlag" (with a range slider). Yearly-tax tool: no years,
// return or monthly-saving controls.
window.__A = __mkAdapter({
  roles: { capital: () => __byLabel(/^Kapitalunderlag/i, { sel: 'input[type=text],input[type=number]' }),
    years: () => __byLabel(/^(Spartid|År|Antal år)/i, { sel: 'input' }), return: () => __byLabel(/avkastning/i, { sel: 'input' }), monthly: () => __byLabel(/månadsspar|insättning/i, { sel: 'input' }) },
  area: () => __up(__byLabel(/^Kapitalunderlag/i, { sel: 'input' }), [/ÅRETS ISK-SKATT/], 6000) || __area([/ÅRETS ISK-SKATT/]),
  fields: t => ({ tax: (t.match(/ÅRETS ISK-SKATT\n([^\n]+)/) || [])[1] || null }),
});
