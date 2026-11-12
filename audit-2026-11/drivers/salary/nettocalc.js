// @meta {"url":"https://nettocalc.com/se","wait":6000,"settle":1500}
// NettoCalc: the calculator is at /se (the register's /se/lon-efter-skatt is a fixed table with no inputs).
// Gross: text field under "Bruttolön per månad" (its own label is the unit "kr"). There is no municipality
// control: the tool takes "Kommunalskatt %" as a number (default 32.38, the national average); the municipality
// links lead to fixed-salary pages without inputs. No church-fee or birth-year control.
window.__A = __mkAdapter({
  roles: {
    gross: () => __byText(/^Bruttolön per månad$/i, 'input'),
    rate: () => __byLabel(/^Kommunalskatt %/i, { sel: 'input' }),
    municipality: () => __byLabel(/^(Kommun|Välj kommun)$/i, { sel: 'input,select' }),
    church: () => __byLabel(/kyrk/i, { hidden: true }),
    yob: () => __byLabel(/födelseår|född|ålder/i, { sel: 'input,select' }),
  },
  async prep() { const b = __btn(/^Brutto → Netto$/); if (b) b.click(); const m = __btn(/^Månad$/); if (m) m.click(); await __sleep(300); return 'Brutto → Netto, Månad'; },
  async setMunicipality(name) { this.locate(); if (__marked('municipality')) return { status: 'could-not-verify', reason: 'unexpected municipality control, adapter needs updating' };
    return { status: 'could-not-verify', reason: 'no municipality control on the calculator; only "Kommunalskatt %" (left at its value, see readback.rate)', rate: (__marked('rate') || {}).value || null }; },
  area: () => __area([/Din nettolön/, /Bruttolön/, /behållet/]) || __area([/Din nettolön/]),
  fields: t => { const g = re => (t.match(re) || [])[1] || null; return { takeHome: g(/Din nettolön\n(?:Månad\nÅr\n)?([^\n]+ kr)/), keptLine: g(/(från [^\n]+behållet)/), kommunTax: g(/Kommunalskatt\n([^\n]+)/), stateTax: g(/Statlig[^\n]*\n([^\n]+)/) }; },
});
