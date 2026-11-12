// @meta {"url":"https://www.fortnox.se/fortnox-foretagsguide/kalkylatorer/lon-efter-skatt","wait":7000,"settle":2500}
// Fortnox: "Välj kommun" is a custom combobox over a native select (#salary_calculator_field_county, name
// valj-kommun); "Ange månadslön" number field; checkbox "Medlem i svenska kyrkan?"; "Beräkna" button.
// The result appears under "Så här fördelas lönen" after Beräkna.
const sel = () => [...document.querySelectorAll('select')].find(s => /Välj kommun/i.test(__labelOf(s)));
const combo = name => [...document.querySelectorAll('[role=combobox]')].find(e => (e.getAttribute('aria-label') || '') === name && __vis(e));
const shown = name => { const c = combo(name); if (!c) return null; const l = c.querySelector('label'); return clean(c.innerText.replace(l ? l.innerText : '', '')) || null; };
const clean = t => String(t || '').replace(/\s+/g, ' ').trim();
const parishSel = () => [...document.querySelectorAll('select')].find(s => /Välj församling/i.test(__labelOf(s)));
window.__A = __mkAdapter({
  roles: {
    gross: () => __byLabel(/^Ange månadslön/i, { sel: 'input' }),
    municipality: () => __byLabel(/^Välj kommun/i, { sel: 'input[type=text]' }) || sel(),
    church: () => __byLabel(/Medlem i svenska kyrkan/i, { sel: 'input[type=checkbox]', hidden: true }),
    yob: () => __byLabel(/födelseår|född|ålder/i, { sel: 'input,select' }),
  },
  // The text input is the combobox's search field and is empty after a pick; the choice shows in the combobox.
  readbackExtra: () => { const s = sel(); const m = __byLabel(/^Välj kommun/i, { sel: 'input[type=text]' }); const p = parishSel(); return { municipality: shown('Välj kommun'), municipalityInput: m ? m.value : null, countySelect: s ? __val(s) : null, parish: p ? shown('Välj församling') : null, parishSelect: p ? __val(p) : null }; },
  async setMunicipality(name) { const s = this._need('municipality'); if (s) return s; const e = __marked('municipality'); if (e.tagName === 'SELECT') return this.pickNative(name); return { __type: { role: 'municipality', text: name, blur: false, wait: 1000 }, then: 'pickMunicipality', args: [name] }; },
  pickMunicipality(name) { const o = __option(new RegExp('^' + name + '$'), '[role=option],li'); if (!o) return this.pickNative(name, 'no list option after typing'); __mark(o, 'option'); return { __type: { role: 'option', click: true, wait: 1000 }, then: 'afterPick', args: [name] }; },
  pickNative(name, why) { const s = sel(); if (!s) return { status: 'could-not-verify', reason: why || 'no county select' }; const o = [...s.options].find(o => o.value === name); if (!o) return { status: 'could-not-verify', reason: 'no option ' + name }; __set(s, o.value); return { status: 'done', via: 'native select' + (why ? ' (' + why + ')' : ''), value: s.value }; },
  afterPick(name) { const s = sel(); const m = __byLabel(/^Välj kommun/i, { sel: 'input[type=text]' }); return { status: (s && s.value === name) || (m && m.value === name) ? 'done' : 'unconfirmed', select: s && s.value, input: m && m.value, parish: 'not asked by the tool' }; },
  // Church on shows "Vilken församling tillhör du?" (combobox "Välj församling"); Beräkna stays disabled until a
  // parish is chosen, so the parish is picked the way a person does: open the list, click the named parish.
  async setChurch(on, parish) { const s = this._need('church'); if (s) return s; const r = await this._toggle('church', on); await __sleep(400);
    const c = combo('Välj församling'); if (!on || !c) { r.parish = c ? 'parish control shown: Välj församling' : 'not asked by the tool'; return r; }
    __mark(c, 'parishBox'); return { __type: { role: 'parishBox', click: true, wait: 800 }, then: 'pickParish', args: [parish, r] }; },
  pickParish(parish, r) {
    const list = document.getElementById((combo('Välj församling') || {}).getAttribute?.('aria-controls') || '') || document;
    const opts = [...list.querySelectorAll('[role=option],li')].filter(__vis);
    const o = opts.find(o => clean(o.innerText).toLowerCase() === String(parish).toLowerCase());
    if (!o) { __mark(combo('Välj församling'), 'parishBox'); return { __type: { role: 'parishBox', click: true, wait: 500 }, then: 'parishResult', args: [{ ...r, status: 'could-not-verify', reason: 'parish ' + parish + ' is not in the list (' + opts.length + ' options: ' + opts.map(o => clean(o.innerText)).join('; ').slice(0, 900) + ')' }] }; }
    __mark(o, 'parishOption'); return { __type: { role: 'parishOption', click: true, wait: 900 }, then: 'parishResult', args: [r, parish] };
  },
  parishResult(r, parish) { const p = parishSel(); if (parish) { const ok = p && p.value.toLowerCase() === String(parish).toLowerCase(); return { ...r, status: ok && r.status === 'done' ? 'done' : ok ? r.status : 'unconfirmed', parish: shown('Välj församling'), parishSelect: p && p.value }; } return { ...r, parish: 'not picked', parishShown: shown('Välj församling') }; },
  calcButton: () => __btn(/^Beräkna$/, 'button'),
  area: () => { const g = __byLabel(/^Ange månadslön/i, { sel: 'input' }); return __up(g, [/Beräkna/, /Så här fördelas lönen/], 9000) || __area([/Så här fördelas lönen/]) || __up(g, [/Beräkna/], 9000); },
  fields: t => { const g = re => (t.match(re) || [])[1] || null; return { takeHome: g(/Lön efter skatt \(nettolön\)\n([^\n]+)/), tax: g(/\nSkatt\n([^\n]+)/), gross: g(/Lön före skatt \(bruttolön\)\n([^\n]+)/), fieldMessage: g(/\n((?:Fältets|Fältet|Ange ett|Värdet)[^\n]+)/) }; },
});
