(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));const txt=[...document.querySelectorAll('input[type=text]')].find(e=>e.placeholder==='35000'||e.value==='35000');
const before=document.body.innerText.split('\n').map(s=>s.trim()).filter(s=>/kr/.test(s)&&/\d/.test(s)&&s.length<120).slice(0,6);
__set(txt,'80000');txt.blur();await sl(1500);
const lines=document.body.innerText.split('\n').map(s=>s.trim()).filter(s=>/kr|dag/.test(s)&&/\d/.test(s)&&s.length<200).slice(0,30);
const sel=document.querySelector('select');return {input:txt.value,select:sel&&sel.value,before,lines,dayLabel:window.__find(/per dag|dagersättning|dagbelopp/i).slice(0,6)};})()
