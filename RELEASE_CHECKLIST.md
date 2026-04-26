# Release Checklist

## 1. Pre-release validation

1. Update version in `package.json`.
2. Run syntax checks:
   - `npm run check`
3. Verify local app startup and Telegram authorization flow.
4. Confirm FFmpeg binaries exist in `vendor/ffmpeg/` for the build machine.

## 2. Certificate and signing setup

1. Use a valid Windows code-signing certificate (OV or EV).
2. Configure CI/release environment:
   - `CSC_LINK` and `CSC_KEY_PASSWORD`
   - or `WIN_CSC_LINK` and `WIN_CSC_KEY_PASSWORD`
3. Keep certificate secrets only in CI secret storage.
4. Do not commit certificate files or passwords into git.

## 3. Build and release

1. Build unsigned test installer:
   - `npm run dist:win`
2. Build and publish release:
   - `npm run release:win`
3. Verify artifacts in `dist/`:
   - `AlterEditingMethod-Setup-<version>.exe`
   - `AlterEditingMethod-Setup-<version>.exe.blockmap`
   - `latest.yml`

## 4. Post-release verification

1. Install on a clean Windows VM.
2. Verify app launch, auth flow, update check, and basic processing path.
3. Verify installer signature in file properties (Digital Signatures tab).
4. Store release evidence:
   - commit SHA
   - build run URL
   - checksums
   - signature metadata
