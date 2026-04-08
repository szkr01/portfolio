## Current Plan
- [x] Identify tracked files that expose local usernames or absolute workstation paths.
- [x] Remove absolute path references from public docs and smoke automation code.
- [x] Add an automated regression test that blocks reintroducing leaked local paths.
- [x] Verify unit tests, smoke tests, and repository-wide path scans all pass cleanly.

## Current TDD Log
- Red: `README.md`, `tasks/todo.md`, and `smoke/canvasTransition.smoke.mjs` contained absolute paths with the local username, so the public repository would leak workstation details.
- Green: Replaced public absolute path references with repo-safe text and removed the hardcoded Playwright cache path fallback from the smoke runner.
- Refactor: Added a repository leak guard spec so future changes fail fast if absolute local paths or usernames are committed again.

## Current Review
- Sanitized public-facing docs so they no longer contain workstation-specific absolute paths.
- Simplified the smoke runner to rely on `PLAYWRIGHT_CHROMIUM_EXECUTABLE` or Playwright's default browser resolution instead of hardcoded cache paths.
- Added automated coverage to block local usernames and workstation-specific absolute path formats from reappearing in tracked docs or scripts.
- Ignored `.playwright-browsers/` so local verification downloads stay outside tracked files.
