## Current Plan
- [x] Green: desktop 記事本文幅の中間係数だけを少し広げ、FHD の左右マージンをわずかに減らす。
- [x] Verify: `npm test -- tests/app.spec.ts` と `npm run test:smoke` を実行し、既存契約と desktop 幅比較が維持されることを確認する。
- [x] Review: 結果を記録する。

## Current TDD Log
- Green: WQHD 上限と mobile ルールは維持し、FHD 近辺の本文幅だけ中間式で少し戻す。
- Refactor: 定数 1 箇所の調整に留め、pane share 契約と smoke 期待値はそのまま再利用する。

## Current Review
- `npm test -- tests/app.spec.ts`: pass
- `npm run test:smoke`: pass
