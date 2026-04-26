# Code Signing Policy

This policy defines how release artifacts are signed.

## Goals

- Protect users from tampered binaries.
- Ensure signatures come from trusted CI output.
- Keep a verifiable audit trail for each signed artifact.

## Rules

1. Only CI-produced release artifacts are eligible for signing.
2. Signing requests require human approval by maintainers.
3. Maintainers must use MFA on GitHub accounts.
4. Direct local-machine signing for public releases is not allowed.
5. Signed artifacts must map to tagged source revisions.

## Provenance

For each signed release, maintainers should retain:

- git tag / commit SHA
- workflow run URL
- artifact checksum(s)
- signature metadata and timestamp

## Emergency Revocation

If signing credentials/process are suspected compromised:

1. Stop new signing immediately.
2. Publish a public incident note.
3. Rotate credentials and re-establish trust chain.
