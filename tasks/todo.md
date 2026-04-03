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
- [x] Add failing tests for registry-driven article rendering, scene-id auto wiring, and primitive component contracts.
- [x] Extract article layout primitives that encapsulate the current Tailwind styling without changing visuals.
- [x] Split the current article content into section components and render them through a single registry in `ArticlePane`.
- [x] Align scene/shader registration with the section registry and move shader assets out of `documents/`.
- [x] Verify with `npm test`, `npm run build`, and `npm run test:smoke`.

## Current TDD Log
- Red: Added failing tests for the new article wrapper and primitive contracts, plus a registry-alignment test to lock section/scene wiring before refactoring.
- Green: Implemented article primitives, split each article section into its own Vue component, rendered them through a registry-driven `ArticlePane`, and moved the cloud shader into `src/shaders`.
- Refactor: Centralized section metadata in `articleSectionDefinitions`, so article rendering and canvas scene registration share the same ordered source of truth.

## Current Review
- `npm test` passed with the new article primitive tests, scene wrapper test, and section/scene registry alignment coverage.
- `npm run build` passed after the article refactor and shader relocation.
- `npm run test:smoke` passed in a real browser, confirming the existing scroll-driven canvas runtime behavior remained intact.
