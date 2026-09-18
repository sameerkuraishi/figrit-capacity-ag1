@echo off
setlocal
cd /d "%~dp0"

echo =============================================
echo  Capacity Connect - FIGR.IT - SIH26075
echo =============================================
echo.

echo Starting Django backend in a new terminal...
start "FIGR.IT Django Backend" cmd /k "cd /d %~dp0backend && if not exist .venv python -m venv .venv && call .venv\Scripts\activate && python -m pip install -r requirements.txt && python setup_demo.py && python manage.py runserver 8000"

echo Starting frontend in a new terminal...
start "FIGR.IT Frontend" cmd /k "cd /d %~dp0 && if not exist node_modules npm install && npm run dev"

echo.
echo Frontend usually opens at: http://localhost:5173
echo Backend health:          http://127.0.0.1:8000/api/health/
echo.
echo Demo password for all roles: demo123
pause
