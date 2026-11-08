// Evaluate an expression in a page (headless Chrome, CDP). node _local/scripts/probe.mjs <url> '<js expression>'
// env SEED='js' runs before load, WAIT=ms (default 2500), W/H=viewport (default 1440x1000; W<600 emulates a phone). Prints the JSON result. Handy for reading a
// competitor calculator's output after setting inputs.
import { spawn } from 'node:child_process'; import { mkdtempSync } from 'node:fs'; import { tmpdir } from 'node:os'; import { join } from 'node:path';
const CHROME=process.env.CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', PORT=9333+Math.floor(Math.random()*400);
const [url, expr] = process.argv.slice(2); const sleep=ms=>new Promise(r=>setTimeout(r,ms)); let _id=0;
function rpc(ws,m,p={}){return new Promise((res,rej)=>{const id=++_id;const on=ev=>{const x=JSON.parse(ev.data);if(x.id===id){ws.removeEventListener('message',on);x.error?rej(new Error(x.error.message)):res(x.result);}};ws.addEventListener('message',on);ws.send(JSON.stringify({id,method:m,params:p}));});}
const c=spawn(CHROME,['--headless=new',`--remote-debugging-port=${PORT}`,`--user-data-dir=${mkdtempSync(join(tmpdir(),'pr-'))}`,'--lang=sv-SE','about:blank'],{stdio:'ignore'});
let t;for(let i=0;i<50;i++){try{t=(await(await fetch(`http://localhost:${PORT}/json`)).json()).find(x=>x.type==='page');if(t?.webSocketDebuggerUrl)break;}catch{}await sleep(200);}
const ws=new WebSocket(t.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));
const errs=[];ws.addEventListener('message',ev=>{const m=JSON.parse(ev.data);if(m.method==='Runtime.exceptionThrown')errs.push((m.params.exceptionDetails.exception?.description||'').split('\n')[0]);});
await rpc(ws,'Page.enable');await rpc(ws,'Runtime.enable');await rpc(ws,'Emulation.setDeviceMetricsOverride',{width:+(process.env.W||1440),height:+(process.env.H||1000),deviceScaleFactor:1,mobile:+(process.env.W||1440)<600});
if (+(process.env.W||1440)<600){await rpc(ws,'Emulation.setDeviceMetricsOverride',{width:+process.env.W,height:+(process.env.H||844),deviceScaleFactor:2,mobile:true});await rpc(ws,'Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5});await rpc(ws,'Emulation.setUserAgentOverride',{userAgent:'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',platform:'Android'});}
if (process.env.SEED) await rpc(ws,'Page.addScriptToEvaluateOnNewDocument',{source:process.env.SEED});
await rpc(ws,'Page.navigate',{url});await sleep(+(process.env.WAIT||2500));
const r=await rpc(ws,'Runtime.evaluate',{expression:expr,returnByValue:true,awaitPromise:true});console.log(JSON.stringify(r.result.value,null,1));
if(errs.length)console.log('JS ERRORS',errs.slice(0,5));ws.close();c.kill();
