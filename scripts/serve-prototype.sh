#!/usr/bin/env bash
# Serve the v0.1 Nauvis prototype (static HTML/CSS/JS, no build).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROTO="$ROOT/prototypes/v0.1"
PORT="${PORT:-8765}"

if [[ ! -d "$PROTO" ]]; then
  echo "Prototype not found: $PROTO" >&2
  exit 1
fi

if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port $PORT is already in use:" >&2
  lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >&2
  exit 1
fi

cd "$PROTO"
echo "Serving $PROTO"
echo "Open http://127.0.0.1:${PORT}/"
exec python3 -m http.server "$PORT"
