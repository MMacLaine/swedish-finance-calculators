#!/bin/bash
# Audit v3.3: run every scripted probe, at most $P Chrome instances at a time (default 4; each job opens one
# Chrome at a time, so P jobs = P browsers).
#   bash run-all.sh          full run: S0-S5 and S7 on 11 salary tools, A1-A4, S6 on 20 sites -> ../results/
#   bash run-all.sh smoke    S0 only on the salary tools, one non-probe case per appendix tool, S6 link
#                            collection without status checks -> smoke/
# Optional: A2_HB_INCOME / A2_HB_FEE fill Handelsbanken's income and association-fee fields (not probe inputs).
set -u
D="$(cd "$(dirname "$0")" && pwd)"; cd "$D" || exit 1
MODE="${1:-full}"; P="${P:-4}"
SALARY="borskollen fortnox helhetskollen kalkylverket maclaine nettocalc ordio smartly spiris statsskuld velja"
# Paths stay relative to this folder: the job lines are split on spaces and the repo path has one.
if [ "$MODE" = smoke ]; then OUT="smoke"; else OUT="../results"; fi
mkdir -p "$OUT/logs"
JOBS="$OUT/logs/jobs.txt"; : > "$JOBS"
for s in $SALARY; do
  if [ "$MODE" = smoke ]; then echo "salary-$s node run-salary.mjs $s --probes S0 --out $OUT/$s-S0.json" >> "$JOBS"
  else echo "salary-$s node run-salary.mjs $s" >> "$JOBS"; fi
done
for f in appendix/*.js; do
  b="$(basename "$f" .js)"; g="$(echo "${b%%-*}" | tr a-z A-Z)"; site="${b#*-}"
  if [ "$MODE" = smoke ]; then echo "$b node run-appendix.mjs $g $site --smoke --out $OUT/appendix/$site-$g.json" >> "$JOBS"
  else echo "$b node run-appendix.mjs $g $site" >> "$JOBS"; fi
done
for s in $(node -e 'for (const s of require("./s6/sites.json")) console.log(s.id)'); do
  if [ "$MODE" = smoke ]; then echo "s6-$s node run-s6.mjs $s --collect-only --out-dir $OUT/s6" >> "$JOBS"
  else echo "s6-$s node run-s6.mjs $s" >> "$JOBS"; fi
done
{
  echo "mode: $MODE"; echo "started: $(date -u +%Y-%m-%dT%H:%M:%SZ)"; echo "node: $(node --version)"
  echo "chrome: $("${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}" --version 2>/dev/null)"
  echo "parallel: $P"; echo "jobs: $(wc -l < "$JOBS" | tr -d ' ')"
} > "$OUT/logs/run-info.txt"
# Each line: <log name> <command...>. Output of each job goes to logs/<name>.log.
export OUT
xargs -P "$P" -L 1 sh -c 'n="$0"; "$@" > "$OUT/logs/$n.log" 2>&1; echo "$(date -u +%H:%M:%S) $n exit $?"' < "$JOBS" | tee "$OUT/logs/progress.txt"
echo "finished: $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$OUT/logs/run-info.txt"
