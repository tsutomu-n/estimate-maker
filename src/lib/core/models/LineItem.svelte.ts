import { roundPrice } from '../utils/money';

export class LineItem {
  name = $state('');
  quantity = $state(0);
  unit = $state('式');
  unitPrice = $state(0);
  note = $state('');

  constructor(name = '', quantity = 1, unit = '式', unitPrice = 0, note = '') {
    this.name = name;
    this.quantity = quantity;
    this.unit = unit;
    this.unitPrice = unitPrice;
    this.note = note;
  }

  get amount() {
    return roundPrice(this.quantity * this.unitPrice);
  }

  // ★追加: JSONオブジェクトからインスタンスを生成する静的メソッド
  static fromJSON(json: Record<string, unknown>): LineItem {
    return new LineItem(
      String(json.name ?? ''),
      Number(json.quantity) || 0,
      String(json.unit ?? '式'),
      Number(json.unitPrice) || 0,
      String(json.note ?? '')
    );
  }
}