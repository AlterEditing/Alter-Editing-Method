@echo off
setlocal

cd /d "%~dp0"

echo [1/3] Checking required environment...
if "%GH_TOKEN%"=="" (
  echo ERROR: GH_TOKEN is not set.
  echo.
  echo Set token in current terminal and run again:
  echo   set GH_TOKEN=your_github_token
  exit /b 1
)

echo [2/3] Running project checks...
call npm run check
if errorlevel 1 (
  echo ERROR: Check step failed.
  exit /b 1
)

echo [3/3] Building and publishing GitHub draft release...
call npm run release:win:draft
if errorlevel 1 (
  echo ERROR: Draft release build/publish failed.
  exit /b 1
)

echo.
echo Done: Draft release has been published to GitHub Releases.
exit /b 0
