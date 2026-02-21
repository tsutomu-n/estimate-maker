<script lang="ts">
	import type { Estimate } from '$lib/core/models/Estimate.svelte';
	import { formatMoney } from '$lib/core/utils/money';
	import { PRINT_TEXT } from './print-copy';

	let {
		estimate,
		borderColor = 'border-black',
		subBorderColor = 'border-black',
		numFont = 'font-ms-mincho tabular-nums tracking-normal',
		grandTotalLineLabelClass = 'pl-2 font-ms-gothic',
		subtotalAccentClass = ''
	}: {
		estimate: Estimate;
		borderColor?: string;
		subBorderColor?: string;
		numFont?: string;
		grandTotalLineLabelClass?: string;
		subtotalAccentClass?: string;
	} = $props();
</script>

<div
	class="flex break-inside-avoid justify-end"
	data-print-block="totals"
	style="margin-bottom: var(--a4-total-block-mb);"
>
	<!-- 役所風の場合、合計欄にも枠線を付ける -->
	<div class="border border-black" style="width: var(--a4-total-width); font-size: var(--a4-font-table);">
		<!-- 税抜小計 -->
		<div
			class="flex justify-between border-b {subBorderColor}"
			style="padding-top: var(--a4-total-row-py); padding-bottom: var(--a4-total-row-py);"
		>
			<span class="font-ms-gothic flex-1 border-r border-black pl-2">{PRINT_TEXT.totals.taxableSubTotal}</span>
			<span
				class="text-right {numFont}"
				style="width: var(--a4-total-amount-w); padding-right: var(--a4-total-amount-pr);"
				>¥ {formatMoney(estimate.baseTotal)}</span
			>
		</div>

		<!-- 値引き -->
		<div
			class="flex justify-between border-b border-black"
			style="padding-top: var(--a4-total-row-py); padding-bottom: var(--a4-total-row-py);"
		>
			<span class="font-ms-gothic flex-1 border-r border-black pl-2">{PRINT_TEXT.totals.discount}</span>
			<span
				class="text-right {numFont}"
				style="width: var(--a4-total-amount-w); padding-right: var(--a4-total-amount-pr);"
				>{PRINT_TEXT.totals.discountPrefix} {formatMoney(Math.abs(estimate.discount))}</span
			>
		</div>

		<!-- 工事価格 -->
		<div
			class="flex justify-between border-b {subBorderColor} font-bold"
			style="padding-top: var(--a4-total-row-py); padding-bottom: var(--a4-total-row-py);"
		>
			<span class="font-ms-gothic flex-1 border-r border-black pl-2">{PRINT_TEXT.totals.constructionPrice}</span>
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
			<span class="font-ms-gothic flex-1 border-r border-black pl-2">{PRINT_TEXT.totals.tax}</span>
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
				style="font-size: var(--a4-font-grand-total);">{PRINT_TEXT.totals.grandTotalLabel}</span
			>
			<span
				class="text-right {numFont}"
				style="width: var(--a4-total-amount-w); padding-right: var(--a4-total-amount-pr); font-size: var(--a4-font-grand-total);"
				>¥ {formatMoney(estimate.grandTotal)}</span
			>
		</div>
	</div>
</div>
