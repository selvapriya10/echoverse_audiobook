@echo off
echo Installing Python dependencies for IBM Granite integration...
pip install -r requirements_granite.txt

echo.
echo Starting AI Audiobook Creator with IBM Granite Integration...
echo.
echo ================================================================
echo  AI AUDIOBOOK CREATOR - IBM GRANITE ENHANCED
echo ================================================================
echo.
echo To enable full IBM Granite AI features:
echo 1. Copy .env.example to .env
echo 2. Add your IBM Granite API key to the .env file
echo 3. Restart this application
echo.
echo Starting backend server...
echo The application will open automatically in your browser.
echo ================================================================
echo.

start "" python backend_granite.py
timeout /t 3

echo Opening application in browser...
start "" "http://localhost:5000"

echo.
echo Press any key to stop the server...
pause
echo.
echo Stopping server...
taskkill /f /im python.exe 2>nul