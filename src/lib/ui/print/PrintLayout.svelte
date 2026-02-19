<script lang="ts">
	import type { Estimate } from '$lib/core/models/Estimate.svelte';
	import { formatMoney } from '$lib/core/utils/money';
	import { resolvePrintTokens } from './print-theme';
	import { DEFAULT_TERMS, PRINT_TEXT } from './print-copy';
	import PrintHeader from './PrintHeader.svelte';
	import PrintLineItemsTable from './PrintLineItemsTable.svelte';
	import PrintTotals from './PrintTotals.svelte';
	import PrintTerms from './PrintTerms.svelte';

	// Props definition
	let { estimate }: { estimate: Estimate } = $props();

	// 電子印鑑の表示状態 (デフォルトOFF)
	let showSeal = $state(false);
	const terms = $derived(
		Array.isArray(estimate.terms) && estimate.terms.length > 0 ? estimate.terms : DEFAULT_TERMS
	);

	// Bテーマ（固定）
	const tokens = resolvePrintTokens('b');
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
    --a4-section-line-height:${tokens.typography.sectionTitleLineHeight};
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
    --a4-section-heading-py:${tokens.spacing.sectionHeadingPy};
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
	const totalLabelClass = 'font-ms-gothic font-bold opacity-90';
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

	<PrintHeader
		{estimate}
		{showSeal}
		{borderColor}
		{subBorderColor}
	/>

	<!-- ========================================== -->
	<!-- 御見積金額 (強調表示) -->
	<!-- ========================================== -->
	<div
		class="{grandTotalStyle} flex items-center justify-between"
		style="margin-bottom: var(--a4-amount-mb); padding: var(--a4-grand-total-py-outer) var(--a4-amount-px);"
	>
		<span class={totalLabelClass} style="font-size: var(--a4-font-amount-label);"
				>{PRINT_TEXT.totals.grandTotal}</span
		>
		<span class="font-bold {numFont} tracking-tight" style="font-size: var(--a4-font-amount);">
			¥ {formatMoney(estimate.grandTotal)} -
		</span>
	</div>

	<PrintLineItemsTable
		{estimate}
		{sectionHeadingClass}
		{cellBorder}
		{detailsHoverClass}
		{numFont}
		{tableTextClass}
		{tableWrapper}
	/>

	<PrintTotals
		{estimate}
		{borderColor}
		{subBorderColor}
		{numFont}
		{subtotalAccentClass}
	/>

	<!-- ========================================== -->
	<!-- 備考・条件 -->
	<!-- ========================================== -->
	<PrintTerms terms={terms} />
</div>
