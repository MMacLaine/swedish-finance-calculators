(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));const g=id=>document.getElementById(id);const tc=id=>g(id)?.textContent.replace(/\s+/g,' ').trim();
__set(g('shared-gross'),'80000');g('shared-gross').blur();await sl(2000);
const ids=['fp-a-sjuk-days','fp-a-daily','fp-a-lagsta-days','fp-a-total','fp-a-monthly','fp-b-daily','fp-sgi-a'];const o={};for(const i of ids)o[i]=tc(i);o.sgiA=g('fp-sgi-a')?.value;
const lab=g('fp-a-daily')?.parentElement?.textContent.replace(/\s+/g,' ').trim();
return {gross:g('shared-gross').value,yob:g('shared-yob').value,out:o,dailyRow:lab};})()
