@echo off
REM Start both frontend and backend with one command

echo.
echo ========================================
echo Starting InventoryAI Development Servers
echo ========================================
echo.

REM Get the directory where this script is located
cd /d "%~dp0"

REM Start Python backend in a new window
echo [1/2] Starting Python Backend on port 8000...
start "InventoryAI Backend" cmd /k "cd backend && .\..\\.venv\\Scripts\\python.exe -m uvicorn predict_api:app --reload --host 0.0.0.0 --port 8000"

REM Wait a moment for backend to start
timeout /t 3

REM Start Node frontend in a new window
echo [2/2] Starting React Frontend on port 8080...
start "InventoryAI Frontend" cmd /k "pnpm run dev"

echo.
echo ========================================
echo ✅ Both servers started!
echo ========================================
echo.
echo Frontend: http://localhost:8080
echo Backend:  http://localhost:8000
echo.
echo Close either window to stop that server
echo.
pause
