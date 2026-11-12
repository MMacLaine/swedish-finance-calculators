// S6: calculator links in each site's main navigation, and the HTTP status of each.
//   node run-s6.mjs <site|all> [--collect-only] [--out-dir dir] [--limit n (smoke only)]
// Main navigation = links inside <header>, <nav> or [role=navigation] that are not inside <footer> (plus links
// that become visible when the menu button or a collapsed submenu is clicked), collected
// at 390 px (after opening the menu button if there is one) and at 1440 px, from the site's home page and the
// calculator page measured in the November report. A link counts as a calculator link when its URL or text
// matches CALC below. A page with no nav links at all falls back to its footer links (src footer-fallback,
// reported as such). Every nav link is kept with that flag so the classification can be checked by hand.
// Status: every same-site nav link is opened in headless Chrome (main document status, final URL, title, h1, soft-404 text)
// and fetched from Node (GET, redirects followed) as a second reading.
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, HELPERS } from './lib/runner.mjs';
import { launch, sleep, MOBILE_UA } from './lib/cdp.mjs';

const SITES = JSON.parse(readFileSync(join(ROOT, 's6', 'sites.json'), 'utf8'));
const args = process.argv.slice(2);
const which = args[0] || 'all';
const collectOnly = args.includes('--collect-only');
const limit = args.includes('--limit') ? +args[args.indexOf('--limit') + 1] : Infinity; // smoke tests only
const outDir = args.includes('--out-dir') ? args[args.indexOf('--out-dir') + 1] : join(ROOT, '..', 'results');
const CALC = /kalkyl|r[aä]kna|ber[aä]kna|calculator|verktyg|\/tools?\b|ranta-pa-ranta|ränta på ränta|efter[- ]skatt|nettol[oö]n|bruttol[oö]n|l[oö]nev[aä]xl|amorteringskalkyl|budget(kalkyl)?|j[aä]mf[oö]r/i;
const SOFT404 = /\b404\b|sidan (kunde inte hittas|finns inte|hittades inte)|hittades inte|page not found|not found|felsida|n[aå]got gick fel|error/i;

const COLLECT = `(async()=>{
  // SVG <a> elements have an object href, so resolve the attribute instead.
  const H=a=>{ const v=a.getAttribute('href')||a.getAttribute('xlink:href'); if(!v) return null; try{ return new URL(v,location.href).href.split('#')[0]; }catch(e){ return null; } };
  const out=[]; const add=(a,src)=>{ const h=H(a); if(!h||/^(javascript|mailto|tel):/i.test(h))return; if(a.closest('footer'))return;
    out.push({href:h, text:(a.innerText||a.getAttribute('aria-label')||a.title||'').replace(/\\s+/g,' ').trim().slice(0,80), visible:__vis(a), src}); };
  const navs=()=>[...document.querySelectorAll('header, nav, [role=navigation]')].filter(n=>!n.closest('footer'));
  for(const n of navs()) for(const a of n.querySelectorAll('a[href]')) add(a,'dom');
  const lab=b=>((b.innerText||'').trim()||(b.getAttribute('aria-label')||'').trim()).replace(/\s+/g,' ');
  const mb=[...document.querySelectorAll('button,[role=button]')].find(b=>__vis(b)&&(/^(meny|menu|öppna meny|open menu|visa meny|huvudmeny)$/i.test(lab(b))||(/meny|menu/i.test(b.getAttribute('aria-label')||'')&&b.hasAttribute('aria-expanded'))));
  // Links that become visible after a click count as menu links wherever they are rendered (some menus open
  // a drawer outside <header>/<nav>). Submenus: every collapsed button in the nav (aria-expanded=false) is opened.
  const visA=()=>new Set([...document.querySelectorAll('a[href]')].filter(a=>__vis(a)));
  const fresh=(before,src)=>{ for(const a of visA()) if(!before.has(a)) add(a,src); };
  let opened=null, expanded=0;
  if(mb){ const before=visA(); mb.click(); opened=(mb.innerText||mb.getAttribute('aria-label')||'').trim().slice(0,40); await __sleep(1200);
    for(const n of navs()) for(const a of n.querySelectorAll('a[href]')) add(a,'menu-open');
    for(const d of document.querySelectorAll('[role=dialog],[aria-modal=true],[class*=drawer i],[class*=offcanvas i],[class*=mobile-menu i],[class*=mobilemenu i]')) for(const a of d.querySelectorAll('a[href]')) add(a,'menu-open');
    fresh(before,'menu-open'); }
  const subs=[...document.querySelectorAll('header [aria-expanded=false], nav [aria-expanded=false], [role=navigation] [aria-expanded=false], [role=dialog] [aria-expanded=false]')].filter(b=>__vis(b)&&b!==mb&&!b.closest('footer')).slice(0,20);
  for(const b of subs){ const before=visA(); try{ b.click(); }catch(e){} await __sleep(700); fresh(before,'submenu:'+(b.innerText||b.getAttribute('aria-label')||'').trim().slice(0,30)); expanded++; }
  // A site with no header/nav links at all: keep its footer links too, flagged, so the gap is visible.
  let footerFallback=false; if(!out.length){ footerFallback=true; for(const f of document.querySelectorAll('footer')) for(const a of f.querySelectorAll('a[href]')) { const h=H(a); if(h&&!/^(javascript|mailto|tel):/i.test(h)) out.push({href:h, text:(a.innerText||'').replace(/\s+/g,' ').trim().slice(0,80), visible:__vis(a), src:'footer-fallback'}); } }
  return {url:location.href, title:document.title, menuButton:opened, submenusOpened:expanded, footerFallback, links:out};})()`;

async function collect(site) {
  const pages = [];
  for (const W of [390, 1440]) {
    for (const url of site.start) {
      const p = await launch({ width: W, height: W < 600 ? 844 : 1000, seed: HELPERS });
      try {
        await p.goto(url, 6000);
        const consent = await p.eval('__consent()'); await sleep(800);
        const r = await p.eval(COLLECT);
        pages.push({ start: url, width: W, consent, at: new Date().toISOString(), docStatus: p.docStatus, errors: p.errors.length, ...(r && !r.__error ? r : { error: r }) });
      } catch (e) { pages.push({ start: url, width: W, error: String(e) }); } finally { p.close(); }
    }
  }
  const byHref = new Map();
  for (const pg of pages) for (const l of pg.links || []) {
    const k = l.href; const cur = byHref.get(k) || { href: k, texts: new Set(), seenOn: new Set(), visible: false };
    if (l.text) cur.texts.add(l.text); cur.seenOn.add(pg.width + ':' + pg.start + ':' + l.src); cur.visible = cur.visible || l.visible; byHref.set(k, cur);
  }
  const links = [...byHref.values()].map(l => { const texts = [...l.texts]; const calc = CALC.test(l.href) || texts.some(t => CALC.test(t)); let host = ''; try { host = new URL(l.href).hostname; } catch {} return { href: l.href, texts, visible: l.visible, seenOn: [...l.seenOn], calculator: calc, sameSite: host.includes(site.domain) }; });
  return { pages: pages.map(p => ({ ...p, links: (p.links || []).length })), links };
}

async function status(links) {
  const p = await launch({ width: 390, seed: HELPERS });
  const out = [];
  try {
    for (const l of links) {
      const r = { href: l.href };
      try {
        const res = await fetch(l.href, { redirect: 'follow', headers: { 'user-agent': MOBILE_UA, 'accept-language': 'sv-SE,sv;q=0.9', accept: 'text/html' }, signal: AbortSignal.timeout(20000) });
        r.fetch = { status: res.status, finalUrl: res.url, redirected: res.redirected };
      } catch (e) { r.fetch = { error: String(e).slice(0, 160) }; }
      p.docStatus.length = 0; p.step = l.href;
      try {
        await p.goto(l.href, 3500);
                const info = await p.eval(`({url:location.href,title:document.title,h1:((document.querySelector('h1')||{}).innerText||'').trim().slice(0,120),len:document.body?document.body.innerText.length:0,
          inputs:[...document.querySelectorAll('input,select,textarea,[role=combobox],[role=switch]')].filter(e=>!/^(hidden|search|email|password|submit|button|image|reset|file)$/.test(e.type||'')&&!e.closest('header,nav,footer,[role=dialog]')&&__vis(e)).length})`);
        const main = p.docStatus.filter(d => d.step === l.href);
        r.chrome = { statuses: main.map(d => d.status + ' ' + d.url), status: main.length ? main[main.length - 1].status : null, ...info, soft404: SOFT404.test(((info && info.title) || '') + ' ' + ((info && info.h1) || '')) };
        r.calculatorByText = l.calculator; r.calculatorByControls = !!(info && info.inputs >= 2);
      } catch (e) { r.chrome = { error: String(e).slice(0, 160) }; }
      r.at = new Date().toISOString(); out.push(r); await sleep(400);
    }
  } finally { p.close(); }
  return out;
}

const list = which === 'all' ? SITES : SITES.filter(s => s.id === which);
if (!list.length) { console.error('unknown site ' + which); process.exit(2); }
mkdirSync(outDir, { recursive: true });
for (const site of list) {
  const started = new Date().toISOString();
  const c = await collect(site);
  const calcLinks = c.links.filter(l => l.calculator);
  // Every same-site nav link is opened (not only the ones the text rule flags), so a calculator link the rule
  // misses still gets a status; each result says whether the page holds calculator controls (2+ visible inputs).
  const toCheck = c.links.filter(l => l.sameSite && !/logon|login|logga-in|signin|sign-in/i.test(l.href));
  const res = { site: site.id, domain: site.domain, probe: 'S6', started, start: site.start, rule: 'links in header/nav/[role=navigation] outside footer; calculator = URL or text matches ' + CALC, pages: c.pages, navLinks: c.links, calculatorLinksByText: calcLinks.length, checked: toCheck.length };
  if (!collectOnly) { res.status = await status(toCheck.slice(0, limit)); if (limit < Infinity) res.limitedTo = limit; }
  res.finished = new Date().toISOString();
  const f = join(outDir, `${site.id}-s6${collectOnly ? '-collect' : ''}.json`);
  writeFileSync(f, JSON.stringify(res, null, 1));
  process.stderr.write(`${site.id}: ${c.links.length} nav links, ${calcLinks.length} calculator links${collectOnly ? ' (collect only)' : ''} -> ${f}\n`);
}
