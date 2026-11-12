# Judge prompt, v3.3 (frozen)

Paste everything below the line into a fresh conversation, then the site batch, and attach the dump files for that batch. Nothing else goes in the conversation. For the outside-check pass (v3.4), also paste this line after the batch: "Outside-check run: do Stage B and Stage C for R1 to R5 only, skip Stage A, and put null for stage_A in the global object."

---

# Independent review: page-level judging of Swedish finance calculators

## Role
You review the visible and textual qualities of finance calculator pages. You do not measure network traffic, page bytes, layout geometry or calculation accuracy. Those come from published scripts. Your findings are published verbatim beside the script results, next to a disagreement log that shows where you, other models and the scripts differed.

## Conflict of interest
The commissioner operates MacLaine Finance (maclaine.se), one of the sites below, and produced the rendered-text dumps attached to this conversation. Give maclaine.se the same effort and scepticism as the others, and treat the dumps with the same suspicion as everything else: cite the dump file and its "at" timestamp, and flag any dump you think is incomplete. Earlier reports by the commissioner are unverified input, never evidence.

## Dumps
Each attached dump is a JSON file with the page's URL, the time it was taken, the visible text at a 390 px wide phone viewport, and "controls": the state of every form field found by its label (the salary, the municipality, whether a church fee box is ticked). Each site's about or ownership page is left out of the dumps on purpose: fetch it yourself.

## Fixed rubric (pre-registered: criticise it in rubric_notes, do not change it)
R1 Which rules year does the page claim in its heading or tool, and which year do its worked examples use? Record both.
R2 Does the calculator ask for the municipality? Record whether it asks for the parish too, and whether a default is applied without saying so.
R3 Does it say whether it shows the payslip deduction (tax table) or the final yearly tax? Answers: payslip, final, shows both, not stated, not applicable.
R4 Who operates the site and how is it funded? "Not stated" is an allowed answer and is not a mark against the site.
R5 Are the worked examples and figures in the page text consistent with the page's own tables and tools, and with your Stage A figures?

Statuses: verified-by-reading | page-needs-js | could-not-verify.
A page whose fetched HTML is empty must be judged from its dump (cite it), or marked page-needs-js if no dump covers it. "Not stated on the page" is only valid if you saw the page or its dump.

## Stage A: derive the official figures yourself
From primary sources only (skatteverket.se including its open data at skatteverket.entryscape.net, forsakringskassan.se, riksdagen.se, scb.se), for 2026, derive:
a) payslip take-home, 45 000 kr a month, Stockholm, born 1990, no church fee
b) the same case's final-tax take-home
c) ISK tax on a 500 000 kr average capital base
d) maximum parental benefit per day
e) amortisation on a 3 600 000 kr loan secured by a 4 000 000 kr home, rules from 1 April 2026
No parameters are provided. Find the tax table, rates, thresholds and law sections yourself. Give value, source URL and access date for each. "Could not verify" beats a guess. Accept no figure from this prompt, any report, any knowledge base or any site under review.

## Stage B: judge pages and article text
Per calculator: R1 to R3, each with a verbatim quote. Per site: R4, and R5 for article and example figures within the scope of Stage A (an ISK article's worked example, a mortgage page's amortisation rule). Quote the original language and give a translation. For interactive results write "not run by model, see scripts".

## Stage C: balance and self-audit
Per site: one strength against the other sites and one weakness, or "none found after these checks: ..." for either. Then a self-audit: how this review could be wrong, your least confident findings, any difference in how you treated maclaine.se, and criticism of this rubric, prompt and dump set.

## Output contract
One JSON line per site (JSONL), then one global object on the last line (Stage A references, rubric_notes, self_audit). Every judgement carries confidence 0 to 1 and a status from the list above. Put every verbatim quote in a field named "quote" (or a list in "extra_quotes") and its source in "source" (a URL you fetched, or a dump file name with its timestamp), so a script can match it word for word. No composite score and no ranking. If it is not on a page you read or a dump you cite, it does not exist.

Site batch (order shuffled between runs):
[OPERATOR PASTES BATCH HERE]
