(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));const g=id=>document.getElementById(id);
__set(g('mort-price'),'4000000');await sl(300);__set(g('mort-deposit'),'400000');await sl(1500);
const t=document.body.innerText;return {read:{price:g('mort-price').value,deposit:g('mort-deposit').value,rate:g('mort-rate').value,amortPct:g('mort-amort').value,term:g('mort-term').value},
lines:[...t.matchAll(/[^\n]{0,90}(amorter|Amortering|Månadsamortering)[^\n]{0,60}(\n[^\n]{0,40}){0,2}/g)].map(m=>m[0].replace(/\n/g,' | ')).slice(0,14)};})()
