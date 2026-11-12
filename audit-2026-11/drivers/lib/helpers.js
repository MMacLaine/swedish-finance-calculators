// Page-side helpers for the audit v3.3 drivers. Injected before every document load (top frame only).
// Carries the round-3 seed.js helpers (__set, __type, __find, __money, __clickText, __sleep) unchanged in
// behaviour, plus label-based control finding. Rule: a control is found by its label text; visibility of a
// control inside a <label> is judged by the label (styled checkboxes can hold a zero-size input).
if (window.top === window) {
window.__sleep = ms => new Promise(r => setTimeout(r, ms));
window.__find=function(re){const out=[];const walk=root=>{for(const e of root.querySelectorAll('*')){if(e.shadowRoot)walk(e.shadowRoot);const t=(e.innerText||'');if(!re.test(t))continue;if([...e.children].some(c=>re.test(c.innerText||'')))continue;const r=e.getBoundingClientRect();if(r.width<2||r.height<2)continue;let fx='';for(let n=e;n&&n.nodeType===1;n=n.parentElement){const p=getComputedStyle(n).position;if(p==='fixed'||p==='sticky'){fx=p;break;}}out.push({t:t.replace(/\s+/g,' ').slice(0,60),y:Math.round(r.top+scrollY),vpTop:Math.round(r.top),h:Math.round(r.height),fs:parseFloat(getComputedStyle(e).fontSize),fixed:fx});}};walk(document);return out.slice(0,20);};
window.__set=function(el,v){el.focus();const proto=el.tagName==='SELECT'?HTMLSelectElement.prototype:el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value').set.call(el,v);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));el.dispatchEvent(new KeyboardEvent('keyup',{bubbles:true,key:'0'}));};
window.__money=function(re){re=re||/\d[\d\s ]{3,}\s*(kr|SEK|:-)/i;const out=[];const walk=root=>{for(const e of root.querySelectorAll('*')){if(e.shadowRoot)walk(e.shadowRoot);const own=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join(' ').replace(/\s+/g,' ').trim();if(!own||own.length>90||!re.test(own))continue;const r=e.getBoundingClientRect();if(r.width<2||r.height<2)continue;const s=getComputedStyle(e);if(s.visibility==='hidden'||s.display==='none')continue;out.push({t:own.slice(0,70),y:Math.round(r.top+scrollY)});}};walk(document);return out.slice(0,60);};
window.__clickText=function(re,sel){sel=sel||'button,a,[role=option],li,label';const els=[...document.querySelectorAll(sel)].filter(e=>re.test((e.innerText||e.textContent||'').trim()));const e=els.find(x=>x.getBoundingClientRect().width>0)||els[0];if(e){e.click();return (e.innerText||'').trim().slice(0,60);}return null;};
window.__type=async function(el,text){el.focus();const set=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;set.call(el,'');el.dispatchEvent(new Event('input',{bubbles:true}));for(const ch of text){set.call(el,el.value+ch);el.dispatchEvent(new KeyboardEvent('keydown',{bubbles:true,key:ch}));el.dispatchEvent(new InputEvent('input',{bubbles:true,data:ch,inputType:'insertText'}));el.dispatchEvent(new KeyboardEvent('keyup',{bubbles:true,key:ch}));await new Promise(r=>setTimeout(r,40));}};

// Visible: no display:none / visibility:hidden up the chain, and a box. Inside a label, judge by the label.
window.__vis = function (e) {
  if (!e) return false;
  const box = (e.closest && e.closest('label')) || e;
  for (let n = box; n && n.nodeType === 1; n = n.parentElement) { const s = getComputedStyle(n); if (s.display === 'none' || s.visibility === 'hidden') return false; }
  const r = box.getBoundingClientRect(); if (r.width > 0 && r.height > 0) return true;
  return !!(e.labels && [...e.labels].some(l => l !== box && __vis(l)));
};
const clean = t => String(t || '').replace(/\s+/g, ' ').trim();
// Label text for a control: <label for>, wrapping label, aria-label, aria-labelledby, then the nearest
// preceding text in its container (many React forms put the label in a sibling div).
window.__labelOf = function (e) {
  let t = '';
  if (e.labels && e.labels.length) t = [...e.labels].map(l => l.innerText).join(' ');
  if (!clean(t) && e.getAttribute('aria-label')) t = e.getAttribute('aria-label');
  if (!clean(t) && e.getAttribute('aria-labelledby')) t = e.getAttribute('aria-labelledby').split(/\s+/).map(id => (document.getElementById(id) || {}).innerText || '').join(' ');
  if (!clean(t) && e.id) { const l = document.querySelector('label[for="' + CSS.escape(e.id) + '"]'); if (l) t = l.innerText; }
  if (!clean(t)) { for (let n = e, i = 0; n && i < 4 && !clean(t); i++) { let p = n.previousElementSibling; while (p && !clean(p.innerText)) p = p.previousElementSibling; if (p) t = p.innerText; n = n.parentElement; } }
  if (!clean(t) && e.placeholder) t = e.placeholder;
  return clean(t).slice(0, 100);
};
window.__val = e => !e ? null : e.tagName === 'SELECT' ? ((e.selectedOptions[0] || {}).text || e.value) : (e.type === 'checkbox' || e.type === 'radio') ? e.checked : e.getAttribute('role') && e.getAttribute('aria-checked') != null ? e.getAttribute('aria-checked') : e.getAttribute('aria-pressed') != null ? e.getAttribute('aria-pressed') : e.value;
const CTRL = 'input,select,textarea,[role=switch],[role=checkbox],[role=combobox],[aria-pressed]';
// Every visible form control with its label and starting value (the S7 record, and readback after each step).
window.__controls = function (root) {
  return [...(root || document).querySelectorAll(CTRL)].filter(e => !/^(hidden|search|submit|button|image|reset|file)$/.test(e.type || '')).filter(__vis)
    .map(e => ({ label: __labelOf(e), id: e.id || null, name: e.name || null, tag: e.tagName.toLowerCase(), type: e.type || e.getAttribute('role') || null, value: __val(e),
      av3: e.getAttribute('data-av3') || undefined, options: e.tagName === 'SELECT' ? e.options.length : undefined }));
};
// Find a control by label text. re is a RegExp; opts.sel narrows the element kinds; opts.all returns every match.
window.__byLabel = function (re, opts) {
  opts = opts || {};
  const els = [...document.querySelectorAll(opts.sel || CTRL)].filter(e => !/^(hidden|submit|button|image|reset|file)$/.test(e.type || ''));
  const hits = els.filter(e => re.test(__labelOf(e)) && (opts.hidden || __vis(e)));
  return opts.all ? hits : hits[0] || null;
};
// Mark a control so the Node side can type into it with real key events.
window.__mark = function (el, role) { document.querySelectorAll('[data-av3="' + role + '"]').forEach(x => x.removeAttribute('data-av3')); if (el) el.setAttribute('data-av3', role); return !!el; };
window.__marked = role => document.querySelector('[data-av3="' + role + '"]');
// Buttons and clickable things by their own text.
window.__btn = function (re, sel) { return [...document.querySelectorAll(sel || 'button,[role=button],[role=tab],[role=radio],a,label')].filter(e => re.test(clean(e.innerText || e.textContent)) && __vis(e))[0] || null; };
// Consent walls: click the most privacy-preserving choice that is offered, record what was clicked.
window.__consent = function () {
  const res = [/^(Neka|Avvisa|Avböj|Endast nödvändiga|Bara nödvändiga|Godkänn nödvändiga|Tillåt endast nödvändiga|Acceptera endast nödvändiga|Använd endast nödvändiga|Neka alla|Avvisa alla|Reject all|Decline|Deny|Only necessary)( cookies| kakor)?$/i,
    /^[^.?!]{0,40}nödvändiga[^.?!]{0,20}$/i];
  // Buttons only (never links), short labels only: a consent choice, not a link that happens to say "nödvändiga".
  const all = []; const walk = r => { for (const e of r.querySelectorAll('button,[role=button],input[type=button],input[type=submit]')) all.push(e); for (const e of r.querySelectorAll('*')) if (e.shadowRoot) walk(e.shadowRoot); }; walk(document);
  const txt = e => clean(e.innerText || e.textContent || e.value);
  for (const re of res) { const b = all.find(e => txt(e).length < 45 && re.test(txt(e)) && e.getBoundingClientRect().width > 0); if (b) { const t = txt(b); b.click(); return t; } }
  return null;
};
// Messages a person would see: alerts, live regions, error/warning styled text, native validation.
window.__messages = function (root) {
  root = root || document;
  const out = new Set();
  for (const e of root.querySelectorAll('[role=alert],[aria-live],[class*=error i],[class*=warning i],[class*=invalid i],[class*=varning i],[class*=fel-] ')) { if (__vis(e)) { const t = clean(e.innerText); if (t && t.length < 300) out.add(t); } }
  for (const e of root.querySelectorAll('input,select,textarea')) { if (e.validationMessage && __vis(e)) out.add('[validation ' + (__labelOf(e) || e.id) + '] ' + e.validationMessage); if (e.getAttribute('aria-invalid') === 'true') out.add('[aria-invalid] ' + (__labelOf(e) || e.id)); }
  return [...out].slice(0, 20);
};
// Text of an area, and the lines in it that carry a rate or an amount.
// innerText without the option lists of <select> elements (headless Chrome includes them), each select
// replaced by "[label: chosen option]" so the area text still says which municipality a figure belongs to.
window.__txt = function (el) {
  if (!el) return ''; const t = el.innerText || ''; const sels = [...el.querySelectorAll('select')]; if (!sels.length) return t;
  const optOf = new Map(); for (const s of sels) for (const o of s.options) optOf.set(o.text.replace(/\s+/g, ' ').trim(), s);
  const L = t.split('\n'), out = [];
  for (let i = 0; i < L.length;) { const k = L[i].replace(/\s+/g, ' ').trim(); const s = optOf.get(k); let j = i; if (s) { while (j < L.length && optOf.get(L[j].replace(/\s+/g, ' ').trim()) === s) j++; }
    if (s && j - i >= 3) { out.push('[' + (__labelOf(s) || 'select') + ': ' + __val(s) + ']'); i = j; } else { out.push(L[i]); i++; } }
  return out.join('\n');
};
window.__text = window.__txt;
window.__rateLines = t => String(t || '').split('\n').map(clean).filter(s => /\d\s*%/.test(s) && s.length < 200);
window.__moneyLines = t => String(t || '').split('\n').map(clean).filter(s => /\d/.test(s) && /kr|SEK|:-/i.test(s) && s.length < 200);
window.__weird = t => ({ nan: /\bNaN\b/.test(t), infinity: /Infinity|∞/.test(t), exponent: /\d(\.\d+)?e[+-]?\d{2,}/i.test(t), negativeKr: (String(t).match(/[−-]\s?\d[\d\s ]*\s?kr/g) || []).slice(0, 10) });
// Smallest visible element whose text contains every pattern: used to grab "the result area".
window.__area = function (res, maxLen) {
  maxLen = maxLen || 6000; let best = null;
  for (const e of document.querySelectorAll('main,section,article,div,form,aside,table')) {
    const it = e.innerText || ''; if (!res.every(re => re.test(it))) continue; if (!__vis(e)) continue; const t = __txt(e); if (t.length > maxLen) continue;
    if (res.every(re => re.test(t)) && (!best || t.length < best.__l)) { best = e; best.__l = t.length; }
  }
  return best;
};

// "Label / amount" pairs from an area's text, for layouts that put the amount on its own line.
window.__pairs = function (t) {
  const L = String(t || '').split('\n').map(clean).filter(Boolean); const out = [];
  const amt = s => /^[−+=\-–]?\s*[=]?\s*[−\-–]?\s*\d[\d\s  ]*([.,]\d+)?\s*(kr|SEK|%|:-)?(\s*\/\s*(mån|år|månad))?$/i.test(s) || /^[−+=\-–]?\s*\d[\d\s  ]*([.,]\d+)?\s*(kr|SEK)\b/i.test(s);
  for (let i = 0; i < L.length; i++) { if (amt(L[i]) && i > 0 && !amt(L[i - 1])) out.push([L[i - 1].slice(0, 120), L[i]]); else if (/\d/.test(L[i]) && /(kr|SEK|%)/i.test(L[i]) && !amt(L[i]) && L[i].length < 160) out.push([L[i], null]); }
  return out.slice(0, 80);
};
window.__num = s => { if (s == null) return null; const m = String(s).replace(/[  ]/g, ' ').match(/[−\-–]?\s*\d[\d ]*(?:[.,]\d+)?/); if (!m) return null; return parseFloat(m[0].replace(/[−–]/, '-').replace(/\s/g, '').replace(',', '.')); };
// Base adapter. spec.roles maps a role (gross, municipality, yob, church) to a finder returning the control or
// null. A role whose finder returns null is reported "could-not-verify", never "absent".
window.__mkAdapter = function (spec) {
  const A = {
    async prepare() { const log = []; const c = __consent(); if (c) { log.push('consent: ' + c); await __sleep(800); } if (spec.prep) { const l = await spec.prep(); if (l) log.push(...[].concat(l)); } return { status: 'done', log }; },
    locate() { const out = {}; for (const [role, f] of Object.entries(spec.roles || {})) { let e = null; try { e = f(); } catch (x) {} __mark(e, role); out[role] = e ? { found: true, label: __labelOf(e), tag: e.tagName.toLowerCase(), type: e.type || e.getAttribute('role'), value: __val(e) } : { found: false, status: 'could-not-verify' }; } return out; },
    _need(role, why) { this.locate(); return __marked(role) ? null : { status: 'could-not-verify', reason: why || ('no control found by label for ' + role) }; },
    async setGross(v) { return this._need('gross') || { __type: { role: 'gross', text: String(v) } }; },
    async setInput(role, v) { const f = spec['set_' + role]; if (f) return f.call(this, v); return this._need(role) || { __type: { role, text: String(v) } }; },
    async clearGross() { return this._need('gross') || { __type: { role: 'gross', clear: true } }; },
    async setYob(y) { return this._need('yob', 'no birth-year or age control found by label') || { __type: { role: 'yob', text: String(y) } }; },
    async setMunicipality(name, parish) { return { status: 'could-not-verify', reason: 'adapter has no municipality step' }; },
    async setChurch(on) { return this._need('church', 'no church-fee control found by label') || this._toggle('church', on); },
    // Set a checkbox-like control by clicking it (or its label) the way a person does, then read it back.
    async _toggle(role, on) {
      const e = __marked(role); const state = () => { const v = __val(e); return v === true || v === 'true'; };
      const before = state(); if (before !== !!on) { const target = (e.closest && e.closest('label')) || (e.labels && e.labels[0]) || e; target.click(); await __sleep(600); }
      return { status: state() === !!on ? 'done' : 'failed', before, after: state() };
    },
    churchState() { this.locate(); const e = __marked('church'); return e ? { status: 'done', label: __labelOf(e), value: __val(e) } : { status: 'could-not-verify', reason: 'no church-fee control found by label' }; },
    rates() { return { status: 'done', rates: this.read().rates }; },
    async calc() { if (spec.calcButton) { const b = spec.calcButton(); if (!b) return { status: 'could-not-verify', reason: 'no calculate button found' }; const off = b.disabled || b.getAttribute('aria-disabled') === 'true'; b.click(); return off ? { status: 'disabled', clicked: clean(b.innerText), note: 'the button is disabled, so the press did nothing' } : { status: 'done', clicked: clean(b.innerText) }; } return { status: 'none' }; },
    readback() { const o = {}; for (const role of Object.keys(spec.roles || {})) { let e = __marked(role); if (!e) { try { e = spec.roles[role](); } catch (x) {} } o[role] = e ? __val(e) : null; } if (spec.readbackExtra) Object.assign(o, spec.readbackExtra()); o.controls = __controls(); return o; },
    area() { return spec.area ? spec.area() : document.body; },
    read() { const a = this.area(); const t = __txt(a); let f = {}; const tn = String(t).split('\n').map(clean).filter(Boolean).join('\n'); try { f = spec.fields ? spec.fields(tn, a) : {}; } catch (x) { f = { error: String(x) }; }
      return { found: !!a, fields: f, rates: __rateLines(t), pairs: __pairs(t), messages: __messages(a || document), weird: __weird(t), area: t.slice(0, 12000), body: window.__BODY ? __txt(document.body).slice(0, 30000) : undefined }; },
  };
  for (const k of Object.keys(spec)) if (typeof spec[k] === 'function' && !['prep', 'area', 'fields', 'calcButton', 'readbackExtra'].includes(k)) A[k] = spec[k];
  A.spec = spec; return A;
};

// Find a control by visible label text that is not wired to it: the first control after the text's element.
window.__byText = function (re, sel) {
  const leaves = [...document.querySelectorAll('label,legend,span,div,p,h2,h3,h4,h5,dt,strong,b,summary,td,th')].filter(e => __vis(e) && re.test(clean(e.innerText)) && ![...e.children].some(c => re.test(clean(c.innerText))));
  const all = [...document.querySelectorAll(sel || 'input,select,textarea,[role=combobox]')].filter(x => __vis(x) && !/^(hidden|submit|button|image|reset|search)$/.test(x.type || ''));
  for (const l of leaves) { const nx = all.find(x => l.contains(x) || (l.compareDocumentPosition(x) & Node.DOCUMENT_POSITION_FOLLOWING)); if (nx) return nx; }
  return null;
};
// Climb from an element to the first ancestor whose text matches every pattern (the calculator plus its result).
window.__up = function (el, res, maxLen) { maxLen = maxLen || 8000; for (let n = el; n && n !== document.body; n = n.parentElement) { const t = __txt(n); if (t.length > maxLen) return null; if (res.every(re => re.test(t))) return n; } return null; };
// Visible clickable whose own text starts with the name (autocomplete options), most specific first.
window.__option = function (re, sel) {
  const els = [...document.querySelectorAll(sel || '[role=option],li,button,a,div,span')].filter(e => __vis(e) && re.test(clean(e.innerText || e.textContent)) && e.children.length < 6);
  els.sort((a, b) => (a.innerText || '').length - (b.innerText || '').length);
  return els[0] || null;
};
// A name at the start of an option's text, ending where the word ends. Not \\b: JavaScript counts å, ä, ö as
// non-word characters, so /^Malmö\\b/ never matches "Malmö 32,42 %".
window.__nameRe = (name, flags) => new RegExp('^' + String(name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![\\wåäöéüÅÄÖÉÜ])', flags || '');
window.__press = function (el) { for (const t of ['pointerdown', 'mousedown', 'pointerup', 'mouseup']) el.dispatchEvent(new (t.startsWith('pointer') ? PointerEvent : MouseEvent)(t, { bubbles: true, cancelable: true, view: window })); el.click(); };

// Velja-style sliders: the value button "Ange exakt värde för <label>" opens a text field to type into.
window.__exactInput = async function (name) {
  const re = new RegExp('^Ange exakt värde för ' + name, 'i');
  let inp = [...document.querySelectorAll('input')].find(e => __vis(e) && re.test(e.getAttribute('aria-label') || ''));
  if (!inp) { const b = [...document.querySelectorAll('button')].find(e => __vis(e) && re.test(e.getAttribute('aria-label') || '')); if (b) { b.click(); await __sleep(500); } inp = [...document.querySelectorAll('input')].find(e => __vis(e) && re.test(e.getAttribute('aria-label') || '')); }
  return inp || null;
};
// Range slider with no text field: set it the way a drag lands (value snapped by the slider), report what it took.
window.__slide = function (el, v) { const before = el.value; __set(el, String(v)); el.dispatchEvent(new Event('pointerup', { bubbles: true })); return { status: String(el.value) === String(v) ? 'done' : 'partly', note: 'range slider, no text field: set like a drag; the slider snaps to its step (min ' + el.min + ', max ' + el.max + ', step ' + el.step + ')', asked: String(v), before, after: el.value }; };

// Setter for a Velja slider by its label: type into the exact-value field if it has one, else set the slider.
window.__veljaSetter = function (role, name) {
  return async function (v) {
    const i = await __exactInput(name); if (i) { __mark(i, role); return { __type: { role, text: String(v).replace('.', ',') } }; }
    const r = __byLabel(new RegExp('^' + name, 'i'), { sel: 'input[type=range]' }); if (r) { __mark(r, role); return __slide(r, v); }
    return { status: 'could-not-verify', reason: 'no control found by label ' + name };
  };
};
}
