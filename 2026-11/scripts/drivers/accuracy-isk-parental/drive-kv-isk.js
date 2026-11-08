(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));const out={};
const txt=[...document.querySelectorAll('input[type=text]')].find(e=>e.placeholder==='500000'||/^\d+$/.test(e.value));
const lab=[...document.querySelectorAll('*')].find(e=>e.children.length===0&&/ÅRETS ISK-SKATT/i.test(e.textContent));
const blk=()=>{let n=lab;for(let i=0;i<3&&n.parentElement;i++)n=n.parentElement;return n.innerText.replace(/\s+/g,' ').slice(0,300);};
__set(txt,'600000');txt.blur();await sl(1500);out.at600={input:txt.value,block:blk()};
__set(txt,'500000');txt.blur();await sl(1500);out.at500={input:txt.value,range:(document.querySelector('input[type=range]')||{}).value,block:blk()};
return out;})()
