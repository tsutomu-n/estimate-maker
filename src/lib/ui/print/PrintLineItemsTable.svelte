<script lang="ts">
	import type { Estimate } from '$lib/core/models/Estimate.svelte';
	import { PRINT_TEXT } from './print-copy';
	import { formatMoney } from '$lib/core/utils/money';

	let {
		estimate,
		headers = [...PRINT_TEXT.table.headers],
		sectionHeadingClass = 'font-bold border-b border-black',
		cellBorder = 'border-r border-b border-black last:border-r-0',
		detailsHoverClass = '',
		numFont = 'font-ms-mincho tabular-nums tracking-normal',
		tableTextClass = '',
		tableWrapper = 'border border-black',
	}: {
		estimate: Estimate;
		headers?: string[];
		sectionHeadingClass?: string;
		cellBorder?: string;
		detailsHoverClass?: string;
		numFont?: string;
		tableTextClass?: string;
		tableWrapper?: string;
	} = $props();
</script>

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
			<tr class="bg-transparent border-b border-black font-bold font-ms-gothic">
				<th class="font-ms-gothic border-r border-black text-left" style="padding: var(--a4-pad-v) var(--a4-pad-h);font-size: var(--a4-font-table);">{headers[0]}</th>
				<th class="font-ms-gothic border-r border-black text-center" style="padding: var(--a4-pad-v) var(--a4-pad-h);font-size: var(--a4-font-table);">{headers[1]}</th>
				<th class="font-ms-gothic border-r border-black text-center" style="padding: var(--a4-pad-v) var(--a4-pad-h);font-size: var(--a4-font-table);">{headers[2]}</th>
				<th class="font-ms-gothic border-r border-black text-right" style="padding: var(--a4-pad-v) var(--a4-pad-h);font-size: var(--a4-font-table);">{headers[3]}</th>
				<th class="font-ms-gothic border-r border-black text-right" style="padding: var(--a4-pad-v) var(--a4-pad-right-amount);font-size: var(--a4-font-table);">{headers[4]}</th>
				<th class="font-ms-gothic text-left" style="padding: var(--a4-pad-v) var(--a4-pad-h);font-size: var(--a4-font-table);">{headers[5]}</th>
			</tr>
		</thead>
		<tbody>
			{#each estimate.sections as section}
				{#if section.items.length > 0}
					<tr class="break-inside-avoid">
						<td
							colspan="6"
							class={sectionHeadingClass}
							style="padding-top: calc(var(--a4-section-gap) + var(--a4-section-heading-py)); padding-bottom: var(--a4-section-heading-pb); padding-left: var(--a4-section-heading-pl);"
						>
						<span
							class="font-ms-gothic"
							style="font-size: var(--a4-section-size); line-height: var(--a4-section-line-height);"
							>{section.title}</span
						>
					</td>
					</tr>
				{/if}

				{#each section.items as item}
					<tr class="break-inside-avoid {detailsHoverClass}">
						<td class="align-top {cellBorder}" style="padding: var(--a4-pad-v) var(--a4-pad-h); font-size: var(--a4-font-table);">{item.name}</td>
						<td class="text-center align-top {numFont} {cellBorder}" style="padding: var(--a4-pad-v) var(--a4-pad-h);font-size: var(--a4-font-table);">{item.quantity}</td>
						<td class="text-center align-top {numFont} {cellBorder}" style="padding: var(--a4-pad-v) var(--a4-pad-h);font-size: var(--a4-font-table);">{item.unit}</td>
						<td class="text-right align-top {numFont} {cellBorder}" style="padding: var(--a4-pad-v) var(--a4-pad-h);font-size: var(--a4-font-table);">{formatMoney(item.unitPrice)}</td>
						<td class="text-right align-top font-bold {numFont} border-r border-b border-black" style="padding: var(--a4-pad-v) var(--a4-pad-right-amount);font-size: var(--a4-font-table);">{formatMoney(item.amount)}</td>
						<td class="border-b border-black align-top" style="padding: var(--a4-pad-v) var(--a4-pad-h); font-size: var(--a4-font-note); opacity: 0.8;">{item.note}</td>
					</tr>
				{/each}

				{#if section.items.length > 0}
					<tr class="break-inside-avoid border-t border-b-2 border-black">
						<td colspan="3" class="border-r border-black"></td>
						<td class="font-ms-gothic border-r border-black text-center" style="padding: var(--a4-subtotal-cell-pad); font-size: var(--a4-font-note);">
							{PRINT_TEXT.table.subtotalLabel}
						</td>
						<td class="text-right font-bold {numFont} border-r border-b border-black opacity-90" style="padding: var(--a4-subtotal-cell-pad); padding-right: var(--a4-pad-right-amount);">{formatMoney(section.subTotal)}</td>
						<td class="border-b border-black"></td>
					</tr>
				{/if}
			{/each}
		</tbody>
	</table>
</div>
