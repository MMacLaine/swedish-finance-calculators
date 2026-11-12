// @meta {"url":"https://kalkylverket.se/kalkylatorer/skatt/inkomstskatt/lon-efter-skatt-kalkylator","wait":7000,"settle":1500}
// Kalkylverket: text field "Bruttolön per månad (kr)", select "Kommun" (municipality only, rate in the option text),
// a church-fee toggle without an input (see kvToggle).
// Church fee: an unlabelled div toggle (no input, no role) beside the text "Medlem i Svenska kyrkan";
// state read from its inline background (muted = off).
const kvToggle = () => { const p = [...document.querySelectorAll('p,span,div')].find(e => e.children.length === 0 && /^Medlem i Svenska kyrkan$/i.test((e.textContent || '').trim()) && __vis(e)); let n = p; for (let i = 0; n && i < 5; i++, n = n.parentElement) { const t = [...n.querySelectorAll('div[style*=background],button,[role=switch]')].find(x => x.querySelector('span') && !x.contains(p)); if (t) return t; } return null; };
const kvOn = t => !/muted/.test(t.getAttribute('style') || '') || t.getAttribute('aria-checked') === 'true';
window.__A = __mkAdapter({
  roles: {
    gross: () => __byLabel(/^Bruttolön per månad/i, { sel: 'input' }),
    municipality: () => __byLabel(/^Kommun/i, { sel: 'select' }),
    yob: () => __byLabel(/födelseår|född|ålder/i, { sel: 'input,select' }),
    church: () => kvToggle(),
  },
  churchState() { const t = kvToggle(); return t ? { status: 'done', on: kvOn(t), style: t.getAttribute('style') } : { status: 'could-not-verify', reason: 'no toggle next to "Medlem i Svenska kyrkan"' }; },
  async setChurch(on) { const t = kvToggle(); if (!t) return { status: 'could-not-verify', reason: 'no toggle next to "Medlem i Svenska kyrkan"' }; const before = kvOn(t); if (before === !!on) return { status: 'done', before, after: before, note: 'already in that state' }; __mark(t, 'churchClick'); return { __type: { role: 'churchClick', click: true, wait: 800 }, then: 'afterChurch', args: [on, before] }; },
  afterChurch(on, before) { const t = kvToggle(); const after = kvOn(t); return { status: after === !!on ? 'done' : 'failed', before, after, style: t.getAttribute('style'), parish: 'not asked by the tool (average rate in the text)' }; },
  async setMunicipality(name) {
    const s = this._need('municipality'); if (s) return s; const sel = __marked('municipality');
    const o = [...sel.options].find(o => o.value === name) || [...sel.options].find(o => o.text.startsWith(name + ' '));
    if (!o) return { status: 'could-not-verify', reason: 'no option ' + name };
    __set(sel, o.value); sel.blur(); return { status: 'done', picked: o.text, parish: 'not asked by the tool' };
  },
  area: () => { const g = __marked('gross') || __byLabel(/^Bruttolön per månad/i, { sel: 'input' }); return __up(g, [/efter skatt/i, /kr/], 6000) || __area([/LÖN EFTER SKATT/i]); },
  fields: t => { const g = re => (t.match(re) || [])[1] || null; return { headline: g(/(LÖN EFTER SKATT PÅ [^\n]+)/), takeHome: g(/LÖN EFTER SKATT PÅ [^\n]+\n([^\n]+)/), perYear: g(/Per år\n([^\n]+)/), taxShare: g(/Skatt av lönen\n([^\n]+)/), message: g(/\n(Skriv in [^\n]+)/) }; },
});
