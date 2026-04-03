# Todo

## Plan
- [x] Scaffold Vue/Vite/TS app structure and shared styling baseline.
- [x] Write failing tests for canvas controller, section activation, and initial app contract.
- [x] Implement the controller, shader renderer, and theme sampling flow.
- [x] Migrate `documents/index.html` into Vue components with the same layout and styling.
- [x] Verify with tests and production build.

## TDD Log
- Red: Added failing tests for controller scene activation, scroll-triggered activation, and the top-level app contract before any `src/` implementation existed.
- Green: Implemented the controller, composable, renderer factory, shader renderer, and Vue components until `npm test` passed.
- Refactor: Tightened the controller API around renderer factory boundaries, moved theme sampling into its own module, and replaced direct canvas ref passing with a setter API that is easier to test in Vue.

## Review
- `npm test` passed with 4 tests covering controller, section activation, and app contract.
- `npm run build` passed and emitted a production bundle through Vite.
- MVP behavior: upload UI removed, all sections route through the canvas controller, and `documents/cloud.frag` is the active shader scene for every section.
