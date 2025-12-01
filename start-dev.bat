@echo off
title InventoryAI Development Environment

echo.
echo 🚀 Starting InventoryAI Development Environment...
echo.

echo 📡 Starting Python Prediction API on port 8000...
start "Python API" cmd /k "cd backend && uvicorn predict_api:app --reload --host 0.0.0.0 --port 8000"

echo ⏳ Waiting for Python API to start...
timeout /t 3 /nobreak

echo 🎨 Starting Node.js dev server on port 8080...
start "Node Dev Server" cmd /k "npm run dev"

echo.
echo ════════════════════════════════════════════════════════════════
echo ✨ Both servers are starting in separate windows!
echo ════════════════════════════════════════════════════════════════
echo.
echo 🌐 Frontend:  http://localhost:8080
echo 📡 API:       http://localhost:8000
echo.
echo Close either window to stop that specific server
echo.
