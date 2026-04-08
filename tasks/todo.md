## Current Plan
- [x] Reproduce the GitHub Pages parallax asset 404 failure mode in an automated regression test.
- [x] Replace raw `src/content/assets/parallax/...` strings with Vite-resolved asset imports in the parallax component.
- [x] Verify targeted tests, full unit tests, and production build output all pass without raw parallax source paths in `dist`.

## Current TDD Log
- Red: `ParallaxContainer.vue` loads parallax layers from raw `src/content/assets/parallax/...` strings, so the Vite production build leaves those URLs untouched and GitHub Pages returns 404.
- Green: Switch the layer source arrays to imported asset URLs so Vite emits hashed files into `dist/assets` and the component loads deployable URLs.
- Refactor: Keep the existing parallax rendering logic intact and add a regression test that fails if raw source-path URLs are assigned to `Image.src` again.

## Current Review
- Added regression coverage for the parallax layer source resolution path.
- Updated the parallax component to use Vite-managed asset imports instead of raw repository-relative strings.
- Verified the fix through `npm test -- tests/parallaxContainer.spec.ts`, `npm test`, `npm run build`, and a `dist` scan confirming `src/content/assets/parallax` no longer appears in build output.
