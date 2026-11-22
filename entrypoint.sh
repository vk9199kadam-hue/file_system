#!/bin/sh
set -e

echo "=================================================================="
echo "🚀 Starting ApniLeap Smart File Backup Platform Container"
echo "=================================================================="
echo "ℹ️  Environment: ${NODE_ENV:-production}"
echo "ℹ️  BFF API Port: ${PORT:-4000}"
echo "ℹ️  Database URI: ${MONGODB_URI}"
echo "=================================================================="

# 1. Start Frontend Static SPA Server on Port 5173
echo "📦 [Frontend] Starting React 18 SPA server on http://0.0.0.0:5173..."
serve -s /app/frontend/dist -l 5173 &
FRONTEND_PID=$!

# 2. Start Backend Express & Socket.IO BFF on Port 4000
echo "⚙️ [Backend] Starting Express BFF & Socket.IO server on http://0.0.0.0:${PORT:-4000}..."
cd /app/backend
node server.js &
BACKEND_PID=$!

# Trap termination signals for clean, graceful container shutdown
cleanup() {
  echo ""
  echo "🛑 Received termination signal. Shutting down gracefully..."
  kill -TERM $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
  wait $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
  echo "✅ All processes cleanly stopped."
  exit 0
}

trap cleanup SIGTERM SIGINT

echo "=================================================================="
echo "✨ Platform ready!"
echo "   🌐 Web Application UI:     http://localhost:5173"
echo "   ⚡ Backend BFF & API:      http://localhost:4000"
echo "   📡 Live WebSocket Stream:  ws://localhost:4000"
echo "=================================================================="

# Keep script running and wait for background services
wait $BACKEND_PID $FRONTEND_PID
