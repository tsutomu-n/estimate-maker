export const PRINT_TEXT = {
	docTitle: '御 見 積 書',
	customerSuffix: '様',
	fieldDateSuffix: ' (税込)',
	headerCompanyName: '西毛建設株式会社',
	headerRepresentative: '代表取締役　橳島　努',
	zipCodeLabel: '〒370-2606',
	address: '群馬県甘楽郡下仁田町大字川井109-1',
	telFax: 'TEL: 0274-82-3366 / FAX: 0274-82-3566',
	permits: [
		'群馬県許可（特・般）第2125号',
		'産業廃棄物収集運搬業許可 第1000006234号'
	],
	metaLabels: {
		workTitle: '工事名称：',
		workPlace: '工事場所：'
	},
	table: {
		headers: ['工事名 / 摘要', '数量', '単位', '単価', '金額', '備考'],
		subtotalLabel: '小計',
		sectionTotalsLabel: '小計'
	},
	totals: {
		grandTotal: '御見積金額 (税込)',
		taxableSubTotal: '税抜小計',
		discount: '出精値引き',
		constructionPrice: '工事価格（税抜）',
		tax: '消費税 (10%)',
		grandTotalLabel: '合計金額',
		discountPrefix: '▲'
	},
	termsTitleDefault: '備考・条件'
} as const;

export const DEFAULT_TERMS: Array<{ title: string; items: string[] }> = [
	{
		title: PRINT_TEXT.termsTitleDefault,
		items: [
			'地中埋設物について：浄化槽、井戸、旧基礎、杭、埋設配管等が工事中に発見された場合は、別途協議の上、追加費用を申し受ける場合がございます。',
			'アスベストについて：事前調査に基づく対策費用を含みますが、隠蔽部より新たな石綿含有建材が発見された場合は別途協議となります。',
			'お客様支給品：工事に伴う散水用の水、および電気等のライフライン費用は御支給にてお願いいたします。',
			'残置物処分：屋内残置物（一般廃棄物）の処分費は、地域の許可業者への収集運搬・処分委託費としての計上です。',
			'支払条件：完了後、翌月末現金振込（または別途契約書による）',
			'有効期限：発行日より3ヶ月'
		]
	}
] as const;
