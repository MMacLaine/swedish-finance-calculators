#!/bin/sh
# Repeatable run of the privacy, phone-layout and page-weight measures. Needs Node 22+ and Google Chrome.
#   sh 2026-11/scripts/run.sh            (from the repository root)
# Four parallel lanes over sites.txt, one page load per site. Output: data/measurements/<id>.json and <id>-fold.png
D=$(cd "$(dirname "$0")" && pwd)
OUT="$D/../data/measurements-rerun"
mkdir -p "$OUT"
for lane in 0 1 2 3; do
  WAIT=${WAIT:-8000} node "$D/measure.mjs" "$OUT" $(grep -v '^#' "$D/sites.txt" | grep . | awk -v l=$lane 'NR%4==l') &
done
wait
