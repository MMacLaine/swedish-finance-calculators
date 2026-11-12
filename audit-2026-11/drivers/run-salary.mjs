// Salary probes S0 to S5 and S7 (probes.md v3.3) on one site, one fresh Chrome per probe.
//   node run-salary.mjs <site> [--probes S0,S1,S2,S3,S4,S5,S7] [--out file.json]
// Default output: ../results/<site>-salary.json. Records every step: action, input typed, the adapter's
// result for that action, readback of every field, every output read, URL, ISO time, console errors.
// No expected values are read or compared here.
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { ROOT, loadAdapter, Session } from './lib/runner.mjs';
import { sleep } from './lib/cdp.mjs';

const args = process.argv.slice(2);
const site = args[0];
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const probes = opt('--probes', 'S7,S0,S1,S2,S3,S4,S5').split(',');
const out = opt('--out', join(ROOT, '..', 'results', `${site}-salary.json`));
const adapter = loadAdapter(join(ROOT, 'salary', `${site}.js`));

// The canonical case from probes.md S0.
// --rehearse swaps in inputs that are not probe inputs, to exercise every code path before the real run.
const REH = args.includes('--rehearse');
const CANON = REH ? { gross: '38000', municipality: 'Göteborg', parish: 'Göteborgs domkyrkoförsamling', yob: '1985', church: false }
  : { gross: '45000', municipality: 'Stockholm', parish: 'Stockholms domkyrkoförsamling', yob: '1990', church: false };
const DANDERYD = REH ? { municipality: 'Malmö', parish: 'Malmö S:t Petri församling' } : { municipality: 'Danderyd', parish: 'Danderyds församling' };
const BAND = REH ? ['37900', '37901', '38000', '38001'] : ['44900', '44901', '45000', '45001'];
const ODD = REH ? ['7', '-100', '999999999'] : ['0', '-5000', '1000000000'];

async function step(s, name, action, input, fn) {
  s.p.step = name;
  let result = null;
  try { result = fn ? await fn() : null; } catch (e) { result = { status: 'error', error: String(e) }; }
  if (fn && !['calc','read','prepare','locate','read church default','read rate breakdown'].includes(action)) { const c = await s.call('calc'); if (c && c.status && c.status !== 'none') result = { ...(result || {}), calc: c }; }
  return s.record(name, action, input, result);
}

async function setup(s, P, { church = CANON.church, skipChurch = false } = {}) {
  await step(s, P + '.prepare', 'prepare', null, () => s.call('prepare'));
  await step(s, P + '.locate', 'locate', null, () => s.locate());
  await step(s, P + '.yob', 'set birth year', CANON.yob, () => s.call('setYob', CANON.yob));
  await step(s, P + '.municipality', 'set municipality', CANON, () => s.call('setMunicipality', CANON.municipality, CANON.parish));
  if (!skipChurch) await step(s, P + '.church', 'set church fee', church ? 'on' : 'off', () => s.call('setChurch', church, CANON.parish));
  await step(s, P + '.gross', 'type gross', CANON.gross, () => s.call('setGross', CANON.gross));
}

const PROBES = {
  async S7(s) { await step(s, 'S7.asLoaded', 'read', null, null); await step(s, 'S7.afterConsent', 'prepare', null, () => s.call('prepare')); },
  async S0(s) { await setup(s, 'S0'); },
  async S1(s) { await setup(s, 'S1'); for (const v of BAND) await step(s, 'S1.gross=' + v, 'type gross', v, () => s.call('setGross', v)); },
  async S2(s) {
    await setup(s, 'S2');
    await step(s, 'S2.type0', 'type gross over the previous result', ODD[0], () => s.call('setGross', ODD[0]));
    await step(s, 'S2.empty', 'empty the gross field', '', () => s.call('clearGross'));
    await step(s, 'S2.neg', 'type gross', ODD[1], () => s.call('setGross', ODD[1]));
    await step(s, 'S2.huge', 'type gross', ODD[2], () => s.call('setGross', ODD[2]));
  },
  async S3(s) { await setup(s, 'S3'); await step(s, 'S3.danderyd', 'set municipality', DANDERYD, () => s.call('setMunicipality', DANDERYD.municipality, DANDERYD.parish)); },
  async S4(s) {
    await step(s, 'S4.prepare', 'prepare', null, () => s.call('prepare'));
    await step(s, 'S4.churchDefault', 'read church default', null, () => s.call('churchState'));
    await setup(s, 'S4', { skipChurch: true });
    await step(s, 'S4.churchOff', 'set church fee', 'off', () => s.call('setChurch', false, CANON.parish));
    await step(s, 'S4.churchOn', 'set church fee', 'on (' + CANON.parish + ')', () => s.call('setChurch', true, CANON.parish));
  },
  async S5(s) { await setup(s, 'S5'); await step(s, 'S5.rates', 'read rate breakdown', null, () => s.call('rates')); },
};

const result = { site, kind: 'salary', rehearsal: REH, adapter: adapter.path.replace(ROOT + '/', ''), url: adapter.url, viewport: '390x844 mobile', started: new Date().toISOString(), probes: {} };
for (const P of probes) {
  const s = new Session(adapter);
  try {
    await s.open();
    await PROBES[P](s);
    result.probes[P] = { steps: s.steps, docStatus: s.p.docStatus, allErrors: s.p.errors };
  } catch (e) {
    result.probes[P] = { error: String(e && e.stack || e), steps: s.steps };
  } finally { s.close(); await sleep(300); }
  process.stderr.write(`${site} ${P} done (${(result.probes[P].steps || []).length} steps)\n`);
}
result.finished = new Date().toISOString();
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(result, null, 1));
process.stderr.write(`wrote ${out}\n`);
