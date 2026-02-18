import { Section } from './Section.svelte';
import { calculateTax } from '../utils/money';

export class Estimate {
  customerName = $state('');
  title = $state('');
  place = $state('');
  date = $state('');
  sections = $state<Section[]>([]);
  discount = $state(0);

  constructor() {
    // デフォルト初期化（変更なし）
    this.initDefault();
  }

  initDefault() {
    this.customerName = '天野 茂';
    this.title = '木造農家住宅等 解体撤去工事';
    this.place = '群馬県甘楽郡下仁田町 地内';
    this.date = new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }).format(Date.now());
    this.sections = [
      new Section('1. 建物解体・撤去工'),
      new Section('2. 発生材処分費'),
      new Section('3. 運搬費'),
      new Section('4. 仮設・雑工・諸経費')
    ];
    this.discount = 0;
  }

  get baseTotal() {
    return this.sections.reduce((sum, sec) => sum + sec.subTotal, 0);
  }

  get constructionPrice() {
    return this.baseTotal + this.discount;
  }

  get taxAmount() {
    return calculateTax(this.constructionPrice);
  }

  get grandTotal() {
    return this.constructionPrice + this.taxAmount;
  }

  adjustToPrice(targetWithTax: number) {
    const targetBase = Math.ceil(targetWithTax / 1.10);
    const diff = targetBase - this.baseTotal;
    this.discount = diff;
  }

  // ★追加: データを丸ごと入れ替えるメソッド
  loadFromJSON(json: Record<string, unknown>) {
    try {
      // バリデーション（簡易）
      if (!json || typeof json !== 'object') throw new Error('Invalid JSON');

      this.customerName = String(json.customerName ?? '');
      this.title = String(json.title ?? '');
      this.place = String(json.place ?? '');
      this.date = String(json.date ?? '');
      this.discount = Number(json.discount) || 0;

      // セクションと明細行を再構築（ここが重要）
      if (Array.isArray(json.sections)) {
        this.sections = (json.sections as Record<string, unknown>[]).map((s) => Section.fromJSON(s));
      }
      
      console.log('✅ Data loaded successfully');
    } catch (e) {
      console.error('Failed to load JSON:', e);
      alert('データの読み込みに失敗しました。ファイル形式を確認してください。');
    }
  }

  // ★追加: 現在の状態をJSONとしてエクスポート用に取得
  toJSON() {
    // SvelteのProxyを外してPlain Objectにする
    return JSON.parse(JSON.stringify(this));
  }
}