# Szkr01 Portfolio

Interactive portfolio site built with Vue 3, Vite, and TypeScript. It combines route-driven article pages with a live canvas scene system, shader transitions, and a small audio player experience.

## 概要

このリポジトリは、記事ページと canvas 表現を組み合わせたインタラクティブなポートフォリオです。  
右側の article pane は `About` / `Works` / `Music` / `Contact` をルーティングで切り替え、左側の canvas pane は各ページに対応するシーンへ遷移します。

公開向けの見た目だけでなく、scene 管理、テーマ反映、シェーダー遷移、オーディオ UI までを含めてひとつのフロントエンドとして組んでいます。

## 主な機能

- `vue-router` の hash routing で記事ページを切り替え
- route に連動した canvas scene のアクティベーション
- WebGL2 ベースの shader scene と live transition
- canvas の色サンプリングに基づく theme tokens の更新
- パララックス付きのプロフィールビジュアル
- 音源再生とシークに対応した `Music` ページ
- `Vitest` と browser smoke script による検証

## Tech Stack

- Vue 3
- Vite
- TypeScript
- vue-router
- Tailwind CSS v4
- Vitest
- Playwright
- WebGL2 / GLSL ES 3.00

## Development

```bash
npm install
npm run dev
```

開発サーバー起動後、アプリは hash route で `#/articles/...` を使って表示されます。

## Verification

```bash
npm test
npm run build
npm run test:smoke
```

2026-04-08 時点で、上記 3 コマンドはこのリポジトリで通過確認済みです。

## Project Structure

```text
src/
  audio/        audio manager
  canvas/       scene/controller/renderer logic
  components/   app shell and article components
  content/      article pages and bundled assets
  shaders/      fragment shaders and transition shader
tests/          unit and component tests
smoke/          browser-level smoke script
```

## Notes

- ルーティングは `createWebHashHistory()` を使っています。
- メディアアセットはリポジトリに同梱されています。
- README にはデプロイ手順は含めていません。
