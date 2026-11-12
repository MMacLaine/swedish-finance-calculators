// Minimal headless Chrome driver over CDP, a variant of _local/scripts/probe.mjs for the audit v3.3 drivers.
// Differences from probe.mjs: a free port picked by Chrome (--remote-debugging-port=0), several evaluate calls
// per load, console errors collected with the step they happened in, page reloads (form posts) survived,
// and the main document's HTTP status recorded. Zero dependencies (Node 22+ for the global WebSocket).
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
export const sleep = ms => new Promise(r => setTimeout(r, ms));
export const MOBILE_UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36';

export async function launch({ width = +(process.env.W || 390), height = +(process.env.H || 844), seed = '' } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'av3-'));
  const proc = spawn(CHROME, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${dir}`, '--lang=sv-SE',
    '--no-first-run', '--no-default-browser-check', '--disable-features=Translate', 'about:blank'], { stdio: 'ignore' });
  let port;
  for (let i = 0; i < 100 && !port; i++) {
    const f = join(dir, 'DevToolsActivePort');
    if (existsSync(f)) { const s = readFileSync(f, 'utf8').split('\n')[0]; if (s) port = +s; }
    if (!port) await sleep(100);
  }
  if (!port) { proc.kill(); throw new Error('Chrome did not open a debugging port'); }
  let target;
  for (let i = 0; i < 50; i++) {
    try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(x => x.type === 'page'); if (target?.webSocketDebuggerUrl) break; } catch {}
    await sleep(100);
  }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.addEventListener('open', res, { once: true }); ws.addEventListener('error', rej, { once: true }); });
  const page = new Page(ws, proc, dir);
  await page.init({ width, height, seed });
  return page;
}

class Page {
  constructor(ws, proc, dir) {
    this.ws = ws; this.proc = proc; this.dir = dir; this.id = 0; this.step = 'load';
    this.errors = []; this.docStatus = []; this.loads = 0; this.mainFrame = null;
    ws.addEventListener('message', ev => {
      const m = JSON.parse(ev.data);
      if (m.method === 'Runtime.exceptionThrown') {
        const d = m.params.exceptionDetails;
        this.errors.push({ step: this.step, kind: 'exception', text: ((d.exception && d.exception.description) || d.text || '').split('\n')[0].slice(0, 300) });
      } else if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') {
        this.errors.push({ step: this.step, kind: 'console.error', text: m.params.args.map(a => a.value ?? a.description ?? '').join(' ').slice(0, 300) });
      } else if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') {
        this.errors.push({ step: this.step, kind: 'log:' + m.params.entry.source, text: (m.params.entry.text || '').slice(0, 300), url: m.params.entry.url });
      } else if (m.method === 'Network.responseReceived' && m.params.type === 'Document' && (!this.mainFrame || m.params.frameId === this.mainFrame)) {
        this.docStatus.push({ step: this.step, url: m.params.response.url, status: m.params.response.status });
      } else if (m.method === 'Page.loadEventFired') {
        this.loads++;
      } else if (m.method === 'Page.frameNavigated' && !m.params.frame.parentId) {
        this.mainFrame = m.params.frame.id;
      }
    });
  }
  rpc(method, params = {}, timeout = 60000) {
    return new Promise((res, rej) => {
      const id = ++this.id;
      const t = setTimeout(() => { this.ws.removeEventListener('message', on); rej(new Error('timeout ' + method)); }, timeout);
      const on = ev => { const x = JSON.parse(ev.data); if (x.id === id) { clearTimeout(t); this.ws.removeEventListener('message', on); x.error ? rej(new Error(x.error.message)) : res(x.result); } };
      this.ws.addEventListener('message', on);
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async init({ width, height, seed }) {
    await this.rpc('Page.enable'); await this.rpc('Runtime.enable'); await this.rpc('Log.enable'); await this.rpc('Network.enable');
    const mobile = width < 600;
    await this.rpc('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: mobile ? 2 : 1, mobile });
    if (mobile) {
      await this.rpc('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
      await this.rpc('Emulation.setUserAgentOverride', { userAgent: MOBILE_UA, platform: 'Android', acceptLanguage: 'sv-SE,sv;q=0.9' });
    }
    if (seed) await this.rpc('Page.addScriptToEvaluateOnNewDocument', { source: seed });
  }
  async goto(url, wait = 6000) {
    const before = this.loads;
    await this.rpc('Page.navigate', { url });
    for (let i = 0; i < 60 && this.loads === before; i++) await sleep(250);
    await sleep(wait);
  }
  // Evaluate an expression (may return a promise). If the page navigates while it runs (a form post),
  // wait for the new document to load and report that instead of failing.
  async eval(expr, { timeout = 90000, settle = 4000 } = {}) {
    const before = this.loads;
    try {
      const r = await this.rpc('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }, timeout);
      if (r.exceptionDetails) return { __error: ((r.exceptionDetails.exception && r.exceptionDetails.exception.description) || r.exceptionDetails.text || '').split('\n')[0] };
      return r.result.value;
    } catch (e) {
      if (/context was destroyed|navigated|Cannot find context/i.test(e.message)) {
        for (let i = 0; i < 80 && this.loads === before; i++) await sleep(250);
        await sleep(settle);
        return { __navigated: true };
      }
      return { __error: e.message };
    }
  }
  async url() { const v = await this.eval('location.href'); return typeof v === 'string' ? v : null; }
  close() { try { this.ws.close(); } catch {} try { this.proc.kill('SIGKILL'); } catch {} setTimeout(() => { try { rmSync(this.dir, { recursive: true, force: true }); } catch {} }, 1500); }
}
