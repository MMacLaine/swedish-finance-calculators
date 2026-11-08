(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));
const byLab=t=>[...document.querySelectorAll('input')].find(e=>e.labels&&e.labels[0]&&e.labels[0].innerText.trim().startsWith(t));
const set=(t,v)=>{const e=byLab(t);if(!e)return 'missing '+t;__set(e,v);return e.value;};
const r={};r.start=set('Startbelopp','500000');r.monthly=set('Månadssparande','0');r.ret=set('Förväntad årsavkastning','0');r.div=set('Varav utdelning','0');r.turn=set('Årlig omsättning','0');r.years=set('Spartid','1');
const cb=document.getElementById('fribeloppUsed');r.cbBefore=cb&&cb.checked;if(cb&&cb.checked){cb.click();}await sl(1500);r.cbAfter=cb&&cb.checked;
const read={};for(const t of ['Startbelopp','Månadssparande','Förväntad årsavkastning','Varav utdelning','Årlig omsättning','Spartid'])read[t]=byLab(t)?.value;
const lines=document.body.innerText.split('\n').map(s=>s.trim()).filter(s=>/skatt|kr/i.test(s)&&/\d/.test(s)&&s.length<200).slice(0,25);
return {set:r,readBack:read,lines};})()
