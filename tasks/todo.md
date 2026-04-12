## Current Plan
- [x] Red: `tests/app.spec.ts` にレスポンシブ用の期待値を追加し、`App` が desktop 用 CSS 変数と mobile 用レイアウトフックを出すことを先に失敗で固定する。
- [x] Green: `src/App.vue` とペインコンポーネントを更新し、mobile で上 canvas / 下 article に切り替わるクラス構造と CSS 変数を渡す。
- [x] Green: `src/styles.css` に desktop / mobile のレイアウト切替、canvas の `18svh` 高さ、article 優先の余白とスクロール制御を追加する。
- [x] Verify: `smoke/canvasTransition.smoke.mjs` に mobile viewport のレイアウト確認を追加し、canvas transition が desktop / mobile の両方で成立することを確認する。
- [x] Review: `npm test -- tests/app.spec.ts`、`npm test`、`npm run test:smoke` を順に実行し、結果を記録する。

## Current TDD Log
- Red: `App` は常に横並びで、mobile 用の縦積みレイアウトや canvas の控えめな見せ方を表すフックを持っていない。
- Green: `App` から CSS 変数ベースで比率を渡し、スタイル側で `max-width: 767px` 時に canvas を `18svh` の上段、article を主役の下段へ切り替える。
- Refactor: desktop の記事別 `paneRatio` 契約は維持しつつ、mobile では共通ルールを優先してレイアウト責務を CSS に閉じる。

## Current Review
- `npm test -- tests/app.spec.ts`: pass
- `npm test`: pass
- `npm run test:smoke`: pass
