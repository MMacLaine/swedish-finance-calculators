(async()=>{const inp=document.querySelector('input[type=number]');__set(inp,'45000');await __sleep(300);
const s=[...document.querySelectorAll('select')].find(x=>[...x.options].some(o=>o.value==='Stockholm'));__set(s,'Stockholm');await __sleep(1500);
const extra=[...document.querySelectorAll('input,select')].filter(e=>e.getBoundingClientRect().width>0).map(e=>({type:e.type,val:e.value,checked:e.checked}));
return {readback:{salary:inp.value,kommun:s.value+' / '+s.options[s.selectedIndex].text,all:extra},net:__find(/^\s*35[\s ,]?168/),takeHome:__find(/take-home/i).slice(0,4)};})()
