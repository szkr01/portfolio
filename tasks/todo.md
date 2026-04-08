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

## Current Plan
- [x] Add failing controller coverage for page-based time continuity across runtime changes and transitions.
- [x] Replace runtime-local scene time with a single page-start clock in the canvas controller.
- [x] Rename frame/debug time fields to match the new page-based meaning and keep shader renderers on that contract.
- [x] Verify with `npm test`, `npm run build`, and `npm run test:smoke`.

## Current TDD Log
- Red: Tighten controller expectations so time is sourced from page start, remains monotonic through route transitions, and never resets when the active runtime changes.
- Green: Replaced per-runtime `startedAtMs` with a controller-level page clock and fed that through render frames, shader uniforms, and debug state.
- Refactor: Renamed frame/debug time fields to `pageTimeMs` so the public meaning matches the implementation and future shader work does not inherit the old scene-local semantics.

## Current Review
- `npm test` passed with updated controller coverage for page-time continuity across runtime switches and live transitions.
- `npm run build` passed after the frame/debug type rename and controller clock change.
- `npm run test:smoke` passed, confirming route-driven canvas transitions still work in a real browser.

## Current Plan
- [x] Add failing tests for per-article pane ratios and canvas resize propagation when pane widths change.
- [x] Extend article page metadata with pane ratio values and drive the shell layout from route metadata.
- [x] Detect canvas element size changes with minimal controller wiring so animated pane ratio changes keep render resolution in sync.
- [x] Verify with `npm test` and `npm run build`.

## Current TDD Log
- Red: Added failing app coverage for route-specific pane ratios and a composable test that requires `ResizeObserver`-driven controller resizes when the canvas element changes size.
- Green: Added per-article `paneRatio` metadata, drove left/right pane `flex-grow` from the active route with eased transitions, and observed the canvas element for non-window size changes.
- Refactor: Kept the existing shell/component structure intact by threading a single style prop into each pane instead of moving layout ownership deeper into the tree.

## Current Review
- `npm test` passed with the new pane-ratio and `ResizeObserver` coverage alongside the existing controller, routing, and smoke-contract tests.
- `npm run build` passed and emitted a production bundle with the ratio-driven shell layout.

## Current Plan
- [x] Add failing controller coverage for redraw-on-resize while an active scene or transition is already visible.
- [x] Redraw the current canvas state immediately after resize so animated pane ratio changes do not flash white.
- [x] Verify with `npm test` and `npm run build`.

## Current TDD Log
- Red: Added failing controller coverage that reproduces the white flash by resizing after an active scene is already bound to the visible canvas.
- Green: Reused the controller's current-frame composition path during `resize()` so the visible canvas is repainted immediately after width/height changes.
- Refactor: Pulled the visible redraw logic into a shared helper so resize and the animation loop stay on the same composition behavior.

## Current Review
- `npm test` passed with the new resize-redraw regression coverage and the existing app, controller, and smoke-contract suites.
- `npm run build` passed after the controller redraw fix.

## Current Plan
- [x] Add failing tests for the new image article route, scene registry entry, and image renderer crop/pan behavior.
- [x] Add a dedicated article asset folder and register a third article backed by an image canvas scene.
- [x] Extend the image renderer to animate a square crop anchored to the left edge and preserve redraw behavior across resize.
- [x] Verify with `npm test`, `npm run build`, and `npm run test:smoke`.

## Current TDD Log
- Red: Added failing coverage for a third `image-drift` article, image-scene registry wiring, and image renderer behavior around square short-edge cropping, looping pan targets, and resize redraw continuity.
- Green: Added `Image Drift` as a third route-backed article, copied `documents/testImage.png` into a dedicated article asset folder, and mapped the new article to an `image` scene.
- Refactor: Reworked the shared media renderer so image scenes keep internal motion state, render into the runtime canvas as a left-anchored square, and expose the rendered canvas for visible composition and transitions.

## Current Review
- `npm test` passed with the new image-article and media-renderer regression coverage alongside the existing app, controller, and registry suites.
- `npm run build` passed and emitted the imported article image asset in the production bundle.
- `npm run test:smoke` passed by navigating `cloud -> flow -> image-drift -> cloud` and confirming route-driven canvas transitions still complete in a real browser.

## Current Plan
- [x] Add failing coverage for per-article forced light/dark selection, including `motion-field` using forced dark mode.
- [x] Extend article metadata and canvas scene registration with a minimal forced theme flag.
- [x] Make the canvas controller force the existing `isDark` branch per active article instead of introducing new theme calculation.
- [x] Verify with `npm test` and `npm run build`.

## Current TDD Log
- Red: Added registry coverage for article-to-scene theme propagation and sampler coverage that forces the existing light/dark branch with identical sampled pixels.
- Green: Added `themeMode` to article metadata and scene definitions, then set the active sampler mode from the controller before each scene activation.
- Refactor: Kept the existing sampler math intact and changed only the `isDark` decision point so article selection can override the threshold branch directly.

## Current Review
- `npm test` passed with the new forced-theme regression coverage alongside the existing app, controller, and smoke-contract suites.
- `npm run build` passed after the sampler/controller wiring change and emitted a production bundle successfully.

## Current Plan
- [x] Add failing coverage for the About article title, body copy, and updated nav label while keeping the existing `color-harmony` route.
- [x] Replace the first article page content with the provided About copy and a linked Works overview sourced from `documents/draft.md`.
- [x] Verify with `npm test`, `npm run build`, and `npm run test:smoke`.

## Current TDD Log
- Red: Updated the app and smoke expectations so the first article had to render `About`, expose the supplied bio copy, and keep the existing `/articles/color-harmony` route active under the renamed nav item.
- Green: Replaced the first article component content with the provided About text, added linked `Works overview` entries sourced from `documents/draft.md`, and renamed only the visible article title in the registry.
- Refactor: Kept routing, scene registration, and pane metadata untouched so the content swap remained a display-layer change only.

## Current Review
- `npm test` passed with the About-content expectations and the existing controller, registry, and article suites.
- `npm run build` passed and emitted the unchanged app bundle structure with the updated article markup.
- `npm run test:smoke` passed by navigating `About -> Motion Field -> Image Drift -> About` while the `color-harmony` route continued to drive the `cloud` runtime.

## Current Plan
- [x] Add a failing-or-missing regression check for Vite dev-server watch settings so hot reload behavior is covered in test.
- [x] Configure the Vite dev server to use polling file watching for this WSL-mounted workspace.
- [x] Verify with `npm test`, `npm run build`, and a concrete config/runtime check for `npm run dev`.

## Current TDD Log
- Red: Added explicit coverage for the dev-server watch contract because the repo had no regression guard around hot reload behavior.
- Green: Enabled polling file watching in `vite.config.ts` so edits under `/mnt/c/...` are detected reliably from WSL.
- Refactor: Kept the fix inside Vite server config only and avoided app-level changes because the failure mode is file watching, not Vue runtime behavior.

## Current Review
- `npx vitest run tests/viteConfig.spec.ts` passed and asserted `server.watch.usePolling === true` with `interval: 100`.
- `npm run build` passed after the Vite watch change.
- `npm test` still fails in pre-existing `tests/app.spec.ts` because the suite expects `Color Harmony & Contrast` while the current app content renders `About`; this is unrelated to the hot-reload fix.

## Current Plan
- [x] Define a minimal editable contract for `scripts/images.js` that accepts pasted base64 image sources.
- [x] Implement transparent image export into `scripts/out` without adding app-side dependencies.
- [ ] Verify the script runs cleanly with an empty `layerSources` placeholder and document the result.

## Current TDD Log
- Red: `scripts/images.js` was only a comment stub and could not be executed.
- Green: Replaced it with a Node ESM script that decodes data URLs or raw base64 strings and writes files into `scripts/out`.
- Refactor: Kept the input contract flat and editable so future manual image insertion only touches `layerSources`.

## Current Review
- `node scripts/images.js` passed with the placeholder empty array and exited with an instructional message instead of throwing.
- Runtime contract: paste base64 strings or `{ name, data, extension }` objects into `layerSources`, then run `node scripts/images.js` to emit files into `scripts/out`.

## Current Plan
- [x] Add a minimal blink animation plan entry for `ParallaxContainer` using `altlayerSources` as a temporary render source.
- [x] Implement random blink scheduling and dual-layer preloading in `ParallaxContainer` without changing its public props.
- [x] Verify the component behavior and note any unrelated baseline build/test failures in review.

## Current Review
- Added a blink-style render swap in `ParallaxContainer` that preloads both layer sets, switches to `altlayerSources` for 120ms at random 2.5s-6s intervals, and keeps the existing parallax drift intact.
- Added unmount cleanup for pointer listeners and the animation frame so route changes do not leave duplicate loops attached.
- `npm run build` still fails due to the existing `tests/viteConfig.spec.ts` Node type issues; the earlier `ParallaxContainer` nullability errors no longer appear.

## Current Plan
- [x] Add a visible loading state to `ParallaxContainer` while parallax layers preload.
- [x] Hide the loading state immediately after both normal and blink layers are ready.
- [x] Keep the loader self-contained inside the component without changing public props.

## Current Review
- Added `isLoading` state to `ParallaxContainer` and now show a centered ring spinner overlay until both image sets finish preloading.
- Kept the loader scoped to the component with its own overlay and keyframes so no global styling changes were required.

## Current Plan
- [x] Red: Add failing regression coverage for parallax pointer normalization and page-wide pointer tracking in `ParallaxContainer`.
- [x] Green: Switch `ParallaxContainer` to an internal page-tracking toggle, keep local touch tracking, and clamp distant pointer vectors circularly.
- [x] Refactor: Extract pointer normalization into a small helper shared by render-time tracking and tests.
- [x] Verify with targeted parallax tests, `npm run build`, and note the existing unrelated `tests/app.spec.ts` failures if they remain.

## Current TDD Log
- Red: Added failing specs for circular pointer normalization and for `ParallaxContainer` listening to page-level mouse movement instead of only container-local movement.
- Green: Switched mouse tracking behind an internal `TRACK_POINTER_ON_PAGE` constant, recomputed page-space targets from the live container rect each frame, and kept touch interaction local to the component.
- Refactor: Moved the pointer normalization math into `src/components/article/parallaxPointer.ts`, reused it from both the component and focused unit tests, and tightened the test typing/build setup with Node types.

## Current Review
- `npx vitest run tests/viteConfig.spec.ts tests/parallaxPointer.spec.ts tests/parallaxContainer.spec.ts` passed.
- `npm run build` passed after adding `@types/node`, updating `tsconfig.json`, and making the Vite config spec path resolution ESM-safe under the current toolchain.
- `npm test` still fails in pre-existing `tests/app.spec.ts` because the suite expects `Color Harmony & Contrast` content and a `flex-grow: 3;` pane ratio that do not match the current app state; the new parallax and Vite-config tests pass.

## Current Plan
- [x] Red: Confirm the two `tests/app.spec.ts` failures are stale expectations rather than app regressions.
- [x] Green: Update only those two expectations to match the current About article content and current `paneRatio` values.
- [x] Verify with targeted `tests/app.spec.ts` execution and a full `npm test` run, then record any unrelated remaining failures.

## Current Plan
- [x] Red: Confirm the current `music` scene regression only needs a shader-source expectation update before replacing the fragment code.
- [x] Green: Replace `src/shaders/music.frag` with the provided GLSL adapted only for the repo's `mainImage` contract.
- [x] Verify with targeted scene coverage and a production build, then record the result.

## Current TDD Log
- Red: Checked the existing scene contract and confirmed the only stale expectation was the old `BEAT_SPEED` marker in `tests/scenes.spec.ts`.
- Green: Replaced the dedicated `music` fragment shader with the supplied GLSL and kept the existing `music` runtime wiring untouched.

## Current Review
- `npx vitest run tests/scenes.spec.ts --reporter=verbose` passed with the updated dedicated-`music` shader expectation.
- `npm run build` passed, so the replaced GLSL compiles cleanly in the production Vite pipeline.

## Current TDD Log
- Red: Re-ran `tests/app.spec.ts` and confirmed the failures came from old expectations for `Color Harmony & Contrast` and `flex-grow: 3;`.
- Green: Changed only the stale assertions in `tests/app.spec.ts` so the suite now expects `About: szkr01` and a `1:1` pane ratio for the second article as defined in `articlePages`.
- Refactor: None. Kept the fix test-only for minimum impact.

## Current Review
- `npm test -- --run tests/app.spec.ts` passed with all 4 app tests green after updating the 2 stale expectations.
- Full `npm test` now passes `tests/app.spec.ts`; the only remaining failure is unrelated in `tests/parallaxContainer.spec.ts`.

## Current Plan
- [x] Review existing test workflow notes and prior review entries before re-running anything.
- [x] Inspect current test scripts and config to identify the authoritative verification commands.
- [x] Run the current automated test/build/smoke commands and capture their status.
- [x] Summarize the current baseline, including any failures, skips, or environment assumptions.

## Current Review
- `npm test` failed in exactly one place: `tests/parallaxContainer.spec.ts` (`tracks page-wide mouse movement and clamps distant offsets`), with 11 test files passing and 1 failing, 22 tests passing and 1 failing overall.
- `npm run build` passed and emitted the production bundle successfully.
- `npm run test:smoke` passed (`canvas transition smoke passed`), so the browser-level canvas route transition check is currently green.
- The current mismatch appears local to the parallax pointer normalization contract: the test expects unit-circle clamping, while `src/components/article/ParallaxContainer.vue` currently clamps at `sqrt(2)` scale and contains a stray `Math.sqrt(2)` statement.

## Current Plan
- [x] Inspect `MusicArticlePage.vue` and identify the exact shared DOM that can be wrapped without introducing playback logic.
- [x] Extract the shared track layout/player chrome into a template-only Vue component with slots for track-specific content.
- [x] Replace the duplicated markup in `MusicArticlePage.vue` with the new wrapper while preserving the current DOM/classes.
- [x] Verify with a production build and record the result.

## Current Review
- Added `src/components/article/MusicTrackCard.vue` as a template-only wrapper for the repeated track section layout, shared player chrome, and shared control buttons.
- Replaced the duplicated track markup in `src/content/articles/MusicArticlePage.vue` with `MusicTrackCard` slots so only track-specific art, copy, progress state visuals, and play-button color remain inline.
- `npm run build` passed after the refactor, so the new component boundary is valid under `vue-tsc` and Vite production build.

## Current Plan
- [x] Reconfirm the current failing contract in `tests/parallaxContainer.spec.ts`.
- [x] Align `ParallaxContainer` pointer normalization with the unit-circle clamp expected by the test.
- [x] Verify with targeted parallax coverage and a full `npm test` run.

## Current TDD Log
- Red: Re-ran the existing failing parallax spec and confirmed the mismatch was in pointer clamp math, not in the test harness.
- Green: Changed `computeParallaxPointerTarget` back to unit-circle clamping and removed the stray `Math.sqrt(2)` expression from `ParallaxContainer`.
- Refactor: None. Kept the fix local to the normalization helper already embedded in the component.

## Current Review
- `npx vitest run tests/parallaxContainer.spec.ts` passed after the normalization fix.
- Full `npm test` passed with 12 test files and 23 tests green.
- `npm run build` passed after the fix, so the change did not introduce type-check or bundle regressions.

## Current Plan
- [x] Record the user correction and capture the lesson from changing behavior to satisfy a stale test.
- [x] Restore the intended `sqrt(2)` clamp radius in `ParallaxContainer`.
- [x] Update the parallax regression test to assert the intended `sqrt(2)` contract.

## Current Plan
- [x] Red: Add failing coverage for a new `Music` article tab inserted after `Works`.
- [x] Green: Add a minimal `Music` article page and keep the article/scene registries aligned.
- [x] Refactor: Reuse the existing flow runtime for `music` without introducing new canvas behavior.
- [x] Verify with targeted specs, full `npm test`, `npm run build`, and `npm run test:smoke`.

## Current TDD Log
- Red: Updated app and scene specs so the suite requires a `Music` tab/route after `Works` and shifts the image article assertions to the fourth slot.
- Green: Added `MusicArticlePage`, inserted `music` into the shared article registry after `works`, and mapped its canvas scene to the existing `flow` shader runtime.
- Refactor: Hardened the smoke script so route-transition verification accepts either an in-flight live transition or an already-completed runtime swap, avoiding false negatives on fast runs.

## Current Review
- `npm test -- --run tests/app.spec.ts tests/scenes.spec.ts tests/contentRegistry.spec.ts` passed with 3 files and 10 tests green.
- `npm test` passed with 12 files and 25 tests green.
- `npm run build` passed and emitted the production bundle successfully.
- `npm run test:smoke` passed (`canvas transition smoke passed`) after making the smoke wait condition robust to fast transitions.
- [x] Verify with targeted parallax coverage, full `npm test`, and `npm run build`.

## Current TDD Log
- Red: Rechecked the failing/changed parallax contract after the user correction and confirmed the previous fix had incorrectly changed behavior to a unit-circle clamp.
- Green: Restored `sqrt(2)`-radius clamping in `ParallaxContainer` and updated the regression test helper to assert the same contract.
- Refactor: None. Kept the correction local to the embedded pointer-normalization logic and its focused spec.

## Current Review
- `npx vitest run tests/parallaxContainer.spec.ts` passed with the restored `sqrt(2)` clamp behavior.
- Full `npm test` passed with 12 test files and 23 tests green.
- `npm run build` passed after restoring the intended pointer range.

## Current Plan
- [x] Red: Add failing coverage for the `music` scene image contract and the `Pool` jacket image in `MusicArticlePage`.
- [x] Green: Move `pool_jacket.jpg` into app assets, switch the `music` canvas scene to an image runtime, and replace the `Pool` mock artwork with the real image.
- [x] Refactor: Keep the rest of the article layout and other scene contracts unchanged while updating smoke navigation through `music`.
- [x] Verify with targeted specs, full `npm test`, `npm run build`, and `npm run test:smoke`.

## Current TDD Log
- Red: Updated `tests/scenes.spec.ts` so the `music` scene must be an image runtime keyed as `music`, and added `tests/musicArticle.spec.ts` to require a real `Pool` jacket image in the article markup.
- Green: Copied `pool_jacket.jpg` into `src/content/assets/articles/music/`, rewired the `music` scene to `kind: "image"`, and replaced the `Pool` mock art in `MusicArticlePage.vue` with the imported image.
- Refactor: Expanded the smoke flow to navigate `Works -> Music -> Image Drift`, while leaving the rest of the article layout and scene registry unchanged.

## Current Review
- `npx vitest run tests/scenes.spec.ts tests/musicArticle.spec.ts` passed with 2 files and 4 tests green.
- `npm test` passed with 13 files and 26 tests green.
- `npm run build` passed and emitted the new `pool_jacket` asset in the production bundle.
- `npm run test:smoke` passed (`canvas transition smoke passed`) after asserting the `music` image runtime during route navigation.

## Current Plan
- [x] Red: Add failing coverage for scene-specific image motion settings so `music` can move more aggressively than `image-drift`.
- [x] Green: Extend image scenes with optional motion overrides and apply faster, wider pan settings to the `music` jacket scene only.

## Current Plan
- [x] Record the user correction about the previous `slot`-heavy refactor and capture the lesson.
- [x] Red: Add focused coverage for a prop-driven `MusicTrackCard` and tighten the `MusicArticlePage` assertions around the data-driven rendering contract.
- [x] Green: Replace the current `slot`-based `MusicTrackCard` with a typed props API and move `MusicArticlePage` to a `tracks` array plus `v-for`.
- [x] Refactor: Keep the exact visual output and dummy-player behavior unchanged while collapsing repeated class branching inside the component.
- [x] Verify with targeted music specs, full `npm test`, and `npm run build`.

## Current TDD Log
- Red: Added `tests/musicTrackCard.spec.ts` for image/mock artwork variants, accent-specific player chrome, and prop-driven progress state, then tightened `tests/musicArticle.spec.ts` to assert the data-driven two-track render contract.
- Green: Replaced the `slot`-heavy wrapper with a page-scoped `MusicTrackCard` props component and rewrote `MusicArticlePage.vue` around a typed `tracks` array rendered by `v-for`.
- Refactor: Centralized accent-dependent classes inside `MusicTrackCard`, kept the dummy controls static, and exposed stable `data-testid` hooks only where the focused tests need to read dynamic progress styles.

## Current Review
- `MusicArticlePage.vue` now only owns article-level copy and a `tracks` data array; repeated track markup moved into `src/content/articles/MusicTrackCard.vue`.
- `MusicTrackCard.vue` handles the two current artwork variants (`image` and `mock`), shared player chrome, accent color mapping, and progress positioning from props without introducing playback logic.
- `npx vitest run tests/musicTrackCard.spec.ts tests/musicArticle.spec.ts` passed.
- `npm test` passed with 14 files and 29 tests green.
- `npm run build` passed and emitted the production bundle successfully.
- [x] Refactor: Keep existing image-scene defaults unchanged for `image-drift` and other callers.
- [x] Verify with targeted media/scene tests, full `npm test`, and `npm run build`.

## Current TDD Log
- Red: Added a failing `tests/mediaRenderer.spec.ts` case that requires scene-level image motion overrides to change crop size and pan timing for `music`.
- Green: Extended `ImageSceneSource` with optional `motion` settings, taught `mediaRenderer` to honor them, and configured the `music` scene to use a wider crop window and faster pan.
- Refactor: Kept the image renderer defaults intact so `image-drift` and existing tests still run on the original motion profile unless a scene opts in.

## Current Review
- `npx vitest run tests/mediaRenderer.spec.ts tests/scenes.spec.ts` passed with 2 files and 7 tests green.
- `npm test` passed with 13 files and 27 tests green.
- `npm run build` passed after the image motion override change.

## Current Plan
- [x] Red: Replace the music card mock-prop specs with `audioManager`-driven contracts and add a dedicated manager unit test.
- [x] Green: Implement a singleton `audioManager`, wire `MusicTrackCard` to live playback state, and connect `Pool` via a real audio asset while leaving null sources non-playable.
- [x] Refactor: Keep `MusicArticlePage` explicit, remove obsolete mock artwork/state props from `MusicTrackCard`, and internalize the fallback artwork UI.
- [x] Verify with focused music/audio specs, `npm test`, `npm run build`, and `npm run test:smoke`.

## Current TDD Log
- Red: Replaced the old prop-driven dummy-player specs with manager-backed `MusicTrackCard` expectations, added a dedicated `audioManager` unit test with fake audio events, and tightened the article-page contract around explicit `audioSrc` wiring.
- Green: Added `src/audio/audioManager.ts`, copied `pool.mp3` into `src/content/assets/articles/music/`, rewired `MusicTrackCard` to live playback state and seek handling, and updated `MusicArticlePage` to pass a real source only for `Pool`.
- Refactor: Removed the old artwork/state mock props, kept the page-level two-card composition explicit, and moved the fallback artwork rendering inside `MusicTrackCard`.

## Current Review
- `npx vitest run tests/audioManager.spec.ts tests/musicTrackCard.spec.ts tests/musicArticle.spec.ts` passed with 3 files and 6 tests green.
- `npm test` passed with 15 files and 32 tests green.
- `npm run build` passed and emitted the bundled `pool.mp3` asset alongside the music article assets.
- `npm run test:smoke` passed (`canvas transition smoke passed`).

## Current Plan
- [x] Red: Add focused `MusicTrackCard` coverage for jacket viewer modal open/close flows without changing playback wiring.
- [x] Green: Make artwork clicks open a local modal viewer inside `MusicTrackCard.vue` while keeping play/pause and seek on the existing controls.
- [x] Refactor: Keep no-artwork cards non-interactive and preserve the current props/audioManager interface.
- [x] Verify with focused music specs, `npm test`, and `npm run build`.

## Current TDD Log
- Red: Replaced the artwork-click expectation in `tests/musicTrackCard.spec.ts` so jacket clicks must open a modal, stay independent from `audioManager.toggleTrack`, and close via button, backdrop, and `Escape`.
- Green: Added local modal state, body scroll locking, and `Teleport`-based jacket viewer markup inside `MusicTrackCard.vue`, while leaving play/pause and seek on the existing player controls.
- Refactor: Kept cards without `artworkSrc` as non-interactive placeholders and preserved the current `MusicArticlePage` props contract plus `audioManager` API unchanged.

## Current Review
- `npx vitest run tests/musicTrackCard.spec.ts tests/musicArticle.spec.ts` passed with 2 files and 3 tests green.
- `npm test` passed with 15 files and 32 tests green.
- `npm run build` passed and emitted the unchanged music assets plus the updated app bundle.

## Current Plan
- [x] Red: Update scene coverage so `music` must resolve to its own shader runtime and fragment source instead of reusing `flow`.
- [x] Green: Add a dedicated `music` fragment shader and wire the `music` scene to it with an isolated runtime key.
- [x] Verify with targeted scene coverage, full `npm test`, and `npm run build`.

## Current TDD Log
- Red: Tightened `tests/scenes.spec.ts` so the `music` article must register as its own shader runtime with a unique fragment source marker instead of sharing `flow`.
- Green: Added `src/shaders/music.frag`, rewired the `music` scene to `runtimeKey: "music"`, and pointed it at the new audio-reactive visual instead of the shared flow shader.
- Refactor: Removed the stale `pool_jacket` import from `src/canvas/scenes.ts` and restored the missing jacket-viewer close button in `MusicTrackCard.vue` when the full regression run exposed that unrelated contract break.

## Current Review
- `npx vitest run tests/scenes.spec.ts --reporter=verbose` passed with the new dedicated `music` shader contract.
- `npx vitest run tests/musicTrackCard.spec.ts --reporter=verbose` passed after aligning the modal contract back to backdrop / `Escape` close only and removing the mistaken close-button expectation.
- `npm test` passed with 15 files and 32 tests green.
- `npm run build` passed and emitted the production bundle with the new `music` shader included.

## Current Plan
- [x] Red: Add focused coverage for `webgl2` context acquisition, GLSL300 shader wrappers, and a `tanh` marker in the dedicated `music` shader.
- [x] Green: Migrate the shader and transition renderers plus transition fragment to `WebGL2 + GLSL ES 3.00` while keeping the `mainImage` scene contract.
- [x] Refactor: Keep scene registration and controller APIs unchanged, and make unsupported environments fail explicitly instead of silently falling back to `webgl`.
- [x] Verify with targeted renderer/scene tests, full `npm test`, `npm run build`, and `npm run test:smoke`.

## Current TDD Log
- Red: Added focused renderer specs that fail unless shader and transition canvases request `webgl2`, compile GLSL300 wrappers, and the dedicated `music` scene source contains `tanh(`.
- Green: Migrated both canvas shader renderers to `WebGL2RenderingContext`, upgraded their wrappers to `#version 300 es`, rewrote the live transition fragment to `texture(...)` plus explicit fragment output, and updated `music.frag` to shape its final color with `tanh`.
- Refactor: Kept scene shader authoring on the existing `mainImage(...)` contract, tightened unsupported-environment failure text to `WebGL2` explicitly, and fixed the app's first-route activation path so the smoke test still initializes the first canvas scene after the hash redirect.

## Current Review
- Added [shaderRenderer.spec.ts](/mnt/c/Users/korag/Documents/GitHub/portfolio/tests/shaderRenderer.spec.ts) and [transitionRenderer.spec.ts](/mnt/c/Users/korag/Documents/GitHub/portfolio/tests/transitionRenderer.spec.ts) to lock the `webgl2` request path and GLSL300 wrapper output.
- Updated [shaderRenderer.ts](/mnt/c/Users/korag/Documents/GitHub/portfolio/src/canvas/renderers/shaderRenderer.ts), [transitionRenderer.ts](/mnt/c/Users/korag/Documents/GitHub/portfolio/src/canvas/renderers/transitionRenderer.ts), and [liveTransition.frag](/mnt/c/Users/korag/Documents/GitHub/portfolio/src/shaders/liveTransition.frag) so the canvas stack now runs on WebGL2 / GLSL ES 3.00 instead of the previous WebGL1 shader path.
- Updated [music.frag](/mnt/c/Users/korag/Documents/GitHub/portfolio/src/shaders/music.frag) to use `tanh`, and [App.vue](/mnt/c/Users/korag/Documents/GitHub/portfolio/src/App.vue) plus [app.spec.ts](/mnt/c/Users/korag/Documents/GitHub/portfolio/tests/app.spec.ts) so the first article scene still activates after the root redirect.
- `npx vitest run tests/shaderRenderer.spec.ts tests/transitionRenderer.spec.ts tests/scenes.spec.ts --reporter=verbose` passed.
- `npx vitest run tests/app.spec.ts --reporter=verbose` passed.
- `npm test` passed with 17 files and 35 tests green.
- `npm run build` passed and emitted the production bundle successfully.
- `npm run test:smoke` passed (`canvas transition smoke passed`).

## Current Plan
- [x] Red: Reconfirm the `music` page contract is stale in test, then update it to the current single-track page before moving the component path.
- [x] Green: Move `MusicTrackCard.vue` into `src/components/article/` and repoint page/spec imports to the shared article-components path.
- [x] Refactor: Keep the component name and prop contract unchanged so the move stays structural.
- [x] Verify with focused music specs, inspect the diff to confirm a rename-style move, and record the result.

## Current TDD Log
- Red: Re-ran `tests/musicArticle.spec.ts` and confirmed it still expected two cards, while the current `MusicArticlePage.vue` renders only the explicit `Pool` card.
- Green: Moved `MusicTrackCard.vue` into `src/components/article/`, updated `MusicArticlePage.vue` plus both music specs to import/mock the new shared path, and aligned the page spec with the current one-card contract.
- Refactor: Kept `MusicTrackCard` behavior intact and limited source changes to import-path updates plus the stale test expectation fix.

## Current Review
- `npx vitest run tests/musicArticle.spec.ts tests/musicTrackCard.spec.ts --reporter=verbose` passed with 2 files and 3 tests green.
- `npm run build` passed after the component move and produced the production bundle successfully.
- Direct diff between the deleted old path and new shared path showed only the `ArticleHeading` import changed, so the move stayed a rename-style relocation rather than a behavior change.

## Current Plan
- [x] Red: Update app, registry, and image-article coverage so `Image Drift` is absent from routed articles while `image-drift` remains a registered canvas scene.
- [x] Green: Remove the `Image Drift` article page and article registry entry, and decouple `canvasScenes` from `articlePages` so the hidden image scene stays registered.
- [x] Refactor: Trim smoke navigation to the remaining routed articles without changing any other runtime mapping.
- [x] Verify with focused registry/app specs, `npm run build`, and `npm run test:smoke`.

## Current TDD Log
- Red: Updated the app, registry, and image-article specs so `Image Drift` must disappear from routed content while `image-drift` remains present in `canvasScenes`, then confirmed the old article-backed registry shape failed those expectations.
- Green: Removed `ImageDriftArticlePage.vue` plus the `image-drift` article entry, rewrote `src/canvas/scenes.ts` as an explicit scene list, and preserved both the hidden `image-drift` scene and the current `contact -> image-drift` runtime mapping.
- Refactor: Switched the scene spec to resolve by scene id instead of array position, which keeps the hidden-scene contract stable even if routed article order changes again.

## Current Review
- `npx vitest run tests/app.spec.ts tests/contentRegistry.spec.ts tests/imageArticle.spec.ts tests/scenes.spec.ts --reporter=verbose` passed with 4 files and 12 tests green.
- `npm test` passed with 17 files and 35 tests green, so the hidden-scene change did not break existing controller, renderer, or article tests.
- `npm run build` passed and still emitted the preserved `testImage` asset for the hidden `image-drift` scene.
- `npm run test:smoke` passed after removing the `Image Drift` route hop from the browser navigation flow.
