(async()=>{const log=[];
log.push('year:'+__clickText(/^2026$/,'button'));await __sleep(500);
const r=document.querySelector('input[type=range]');__set(r,'45000');await __sleep(300);
const k=document.getElementById('kommunSelect');k.click();await __type(k,'Stockholm');await __sleep(800);
const opts=[...document.querySelectorAll('[role=option],li')].filter(e=>/^Stockholm\b/.test((e.innerText||'').trim()));log.push('opts:'+opts.map(o=>o.innerText.trim().slice(0,30)).join('/'));
if(opts[0]){opts[0].dispatchEvent(new MouseEvent('mousedown',{bubbles:true}));opts[0].click();}
await __sleep(1500);
const c=document.getElementById('churchMember'),a=document.getElementById('is66Plus');
const yr=[...document.querySelectorAll('button')].filter(b=>/^202[56]$/.test(b.innerText.trim())).map(b=>b.innerText.trim()+':'+(b.getAttribute('aria-pressed')||b.getAttribute('aria-checked')||b.getAttribute('data-state')||b.className.slice(0,40)));
return {log,readback:{salary:r.value,kommun:k.value,church:c.checked,age66:a.checked,yearBtns:yr},money:__money()};})()
