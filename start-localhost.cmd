@echo off
setlocal
cd /d "%~dp0"
echo Starting Dreamlab local server...
echo Keep this window open while you test the site.
echo.
call npm run dev
echo.
echo Server stopped.
pause
