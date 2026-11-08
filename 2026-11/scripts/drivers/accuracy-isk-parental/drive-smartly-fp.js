(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));const n=[...document.querySelectorAll('input[type=number]')];
__set(n[0],'80000');n[0].blur();await sl(1500);
const lines=document.body.innerText.split('\n').map(s=>s.trim()).filter(s=>/SEK|day|dag/i.test(s)&&/\d/.test(s)&&s.length<200).slice(0,40);
return {p1:n[0].value,p1range:document.querySelectorAll('input[type=range]')[0].value,p2:n[1]&&n[1].value,lines,day:window.__find(/\/day|per day|daily/i).slice(0,10)};})()
