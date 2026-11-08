(async()=>{const sl=ms=>new Promise(r=>setTimeout(r,ms));const out={};const pv=document.getElementById('portfolio-value'),slr=document.getElementById('state-loan-rate');
const leaf=()=>[...document.querySelectorAll('*')].filter(e=>e.children.length===0&&/^\s*[−-]?\s*\d[\d\s ]* kr\s*$/.test(e.textContent)&&e.getBoundingClientRect().height>0).slice(0,8).map(e=>e.textContent.trim());
__set(pv,'600000');await sl(1200);out.at600={pv:pv.value,slr:slr.value,leaf:leaf()};
__set(pv,'500000');await sl(1200);out.at500={pv:pv.value,slr:slr.value,leaf:leaf(),label:window.__find(/Schablonskatt per år|Kapitalskatt \(30/).slice(0,4)};return out;})()
