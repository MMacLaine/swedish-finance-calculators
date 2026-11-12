// @meta {"url":"https://isk-guiden.se/isk-kalkylator/","wait":6000,"settle":1500}
// ISK-guiden: number fields "Portföljvärde (kr)" and "Statslåneränta (%)" (left at its value). A yearly-tax
// tool: it has no years, return or monthly-saving controls (those steps report could-not-verify).
window.__A = __mkAdapter({
  roles: { capital: () => __byLabel(/^Portföljvärde/i, { sel: 'input' }), slr: () => __byLabel(/^Statslåneränta/i, { sel: 'input' }),
    years: () => __byLabel(/år|tid/i, { sel: 'input[type=number],input[type=range]' }), return: () => __byLabel(/avkastning/i, { sel: 'input' }), monthly: () => __byLabel(/månadsspar|insättning/i, { sel: 'input' }) },
  area: () => __area([/Schablonintäkt/, /Kapitalskatt/]) || __up(__byLabel(/^Portföljvärde/i, { sel: 'input' }), [/Kapitalskatt/]),
  fields: t => { const g = re => (t.match(re) || [])[1] || null; return { taxPerYear: g(/Schablonskatt per år\n([^\n]+)/), perMonth: g(/Per månad[^\n]*\n([^\n]+)/), taxed: g(/Beskattat belopp\n([^\n]+)/), income: g(/Schablonintäkt \(belopp\)\n([^\n]+)/) }; },
});
