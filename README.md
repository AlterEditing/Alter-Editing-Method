# Alter Editing Method

Desktop video patcher for MP4/MOV processing with Telegram-based authorization and auto-updates.

## License

This project is licensed under `GPL-3.0-only`. See `LICENSE`.

## Key Features

- MP4/MOV input support
- Metadata probing with bundled `ffprobe`
- Preview generation with bundled `ffmpeg`
- Patch modes: `low`, `balanced`, `source`
- Auto-update flow via GitHub Releases
- Telegram-based authorization flow

## Development

```powershell
npm install
npm start
```

## Build Installer

Local artifacts:

```powershell
npm run dist:win
```

Publish release artifacts:

```powershell
npm run release:win
```

Expected artifacts:

- `AlterEditingMethod-Setup-<version>.exe`
- `AlterEditingMethod-Setup-<version>.exe.blockmap`
- `latest.yml`

## Code Signing And Certificate Readiness

For trusted Windows installers (and SmartScreen reputation), use a valid code-signing certificate and sign release artifacts in CI.
Code signing for this project is provided by the SignPath Foundation.

Environment variables for Windows code-signing:

- `CSC_LINK` / `CSC_KEY_PASSWORD`
- or Windows-specific `WIN_CSC_LINK` / `WIN_CSC_KEY_PASSWORD`

Release hardening checklist is documented in `RELEASE_CHECKLIST.md`.

## Runtime Configuration

You can configure auth API base URL via environment variable:

- `ALTERE_AUTH_API_BASE` (example: `https://auth.example.com`)
- `ALTERE_AUTH_API_FALLBACKS` (comma-separated backup URLs)
- `ALTERE_TELEGRAM_CHANNEL_URL` (footer channel link)

If not set, default is:

- `http://132.243.30.159:3000`

The client can also refresh server-side links from `/client-config` and switch to a responsive fallback backend automatically.

## FFmpeg Note

This project expects local FFmpeg binaries at:

- `vendor/ffmpeg/ffmpeg.exe`
- `vendor/ffmpeg/ffprobe.exe`

These binaries are ignored by git. For licensing details and release obligations, see:

- `THIRD_PARTY_NOTICES.md`

## Open Source Governance

- Contribution guide: `CONTRIBUTING.md`
- Security policy: `SECURITY.md`
- Code of conduct: `CODE_OF_CONDUCT.md`
- Privacy notice: `PRIVACY.md`
- Code signing policy: `CODE_SIGNING_POLICY.md`
## How to Use

Follow these steps to patch and upload your video safely:

### 1. Import your video 🎬

Drag and drop a video file into the app, or select it manually.

<img src="docs/how-to-use/1.gif" alt="Step 1 - Import video" width="760" />

### 2. Set bitrate (or keep source quality) ⚙️

Choose a bitrate, or keep the original source quality.

<img src="docs/how-to-use/2.gif" alt="Step 2 - Set bitrate" width="760" />

> ⚠️ **Important:** 2K/4K video or bitrate above **50 Mbps** is not recommended, because it may increase the risk of TikTok account restrictions.

### 3. Run patching 🧩

Click **`PATCH`** and wait until processing is complete.

<img src="docs/how-to-use/3.gif" alt="Step 3 - Run patching" width="760" />

### 4. Upload to TikTok 📤

Upload the processed video to TikTok using your preferred standard upload method, without extra third-party methods.

<img src="docs/how-to-use/4.gif" alt="Step 4 - Upload to TikTok" width="760" />
