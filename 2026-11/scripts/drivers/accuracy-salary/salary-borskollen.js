(async()=>{const g=document.getElementById('start');__set(g,'45000');await __sleep(300);const s=document.getElementById('county');__set(s,'STOCKHOLM - STOCKHOLMS DOMKYRKOFÖRSAMLING');await __sleep(1500);
const res=__find(/^Resultat/);const r=document.querySelector('form')?.parentElement;const txt=document.body.innerText.replace(/\s+/g,' ');
return {readback:{gross:g.value,county:s.value},resultText:(txt.match(/Resultat.{0,700}/)||[''])[0],net:__find(/Du får behålla/).slice(0,4),money:__money().slice(0,14)};})()
