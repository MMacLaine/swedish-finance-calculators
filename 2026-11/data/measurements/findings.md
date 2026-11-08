# Round 3 objective measurements

Measured Sunday 2026-11-08, 18:00 to 18:35 CET (Stockholm), from a home connection on the owner's Mac. Measurements only, no scores, no ranking.

Everything is reproducible from the repo root:
- Measures 1 to 3: `sh _local/competitive/round3/objective/run.sh` (reads `sites.txt`, writes `raw/<id>.json` and `raw/<id>-fold.png`), then `node _local/competitive/round3/objective/summarize.mjs` for the tables. Layout readings that need a human eye are in `layout-notes.json`.
- Measure 4: `raw/accuracy-salary/run.sh`; scripts `raw/accuracy-isk-parental/drive-*.js`, `raw/accuracy-mortgage/drive-*.js`.
- Measure 5: `raw/coverage/`.
- Measure 6: `raw/search/search.json`, `search-build.mjs`.

## Read this first: the local DNS filter

The measuring Mac resolves DNS through a local filter (nameserver 127.99.196.213). It returns "not found" for many ad and analytics hosts: static.cloudflareinsights.com, region1.google-analytics.com, pagead2.googlesyndication.com, www.clarity.ms, cdn.taboola.com, analytics.tiktok.com and others. www.googletagmanager.com and connect.facebook.net do resolve. The browser still *requests* the blocked hosts, so they appear in the request and tracker columns, but they never load. So:
- Request counts, third-party domain lists, cookie lists and page weight are **lower bounds** on any site with blocked hosts. Scripts that never loaded could not pull further hosts or set their cookies.
- The column "Hosts blocked by local DNS filter" lists them per site (Chrome error `net::ERR_NAME_NOT_RESOLVED`).
- maclaine.se's only third-party host (the Cloudflare Web Analytics beacon) is among the blocked hosts, so its 0 KB third-party weight is not representative.

A re-run on an unfiltered network will give higher counts for kalkylverket, smartly, isk-guiden, rikatillsammans, borskollen, ekonomifokus, ficalc, listentotaxman and nerdwallet.

## Sites and URLs measured (measures 1 to 3)

| id | URL | Why this page |
|---|---|---|
| velja | https://velja.se/lonekalkyl | salary after tax |
| kalkylverket | https://kalkylverket.se/kalkylatorer/skatt/inkomstskatt/lon-efter-skatt-kalkylator | salary after tax |
| rikatillsammans | https://rikatillsammans.se/verktyg/ranta-pa-ranta/ | no salary tool; main calculator |
| ekonomifokus | https://www.ekonomifokus.se/bostad/deklaration/berakning-av-vinst-och-skatt-vid-bostadsforsaljning | no salary tool on its own domain (/lon-efter-skatt-kalkylator redirects to another site); main calculator page (home sale) |
| iskguiden | https://isk-guiden.se/isk-kalkylator/ | no salary tool; main calculator |
| smartly | https://smartly.se/tools/salary-after-tax | salary after tax |
| statsskuld | https://statsskuld.se/berakna-nettolon | salary after tax |
| avanza | https://www.avanza.se/manadssparande.html | no salary tool found; main savings calculator |
| nordnet | https://www.nordnet.se/se/tjanster/manadsspara (redirected to /tjanster/manadsspara) | no salary tool; main savings calculator |
| helhetskollen | https://www.helhetskollen.se/salary | salary after tax |
| borskollen | https://www.borskollen.se/rakna-ut-lon-efter-skatt-kalkylator | salary after tax |
| sbab | https://www.sbab.se/1/privat/lana/bolan/rakneexempel_for_bolan.html | mortgage page ("Räkna på bolånet") |
| sbab-lana | https://www.sbab.se/1/privat/lana/bolan/sa_mycket_kan_du_lana.html | max-loan calculator; blocked on the measuring load (see below) |
| handelsbanken | https://www.handelsbanken.se/sv/privat/bolan/bolanekalkyl | mortgage calculator |
| maclaine-salary | https://maclaine.se/finance/salary | salary after tax |
| maclaine-hub | https://maclaine.se/finance | hub |
| listentotaxman | https://www.listentotaxman.com/ | UK take-home calculator (home page is the tool) |
| moneysavingexpert | https://www.moneysavingexpert.com/tax-calculator/ | UK take-home calculator |
| nerdwallet | https://www.nerdwallet.com/taxes/calculators/tax-calculator | US income tax calculator |
| ficalc | https://ficalc.app/ | FIRE calculator (home page is the tool) |

Runs: run 1 at 18:17 CET (archived in `raw/run1/`), run 2 at 18:24 CET with failed-request logging added (the tables use run 2). In run 2, SBAB answered both pages with Akamai "Access Denied" and MoneySavingExpert served a Cloudflare challenge page ("Vänta..."), probably because other measurement loads hit those sites in the same half hour. Those three loads are kept in `raw/blocked/`. For sbab and moneysavingexpert the tables use run 1, which loaded normally but has no blocked-host log. sbab-lana has no valid load.

### Measure 1: privacy before any click

| Site | URL measured | Requests | 3P domains (n) | 3P domains | Tracker hosts (requested) | Hosts blocked by local DNS filter | Cookies (3P marked) | localStorage keys | Consent UI |
|---|---|---|---|---|---|---|---|---|---|
| velja | https://velja.se/lonekalkyl | 34 | 0 | none | none | none | 0: none | 0: none | none seen |
| kalkylverket | https://kalkylverket.se/kalkylatorer/skatt/inkomstskatt/lon-efter-skatt-kalkylator | 51 | 4 | adtraction.com, google-analytics.com, googlesyndication.com, googletagmanager.com | adtraction.com, pagead2.googlesyndication.com, region1.google-analytics.com, www.googletagmanager.com | 3: pagead2.googlesyndication.com, adtraction.com, region1.google-analytics.com | 0: none | 4: kv_ab_<uuid> | none seen |
| rikatillsammans | https://rikatillsammans.se/verktyg/ranta-pa-ranta/ | 101 | 11 | ahrefs.com, doubleclick.net, flourish.studio, google.com, google.se, googletagmanager.com, inmobi.com, lwadm.com, uri.sh, zdassets.com, zendesk.com | stats.g.doubleclick.net, www.googletagmanager.com | 5: lwadm.com, analytics.ahrefs.com, fundingchoicesmessages.google.com, region1.analytics.google.com, stats.g.doubleclick.net | 3: usprivacy, _ga_3MX9V3S1LK, _ga | 4: ZD-store, ZD-suid, CMPList, ZD-buid | yes, 100% of first screen (CMP: fundingchoicesmessages.google.com, cmp.inmobi.com, api.cmp.inmobi.com) |
| ekonomifokus | https://www.ekonomifokus.se/bostad/deklaration/berakning-av-vinst-och-skatt-vid-bostadsforsaljning | 29 | 3 | adt512.com, adtraction.com, cookieyes.com | track.adtraction.com | 2: track.adtraction.com, cdn.adt512.com | 2: __cf_bm, wt_consent | 0: none | yes, 47% of first screen (CMP: directory.cookieyes.com) |
| iskguiden | https://isk-guiden.se/isk-kalkylator/ | 14 | 4 | ahrefs.com, clarity.ms, google-analytics.com, googletagmanager.com | region1.google-analytics.com, www.clarity.ms, www.googletagmanager.com | 3: www.clarity.ms, analytics.ahrefs.com, region1.google-analytics.com | 2: _ga_C56EDD0GNV, _ga | 0: none | none seen |
| smartly | https://smartly.se/tools/salary-after-tax | 30 | 4 | google-analytics.com, googlesyndication.com, googletagmanager.com, umami.is | cloud.umami.is, gateway.umami.is, pagead2.googlesyndication.com, region1.google-analytics.com, www.googletagmanager.com | 2: pagead2.googlesyndication.com, region1.google-analytics.com | 2: _ga_NV435Y0DXT, _ga | 0: none | none seen |
| statsskuld | https://statsskuld.se/berakna-nettolon | 31 | 2 | datatables.net, jquery.com | none | none | 3: XSRF-TOKEN, statsskuldse_session, cf_clearance | 0: none | none seen |
| avanza | https://www.avanza.se/manadssparande.html | 61 | 0 | none | none | none | 2: AZAPERSISTENCE, AZA_VISITOR | 4: _platform-global-context, AZA_HASH, platform-routeConfigCacheDate, platform-routeConfig | yes, 33% of first screen |
| nordnet | https://www.nordnet.se/tjanster/manadsspara | 78 | 1 | nntech.io | none | none | 2: lang, _csrf | 0: none | yes, 32% of first screen |
| helhetskollen | https://www.helhetskollen.se/salary | 30 | 0 | none | none | none | 0: none | 0: none | yes, 37% of first screen |
| borskollen | https://www.borskollen.se/rakna-ut-lon-efter-skatt-kalkylator | 92 | 13 | adnami.io, advisible.com, doubleclick.net, ebxcdn.com, google-analytics.com, googleapis.com, googletagmanager.com, gstatic.com, lwadm.com, ratsit.se, tradingview-widget.com, tradingview.com, uniconsent.com | ad.doubleclick.net, region1.google-analytics.com, www.googletagmanager.com | 6: lwadm.com, applets.ebxcdn.com, macro.adnami.io, source.advisible.com, ad.doubleclick.net, region1.google-analytics.com | 0: none | 1: __unic | yes, 100% of first screen (CMP: cmp.uniconsent.com) |
| sbab | https://www.sbab.se/1/privat/lana/bolan/rakneexempel_for_bolan.html | 84 | 2 | boost.ai, piwik.pro | sbab.containers.piwik.pro | not logged (run 1) | 1: JSESSIONID | 2: sbab-dsd-frontend-apps-loaded, _cmp_piwik_reconcile | yes, 100% of first screen |
| handelsbanken | https://www.handelsbanken.se/sv/privat/bolan/bolanekalkyl | 30 | 0 | none | none | none | 0: none | 0: none | yes, 90% of first screen |
| maclaine-salary | https://maclaine.se/finance/salary | 21 | 1 | cloudflareinsights.com | static.cloudflareinsights.com | 1: static.cloudflareinsights.com | 1: cf_clearance | 1: financeMunDefaultMigrated | none seen |
| maclaine-hub | https://maclaine.se/finance | 17 | 1 | cloudflareinsights.com | static.cloudflareinsights.com | 1: static.cloudflareinsights.com | 1: cf_clearance | 2: financeMunDefaultMigrated, finance_last_seen | none seen |
| listentotaxman | https://www.listentotaxman.com/ | 102 | 20 | ad-delivery.net, cloudflare.com, content-loader.com, cookielaw.org, criteo.net, doubleclick.net, facebook.net, fontawesome.com, fuseplatform.net, google-analytics.com, google.com, google.se, googleapis.com, googlesyndication.com, googletagmanager.com, googleusercontent.com, gstatic.com, html-load.com, jsdelivr.net, unpkg.com | connect.facebook.net, pagead2.googlesyndication.com, securepubads.g.doubleclick.net, static.criteo.net, stats.g.doubleclick.net, www.google-analytics.com, www.googletagmanager.com | 11: html-load.com, cdn.fuseplatform.net, fb.html-load.com, securepubads.g.doubleclick.net, pagead2.googlesyndication.com, static.criteo.net, ad-delivery.net, region1.analytics.google.com, stats.g.doubleclick.net, fundingchoicesmessages.google.com, www.google-analytics.com | 5: img_fmjxc5tdjxcxbj4sjo.. (3P .stg.content-loader.com), PHPSESSID, _ga_XR104G6C0G, _ga, FCCDCF | 1: loglevel | yes, 100% of first screen (CMP: cdn.cookielaw.org, fundingchoicesmessages.google.com) |
| moneysavingexpert | https://www.moneysavingexpert.com/tax-calculator/ | 45 | 3 | appsflyersdk.com, googletagmanager.com, monygroup.com | www.googletagmanager.com | not logged (run 1) | 5: cf_clearance, __cf_bm, source, web-session-id, visitorId | 0: none | none seen |
| nerdwallet | https://www.nerdwallet.com/taxes/calculators/tax-calculator | 111 | 23 | bing.com, browser-intake-datadoghq.com, cookielaw.org, doubleclick.net, facebook.com, facebook.net, google.com, google.se, googletagmanager.com, liadm.com, nerdwallet.io, onetrust.com, openai.com, pinimg.com, pinterest.com, reddit.com, redditstatic.com, taboola.com, tiktok.com, tvpixel.com, veritonic.com, veritonicmetrics.com, videoamp.com | analytics.tiktok.com, bat.bing.com, browser-intake-datadoghq.com, cdn.taboola.com, connect.facebook.net, ct.pinterest.com, s.pinimg.com, stats.g.doubleclick.net, www.facebook.com, www.googletagmanager.com | 13: browser-intake-datadoghq.com, ct.pinterest.com, stats.g.doubleclick.net, region1.analytics.google.com, c.tvpixel.com, b.videoamp.com, analytics.tiktok.com, b-code.liadm.com, pixel-config.reddit.com, cdn.taboola.com, bat.bing.com, bzrcdn.openai.com, alb.reddit.com | 18: cee (3P .meta.nerdwallet.io), ajs_anonymous_id, wordpress_session_active, X-NW-sig_lvl, X-NW-f_opt, X-NW-bt, X-NW-bt_ua, nws4, _cfuvid, cf_clearance, __cf_bm, _ga_4JQS1HXE97, _ga, _fbp, OTGPPConsent, _rdt_uuid, OptanonConsent, _dd_s | 5: lastExternalReferrer, lastExternalReferrerTime, ajs_anonymous_id, cookie_id, ajs_user_id | yes, 26% of first screen (CMP: cdn.cookielaw.org, geolocation.onetrust.com) |
| ficalc | https://ficalc.app/ | 54 | 6 | doubleclick.net, google.com, google.se, googleapis.com, googletagmanager.com, gstatic.com | stats.g.doubleclick.net, www.googletagmanager.com | 2: region1.analytics.google.com, stats.g.doubleclick.net | 3: appearance, _ga_PQ9DSLNL9K, _ga | 0: none | none seen |

### Measure 2: phone layout at 390 x 844 (default state, before any input)

| Site | First input y | First result y | Result note | Page height (docH) | Consent UI on first screen | Covers first input |
|---|---|---|---|---|---|---|
| velja | 512 | 804 | fixed bottom bar 35 164 kr (default 45 000, rikssnitt); main card at 1054 | 8446 | none | no banner |
| kalkylverket | 942 | 497 | summary card 28 039 kr (default 35 000, snitt) above the form; main figure 1336; sticky site search at 9 excluded | 10548 | none | no banner |
| rikatillsammans | 1446 | 855 | 546 233 kr headline above the inputs; fixed search box excluded | 13180 | top 0, height 844, 100% | yes (full-screen) |
| ekonomifokus | - | - | calculator form container at y 1614 renders empty (0 inputs) before consent; after clicking 'Neka alla' (separate probe) the first calculator input is at y 4546 | 64753 | top 445, height 399, 47% | no |
| iskguiden | 1752 | 2314 | 2 130 kr (default 500 000) | 11941 | none | no banner |
| smartly | 829 | 1292 | 35 168 SEK (default 45 000, Stockholm) | 6687 | none | no banner |
| statsskuld | 385 | - | no result until the form is submitted (server round trip) | 7459 | none | no banner |
| avanza | 2684 | 2614 | 980 000 kr savings result | 5224 | top 568, height 276, 33% | no |
| nordnet | 2738 | 3289 | 1 503 823 savings result | 5511 | top 536, height 292, 32% | no |
| helhetskollen | 610 | - | no result until a salary is typed | 4629 | top 535, height 309, 37% | yes |
| borskollen | 429 | 713 | 27,381 kr (default 35 000, Ale) | 12724 | top 0, height 844, 100% | yes (full-screen) |
| sbab | - | 512 | measured in run 1 (run 2 got Akamai "Access Denied"); page is a fixed worked example (1 000 000 kr, 2,85 %), no inputs | 3662 | top 0, height 844, 100% | yes (full-screen) |
| handelsbanken | 1001 | - | no result until inputs are typed | 5585 | top 84, height 760, 90% | yes (full-screen) |
| maclaine-salary | 855 | 65 | sticky strip 39 279 kr/mån (default 50 000, born 1995, Stockholm) | 8363 | none | no banner |
| maclaine-hub | - | - | hub page, no calculator | 8692 | none | no banner |
| listentotaxman | 219 | - | no result until a salary is typed; first input was at 119 in run 1 (ad slot height varies) | 2256 | top 0, height 844, 100% | yes (full-screen) |
| moneysavingexpert | 499 | - | measured in run 1 (run 2 got a Cloudflare challenge page); no result until a salary is typed | 5724 | none | no banner |
| nerdwallet | 633 | 1270 | $13,169.88 (default $100,000) | 12665 | top 624, height 220, 26% | yes |
| ficalc | 518 | - | results live on a separate Results tab | 1696 | none | no banner |

### Measure 3: page weight at the 8 s snapshot (fresh profile, empty cache)

| Site | Transferred KB | of which third-party KB | Finished requests | Largest types (KB) |
|---|---|---|---|---|
| velja | 528 | 0 | 34 | Script 277, Font 192, Document 21 |
| kalkylverket | 1130 | 178 | 49 | Script 777, Fetch 185, Other 89 |
| rikatillsammans | 5458 | 819 | 94 | Image 3894, Script 1091, Font 206 |
| ekonomifokus | 360 | 0 | 31 | Font 180, Document 89, Image 39 |
| iskguiden | 610 | 177 | 11 | Image 316, Script 183, Font 69 |
| smartly | 454 | 183 | 28 | Script 335, Font 48, Fetch 21 |
| statsskuld | 847 | 63 | 31 | Font 588, Script 131, Stylesheet 79 |
| avanza | 1132 | 0 | 60 | Script 926, Font 117, XHR 54 |
| nordnet | 1998 | 93 | 77 | Script 1352, Document 400, Image 89 |
| helhetskollen | 417 | 0 | 29 | Script 295, Font 65, Stylesheet 31 |
| borskollen | 1663 | 843 | 84 | Script 1101, Image 200, Fetch 164 |
| sbab | 794 | 273 | 82 | Script 506, Stylesheet 124, Font 80 |
| handelsbanken | 1959 | 0 | 30 | Script 1115, Other 435, Image 193 |
| maclaine-salary | 314 | 0 | 20 | Script 180, Font 62, Document 35 |
| maclaine-hub | 198 | 0 | 15 | Script 84, Font 62, Document 26 |
| listentotaxman | 2404 | 2219 | 70 | Script 1816, Fetch 183, Font 166 |
| moneysavingexpert | 1125 | 350 | 45 | Script 830, Document 116, Image 111 |
| nerdwallet | 3131 | 1959 | 96 | Script 2818, Document 107, Font 80 |
| ficalc | 760 | 249 | 52 | Script 595, Font 71, Image 42 |


Notes on measure 1:
- "Tracker hosts" uses compete-measure's fixed regex list (ads, analytics, tag managers, session replay, social pixels). It flags maclaine.se's Cloudflare Web Analytics beacon and the first-party-hosted umami on smartly.
- "Consent UI" means a fixed, sticky or dialog element on the first screen whose text matches cookie or consent words. MoneySavingExpert showed no banner within 8 s from this Swedish IP. The screenshot `raw/moneysavingexpert-fold.png` confirms that.
- maclaine.se sets one cookie, `cf_clearance` (Cloudflare bot detection, set at the edge, HttpOnly), and writes localStorage keys from its own code (`financeMunDefaultMigrated`; the hub also writes `finance_last_seen`).
- velja, helhetskollen, handelsbanken, avanza and nordnet sent no request to any host on the tracker list before a click. helhetskollen, handelsbanken, avanza and nordnet show a consent banner. velja shows none.
- The ekonomifokus calculator does not render before a consent choice. The form container at y 1614 is empty, with 0 inputs. After clicking "Neka alla" (a separate probe), 4 inputs appear, the first at y 4546.

Notes on measure 2:
- y is CSS pixels from the top of the document at 390 px width. The first screen is y 0 to 844.
- Default inputs differ per site (salary 35 000 / 45 000 / 50 000; municipality average, Ale or Stockholm), so the default-state result figures are not comparable with each other. The comparable figures are in measure 4a.
- Result positions **after** typing the test salary (from the 4a drives) are in the 4a table.

Notes on measure 3:
- Weight is the sum of CDP `Network.loadingFinished.encodedDataLength` (bytes over the wire, compressed, for requests that finished within 8 s). Lazy-loaded content after 8 s and anything loaded on scroll are not counted. Requests to DNS-blocked hosts count as 0.

## Measure 4: accuracy

Official references: take-home on 45 000 kr/month, Stockholm, born 1990, no church fee, 2026: payslip (Skatteverket table 31) 35 550 kr; final yearly tax basis about 35 810 kr. ISK tax 2026 on 500 000 kr: 2 130 kr. Max parental benefit per day at sickness-benefit level 2026: 1 259 kr. Amortisation on a 3 600 000 kr loan at 90% LTV: 2% a year = 72 000 kr/yr = 6 000 kr/month.

International sites: not applicable (Swedish rules).

### 4a. Take-home pay (driven at 390 px with probe.mjs, inputs read back after setting)

| Site | URL | Inputs read back | Net shown (kr/month) | Matches | vs 35 550 | vs 35 810 | Result y after input | Notes |
|---|---|---|---|---|---|---|---|---|
| velja | velja.se/lonekalkyl | 45000; Stockholm (30,55 %); year 2026; church off; 66+ off | 35 811 | final-tax basis | +261 | +1 | 1144 (fixed bottom bar at 804) | no birth-year field, only a 66+ checkbox |
| kalkylverket | kalkylverket.se/kalkylatorer/skatt/inkomstskatt/lon-efter-skatt-kalkylator | 45000; Stockholm (30,55 %) | 35 811 | final-tax basis | +261 | +1 | 1301 (fixed summary card at 650) | no year, age or church fields |
| smartly | smartly.se/tools/salary-after-tax | 45000; Stockholm (30.55%) | 35 168 | neither | -382 | -642 | 1292 | no year, age or church fields |
| statsskuld | statsskuld.se/berakna-nettolon | 45000; STOCKHOLM preselected (label 31.58%); church fee 0; 2026 tab | 34 991 | neither | -559 | -819 | 344, after form submit and page reload | no age field |
| helhetskollen | helhetskollen.se/salary | 45000; "Stockholm - tabell 31" | 35 550 | payslip table 31 | 0 | -260 | 997 | shows 34 652 (own standard estimate) until a municipality is chosen; no age field; cookie banner over the first input |
| borskollen | borskollen.se/rakna-ut-lon-efter-skatt-kalkylator | 45000; Stockholms domkyrkoförsamling | 35 206 | neither | -344 | -604 | 713 | no church toggle: the 449 kr church fee is always deducted, so "no church fee" could not be set; default parish in Ale |
| maclaine.se | maclaine.se/finance/salary | 45000; born 1990; Stockholm (30,55%); no church; employed | 35 810 | final-tax basis | +260 | 0 | 2254 (sticky strip "Nettolön 35 810 kr/mån" at 65) | default municipality now Stockholm |

No take-home calculator found: rikatillsammans (/verktyg/jamfor-lon/ only compares gross salaries), ekonomifokus (redirects to gåmedifacket.nu, not driven), isk-guiden, nordnet, sbab. For avanza and handelsbanken: none found (homepage links did not load headless and there is no usable sitemap), so this is "none found", not proven absent.

### 4b. ISK tax 2026 on a 500 000 kr capital base (official 2 130 kr)

| Site | URL | Inputs read back | Shown | Matches | Notes |
|---|---|---|---|---|---|
| kalkylverket | kalkylverket.se/kalkylatorer/skatt/kapitalskatt/isk-skatt-kalkylator | kapitalunderlag 500000 | 2 130 kr | yes | 600 000 gives 3 195 |
| isk-guiden | isk-guiden.se/isk-kalkylator/ | portfolio 500000, statslåneränta 2.55 | 2 130 kr | yes | 600 000 gives 3 195 |
| velja | velja.se/isk-eller-depa | start 500000, monthly 0, return 0 %, 1 year | 2 130 kr | yes | multi-year ISK vs depå tool driven to a one-year, zero-return case |
| maclaine.se | maclaine.se/finance/sparande | start 500000, monthly 0, return 0, 1 year, ISK | 2 130 kr | yes | compound-growth tool driven to one year; no dedicated single-year ISK page |
| maclaine.se | maclaine.se/finance/guides/isk-skatt-2027 | rate slider 2.55, balance 500000 | 2 130 kr in the slider verdict text | yes | 2027 guide tool; its main output card stays on 2,96 % and shows 2 376 kr ("ISK-skatt för 2027") whatever the slider says |

No ISK calculator: borskollen (/isk-skatt is an article; its example says 500 000 kr gives "ca 1 240 kr", while its own formula 200 000 x 1,07 % gives about 2 140 kr), nordnet and avanza (text only), rikatillsammans jamfor-isk (no tax output), smartly, helhetskollen, statsskuld, ekonomifokus.

### 4c. Maximum parental benefit per day at sickness-benefit level 2026 (official 1 259 kr), salary set to 80 000 kr/month

| Site | URL | Inputs read back | Shown | Matches | Notes |
|---|---|---|---|---|---|
| kalkylverket | kalkylverket.se/kalkylatorer/privatekonomi/lon-och-inkomst/foraldrapenning-kalkylator | salary 80000, Hel dag | 1 259 kr/day | yes | page also states "högst 1 259 kr per dag" |
| velja | velja.se/foraldrapenning | parent 1 salary 80000 | 1 259 kr/day | yes | monthly 37 770 kr (1 259 x 30) |
| maclaine.se | maclaine.se/finance/foraldrapenning | gross 80000 (SGI field filled 592000) | 1 259 kr ("Dagsbelopp sjukpenningnivå") | yes | |
| smartly | smartly.se/tools/parental-leave | parent 1 salary 80000 | no per-day output; "FK benefit/month 38 000 SEK" | no (-9 kr/day) | page states "Max daily benefit: 1 250 SEK"; 38 000 = 1 250 x 30.4 |

No parental-benefit tool: isk-guiden, rikatillsammans, statsskuld, helhetskollen, borskollen, ekonomifokus, avanza, nordnet.

### 4d. Mortgage amortisation (price 4 000 000 kr, deposit 400 000 kr)

| Site | URL | Inputs read back | Amortisation shown | Matches 2% | Notes |
|---|---|---|---|---|---|
| maclaine.se | maclaine.se/finance/bolan | price 4 000 000, deposit 400 000, rate 2.72 %, amort 2 %, 30 yr | "Månadsamortering 6 000 kr", "2%/år (LTV > 70%)" | yes | |
| velja | velja.se/bolanekalkyl | price 4 000 000, deposit 10 % (400 tkr), fee 4 000, rate 2.8 %, household gross 720 000/yr | "Amortering (2,0 %) 6 000 kr" | yes | |
| kalkylverket | kalkylverket.se/kalkylatorer/bostad-fastighet/kopa-bostad/bolanekalkylator (the /bostad-fastighet/bolanekalkylator URL redirects here) | bostadsrätt, price 4 000 000, deposit 400 000 (10,0 %), fee 4 000 | "Amortering per månad, Takt 2,0 %: 6 000 kr"; loan 3 600 000; LTV 90,0 % | yes | assumes rate 3,95 %, stress test 7 %; income left at defaults ("Nästa" skipped the Ekonomi step) |
| handelsbanken | handelsbanken.se/sv/privat/bolan/bolanekalkyl | just me, bostadsrätt, fee 4 000, deposit 400 000, income 60 000/month, no CSN, children or other loans, rate 2,7 % | "Du kan preliminärt låna 3 600 000 kr", "köpa för 4 000 000 kr", "Amortering 2% 6 000 kr" (interest 5 670 kr) | yes | no price input: price is an output, capped by the deposit at 90 %; clicked "Godkänn nödvändiga" first |
| ekonomifokus | ekonomifokus.se/kalkylator-boendekostnad | price 4 000 000, deposit 400 000, rate 1.59 % | "Amortering 6 000 kr"; loan 3 600 000; LTV 90 | yes | scripts load only after the first user interaction (synthetic events sent); the input named "lanebelop" is labelled Kontantinsats; the 400 000 kr deposit is flagged red because the code's minimum is 15 % of price (bank-main.js `pris - (0.85 * pris)`) while the page text says 10 % |
| sbab | sbab.se/1/privat/lana/bolan/sa_mycket_kan_du_lana.html | n/a | not driven | n/a | 5-step wizard; Akamai returned "Access Denied" on the third headless load, so no further attempts. rakneexempel_for_bolan.html is a fixed example with no inputs (1 000 000 kr loan, 70 % LTV, straight amortisation over 40 years, 2 084 kr/month) |

No mortgage calculator: nordnet (/tjanster/lan/bolan, static example, 30-year straight amortisation 6 944 kr/month), avanza (/bolan/bolan.html has no inputs), borskollen (rate article with a Compricer widget), helhetskollen, statsskuld, smartly, rikatillsammans, isk-guiden. International: NerdWallet has a mortgage calculator (nerdwallet.com/mortgages/calculators/mortgage-calculator); the Swedish rule does not apply to it. Raw: `raw/accuracy-mortgage/results.json`.

## Measure 5: coverage

Recorded 2026-11-08 from each site's own navigation or tool index. Index URLs per site and the evidence for every cell are in `raw/coverage/coverage.json`; `raw/coverage/build_coverage.py` rebuilds the table and states the rule.

Rule: "Y" means an interactive calculator on the site's own domain gives this result, including when it is one mode or output of a broader tool (the evidence note says so). Articles, fixed worked examples and "compare yourself to others" percentile tools count as "·". ISK is "Y" only when a calculator outputs the yearly ISK tax for a capital base you enter. "?" means it could not be confirmed. For the UK and US sites the local equivalent was judged (US 401k/IRA counts as pension; UK student-loan plans and pension salary sacrifice are options inside the take-home calculators).

| Site | SAL | N2G | MTG | MAX | AMO | ISK | GRO | FIRE | PEN | SAC | CGH | CGS | PAR | SICK | UI | STU | BUD | DEK | EMP | 312 | Yes | ? |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| velja.se | Y | · | Y | Y | Y | · | Y | Y | · | Y | · | · | Y | · | Y | · | Y | · | · | Y | 11 | 0 |
| kalkylverket.se | Y | Y | Y | Y | Y* | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | · | · | Y | Y | Y | 18 | 0 |
| rikatillsammans.se | · | · | · | · | · | · | Y | Y | · | · | · | · | · | · | · | · | · | · | · | · | 2 | 0 |
| ekonomifokus.se | · | · | Y | Y | Y | · | Y | · | · | · | Y | · | · | · | · | · | · | · | · | · | 5 | 0 |
| isk-guiden.se | · | · | · | · | · | Y | Y | · | · | · | · | · | · | · | · | · | · | · | · | · | 2 | 0 |
| smartly.se | Y | · | · | · | · | · | · | · | Y | · | · | · | Y | · | · | · | Y | Y | Y | · | 6 | 0 |
| statsskuld.se | Y | Y | · | · | · | · | Y | Y | · | · | · | · | · | · | · | · | · | · | Y | · | 5 | 0 |
| avanza.se | · | · | · | Y | · | · | Y | · | · | · | · | · | · | · | · | · | · | · | · | · | 2 | 0 |
| nordnet.se | · | · | · | · | · | · | Y | · | · | · | · | · | · | · | · | · | · | · | · | · | 1 | 0 |
| helhetskollen.se | Y | · | · | · | · | · | Y | Y | Y | · | · | · | · | · | · | · | · | · | · | · | 4 | 0 |
| borskollen.se | Y | · | · | · | · | · | Y | · | · | · | · | · | · | · | · | · | · | · | · | · | 2 | 0 |
| sbab.se | · | · | ? | Y | ? | · | ? | · | · | · | · | · | · | · | · | · | · | · | · | · | 1 | 3 |
| handelsbanken.se | · | · | Y | Y | Y* | · | Y | · | · | · | · | · | · | · | · | · | · | · | · | · | 4 | 0 |
| maclaine.se/finance | Y | Y | Y | Y | Y | · | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | Y | 19 | 0 |
| listentotaxman.com | Y | · | · | · | · | · | · | · | · | Y | · | · | · | · | · | Y | · | · | · | · | 3 | 0 |
| moneysavingexpert.com | Y | · | Y | Y | · | · | Y | · | Y | · | · | · | · | · | · | Y | Y | · | · | · | 7 | 0 |
| nerdwallet.com | · | · | Y | Y | · | · | Y | · | Y | · | ? | Y | · | · | · | Y | Y | Y | · | · | 8 | 1 |
| ficalc.app | · | · | · | · | · | · | · | Y | · | · | · | · | · | · | · | · | · | · | · | · | 1 | 0 |

Legend: Y yes, · no, ? unclear. SAL = salary after tax; N2G = salary from take-home; MTG = mortgage cost; MAX = max loan / affordability; AMO = amortisation rule; ISK = ISK tax; GRO = savings growth / compound interest; FIRE = FIRE; PEN = pension (state or occupational); SAC = salary sacrifice; CGH = capital gains, home sale; CGS = capital gains, shares; PAR = parental benefit; SICK = sick pay; UI = unemployment insurance; STU = student loan; BUD = budget; DEK = tax return estimate; EMP = employer cost; 312 = company owner (3:12)

\* Changed from "?" to "Y" using measure 4d. The coverage pass could not load kalkylverket's mortgage calculator (only its search box rendered in 3 loads) and left Handelsbanken's amortisation unconfirmed. The 4d drives then loaded both and read "Amortering per månad, Takt 2,0 %: 6 000 kr" and "Amortering 2% 6 000 kr".

Index URLs: velja.se/kalkylatorer ("37 verktyg"); kalkylverket.se/kalkylatorer/privatekonomi, /skatt, /bostad-fastighet, /foretagande and /sitemap.xml (519 URLs); rikatillsammans.se/verktyg?rt=latest&t=list&num=100 (15 tools, headless); ekonomifokus "Räknare" menu; isk-guiden.se/verktyg/; smartly.se/tools; statsskuld.se/kalkylatorer plus navigation; avanza homepage navigation (headless) plus /sitemap1.xml and /sitemap2.xml; nordnet /se navigation plus /sitemaps/special/cms.xml; helhetskollen homepage "Kalkylatorer" list; borskollen navigation plus /sitemap.xml; sbab /1/privat.html navigation plus /sitemap.xml; handelsbanken /sv/privat/bolan plus sitemapxml.xml?lang=sv; maclaine: finance.html hub cards and the finance/ file listing in the repo; listentotaxman home page and navigation; moneysavingexpert /site/tools-and-calculators/ (read through WebFetch, because headless Chrome got a Cloudflare challenge and curl got a 403); nerdwallet.com/calculators; ficalc.app (single app).

Notes:
- SBAB's three "?" cells: Akamai blocked headless Chrome after 3 loads and was still blocking on a later retry.
- ISK: the ISK tax on velja (/isk-eller-depa), maclaine (/finance/sparande, /barnsparande, /isk-vs-pension) and rikatillsammans appears only inside growth or comparison tools, so they are "·" by the rule above. In 4b, velja and maclaine/sparande were still driven to a one-year, zero-return case and showed 2 130 kr.
- Some "Y" cells rest on one output of a broader tool: statsskuld FIRE is /kalkylatorer/leva-pa-rantan (capital needed for a passive monthly income); statsskuld employer cost is a line on /berakna-nettolon; smartly employer cost comes from /tools/job-offer-evaluator.
- Pages that look like calculators but were marked "·": Nordnet /tjanster/pension/lonevaxling (generic savings widget); Avanza /pension/borja-pensionsspara.html (private savings to age 67); rikatillsammans jamfor-lon, jamfor-isk and jamfor-pension (comparison with other people); Handelsbanken's ISK-tax and budget pages (articles with no inputs).
- Kalkylverket's tax category page links an aktieskatt calculator that returned 404.

## Measure 6: search visibility (proxy)

The search tool is the Claude Code WebSearch tool. It describes itself as US-only, so it is **not Swedish Google**. It has no Swedish locale, no personalisation, no ads, no featured snippets and no knowledge panels. It returned 14 to 24 results per query (not a fixed 10), and each query was run once, so the stability of these positions is unknown. Every listed URL counts as one position. Raw lists are in `raw/search/search.json`.

| Site | lön efter skatt | bolånekalkylator | ränta på ränta | fire kalkylator | reavinstskatt bostad | isk skatt 2026 |
|---|---|---|---|---|---|---|
| velja.se | - | - | - | - | - | - |
| kalkylverket.se | - | - | - | - | - | - |
| rikatillsammans.se | 4, 6 (forum) | 11 (forum) | 2, 4 (/ranta-pa-ranta/, /verktyg/ranta-pa-ranta/) | 1, 2 (forum) | - | 15 (forum) |
| ekonomifokus.se | - | - | - | - | 1 (guide) | - |
| isk-guiden.se | - | - | 17 (/ranta-pa-ranta/) | - | - | 9, 12 (guides) |
| smartly.se | - | - | - | - | - | - |
| statsskuld.se | - | - | - | - | - | - |
| avanza.se | - | - | - | - | - | - |
| nordnet.se | - | - | - | - | - | 10 (blog) |
| helhetskollen.se | - | - | - | - | - | - |
| borskollen.se | - | - | 19 (calculator) | - | - | 19, 23 (/isk-skatt, news) |
| sbab.se | - | - | - | - | - | - |
| handelsbanken.se | - | - | - | - | 19 (article) | 2, 20 (articles) |
| maclaine.se | - | - | - | - | - | - |
| listentotaxman.com | - | - | - | - | - | - |
| moneysavingexpert.com | - | - | - | - | - | - |
| nerdwallet.com | - | - | - | - | - | - |
| ficalc.app | - | - | - | - | - | - |

Top 5 distinct domains per query (result count in brackets):
- lön efter skatt (19): fortnox.se, sweclockers.com, rikatillsammans.se, valem.onrender.com, bokio.se
- bolånekalkylator (14): nordea.fi, konsumenternas.se, boio.se, primecalcpro.com, securities.io
- ränta på ränta (19): alandsbanken.ax, rikatillsammans.se, aktiespararna.se, nordea.se, swedbank.se
- fire kalkylator (23): rikatillsammans.se, primecalcpro.com, en.wikipedia.org, help.fieldsystems.trimble.com, apps.apple.com
- reavinstskatt bostad (21): ekonomifokus.se, familjensjurist.se, riksdagen.se, dagensps.se, data.riksdagen.se
- isk skatt 2026 (24): hackmd.io, handelsbanken.se, seb.se, realtid.se, dagensps.se

Spam and off-topic pages appear in several lists (hackmd.io pastes in three queries; fire-protection pages in "fire kalkylator"). Search Console data from the site owner's side would be a better measure for maclaine.se.

## Method and limits

- Browser: headless Google Chrome (system install) over the DevTools protocol, no dependencies. Every page load uses a fresh profile with an empty cache and no cookies. Phone emulation is 390 x 844 at DPR 2 with an Android Chrome user agent and sv-SE language. The snapshot is taken 8 s after navigation, with no scroll or click before it.
- Network: home connection in Stockholm, with a **local DNS filter** that blocks many ad and analytics hosts (see the top section). Counts are lower bounds wherever the blocked-host column is not "none".
- Third party means a different registrable domain from the page (last two labels, three for co.uk-style suffixes). Subdomains of the same brand on another domain (nntech.io for nordnet, nerdwallet.io) count as third party.
- Tracker classification is a fixed regex list in `measure.mjs` (copied from `_local/scripts/compete-measure.mjs`), not a judgement of each host.
- The consent-banner check is heuristic: a fixed, sticky, dialog or high z-index element on the first screen whose text matches cookie or consent words. Each detection was checked against its fold screenshot.
- First input and first result positions are read by hand from the scan output and screenshots (`layout-notes.json`). Site-search boxes and fixed headers are excluded.
- Accuracy figures come from driving the live calculators with scripted input events. Each input was read back after setting it. A tool that could not be driven reliably is marked "not driven", never estimated.
- Coverage counts interactive calculators only. An article is a "no". Judged from each site's own navigation or tool index.
- Some sites change between loads: ad slots shift layout by about 100 px (listentotaxman), and A/B tests run (kalkylverket's `kv_ab_*` keys). Bot protection blocked repeat loads on SBAB and MoneySavingExpert within half an hour. A repeat run should spread each site's loads out.
- One load per site per measurement pass. Run 2 repeated run 1 to add failed-request logging. The accuracy and coverage passes made a handful of further loads per site.
