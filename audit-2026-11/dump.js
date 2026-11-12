// Rendered-text dump for the judge pass (audit v3.3). Run in the loaded page, for example
//   W=390 WAIT=8000 node probe.mjs <url> "$(cat dump.js)"
// Returns the visible text plus the state of every form control, found by its label text,
// so a judge can see which municipality, church setting or salary a result belongs to.
(async()=>{await new Promise(r=>setTimeout(r,500));
const vis=e=>{for(let n=e;n&&n.nodeType===1;n=n.parentElement){const s=getComputedStyle(n);if(s.display==='none'||s.visibility==='hidden')return false;}return true;};
const labelOf=e=>{let t='';if(e.labels&&e.labels.length)t=[...e.labels].map(l=>l.innerText).join(' ');if(!t&&e.getAttribute('aria-label'))t=e.getAttribute('aria-label');if(!t&&e.id){const l=document.querySelector('label[for="'+CSS.escape(e.id)+'"]');if(l)t=l.innerText;}if(!t){const p=e.closest('label,fieldset,[role=group],.field,.fld,div');if(p)t=(p.innerText||'').slice(0,80);}return t.replace(/\s+/g,' ').trim().slice(0,80);};
// A styled checkbox can have a zero-size input inside a visible label: judge visibility by the label, not the input.
const controls=[...document.querySelectorAll('input,select,textarea,[role=switch],[role=checkbox],[aria-pressed]')].filter(e=>!/^(hidden|search|submit|button)$/.test(e.type||'')).filter(e=>vis(e.closest('label')||e)).map(e=>({label:labelOf(e),id:e.id||null,tag:e.tagName.toLowerCase(),type:e.type||e.getAttribute('role')||null,value:e.tagName==='SELECT'?(e.selectedOptions[0]||{}).text:(e.type==='checkbox'||e.type==='radio')?e.checked:e.getAttribute('aria-pressed')!=null?e.getAttribute('aria-pressed'):e.getAttribute('aria-checked')!=null?e.getAttribute('aria-checked'):e.value}));
return {url:location.href,at:new Date().toISOString(),title:document.title,viewport:innerWidth+'x'+innerHeight,controls,text:document.body.innerText};})()
