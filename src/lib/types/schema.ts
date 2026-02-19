// 保存されるJSONファイルの構造定義

export interface EstimateSchema {
  // メタデータ
  version: string;      // 将来の仕様変更に備える (例: "1.0.0")
  createdAt: string;    // ISO8601 string
  
  // 基本情報
  customerName: string;
  title: string;
  place: string;
  date: string;
  
  // 明細データ (階層構造)
  sections: SectionSchema[];
  terms?: TermSectionSchema[]; // 特約・備考（任意）
  
  // 調整値
  discount: number;     // 出精値引き
}

export interface TermSectionSchema {
  title: string;
  items: string[];
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
