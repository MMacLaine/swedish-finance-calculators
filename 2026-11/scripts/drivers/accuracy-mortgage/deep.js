(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));
const all=[];const walk=root=>{for(const e of root.querySelectorAll('*')){all.push(e);if(e.shadowRoot)walk(e.shadowRoot);}};walk(document);
const btns=all.filter(e=>/^(BUTTON|A)$/.test(e.tagName)||e.getAttribute&&e.getAttribute('role')==='button').map(b=>(b.innerText||b.textContent||'').trim().replace(/\s+/g,' ').slice(0,50)).filter(Boolean);
const inputs=all.filter(e=>/^(INPUT|SELECT|TEXTAREA)$/.test(e.tagName)&&!/hidden/.test(e.type)).map(e=>{const r=e.getBoundingClientRect();return {tag:e.tagName,type:e.type,name:e.name,id:e.id,aria:e.getAttribute('aria-label'),ph:e.placeholder,value:e.value,w:Math.round(r.width),y:Math.round(r.top+scrollY),shadow:e.getRootNode()!==document}});
const sliders=all.filter(e=>e.getAttribute&&e.getAttribute('role')==='slider').map(e=>({aria:e.getAttribute('aria-label'),now:e.getAttribute('aria-valuenow'),txt:e.getAttribute('aria-valuetext')}));
return {url:location.href,btns:[...new Set(btns)].slice(0,80),inputs:inputs.slice(0,40),sliders,custom:[...new Set(all.map(e=>e.tagName).filter(t=>t.includes('-')))].slice(0,30),text:document.body.innerText.slice(0,3000)};})()
