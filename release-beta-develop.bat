@echo off
setlocal EnableExtensions EnableDelayedExpansion

if /I not "%~1"=="__run" (
  start "AlterE Beta Release (develop)" cmd.exe /k ""%~f0" __run"
  goto :eof
)

cd /d "%~dp0"

echo [1/8] Switching to develop branch...
git checkout develop
if errorlevel 1 goto :fail

echo [2/8] Pulling latest develop...
git pull --ff-only origin develop
if errorlevel 1 goto :fail

echo [3/8] Checking GH_TOKEN...
if "%GH_TOKEN%"=="" (
  set /p GH_TOKEN=Enter GH_TOKEN: 
)
if "%GH_TOKEN%"=="" (
  echo ERROR: GH_TOKEN is empty.
  goto :fail
)

echo [4/8] Bumping beta prerelease version...
call npm version prerelease --preid beta --no-git-tag-version
if errorlevel 1 goto :fail

for /f "usebackq delims=" %%v in (`node -p "require('./package.json').version"`) do set NEW_VERSION=%%v
if "%NEW_VERSION%"=="" set NEW_VERSION=unknown

echo [5/8] Committing version bump to develop...
git add package.json package-lock.json
git commit -m "chore: beta release v%NEW_VERSION%"
if errorlevel 1 (
  echo Nothing to commit for version bump.
)

echo [6/8] Pushing develop...
git push origin develop
if errorlevel 1 goto :fail

echo [7/8] Running checks...
call npm run check
if errorlevel 1 goto :fail

echo [8/8] Building and publishing beta prerelease draft...
call npm run release:win:draft:beta
if errorlevel 1 goto :fail

echo.
echo Done: Beta prerelease draft published. Version: %NEW_VERSION%
pause
exit /b 0

:fail
echo.
echo Script failed.
pause
exit /b 1
