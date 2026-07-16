#!/bin/bash
# Fishing Funds Web App - Start both backend and frontend
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
kill $(lsof -ti:3001) 2>/dev/null || true
kill $(lsof -ti:3456) 2>/dev/null || true

echo "=== Fishing Funds Web ==="
echo "[1/2] API server on :3001..."
cd "$ROOT/server"
https_proxy="${https_proxy:-http://192.168.31.189:7890}" npx tsx src/index.ts &
sleep 2

echo "[2/2] Web dev server on :3456..."
cd "$ROOT/web"
npx vite --host 0.0.0.0 &
sleep 3

echo ""
echo "✅ http://localhost:3456"
echo "Press Ctrl+C to stop"
trap "kill 0" INT TERM
wait
