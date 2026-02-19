<script lang="ts">
	import type { Estimate } from '$lib/core/models/Estimate.svelte';
	import { PRINT_TEXT } from './print-copy';

	let {
		estimate,
		showSeal,
		borderColor = 'border-black',
		subBorderColor = 'border-black'
	}: {
		estimate: Estimate;
		showSeal: boolean;
		borderColor?: string;
		subBorderColor?: string;
	} = $props();
</script>

<header style="margin-bottom: var(--a4-header-mb);">
	<!-- ① 御見積書タイトル（全幅・中央） -->
	<div
		class="border-b-2 text-center {borderColor}"
		style="padding-bottom: var(--a4-title-pb); margin-bottom: var(--a4-title-mb);"
	>
		<h2
			class="font-ms-gothic inline-block font-bold"
			style="font-size: var(--a4-font-doc-title); letter-spacing: var(--a4-track-doc-title); line-height: 1;"
		>
			{PRINT_TEXT.docTitle}
		</h2>
	</div>

	<!-- ② 2カラム：宛名・工事情報 ／ 自社情報 -->
	<div
		class="grid items-start border-b-2 {borderColor}"
		style="grid-template-columns: minmax(0,1fr) minmax(0,240px); column-gap: 6mm; padding-bottom: var(--a4-grid-pb);"
	>
		<!-- 宛名・工事情報 -->
		<div class="min-w-0">
			<p style="font-size: var(--a4-font-meta); margin-bottom: var(--a4-date-mb);">
				{estimate.date}
			</p>
			<h1
				class="font-ms-gothic border-b font-bold {subBorderColor} inline-block"
				style="font-size: var(--a4-font-customer); margin-bottom: var(--a4-customer-bottom); padding-bottom: var(--a4-customer-pb); padding-right: var(--a4-customer-pr);"
			>
				{estimate.customerName}
				<span style="font-size: var(--a4-font-customer); font-weight: 700;">{PRINT_TEXT.customerSuffix}</span>
			</h1>
			<div
				style="display:grid; gap: var(--a4-meta-gap); font-size: var(--a4-font-table); margin-top: var(--a4-meta-grid-mt);"
			>
				<div class="flex items-start">
					<span
						class="shrink-0 opacity-70"
						style="width: var(--a4-meta-label-w); margin-left: var(--a4-header-meta-left);"
						>{PRINT_TEXT.metaLabels.workTitle}</span
					>
					<span class="font-medium">{estimate.title}</span>
				</div>
				<div class="flex items-start">
					<span
						class="shrink-0 opacity-70"
						style="width: var(--a4-meta-label-w); margin-left: var(--a4-header-meta-left);"
						>{PRINT_TEXT.metaLabels.workPlace}</span
					>
					<span class="w-full break-words">{estimate.place}</span>
				</div>
			</div>
		</div>

		<!-- 自社情報（右寄せ・上揃え） -->
		<div class="relative min-w-0 text-right">
			<div
				class="leading-tight"
				style="display:grid; gap: var(--a4-meta-gap); font-size: var(--a4-font-table);"
			>
				<p
					class="font-ms-gothic font-bold tracking-wide"
					style="font-size: var(--a4-font-company);"
				>
					{PRINT_TEXT.headerCompanyName}
				</p>
				<p>{PRINT_TEXT.headerRepresentative}</p>
				<p style="margin-top: var(--a4-meta-gap);">{PRINT_TEXT.zipCodeLabel}</p>
				<p class="leading-tight break-words whitespace-normal">
					{PRINT_TEXT.address}
				</p>
				<p>{PRINT_TEXT.telFax}</p>
				<!-- 建設業許可番号 -->
				<div
					class="border-t pt-1 {subBorderColor} leading-tight opacity-90"
					style="font-size: var(--a4-font-permit); margin-top: var(--a4-permit-pt);"
				>
					{#each PRINT_TEXT.permits as permit}
						<p>{permit}</p>
					{/each}
				</div>
			</div>

			<!-- 電子印鑑 -->
			{#if showSeal}
				<img
					src="/hanko.png"
					class="absolute right-0 bottom-0 z-10 w-16 opacity-80 mix-blend-multiply"
					alt="社印"
				/>
			{/if}
		</div>
	</div>
</header>
