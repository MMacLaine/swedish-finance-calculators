// @meta {"url":"https://www.borskollen.se/rakna-ut-lon-efter-skatt-kalkylator","wait":6000,"settle":1500}
// Börskollen: number field "Bruttolön", one select "Kommun" whose options are MUNICIPALITY - PARISH,
// checkbox "Medlem i svenska kyrkan" (styled: judge by its label). Recalculates on input, no button.
window.__A = __mkAdapter({
  roles: {
    gross: () => __byLabel(/^Bruttolön/i, { sel: 'input' }),
    municipality: () => __byLabel(/^Kommun/i, { sel: 'select' }),
    church: () => __byLabel(/Medlem i svenska kyrkan/i, { sel: 'input[type=checkbox]', hidden: true }),
  },
  async setMunicipality(name, parish) {
    const s = this._need('municipality'); if (s) return s;
    const sel = __marked('municipality');
    // The named parish only (exact, case-insensitive). If it is not offered, nothing is picked: never the first
    // parish of the municipality.
    const want = (name + ' - ' + parish).toUpperCase();
    const o = [...sel.options].find(o => o.text.replace(/\s+/g, ' ').trim().toUpperCase() === want);
    if (!o) { const offered = [...sel.options].map(o => o.text.trim()).filter(t => t.toUpperCase().startsWith(name.toUpperCase() + ' - ')); return { status: 'could-not-verify', reason: 'no option ' + want + (offered.length ? ' (' + offered.length + ' parishes offered for ' + name + ': ' + offered.join('; ').slice(0, 900) + ')' : ' (municipality not in the list)'), selected: __val(sel) }; }
    __set(sel, o.value); sel.blur();
    return { status: 'done', picked: o.text };
  },
  area: () => __area([/Du får behålla/]),
  fields: t => {
    const T = t.replace(/\s+/g, ' '); const m = re => (T.match(re) || [])[1] || null;
    return { takeHome: m(/Du får behålla ([\d\s ,.\-−]+?) kr/), kommunLine: m(/Kommunalskatt & Landstingsskatt ([\d\s ,.\-−]+?) kr/), burial: m(/Begravningsavgift ([\d\s ,.\-−]+?) kr/),
      churchFee: m(/Kyrkoavgift ([\d\s ,.\-−]+?) kr/), jobTaxCredit: m(/Jobbskatteavdrag ([\d\s ,.\-−]+?) kr/), publicService: m(/Public service-avgift ([\d\s ,.\-−]+?) kr/),
      rateExclChurch: m(/Skattesats exkl\. kyrkoavgift ([\d.,]+ ?%)/), churchPct: m(/Kyrkoavgift ([\d.,]+ ?%)/), taxable: m(/Beskattningsbar inkomst ([\d\s ,]+) kr/), basicDeduction: m(/Grundavdrag ([\d\s ,]+) kr/), stateTax: m(/Statlig skatt ([\d\s ,]+) kr/) };
  },
});
