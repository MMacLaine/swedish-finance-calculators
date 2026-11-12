// @meta {"url":"https://www.handelsbanken.se/sv/privat/bolan/bolanekalkyl","wait":8000,"settle":1500,"loanAs":"deposit"}
// Handelsbanken bolånekalkyl: a "how much can I borrow" tool. No price field (price step reports
// could-not-verify); the deposit goes in "Hur mycket tänker du lägga i egen insats?". It also needs a
// housing type (Bostadsrätt is picked, as in round 3), a monthly income and the association fee: both left
// empty unless A2_HB_INCOME / A2_HB_FEE are set when the run starts (they are not probe inputs). The result
// shows after "Räkna"; with the fields empty the tool shows validation messages, which are recorded.
window.__A = __mkAdapter({
  roles: { price: () => __byLabel(/bostadens pris|köpeskilling|pris/i, { sel: 'input' }), deposit: () => __byLabel(/egen insats/i, { sel: 'input' }), income: () => __byLabel(/månadsinkomst/i, { sel: 'input' }), fee: () => __byLabel(/avgift till föreningen/i, { sel: 'input' }) },
  async prep() { const r = __byLabel(/^Bostadsrätt$/i, { sel: 'input[type=radio]', hidden: true }); if (r && !r.checked) { ((r.labels && r.labels[0]) || r).click(); await __sleep(400); } return 'housing type: ' + (r ? 'Bostadsrätt ' + r.checked : 'not found'); },
  async finish() { const inc = window.__HB_INCOME; if (inc) { this.locate(); if (__marked('income')) return { __type: { role: 'income', text: String(inc) }, then: 'fee' }; } return this.fee(); },
  async fee() { const f = window.__HB_FEE; if (f) { this.locate(); if (__marked('fee')) return { __type: { role: 'fee', text: String(f) }, then: 'press' }; } return this.press(); },
  async press() { const b = __btn(/^Räkna$/, 'button'); if (!b) return { status: 'could-not-verify', reason: 'no Räkna button' }; b.click(); await __sleep(6000); return { status: 'done', clicked: 'Räkna', income: window.__HB_INCOME || 'left empty', fee: window.__HB_FEE || 'left empty' }; },
  area: () => document.querySelector('main') || document.body,
  fields: t => ({ errors: __messages().slice(0, 8), lines: t.split('\n').filter(l => /amorter|lån|belåning|pris|kr\/mån/i.test(l) && /\d/.test(l)).slice(0, 15) }),
});
