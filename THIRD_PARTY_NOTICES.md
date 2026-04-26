# Third-Party Notices

## FFmpeg

This project uses FFmpeg binaries.

- Project: https://ffmpeg.org/
- Legal page: https://ffmpeg.org/legal.html
- License family: LGPL/GPL depending on build configuration

The current local binary observed during preparation was:

- `ffmpeg version 2026-04-22-git-162ad61486-essentials_build-www.gyan.dev`
- build flags include `--enable-gpl --enable-version3`

Because FFmpeg binaries are not committed in this repository by default, maintainers must:

1. Track exact FFmpeg build/version used per release.
2. Preserve corresponding license texts and notices.
3. Provide source/patch references required by the selected FFmpeg licensing mode.

If you publish release installers with FFmpeg included, update this file for each release.
