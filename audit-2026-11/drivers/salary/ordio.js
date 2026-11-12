// @meta {"url":"https://www.ordio.com/sv/tools/lon-kalkylator","wait":7000,"settle":1500}
// Ordio: text field "Bruttolön per månad (kr)", select "Kommun" (municipality with rate), checkbox
// "Medlem i Svenska kyrkan (kyrkoavgift)", birth year under "Avancerade inställningar".
window.__A = __mkAdapter({
  roles: {
    gross: () => __byLabel(/^Bruttolön per månad/i, { sel: 'input' }),
    municipality: () => __byLabel(/^Kommun/i, { sel: 'select' }),
    church: () => __byLabel(/Medlem i Svenska kyrkan/i, { sel: 'input[type=checkbox]', hidden: true }),
    yob: () => __byLabel(/Födelseår/i, { sel: 'input' }) || __byText(/^Födelseår/i, 'input'),
    parish: () => __byLabel(/församling/i, { sel: 'select,input' }),
  },
  async prep() { const d = [...document.querySelectorAll('details')].find(d => /Avancerade inställningar/i.test(d.innerText)); if (d && !d.open) { const s = d.querySelector('summary'); (s || d).click(); await __sleep(400); return 'opened Avancerade inställningar'; } const b = __btn(/^Avancerade inställningar/i); if (b) { b.click(); await __sleep(400); return 'clicked Avancerade inställningar'; } return null; },
  async setMunicipality(name) {
    const s = this._need('municipality'); if (s) return s; const sel = __marked('municipality');
    const o = [...sel.options].find(o => o.text.startsWith(name + ' ')) || [...sel.options].find(o => o.value === name.toLowerCase());
    if (!o) return { status: 'could-not-verify', reason: 'no option ' + name };
    __set(sel, o.value); sel.blur(); return { status: 'done', picked: o.text };
  },
  async setChurch(on, parish) {
    const s = this._need('church'); if (s) return s; const r = await this._toggle('church', on); await __sleep(500);
    this.locate(); const p = __marked('parish'); if (on && p && p.tagName === 'SELECT') { const o = [...p.options].find(o => o.text.replace(/\s+/g, ' ').trim().toLowerCase() === parish.toLowerCase()); if (o) { __set(p, o.value); r.parish = o.text; } else r.parish = 'parish select present, no option ' + parish; } else if (on) r.parish = p ? 'parish control is not a select' : 'not asked by the tool';
    return r;
  },
  area: () => { const g = __byLabel(/^Bruttolön per månad/i, { sel: 'input' }); return __up(g, [/Nettolön|efter skatt/i, /kr/], 9000) || __area([/Nettolön/i]); },
  fields: t => { const g = re => (t.match(re) || [])[1] || null; return { takeHome: g(/Nettolön per månad\n([^\n]+)/), kommunLine: g(/(Kommunal \+ regionskatt[^\n]*\n[^\n]+)/), burial: g(/Begravningsavgift\n([^\n]+)/), churchFee: g(/Kyrkoavgift\n([^\n]+)/), jobTaxCredit: g(/Jobbskatteavdrag\n([^\n]+)/), stateTax: g(/Statlig[^\n]*\n([^\n]+)/) }; },
});
