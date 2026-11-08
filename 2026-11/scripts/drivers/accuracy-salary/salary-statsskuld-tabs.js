(async()=>{const out={};for(const b of document.querySelectorAll('[id^=tabb-]')){const pid=b.getAttribute('aria-controls')||b.dataset.hsTab;const p=pid?document.querySelector(pid.startsWith('#')?pid:'#'+pid):null;out[b.id]={controls:pid,panelHidden:p?p.classList.contains('hidden')||getComputedStyle(p).display==='none':null,text:p?p.innerText.replace(/\s+/g,' ').match(/(Grundavdrag[^A-Ö]*?-?[\d ]+ kr).*?(Din nettolön[^\d]*[\d ]+ kr)/)?.slice(1,3):null,state:p?(p.innerText.match(/över [\d ]+ kr per år/)||[''])[0]:null};}
document.getElementById('tabb-2026').click();await __sleep(1200);const vis=[...document.querySelectorAll('[role=tabpanel]')].filter(p=>getComputedStyle(p).display!=='none').map(p=>p.id);
const first=__find(/^34[\s ]?991$/);
return {out,visibleAfter2026Click:vis,first};})()
