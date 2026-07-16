#!/bin/bash
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
kill $(lsof -ti:3001) 2>/dev/null || true

echo "=== Fishing Funds Web (Production) ==="
echo "Building..."
cd "$ROOT"
bash build-web.sh

echo "Starting on :3001..."
cd "$ROOT/server"
https_proxy="${https_proxy:-http://192.168.31.189:7890}" node dist/index.js
