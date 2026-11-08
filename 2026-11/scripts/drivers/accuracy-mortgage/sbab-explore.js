(async()=>{try{const sl=ms=>new Promise(r=>setTimeout(r,ms));
const vis=e=>e.offsetWidth>0||e.getClientRects().length>0;
const dump=()=>({inputs:[...document.querySelectorAll('input,select')].filter(e=>vis(e)&&e.type!=='hidden').map(e=>({id:e.id,name:e.name,type:e.type,value:e.value,checked:e.checked,label:(e.labels&&e.labels[0]?e.labels[0].innerText:e.getAttribute('aria-label')||'').trim().slice(0,70)})),buttons:[...document.querySelectorAll('button')].filter(vis).map(b=>b.innerText.trim()).filter(t=>t&&t.length<40).slice(-20)});
const cb=[...document.querySelectorAll('button')].find(b=>/nödvändiga|neka|avvisa/i.test(b.innerText||''));const cookie=cb?cb.innerText.trim():null;if(cb){cb.click();await sl(800);}
const steps=[];steps.push(dump());
let r;for(let i=0;i<20&&!r;i++){r=[...document.querySelectorAll('input[type=radio]')].find(x=>x.value==='condo');if(!r)await sl(500);}if(!r)return {cookie,steps,noRadio:document.querySelectorAll('input').length};(r.labels[0]||r).click();await sl(1500);steps.push(dump());
const main=document.querySelector('main')||document.body;steps.push({text:main.innerText.slice(main.innerText.indexOf('Om ditt nya boende'),main.innerText.indexOf('Om ditt nya boende')+1500)});
return {cookie,steps};}catch(e){return {err:String(e)}}})()
