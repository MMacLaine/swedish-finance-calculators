// @meta {"url":"https://velja.se/lonekalkyl","wait":7000,"settle":1500}
// Velja: "Månadslön (brutto)" is a range slider; its value button ("Ange exakt värde för Månadslön (brutto)")
// opens a text field, which is what gets typed into. Year group "Skatteår" (2025/2026), combobox "Kommun"
// (#kommunSelect), checkboxes "66 år eller äldre..." and "Medlem i Svenska Kyrkan (+1,05 % kyrkoavgift)".
// Birth year is asked only as the 66+ checkbox: for born 1990 it must be unticked.
const valueButton = () => [...document.querySelectorAll('button')].find(b => __vis(b) && /^Ange exakt värde för Månadslön/i.test(b.getAttribute('aria-label') || ''));
window.__A = __mkAdapter({
  roles: {
    gross: () => __byLabel(/^Ange exakt värde för Månadslön/i, { sel: 'input' }) || __byLabel(/^Månadslön \(brutto\)/i, { sel: 'input' }),
    municipality: () => __byLabel(/^Kommun/i, { sel: 'input' }),
    yob: () => __byLabel(/66 år eller äldre/i, { sel: 'input[type=checkbox]', hidden: true }),
    church: () => __byLabel(/Medlem i Svenska Kyrkan/i, { sel: 'input[type=checkbox]', hidden: true }),
  },
  async prep() { const g = [...document.querySelectorAll('[role=group]')].find(g => /Skatteår/i.test(g.getAttribute('aria-label') || '')); const b = g && [...g.querySelectorAll('button')].find(b => b.innerText.trim() === '2026'); if (b && b.getAttribute('aria-pressed') !== 'true') { b.click(); await __sleep(500); return 'clicked year 2026'; } return b ? 'year 2026 already pressed' : 'no year group found'; },
  readbackExtra: () => { const r = __byLabel(/^Månadslön \(brutto\)/i, { sel: 'input[type=range]' }); const g = [...document.querySelectorAll('[role=group]')].find(g => /Skatteår/i.test(g.getAttribute('aria-label') || '')); const b = valueButton(); return { grossShown: b ? b.innerText.trim() : null, slider: r ? r.value : null, year: g ? [...g.querySelectorAll('button')].map(b => b.innerText.trim() + ':' + b.getAttribute('aria-pressed')).join(' ') : null }; },
  async openGross() { const b = valueButton(); if (b) { b.click(); await __sleep(500); } this.locate(); const e = __marked('gross'); return !!(e && e.type === 'text'); },
  async setGross(v) { await this.openGross(); return this._need('gross') || { __type: { role: 'gross', text: String(v) } }; },
  async clearGross() { await this.openGross(); return this._need('gross') || { __type: { role: 'gross', clear: true } }; },
  async setYob(y) { const s = this._need('yob', 'no birth-year control; the "66 år eller äldre" checkbox not found either'); if (s) return s; const r = await this._toggle('yob', +y <= 1959); r.note = 'tool asks "66 år eller äldre vid 2026 års början" instead of a birth year; born ' + y + ' means ' + (+y <= 1959 ? 'ticked' : 'unticked'); return r; },
  async setMunicipality(name) { const s = this._need('municipality'); if (s) return s; return { __type: { role: 'municipality', text: name, blur: false, combo: true, wait: 1000 }, then: 'pickMunicipality', args: [name] }; },
  async pickMunicipality(name) {
    const o = __option(__nameRe(name), '[role=option],li');
    if (!o) return { status: 'could-not-verify', reason: 'no option ' + name + ' in the list' };
    __mark(o, 'option'); return { __type: { role: 'option', click: true, wait: 1200 }, then: 'afterPick', args: [name] };
  },
  afterPick(name) { const m = __marked('municipality'); return { status: m && m.value.startsWith(name) ? 'done' : 'failed', value: m && m.value, parish: 'not asked by the tool' }; },
  async setChurch(on) { const s = this._need('church'); if (s) return s; const r = await this._toggle('church', on); r.parish = 'not asked by the tool (flat rate in the label)'; return r; },
  area: () => __area([/Nettolön per månad/, /Begravningsavgift/, /Nettolön\n/]) || __area([/Nettolön per månad/]),
  fields: t => { const g = re => (t.match(re) || [])[1] || null; return { takeHome: g(/Nettolön per månad\n([^\n]+)/), effective: g(/(effektiv skatt [\d,]+ ?%)/), kommunLine: g(/\nKommunalskatt\n([^\n]+\n[^\n]+)/), burial: g(/Begravningsavgift\n([^\n]+\n[^\n]+)/), churchFee: g(/\nKyrkoavgift\n([^\n]+\n[^\n]+)/), stateTax: g(/Statlig inkomstskatt\n([^\n]+\n[^\n]+)/), jobTaxCredit: g(/Jobbskatteavdrag\n([^\n]+\n[^\n]+)/) }; },
});
