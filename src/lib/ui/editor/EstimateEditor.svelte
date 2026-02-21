<script lang="ts">
	import type { Estimate } from '$lib/core/models/Estimate.svelte';
	import SectionRow from './SectionRow.svelte';

	let { estimate, hasAnyLineItems = false }: { estimate: Estimate; hasAnyLineItems?: boolean } =
		$props();

	const ids = {
		customerName: 'estimate-customer-name',
		date: 'estimate-date',
		title: 'estimate-title',
		place: 'estimate-place'
	};
</script>

<div class="relative bg-transparent p-4 pb-5 text-[10.5pt] leading-relaxed tracking-[0.01em]">
	<section class="space-y-5">
		<section
			class="rounded-xl border border-slate-200 bg-gradient-to-r from-white to-sky-50/70 p-4 shadow-sm"
		>
			<h2 class="font-ms-gothic text-xs font-bold tracking-[0.08em] text-slate-700">編集ツール</h2>
			<p class="mt-1 text-xs text-slate-500">
				基本情報と明細を入力すると、右側の印刷プレビューに即時反映されます
			</p>
		</section>

		<section class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
			<h2
				class="font-ms-gothic mb-2 border-b border-slate-200 pb-2 text-sm font-bold tracking-[0.08em] text-slate-700"
			>
				基本情報
			</h2>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<label class="block">
					<span class="font-ms-gothic mb-1 block text-xs font-bold text-slate-500">お客様名</span>
					<input
						id={ids.customerName}
						type="text"
						class="h-10 w-full rounded-md border border-slate-300 px-3 transition outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500"
						placeholder="例：天野 茂"
						bind:value={estimate.customerName}
					/>
				</label>
				<label class="block">
					<span class="font-ms-gothic mb-1 block text-xs font-bold text-slate-500">日付</span>
					<input
						id={ids.date}
						type="text"
						class="h-10 w-full rounded-md border border-slate-300 px-3 transition outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500"
						placeholder="例：2026年 1月 16日"
						bind:value={estimate.date}
					/>
				</label>
				<label class="block md:col-span-2">
					<span class="font-ms-gothic mb-1 block text-xs font-bold text-slate-500">工事名称</span>
					<input
						id={ids.title}
						type="text"
						class="h-10 w-full rounded-md border border-slate-300 px-3 transition outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500"
						placeholder="例：木造農家住宅等 解体撤去工事"
						bind:value={estimate.title}
					/>
				</label>
				<label class="block md:col-span-2">
					<span class="font-ms-gothic mb-1 block text-xs font-bold text-slate-500">工事場所</span>
					<input
						id={ids.place}
						type="text"
						class="h-10 w-full rounded-md border border-slate-300 px-3 transition outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500"
						placeholder="例：群馬県甘楽郡下仁田町..."
						bind:value={estimate.place}
					/>
				</label>
			</div>
		</section>

		{#if !hasAnyLineItems}
			<div
				class="rounded-lg border border-amber-200 bg-amber-50/90 p-4 text-slate-700 shadow-sm"
				aria-live="polite"
			>
				<p class="font-ms-gothic mb-1 text-xs font-bold tracking-[0.08em] text-amber-900">
					はじめに
				</p>
				<ol class="list-none space-y-0.5 text-left text-xs">
					<li class="flex items-start gap-1.5">
						<span class="font-bold text-amber-700">1.</span> 顧客名・工事名称を入力
					</li>
					<li class="flex items-start gap-1.5">
						<span class="font-bold text-amber-700">2.</span> セクションに明細行を追加
					</li>
					<li class="flex items-start gap-1.5">
						<span class="font-bold text-amber-700">3.</span> 右プレビューで確認して発行
					</li>
				</ol>
			</div>
		{/if}

		<div class="space-y-4">
			{#each estimate.sections as section, sectionIndex}
				<SectionRow {section} {sectionIndex} />
			{/each}
		</div>

		<button
			type="button"
			class="font-ms-gothic mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-white text-sm font-bold text-slate-500 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
			onclick={() => estimate.addSection()}
			aria-label="新しいセクションを追加"
		>
			<span aria-hidden="true">＋</span>
			<span>セクションを追加</span>
		</button>
	</section>
</div>
