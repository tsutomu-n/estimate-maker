<script lang="ts">
	import type { Section } from '$lib/core/models/Section.svelte';
	import { formatMoney } from '$lib/core/utils/money';
	import LineItemRow from './LineItemRow.svelte';

	let props = $props<{ section: Section; sectionIndex: number }>();

	const titleId = $derived.by(() => `section-${props.sectionIndex}-title`);
</script>

<section
	class="mb-4 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
	aria-labelledby={titleId}
>
	<header
		class="flex flex-wrap justify-between gap-2 border-b border-slate-200 bg-slate-100 px-4 py-2"
	>
		<div class="flex min-w-0 items-center gap-3">
			<label class="sr-only" for={titleId}>セクション名</label>
			<input
				id={titleId}
				class="font-ms-gothic w-full max-w-md min-w-0 border-none bg-transparent text-sm font-bold tracking-[0.04em] text-slate-700 focus:ring-0"
				bind:value={props.section.title}
			/>
		</div>
		<p class="font-ms-gothic text-sm font-bold tracking-[0.04em] text-blue-900">
			小計: ¥ {formatMoney(props.section.subTotal)}
		</p>
	</header>

	<div class="p-2">
		<div class="mb-1 grid grid-cols-12 gap-2 px-1 text-xs text-slate-500">
			<div class="col-span-5">品名・備考</div>
			<div class="col-span-2 text-right">数量</div>
			<div class="col-span-1 text-center">単位</div>
			<div class="col-span-2 text-right">単価</div>
			<div class="col-span-2">金額</div>
		</div>

		{#each props.section.items as item, itemIndex}
			<LineItemRow
				{item}
				sectionIndex={props.sectionIndex}
				{itemIndex}
				onRemove={() => props.section.removeItem(itemIndex)}
			/>
		{/each}

		<button
			type="button"
			class="mt-2 flex w-full items-center justify-center gap-1 rounded border border-dashed border-blue-300 py-1 text-sm text-blue-600 transition hover:bg-blue-50"
			onclick={() => props.section.addItem()}
			aria-label={`セクション ${props.sectionIndex + 1} に行を追加`}
		>
			<span>＋</span>
			<span>行を追加</span>
		</button>
	</div>
</section>
