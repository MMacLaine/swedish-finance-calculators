#!/bin/sh
# Measure 4a, take-home on 45 000 kr/month, Stockholm, born 1990, no church fee, 2026. Run from the repo root:
#   sh _local/competitive/round3/objective/raw/accuracy-salary/run.sh
# One headless load per site (statsskuld: one load + its own form POST). Output: run-<id>.json next to this file.
D="_local/competitive/round3/objective/raw/accuracy-salary"; P=_local/scripts/probe.mjs; SEED="$(cat $D/seed.js)"
r(){ SEED="$SEED$3" W=390 WAIT=${4:-7000} node $P "$2" "$(cat $D/salary-$1.js)" > $D/run-$1.json 2>&1; }
r velja https://velja.se/lonekalkyl &
r kalkylverket https://kalkylverket.se/kalkylatorer/skatt/inkomstskatt/lon-efter-skatt-kalkylator &
r smartly https://smartly.se/tools/salary-after-tax &
r helhetskollen https://www.helhetskollen.se/salary &
r borskollen https://www.borskollen.se/rakna-ut-lon-efter-skatt-kalkylator &
r maclaine https://maclaine.se/finance/salary &
r statsskuld https://statsskuld.se/berakna-nettolon "$(cat $D/seed-statsskuld-extra.js)" 11000 &
wait
# statsskuld year check (which tab panel is visible): salary-statsskuld-tabs.js, same SEED + seed-statsskuld-extra.js
