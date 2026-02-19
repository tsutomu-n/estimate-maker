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
    const quantity = Number(json.quantity);
    const parsedQuantity = Number.isFinite(quantity) ? quantity : 0;

    let unitPrice = Number(json.unitPrice);
    if (!Number.isFinite(unitPrice)) {
      unitPrice = Number(json.unitPriceExclTax);
    }
    if (!Number.isFinite(unitPrice)) {
      const amount = Number(json.amountExclTax);
      if (Number.isFinite(amount)) {
        unitPrice = Number.isFinite(parsedQuantity) && parsedQuantity !== 0
          ? amount / parsedQuantity
          : amount;
      }
    }

    return new LineItem(
      String(json.name ?? ''),
      parsedQuantity,
      String(json.unit ?? '式'),
      Number.isFinite(unitPrice) ? unitPrice : 0,
      String(json.note ?? '')
    );
  }
}
