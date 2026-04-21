@echo off
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0patch.ps1" "%~1"
pause