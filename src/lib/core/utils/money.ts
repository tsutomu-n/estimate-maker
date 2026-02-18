/**
 * 金額計算ユーティリティ
 * ※今回は「切り捨て」を基本とする（建設業の慣習）
 */

// 消費税率
export const TAX_RATE = 0.10;

// 金額の丸め処理 (切り捨て)
export function roundPrice(amount: number): number {
  return Math.floor(amount);
}

// 消費税計算
export function calculateTax(amount: number): number {
  return Math.floor(amount * TAX_RATE);
}

// 数値のフォーマット (3桁区切り)
export function formatMoney(amount: number): string {
  return amount.toLocaleString('ja-JP');
}