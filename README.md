# Alter Editing Method (Electron)

Desktop video patcher built with Electron.

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

## Build

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

## Runtime Configuration

You can configure auth API base URL via environment variable:

- `ALTERE_AUTH_API_BASE` (example: `https://auth.example.com`)

If not set, default is:

- `https://auth.alterediting.com`

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
