// @meta {"url":"https://www.ekonomifokus.se/kalkylator-boendekostnad","wait":7000,"settle":1800,"loanAs":"deposit"}
// Ekonomifokus boendekostnad: text fields "Pris på boende:", "Kontantinsats:" (recalculates on blur). Its
// scripts load on the first user interaction, so prepare sends one (mouse move, touch, key) and waits.
window.__A = __mkAdapter({
  roles: { price: () => __byLabel(/^Pris på boende/i, { sel: 'input' }), deposit: () => __byLabel(/^Kontantinsats/i, { sel: 'input' }) },
  async prep() { for (const t of ['mousemove', 'mousedown', 'touchstart', 'keydown', 'scroll', 'wheel']) window.dispatchEvent(new Event(t, { bubbles: true })); document.dispatchEvent(new Event('mousemove', { bubbles: true })); await __sleep(4000); return 'interaction events sent; jQuery ' + typeof window.jQuery; },
  readbackExtra: () => { const d = __byLabel(/^Kontantinsats/i, { sel: 'input' }); return { depositFlaggedRed: d ? d.classList.contains('red') : null }; },
  area: () => __area([/Belåningsgrad/, /Amortering/, /Lånebelopp/]),
  fields: t => ({ lines: t.split('\n').filter(l => /Belåningsgrad|Lånebelopp|Amortering|Räntekostnad|Summa|kr\/mån/i.test(l)).slice(0, 12) }),
});
