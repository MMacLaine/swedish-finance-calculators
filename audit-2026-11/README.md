# Pre-registered audit, November 2026

This folder is the plan for the second round of the calculator tests, committed before any of it is run. Once it is pushed it does not change. If something has to change, it gets a new version and a note.

The first round asked AI models to compare the sites, and they disagreed a lot. Six models in the first informal round (ChatGPT, three Claude models, DeepSeek and GLM) ranked my site anywhere from first to the bottom half; the report's later cross-check used three Claude models. So in this round scripts type into the calculators, and models only judge what is written on the pages.

- `prompt.md`: what each AI judge gets, word for word
- `probes.md`: every scripted check, its inputs and its pass rule
- `protocol.md`: sites, order of work, what gets published
- `design-history.md`: how the plan was argued out, including the mistakes
- `dump.js`, `quote-match.py`: the page dump and the quote checker
- `sealed.sha256`: hashes of the expected values and reference figures, which are published with the results so you can check they did not move

I run one of the sites (maclaine.se). The prompt says so, and every result is reported per site.
