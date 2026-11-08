(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));const rs=[...document.querySelectorAll('input[type=range]')].filter(e=>e.labels&&e.labels[0]&&/Månadslön/.test(e.labels[0].innerText));
__set(rs[0],'80000');await sl(1500);
const lines=document.body.innerText.split('\n').map(s=>s.trim()).filter(s=>/kr|dag/.test(s)&&/\d/.test(s)&&s.length<200).slice(0,30);
return {p1:rs[0].value,p2:rs[1]&&rs[1].value,lines,day:window.__find(/kr\/dag|per dag|Per dag/i).slice(0,8)};})()
