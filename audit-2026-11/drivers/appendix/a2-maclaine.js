// @meta {"url":"https://maclaine.se/finance/bolan","wait":6000,"settle":1500,"loanAs":"deposit"}
// maclaine.se Bolån: number fields "Bostadens pris" and "Kontantinsats".
window.__A = __mkAdapter({
  roles: { price: () => __byLabel(/^Bostadens pris/i, { sel: 'input' }), deposit: () => __byLabel(/^Kontantinsats/i, { sel: 'input' }) },
  area: () => document.querySelector('main') || document.body,
  fields: t => ({ lines: t.split('\n').filter(l => /Du lånar|amorter|belåning|LTV|kontantinsats/i.test(l)).slice(0, 12) }),
});
