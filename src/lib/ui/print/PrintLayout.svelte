<script lang="ts">
	import type { Estimate } from '$lib/core/models/Estimate.svelte';
	import type { TermSectionSchema } from '$lib/types/schema';
	import { formatMoney } from '$lib/core/utils/money';

	// Props definition
	let { estimate, isClassic = true }: { estimate: Estimate; isClassic?: boolean } = $props();

	// 電子印鑑の表示状態 (デフォルトOFF)
	let showSeal = $state(false);
	const defaultTerms: TermSectionSchema[] = [
		{
			title: '備考・条件',
			items: [
				'地中埋設物について：浄化槽、井戸、旧基礎、杭、埋設配管等が工事中に発見された場合は、別途協議の上、追加費用を申し受ける場合がございます。',
				'アスベストについて：事前調査に基づく対策費用を含みますが、隠蔽部より新たな石綿含有建材が発見された場合は別途協議となります。',
				'お客様支給品：工事に伴う散水用の水、および電気等のライフライン費用は御支給にてお願いいたします。',
				'残置物処分：屋内残置物（一般廃棄物）の処分費は、地域の許可業者への収集運搬・処分委託費としての計上です。',
				'支払条件：完了後、翌月末現金振込（または別途契約書による）',
				'有効期限：発行日より3ヶ月'
			]
		}
	];
	const terms = $derived(
		Array.isArray(estimate.terms) && estimate.terms.length > 0 ? estimate.terms : defaultTerms
	);

	// Bテーマ（固定）
	const A4_PRINT_TOKENS = {
		b: {
			paper: {
				width: '210mm',
				minHeight: '297mm',
				pagePadding: '15mm',
				pagePrintPadding: '15mm',
				headerColumns: 'minmax(0,1fr) minmax(0,240px)',
				headerGap: '6mm',
				totalWidth: '50%'
			},
			typography: {
				bodyFontSize: '9pt',
				bodyLineHeight: '1.4',
				customerName: '16pt',
				headingMeta: '9pt',
				companyTitle: '11pt',
				permitText: '8pt',
				permitTopSpacing: '0.3rem',
				noteText: '8pt',
				tableText: '9pt',
				sectionTitle: '9.5pt',
				docTitle: '22pt',
				notesTitle: '10pt',
				docTitleTracking: '0.4em',
				headerCustomerBottom: '0.4rem',
				amountValue: '22pt',
				amountLabel: '14pt',
				grandTotalFontSize: '10.5pt'
			},
			spacing: {
				tablePadH: '3px',
				tablePadV: '3px',
				headerGapY: '0.3rem',
				headerBottom: '6px',
				footerGap: '0.4rem',
				metaGap: '0.2rem',
				dateGap: '1px',
				headerMetaLeft: '2px',
				tablePadBase: '3px',
				tablePadRightName: '4px',
				tablePadRightAmount: '4px',
				rowSpacing: '1',
				sectionGap: '0.3rem',
				sectionBodyGap: '0.2rem',
				sectionPaddingBottom: '1',
				sectionHeadingPb: '2px',
				sectionHeadingPl: '4px',
				grandTotalPyOuter: '3mm',
				totalMarginBottom: '8',
				headerMb: '6mm',
				titlePb: '3mm',
				titleMb: '3mm',
				gridPb: '3mm',
				dateMb: '1mm',
				customerNamePb: '1mm',
				customerNamePr: '20mm',
				metaGridMt: '1mm',
				metaLabelW: '6rem',
				amountPx: '4mm',
				amountMb: '4mm',
				tableMb: '5mm',
				totalBlockMb: '8mm',
				totalRowPy: '1.5mm',
				totalAmountW: '35mm',
				totalAmountPr: '2mm',
				grandTotalPy: '2.5mm',
				notesPad: '6mm',
				notesListMl: '4mm',
				notesListGap: '1.5mm',
				subtotalCellPad: '1mm',
				subtotalAmountPr: '3mm'
			},
			table: {
				cols: {
					name: '28%',
					qty: '8%',
					unit: '7%',
					unitPrice: '13%',
					amount: '20%',
					note: '24%'
				}
			}
		}
	} as const;

	const tokens = A4_PRINT_TOKENS.b;
	let cssVars = $derived(`
    --a4-paper-width:${tokens.paper.width};
    --a4-paper-height:${tokens.paper.minHeight};
    --a4-paper-pad:${tokens.paper.pagePadding};
    --a4-paper-print-pad:${tokens.paper.pagePrintPadding};
    --a4-header-columns:${tokens.paper.headerColumns};
    --a4-header-gap:${tokens.paper.headerGap};
    --a4-total-width:${tokens.paper.totalWidth};
    --a4-font-body:${tokens.typography.bodyFontSize};
    --a4-lh-body:${tokens.typography.bodyLineHeight};
    --a4-font-customer:${tokens.typography.customerName};
    --a4-font-meta:${tokens.typography.headingMeta};
    --a4-font-company:${tokens.typography.companyTitle};
    --a4-font-permit:${tokens.typography.permitText};
    --a4-permit-pt:${tokens.typography.permitTopSpacing};
    --a4-font-note:${tokens.typography.noteText};
    --a4-font-table:${tokens.typography.tableText};
    --a4-font-doc-title:${tokens.typography.docTitle};
    --a4-font-notes-title:${tokens.typography.notesTitle};
    --a4-track-doc-title:${tokens.typography.docTitleTracking};
    --a4-customer-bottom:${tokens.typography.headerCustomerBottom};
    --a4-font-amount:${tokens.typography.amountValue};
    --a4-font-amount-label:${tokens.typography.amountLabel};
    --a4-font-grand-total:${tokens.typography.grandTotalFontSize};
    --a4-section-size:${tokens.typography.sectionTitle};
    --a4-pad-base:${tokens.spacing.tablePadBase};
    --a4-pad-h:${tokens.spacing.tablePadH};
    --a4-pad-v:${tokens.spacing.tablePadV};
    --a4-pad-right-name:${tokens.spacing.tablePadRightName};
    --a4-pad-right-amount:${tokens.spacing.tablePadRightAmount};
    --a4-meta-gap:${tokens.spacing.metaGap};
    --a4-date-gap:${tokens.spacing.dateGap};
    --a4-header-meta-left:${tokens.spacing.headerMetaLeft};
    --a4-section-heading-pb:${tokens.spacing.sectionHeadingPb};
    --a4-section-heading-pl:${tokens.spacing.sectionHeadingPl};
    --a4-grand-total-py-outer:${tokens.spacing.grandTotalPyOuter};
    --a4-section-gap:${tokens.spacing.sectionGap};
    --a4-section-body-gap:${tokens.spacing.sectionBodyGap};
    --a4-header-bottom:${tokens.spacing.headerBottom};
    --a4-footer-gap:${tokens.spacing.footerGap};
    --a4-row-spacing:${tokens.spacing.rowSpacing};
    --a4-section-pad-bottom:${tokens.spacing.sectionPaddingBottom};
    --a4-total-margin:${tokens.spacing.totalMarginBottom};
    --a4-header-mb:${tokens.spacing.headerMb};
    --a4-title-pb:${tokens.spacing.titlePb};
    --a4-title-mb:${tokens.spacing.titleMb};
    --a4-grid-pb:${tokens.spacing.gridPb};
    --a4-date-mb:${tokens.spacing.dateMb};
    --a4-customer-pb:${tokens.spacing.customerNamePb};
    --a4-customer-pr:${tokens.spacing.customerNamePr};
    --a4-meta-grid-mt:${tokens.spacing.metaGridMt};
    --a4-meta-label-w:${tokens.spacing.metaLabelW};
    --a4-amount-px:${tokens.spacing.amountPx};
    --a4-amount-mb:${tokens.spacing.amountMb};
    --a4-table-mb:${tokens.spacing.tableMb};
    --a4-total-block-mb:${tokens.spacing.totalBlockMb};
    --a4-total-row-py:${tokens.spacing.totalRowPy};
    --a4-total-amount-w:${tokens.spacing.totalAmountW};
    --a4-total-amount-pr:${tokens.spacing.totalAmountPr};
    --a4-grand-total-py:${tokens.spacing.grandTotalPy};
    --a4-notes-pad:${tokens.spacing.notesPad};
    --a4-notes-list-ml:${tokens.spacing.notesListMl};
    --a4-notes-list-gap:${tokens.spacing.notesListGap};
    --a4-subtotal-cell-pad:${tokens.spacing.subtotalCellPad};
    --a4-subtotal-amount-pr:${tokens.spacing.subtotalAmountPr};
    --a4-col-name:${tokens.table.cols.name};
    --a4-col-qty:${tokens.table.cols.qty};
    --a4-col-unit:${tokens.table.cols.unit};
    --a4-col-unitPrice:${tokens.table.cols.unitPrice};
    --a4-col-amount:${tokens.table.cols.amount};
    --a4-col-note:${tokens.table.cols.note};
  `);

	// =================================================================
	// スタイル定義 (Bテーマ固定)
	// =================================================================
	const baseStyle = 'font-ms-mincho text-black';
	const numFont = 'font-ms-mincho tabular-nums tracking-normal';
	const borderColor = 'border-black';
	const subBorderColor = 'border-black';
	const tableWrapper = 'border border-black';
	const cellBorder = 'border-r border-b border-black last:border-r-0';
	const headerStyle = 'bg-transparent border-b border-black font-bold font-ms-gothic';
	const totalLabelClass = 'font-ms-gothic font-bold opacity-90';
	const grandTotalLineLabelClass = 'pl-2 font-ms-gothic';
	const grandTotalStyle = 'border-2 border-black';

	let rootStyle = $derived(`
    ${cssVars};
    width: var(--a4-paper-width);
    min-height: var(--a4-paper-height);
    padding: var(--a4-paper-pad);
    margin: 0;
    box-sizing: border-box;
    font-family: var(--app-serif-font);
    font-size: var(--a4-font-body);
    line-height: var(--a4-lh-body);
  `);
	const themeClass = 'is-classic-estimate';
	const sectionHeadingClass = 'font-bold border-b border-black';
	const detailsHoverClass = '';
	const tableTextClass = '';
	const subtotalAccentClass = '';
	const docTitleClass = 'font-bold font-ms-gothic leading-none';
</script>

<!-- A4用紙設定 -->
<div
	class="group relative mx-auto overflow-visible bg-white shadow-lg {baseStyle} {themeClass}"
	style={rootStyle}
>
	<!-- ▼ 印刷プレビュー操作ボタン (画面上のみ表示) -->
	<div
		class="absolute top-2 right-2 z-50 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100 print:hidden"
	>
		<button
			class="font-ms-mincho rounded bg-gray-200 px-2 py-1 text-xs text-slate-800 hover:bg-gray-300"
			onclick={() => (showSeal = !showSeal)}
		>
			{showSeal ? '印影OFF' : '印影ON'}
		</button>
	</div>

	<!-- ========================================== -->
	<!-- ヘッダーエリア -->
	<!-- ========================================== -->
	<header style="margin-bottom: var(--a4-header-mb);">
		<!-- ① 御見積書タイトル（全幅・中央） -->
		<div
			class="border-b-2 text-center {borderColor}"
			style="padding-bottom: var(--a4-title-pb); margin-bottom: var(--a4-title-mb);"
		>
			<h2
				class="font-ms-gothic inline-block font-bold"
				style="font-size: var(--a4-font-doc-title); letter-spacing: var(--a4-track-doc-title); line-height: 1;"
			>
				御 見 積 書
			</h2>
		</div>

		<!-- ② 2カラム：宛名・工事情報 ／ 自社情報 -->
		<div
			class="grid items-start border-b-2 {borderColor}"
			style="grid-template-columns: minmax(0,1fr) minmax(0,240px); column-gap: 6mm; padding-bottom: var(--a4-grid-pb);"
		>
			<!-- 宛名・工事情報 -->
			<div class="min-w-0">
				<p style="font-size: var(--a4-font-meta); margin-bottom: var(--a4-date-mb);">
					{estimate.date}
				</p>
				<h1
					class="font-ms-gothic border-b font-bold {subBorderColor} inline-block"
					style="font-size: var(--a4-font-customer); margin-bottom: var(--a4-customer-bottom); padding-bottom: var(--a4-customer-pb); padding-right: var(--a4-customer-pr);"
				>
					{estimate.customerName}
					<span style="font-size: var(--a4-font-meta); font-weight: normal;">様</span>
				</h1>
				<div
					style="display:grid; gap: var(--a4-meta-gap); font-size: var(--a4-font-meta); margin-top: var(--a4-meta-grid-mt);"
				>
					<div class="flex items-start">
						<span
							class="shrink-0 opacity-70"
							style="width: var(--a4-meta-label-w); margin-left: var(--a4-header-meta-left);"
							>工事名称：</span
						>
						<span class="font-medium">{estimate.title}</span>
					</div>
					<div class="flex items-start">
						<span
							class="shrink-0 opacity-70"
							style="width: var(--a4-meta-label-w); margin-left: var(--a4-header-meta-left);"
							>工事場所：</span
						>
						<span class="w-full break-words">{estimate.place}</span>
					</div>
				</div>
			</div>

			<!-- 自社情報（右寄せ・上揃え） -->
			<div class="relative min-w-0 text-right">
				<div
					class="leading-tight"
					style="display:grid; gap: var(--a4-meta-gap); font-size: var(--a4-font-table);"
				>
					<p
						class="font-ms-gothic font-bold tracking-wide"
						style="font-size: var(--a4-font-company);"
					>
						西毛建設株式会社
					</p>
					<p>代表取締役　橳島　努</p>
					<p style="margin-top: var(--a4-meta-gap);">〒370-2601</p>
					<p class="leading-tight break-words whitespace-normal">
						群馬県甘楽郡下仁田町大字川井109-1
					</p>
					<p>TEL: 0274-82-3366 / FAX: 0274-82-3566</p>
					<!-- 建設業許可番号 -->
					<div
						class="border-t pt-1 {subBorderColor} leading-tight opacity-90"
						style="font-size: var(--a4-font-permit); margin-top: var(--a4-permit-pt);"
					>
						<p>群馬県許可（特・般）第2125号</p>
						<p>産業廃棄物収集運搬業許可 第1000006234号</p>
					</div>
				</div>

				<!-- 電子印鑑 -->
				{#if showSeal}
					<img
						src="/hanko.png"
						class="absolute right-0 bottom-0 z-10 w-16 opacity-80 mix-blend-multiply"
						alt="社印"
					/>
				{/if}
			</div>
		</div>
	</header>

	<!-- ========================================== -->
	<!-- 御見積金額 (強調表示) -->
	<!-- ========================================== -->
	<div
		class="{grandTotalStyle} flex items-center justify-between"
		style="margin-bottom: var(--a4-amount-mb); padding: var(--a4-grand-total-py-outer) var(--a4-amount-px);"
	>
		<span class={totalLabelClass} style="font-size: var(--a4-font-amount-label);"
			>御見積金額 (税込)</span
		>
		<span class="font-bold {numFont} tracking-tight" style="font-size: var(--a4-font-amount);">
			¥ {formatMoney(estimate.grandTotal)} -
		</span>
	</div>

	<!-- ========================================== -->
	<!-- 明細テーブル -->
	<!-- ========================================== -->
	<div class="w-full overflow-visible" style="margin-bottom: var(--a4-table-mb);">
		<table class="w-full min-w-full table-fixed border-collapse {tableTextClass} {tableWrapper}">
			<colgroup>
				<col style="width: var(--a4-col-name);" />
				<col style="width: var(--a4-col-qty);" />
				<col style="width: var(--a4-col-unit);" />
				<col style="width: var(--a4-col-unitPrice);" />
				<col style="width: var(--a4-col-amount);" />
				<col style="width: var(--a4-col-note);" />
			</colgroup>
			<thead>
				<tr class={headerStyle}>
					<th
						class="font-ms-gothic border-r border-black text-left"
						style="padding: var(--a4-pad-v) var(--a4-pad-h);font-size: var(--a4-font-table);"
						>工事名 / 摘要</th
					>
					<th
						class="font-ms-gothic border-r border-black text-center"
						style="padding: var(--a4-pad-v) var(--a4-pad-h);font-size: var(--a4-font-table);"
						>数量</th
					>
					<th
						class="font-ms-gothic border-r border-black text-center"
						style="padding: var(--a4-pad-v) var(--a4-pad-h);font-size: var(--a4-font-table);"
						>単位</th
					>
					<th
						class="font-ms-gothic border-r border-black text-right"
						style="padding: var(--a4-pad-v) var(--a4-pad-h);font-size: var(--a4-font-table);"
						>単価</th
					>
					<th
						class="font-ms-gothic border-r border-black text-right"
						style="padding: var(--a4-pad-v) var(--a4-pad-right-amount);font-size: var(--a4-font-table);"
						>金額</th
					>
					<th
						class="font-ms-gothic text-left"
						style="padding: var(--a4-pad-v) var(--a4-pad-h);font-size: var(--a4-font-table);"
						>備考</th
					>
				</tr>
			</thead>
			<tbody>
				{#each estimate.sections as section}
					<!-- セクションヘッダー -->
					{#if section.items.length > 0}
						<tr class="break-inside-avoid">
							<td
								colspan="6"
								class={sectionHeadingClass}
								style="padding-top: var(--a4-section-gap); padding-bottom: var(--a4-section-heading-pb); padding-left: var(--a4-section-heading-pl);"
							>
								<span class="font-ms-gothic" style="font-size: var(--a4-section-size);"
									>{section.title}</span
								>
							</td>
						</tr>
					{/if}

					<!-- 明細行 -->
					{#each section.items as item}
						<tr class="break-inside-avoid {detailsHoverClass}">
							<!-- 工事名 -->
							<td
								class="align-top {cellBorder}"
								style="padding: var(--a4-pad-v) var(--a4-pad-h); font-size: var(--a4-font-table);"
							>
								{item.name}
							</td>
							<!-- 数量 -->
							<td
								class="text-center align-top {numFont} {cellBorder}"
								style="padding: var(--a4-pad-v) var(--a4-pad-h);font-size: var(--a4-font-table);"
								>{item.quantity}</td
							>
							<!-- 単位 -->
							<td
								class="text-center align-top {numFont} {cellBorder}"
								style="padding: var(--a4-pad-v) var(--a4-pad-h);font-size: var(--a4-font-table);"
								>{item.unit}</td
							>
							<!-- 単価 -->
							<td
								class="text-right align-top {numFont} {cellBorder}"
								style="padding: var(--a4-pad-v) var(--a4-pad-h);font-size: var(--a4-font-table);"
								>{formatMoney(item.unitPrice)}</td
							>
							<!-- 金額 -->
							<td
								class="text-right align-top font-bold {numFont} border-r border-b border-black"
								style="padding: var(--a4-pad-v) var(--a4-pad-right-amount);font-size: var(--a4-font-table);"
							>
								{formatMoney(item.amount)}
							</td>
							<!-- 備考 -->
							<td
								class="border-b border-black align-top"
								style="padding: var(--a4-pad-v) var(--a4-pad-h); font-size: var(--a4-font-note); opacity: 0.8;"
							>
								{item.note}
							</td>
						</tr>
					{/each}

					<!-- セクション小計 -->
					{#if section.items.length > 0}
						<tr class="break-inside-avoid border-t border-b-2 border-black">
							<td colspan="3" class="border-r border-black"></td>
							<td
								class="font-ms-gothic border-r border-black text-center"
								style="padding: var(--a4-subtotal-cell-pad); font-size: var(--a4-font-note);"
								>小計</td
							>
							<td
								class="text-right font-bold {numFont} border-r border-b border-black opacity-90"
								style="padding: var(--a4-subtotal-cell-pad); padding-right: var(--a4-pad-right-amount);"
								>{formatMoney(section.subTotal)}</td
							>
							<td class="border-b border-black"></td>
						</tr>
					{/if}
				{/each}
			</tbody>
		</table>
	</div>

	<!-- ========================================== -->
	<!-- 合計計算ブロック (右寄せ・縦積み) -->
	<!-- ========================================== -->
	<div class="flex break-inside-avoid justify-end" style="margin-bottom: var(--a4-total-block-mb);">
		<!-- 役所風の場合、合計欄にも枠線を付ける -->
		<div
			class="border border-black"
			style="width: var(--a4-total-width); font-size: var(--a4-font-table);"
		>
			<!-- 税抜小計 -->
			<div
				class="flex justify-between border-b {subBorderColor}"
				style="padding-top: var(--a4-total-row-py); padding-bottom: var(--a4-total-row-py);"
			>
				<span class="font-ms-gothic flex-1 border-r border-black pl-2">税抜小計</span>
				<span
					class="text-right {numFont}"
					style="width: var(--a4-total-amount-w); padding-right: var(--a4-total-amount-pr);"
					>{formatMoney(estimate.baseTotal)}</span
				>
			</div>

			<!-- 値引き -->
			<div
				class="flex justify-between border-b border-black"
				style="padding-top: var(--a4-total-row-py); padding-bottom: var(--a4-total-row-py);"
			>
				<span class="font-ms-gothic flex-1 border-r border-black pl-2">出精値引き</span>
				<span
					class="text-right {numFont}"
					style="width: var(--a4-total-amount-w); padding-right: var(--a4-total-amount-pr);"
					>▲ {formatMoney(Math.abs(estimate.discount))}</span
				>
			</div>

			<!-- 工事価格 -->
			<div
				class="flex justify-between border-b {subBorderColor} font-bold"
				style="padding-top: var(--a4-total-row-py); padding-bottom: var(--a4-total-row-py);"
			>
				<span class="font-ms-gothic flex-1 border-r border-black pl-2">工事価格（税抜）</span>
				<span
					class="text-right {numFont}"
					style="width: var(--a4-total-amount-w); padding-right: var(--a4-total-amount-pr);"
					>{formatMoney(estimate.constructionPrice)}</span
				>
			</div>

			<!-- 消費税 -->
			<div
				class="flex justify-between border-b {borderColor} opacity-80"
				style="padding-top: var(--a4-total-row-py); padding-bottom: var(--a4-total-row-py);"
			>
				<span class="font-ms-gothic flex-1 border-r border-black pl-2">消費税 (10%)</span>
				<span
					class="text-right {numFont}"
					style="width: var(--a4-total-amount-w); padding-right: var(--a4-total-amount-pr);"
					>{formatMoney(estimate.taxAmount)}</span
				>
			</div>

			<!-- 合計欄：二重線で強調 -->
			<div
				class="flex justify-between border-b-4 border-double {borderColor} font-bold {subtotalAccentClass}"
				style="padding-top: var(--a4-grand-total-py); padding-bottom: var(--a4-grand-total-py); padding-left: 0; padding-right: 0;"
			>
				<span
					class="{grandTotalLineLabelClass} flex-1 border-r border-black"
					style="font-size: var(--a4-font-grand-total);">合計金額</span
				>
				<span
					class="text-right {numFont}"
					style="width: var(--a4-total-amount-w); padding-right: var(--a4-total-amount-pr); font-size: var(--a4-font-grand-total);"
					>¥ {formatMoney(estimate.grandTotal)}</span
				>
			</div>
		</div>
	</div>

	<!-- ========================================== -->
	<!-- 備考・条件 -->
	<!-- ========================================== -->
	<div
		class="break-inside-avoid border border-black"
		style="padding: var(--a4-notes-pad); font-size: var(--a4-font-note);"
	>
		{#each terms as term}
			<h3
				class="font-ms-gothic inline-block border-b border-black font-bold"
				style="font-size: var(--a4-font-notes-title); margin-bottom: var(--a4-meta-gap);"
			>
				【 {term.title} 】
			</h3>
			<ul
				class="list-outside list-disc leading-relaxed opacity-90"
				style="margin-left: var(--a4-notes-list-ml); row-gap: var(--a4-notes-list-gap); display: flex; flex-direction: column;"
			>
				{#each term.items as item}
					<li>{item}</li>
				{/each}
			</ul>
		{/each}
	</div>
</div>
