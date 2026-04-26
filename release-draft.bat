@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "SCRIPT_DIR=%~dp0"
pushd "%SCRIPT_DIR%" >nul

set "REPO=AlterEditing/Alter-Editing-Method"

echo [1/7] Select version bump type...
echo Available: patch, minor, major, skip
set "BUMP_INPUT="
set /p BUMP_INPUT=Version bump [patch/minor/major/skip]: 
if "%BUMP_INPUT%"=="" set "BUMP_INPUT=skip"

if /I not "%BUMP_INPUT%"=="patch" if /I not "%BUMP_INPUT%"=="minor" if /I not "%BUMP_INPUT%"=="major" if /I not "%BUMP_INPUT%"=="skip" (
  echo ERROR: Invalid bump type. Use patch, minor, major, or skip.
  goto :fail
)

if /I not "%BUMP_INPUT%"=="skip" (
  echo Running npm version %BUMP_INPUT%...
  call npm version %BUMP_INPUT% --no-git-tag-version
  if errorlevel 1 (
    echo ERROR: Failed to bump version.
    goto :fail
  )
)

echo [2/7] Reading version from package.json...
for /f "usebackq delims=" %%V in (`powershell -NoProfile -Command "(Get-Content -Raw package.json | ConvertFrom-Json).version"`) do set "VERSION=%%V"
if not defined VERSION (
  echo ERROR: Failed to read version from package.json
  goto :fail
)

set "TAG=v%VERSION%"
set "DIST_DIR=%CD%\dist"

echo [3/7] Building installer artifacts...
call npm run dist:win
if errorlevel 1 (
  echo ERROR: Build failed.
  goto :fail
)

echo [4/7] Resolving artifact names from dist\latest.yml...
for /f "usebackq delims=" %%F in (`powershell -NoProfile -Command "$raw = Get-Content -Raw 'dist/latest.yml'; if ($raw -match 'path:\s*(.+)') { $matches[1].Trim() }"`) do set "INSTALLER_NAME=%%F"
if not defined INSTALLER_NAME (
  echo ERROR: Could not parse installer name from dist\latest.yml
  goto :fail
)

set "INSTALLER_PATH=%DIST_DIR%\%INSTALLER_NAME%"
set "BLOCKMAP_PATH=%INSTALLER_PATH%.blockmap"
set "LATEST_YML=%DIST_DIR%\latest.yml"

if not exist "%INSTALLER_PATH%" (
  echo ERROR: Installer not found: %INSTALLER_PATH%
  goto :fail
)
if not exist "%BLOCKMAP_PATH%" (
  echo ERROR: Blockmap not found: %BLOCKMAP_PATH%
  goto :fail
)
if not exist "%LATEST_YML%" (
  echo ERROR: latest.yml not found: %LATEST_YML%
  goto :fail
)

echo [5/7] Mandatory update?
echo Type Y for mandatory, anything else for optional.
set "MANDATORY_INPUT="
set /p MANDATORY_INPUT=Mandatory [Y/N]: 
set "MANDATORY_LINE="
if /I "%MANDATORY_INPUT%"=="Y" set "MANDATORY_LINE=[mandatory]"

set "NOTES_FILE=%DIST_DIR%\release-notes-%VERSION%.md"
> "%NOTES_FILE%" echo AlterEditingMethod %VERSION%
>> "%NOTES_FILE%" echo.
if defined MANDATORY_LINE >> "%NOTES_FILE%" echo %MANDATORY_LINE%

echo [6/7] Checking GitHub CLI auth...
gh auth status >nul 2>&1
if errorlevel 1 (
  echo ERROR: GitHub CLI is not authenticated. Run: gh auth login
  goto :fail
)

echo [7/7] Creating draft release %TAG% in %REPO%...
gh release view "%TAG%" --repo "%REPO%" >nul 2>&1
if not errorlevel 1 (
  echo ERROR: Release with tag %TAG% already exists. Bump package.json version before publishing.
  goto :fail
)

gh release create "%TAG%" "%INSTALLER_PATH%" "%BLOCKMAP_PATH%" "%LATEST_YML%" --repo "%REPO%" --draft --title "AlterEditingMethod %VERSION%" --notes-file "%NOTES_FILE%"
if errorlevel 1 (
  echo ERROR: Failed to create draft release.
  goto :fail
)

echo SUCCESS: Draft release prepared for %TAG%.
echo Release URL:
gh release view "%TAG%" --repo "%REPO%" --json url -q .url

popd >nul
exit /b 0

:fail
popd >nul
echo.
echo Release draft script failed.
exit /b 1
