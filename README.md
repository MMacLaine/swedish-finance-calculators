# Swedish personal finance calculators, tested

An open, repeatable comparison of Swedish personal finance calculators against official figures, with four British and American sites for context. Each edition is a dated snapshot in its own folder.

- **November 2026:** [report](https://mmaclaine.github.io/swedish-finance-calculators/2026-11/) · [data](2026-11/data) · [scripts](2026-11/scripts)

## What it measures

1. **Accuracy:** four fixed cases typed into every calculator that offers them, checked against the official figure (Skatteverket, Försäkringskassan, Lag 2026:226).
2. **What loads before you click:** requests, other companies' domains contacted and cookies set, in a fresh browser before any consent choice.
3. **Page weight** in the first eight seconds.
4. **Phone layout:** where the first input and the first result sit on a 390 px screen.
5. **Coverage:** interactive calculators against a fixed list of 20.

There is no overall ranking. Every named error was checked again by hand, with a screenshot in `data/verification`.

## Who made this

Matthew MacLaine. I run MacLaine Finance, one of the sites tested, so the report sticks to things anyone can check and says where other sites do better. AI (Claude Opus 5.5, Claude Sonnet 5.5 and Claude Fable 5.1) was used to cross-check the findings, to run the measurement scripts and to help draft the text; the report's method section sets out exactly how. Every figure comes from the scripts or an official source.

## Rerun it

Needs Node 22 or later and Google Chrome (set `CHROME` to its path if it isn't in the default macOS location).

```
sh 2026-11/scripts/run.sh                      # privacy, phone layout and page weight for every URL in sites.txt
node 2026-11/scripts/probe.mjs <url> '<js>'    # read a value from a page; the drivers in scripts/drivers type the test cases
```

The data files keep the exact pages measured. Sites change, so a rerun on another day will differ; that is the point of dating each edition.

## Corrections

If a figure is wrong, or a site has fixed something, email matthew@maclaine.se. Corrections are made with the date.

## Licence

Report text and data: CC BY 4.0. Scripts: MIT.
