#!/bin/bash
# Fishing Funds Web App - Development Startup
# Start both backend and frontend

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Kill any existing processes
kill $(lsof -ti:3001) 2>/dev/null
kill $(lsof -ti:3456) 2>/dev/null

echo "=== Starting Fishing Funds Web ==="

# Start backend
echo "[1/2] Starting API server on :3001..."
cd "$SCRIPT_DIR/server"
https_proxy="${https_proxy:-http://192.168.31.189:7890}" npx tsx src/index.ts &
BACKEND_PID=$!

# Wait for backend
sleep 2

# Start frontend
echo "[2/2] Starting Web dev server on :3456..."
cd "$SCRIPT_DIR/web"
npx vite --host &
FRONTEND_PID=$!

echo ""
echo "✅ Fishing Funds Web is running!"
echo "   Frontend: http://localhost:3456"
echo "   Backend:  http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
