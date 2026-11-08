# Round 3 claim verification

Checked Sunday 2026-11-08, 18:51 to 19:07 CET (Stockholm), headless Chrome from the owner's Mac. Each screenshot has a JSON beside it with the exact URL, final URL, HTTP status, load time and the driver's readback. Driver scripts are the `drv-*.js` files; the screenshotter is `shot.mjs` (run from the repo root: `node _local/competitive/round3/verify/shot.mjs <url> <out-base> [driver]`). Full detail per claim is in `verify.json`.

Counts (17 rows, claims 3 to 9 split into parts): **CONFIRMED 10, CONFIRMED WITH CHANGE 5, FIXED 0, NOT CONFIRMED 2.**

Cookie banners: declined where a decline button existed. borskollen has no decline button, so its UniConsent overlay was hidden with CSS for the screenshot (no consent given).

## Official references used

| Fact | Value | Source |
|---|---|---|
| ISK 2026 | 300 000 kr tax-free; schablonintäkt 3.55% (statslåneränta 2.55% at 30 Nov 2025 + 1); tax 30%. On 500 000 kr: 200 000 x 3.55% x 30% = 2 130 kr | skatteverket.se/investeringssparkonto |
| Max föräldrapenning 2026 | 1 259 kr/day ("Dagar på sjukpenningnivå, högsta möjliga belopp: 1 259") | Försäkringskassan, Aktuella belopp |
| Payslip tax, table 31, 45 000 kr | 9 450 kr, so take-home 35 550 kr (row 44 801 to 45 000, column 1) | Skatteverket open data, fetched 19:06, saved as `ref-skattetabell31-2026-45000.json` |
| Final yearly tax basis | about 35 810 kr | earlier run (findings.md), not re-derived here |
| Stockholm 2026 | 30.55% (18.22 kommun + 12.33 region); begravningsavgift 0.07%, separate | SCB Kommunalskatterna 2026; Skatteverket Belopp och procent 2026 |
| Uppskov | takbelopp 3 000 000 kr ("Takbeloppet är 3 000 000 kronor ..."); schablonintäkt on uppskov abolished from 2021 | Skatteverket "Slutligt uppskov"; regeringen.se "Avskaffad schablonintäkt på uppskovsbelopp" |
| Mortgages from 1 April 2026 | cap 90% (4 §), so 10% deposit; amortisation 1% over 50% LTV, 2% over 70% (7 §); no income or skuldkvot rule | Lag (2026:226), data.riksdagen.se/dokument/sfs-2026-226 |

## Results

| # | Claim | Status | Exact quote or figure | URL | Time (CET) | Screenshot |
|---|---|---|---|---|---|---|
| 1 | smartly ISK article: about 5 000 kr on 500 000 kr, old rate about 3.3%, no 300 000 kr tax-free amount | CONFIRMED WITH CHANGE | "On a 500,000 SEK account, that's about 5,000 SEK in tax for the year" / "2.33% + 1% = 3.33%" (article in English, dated July 21, 2026) | smartly.se/money/isk-account-sweden | 18:52:48, 18:52:54 | c1a-smartly-isk-5000.png, c1b-smartly-isk-rate.png |
| 2 | smartly parental: 1 250 kr/day max | CONFIRMED | "Max daily benefit: 1 250 SEK (föräldrapenning cap)" | smartly.se/tools/parental-leave | 18:52:48 | c2-smartly-parental-1250.png |
| 3a | smartly salary: 45 000, Stockholm, 35 168 kr | CONFIRMED | 45000, "Stockholm (30.55%)": "TAKE-HOME PAY 35 168 SEK", "Tax deducted -9 832 SEK" | smartly.se/tools/salary-after-tax | 18:51:47 | c3a-smartly-salary.png |
| 3b | smartly home page: about 34 500 kr | CONFIRMED | "45,000 SEK/month in Stockholm ~34,500 SEK take-home per month" | smartly.se/ | 18:53:08 | c3b-smartly-home-34500.png |
| 4a | statsskuld: 34 991 kr; Stockholm labelled 31.58% | CONFIRMED | "STOCKHOLM (31.58%)", 2026 tab, kyrkoskatt 0: "Nettolön 34 991" | statsskuld.se/berakna-nettolon | 18:53:27 | c4a-statsskuld-salary.png |
| 4b | statsskuld home page salary link returns 404 | NOT CONFIRMED | no such link (see below) | statsskuld.se/ | 18:53:57 | c4b-statsskuld-home-links.png, c4c-statsskuld-typo-url-404.png |
| 5a | borskollen: 35 206 kr, church fee always deducted, no way to turn it off | NOT CONFIRMED | default "Du får behålla 35,206 kr", "Kyrkoavgift 449 kr"; but a "Medlem i svenska kyrkan" checkbox exists | borskollen.se/rakna-ut-lon-efter-skatt-kalkylator | 18:57:52, 18:58:18 | c5a-borskollen-salary-church-on.png, c5b-borskollen-salary-church-off.png |
| 5b | borskollen ISK: "ca 1 240 kr" on 500 000 kr | CONFIRMED | "Exempel: Har du 500 000 kr på ISK beskattas 200 000 kr (efter det skattefria beloppet). Skatten blir då ca 1 240 kr för året (200 000 × 1,07 %)." | borskollen.se/isk-skatt | 18:58:48 | c5c-borskollen-isk-1240.png |
| 6a | ekonomifokus home-sale page: uppskov costs about 0.5% a year | CONFIRMED WITH CHANGE | "0,5% på uppskovsbeloppet per år är kostnaden för att ha ett uppskov." (staff reply in comments, "8 år sedan") | ekonomifokus.se/bostad/deklaration/berakning-av-vinst-och-skatt-vid-bostadsforsaljning | 19:00:52 | c6a-ekonomifokus-uppskov-05pct.png |
| 6b | same page: uppskov cap removed | CONFIRMED WITH CHANGE | "Taket för uppskov är borttaget så du kan nuförtiden skjuta med dig hela din vinst ..." (staff reply in comments, "9 år sedan") | same | 19:01:13 | c6b-ekonomifokus-uppskov-cap.png |
| 6c | ekonomifokus mortgage calculator flags a 10% deposit (uses 15%) | CONFIRMED | price 4 000 000, deposit 400 000: field red, "Du måste ha minst 10% i kontantinsats!"; code `pris - (0.85 * pris)` | ekonomifokus.se/kalkylator-boendekostnad | 19:01:58 | c6d-ekonomifokus-mortgage-deposit-flag.png |
| 7a | Swedbank calculator page: income-based amortisation | CONFIRMED WITH CHANGE | "Amorteringen påverkas också av din inkomst i förhållande till hur mycket bolån du har." | swedbank.se/privat/boende-och-bolan/rakna-pa-ditt-bolan.html | 19:03:41 | c7a-swedbank-income-amortisation.png |
| 7b | Konsumenternas mortgage page: income-based amortisation | CONFIRMED WITH CHANGE | "Du måste amortera om lånet överstiger 50 procent av bostadens värde eller om du har hög belåning i förhållande till din inkomst." | konsumenternas.se/konsumentstod/kalkyler--verktyg/bolanekalkyl/ (redirects to konsumenternasbankochfinansbyra.se) | 19:03:02 | c7b-konsumenternas-income-amortisation.png |
| 8 | kalkylverket tax page links an aktieskatt calculator that 404s | CONFIRMED | link text "aktieskattekalkylatorn", href `/kalkylatorer/skatt/kapitalskatt/aktieskatt-kalkylator`, HTTP 404 ("Sidan hittades inte – Kalkylverket") | kalkylverket.se/kalkylatorer/skatt | 19:04:05 to 19:04:37 | c8a-kalkylverket-aktieskatt-link.png, c8b-kalkylverket-aktieskatt-404.png |
| 9a | velja: 45 000, Stockholm, 35 811 kr | CONFIRMED | 2026, 45000, "Stockholm (30,55 %)", church and 66+ off: "Nettolön per månad 35 811 kr" | velja.se/lonekalkyl | 19:04:58 | c9a-velja-stockholm-35811.png |
| 9b | velja default is the national average, 35 164 kr | CONFIRMED | default 45 000: "35 164 kr", Kommun field "Rikssnitt (32,38 %)" | velja.se/lonekalkyl | 19:05:15 | c9b-velja-default-35164.png |
| 10 | helhetskollen: 45 000, Stockholm tabell 31, 35 550 kr | CONFIRMED | "Din nettolön per månad 35 550 kr", "Beräknad med skattetabell 31 (2026) utan kyrkoavgift." | helhetskollen.se/salary | 19:05:37 | c10-helhetskollen-35550.png |

## What the pages actually say, where the claim is not exactly right

**1. smartly ISK (with change).** The 5 000 kr figure and the missing 300 000 kr tax-free amount are exact: the article never mentions a tax-free amount. The rate is 3.33%, but calling it "old" is wrong. The article misstates the 30 Nov 2025 statslåneränta as 2.33% (official 2.55%). No year used 3.33% (2024 was 3.62%, 2025 was 2.96%). Say "a wrong rate", not "an old rate". The article is in English, so the quotes are English.

**4b. statsskuld 404 link (not confirmed).** Every salary link on the Swedish home page goes to `https://statsskuld.se/berakna-nettolon` (HTTP 200). I status-checked all 57 unique statsskuld.se hrefs in the home page HTML: the only 404 is `/kommun-data` ("Kommun data"), which sits inside an HTML comment, is not rendered and is not a salary link. The earlier review named `/berakna-netlolon`. That URL does return 404 (c4c), but nothing on the home page links to it now. Drop this claim.

**4a, extra detail (confirmed).** statsskuld's own breakdown lists "Den kommunala skatten i Stockholm är 18.22%" and "Skatten i ditt landsting är 12.33%", which add to 30.55%, so the 31.58% label is 1.03 points high. It also charges a 0.2% burial fee (-87 kr) where Stockholm's is 0.07% (about -30 kr).

**5a. borskollen church fee (not confirmed).** There is a "Medlem i svenska kyrkan" checkbox, ticked by default. With it ticked: "Du får behålla 35,206 kr", "Kyrkoavgift 449 kr". Unticked: "Du får behålla 35,655 kr", "Kyrkoavgift 0 kr". So 35 206 kr is the default result, but the fee can be turned off. The earlier run probably missed the toggle: the real input is 0 x 0 px with opacity 0 behind a styled label. A fair claim: "it ticks church membership by default, so the default result includes a 449 kr church fee". With church off, 35 655 kr is +105 kr against table 31 and -155 kr against final tax.

**5b. borskollen "ca 1 240 kr" (confirmed, context).** Same year (2026) and same assumptions as the official figure: 300 000 kr tax-free and 1,07 % (1,065 % rounded). Its own formula, 200 000 x 1,07 %, gives 2 140 kr, so 1 240 is an arithmetic slip, not a different year or assumption. Official: 2 130 kr.

**6a and 6b. ekonomifokus uppskov (with change).** Both statements are visible on the page dated 30 June 2026 (dateModified 2026-06-30), but only in its comment section (317 comments): staff replies signed "Andreas på Ekonomifokus.se" / "Mvh admin på Ekonomifokus", shown as "8 år sedan" and "9 år sedan". They were true when written: the cost was abolished in 2021, and the cap was suspended from mid-2016 to mid-2020. The article body states neither. ekonomifokus's own uppskov article (dateModified 2026-10-06) is correct: "Det är gratis att göra uppskov. Tidigare kostade det en årlig ränta att göra uppskov men den är nu borttagen sedan 2021-01-01" and "taket för uppskov är 3 miljoner kr per såld bostad" (c6c). Fair wording: outdated staff answers still shown under the article, not the article text. `/reavinstkalkylator` returns 404; the calculator lives on this home-sale page.

**6c. ekonomifokus deposit (confirmed).** The help text says "minst 10 % av bostadens pris" and the warning says "Du måste ha minst 10% i kontantinsats!", yet the code flags anything under 15%. So a deposit of exactly 10% shows the warning, which says the opposite of what triggered it.

**7a. Swedbank (with change).** The income wording is in the collapsed FAQ "Hur mycket måste jag amortera?". It does not mention 4.5x or an extra percentage point. Swedbank's linked explainer page states the 1 April 2026 removal correctly (earlier reviews, not re-shot here). Fair wording: "still says amortisation also depends on income".

**7b. Konsumenternas (with change).** The income wording is in the "Att tänka på" box. It does not mention 4.5x or an extra point. The same page states the 90% cap and 10% deposit correctly, and the calculator has no income input. Konsumenternas published a news item on the new rules on 2026-03-30.

**9a and 9b. velja (confirmed, note).** "Final-tax basis" is my inference: 35 811 matches the final-tax reference to within 1 kr. The page does not use the words "slutlig skatt". The default is labelled "Rikssnitt (32,38 %)" in the municipality field and in the breakdown ("Din lön i Sverige"), so the page does not present it as Stockholm. Only a reader skimming the headline figure could take it for Stockholm.

## Files

- Screenshots and per-shot JSON: `c1a` to `c10` (PNG + JSON).
- `c4b-statsskuld-home-link-status.txt`: status of all 57 home page links.
- `c8-kalkylverket-aktie-link-status.json`: status of every "aktie" link on the tax category page.
- `ref-skattetabell31-2026-45000.json`: Skatteverket table 31 row.
- `verify.json`: everything above in structured form.
