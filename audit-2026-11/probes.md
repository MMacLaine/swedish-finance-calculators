# Probe matrix, v3.3 (frozen)

Scripts run these in headless Chrome at 390 px, typing into fields the way a person does (each key, then leaving the field). Each probe has inputs and a pass rule here. The expected outputs are in a sealed file whose SHA-256 is in `sealed.sha256`; it is published with the results so you can check nothing moved after the run.

A driver that cannot find a control reports "could not verify", never "absent". Controls are found by their label text.

## Full battery (applies to at least half of the 20 Swedish sites)

| # | Probe | Applies to | Inputs | Pass rule |
|---|---|---|---|---|
| S0 | Salary, canonical case | salary tools | 45 000 kr a month, Stockholm (Stockholms domkyrkoförsamling where a parish is asked), born 1990, no church fee | Classified payslip / final tax / neither. Payslip must equal the table figure exactly; final tax within 2 kr a month. |
| S1 | Tax-table band | salary tools that use the tax table (they say so, or S0 equals the payslip figure) | 44 900 and 44 901 kr; 45 000 and 45 001 kr | Same band: identical tax. Across the band edge: tax steps to the next band's table value. |
| S2 | Odd inputs | salary tools | 0 kr, typed over an existing result; field emptied; minus 5 000 kr; 1 000 000 000 kr | 0 or empty: an empty state or zero everywhere, no figure left from before. Negative: refused, clamped to 0, or a clear message, never a negative take-home. Very large: a finite, formatted figure or a clear cap, no NaN, Infinity or exponent. |
| S3 | Municipality | salary tools | Stockholm, then Danderyd (Danderyds församling where a parish is asked) | Result matches the sealed Danderyd figure for its basis. For a table-based result the correct outcome can be "unchanged". |
| S4 | Church fee | salary tools | church fee off, then on, at Stockholms domkyrkoförsamling | Default is off, or the result says a church fee is included and how much. Turning it on lowers take-home; the size is checked against the sealed figure where the tool asks for the parish. |
| S5 | Labelled rate equals applied rate | salary tools that show a rate breakdown | S0 inputs | Every rate the page shows equals the rate its own figures imply, under the church setting tested, and the parts add up (kommun, region, burial fee, church fee if on). The burial fee is counted once. |
| S6 | Internal calculator links | all 20 sites | every calculator link in the site's main navigation | No link returns 404 or an error page. |
| S7 | Defaults | every tool tested | none, page as loaded | Every field's starting value is recorded with its label. No verdict; reported so readers see which examples a tool starts from. |

## Appendix (narrower probes, reported per site)

| # | Probe | Applies to | Inputs | Pass rule |
|---|---|---|---|---|
| A1 | ISK tax-free amount | ISK tools | capital base 299 999, 300 001, 310 000, 500 000 kr; 1 year, 0% return, nothing added | Matches sealed figures (tax in whole kronor). |
| A1t | ISK text | ISK articles (R5) | figures in the page text | Each 2026 figure equals the rule for its own stated base, or the page says what else it assumes. Judged by models from text; settled here where a figure is wrong by arithmetic. |
| A2 | Amortisation and the loan cap | mortgage tools | price 4 000 000 kr; loans 2 796 000, 2 804 000, 3 596 000, 3 600 000, 3 604 000 kr | Matches sealed figures under Lag (2026:226). A loan above 90% of the price is refused or flagged, never amortised as if allowed. A 10% deposit is accepted. |
| A2t | No income-based amortisation | mortgage pages | page text | No current-tense statement of the extra amortisation tied to income (removed from 1 April 2026). |
| A3 | Parental benefit cap | parental benefit tools | 49 000 and 50 000 kr a month | Matches sealed figures (one under the income cap, one at it). |
| A4 | Salary sacrifice and public pension | salary sacrifice tools | swap 5 000 kr a month from 57 000 kr; swap 5 000 kr from 70 000 kr | Where the tool shows lost public pension: some loss in the first case, inside the sealed range; none in the second. |
| A5 | Commissioner-only checks | maclaine.se | example values; final-tax default; dashboard income | Example values are never saved as your own; a refund estimate on default inputs is not shown as 0 kr; retirement income is compared after tax. |

## Where the probe ideas came from

Four came from bugs I fixed in my own tools (0.65.1, 0.77.0, 0.87.0, 0.91.0). The others came from errors found on other sites in the November 2026 report, plus general boundary checks. The battery covers my site more densely because it has more tools, so every pass rate is reported per site over the probes that apply to it, with the count.
