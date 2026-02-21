<script lang="ts">
	import type { Estimate } from '$lib/core/models/Estimate.svelte';
	import SectionRow from './SectionRow.svelte';

	let { estimate }: { estimate: Estimate } = $props();

	const ids = {
		customerName: 'estimate-customer-name',
		date: 'estimate-date',
		title: 'estimate-title',
		place: 'estimate-place'
	};
</script>

<div class="relative min-h-screen bg-slate-50 p-4 pb-4 text-[10.5pt] leading-relaxed tracking-[0.01em]">
	<section class="space-y-6">
		<section class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
			<h2 class="font-bold font-ms-gothic tracking-[0.08em] text-slate-700 border-b border-slate-200 pb-2 mb-2 text-sm">
				基本情報
			</h2>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<label class="block">
					<span class="text-xs text-slate-500 font-bold font-ms-gothic block mb-1">お客様名</span>
					<input
						id={ids.customerName}
						type="text"
						class="w-full rounded border border-slate-300 p-2 transition focus:border-slate-500 focus:ring-2 focus:ring-slate-500 outline-none"
						placeholder="例：天野 茂"
						bind:value={estimate.customerName}
					/>
				</label>
				<label class="block">
					<span class="text-xs text-slate-500 font-bold font-ms-gothic block mb-1">日付</span>
					<input
						id={ids.date}
						type="text"
						class="w-full rounded border border-slate-300 p-2 transition focus:border-slate-500 focus:ring-2 focus:ring-slate-500 outline-none"
						placeholder="例：2026年 1月 16日"
						bind:value={estimate.date}
					/>
				</label>
				<label class="block md:col-span-2">
					<span class="text-xs text-slate-500 font-bold font-ms-gothic block mb-1">工事名称</span>
					<input
						id={ids.title}
						type="text"
						class="w-full rounded border border-slate-300 p-2 transition focus:border-slate-500 focus:ring-2 focus:ring-slate-500 outline-none"
						placeholder="例：木造農家住宅等 解体撤去工事"
						bind:value={estimate.title}
					/>
				</label>
				<label class="block md:col-span-2">
					<span class="text-xs text-slate-500 font-bold font-ms-gothic block mb-1">工事場所</span>
					<input
						id={ids.place}
						type="text"
						class="w-full rounded border border-slate-300 p-2 transition focus:border-slate-500 focus:ring-2 focus:ring-slate-500 outline-none"
						placeholder="例：群馬県甘楽郡下仁田町..."
						bind:value={estimate.place}
					/>
				</label>
			</div>
		</section>

		<div class="space-y-4">
			{#each estimate.sections as section, sectionIndex}
				<SectionRow {section} {sectionIndex} />
			{/each}
		</div>
	</section>
</div>
