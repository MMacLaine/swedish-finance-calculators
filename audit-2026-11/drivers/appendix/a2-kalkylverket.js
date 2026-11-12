// @meta {"url":"https://kalkylverket.se/kalkylatorer/bostad-fastighet/kopa-bostad/bolanekalkylator","wait":7000,"settle":1500,"loanAs":"deposit"}
// Kalkylverket bolånekalkylator: a 4-step wizard. Prepare picks "Bostadsrätt" and presses "Nästa"; then the
// price and deposit text fields; finish presses "Visa resultat" and "Visa detaljerade siffror".
const kvIns = () => [...document.querySelectorAll('main input')].filter(e => __vis(e) && e.type === 'text');
window.__A = __mkAdapter({
  roles: { price: () => __byLabel(/pris|köpeskilling|bostadens värde/i, { sel: 'main input' }) || __byText(/pris/i, 'main input[type=text]'),
    deposit: () => __byLabel(/kontantinsats|egen insats/i, { sel: 'main input' }) || __byText(/kontantinsats/i, 'main input[type=text]') },
  async prep() { const log = []; const b = __btn(/^Bostadsrätt/, 'main button'); if (b) { b.click(); log.push('Bostadsrätt'); await __sleep(600); } const n = __btn(/^Nästa$/, 'main button'); if (n) { n.click(); log.push('Nästa'); await __sleep(1200); } log.push('fields: ' + kvIns().map(e => __labelOf(e)).join(' | ')); return log; },
  async finish() { const log = []; const v = __btn(/^Visa resultat$/, 'main button'); if (v) { v.click(); log.push('Visa resultat'); await __sleep(1500); } const d = __btn(/^Visa detaljerade siffror$/, 'main button'); if (d) { d.click(); log.push('Visa detaljerade siffror'); await __sleep(1200); } return { status: v ? 'done' : 'could-not-verify', log }; },
  area: () => document.querySelector('main'),
  fields: t => ({ amortLines: t.split('\n').filter(l => /mortering|Lånebelopp|Belåningsgrad|bolånetak|90 ?%|85 ?%/i.test(l)).slice(0, 15) }),
});
