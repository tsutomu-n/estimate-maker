<script lang="ts">
	import type { Section } from '$lib/core/models/Section.svelte';
	import { formatMoney } from '$lib/core/utils/money';
	import LineItemRow from './LineItemRow.svelte';

	let props = $props<{ section: Section; sectionIndex: number }>();

	const titleId = $derived.by(() => `section-${props.sectionIndex}-title`);
</script>

<section
	class="mb-4 overflow-hidden rounded-lg border border-slate-200 bg-white"
	aria-labelledby={titleId}
>
	<header
		class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5"
	>
		<div class="flex min-w-0 items-center gap-3">
			<label class="sr-only" for={titleId}>セクション名</label>
			<input
				id={titleId}
				class="font-ms-gothic w-full max-w-md min-w-0 rounded border border-transparent bg-transparent px-1 py-0.5 text-sm font-bold tracking-[0.04em] text-slate-700 outline-none focus-visible:border-slate-300 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-blue-500"
				bind:value={props.section.title}
			/>
		</div>
		<p class="font-ms-gothic text-sm font-bold tracking-[0.04em] text-slate-700">
			小計: ¥ {formatMoney(props.section.subTotal)}
		</p>
	</header>

	<div class="p-2">
		<div class="mb-1 grid grid-cols-[5fr_2fr_1fr_2fr_2fr_auto] gap-2 px-1 text-xs text-slate-500">
			<div>品名・備考</div>
			<div class="text-right">数量</div>
			<div class="text-center">単位</div>
			<div class="text-right">単価</div>
			<div class="text-right">金額</div>
			<div class="w-7"></div>
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
			class="mt-2 flex h-9 w-full items-center justify-center gap-1 rounded-md border border-dashed border-blue-300 bg-blue-50/40 text-sm text-blue-700 transition hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
			onclick={() => props.section.addItem()}
			aria-label={`セクション ${props.sectionIndex + 1} に行を追加`}
		>
			<span>＋</span>
			<span>行を追加</span>
		</button>
	</div>
</section>
