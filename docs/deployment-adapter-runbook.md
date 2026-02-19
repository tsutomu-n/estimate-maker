# 配信方式ごとのアダプタ固定運用ガイド

このプロジェクトは `svelte.config.js` で `ADAPTER_TARGET` を読み取り、
配信方式ごとにアダプタを固定してビルドします。

- `ADAPTER_TARGET=static` : `@sveltejs/adapter-static`
- `ADAPTER_TARGET=node` : `@sveltejs/adapter-node`

## 目的

- 本番事故を減らす（環境自動判定に依存しない）
- 配信方式ごとに同じ成果物を再現できるようにする
- 運用担当がコマンドを迷わないようにする

## 現在のビルドコマンド

`package.json` の scripts:

- `bun run build`  
  デフォルト。`build:static` を実行（静的配信向け）
- `bun run build:static`  
  `ADAPTER_TARGET=static vite build`
- `bun run build:node`  
  `ADAPTER_TARGET=node vite build`
- `bun run start:node`  
  Node成果物を起動（`node build`）

## 運用手順

### 1) 静的ホスティング（推奨デフォルト）

対象例: S3, Cloudflare Pages, Netlify, nginx 静的配信

1. 依存導入
   - `bun install`
2. 静的ビルド
   - `bun run build:static`
3. 生成物をホスティングへ配置
   - SvelteKit の static 出力先をそのまま配置
4. SPAフォールバック設定
   - 直リンクアクセス時に `index.html` へフォールバックする設定を有効化

補足:

- `adapter-static` は `fallback: 'index.html'` を設定済み
- このアプリの主要機能（JSON読み込み、印刷）はクライアント側で動作するため、静的配信でも利用可能

### 2) VM/コンテナで Node 実行

対象例: Ubuntu VM, Docker, ECS/Fargate, GCE

1. 依存導入
   - `bun install`
2. Node向けビルド
   - `bun run build:node`
3. サーバ起動
   - `bun run start:node`
4. 必要に応じてリバースプロキシ設定
   - 例: nginx -> `localhost:<node-port>`

## 変更したファイル

- `svelte.config.js`
  - `ADAPTER_TARGET` で `static/node` を切替
- `package.json`
  - `build:static` / `build:node` / `start:node` を追加
  - `build` は `build:static` を呼ぶよう変更

## 事故防止チェックリスト（本番前）

- [ ] 配信方式（静的/Node）を先に決めた
- [ ] 該当コマンドでビルドした（`build:static` or `build:node`）
- [ ] `adapter` が配信方式と一致している
- [ ] ルート直アクセスの挙動を確認した（静的時はフォールバック）
- [ ] 印刷画面とJSON読み込みを本番相当で確認した

## トラブル時の確認ポイント

- 静的配信で 404 が出る
  - フォールバック設定漏れを確認
- Nodeで起動しない
  - `build:node` 実行有無と `start:node` 実行ログを確認
- 想定と違う成果物になる
  - 実行した script が `build:static` / `build:node` のどちらかを確認
