# Contributing

## Scope

This project is open source and licensed under `GPL-3.0-only`.

## Workflow

1. Create a feature branch from `master`.
2. Keep changes focused and small.
3. Run local checks before opening a PR:
   - `npm start` (basic smoke test)
   - `npm run check`
4. Open a PR with:
   - clear summary
   - testing notes
   - screenshots/videos for UI changes (if relevant)

## Code Style

- Prefer small, explicit functions.
- Do not hardcode secrets, tokens, or private URLs.
- Keep Electron security defaults (`contextIsolation`, limited preload API).

## Commits

- Use descriptive commit messages.
- Do not rewrite published history on shared branches.

## Licensing

By contributing, you agree that your contributions are provided under `GPL-3.0-only`.
