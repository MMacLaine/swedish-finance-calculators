// @meta {"url":"https://konsumenternasbankochfinansbyra.se/konsumentstod/kalkyler--verktyg/bolanekalkyl","wait":7000,"settle":1500,"loanAs":"deposit"}
// Konsumenternas bolånekalkyl (www.konsumenternas.se redirects here): text fields "Bostadens pris",
// "Kontantinsats", "Ränta", "Amortering/månad" (the amortisation is the user's own input; left empty).
window.__A = __mkAdapter({
  roles: { price: () => __byLabel(/^Bostadens pris/i, { sel: 'input' }), deposit: () => __byLabel(/^Kontantinsats/i, { sel: 'input' }) },
  area: () => __up(__byLabel(/^Bostadens pris/i, { sel: 'input' }), [/amortering per månad/i], 9000) || document.querySelector('main'),
  fields: t => ({ lines: t.split('\n').filter(l => /lån|amortering|belåning|kontantinsats/i.test(l) && /\d/.test(l)).slice(0, 15) }),
});
