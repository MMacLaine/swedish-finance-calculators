(async()=>{const inp=[...document.querySelectorAll('input[type=text]')].find(i=>i.value==='35000'||i.placeholder==='35000');__set(inp,'45000');await __sleep(300);
const s=[...document.querySelectorAll('select')].find(x=>[...x.options].some(o=>o.value==='Stockholm'));__set(s,'Stockholm');await __sleep(1500);
const extra=[...document.querySelectorAll('input,select')].filter(e=>e.getBoundingClientRect().width>0).map(e=>({type:e.type,lab:(e.labels&&e.labels[0]?e.labels[0].innerText:e.getAttribute('aria-label')||'').slice(0,50),val:e.value,checked:e.checked}));
return {readback:{salary:inp.value,kommun:s.value+' / '+s.options[s.selectedIndex].text,all:extra},money:__money()};})()
