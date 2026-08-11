@echo off
REM Double-click runner for weekly GSC audit
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "run-weekly-audit.ps1"
pause
