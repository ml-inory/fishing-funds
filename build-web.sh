#!/bin/bash
# Production build for Fishing Funds Web
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Building Fishing Funds Web ==="

# Build server
echo "[1/2] Building server..."
cd "$SCRIPT_DIR/server"
npx tsc

# Build frontend
echo "[2/2] Building frontend..."
cd "$SCRIPT_DIR/web"
npx vite build

echo ""
echo "✅ Build complete!"
echo "   Server: server/dist/"
echo "   Frontend: web/dist/"
echo ""
echo "To run in production:"
echo "  cd server && node dist/index.js       # API on :3001"
echo "  cd web && npx vite preview            # Static files on :4173"
echo "  Or serve web/dist/ with nginx"
