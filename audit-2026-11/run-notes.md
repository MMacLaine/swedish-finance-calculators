# Run notes

Written on 12 November 2026, before the full probe run. These settle how the frozen probes are applied where a site's tool does not fit them. None of them changes an input, an expected value or a pass rule.

## Where a probe input cannot be entered

1. Nettocalc has no municipality control, only a "Kommunalskatt %" field. The run leaves that field at the tool's own value and enters nothing for the municipality. Its S0, S3, S4 and S5 figures are recorded and scored could-not-verify, since the tool was not given the probe's inputs.
2. Handelsbanken's mortgage tool has no price field and requires income and an association fee, which are not probe inputs. The run enters the deposit only and records what the page shows, validation messages included. A case with no amortisation figure is scored could-not-verify.
3. Boio and Velja take the deposit as a percentage slider only. The run records the value the slider took. A case is scored only where that value equals the probe's input; otherwise it is could-not-verify.
4. A parish is picked only by its exact name, ignoring case. If a tool lists the parish under another name, the run picks nothing, records the tool's list and scores the step could-not-verify.
5. A field a tool does not ask for (birth year on most salary tools, the parish on most) is recorded as not asked. It is not a failure.

## S6 calculator links

A main navigation link counts as a calculator link if its URL or text names a calculator, or if the page it leads to has two or more visible form fields outside the header, navigation and footer. Every navigation link is published with both flags, so a reader can apply a different rule. Helhetskollen has no header navigation, so its footer links are used and marked as such.

## Article selection

The protocol does not name a search engine. The first attempt used the web search tool in Claude Code, which ignored the `site:` operator and gave no own-site result for 10 of the 20 sites, so it was dropped. Bing in headless Chrome also ignored the operator, and Google, DuckDuckGo, Brave and Startpage blocked headless Chrome. The searches were then run by hand on google.se in a private window (`hl=sv`, `gl=se`, `pws=0`), and the first own-site result was taken as it came. Both attempts are published.

## Test environment

The machine uses AdGuard DNS, which refuses connections to many ad and analytics hosts. Pages were tested the way a visitor with that filter sees them. Every refused host is logged per site. If a probe fails on a site where a host other than an ad or analytics host was refused, the result is scored could-not-verify.

## What I saw before the run

The driver smoke test ran S0 with the real inputs on all 11 salary tools, and I read four of those results (my own site, Börskollen, Nettocalc, Velja). After that, driver bugs were found with a rehearsal that used inputs outside the probes (38 000 kr, Göteborg, Malmö, church fee on). The drivers are in `drivers/` in this folder from this commit, so any later change to them shows in the history.
