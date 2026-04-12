## Current Plan
- [x] Red: `npm run build` で `tests/app.spec.ts` の `wrapper.get(...).exists()` による型エラーを再現する。
- [x] Green: `.article-pane__inner` の存在確認を `get()` ではなく `find().exists()` に切り替え、テスト意図を維持したまま `vue-tsc` を通す。
- [x] Verify: `npm test -- tests/app.spec.ts` と `npm run build` を実行して回帰がないことを確認する。
- [x] Review: 結果を記録する。

## Current TDD Log
- Red: `wrapper.get()` の返り値型では `.exists()` が許されず、`vue-tsc` が停止することを確認した。
- Green: `wrapper.find(".article-pane__inner").exists()` に置き換えて、存在確認の意味を維持したまま型エラーを解消した。
- Refactor: production code は触らず、テスト 1 行の最小差分に留めた。

## Current Review
- `npm test -- tests/app.spec.ts`: pass
- `npm run build`: pass
