## Current Plan
- [x] Red: `tests/mediaRenderer.spec.ts` に横長 canvas で右側が空かない描画先矩形の期待値を追加し、現状の left-anchored square 契約を失敗で固定する。
- [x] Green: `src/canvas/renderers/mediaRenderer.ts` で `canvas.width > canvas.height` のときだけ destination rect を横幅基準へ切り替え、空白をなくす。
- [x] Verify: `smoke/canvasTransition.smoke.mjs` に mobile viewport の `Contact` 確認を追加し、右端近くの描画が空でないことを実ブラウザで検証する。
- [x] Review: `npm test -- tests/mediaRenderer.spec.ts`、`npm test`、`npm run test:smoke` を実行し、結果を記録する。

## Current TDD Log
- Red: image renderer は常に `canvas.height` 基準の正方形を左上に描くため、横長 canvas では右側に未描画領域が残る。
- Green: source crop は現状維持で、横長 canvas 時だけ destination rect を `canvas.width` 基準にして縦方向へ中央寄せする。
- Refactor: public scene contract を増やさず、shared renderer 内の最小分岐で mobile `Contact` の見え方を補正する。

## Current Review
- `npm test -- tests/mediaRenderer.spec.ts`: pass
- `npm test`: pass
- `npm run test:smoke`: pass
