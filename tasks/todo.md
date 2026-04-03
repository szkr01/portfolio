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
