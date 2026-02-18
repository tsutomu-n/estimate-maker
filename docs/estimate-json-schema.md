# Estimate JSON スキーマガイド

このリポジトリでは、見積データを JSON で保存・読込する際に
`src/lib/types/schema.ts` を基準にしています。
外部の人がデータを安全に扱えるようにするための運用ガイドです。

## 結論（どう思うか）

- この構成は十分実用的です。
- `estimate` の UI / 印刷データと `samples` の見積ファイルが同じ形を持てるため、
  連携・移行・バッチ投入がしやすいです。
- ただし現状の `loadFromJSON` は厳密バリデーションではなく、
  `Number()` / `String()` で受け入れを優先しているため、
  **実運用では追加で JSON Schema バリデーションを入れると安全性が上がります**。

## 仕様（TypeScript 型）

定義元: `src/lib/types/schema.ts`

```ts
export interface EstimateSchema {
  version: string;
  createdAt: string;    // ISO8601
  customerName: string;
  title: string;
  place: string;
  date: string;
  sections: SectionSchema[];
  discount: number;
}

export interface SectionSchema {
  title: string;
  items: LineItemSchema[];
}

export interface LineItemSchema {
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  note: string;
}
```

### 必須項目

- `version`, `createdAt`, `customerName`, `title`, `place`, `date`, `sections`, `discount`
- `sections[].title`, `sections[].items`
- `items[].name`, `items[].quantity`, `items[].unit`, `items[].unitPrice`, `items[].note`

### 最低限の JSON 例

```json
{
  "version": "1.0.0",
  "createdAt": "2026-01-16T00:00:00Z",
  "customerName": "山田 太郎",
  "title": "木造小屋 解体撤去工事",
  "place": "群馬県xxxx",
  "date": "2026年1月16日",
  "sections": [
    {
      "title": "1. 建物解体・撤去工",
      "items": [
        {
          "name": "建物解体（小運搬）",
          "quantity": 15,
          "unit": "坪",
          "unitPrice": 25000,
          "note": "手作業"
        }
      ]
    }
  ],
  "discount": 0
}
```

## 参照実装との対応

- 保存:
  - `Estimate.toJSON()` は `$state` の状態をそのまま JSON 化します。
- 読込:
  - `Estimate.loadFromJSON(json)` は存在しない項目を空文字/0 などにフォールバックします。
  - `customerName`, `title`, `place`, `date` は `String(...)`。
  - `discount`, `quantity`, `unitPrice` は `Number(...)`。
  - `sections[]` / `items[]` は配列でないと空扱い。

このため、**受け取った JSON が多少崩れていても表示は止まらない**一方で、
不正値が混入すると計算結果が予期しない値になる可能性があります。

## 運用上の注意（第三者連携前提）

- `date`:
  - 表示側の既定は `2026年1月16日` のような形式。
- `createdAt`:
  - ISO8601（例: `2026-01-16T00:00:00Z`）。
- `unit` は自由文字列だが、画面表示上は説明不足がないよう既存値を優先。
- 小数点は `quantity` で使用可能（例: `5.2`）。
- `discount` は減額時に負の値を許容（見積総額調整）する。

## 変更・拡張ルール

- 新しい項目を追加する場合:
  1. `src/lib/types/schema.ts` を更新
  2. 既存サンプル更新（例: `static/samples/*.json`）
  3. `loadFromJSON` と `toJSON` の振る舞いが整合することを確認
  4. 型エラー時のフォールバック方針を明記
- 互換性:
  - `version` は将来拡張時の切り分け用。破壊的変更時はメジャー更新推奨。

## 推奨

- 本番投入前に、`date` と `createdAt` の書式を統一してから投入する。
- JSON Schema 版（`ajv` など）を導入し、`version` ごとの strict ルールを追加する。

## 検証ファイル

- 機械検証用スキーマ: `docs/estimate-json.schema.json`
- 目安:
  - `createdAt`: ISO8601 (`date-time`)
  - `date`: `YYYY年M月D日`
  - `sections` / `items` の追加項目は禁止（`additionalProperties: false`）
