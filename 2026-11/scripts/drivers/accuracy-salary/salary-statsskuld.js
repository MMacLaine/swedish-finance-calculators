(async()=>{const before={form:sessionStorage.getItem('__r3form'),err:sessionStorage.getItem('__r3err')};
const t=document.getElementById('tabb-2026');const tabTxt=t&&t.innerText;if(t)t.click();await __sleep(1500);
const k=document.getElementById('kommun');const kyrka=[...document.querySelectorAll('input[name*=kyrk]')].map(i=>i.name+'='+i.value+(i.type==='checkbox'?':'+i.checked:''));
const activeTab=[...document.querySelectorAll('[id^=tabb-]')].map(b=>b.id+':'+b.className.slice(0,40)+':'+b.getAttribute('aria-selected'));
return {before,readback:{bruttolon:(document.getElementById('bruttolon')||{}).value,kommun:k&&k.value,kyrka,activeTab},net:__find(/34[\s ]?991|nettol/i).slice(0,12),money:__money().slice(0,30)};})()
