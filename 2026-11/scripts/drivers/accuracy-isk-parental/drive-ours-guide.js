(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));const g=id=>document.getElementById(id);
__set(g('slr'),'2.55');__set(g('b'),'500000');await sl(1500);
return {inputs:{slr:g('slr').value,b:g('b').value,ret:g('ret').value,sav:g('sav').value},label:document.querySelector('[data-i18n=oTax]')?.innerText,oTax:g('o-tax')?.innerText,oTaxS:g("o-tax-s")?.innerText,slrOut:g("slr-out")?.innerText};})()
