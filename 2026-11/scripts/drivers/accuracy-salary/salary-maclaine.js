(async()=>{const g=document.getElementById('shared-gross'),y=document.getElementById('shared-yob'),m=document.getElementById('shared-mun-input');
__set(g,'45000');await __sleep(200);__set(y,'1990');await __sleep(200);
const ts=document.getElementById('shared-trossamfund');
const nej=[...document.querySelectorAll('button')].find(b=>b.innerText.trim()==='Nej'&&b.getBoundingClientRect().width>0);if(nej)nej.click();
await __sleep(1500);
return {readback:{gross:g.value,yob:y.value,mun:m.value,trossamfund:ts&&ts.value,employment:document.getElementById('shared-employment').value},strip:(document.getElementById('result-strip')||{}).innerText,net:__find(/35[\s ]?810/)};})()
