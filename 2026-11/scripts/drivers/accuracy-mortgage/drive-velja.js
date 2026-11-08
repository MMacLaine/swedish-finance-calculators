(async()=>{try{const sl=ms=>new Promise(r=>setTimeout(r,ms));const ins=[...document.querySelectorAll('input[type=range]')];
const lab=e=>(e.labels&&e.labels[0]?e.labels[0].innerText:e.getAttribute('aria-label')||'').trim();
const by=l=>ins.find(e=>lab(e).includes(l));
__set(by('Pris'),'4000000');await sl(300);__set(by('Kontantinsats'),'10');await sl(300);__set(by('Bruttoinkomst'),'720000');await sl(1500);
const t=document.body.innerText;return {read:ins.map(e=>[lab(e),e.value]),
lines:[...t.matchAll(/[^\n]{0,60}(Amortering|Lånebelopp|Belåningsgrad|Kontantinsats|Månadskostnad)[^\n]{0,60}(\n[^\n]{0,40}){0,1}/g)].map(m=>m[0].replace(/\n/g,' | ')).slice(0,25)};}catch(e){return {err:String(e)}}})()
