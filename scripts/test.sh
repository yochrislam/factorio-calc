#!/usr/bin/env bash
# Product calc tests (app/). Prototype harness is tests/golden-ratios.js if you want it.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
node "$ROOT/tests/calc-ratios.mjs"
node "$ROOT/tests/calc-tree.mjs"
