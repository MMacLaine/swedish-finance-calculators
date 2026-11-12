# Audit v3.3 probe drivers

This is the copy published with the audit. The `smoke/` and `rehearsal/` output folders and the hand-check scripts that read them are left out, because the outputs hold copies of other sites' page text. Their summaries are below.

Scripts that type into the calculators for the probes in `_local/benchmark/repo/audit-2026-11/probes.md`. They record what each page shows and judge nothing. Expected values are sealed elsewhere and are not read here.

## Running

```
bash run-all.sh          # full run, results in ../results/
bash run-all.sh smoke    # S0 only, one non-probe appendix case, S6 link collection only, results in smoke/
```

At most 4 Chrome instances run at once (`P=4`; each job opens one Chrome at a time). Single jobs:

```
node run-salary.mjs <site> [--probes S7,S0,S1,S2,S3,S4,S5] [--out file]
node run-appendix.mjs <A1|A2|A3|A4> <site> [--smoke] [--out file]
node run-s6.mjs <site|all> [--collect-only] [--out-dir dir] [--limit n]
node discover.mjs <url> [js]       # lists every control with its label, for repairing an adapter
node smoke/brief.mjs <result.json> # one-screen summary of a result file
```

Env: `BODY=1` adds the page text to every read (debugging). `A2_HB_INCOME` and `A2_HB_FEE` fill Handelsbanken's income and association-fee fields, which are not probe inputs, so they are empty unless set.

## How it works

- `lib/cdp.mjs`: headless Chrome over CDP, a variant of `_local/scripts/probe.mjs` (that file is not edited). Chrome picks a free port. Viewport 390 x 844, mobile, touch, Android user agent, `sv-SE`. It keeps console errors (exceptions, `console.error`, log errors) tagged with the step they happened in, and the HTTP status of each main document. A form post that reloads the page is survived.
- `lib/helpers.js`: injected before every load. It carries the round-3 helpers (`__set`, `__type`, `__find`, `__money`, `__clickText`) and adds label finding (`__byLabel`, `__byText`), a visibility test that judges a control inside a label by the label (the borskollen `#church` lesson), a consent clicker that only presses short buttons offering the necessary-only choice, and the base adapter `__mkAdapter`.
- `lib/runner.mjs`: typing. A person's typing is done with real CDP key events: focus the field, select what is there, press each key over the selection, then leave the field (blur). Clearing is select all, Backspace, blur. Custom dropdowns get a real mouse click at the option's centre. `__type` is still in the helpers but the drivers use key events, since some fields (number inputs, masked inputs) ignore set values.
- Each probe runs in a fresh Chrome profile, so nothing a site saves in local storage carries over between probes.

A control an adapter cannot find returns `could-not-verify` with a reason, never "absent". Steps that set nothing still record what the page shows.

## What each result holds

`../results/<site>-salary.json`: per probe, a list of steps. Each step has the action, the input typed, the adapter's result for that action (status, what was picked or clicked, before and after for toggles), a readback of every marked control plus every visible control with its label and value, the output read (named fields, every line with a rate, label and amount pairs, messages and validation text, a NaN, Infinity, exponent and negative-kronor check, and the result area's text), the URL, an ISO time and the console errors from that step. Each probe also keeps the document statuses and all console errors.

Salary probes, in the order the steps run (S0 inputs: 45 000 kr, Stockholm, Stockholms domkyrkoförsamling where a parish is asked, born 1990, no church fee):

- S7: the page as loaded, then after the consent click.
- S0: prepare, locate, birth year, municipality, church off, gross.
- S1: S0, then gross 44 900, 44 901, 45 000, 45 001.
- S2: S0, then 0 typed over the 45 000 result, field emptied, minus 5 000, 1 000 000 000. The whole result area is kept each time.
- S3: S0, then Danderyd (Danderyds församling where asked).
- S4: the church control's state as loaded, then S0 without the church step, church off, church on.
- S5: S0, then a separate read of every rate line.

On tools with a Beräkna button the button is pressed after every input, as a person would press it to see the change.

`../results/<site>-a1.json` to `-a4.json`: one fresh load per case, every input a step, then a final read. Inputs as in probes.md: A1 capital base 299 999, 300 001, 310 000, 500 000 kr with 1 year, 0 % return and 0 a month; A2 price 4 000 000 kr and loans 2 796 000, 2 804 000, 3 596 000, 3 600 000, 3 604 000 kr (typed as the deposit, price minus loan, where a tool asks for a deposit, or as a percentage where it only has a percent slider); A3 49 000 and 50 000 kr a month; A4 a 5 000 kr swap from 57 000 and from 70 000 kr.

`../results/<site>-s6.json`: the nav links found on the home page and the measured calculator page at 390 px and at 1440 px, and for every same-site nav link the status from Chrome (main document status, final URL, title, h1, a soft-404 text check, number of calculator controls on the page) and from a plain Node fetch. Each link carries two flags so the calculator set can be checked by hand: `calculatorByText` (URL or link text matches the pattern in `run-s6.mjs`) and `calculatorByControls` (the page has 2 or more visible form controls outside header, nav and footer). Login links are skipped.

## Salary adapters (`salary/`)

| Site | Page | Controls found by label | Not found (could-not-verify) |
|---|---|---|---|
| borskollen | /rakna-ut-lon-efter-skatt-kalkylator | "Bruttolön" (number); "Kommun" select with MUNICIPALITY - PARISH options, so the parish is chosen there (exact name only, otherwise could-not-verify); "Medlem i svenska kyrkan" styled checkbox, ticked on load | birth year |
| fortnox | /fortnox-foretagsguide/kalkylatorer/lon-efter-skatt | "Välj kommun" combobox over a native select (falls back to the select if the list does not open); "Ange månadslön" (number); "Medlem i svenska kyrkan?" checkbox, which opens "Välj församling" (the named parish is clicked, exact name only); "Beräkna". Result under "Så här fördelas lönen" | birth year |
| helhetskollen | /salary | "Bruttolön per månad (kr, efter löneväxling)" (text); "Kommun för skattetabell" combobox, picks "Stockholm Tabell nn" with a real click and checks "Aktuellt val" | church fee (the page says the table is used without it), birth year |
| kalkylverket | /kalkylatorer/skatt/inkomstskatt/lon-efter-skatt-kalkylator | "Bruttolön per månad (kr)" (text); "Kommun" select; church fee is a div toggle with no input or role beside the text "Medlem i Svenska kyrkan", state read from its inline background | birth year, parish |
| maclaine | /finance/salary | "Bruttolön per månad", "Födelseår" (number); "Kommun" autocomplete; "Medlem i trossamfund" Nej/Ja buttons, then the "Trossamfund" select set to Svenska kyrkan | parish (not asked) |
| nettocalc | /se (the calculator; the register's /se/lon-efter-skatt is a table with no inputs) | gross field under the text "Bruttolön per månad" (its own label is "kr"); "Kommunalskatt %" read back | municipality: the calculator has only a tax-rate field, and the municipality links go to fixed-salary pages without inputs. Church fee, birth year |
| ordio | /sv/tools/lon-kalkylator | "Bruttolön per månad (kr)" (text, formatted "45 000"); "Kommun" select; "Medlem i Svenska kyrkan (kyrkoavgift)" checkbox; "Födelseår" under "Avancerade inställningar", opened in prepare | parish (no parish control appeared in smoke; checked again when church is on) |
| smartly | /tools/salary-after-tax (English) | "Monthly salary (before tax)" (number, with slider); "Municipality" select | church fee, birth year |
| spiris | /verktyg/kalkylatorer/lon-efter-skatt | "Månadslön i SEK" (tel); "Vilken kommun bor du i?" react-select, real click on the option; "Är du medlem i svenska kyrkan?" Ja/Nej buttons (Nej active on load); Ja opens "Vilken församling tillhör du?" (react-select, starts on the first parish; the named parish is clicked, exact name only); "Beräkna" | birth year (the page says it is for under 66) |
| statsskuld | /berakna-nettolon | "Ange din bruttolön:" (text); "Var bor du" Choices.js box: real click, type in its search, real click on the option; church toggle beside "Medlem i Svenska kyrkan" (hidden input, clicked through its label); "Beräkna" posts the form and the page reloads; the 2026 tab is clicked and the visible tab panel is read | birth year, parish |
| velja | /lonekalkyl | "Månadslön (brutto)" is a slider; its button "Ange exakt värde för Månadslön (brutto)" opens a text field, which is typed into; year group "Skatteår" set to 2026; "Kommun" combobox with a real click on the option; "Medlem i Svenska Kyrkan" checkbox | birth year: asked only as "66 år eller äldre vid 2026 års början", which is left unticked for born 1990 (recorded as such). Parish |

Notes:

- Statsskuld: an empty gross field is not posted during setup. In S2, after the field is emptied, Beräkna is pressed so the record shows what the tool does with an empty field.
- Spiris, fortnox, statsskuld show no result until Beräkna is pressed, so early setup steps read an empty result.
- Smartly's number field puts a 0 back when emptied, so a cleared field can read back as "0".

## Rehearsal fixes, 2026-11-12

Found in the rehearsal (`--rehearse`: Göteborg then Malmö, 38 000 kr, born 1985) and checked by hand in headless Chrome with `rehearsal/hand.mjs` (step by step, screenshots to the session scratchpad). Rehearsal files before the fixes are in `rehearsal/before-fixes/`; after the fixes, `rehearsal/*-salary.json`. A second check with Uppsala then Lund, 41 000 kr (a temporary edit of the rehearsal inputs, reverted) is in `rehearsal/check2/`. The appendix smoke cases were rerun on the changed lib (`rehearsal/appendix-smoke/`) and match `smoke/appendix/` apart from one page console error on Handelsbanken.

Lib changes:

- `lib/runner.mjs`: `clickRole` and `focusRole` scroll with `behavior: 'instant'` and measure the box after the scroll. Pages with `scroll-behavior: smooth` (spiris, statsskuld) were measured mid-scroll, so real clicks landed elsewhere. `clickRole` keeps `lastClick` with whether the point hit the element. New `typeCombo` (requested with `combo: true`): click into the field, select all, Backspace, pause, type, keep focus.
- `lib/helpers.js`: base `calc` reports `status: 'disabled'` when the button is disabled. New `__nameRe(name)`: a name at the start of an option, ending where the word ends. `\b` does not work after å, ä, ö in JavaScript, so `/^Malmö\b/` never matched.

Driver bugs, fixed:

1. Second municipality change. velja: typing over the shown choice lost the first key (the field resets on the first input after a pick), so "almö"; velja now uses `typeCombo`. velja, spiris, maclaine: the option match used `\b` and never matched Malmö; now `__nameRe`. statsskuld: the click on the Choices box landed mid-scroll; fixed by the instant scroll. Rehearsal S3.danderyd is now done with Malmö on all four.
2. borskollen took the first parish starting with the municipality. It now takes the named parish only and otherwise says could-not-verify, listing the parishes offered; nothing is picked, so the rehearsal parish (not offered: the tool has "DOMKYRKOFÖRSAMLINGEN I GÖTEBORG") leaves the default ALE. Ordio's parish match is exact too. check2: Uppsala domkyrkoförsamling and Lunds domkyrkoförsamling picked.
3. fortnox and spiris municipality readback was the combobox search field, which is empty after a pick. Readback `municipality` is now the choice shown (`municipalityInput` keeps the field). The picks had happened.
4. Church fee. fortnox: ticking the box opens "Välj församling" and Beräkna stays disabled until a parish is picked, so the press did nothing. The adapter now opens the list and clicks the named parish (could-not-verify with the list when absent; rehearsal parish absent, check2 done, result changes). spiris: the Ja click missed (smooth scroll); fixed, and Ja opens a parish list that starts on the first parish, so the named parish is now clicked, else could-not-verify naming the default kept. Rehearsal and check2 S4.churchOn show a changed result on both.
5. `rehearsal/check.mjs` printed `after=[object Object]`; it now prints the object and any calc status other than done.

Readback additions: fortnox `fieldMessage` (for example "Fältets värde får inte överskrida 500 000"), `parish`; spiris `parish`, `church`; statsskuld `churchToggle.posted` (the hidden `kyrkoskatt` field the form sends) and field `grossShown` ("Din bruttolön" in the panel); kalkylverket field `message` ("Skriv in en bruttolön större än 0."); velja `grossShown` (the value button, since the slider shows its clamped value).

Tool behaviour, drivers left alone (screenshots in the session scratchpad):

- fortnox S2: emptying the field gives the browser's "Please fill in this field" and Beräkna does nothing, so the old figure stays; -100 shows gross and take-home 100 kr; 999 999 999 shows "Fältets värde får inte överskrida 500 000" and disables Beräkna, old figure stays (`fortnox-huge.png`, `fortnox-neg.png`). fortnox S3: Göteborg and Malmö give the same figure with Beräkna pressed and enabled.
- kalkylverket S2.empty: the tool empties the field itself on focus, shows the old value as a placeholder, and puts it back on leaving (`kalkylverket-focused.png`, `kalkylverket-after-clear-blur.png`). The driver's select all and Backspace did run. -100 becomes 0 on leaving, with "Skriv in en bruttolön större än 0." (`kalkylverket-neg.png`).
- ordio S2.empty: the input event with an empty field fires, the result stays, and on leaving the tool puts 7 back (`ordio-cleared-blurred.png`). -100 is accepted while typing and emptied on leaving, result "—". Church: the checkbox ticks (synthetic and real click alike) and the result and breakdown do not change in any order of steps (`ordio-church-real.png`).
- statsskuld S2: the 2026 panel is the one read. Gross 7 shows 684 kr; an empty post computes with "Din bruttolön = 39 800 kr" (the field's placeholder example) and shows 30 797 kr (`statsskuld-gross7.png`, `statsskuld-empty.png`). Church: the toggle turns on, but the form posts `kyrkoskatt=0` either way (checked by reading the submitted form data), and after the reload the toggle is off and Kyrkoavgift is -0 kr (`statsskuld-church-clicked.png`, `statsskuld-church-after.png`).
- maclaine S2: the rehearsal (12:46 UTC) ran against the site before release 1.0.0 went live (pushed 12:45:53 UTC, commit 355d6505 "an emptied or zero salary clears every result"), and the page then kept 7 kr with an empty field and with -100. The driver fired input and change events. The live page now shows "–" in every result line in both cases (`maclaine-empty-result.png`, `maclaine-neg-result.png`).
- smartly S2.neg: the "-" replaces the selected 0, the number field goes empty (bad input), the tool puts a 0 back, and the rest gives "0100", read as 100 with "Please enter a valid value" (`smartly-neg.png`).
- velja S2.empty: emptying the exact-value field fires input; the result stays 7 kr and the field closes back to "7 kr" (`velja-empty-focused.png`).
- spiris S2.neg and statsskuld S2.neg read 100: both fields drop the minus sign.

Open for the real run: fortnox, spiris and borskollen pick a parish by its exact name only. Where a tool names the S0 parish differently from probes.md, the step records could-not-verify with the tool's list, and on fortnox Beräkna then stays disabled.

## Appendix adapters (`appendix/`)

| Adapter | Page | Inputs driven | Limits |
|---|---|---|---|
| a1-iskguiden | isk-guiden.se/isk-kalkylator/ | "Portföljvärde (kr)"; "Statslåneränta (%)" left as loaded | yearly-tax tool: years, return and monthly steps report could-not-verify |
| a1-kalkylverket | /kalkylatorer/skatt/kapitalskatt/isk-skatt-kalkylator | "Kapitalunderlag" (text) | same as above |
| a1-maclaine | /finance/sparande | Startkapital, Månadssparande, Förväntad avkastning, Tidshorisont; "ISK" mode pressed | none |
| a1-velja | /isk-eller-depa | Startbelopp, Månadssparande, Förväntad årsavkastning, Spartid through their exact-value fields; Varav utdelning and Årlig omsättning set to 0 (slider where there is no field) | "En sparare" and "Fribeloppet används redan" left as loaded, recorded |
| a2-boio | boio.se/kalkylator/bolan | "Bostadens pris" and "Kontantinsats" (percent) are sliders only, set like a drag | the sliders' step decides what sticks; readback shows the value taken (status "partly" when it differs from the input) |
| a2-ekonomifokus | /kalkylator-boendekostnad | "Pris på boende:", "Kontantinsats:" | scripts load on first interaction, so prepare sends one and waits 4 s |
| a2-handelsbanken | /sv/privat/bolan/bolanekalkyl | deposit into "Hur mycket tänker du lägga i egen insats?"; Bostadsrätt picked; "Räkna" | no price field (could-not-verify). It needs income and association fee, which are not probe inputs, so it shows validation messages unless `A2_HB_INCOME` / `A2_HB_FEE` are set |
| a2-kalkylverket | /kalkylatorer/bostad-fastighet/kopa-bostad/bolanekalkylator | wizard: Bostadsrätt, Nästa, "Pris", "Kontantinsats", Visa resultat, Visa detaljerade siffror | none |
| a2-konsumenternas | konsumenternasbankochfinansbyra.se (konsumenternas.se redirects) | "Bostadens pris", "Kontantinsats" | amortisation is the user's own input there, left empty |
| a2-maclaine | /finance/bolan | "Bostadens pris", "Kontantinsats" | none |
| a2-velja | /bolanekalkyl | "Pris" through its exact-value field; "Kontantinsats i procent" slider | percent slider, snapped to its step |
| a3-kalkylverket | /kalkylatorer/privatekonomi/lon-och-inkomst/foraldrapenning-kalkylator | "Månadslön före skatt (kr)" | none |
| a3-maclaine | /finance/foraldrapenning | "Bruttolön per månad"; SGI fields read back | none |
| a3-smartly | /tools/parental-leave | "Parent 1" (number) | none |
| a3-velja | /foraldrapenning | parent 1 "Månadslön före skatt" through its exact-value field | none |
| a4-kalkylverket | /kalkylatorer/privatekonomi/lon-och-inkomst/lonevaxlingskalkylator | "Månadslön före växling", "Belopp att växla per månad" | none |
| a4-maclaine | /finance/lonevaxling | "Bruttolön per månad", "Månadsbelopp att växla" | none |
| a4-velja | /lonevaxling | "Bruttolön per månad", "Löneväxlingsbelopp/mån" through their exact-value fields | none |

## S6 (`run-s6.mjs`, `s6/sites.json`)

Main navigation is the links inside `header`, `nav` or `[role=navigation]` outside `footer`, plus links that become visible when the menu button or a collapsed submenu (`aria-expanded=false`) is clicked. A page with no such links at all falls back to its footer links, marked `footer-fallback`. Helhetskollen is the one site that needed it in the smoke run (its only menu is a floating button and the calculator list is in the footer). Avanza and Handelsbanken load their mega-menus on click, so the submenu clicks matter there.

## Sites that resist headless Chrome

None blocked the smoke run: every page loaded with status 200, and no bot check or captcha appeared. Consent banners were answered with the necessary-only choice on avanza, boio, ekonomifokus, handelsbanken, helhetskollen, konsumenternas, nettocalc, nordnet, ordio, sbab and spiris. Ekonomifokus delays its scripts until a first interaction, which its adapter handles.

## What the smoke run exercised

`bash run-all.sh smoke` (2026-11-12, Chrome 157): S0 on all 11 salary tools, one case per appendix tool with inputs that are not probe inputs (ISK 400 000 kr, loan 3 000 000 kr, 40 000 kr a month, a 3 000 kr swap from 60 000 kr), and S6 link collection without status checks. Results are in `smoke/`. These code paths have not run yet, because running them means running the probes: picking Danderyd, turning the church fee on (on kalkylverket, statsskuld, velja, fortnox, ordio and spiris the church fee was already off, so no click happened), emptying a field, and the S6 status checks (tried on three maclaine.se links while building, file not kept).
