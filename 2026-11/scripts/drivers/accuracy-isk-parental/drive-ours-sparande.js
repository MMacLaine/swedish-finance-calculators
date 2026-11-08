(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));const g=id=>document.getElementById(id);
for(const [id,v] of [['start-capital','500000'],['monthly-savings','0'],['annual-return','0'],['time-horizon','1']]){__set(g(id),v);g(id).blur();g(id).dispatchEvent(new Event('blur'));await sl(400);}
await sl(2000);
const t=document.body.innerText.split('\n').map(s=>s.trim()).filter(s=>/kr/.test(s)&&/\d/.test(s)&&s.length<260).slice(0,40);
return {inputs:{start:g('start-capital').value,monthly:g('monthly-savings').value,ret:g('annual-return').value,years:g('time-horizon').value,tax:g('sp-tax').value},sentence:g('sp-sentence')?.textContent.replace(/\s+/g,' ').trim(),heroTax:g('hero-tax')?.textContent.trim(),heroTaxPct:g('hero-tax-pct')?.textContent.trim(),heroFinal:g('hero-final')?.textContent.trim(),how:g('sp-how-steps')?.textContent.replace(/\s+/g,' ').trim().slice(0,700)};})()
