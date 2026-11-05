## Current Plan
- [x] Issue #3: WebGLテクスチャ・重複描画・同期コンパイルを最適化。
- [x] About→Worksの背景色・文字色とCanvas遷移進捗をChromeで計測。
- [x] テーマ色をCanvasと同じ800msの進捗で補間し、CSSの100ms二重補間を廃止。
- [x] コンテナの継承文字色をテーマに連動させる。
- [x] Vitest全44件、本番ビルド、Chromeブラウザスモークを確認。
- [x] 5173番のdevサーバーで確認可能。
- [ ] ユーザーの表示確認後、PR・マージを判断。

## Current TDD Log
- Red: 毎フレーム固定係数の色更新は経過時間で決まらず、Canvasの800msと同期しなかった。
- Green: 遷移進捗0/0.5/1による色の線形性と同一進捗の決定性を単体テストで確認。

## Current Review
- ChromeのAbout→Works計測: 旧版は約500msで暗色に近づく一方、修正後は800msの遷移進捗で白→暗色が変化。
- CSS変数とcomputed background/textの値が一致することを時系列で確認。
- npm test: 18ファイル・44件成功。npm run build: 成功。
- ChromeのCanvas遷移スモーク: 成功。mainは未変更。
