// Discovery: load a page at 390 px, click a consent choice if one shows, and print every control with its
// label, the visible buttons, and the start of the page text. Used to write and repair adapters.
//   node discover.mjs <url> [extra js expression to run first] [WAIT=ms]
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { launch, sleep } from './lib/cdp.mjs';
const here = fileURLToPath(new URL('.', import.meta.url));
const helpers = readFileSync(here + 'lib/helpers.js', 'utf8');
const [url, extra] = process.argv.slice(2);
const p = await launch({ seed: helpers });
try {
  await p.goto(url, +(process.env.WAIT || 6000));
  const consent = await p.eval('__consent()'); await sleep(800);
  const pre = extra ? await p.eval(extra) : null; if (extra) await sleep(1500);
  const out = await p.eval(`({url:location.href,title:document.title,controls:__controls(),
    hiddenControls:[...document.querySelectorAll('input,select,textarea')].filter(e=>!__vis(e)&&!/hidden/.test(e.type)).slice(0,30).map(e=>({label:__labelOf(e),id:e.id,name:e.name,type:e.type,value:__val(e)})),
    buttons:[...document.querySelectorAll('button,[role=button],[role=tab],[role=radio],[role=option]')].filter(__vis).map(b=>(b.innerText||b.getAttribute('aria-label')||'').replace(/\\s+/g,' ').trim().slice(0,40)).filter(Boolean).slice(0,80),
    selects:[...document.querySelectorAll('select')].map(s=>({label:__labelOf(s),id:s.id,n:s.options.length,first:[...s.options].slice(0,5).map(o=>o.value+'|'+o.text),sthlm:[...s.options].filter(o=>/stockholm|danderyd/i.test(o.text)).map(o=>o.value+'|'+o.text).slice(0,8)})),
    text:document.body.innerText.slice(0,+(${JSON.stringify(process.env.TEXT || '4000')})) })`);
  console.log(JSON.stringify({ consent, pre, ...out, errors: p.errors.slice(0, 10), docStatus: p.docStatus }, null, 1));
} finally { p.close(); }
