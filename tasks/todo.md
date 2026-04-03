# Todo

## Plan
- [x] Scaffold Vue/Vite/TS app structure and shared styling baseline.
- [x] Write failing tests for canvas controller, section activation, and initial app contract.
- [x] Implement the controller, shader renderer, and theme sampling flow.
- [x] Migrate `documents/index.html` into Vue components with the same layout and styling.
- [x] Verify with tests and production build.
- [x] Add failing tests for shared-runtime continuity, live transitions, and browser smoke coverage.
- [x] Refactor the canvas controller around runtime registration and live scene composition.
- [x] Add an alternate shader scene and a shader-based transition compositor.
- [x] Verify with unit tests, browser smoke, and production build.

## TDD Log
- Red: Added failing tests for controller scene activation, scroll-triggered activation, and the top-level app contract before any `src/` implementation existed.
- Green: Implemented the controller, composable, renderer factory, shader renderer, and Vue components until `npm test` passed.
- Refactor: Tightened the controller API around renderer factory boundaries, moved theme sampling into its own module, and replaced direct canvas ref passing with a setter API that is easier to test in Vue.
- Red: Added failing controller tests for shared `runtimeKey` continuity, live cross-runtime transitions, and a smoke-test contract for browser validation.
- Green: Reworked the controller to keep per-runtime renderers alive across section changes, feed monotonic scene time from the controller, and composite transitions through a dedicated shader pass.
- Refactor: Split transition definitions and shaders out from scene definitions, exposed a debug hook for smoke verification, and kept the visible canvas as a final composition target.

## Review
- `npm test` now passes with coverage for shared-runtime continuity, live transition orchestration, section activation, app contract, and the smoke-script contract.
- `npm run build` passed and emitted a production bundle through Vite.
- `npm run test:smoke` passed in a real browser by scrolling sections and asserting `cloud -> cloud` continuity and `cloud -> ripple` live transition completion.
- Runtime behavior: same-runtime section crossings keep `iTime` advancing, while cross-runtime section changes run a shader-based live compositor instead of resetting abruptly.

## Current Plan
- [x] Add failing tests for route-driven article rendering, article-to-scene activation, and registry alignment.
- [x] Introduce client-side routing for article pages with hash-based history suitable for GitHub Pages.
- [x] Collapse the current article into a single page component and add a second article page plus top-of-pane article navigation.
- [x] Remove section-driven shader activation and register canvas scenes from article-page metadata instead.
- [x] Verify with `npm test`, `npm run build`, and `npm run test:smoke`.

## Current TDD Log
- Red: Replaced the section-based app and registry tests with route-based expectations for article navigation, route-driven scene activation, and page/scene registry alignment.
- Green: Added `vue-router` hash routing, introduced single-file article pages plus a second article, and rewired canvas activation to follow route changes only.
- Refactor: Deleted section-scene activation plumbing and replaced it with an article-page registry that feeds both routing and shader registration.

## Current Review
- `npm test` passed with updated route-driven app coverage and the existing canvas controller checks.
- `npm run build` passed with `vue-router` and the new article-page registry in place.
- `npm run test:smoke` passed by navigating between article links and asserting `cloud -> ripple -> cloud` canvas transitions.

## Current Plan
- [x] Add failing coverage for the second article using a dedicated `flow` shader runtime instead of `ripple`.
- [x] Add a new embedded-parameter fragment shader adapted to the repo's `mainImage` contract.
- [x] Swap the second article scene from `ripple` to `flow` without changing the route-driven activation model.
- [x] Verify with `npm test`, `npm run build`, and `npm run test:smoke`.

## Current TDD Log
- Red: Update scene and smoke expectations so the second article must resolve to a `flow` runtime and complete `cloud -> flow -> cloud` route transitions.
- Green: Added `src/shaders/flow.frag` with embedded defaults and rewired the `motion-field` scene to load it as a `flow` runtime.
- Refactor: Kept the existing renderer contract untouched by adapting the provided shader to `mainImage` and `iTime`/`iResolution` only.

## Current Review
- `npm test` passed, including the new scene contract that asserts the second article now uses the embedded `flow` shader.
- `npm run build` passed and compiled the new fragment shader into the production bundle.
- `npm run test:smoke` passed by navigating between article routes and asserting `cloud -> flow -> cloud` transitions in a real browser.
