## Current Plan
- [x] Confirm the current router and build output assumptions for GitHub Pages project deployment.
- [x] Add the missing Vite `base` setting for `/portfolio/` project pages output.
- [x] Add a GitHub Actions Pages deployment workflow that builds `dist/` from `main`.
- [x] Document the GitHub Pages setup and deployment requirements in the public README.
- [x] Verify with `npm run build` and confirm the built asset paths are prefixed with `/portfolio/`.

## Current TDD Log
- Red: No runtime logic changed. The initial failure was deployment readiness: the production build emitted root-relative `/assets/...` paths that would break on `https://szkr01.github.io/portfolio/`, and there was no Pages workflow or deployment documentation.
- Green: Added `base: "/portfolio/"` in Vite, created a GitHub Pages Actions workflow, and documented the required repository settings plus deployment behavior in `README.md`.
- Refactor: Kept the existing hash-router setup unchanged so Pages compatibility comes only from the asset base path and workflow wiring.

## Current Review
- Added [deploy-pages.yml](/mnt/c/Users/korag/Documents/GitHub/portfolio/.github/workflows/deploy-pages.yml) for GitHub Pages deployment from `main`.
- Updated [vite.config.ts](/mnt/c/Users/korag/Documents/GitHub/portfolio/vite.config.ts) to emit `/portfolio/`-scoped asset URLs for project pages.
- Updated [README.md](/mnt/c/Users/korag/Documents/GitHub/portfolio/README.md) with required GitHub Pages settings and deployment notes.
