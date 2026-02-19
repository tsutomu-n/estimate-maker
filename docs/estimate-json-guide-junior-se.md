# 見積JSON作成ガイド（ジュニアSE向け）

このガイドは、`estimate-maker` の見積JSONを**推奨形式（strict）**で作るための実務手順です。  
まずはこの手順で作成して、必要時のみ互換版を使ってください。

## 目的

見積データを、アプリの読み込み・表示・印刷で正しく使える状態で保存する。

- 読み込み時に 0円化しない
- 計算結果（小計・税額・合計）が崩れない
- スキーマ検証で自動チェックできる

## まず1分で読むポイント（必須ルール）

- ルートはこの7項目を持つ（`discount` は必須）
  - `version`, `createdAt`, `customerName`, `title`, `place`, `date`, `sections`, `discount`
- `date` は `YYYY年M月D日`（例: `2026年1月16日`）
- `createdAt` は ISO8601（例: `2026-01-16T00:00:00Z`）
- 明細行の単価は `unitPrice` を使う
- `quantity` は数値（`5.2` など小数可）
- 追加キーは最小限（`section`, `item` は厳密）

## 推奨テンプレート（コピペして編集）

```json
{
  "version": "1.0.0",
  "createdAt": "2026-01-16T00:00:00Z",
  "customerName": "山田 太郎",
  "title": "木造倉庫 解体撤去工事",
  "place": "南牧村小沢1560",
  "date": "2026年1月16日",
  "discount": -10000,
  "sections": [
    {
      "title": "1. 建物解体・撤去工",
      "items": [
        {
          "name": "木造倉庫 解体撤去費",
          "quantity": 5.2,
          "unit": "坪",
          "unitPrice": 20000,
          "note": "屋根トタン・内装材共"
        }
      ]
    },
    {
      "title": "2. 産廃処分費",
      "items": [
        {
          "name": "産業廃棄物 運搬処分費",
          "quantity": 1,
          "unit": "式",
          "unitPrice": 55000,
          "note": "木くず・コンガラ"
        }
      ]
    }
  ]
}
```

## 作成手順（失敗しづらい順）

1. まず `version` / `createdAt` / `date` を埋める  
2. 顧客名・工事名・場所を入れる  
3. `sections` を作る  
   - セクション名は見出しとして文字列のみ  
   - 1つ以上あればOK（空でもNGしない設計だが、実運用では1件以上推奨）
4. 明細を追加する  
   - `name`, `quantity`, `unit`, `unitPrice`, `note` を必ず揃える  
   - `unitPrice` がないとその行は 0円扱いになりやすい
5. 値引きは `discount` に入れる  
   - 値引きなら負の数（`-5455`）  
   - 上乗せの場合は正の数も可
6. 保存前にスキーマ検証

## 初心者がよくやるNG（必ず避ける）

- `unitPriceExclTax` を使って作成してしまう  
  - 対応は実装で行っているが、厳密準拠外
- `discountExclTax` のみで保存して `discount` を空にする  
- `date` を `"2026/1/16"` など別形式で入れる
- 明細に `unitPrice` 以外の金額キーだけ入れる（`amountExclTax`, `unitPriceExclTax`）
- 不要なキーを追加する（strict では `additionalProperties: false`）

## 検証コマンド（厳密版）

```bash
npx -y ajv-cli validate -s docs/estimate-json.schema.json -d static/samples/sample.json
```

互換データを受ける想定のときは `compat` スキーマを使う。

```bash
npx -y ajv-cli validate -s docs/estimate-json.compat.schema.json -d static/samples/sample.json
```

※本環境では `npx` の解像度が差し替わる場合があるため、`npx -y ajv-cli` で固定してください。

## 重要：開発運用上のルール

- `strict` で作るファイルは `docs/estimate-json.schema.json` に合わせる
- 受け付ける拡張項目（`unitPriceExclTax` など）は、受領時のみ互換として扱う
- 読み込みで変換したあとでも、保存時は可能な限り `unitPrice`/`discount` へ寄せる

## 実ファイル監査結果（2026-02-19）

`static/samples` の現状チェック:

- `厚基礎プラン.json`: `strict` で `OK`
- `標準プラン.json`: `OK`（strict 対応）
- `sample_738man.json`: `OK`（strict 対応）

改善時は次を確認する:
1. `unitPrice` のみ採用
2. `discount` を持たせる
3. 互換追加項目は必要時のみ許容（`compat` と明確分離）

## 参照先

- 仕様: `docs/estimate-json-schema.md`
- 厳密推奨チェック: `docs/estimate-json-guide-recommended.md`
- 現行互換ガイド: `docs/estimate-json.compat.schema.json`
