(async()=>{try{const sl=ms=>new Promise(r=>setTimeout(r,ms));const q=n=>[...document.querySelectorAll(`input[name=${n}]`)].find(e=>e.offsetWidth>0);
const before={jq:typeof window.jQuery,delayed:document.querySelectorAll('script[type="rocketlazyloadscript"],script[data-rocket-src],script[type="text/rocketscript"]').length};
// the page's scripts load on first user interaction: send synthetic interaction events first
for(const t of ['mousemove','mousedown','touchstart','keydown','scroll','wheel'])window.dispatchEvent(new Event(t,{bubbles:true}));document.dispatchEvent(new Event('mousemove',{bubbles:true}));
await sl(4000);
const after={jq:typeof window.jQuery};
// field name "lanebelop" is labelled "Kontantinsats"; the page recalculates on blur or Enter (bank-main.js)
__set(q('pris'),'4000000');q('pris').blur();if(window.jQuery)jQuery(q('pris')).trigger('blur');await sl(400);
__set(q('lanebelop'),'400000');q('lanebelop').blur();if(window.jQuery)jQuery(q('lanebelop')).trigger('blur');await sl(1200);
const g=id=>(document.getElementById(id)||{}).textContent.trim();
return {before,after,read:{pris:q('pris').value,kontantinsats:q('lanebelop').value,rente:q('rente').value,kontantinsatsFlaggedRed:q('lanebelop').classList.contains('red')},amortering:g('amortering'),loanbelopp:g('loanbelopp'),belaningsgrad:g('belaningsgrad'),rantekostnad:g('rantekostnad'),sum:g('sum')};}catch(e){return {err:String(e)}}})()
