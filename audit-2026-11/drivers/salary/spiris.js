// @meta {"url":"https://www.spiris.se/verktyg/kalkylatorer/lon-efter-skatt","wait":7000,"settle":2500}
// Spiris: tel field "Månadslön i SEK", react-select combobox "Vilken kommun bor du i?", "Är du medlem i
// svenska kyrkan?" Ja/Nej buttons, "Beräkna" button. The page says the result is for under 66 at year start.
const churchGroup = () => { const t = [...document.querySelectorAll('span,p,div,label')].find(e => e.children.length === 0 && /^Är du medlem i svenska kyrkan\?$/i.test((e.textContent || '').trim()) && __vis(e)); let n = t; for (let i = 0; n && i < 4; i++, n = n.parentElement) { const b = [...n.querySelectorAll('button')].filter(__vis); if (b.some(x => x.innerText.trim() === 'Ja') && b.some(x => x.innerText.trim() === 'Nej')) return n; } return null; };
// react-select: the text input is the search field (empty after a pick); the choice shows in its singleValue.
const shownFor = inp => { for (let n = inp; n && n !== document.body; n = n.parentElement) { const v = n.querySelector('[class*=singleValue],[class*=single-value]'); if (v) return [...n.querySelectorAll('input[type=text]')].length > 1 ? null : v.innerText.trim(); } return null; };
const parishInput = () => __byLabel(/^Vilken församling tillhör du/i, { sel: 'input' });
const activeChurch = () => { const g = churchGroup(); const a = g && [...g.querySelectorAll('button')].find(b => /\bactive\b/.test(b.className)); return a ? a.innerText.trim() : null; };
window.__A = __mkAdapter({
  roles: {
    gross: () => __byLabel(/^Månadslön/i, { sel: 'input' }),
    municipality: () => __byLabel(/^Vilken kommun bor du i/i, { sel: 'input' }),
    church: () => { const g = churchGroup(); return g ? [...g.querySelectorAll('button')].find(b => b.innerText.trim() === 'Ja') : null; },
    yob: () => __byLabel(/födelseår|född|ålder/i, { sel: 'input,select' }),
  },
  readbackExtra: () => { const g = churchGroup(); const m = __byLabel(/^Vilken kommun bor du i/i, { sel: 'input' }); const p = parishInput(); return { municipality: m ? shownFor(m) : null, municipalityInput: m ? m.value : null, church: activeChurch() === 'Ja' ? true : activeChurch() === 'Nej' ? false : null, parish: p ? shownFor(p) : null, churchButtons: g ? [...g.querySelectorAll('button')].map(b => b.innerText.trim() + ':' + (b.getAttribute('aria-pressed') || '') + ':' + b.className.slice(0, 60)).join(' | ') : null }; },
  churchState() { const g = churchGroup(); return g ? { status: 'done', buttons: [...g.querySelectorAll('button')].map(b => ({ t: b.innerText.trim(), pressed: b.getAttribute('aria-pressed'), cls: b.className })) } : { status: 'could-not-verify', reason: 'no Ja/Nej group' }; },
  async setMunicipality(name) { const s = this._need('municipality'); if (s) return s; return { __type: { role: 'municipality', text: name, blur: false, wait: 1200 }, then: 'pickMunicipality', args: [name] }; },
  pickMunicipality(name) { const o = [...document.querySelectorAll('[id*=-option-],[role=option]')].find(o => __vis(o) && __nameRe(name, 'i').test(o.innerText.trim())); if (!o) return { status: 'could-not-verify', reason: 'no option ' + name }; __mark(o, 'option'); return { __type: { role: 'option', click: true, wait: 1000 }, then: 'afterPick', args: [name] }; },
  afterPick(name) { const m = __marked('municipality'); const v = m && shownFor(m); return { status: v && v.toUpperCase().startsWith(name.toUpperCase()) ? 'done' : 'unconfirmed', shown: v, parish: 'not asked by the tool' }; },
  async setChurch(on, parish) { const g = churchGroup(); if (!g) return { status: 'could-not-verify', reason: 'no Ja/Nej group' }; const b = [...g.querySelectorAll('button')].find(x => x.innerText.trim() === (on ? 'Ja' : 'Nej')); __mark(b, 'churchBtn'); return { __type: { role: 'churchBtn', click: true, wait: 600 }, then: 'afterChurch', args: [on, parish] }; },
  // Ja shows "Vilken församling tillhör du?", which starts on the first parish of the municipality. The named
  // parish is picked by opening the list and clicking it; if it is not listed, the default stays and is recorded.
  async afterChurch(on, parish) { await __sleep(300); const act = activeChurch(); const r = { status: act === (on ? 'Ja' : 'Nej') ? 'done' : 'failed', clicked: on ? 'Ja' : 'Nej', active: act };
    const p = parishInput(); if (!on || !p) { r.parish = p ? 'parish control shown: ' + __labelOf(p) : 'not asked by the tool'; return r; }
    r.parishDefault = shownFor(p); __mark(p, 'parishInput'); return { __type: { role: 'parishInput', click: true, wait: 800 }, then: 'pickParish', args: [parish, r] }; },
  pickParish(parish, r) {
    const opts = [...document.querySelectorAll('[id*=-option-],[role=option]')].filter(__vis); const o = opts.find(o => o.innerText.trim().toLowerCase() === String(parish).toLowerCase());
    if (!o) { const p = parishInput(); if (p) p.blur(); return this.parishResult({ ...r, status: 'could-not-verify', reason: 'parish ' + parish + ' is not in the list, the tool keeps ' + r.parishDefault + ' (' + opts.length + ' options: ' + opts.map(o => o.innerText.trim()).join('; ').slice(0, 900) + ')' }); }
    __mark(o, 'parishOption'); return { __type: { role: 'parishOption', click: true, wait: 900 }, then: 'parishResult', args: [r, parish] };
  },
  parishResult(r, parish) { const p = parishInput(); const v = p && shownFor(p); if (!parish) return { ...r, parishShown: v }; return { ...r, status: v && v.toLowerCase() === String(parish).toLowerCase() ? r.status : 'unconfirmed', parish: v }; },
  calcButton: () => __btn(/^Beräkna$/, 'button'),
  area: () => __area([/Resultat/, /Lön före skatt/, /Skatt/]) || __area([/Resultat/]),
  fields: t => { const g = re => (t.match(re) || [])[1] || null; return { takeHome: g(/Resultat\n([^\n]+)\nkr\/mån/), tax: g(/\nSkatt\n([^\n]+)/), gross: g(/Lön före skatt \(bruttolön\)\n([^\n]+)/), sentence: g(/(Lön efter skatt [^\n]+)/) }; },
});
