<script lang="ts">
import type { Estimate } from '$lib/core/models/Estimate.svelte';
import { tick } from 'svelte';
import { formatMoney } from '$lib/core/utils/money';
import { resolvePrintTokens } from './print-theme';
import { PRINT_TEXT } from './print-copy';
	import PrintHeader from './PrintHeader.svelte';
	import PrintLineItemsTable from './PrintLineItemsTable.svelte';
	import PrintTotals from './PrintTotals.svelte';
	import PrintTerms from './PrintTerms.svelte';

	export type A4PreviewPlan = {
		totalPages: number;
		sections: { title: string; startPage: number; endPage: number }[];
		totalsPage: number | null;
		termsPage: number | null;
		headerPage: number | null;
		warning: string | null;
	};

	// Props definition
	let {
		estimate,
		fitMode = 'fit',
		onA4PlanChange,
		showSeal = false
	}: {
		estimate: Estimate;
		fitMode?: 'fit' | 'a4';
		onA4PlanChange?: (plan: A4PreviewPlan) => void;
		showSeal?: boolean;
	} = $props();

	// 電子印鑑の表示状態 (デフォルトOFF)
	const terms = $derived(Array.isArray(estimate.terms) ? estimate.terms : []);

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
    --a4-font-representative:${tokens.typography.representative};
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
	let pxPerMm = $state(0);
	let previewRoot = $state<HTMLElement | null>(null);
	let a4Plan = $state<A4PreviewPlan>({
		totalPages: 0,
		sections: [],
		totalsPage: null,
		termsPage: null,
		headerPage: null,
		warning: null
	});
	const contentWidth = $derived(fitMode === 'a4' ? 'var(--a4-paper-width)' : '100%');
	const a4Deps = $derived(
		estimate.sections.length +
			estimate.baseTotal +
			estimate.grandTotal +
			(estimate.terms?.length ?? 0)
	);

	function toPxFromMm(mm: number) {
		if (typeof window === 'undefined') return 0;
		if (pxPerMm > 0) {
			return pxPerMm * mm;
		}
		const test = document.createElement('div');
		test.style.position = 'absolute';
		test.style.left = '-99999px';
		test.style.top = '-99999px';
		test.style.width = `${mm}mm`;
		test.style.height = '1px';
		document.body.appendChild(test);
		const px = Math.max(0.1, test.getBoundingClientRect().width / mm);
		document.body.removeChild(test);
		pxPerMm = px;
		return pxPerMm * mm;
	}

	async function updateA4PagePlan() {
		if (fitMode !== 'a4' || !previewRoot) {
			a4Plan = {
				totalPages: 0,
				sections: [],
				totalsPage: null,
				termsPage: null,
				headerPage: null,
				warning: null
			};
			return;
		}

		await tick();
		const blocks = [...previewRoot.querySelectorAll<HTMLElement>('[data-print-block]')];
		if (blocks.length === 0) return;

		const pxPerMm = toPxFromMm(1);
		const pageHeightPx = 297 * pxPerMm;
		const rootTop = previewRoot.getBoundingClientRect().top;

		const sectionMap = new Map<
			string,
			{
				title: string;
				startPage: number;
				endPage: number;
			}
		>();

		let maxPage = 1;
		let totalsPage: number | null = null;
		let termsPage: number | null = null;
		let headerPage: number | null = null;

		for (const block of blocks) {
			const kind = block.dataset.printBlock;
			const sectionTitle = block.dataset.sectionTitle || '';
			const rect = block.getBoundingClientRect();
			const top = rect.top - rootTop;
			const bottom = Math.max(top + rect.height, top);
			const startPage = Math.max(1, Math.floor(top / pageHeightPx) + 1);
			const endPage = Math.max(1, Math.floor((bottom - 0.01) / pageHeightPx) + 1);
			maxPage = Math.max(maxPage, endPage);

			if (kind === 'header') {
				headerPage = startPage;
			}

			if (kind === 'totals') {
				totalsPage = startPage;
			}

			if (kind === 'terms') {
				termsPage = startPage;
			}

			if (sectionTitle && (kind === 'section-title' || kind === 'line-item' || kind === 'section-subtotal')) {
				const prev = sectionMap.get(sectionTitle);
				if (!prev) {
					sectionMap.set(sectionTitle, { title: sectionTitle, startPage, endPage });
				} else {
					prev.endPage = Math.max(prev.endPage, endPage);
				}
			}
		}

		const sections = [...sectionMap.values()];

		a4Plan = {
			totalPages: maxPage,
			sections,
			totalsPage,
			termsPage,
			headerPage,
			warning: maxPage > 10 ? 'A4実寸は10枚上限を超える可能性があります。内容を圧縮してください。' : null
		};
	}

	$effect(() => {
		if (fitMode === 'a4' && previewRoot && a4Deps >= 0) {
			updateA4PagePlan();
		}
	});

	$effect(() => {
		if (fitMode !== 'a4') {
			a4Plan = {
				totalPages: 0,
				sections: [],
				totalsPage: null,
				termsPage: null,
				headerPage: null,
				warning: null
			};
		}
	});

	$effect(() => {
		onA4PlanChange?.(a4Plan);
	});

	let rootStyle = $derived(`
    ${cssVars};
    width: ${contentWidth};
    height: auto;
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
	bind:this={previewRoot}
	class="group relative mx-auto overflow-visible bg-white shadow-lg {baseStyle} {themeClass}"
	style={rootStyle}
>
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
	<!-- 備考・条件（特約/備考がある場合のみ） -->
	<!-- ========================================== -->
	{#if terms.length > 0}
		<PrintTerms terms={terms} />
	{/if}
</div>
