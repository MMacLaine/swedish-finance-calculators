(()=>{const vis=e=>{const r=e.getBoundingClientRect();const s=getComputedStyle(e);return r.width>1&&r.height>1&&s.visibility!=='hidden'&&s.display!=='none';};
const lab=e=>{let t='';if(e.labels&&e.labels[0])t=e.labels[0].innerText;if(!t)t=e.getAttribute('aria-label')||e.placeholder||'';return t.trim().replace(/\s+/g,' ').slice(0,60);};
const inputs=[...document.querySelectorAll('input,select,textarea')].filter(e=>!/hidden|submit|button/.test(e.type)).map(e=>({tag:e.tagName,type:e.type,id:e.id,name:e.name,label:lab(e),value:String(e.value).slice(0,30),vis:vis(e),min:e.min,max:e.max,opts:e.tagName==='SELECT'?[...e.options].slice(0,8).map(o=>o.value+':'+o.text.slice(0,20)).join('|'):undefined}));
const lines=(document.body.innerText||'').split('\n').map(s=>s.trim()).filter(s=>/kr|SEK|skatt|dag/i.test(s)&&/\d/.test(s)&&s.length<160).slice(0,60);
return {url:location.href,title:document.title,inputs:inputs.slice(0,40),lines};})()
