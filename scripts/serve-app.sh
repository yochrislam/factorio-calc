#!/usr/bin/env bash
# Serve the living product (static HTML/JS modules, no build).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP="$ROOT/app"
PORT="${PORT:-8765}"

if [[ ! -d "$APP" ]]; then
  echo "App not found: $APP" >&2
  exit 1
fi

if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port $PORT is already in use:" >&2
  lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >&2
  exit 1
fi

cd "$APP"
echo "Serving $APP"
echo "Open http://127.0.0.1:${PORT}/"
exec python3 -m http.server "$PORT"
