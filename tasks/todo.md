## Current Plan
- [x] Issue #1: Worksにgpu-unlock記事とSpacifyを追加する仕様を整理。
- [x] `WorksArticlePage.vue` のMy Articleに技術記事を追加。
- [x] Audio / DSPカテゴリを作りSpacifyを追加。
- [x] `CHANGELOG.md` に履歴を記録。
- [x] `npm test` と `npm run build` で検証。
- [ ] PRを作成しmainへマージ、デプロイを確認。

## Current TDD Log
- 既存の文面・リンクを追加するコンテンツ変更のみ。controllerと既存コンポーネントの挙動は変更せず、既存テストとビルドで検証する。

## Current Review
- `npm test`: 18ファイル・39件成功。
- `npm run build`: vue-tscとVite本番ビルド成功。
- 既存Worksの表示構造を流用し、変更は記事と新カテゴリの追加のみ。
