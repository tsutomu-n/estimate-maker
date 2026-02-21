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
	class="grid grid-cols-[5fr_2fr_1fr_2fr_2fr_auto] items-center gap-2 border-b border-slate-100 py-1.5 text-sm transition-colors last:border-0 hover:bg-slate-50"
>
	<div>
		<label for={`${rowIdBase}-name`} class="sr-only">品名・摘要</label>
		<input
			id={`${rowIdBase}-name`}
			type="text"
			class="h-9 w-full rounded-md border border-slate-300 px-2 outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500"
			placeholder="品名 / 摘要"
			bind:value={props.item.name}
		/>
		<label for={`${rowIdBase}-note`} class="sr-only">備考</label>
		<input
			id={`${rowIdBase}-note`}
			type="text"
			class="font-ms-gothic mt-1 h-7 w-full rounded border border-transparent bg-transparent px-1 text-xs tracking-[0.03em] text-slate-500 focus-visible:border-slate-200 focus-visible:bg-white focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:outline-none"
			placeholder="備考 (任意)"
			bind:value={props.item.note}
		/>
	</div>

	<div>
		<label for={`${rowIdBase}-quantity`} class="sr-only">数量</label>
		<input
			id={`${rowIdBase}-quantity`}
			type="number"
			inputmode="decimal"
			min="0"
			step="0.1"
			class="h-9 w-full rounded-md border border-slate-300 px-2 text-right outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500"
			bind:value={props.item.quantity}
		/>
	</div>

	<div>
		<label for={`${rowIdBase}-unit`} class="sr-only">単位</label>
		<input
			id={`${rowIdBase}-unit`}
			type="text"
			list={`${rowIdBase}-unit-options`}
			class="font-ms-gothic h-9 w-full rounded-md border border-slate-300 px-2 text-center outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500"
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

	<div>
		<label for={`${rowIdBase}-unit-price`} class="sr-only">単価</label>
		<input
			id={`${rowIdBase}-unit-price`}
			type="number"
			inputmode="decimal"
			class="h-9 w-full rounded-md border border-slate-300 px-2 text-right outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500"
			bind:value={props.item.unitPrice}
		/>
	</div>

	<div class="text-right">
		<output class="font-ms-gothic text-slate-700 tabular-nums" aria-live="polite" aria-atomic="true"
			>¥ {formatMoney(props.item.amount)}</output
		>
	</div>

	<div class="flex justify-center">
		<button
			type="button"
			class="rounded p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-500 focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none"
			onclick={props.onRemove}
			aria-label={`明細行 ${props.itemIndex + 1} を削除`}
			title="行を削除"
		>
			<span aria-hidden="true">✕</span>
		</button>
	</div>
</div>
