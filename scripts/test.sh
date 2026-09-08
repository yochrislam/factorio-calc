#!/usr/bin/env bash
# Run the golden-ratio harness against the v0.1 prototype calc.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
exec node "$ROOT/tests/golden-ratios.js"
