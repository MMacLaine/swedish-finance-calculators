(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));
const clicked=[];for(const b of document.querySelectorAll('button,a,[role=button]')){const t=(b.innerText||'').trim();if(/^(endast nödvändiga|bara nödvändiga|neka|avvisa|endast nödvändiga cookies|godkänn endast nödvändiga|nödvändiga|tillåt endast nödvändiga|acceptera endast nödvändiga|använd endast nödvändiga.*|reject all|neka alla|avböj)$/i.test(t)){b.click();clicked.push(t);break;}}
await sl(1500);
const vis=e=>{const r=e.getBoundingClientRect();const s=getComputedStyle(e);return r.width>1&&r.height>1&&s.visibility!=='hidden'&&s.display!=='none'};
const lab=e=>{let t='';if(e.labels&&e.labels[0])t=e.labels[0].innerText;if(!t)t=e.getAttribute('aria-label')||e.placeholder||e.name||e.id||'';return t.trim().replace(/\s+/g,' ').slice(0,60)};
const inputs=[...document.querySelectorAll('input,select')].filter(e=>!/hidden|submit|button|checkbox|radio/.test(e.type)&&vis(e)).map((e,i)=>({i,tag:e.tagName,type:e.type,name:e.name,id:e.id,label:lab(e),value:e.value,min:e.min,max:e.max}));
const txt=document.body.innerText;const amort=[...txt.matchAll(/[^\n]{0,80}amorter[^\n]{0,80}/gi)].map(m=>m[0]).slice(0,15);
return {url:location.href,title:document.title,clicked,inputs:inputs.slice(0,40),amort,iframes:[...document.querySelectorAll('iframe')].map(f=>f.src).slice(0,8)};})()
