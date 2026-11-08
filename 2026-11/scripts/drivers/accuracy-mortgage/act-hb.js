(async()=>{try{const sl=ms=>new Promise(r=>setTimeout(r,ms));const g=id=>document.getElementById(id);
const all=[];const walk=root=>{for(const e of root.querySelectorAll('*')){all.push(e);if(e.shadowRoot)walk(e.shadowRoot);}};walk(document);
const cookie=all.find(b=>b.tagName==='BUTTON'&&(b.innerText||b.textContent||'').trim()==='Godkänn nödvändiga');if(cookie){cookie.click();await sl(1000);}
const clickR=id=>{const r=g(id);if(!r)return id+':missing';(r.labels&&r.labels[0]||r).click();return id+':'+r.checked;};
const picks=['multipleApplicantsNo','accommodationType_0','hasStudentLoan-no','hasChildren-no','currentAccomodationKeep-no'].map(clickR);
const other=[...document.querySelectorAll('input[type=radio][value=no]')].filter(r=>!r.checked);for(const r of other)(r.labels&&r.labels[0]||r).click();
await sl(600);const fee=[...document.querySelectorAll('input')].find(e=>e.offsetWidth>0&&/avgift/i.test((e.labels&&e.labels[0]?e.labels[0].innerText:'')+e.name+e.id));let feeInfo=null;if(fee){__set(fee,'4000');fee.blur();feeInfo=[fee.id||fee.name,(fee.labels&&fee.labels[0]?fee.labels[0].innerText:'')];}
__set(g('downPayment'),'400000');g('downPayment').blur();await sl(300);__set(g('monthlyIncome'),'60000');g('monthlyIncome').blur();await sl(300);
__set(g('loanInterestRate'),'2,7');g('loanInterestRate').blur();await sl(500);
const rb=[...document.querySelectorAll('button')].find(b=>(b.innerText||'').trim()==='Räkna');rb.click();await sl(6000);
const checked=[...document.querySelectorAll('input[type=radio]:checked')].map(r=>r.id);
const read=['downPayment','monthlyIncome','loanInterestRate'].map(i=>[i,g(i).value]);if(fee)read.push(['fee',fee.value]);
const t=document.body.innerText;const k=t.indexOf('Räkna\n');
const errs=[...document.querySelectorAll('[class*=error],[role=alert]')].map(e=>e.innerText.trim()).filter(Boolean).slice(0,10);
return {feeInfo,cookieClicked:!!cookie,picks,checked,read,errs,after:t.slice(k,k+2500)};}catch(e){return {err:String(e)}}})()
