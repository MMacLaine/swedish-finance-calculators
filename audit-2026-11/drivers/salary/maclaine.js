// @meta {"url":"https://maclaine.se/finance/salary","wait":6000,"settle":1500}
// maclaine.se Nettolön: number fields "Bruttolön per månad" and "Födelseår", autocomplete text field "Kommun",
// "Medlem i trossamfund" Nej/Ja buttons, then a "Trossamfund" select (Svenska kyrkan). No parish is asked.
const grossEl = () => __byLabel(/^Bruttolön per månad/i, { sel: 'input' });
const churchGroup = () => { const t = [...document.querySelectorAll('*')].find(e => __vis(e) && e.children.length === 0 && /^Medlem i trossamfund$/i.test((e.textContent || '').trim())); let n = t; for (let i = 0; n && i < 4; i++, n = n.parentElement) { const b = [...n.querySelectorAll('button')].filter(__vis); if (b.some(x => x.innerText.trim() === 'Ja') && b.some(x => x.innerText.trim() === 'Nej')) return n; } return null; };
window.__A = __mkAdapter({
  roles: {
    gross: grossEl,
    yob: () => __byLabel(/^Födelseår/i, { sel: 'input' }),
    municipality: () => __byLabel(/^Kommun/i, { sel: 'input[type=text]' }),
    church: () => { const g = churchGroup(); return g ? [...g.querySelectorAll('button')].find(b => /^Ja$/.test(b.innerText.trim())) : null; },
  },
  readbackExtra: () => { const g = churchGroup(); const ts = __byLabel(/^Trossamfund/i, { sel: 'select' }); return { churchButtons: g ? [...g.querySelectorAll('button')].map(b => b.innerText.trim() + ':' + (b.getAttribute('aria-pressed') || b.className.match(/active|selected|on\b/) || '')).join(' ') : null, trossamfund: ts ? __val(ts) : null }; },
  churchState() { const g = churchGroup(); if (!g) return { status: 'could-not-verify', reason: 'no "Medlem i trossamfund" group found' }; return { status: 'done', buttons: [...g.querySelectorAll('button')].map(b => ({ t: b.innerText.trim(), pressed: b.getAttribute('aria-pressed'), cls: b.className })) }; },
  async setMunicipality(name) { const s = this._need('municipality'); if (s) return s; return { __type: { role: 'municipality', text: name, blur: false, wait: 900 }, then: 'pickMunicipality', args: [name] }; },
  async pickMunicipality(name) {
    const o = __option(__nameRe(name), '[role=option],li,button');
    if (o) { __press(o); await __sleep(600); }
    const m = __marked('municipality'); if (m) m.blur(); await __sleep(300);
    return { status: o ? 'done' : 'could-not-verify', clicked: o ? (o.innerText || '').trim().slice(0, 60) : null, value: m && m.value };
  },
  async setChurch(on) {
    const g = churchGroup(); if (!g) return { status: 'could-not-verify', reason: 'no "Medlem i trossamfund" group found' };
    const b = [...g.querySelectorAll('button')].find(x => x.innerText.trim() === (on ? 'Ja' : 'Nej')); b.click(); await __sleep(700);
    let picked = null; if (on) { const ts = __byLabel(/^Trossamfund/i, { sel: 'select' }); if (ts) { const o = [...ts.options].find(o => /Svenska kyrkan/i.test(o.text)); if (o) { __set(ts, o.value); ts.blur(); picked = o.text; } } }
    return { status: 'done', clicked: b.innerText.trim(), trossamfund: picked, parish: 'not asked by the tool' };
  },
  area: () => __area([/Arbetsgivarens totala kostnad/, /Nettolön/, /Skatt per månad/]) || __area([/Nettolön/, /Kommunalskatt/]),
  fields: t => { const g = re => (t.match(re) || [])[1] || null; const slip = t.match(/Lönespecen drar ([^\n]+?) kr \(skattetabell (\d+)\)/) || [];
    return { takeHome: g(/\nNettolön\n([^\n]+?) kr/), payslipTax: slip[1] || null, table: slip[2] || null, payslipLine: g(/(Lönespecen [^\n]+)/), taxPerMonth: g(/Skatt per månad[^\n]*\n([^\n]+)/), kommunLine: g(/\n(Kommunalskatt [^\n]+)/), burial: g(/Begravningsavgift\n([^\n]+)/), churchFee: g(/\n((?:Trossamfundsavgift|Kyrkoavgift)[^\n]*\n[^\n]+)/), stateTax: g(/Statlig inkomstskatt[^\n]*\n([^\n]+)/), jobTaxCredit: g(/Jobbskatteavdrag\n([^\n]+)/) }; },
});
