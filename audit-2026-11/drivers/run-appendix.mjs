// Appendix probes A1 to A4 (probes.md v3.3), one fresh Chrome per case.
//   node run-appendix.mjs <A1|A2|A3|A4> <site> [--smoke] [--out file.json]
// Adapters: appendix/<a1|a2|a3|a4>-<site>.js. Default output: ../results/<site>-<a1..a4>.json.
// --smoke runs one case with inputs that are NOT probe inputs, only to prove the adapter drives the page.
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { ROOT, loadAdapter, Session } from './lib/runner.mjs';
import { sleep } from './lib/cdp.mjs';

const [group, site, ...rest] = process.argv.slice(2);
const smoke = rest.includes('--smoke');
const out = rest.includes('--out') ? rest[rest.indexOf('--out') + 1] : join(ROOT, '..', 'results', `${site}-${group.toLowerCase()}.json`);
const adapter = loadAdapter(join(ROOT, 'appendix', `${group.toLowerCase()}-${site}.js`));

const PRICE = 4000000;
// Inputs per probes.md. Each case is a list of [role, value] typed in this order.
function cases() {
  const G = group.toUpperCase();
  if (G === 'A1') { const base = [['years', 1], ['return', 0], ['monthly', 0], ...(adapter.extra || [])]; return (smoke ? [400000] : [299999, 300001, 310000, 500000]).map(c => ({ name: 'capital=' + c, inputs: [...base, ['capital', c]] })); }
  if (G === 'A2') return (smoke ? [3000000] : [2796000, 2804000, 3596000, 3600000, 3604000]).map(loan => {
    const dep = PRICE - loan; const how = adapter.loanAs || 'deposit';
    const second = how === 'loan' ? ['loan', loan] : how === 'depositPct' ? ['depositPct', +(dep / PRICE * 100).toFixed(4)] : ['deposit', dep];
    return { name: 'loan=' + loan, loan, price: PRICE, inputs: [...(adapter.extra || []), ['price', PRICE], second] };
  });
  if (G === 'A3') return (smoke ? [40000] : [49000, 50000]).map(g => ({ name: 'gross=' + g, inputs: [...(adapter.extra || []), ['gross', g]] }));
  if (G === 'A4') return (smoke ? [[60000, 3000]] : [[57000, 5000], [70000, 5000]]).map(([g, s]) => ({ name: `gross=${g},swap=${s}`, inputs: [...(adapter.extra || []), ['gross', g], ['swap', s]] }));
  throw new Error('unknown group ' + group);
}

async function step(s, name, action, input, fn) {
  s.p.step = name; let result = null;
  try { result = fn ? await fn() : null; } catch (e) { result = { status: 'error', error: String(e) }; }
  if (fn && !['prepare', 'locate', 'read'].includes(action)) { const c = await s.call('calc'); if (c && c.status && c.status !== 'none') result = { ...(result || {}), calc: c }; }
  return s.record(name, action, input, result);
}

const result = { site, kind: group.toUpperCase(), smoke, adapter: adapter.path.replace(ROOT + '/', ''), url: adapter.url, viewport: '390x844 mobile', started: new Date().toISOString(), cases: {} };
let first = true;
for (const c of cases()) {
  const s = new Session(adapter);
  try {
    await s.open();
    if (first) await step(s, 'defaults.asLoaded', 'read', null, null);
    await step(s, 'prepare', 'prepare', null, () => s.call('prepare'));
    await step(s, 'locate', 'locate', null, () => s.locate());
    for (const [role, v] of c.inputs) await step(s, 'set ' + role, 'set ' + role, v, () => s.call('setInput', role, v));
    await step(s, 'final', 'read', null, async () => { const f = await s.call('finish'); return f && f.__missing ? null : f; });
    result.cases[c.name] = { case: c, steps: s.steps, docStatus: s.p.docStatus, allErrors: s.p.errors };
  } catch (e) { result.cases[c.name] = { case: c, error: String(e && e.stack || e), steps: s.steps }; }
  finally { s.close(); await sleep(300); first = false; }
  process.stderr.write(`${site} ${group} ${c.name} done\n`);
}
result.finished = new Date().toISOString();
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(result, null, 1));
process.stderr.write(`wrote ${out}\n`);
