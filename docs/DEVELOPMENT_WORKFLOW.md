# Development And Release Workflow

## Branch model

Use this branch strategy so `master` stays stable:

1. `master` (stable production code only)
2. `develop` (integration branch)
3. `feature/*` (new work)
4. `fix/*` (bug fixes)
5. `release/*` (release candidate stabilization)

Recommended flow:

1. Branch from `develop` into `feature/*` or `fix/*`
2. Merge back into `develop` via PR
3. Cut `release/*` from `develop`
4. Validate builds (alpha/beta)
5. Merge `release/*` into `master` only when ready

## Local debug mode

Debug panel is available when:

1. App is running unpackaged (`npm run dev`)
2. Or `ALTERE_DEBUG_TOOLS=1` is set

Debug panel features:

1. Override auth server base/fallbacks
2. Force auth server unavailable mode
3. Force auth overlay
4. Refresh server config
5. Copy runtime/debug snapshot

## Release channels

Use `release-github-draft.bat` and choose:

1. `stable`
2. `beta`
3. `alpha`

Then choose bump:

1. `patch`
2. `minor`
3. `major`
4. `current` (no bump)
5. `prerelease` (alpha/beta only)

## NPM scripts

1. `npm run dev`
2. `npm run dev:debug`
3. `npm run check`
4. `npm run release:win:draft:stable`
5. `npm run release:win:draft:beta`
6. `npm run release:win:draft:alpha`

## Secrets and debug bot tokens

Do not commit any tokens or private bot/server configs.

Use local files only:

1. `.env.debug.local` (ignored by git)
2. `debug-bot.local.json` (ignored by git)

