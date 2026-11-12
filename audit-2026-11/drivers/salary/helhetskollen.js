// @meta {"url":"https://www.helhetskollen.se/salary","wait":7000,"settle":1800}
// Helhetskollen: text field "Bruttolön per månad (kr, efter löneväxling)", combobox "Kommun för skattetabell"
// (type, then pick "Stockholm / Tabell nn"). The page says the table is used without church fee.
window.__A = __mkAdapter({
  roles: {
    gross: () => __byLabel(/^Bruttolön per månad/i, { sel: 'input' }),
    municipality: () => __byLabel(/^Kommun/i, { sel: 'input' }),
    yob: () => __byLabel(/födelseår|född|ålder/i, { sel: 'input,select' }),
    church: () => __byLabel(/kyrk/i, { hidden: true }),
  },
  async setMunicipality(name) { const s = this._need('municipality'); if (s) return s; __marked('municipality').click(); return { __type: { role: 'municipality', text: name, blur: false, wait: 1200 }, then: 'pickMunicipality', args: [name] }; },
  async pickMunicipality(name) {
    const o = __option(new RegExp('^' + name + '\\s*(Tabell|$)', 'i'), 'button,[role=option],li');
    if (!o) return { status: 'could-not-verify', reason: 'no option ' + name + ' in the list' };
    __mark(o, 'option'); return { __type: { role: 'option', click: true, wait: 1200 }, then: 'afterPick', args: [name] };
  },
  async afterPick(name) {
    return { status: /Aktuellt val:\s*Schablon/i.test(document.body.innerText) ? 'failed' : 'done', value: (__marked('municipality') || {}).value, current: ((document.body.innerText.match(/Aktuellt val:[^\n]+/) || [])[0]) || null, parish: 'not asked by the tool' };
  },
  area: () => { const g = __byLabel(/^Bruttolön per månad/i, { sel: 'input' }); return __up(g, [/Din nettolön per månad/i], 9000) || __area([/Din nettolön per månad/i]); },
  fields: t => { const T = t.replace(/\s+/g, ' '); return { takeHome: (T.match(/Din nettolön per månad[^\d]*([\d\s ]+ kr)/i) || [])[1] || null, current: (T.match(/Aktuellt val: ([^.]+?)(?= Viktigt| Din|$)/) || [])[1] || null }; },
});
