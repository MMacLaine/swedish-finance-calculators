// Shared Node-side machinery for the audit v3.3 drivers: load an adapter, open a fresh Chrome per probe,
// type like a person (real CDP key events, then leave the field), and record every step.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { launch, sleep } from './cdp.mjs';

export const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
export const HELPERS = readFileSync(join(ROOT, 'lib/helpers.js'), 'utf8');

// An adapter is a page-side .js file. Its first line is `// @meta {json}` with url, wait (ms after load),
// settle (ms after each input). The rest defines window.__A (see README).
export function loadAdapter(path) {
  const src = readFileSync(path, 'utf8');
  const m = src.match(/^\/\/ @meta (\{.*\})\s*$/m);
  if (!m) throw new Error('adapter has no // @meta line: ' + path);
  const meta = JSON.parse(m[1]);
  return { ...meta, src, path, seed: HELPERS + (process.env.BODY ? '\nwindow.__BODY=1;\n' : '') + (process.env.A2_HB_INCOME ? '\nwindow.__HB_INCOME=' + JSON.stringify(process.env.A2_HB_INCOME) + ';\n' : '') + (process.env.A2_HB_FEE ? '\nwindow.__HB_FEE=' + JSON.stringify(process.env.A2_HB_FEE) + ';\n' : '') + '\nif (window.top === window) {\n' + src + '\n}\n' };
}

const KEYS = { '-': ['Minus', 189], ' ': ['Space', 32], ',': ['Comma', 188], '.': ['Period', 190] };
function keyFor(ch) { if (/\d/.test(ch)) return { code: 'Digit' + ch, vk: 48 + +ch }; const k = KEYS[ch]; return k ? { code: k[0], vk: k[1] } : { code: '', vk: ch.toUpperCase().charCodeAt(0) }; }

export class Session {
  constructor(adapter) { this.a = adapter; this.steps = []; }
  async open() {
    this.p = await launch({ seed: this.a.seed });
    this.p.step = 'load';
    await this.p.goto(this.a.url, this.a.wait ?? 6000);
    return this;
  }
  close() { this.p && this.p.close(); }
  async call(fn, ...args) {
    // Call an adapter method; follow {__type:{role,text}, then:'method', args:[...]} requests for real typing.
    let r = await this.p.eval(`(async()=>{ if(!window.__A) return {__error:'adapter not loaded'}; const f=__A[${JSON.stringify(fn)}]; if(!f) return {__missing:true}; return await f.apply(__A, ${JSON.stringify(args)}); })()`);
    for (let hops = 0; r && r.__type && hops < 12; hops++) {
      const t = r.__type;
      if (t.click) await this.clickRole(t.role);
      else if (t.clear) await this.clearRole(t.role, t.blur !== false);
      else if (t.combo) await this.typeCombo(t.role, t.text);
      else await this.typeRole(t.role, t.text, t.blur !== false);
      await sleep(t.wait ?? 900);
      if (!r.then) { r = { status: 'done', typed: t }; break; }
      const next = r.then, nargs = r.args || [];
      r = await this.p.eval(`(async()=>await __A[${JSON.stringify(next)}].apply(__A, ${JSON.stringify(nargs)}))()`);
    }
    return r;
  }
  async key(type, ch, extra = {}) {
    const k = keyFor(ch);
    await this.p.rpc('Input.dispatchKeyEvent', { type, key: ch, code: k.code, windowsVirtualKeyCode: k.vk, nativeVirtualKeyCode: k.vk, ...(type === 'keyDown' ? { text: ch, unmodifiedText: ch } : {}), ...extra });
  }
  async focusRole(role) {
    return this.p.eval(`(()=>{const e=__marked(${JSON.stringify(role)});if(!e)return false;e.scrollIntoView({block:'center',behavior:'instant'});e.focus();try{e.select&&e.select()}catch(x){}return document.activeElement===e;})()`);
  }
  // A real mouse click at the centre of a marked element (for custom dropdowns that ignore synthetic clicks).
  // The scroll is instant and the box is measured after it: on pages with scroll-behavior:smooth a measure taken
  // mid-scroll sends the click somewhere else (spiris "Ja" landed in the result area). this.lastClick records
  // whether the point hit the element.
  async clickRole(role) {
    const c = await this.p.eval(`(async()=>{const e=__marked(${JSON.stringify(role)});if(!e)return null;e.scrollIntoView({block:'center',behavior:'instant'});await __sleep(150);const r=e.getBoundingClientRect();const x=r.left+r.width/2,y=r.top+r.height/2;const h=document.elementFromPoint(x,y);return {x,y,hit:!!h&&(h===e||e.contains(h)||h.contains(e))};})()`);
    this.lastClick = { role, ...(c || {}) };
    if (!c || c.__error) return false;
    for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await this.p.rpc('Input.dispatchMouseEvent', { type, x: c.x, y: c.y, button: 'left', clickCount: type === 'mouseMoved' ? 0 : 1 });
    return true;
  }
  async selectAll() {
    await this.p.rpc('Input.dispatchKeyEvent', { type: 'keyDown', key: 'a', code: 'KeyA', windowsVirtualKeyCode: 65, modifiers: process.platform === 'darwin' ? 4 : 2, commands: ['selectAll'] });
    await this.p.rpc('Input.dispatchKeyEvent', { type: 'keyUp', key: 'a', code: 'KeyA', windowsVirtualKeyCode: 65, modifiers: process.platform === 'darwin' ? 4 : 2 });
  }
  async selectAllDelete() {
    await this.p.rpc('Input.dispatchKeyEvent', { type: 'keyDown', key: 'a', code: 'KeyA', windowsVirtualKeyCode: 65, modifiers: process.platform === 'darwin' ? 4 : 2, commands: ['selectAll'] });
    await this.p.rpc('Input.dispatchKeyEvent', { type: 'keyUp', key: 'a', code: 'KeyA', windowsVirtualKeyCode: 65, modifiers: process.platform === 'darwin' ? 4 : 2 });
    await this.p.rpc('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Backspace', code: 'Backspace', windowsVirtualKeyCode: 8 });
    await this.p.rpc('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Backspace', code: 'Backspace', windowsVirtualKeyCode: 8 });
  }
  async blurRole(role) { await this.p.eval(`(()=>{const e=__marked(${JSON.stringify(role)});if(e){e.blur();}return true;})()`); }
  // Typing like a person: focus the field, select what is there, type over the selection key by key, then
  // leave the field. (The first key replaces the selection, so the field is never left empty in between.)
  async typeRole(role, text, blur = true) {
    const ok = await this.focusRole(role); if (!ok) return false;
    await this.selectAll(); await sleep(60);
    for (const ch of String(text)) { await this.key('keyDown', ch); await this.key('keyUp', ch); await sleep(45); }
    await sleep(150); if (blur) await this.blurRole(role);
    return true;
  }
  // Typing a name into a combobox that already shows a choice: click into the field, empty it (select all,
  // Backspace), pause, then type the name and leave the field focused so its list stays open. Typing over the
  // selection instead loses the first key on comboboxes that reset their text on the first input after a pick.
  async typeCombo(role, text) {
    if (!await this.clickRole(role)) return false; await sleep(250);
    const ok = await this.focusRole(role); if (!ok) return false;
    await this.selectAllDelete(); await sleep(350);
    for (const ch of String(text)) { await this.key('keyDown', ch); await this.key('keyUp', ch); await sleep(45); }
    await sleep(150); return true;
  }
  async clearRole(role, blur = true) {
    const ok = await this.focusRole(role); if (!ok) return false;
    await this.selectAllDelete(); await sleep(150); if (blur) await this.blurRole(role); return true;
  }
  async calc() { const r = await this.call('calc'); await sleep(this.a.settle ?? 1500); return r && r.__missing ? null : r; }
  async locate() { return this.call('locate'); }
  async record(step, action, input, result) {
    this.p.step = step;
    await sleep(this.a.settle ?? 1500);
    const readback = await this.call('readback');
    const output = await this.call('read');
    const url = await this.p.url();
    const errors = this.p.errors.filter(e => e.step === step);
    const rec = { step, action, input, result, readback, output, url, at: new Date().toISOString(), errors };
    this.steps.push(rec); return rec;
  }
}

export const isCNV = r => r && (r.status === 'could-not-verify' || r.__missing || r.__error);
