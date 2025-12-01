#!/bin/bash

echo "🚀 Starting InventoryAI Development Environment..."
echo ""

# Start Python FastAPI server in background
echo "📡 Starting Python Prediction API on port 8000..."
cd backend
uvicorn predict_api:app --reload --host 0.0.0.0 --port 8000 &
PYTHON_PID=$!
echo "✅ Python API started (PID: $PYTHON_PID)"
echo ""

# Wait a moment for Python server to start
sleep 2

# Start Node.js dev server
echo "🎨 Starting Node.js dev server on port 8080..."
cd ..
npm run dev &
NODE_PID=$!
echo "✅ Node.js server started (PID: $NODE_PID)"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Both servers are running!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Frontend:  http://localhost:8080"
echo "📡 API:       http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait $PYTHON_PID $NODE_PID
