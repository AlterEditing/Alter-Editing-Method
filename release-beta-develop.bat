@echo off
setlocal EnableExtensions EnableDelayedExpansion

if /I not "%~1"=="__run" (
  start "AlterE Beta Release (develop)" cmd.exe /k ""%~f0" __run"
  goto :eof
)

cd /d "%~dp0"

echo [0/10] Preflight...
for /f "usebackq delims=" %%s in (`git status --porcelain`) do (
  echo ERROR: Working tree is not clean. Commit/stash changes first.
  goto :fail
)
where gh >nul 2>nul
if errorlevel 1 (
  echo WARNING: gh CLI not found. PR creation will be skipped.
)

echo Choose base version bump type:
echo   1 - patch (then beta)
echo   2 - minor (then beta)
echo   3 - major (then beta)
echo   4 - current (keep base, only beta increment if already beta)
set /p BUMP_CHOICE=Enter choice [1/2/3/4]: 
if "%BUMP_CHOICE%"=="" set BUMP_CHOICE=1

set BUMP_CMD=patch
if "%BUMP_CHOICE%"=="1" set BUMP_CMD=patch
if "%BUMP_CHOICE%"=="2" set BUMP_CMD=minor
if "%BUMP_CHOICE%"=="3" set BUMP_CMD=major
if "%BUMP_CHOICE%"=="4" set BUMP_CMD=

echo [1/10] Fetching origin...
git fetch origin
if errorlevel 1 goto :fail

for /f "usebackq delims=" %%i in (`powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd"`) do set DATE_STAMP=%%i
if "%DATE_STAMP%"=="" set DATE_STAMP=unknown-date
set WORK_BRANCH=beta/%DATE_STAMP%

echo [2/10] Creating beta branch from origin/develop: %WORK_BRANCH%
git checkout -B "%WORK_BRANCH%" origin/develop
if errorlevel 1 goto :fail

echo [3/10] Checking GH_TOKEN...
if "%GH_TOKEN%"=="" (
  set /p GH_TOKEN=Enter GH_TOKEN: 
)
if "%GH_TOKEN%"=="" (
  echo ERROR: GH_TOKEN is empty.
  goto :fail
)

echo [4/10] Running checks before version bump...
call npm run check
if errorlevel 1 goto :fail

if not "%BUMP_CMD%"=="" (
  echo [5/10] Bumping base version: %BUMP_CMD%...
  call npm version %BUMP_CMD% --no-git-tag-version
  if errorlevel 1 goto :fail
)

echo [6/10] Bumping beta prerelease version...
call npm run version:beta
if errorlevel 1 goto :fail

for /f "usebackq delims=" %%v in (`node -p "require('./package.json').version"`) do set NEW_VERSION=%%v
if "%NEW_VERSION%"=="" set NEW_VERSION=unknown

echo [7/10] Committing version bump on %WORK_BRANCH%...
git add package.json package-lock.json
git commit -m "chore: beta release v%NEW_VERSION%"
if errorlevel 1 (
  echo Nothing to commit for version bump.
)

echo [8/10] Pushing branch %WORK_BRANCH%...
git push -u origin "%WORK_BRANCH%"
if errorlevel 1 goto :fail

echo [9/10] Creating/refreshing PR to develop (may require approval)...
where gh >nul 2>nul
if not errorlevel 1 (
  gh pr create --base develop --head "%WORK_BRANCH%" --title "beta: v%NEW_VERSION%" --body "Automated beta release branch. Version: v%NEW_VERSION%. Branch: %WORK_BRANCH%." 1>nul 2>nul
)

echo [10/10] Building and publishing beta prerelease...
call npm run release:win:draft:beta
if errorlevel 1 goto :fail

echo.
echo Done: Beta prerelease published. Version: %NEW_VERSION%
echo Branch pushed: %WORK_BRANCH%
echo If PR was not created automatically, create one on GitHub: %WORK_BRANCH% -> develop
pause
exit /b 0

:fail
echo.
echo Script failed.
pause
exit /b 1
