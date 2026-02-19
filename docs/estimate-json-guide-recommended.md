# 推奨スキーマ（strict）で作るための実データ作成ガイド

このドキュメントは、見積データを `docs/estimate-json.schema.json`（厳密版）で作成する前提の書き方をまとめます。

## 1. まずこの3点を固定する

- `createdAt` は ISO8601（例: `2026-01-16T00:00:00Z`）
- `date` は表示用（例: `2026年1月16日`）
- `discount` を必ず持たせる（`discountExclTax` は厳密版では不採用）

## 2. strict 版で使う必須フィールド

- `version`, `createdAt`, `customerName`, `title`, `place`, `date`, `sections`, `discount`
- 各 `section`: `title`, `items`
- 各 `item`: `name`, `quantity`, `unit`, `unitPrice`, `note`

## 3. 1件分の最小 JSON（コピペ可）

```json
{
  "version": "1.0.0",
  "createdAt": "2026-01-16T00:00:00Z",
  "customerName": "山田 太郎",
  "title": "木造倉庫 解体撤去工事",
  "place": "南牧村小沢1560",
  "date": "2026年1月16日",
  "discount": 0,
  "sections": [
    {
      "title": "1. 建物解体・撤去工",
      "items": [
        {
          "name": "木造倉庫 解体撤去費",
          "quantity": 1,
          "unit": "式",
          "unitPrice": 20000,
          "note": "屋根トタン・内装材共"
        }
      ]
    }
  ]
}
```

## 4. strict 版で入れない方がよいもの

- `unitPriceExclTax`, `amountExclTax`
- `discountExclTax`
- `scenarioId`, `scenarioTitle`, `assumptions`, `totals`, `price`（strict では利用されない）
- 追加プロパティ（未定義キー）

## 5. 推奨運用

- 外部提供元には `docs/estimate-json.schema.json`（strict）を基準に作成してもらう
- 内部調査・連携検証時のみ、`docs/estimate-json.compat.schema.json` を許容
- 受領後は `loadFromJSON` で表示し、必要なら `toJSON` で strict へ変換して保管する

## 6. 検証

- strict
  - `docs/estimate-json.schema.json`
- 互換混在を許容する時
  - `docs/estimate-json.compat.schema.json`

## 7. 補足

- ジュニアSE向けの実務手順は `docs/estimate-json-guide-junior-se.md`
