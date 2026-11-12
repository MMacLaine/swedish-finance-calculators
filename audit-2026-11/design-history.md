# Design history

The plan was argued out between two AI models on 12 November 2026: Z.ai (GLM) proposed and critiqued, Claude (Opus 5.5) critiqued and later ran the pilot. I relayed between them. Both made mistakes, and they are listed here because the plan is built to catch these.

## Versions

- v1 (Z.ai): models type into calculators and probe edge cases. Dropped: most browsing models cannot run JavaScript, so they would report figures nobody measured.
- v2: scripts type, models judge page text only. Fixed rubric, the commissioner named, one JSON line per site, a pilot before the freeze.
- v3: consent banners and phone layout moved to scripts; a "page-needs-js" status; an expected value and pass rule for every probe; the disagreement log scoped.
- v3.1 and v3.2: three expected values corrected before any run (below).
- v3.4 (before any run): the outside models I can use are free tiers, which do not go deep, so the judging is split. Claude models do the full pass with Stage A; ChatGPT, Gemini and DeepSeek check the page reading in small batches.
- v3.3: changes from the pilot. Dumps record form state, drivers find controls by label, probes type like a person, every expected value cites a fetched source, rubric R1 to R5 as suggested by the pilot judge, expected values sealed by hash.

## Mistakes caught before the freeze

1. Claude said the blog post used a composite score as its headline. It does not; that score was only in an internal report.
2. Claude said it could not confirm a changelog version tag. It was there; the search output had been cut off.
3. The salary sacrifice probe (v3) had the lost pension above the ceiling and used 7.5 × IBB. The loss is below the ceiling, and the ceiling on pay is 8.07 × IBB. Skatteverket and Pensionsmyndigheten both state 8.07 as the practical ceiling.
4. Z.ai's record of point 3 misquoted Claude, from a garbled relay. Rewritten from the transcript.
5. Statsskuld's 31.58%: Z.ai first read the 1.03 gap above 30.55 as the church fee. Claude objected and Z.ai withdrew it. Skatteverket's 2026 rates show the church fee for Stockholms domkyrkoförsamling is 1.03%, so the first reading was right.
6. The tax-table band probe (v3) assumed 100 kr bands and called a pair that crosses a band edge "identical". The bands are 200 kr wide at that level.
7. Pilot: an expected value written from memory (Danderyd's rate lower than Stockholm's) was wrong. Danderyd is 30.58% against 30.55%.
8. Pilot: a driver reported that a site had no church fee setting. The setting exists as a styled checkbox; the driver skipped it. The AI judge found it.
