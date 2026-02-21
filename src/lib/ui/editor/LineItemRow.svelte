<script lang="ts">
	import type { LineItem } from '$lib/core/models/LineItem.svelte';
	import { formatMoney } from '$lib/core/utils/money';

	let props = $props<{
		item: LineItem;
		onRemove: () => void;
		sectionIndex: number;
		itemIndex: number;
	}>();

	const rowIdBase = $derived.by(() => `section-${props.sectionIndex}-item-${props.itemIndex}`);
</script>

<div
	class="grid grid-cols-12 items-center gap-2 border-b border-slate-100 py-1 text-sm transition-colors last:border-0 hover:bg-slate-50"
>
	<div class="col-span-5">
		<label for={`${rowIdBase}-name`} class="sr-only">品名・摘要</label>
		<input
			id={`${rowIdBase}-name`}
			type="text"
			class="w-full rounded border border-slate-300 p-1 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
			placeholder="品名 / 摘要"
			bind:value={props.item.name}
		/>
		<label for={`${rowIdBase}-note`} class="sr-only">備考</label>
		<input
			id={`${rowIdBase}-note`}
			type="text"
			class="font-ms-gothic mt-1 w-full border-none bg-transparent p-0.5 text-xs tracking-[0.03em] text-slate-500 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
			placeholder="備考 (任意)"
			bind:value={props.item.note}
		/>
	</div>

	<div class="col-span-2">
		<label for={`${rowIdBase}-quantity`} class="sr-only">数量</label>
		<input
			id={`${rowIdBase}-quantity`}
			type="number"
			inputmode="decimal"
			min="0"
			step="0.1"
			class="w-full rounded border border-slate-300 p-1 text-right outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
			bind:value={props.item.quantity}
		/>
	</div>

	<div class="col-span-1">
		<label for={`${rowIdBase}-unit`} class="sr-only">単位</label>
		<input
			id={`${rowIdBase}-unit`}
			type="text"
			list={`${rowIdBase}-unit-options`}
			class="font-ms-gothic w-full rounded border border-slate-300 p-1 text-center outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
			bind:value={props.item.unit}
		/>
		<datalist id={`${rowIdBase}-unit-options`}>
			<option value="式"></option>
			<option value="坪"></option>
			<option value="m3"></option>
			<option value="m2"></option>
			<option value="台"></option>
			<option value="枚"></option>
		</datalist>
	</div>

	<div class="col-span-2">
		<label for={`${rowIdBase}-unit-price`} class="sr-only">単価</label>
		<input
			id={`${rowIdBase}-unit-price`}
			type="number"
			inputmode="decimal"
			class="w-full rounded border border-slate-300 p-1 text-right outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
			bind:value={props.item.unitPrice}
		/>
	</div>

	<div class="col-span-2 flex items-center justify-between pl-1">
		<output class="font-ms-gothic text-slate-700" aria-live="polite" aria-atomic="true"
			>¥ {formatMoney(props.item.amount)}</output
		>
		<button
			type="button"
			class="rounded p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
			onclick={props.onRemove}
			aria-label={`明細行 ${props.itemIndex + 1} を削除`}
			title="行を削除"
		>
			<span aria-hidden="true">✕</span>
		</button>
	</div>
</div>
