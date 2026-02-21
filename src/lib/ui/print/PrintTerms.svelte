<script lang="ts">
	import type { TermSectionSchema } from '$lib/types/schema';

	let { terms = [] }: { terms?: TermSectionSchema[] } = $props();
</script>

<div
	class="break-inside-avoid border border-black"
	data-print-block="terms"
	style="padding: var(--a4-notes-pad); font-size: var(--a4-font-note);"
>
	{#each terms as term}
		<h3
			class="font-ms-gothic inline-block border-b border-black font-bold"
			style="font-size: var(--a4-font-notes-title); margin-bottom: var(--a4-meta-gap);"
		>
			【 {term.title} 】
		</h3>
		<ul
			class="list-outside list-disc leading-relaxed opacity-90"
			style="margin-left: var(--a4-notes-list-ml); row-gap: var(--a4-notes-list-gap); display: flex; flex-direction: column;"
		>
			{#each term.items as item}
				<li>{item}</li>
			{/each}
		</ul>
	{/each}
</div>
