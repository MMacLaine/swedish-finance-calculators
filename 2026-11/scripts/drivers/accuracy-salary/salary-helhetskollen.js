(async()=>{const log=[];const g=document.getElementById('gross-salary');__set(g,'45000');await __sleep(400);
const k=[...document.querySelectorAll('input')].find(i=>/Kommun/i.test((i.labels&&i.labels[0]&&i.labels[0].innerText)||i.getAttribute('aria-label')||''));
k.click();k.focus();await __type(k,'Stockholm');await __sleep(1000);
const opts=[...document.querySelectorAll('button')].filter(e=>/^Stockholm\s*\n?\s*Tabell/.test((e.innerText||'').trim())&&e.getBoundingClientRect().width>0);log.push('opts:'+opts.map(o=>o.innerText.trim().replace(/\s+/g,' ').slice(0,40)).join('/'));
if(opts[0]){opts[0].dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));opts[0].dispatchEvent(new MouseEvent('mousedown',{bubbles:true}));opts[0].dispatchEvent(new MouseEvent('mouseup',{bubbles:true}));opts[0].click();}
await __sleep(2000);
const sec=__find(/Din nettolön per månad/).slice(0,3);const txt=document.body.innerText.replace(/\s+/g,' ');
return {log,readback:{gross:g.value,kommun:k.value},resultText:(txt.match(/Din nettolön per månad.{0,260}/)||[''])[0],money:__money().slice(0,8)};})()
