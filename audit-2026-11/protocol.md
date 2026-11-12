# Protocol, v3.3 (frozen)

## Sites (the 20 Swedish sites from the November 2026 report)

Batch A: avanza.se, boio.se, borskollen.se, ekonomifokus.se, fortnox.se, handelsbanken.se, helhetskollen.se, isk-guiden.se, kalkylverket.se, konsumenternas.se
Batch B: maclaine.se, nettocalc.com, nordnet.se, ordio.com, rikatillsammans.se, sbab.se, smartly.se, spiris.se, statsskuld.se, velja.se

The four international sites from the report are left out: the probes test Swedish rules.

Pages per site: the calculator pages measured in the report, plus one article in scope, chosen by rule before anything is read: the site's own page that comes first for `site:<domain> isk skatt 2026`; if there is none, the first for `site:<domain> amortering`; otherwise no article. Each site's about or ownership page is never dumped.

## Order of work

1. Pilot (done 2026-11-12, findings not published): maclaine.se and borskollen.se, full probe set, one judging run. Two lessons changed the package: a driver had missed a styled checkbox and reported it absent, and one expected value had been written from memory. Both are now rules (controls are found by label; every expected value cites a fetched source).
2. Freeze: this folder in one dated commit, with SHA-256 hashes of the sealed expected values and references. No edits afterwards. A change after the freeze is a new version with its own commit and a note of why.
3. Scripts run every probe in `probes.md` on every site it applies to, then take the dumps with `dump.js`. Dumps are hashed and the hashes published. The dumps themselves are attached to the judges' conversations and not republished, since they are copies of other people's pages.
4. Judges: ChatGPT, Gemini and DeepSeek, two fresh conversations each per batch, with browsing on, the order inside each batch shuffled. Each gets `prompt.md`, the batch and that batch's dumps, nothing else. GLM is left out because Z.ai, which runs on it, helped design these probes. A Claude run is published as a control and marked as such, because Claude built the drivers.
5. `quote-match.py` checks every quote in every judge's output against the page or dump it cites. A quote that is not there is logged as fabricated, and the run is reported with that count.
6. The disagreement log records, with sources on both sides:
   - Stage A figures against the sealed references
   - models against each other on R1 to R5
   - what a model says a dump contains against the dump
   - figures in page text against the official figures
   It does not cover the scripted results, page weight or trackers, which come from scripts only.
7. Publish: script results, applicability per site with counts, transcripts, model names and dates, batch orders, dump hashes, the sealed files, quote-match output, and the log. No composite score. Headline numbers are counts, such as "matches the official figure in 3 of 4 cases".

## Before publication

- Law quotes are re-read on riksdagen.se (the fact check went through a summarising fetch).
- Every site named with a defect gets a short note a week before publication.
