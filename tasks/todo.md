## Current Plan
- [x] Issue #3: ページ遷移時のWebGLリソース生成と重複描画を削減。
- [x] 既存動作を再現する回帰テストを追加（Red）。
- [x] WebGLテクスチャを2個に固定し、サイズ変更時のみ再確保（Green）。
- [x] トランジション中の遷移先シーン重複描画を削除（Green）。
- [x] `npm test`、`npm run build`、`git diff --check` を確認。
- [x] `http://127.0.0.1:5173/portfolio/` で開発サーバーを起動し、HTTP 200を確認。
- [ ] ユーザーの画面確認後、PR・マージを判断する。

## Current TDD Log
- Red: テクスチャが2フレームで4個生成され、遷移先シーンが1フレームで2回描画されることを確認。
- Green: テクスチャの再利用と遷移中の描画1回化を検証。

## Current Review
- `npm test`: 18ファイル・40件成功。
- `npm run build`: vue-tscとViteビルド成功。
- 既存の800msトランジションとシェーダーを変更せず、表示確認用devサーバーを稼働中。
