# Serena同期用ペイロード

- Goal: strict準拠サンプルとドキュメントの運用を再開する
- KeyDecisions:
  - strict では `unitPrice`/`discount` を基本にする
  - compat 受け入れは fromJSON フォールバックとしてのみ維持
  - sample_738man は見積サンプルとして strict 形式に固定
- CurrentTask: チェックポイント作成完了後の再開準備
- PendingIssues:
  - ajv 検証の未実行
  - 会話全文ログの完全取得不可（ツール制約）
