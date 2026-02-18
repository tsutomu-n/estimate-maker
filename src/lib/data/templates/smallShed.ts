import type { EstimateSchema } from '$lib/types/schema';

// 小屋解体（標準プラン・15cm基礎）のテンプレートデータ
export const SMALL_SHED_TEMPLATE: EstimateSchema = {
	version: '1.0.0',
	createdAt: new Date().toISOString(),
	customerName: '',
	title: '木造倉庫 解体撤去工事',
	place: '',
	date: '',
	discount: 0,
	sections: [
		{
			title: '1. 建物解体・撤去工',
			items: [
				{
					name: '木造倉庫 解体撤去費',
					quantity: 5.2,
					unit: '坪',
					unitPrice: 20000,
					note: '屋根トタン・内装材共'
				},
				{
					name: '基礎コンクリート撤去費',
					quantity: 1,
					unit: '式',
					unitPrice: 30000,
					note: '※厚さ15cm以内 標準基礎'
				}
			]
		},
		{
			title: '2. 発生材運搬・処分費',
			items: [
				{
					name: '産業廃棄物 運搬処分費',
					quantity: 1,
					unit: '式',
					unitPrice: 55000,
					note: '木くず・コンガラ・廃プラ'
				},
				{
					name: '一般廃棄物 収集運搬費',
					quantity: 0,
					unit: '式',
					unitPrice: 0,
					note: '※お客様ご自身での処分'
				}
			]
		},
		{
			title: '3. 諸経費・他',
			items: [
				{
					name: '重機回送・車両損料',
					quantity: 1,
					unit: '式',
					unitPrice: 12000,
					note: 'ミニユンボ・ダンプ'
				},
				{
					name: '現場管理費・事務通信費',
					quantity: 1,
					unit: '式',
					unitPrice: 9000,
					note: '諸届出・安全管理'
				}
			]
		}
	]
};
