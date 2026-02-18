import { LineItem } from './LineItem.svelte';

export class Section {
  title = $state('');
  items = $state<LineItem[]>([]);

  constructor(title: string, items: LineItem[] = []) {
    this.title = title;
    this.items = items;
  }

  get subTotal() {
    return this.items.reduce((sum, item) => sum + item.amount, 0);
  }

  addItem(name = '', price = 0) {
    this.items.push(new LineItem(name, 1, '式', price));
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
  }

  // ★追加: JSONから復元
  static fromJSON(json: Record<string, unknown>): Section {
    const items = Array.isArray(json.items) 
      ? (json.items as Record<string, unknown>[]).map((i) => LineItem.fromJSON(i)) 
      : [];
    return new Section(String(json.title ?? '無題のセクション'), items);
  }
}