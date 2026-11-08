(async()=>{try{const sl=ms=>new Promise(r=>setTimeout(r,ms));
const vis=e=>e.offsetWidth>0||e.getClientRects().length>0;
const btn=re=>[...document.querySelectorAll('main button')].filter(vis).find(b=>re.test(b.innerText.trim()));
btn(/^Bostadsrätt/).click();await sl(600);btn(/^Nästa$/).click();await sl(1200);
const ins=()=>[...document.querySelectorAll('main input')].filter(e=>vis(e)&&e.type==='text');
const ctx=e=>{let n=e;for(let i=0;i<4&&n;i++){n=n.parentElement;const t=(n.innerText||'').trim();if(t.replace(e.value,'').trim().length>3)return t.replace(/\s+/g,' ').slice(0,90);}return ''};
const stepText=(document.querySelector('main form')||document.querySelector('main')).innerText.slice(0,1500);
const before=ins().map(e=>[ctx(e),e.value]);
const i0=ins();__set(i0[0],'4000000');i0[0].blur();await sl(400);__set(ins()[1],'400000');ins()[1].blur();await sl(600);
const read=ins().map(e=>[ctx(e),e.value]);
btn(/^Visa resultat$/).click();await sl(1500);const d=btn(/^Visa detaljerade siffror$/);if(d){d.click();await sl(1200);}
const t=document.querySelector('main').innerText;const k=t.indexOf('Resultat');
return {before,read,result:t.slice(Math.max(0,t.search(/Månadskostnad|Resultat\n/)),Math.max(0,t.search(/Månadskostnad|Resultat\n/))+3500),amortLines:[...t.matchAll(/[^\n]{0,60}[Aa]mortering[^\n]{0,60}(\n[^\n]{0,40})?/g)].map(m=>m[0].replace(/\n/g,' | ')).slice(0,15)};}catch(e){return {err:String(e)}}})()
