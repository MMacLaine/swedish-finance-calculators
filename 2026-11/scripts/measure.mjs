// Round 3 copy of _local/scripts/compete-measure.mjs, extended: page weight (sum of CDP Network.loadingFinished encodedDataLength,
// i.e. bytes over the wire incl. headers, at snapshot time and again after any ACT), per-type weight, and ACT_<id> may be a path to a .js file
// (acts/_helpers.js is prepended so __find/__set are available). failedDetail lists each failed request with its net:: error
// (ERR_NAME_NOT_RESOLVED there usually means a DNS filter on the measuring machine blocked the host). Run from the repo root:
//   WAIT=8000 node _local/competitive/round3/objective/measure.mjs _local/competitive/round3/objective/raw id=url ...
// Competitive measure (headless Chrome over CDP, no deps). Fresh profile per page, phone emulation 390x844.
// Part 1 privacy BEFORE any interaction: requests, third-party hosts, tracker hosts, cookies, storage, consent banner.
// Part 2 time-to-answer: visible inputs and money-looking text with document y, plus a fold screenshot.
// node _local/scripts/compete-measure.mjs <outdir> <id>=<url> [<id>=<url> ...]
//   env WAIT=ms before the privacy snapshot (default 8000). env ACT_<id>='js' runs AFTER the snapshot
//   (e.g. type 45000) and is followed by a second scan + screenshot "<id>-after.png".
// Writes <outdir>/<id>.json, <id>-fold.png. Run several at once: each instance picks its own port.
import { spawn } from 'node:child_process'; import { mkdtempSync, writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname } from 'node:path'; import { tmpdir } from 'node:os'; import { join } from 'node:path';
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36';
const [outdir, ...pairs] = process.argv.slice(2); mkdirSync(outdir, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Registrable domain: last two labels, three for second-level public suffixes like co.uk / com.au.
const SLD = new Set(['co', 'com', 'org', 'net', 'gov', 'ac', 'edu']);
function reg(host) { const p = host.split('.'); if (p.length <= 2) return host; return (SLD.has(p[p.length - 2]) && p[p.length - 1].length === 2) ? p.slice(-3).join('.') : p.slice(-2).join('.'); }
// Known ad / analytics / tag / session-replay hosts (by registrable domain or host substring).
const TRACK = /(google-analytics|googletagmanager|doubleclick|googlesyndication|googleadservices|adservice\.google|google\.com\/(pagead|ads)|facebook\.(net|com)|fbcdn|connect\.facebook|hotjar|clarity\.ms|bat\.bing|cloudflareinsights|plausible|umami|matomo|piwik|segment\.(io|com)|mixpanel|amplitude|heap(analytics)?|fullstory|mouseflow|crazyegg|newrelic|nr-data|datadoghq|browser-intake|sentry|adnxs|criteo|taboola|outbrain|adform|adtraction|adrecord|tradedoubler|awin|linkedin|licdn|ads-twitter|analytics\.tiktok|tiktok|snapchat|sc-static|pinterest|pinimg|demdex|omtrdc|adobedtm|everesttech|hubspot|hs-analytics|hs-scripts|intercom|vwo|optimizely|kameleoon|yandex|quantserve|scorecardresearch|chartbeat|parsely|pubmatic|rubiconproject|openx|casalemedia|teads|smartadserver|amazon-adsystem|id5-sync|onetag|sharethrough|33across|lijit|gumgum|richaudience|livewrapped|relevant-digital|seenthis|leeads|emerse|siteimprove|trustpilot|cookieless|gstatic\.com\/(gsi|recaptcha)|googleoptimize|tagcommander|tealium|piano|cxense|sleeknote|vimeo|youtube|ytimg|mparticle|braze|klaviyo|clickcease|bidswitch|rlcdn|agkn|bluekai|mathtag|adsrvr|turn\.com|crwdcntrl|krxd|exelator|eyeota|adition|ad\.gt|addthis|sharethis|zemanta|dotomi|imrworldwide|gemius|kantar|sifo|orvesto|cint|mediaplex|zenaps|partnerize|prf\.hn|impact|tapfiliate|post-affiliate|snigel|adthrive|mediavine|ezoic|ezodn|monumetric|freestar|venatus|nitropay|playwire|setupad)/i;
const CMP = /(cookiebot|consentmanager|onetrust|cookielaw|usercentrics|didomi|quantcast\.mgr|consensu\.org|fundingchoicesmessages|cookieinformation|cookie-script|cookiefirst|termly|iubenda|trustarc|sourcepoint|privacy-mgmt|cookieyes|complianz|axeptio|klaro|osano|cmp\.)/i;

const SCAN = `(function(){
 const vis=e=>{const s=getComputedStyle(e);if(s.display==='none'||s.visibility==='hidden'||+s.opacity===0)return false;const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
 const fixedAnc=e=>{for(let n=e;n&&n.nodeType===1;n=n.parentElement||(n.getRootNode&&n.getRootNode().host)){const p=getComputedStyle(n).position;if(p==='fixed'||p==='sticky')return p;}return '';};
 const all=[];const walk=root=>{for(const e of root.querySelectorAll('*')){all.push(e);if(e.shadowRoot)walk(e.shadowRoot);}};walk(document);
 const lab=e=>{let t='';if(e.labels&&e.labels[0])t=e.labels[0].innerText;if(!t)t=e.getAttribute('aria-label')||e.placeholder||e.name||e.id||'';return t.trim().replace(/\\s+/g,' ').slice(0,50);};
 const inputs=all.filter(e=>/^(INPUT|SELECT|TEXTAREA)$/.test(e.tagName)&&!/^(hidden|submit|button|image|reset|search)$/i.test(e.type||'')&&vis(e)).map(e=>{const r=e.getBoundingClientRect();return {tag:e.tagName.toLowerCase(),type:e.type||'',label:lab(e),value:String(e.value).slice(0,20),y:Math.round(r.top+scrollY),x:Math.round(r.left),fixed:fixedAnc(e)};});
 const money=[];for(const e of all){if(!vis(e))continue;const own=[...e.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join(' ').replace(/\\s+/g,' ').trim();
  if(!own||own.length>80)continue;if(!/\\d[\\d\\s\\u00a0.,]{3,}\\s*(kr|sek|:-)?/i.test(own)&&!/\\d\\s?\\d{3}/.test(own))continue;const r=e.getBoundingClientRect();
  money.push({t:own.slice(0,60),y:Math.round(r.top+scrollY),h:Math.round(r.height),fs:parseFloat(getComputedStyle(e).fontSize),fixed:fixedAnc(e)});if(money.length>80)break;}
 const re=/cookie|kakor|samtycke|consent|godkänn|acceptera|accept all|personuppgift|integritet/i;const ban=[];
 for(const e of all){if(!vis(e))continue;const s=getComputedStyle(e);const z=parseInt(s.zIndex)||0;if(!(s.position==='fixed'||s.position==='sticky'||e.tagName==='DIALOG'||z>=1000))continue;const r=e.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)continue;const t=(e.innerText||e.textContent||'').replace(/\\s+/g,' ').trim();if(!re.test(t))continue;ban.push({tag:e.tagName.toLowerCase(),id:e.id,cls:String(e.className).slice(0,40),top:Math.round(r.top),h:Math.round(r.height),w:Math.round(r.width),pctViewport:Math.round(100*Math.min(r.height,innerHeight)*Math.min(r.width,innerWidth)/(innerHeight*innerWidth)),text:t.slice(0,140)});}
 const iframes=[...document.querySelectorAll('iframe')].map(f=>f.src).filter(Boolean).slice(0,20);
 let ls=[],ss=[];try{ls=Object.keys(localStorage);}catch(e){ls=['ERR']}try{ss=Object.keys(sessionStorage);}catch(e){ss=['ERR']}
 return {title:document.title,url:location.href,docH:document.documentElement.scrollHeight,inputs,money,banners:ban.slice(0,6),iframes,ls,ss,sw:!!(navigator.serviceWorker&&navigator.serviceWorker.controller)};
})()`;

async function one(id, url) {
  const PORT = 9400 + Math.floor(Math.random() * 500);
  const c = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'cm-'))}`, '--hide-scrollbars', '--lang=sv-SE', '--disable-features=IsolateOrigins,site-per-process', '--no-first-run', 'about:blank'], { stdio: 'ignore' });
  let t; for (let i = 0; i < 60; i++) { try { t = (await (await fetch(`http://localhost:${PORT}/json`)).json()).find(x => x.type === 'page'); if (t?.webSocketDebuggerUrl) break; } catch {} await sleep(200); }
  const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise(r => ws.addEventListener('open', r, { once: true }));
  let _id = 0; const rpc = (m, p = {}) => new Promise((res, rej) => { const i = ++_id; const on = ev => { const x = JSON.parse(ev.data); if (x.id === i) { ws.removeEventListener('message', on); x.error ? rej(new Error(x.error.message)) : res(x.result); } }; ws.addEventListener('message', on); ws.send(JSON.stringify({ id: i, method: m, params: p })); });
  const reqs = []; const failed = []; const rtype = {}; const bytes = {};
  ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (m.method === 'Network.requestWillBeSent') { reqs.push({ u: m.params.request.url, type: m.params.type || '' }); rtype[m.params.requestId] = { url: m.params.request.url.slice(0, 160), type: m.params.type || 'Other', host: (()=>{try{return new URL(m.params.request.url).hostname}catch{return ''}})() }; } if (m.method === 'Network.loadingFinished') bytes[m.params.requestId] = m.params.encodedDataLength || 0; if (m.method === 'Network.loadingFailed') failed.push({ err: m.params.errorText, blocked: m.params.blockedReason || '', canceled: !!m.params.canceled, url: (rtype[m.params.requestId] || {}).url || '' }); });
  const weigh = (site) => { let total = 0, third = 0; const byType = {}; for (const [k, b] of Object.entries(bytes)) { total += b; const t = rtype[k] || { type: 'Other', host: '' }; byType[t.type] = (byType[t.type] || 0) + b; if (site && t.host && reg(t.host) !== site) third += b; } return { totalKB: Math.round(total / 1024), thirdPartyKB: Math.round(third / 1024), finished: Object.keys(bytes).length, byTypeKB: Object.fromEntries(Object.entries(byType).map(([k, v]) => [k, Math.round(v / 1024)]).sort((a, b) => b[1] - a[1])) }; };
  await rpc('Network.enable'); await rpc('Page.enable'); await rpc('Runtime.enable');
  await rpc('Network.setUserAgentOverride', { userAgent: UA, acceptLanguage: 'sv-SE,sv;q=0.9,en;q=0.8', platform: 'Android' });
  await rpc('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await rpc('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  const ev = async e => { try { return (await rpc('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true })).result.value; } catch (err) { return { err: String(err) }; } };
  await rpc('Page.navigate', { url }); await sleep(+(process.env.WAIT || 8000));
  // Part 1 snapshot, no interaction yet.
  const cookies = (await rpc('Network.getAllCookies')).cookies;
  const scan = await ev(SCAN);
  const site = reg(new URL(scan.url || url).hostname);
  const hosts = {}; for (const r of reqs) { if (!/^https?:/.test(r.u)) continue; const h = new URL(r.u).hostname; hosts[h] = (hosts[h] || 0) + 1; }
  const third = Object.keys(hosts).filter(h => reg(h) !== site);
  const trackers = Object.keys(hosts).filter(h => TRACK.test(h) || reqs.some(r => r.u.includes(h) && TRACK.test(r.u.split('?')[0])) ).filter(h => reg(h) !== site || TRACK.test(h));
  const cmps = Object.keys(hosts).filter(h => CMP.test(h));
  const shot = await rpc('Page.captureScreenshot', { format: 'png' }); writeFileSync(join(outdir, `${id}-fold.png`), Buffer.from(shot.data, 'base64'));
  const res = { id, url, finalUrl: scan.url, site, at: new Date().toISOString(), requests: reqs.filter(r => /^https?:/.test(r.u)).length, failed: failed.length, failedDetail: failed,
    thirdPartyHosts: third.sort(), thirdPartyDomains: [...new Set(third.map(reg))].sort(), trackerHosts: [...new Set(trackers)].sort(), cmpHosts: cmps,
    cookies: cookies.map(k => ({ name: k.name, domain: k.domain, thirdParty: reg(k.domain.replace(/^\./, '')) !== site, session: k.session, httpOnly: k.httpOnly, sameSite: k.sameSite, expiresDays: k.session ? 0 : Math.round((k.expires * 1000 - Date.now()) / 864e5) })),
    weight: weigh(site),
    reqUrls: reqs.filter(r => /^https?:/.test(r.u)).map(r => r.type + " " + r.u.slice(0, 160)).slice(0, 400), trackerUrls: reqs.filter(r => TRACK.test(r.u.split('?')[0])).map(r => r.u.slice(0, 140)).slice(0, 40), allHosts: hosts, scan };
  let act = process.env['ACT_' + id];
  if (act && /\.js$/.test(act) && existsSync(act)) { const here = dirname(fileURLToPath(import.meta.url)); act = readFileSync(join(here, 'acts', '_helpers.js'), 'utf8') + '\n' + readFileSync(act, 'utf8'); res.actFile = process.env['ACT_' + id]; }
  if (act) { res.act = await ev(act); await sleep(2500); res.after = await ev(SCAN); const s2 = await rpc('Page.captureScreenshot', { format: 'png' }); writeFileSync(join(outdir, `${id}-after.png`), Buffer.from(s2.data, 'base64')); res.weightAfter = weigh(site); res.requestsAfter = reqs.length; }
  writeFileSync(join(outdir, `${id}.json`), JSON.stringify(res, null, 1));
  console.log(id, 'req', res.requests, 'KB', res.weight.totalKB, '3p', res.thirdPartyDomains.length, 'trk', res.trackerHosts.length, 'cookies', cookies.length, 'banner', res.scan.banners?.length);
  ws.close(); c.kill();
}
for (const p of pairs) { const i = p.indexOf('='); try { await one(p.slice(0, i), p.slice(i + 1)); } catch (e) { console.log(p, 'ERR', e.message); } }
