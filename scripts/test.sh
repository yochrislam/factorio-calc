#!/usr/bin/env bash
# Product calc (app/). Prototype harness is tests/golden-ratios.js if you want it.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
exec node "$ROOT/tests/calc-ratios.mjs"
