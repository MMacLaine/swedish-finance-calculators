(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));const n=[...document.querySelectorAll('input[type=number]')];
__set(n[0],'80000');n[0].blur();await sl(1500);
const hit=[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/^(70 534|38 000|\+32 534) SEK$/.test(e.textContent.trim().replace(/ /g,' ')));
return {p1:n[0].value,ctx:hit.map(e=>{let p=e;for(let i=0;i<3&&p.parentElement;i++)p=p.parentElement;return {v:e.textContent.trim(),ctx:p.innerText.replace(/\s+/g,' ').slice(0,260)};})};})()
