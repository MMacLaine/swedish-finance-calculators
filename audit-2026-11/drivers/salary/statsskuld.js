// @meta {"url":"https://statsskuld.se/berakna-nettolon","wait":7000,"settle":2500}
// Statsskuld: server-side form (POST, page reloads on "Beräkna"). Municipality is a Choices.js combobox
// "Var bor du" over a hidden select (#kommun, options from /api/ui/municipalities); church fee is a styled
// toggle (#kyrkoskatt-toggle, hidden input) next to the text "Medlem i Svenska kyrkan"; gross is "Ange din
// bruttolön:". Results show in year tabs 2023 to 2026; the 2026 tab is clicked before reading.
const box = () => [...document.querySelectorAll('[role=combobox]')].find(e => /Var bor du/i.test(e.getAttribute('aria-label') || '') && __vis(e));
const toggle = () => { const t = [...document.querySelectorAll('p,span,div,label')].find(e => e.children.length === 0 && /^Medlem i Svenska kyrkan$/i.test((e.textContent || '').trim()) && __vis(e)); let n = t; for (let i = 0; n && i < 4; i++, n = n.parentElement) { const h = n.querySelector('input[type=hidden][name*=kyrk],input[type=checkbox][name*=kyrk]'); if (h) return h.parentElement; } return null; };
// posted: the hidden field #kyrkoskatt that the form sends (the toggle's own class and input are not sent).
const tState = () => { const tg = toggle(); if (!tg) return null; const h = tg.querySelector('input'); const k = document.getElementById('kyrkoskatt'); return { input: h && (h.type === 'checkbox' ? h.checked : h.value), cls: tg.className.slice(0, 120), posted: k ? k.value : null }; };
window.__A = __mkAdapter({
  roles: {
    gross: () => __byLabel(/^Ange din bruttolön/i, { sel: 'input' }),
    municipality: () => box(),
    church: () => toggle(),
    yob: () => __byLabel(/födelseår|född|ålder/i, { sel: 'input,select' }),
  },
  async prep() { const b = document.getElementById('tabb-2026') || __btn(/^2026$/); if (b) { b.click(); await __sleep(800); return 'clicked tab 2026'; } return 'no 2026 tab'; },
  readbackExtra: () => { const k = document.getElementById('kommun'); return { kommunSelect: k ? __val(k) : null, churchToggle: tState(), tab: [...document.querySelectorAll('[id^=tabb-]')].map(b => b.id + ':' + b.getAttribute('aria-selected') + ':' + (b.className.match(/active|selected/) || [''])[0]).join(' '), visiblePanels: [...document.querySelectorAll('[role=tabpanel]')].filter(p => __vis(p)).map(p => p.id + ':' + ((p.innerText.match(/över [\d ]+ kr per år/) || [''])[0])) }; },
  churchState() { const s = tState(); return s ? { status: 'done', ...s } : { status: 'could-not-verify', reason: 'no toggle next to "Medlem i Svenska kyrkan"' }; },
  async setMunicipality(name) { const s = this._need('municipality'); if (s) return s; __mark(box(), 'municipality'); return { __type: { role: 'municipality', click: true, wait: 1500 }, then: 'typeMunicipality', args: [name] }; },
  typeMunicipality(name) { const b = box(); const s = b && b.querySelector('input[type=search]'); if (!s || !__vis(s)) return { status: 'could-not-verify', reason: 'search box did not open' }; __mark(s, 'munSearch'); return { __type: { role: 'munSearch', text: name, blur: false, wait: 1500 }, then: 'pickMunicipality', args: [name] }; },
  pickMunicipality(name) { const b = box(); const o = [...b.querySelectorAll('[role=option]')].find(o => __vis(o) && o.innerText.trim().toUpperCase().startsWith(name.toUpperCase() + ' (')); if (!o) return { status: 'could-not-verify', reason: 'no option ' + name }; __mark(o, 'option'); return { __type: { role: 'option', click: true, wait: 1000 }, then: 'afterPick', args: [name] }; },
  afterPick(name) { const k = document.getElementById('kommun'); return { status: k && k.value.toUpperCase() === name.toUpperCase() ? 'done' : 'failed', value: k && __val(k), parish: 'not asked by the tool' }; },
  async setChurch(on) {
    const tg = toggle(); if (!tg) return { status: 'could-not-verify', reason: 'no toggle next to "Medlem i Svenska kyrkan"' };
    const isOn = () => { const s = tState(); return s.input === true || s.input === 'on' || s.input === '1' || /\b(on|active|checked)\b/.test(s.cls); };
    const before = tState(); if (isOn() === !!on) return { status: 'done', before, after: before, note: 'already in that state' };
    const l = tg.querySelector('label') || tg; __mark(l, 'churchClick'); return { __type: { role: 'churchClick', click: true, wait: 800 }, then: 'afterChurch', args: [on, before] };
  },
  afterChurch(on, before) { const s = tState(); const isOn = s.input === true || s.input === 'on' || s.input === '1' || /\b(on|active|checked)\b/.test(s.cls); return { status: isOn === !!on ? 'done' : 'unconfirmed', before, after: s, parish: 'not asked by the tool' }; },
  calcButton: () => __btn(/^Beräkna$/, 'button,input[type=submit]'),
  // Setup steps run before any salary is typed: do not post an empty form then. After the field is emptied on
  // purpose (S2), press Beräkna as a person would to see what the tool does with it.
  async clearGross() { window.__forceCalc = true; return this._need('gross') || { __type: { role: 'gross', clear: true } }; },
  async calc() { const g = __byLabel(/^Ange din bruttolön/i, { sel: 'input' }); if (!g || (g.value === '' && !window.__forceCalc)) return { status: 'none', note: 'gross empty, not submitted' }; window.__forceCalc = false; const b = __btn(/^Beräkna$/, 'button'); if (!b) return { status: 'could-not-verify', reason: 'no Beräkna button' }; setTimeout(() => b.click(), 50); return { status: 'done', clicked: 'Beräkna (form post, page reloads)' }; },
  area: () => { const tab = document.getElementById('tabb-2026'); if (tab && tab.getAttribute('aria-selected') !== 'true') tab.click(); const p = [...document.querySelectorAll('[role=tabpanel]')].find(p => __vis(p)); return p || __area([/Beräkning av nettolön/, /Din nettolön/]); },
  fields: t => { const T = t.replace(/\s+/g, ' '); const m = re => (T.match(re) || [])[1] || null; return { takeHome: m(/Din nettolön[^\d=]*=?\s*([\d\s ]+ kr)/), grossShown: m(/Din bruttolön[^\d=]*=\s*([\d\s ]+ kr)/), kommunRate: m(/kommunala skatten i [^\d]+ ([\d.,]+%)/i), regionRate: m(/Skatten i ditt landsting är ([\d.,]+%)/), kommunTax: m(/Kommunalskatt .*? (-[\d\s ]+ kr)/), regionTax: m(/Landstingsskatt .*? (-[\d\s ]+ kr)/), churchFee: m(/Kyrkoavgift .*? (-[\d\s ]+ kr)/), burialLine: m(/(Begravningsavgift .*? -[\d\s ]+ kr)/) }; },
});
