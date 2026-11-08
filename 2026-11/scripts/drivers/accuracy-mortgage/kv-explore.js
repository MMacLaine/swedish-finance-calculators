(async()=>{try{const sl=ms=>new Promise(r=>setTimeout(r,ms));
const vis=e=>e.offsetWidth>0||e.getClientRects().length>0;
const lab=e=>{let t=e.labels&&e.labels[0]?e.labels[0].innerText:(e.getAttribute('aria-label')||e.placeholder||'');if(!t){const p=e.closest('div');t=p&&p.parentElement?p.parentElement.innerText.slice(0,60):''}return t.trim().replace(/\s+/g,' ').slice(0,70)};
const dump=()=>({inputs:[...document.querySelectorAll('main input,main select')].filter(e=>vis(e)&&e.type!=='hidden').map(e=>({id:e.id,name:e.name,type:e.type,value:e.value,checked:e.checked,label:lab(e)})),buttons:[...document.querySelectorAll('main button')].filter(vis).map(b=>b.innerText.trim().replace(/\s+/g,' ')).filter(t=>t&&t.length<60)});
const btn=re=>[...document.querySelectorAll('main button')].filter(vis).find(b=>re.test(b.innerText.trim()));
const steps=[];
btn(/^Bostadsrätt/).click();await sl(600);btn(/^Nästa$/).click();await sl(1200);steps.push(dump());
return {steps};}catch(e){return {err:String(e)}}})()
