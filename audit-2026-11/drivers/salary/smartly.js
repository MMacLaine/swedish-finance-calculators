// @meta {"url":"https://smartly.se/tools/salary-after-tax","wait":7000,"settle":1500}
// Smartly (English UI): number field "Monthly salary (before tax)" with a range slider, select "Municipality".
window.__A = __mkAdapter({
  roles: {
    gross: () => __byLabel(/Monthly salary/i, { sel: 'input[type=number],input[type=text],input[type=tel]' }) || __byText(/^Monthly salary/i, 'input[type=number],input[type=text]'),
    municipality: () => __byLabel(/^Municipality/i, { sel: 'select' }),
    yob: () => __byLabel(/birth|born|\bage\b/i, { sel: 'input,select' }),
    church: () => __byLabel(/church|kyrk/i, { hidden: true }),
  },
  async setMunicipality(name) {
    const s = this._need('municipality'); if (s) return s; const sel = __marked('municipality');
    const o = [...sel.options].find(o => o.value === name) || [...sel.options].find(o => o.text.startsWith(name + ' '));
    if (!o) return { status: 'could-not-verify', reason: 'no option ' + name };
    __set(sel, o.value); sel.blur(); return { status: 'done', picked: o.text, parish: 'not asked by the tool' };
  },
  area: () => { const g = __marked('gross') || __byLabel(/Monthly salary/i, { sel: 'input' }); return __up(g, [/take-home|after tax|net/i, /SEK|kr/], 7000) || __area([/take-home/i]); },
  fields: t => { const g = re => (t.match(re) || [])[1] || null; return { takeHome: g(/Monthly\nTAKE-HOME PAY\n([^\n]+)/i), taxDeducted: g(/Tax deducted\n([^\n]+)/), municipalTax: g(/(Municipal tax\n[^\n]+\n[^\n]+)/) }; },
});
