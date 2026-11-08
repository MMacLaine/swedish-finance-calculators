#!/bin/bash
# Usage: bash run-inspect.sh id=url ...  (from repo root). Writes inspect-<id>.json beside this script.
D="$(cd "$(dirname "$0")" && pwd)"; E=$(cat "$D/inspect.js")
for p in "$@"; do id=${p%%=*}; u=${p#*=}; (WAIT=${WAIT:-7000} node _local/scripts/probe.mjs "$u" "$E" > "$D/inspect-$id.json" 2>&1; echo done $id) & done; wait
