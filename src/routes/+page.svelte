<script lang="ts">
	import { Estimate } from '$lib/core/models/Estimate.svelte';
	import EstimateEditor from '$lib/ui/editor/EstimateEditor.svelte';
	import PrintLayout, { type A4PreviewPlan } from '$lib/ui/print/PrintLayout.svelte';
	import { formatMoney } from '$lib/core/utils/money';

	const estimate = new Estimate();
	type PreviewScaleMode = 'fit' | 'a4';
	let previewScaleMode = $state<PreviewScaleMode>('fit');
	let showSeal = $state(false);
	const ids = {
		discountInput: 'estimate-discount',
		targetPrice: 'estimate-target-price'
	};
	let targetPriceInput = $state(0);
	let isA4SummaryOpen = $state(false);
	let a4PreviewPlan = $state<A4PreviewPlan>({
		totalPages: 0,
		sections: [],
		totalsPage: null,
		termsPage: null,
		headerPage: null,
		warning: null
	});

	const isFitMode = $derived(previewScaleMode === 'fit');
	const isA4Mode = $derived(previewScaleMode === 'a4');

	$effect(() => {
		if (targetPriceInput === 0 && estimate.grandTotal > 0) {
			targetPriceInput = estimate.grandTotal;
		}
	});

	function updatePreviewScaleMode(mode: PreviewScaleMode) {
		previewScaleMode = mode;
	}

	function handleScaleKeydown(event: KeyboardEvent, currentMode: PreviewScaleMode) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			updatePreviewScaleMode(currentMode);
			return;
		}
		if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
			event.preventDefault();
			updatePreviewScaleMode(currentMode === 'fit' ? 'a4' : 'fit');
		}
	}

	function handleAutoAdjust() {
		if (targetPriceInput <= 0) return;

		if (
			confirm(
				`合計金額が ¥${formatMoney(targetPriceInput)} になるよう、値引き額を自動調整しますか？`
			)
		) {
			estimate.adjustToPrice(targetPriceInput);
		}
	}

	function handleFileUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const json = JSON.parse(e.target?.result as string);
				if (confirm('現在の入力内容を破棄して、ファイルを読み込みますか？')) {
					estimate.loadFromJSON(json);
					targetPriceInput = estimate.grandTotal;
				}
			} catch (err) {
				alert('JSONパースエラー: 正しいJSONファイルを選択してください。');
				console.error(err);
			}
			target.value = '';
		};
		reader.readAsText(file);
	}

	function handleDownloadJSON() {
		const payload = {
			version: '1.0.0',
			createdAt: new Date().toISOString(),
			customerName: estimate.customerName,
			title: estimate.title,
			place: estimate.place,
			date: estimate.date,
			terms: estimate.terms,
			discount: estimate.discount,
			sections: estimate.sections.map((section) => ({
				title: section.title,
				items: section.items.map((item) => ({
					name: item.name,
					quantity: item.quantity,
					unit: item.unit,
					unitPrice: item.unitPrice,
					note: item.note
				}))
			}))
		};

		const data = JSON.stringify(payload, null, 2);
		const blob = new Blob([data], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		const ymd = new Date().toISOString().slice(0, 10).replace(/-/g, '');
		const safeName = (estimate.customerName || 'estimate')
			.replace(/[\\/:*?"<>|]/g, '_')
			.replace(/\s+/g, '_');
		a.href = url;
		a.download = `${safeName}_見積データ_${ymd}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function handlePrint() {
		window.print();
	}
</script>

<main class="min-h-screen overflow-x-auto bg-slate-100 p-4">
	<section
		class="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-[clamp(64rem,95vw,2400px)] min-w-[64rem] flex-row gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
		aria-label="見積作成ワークスペース"
	>
		<!-- 左パネル (Editor + メニュー) -->
		<section class="w-[32%] border-r border-slate-200 bg-white print:hidden">
			<div class="border-t border-slate-200 bg-slate-50 p-4">
				<section class="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
					<div class="space-y-1">
						<div class="flex items-start justify-between gap-3">
							<div>
								<p class="font-ms-gothic text-xs font-bold tracking-[0.08em] text-slate-500">
									操作パネル（左上）
								</p>
								<p class="font-ms-gothic text-sm text-slate-700">
									見積データの保存/読込、プレビュー設定、金額調整
								</p>
							</div>
							<span
								class="rounded-full bg-slate-900/5 px-2.5 py-1 text-[11px] font-bold tracking-[0.08em] text-slate-700"
								>プレビュー主役</span
							>
						</div>
						<p class="text-[11px] text-red-600">※読込時は現在の入力内容を破棄して上書きします</p>
					</div>

					<div class="grid gap-2 sm:grid-cols-2">
						<label
							for="estimate-json-file"
							class="font-ms-gothic cursor-pointer rounded-full border border-slate-300 bg-white px-3 py-2 text-center text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
							aria-label="JSONファイルを読み込む"
						>
							JSON読込
						</label>
						<input
							id="estimate-json-file"
							type="file"
							accept=".json"
							class="sr-only"
							onchange={handleFileUpload}
						/>
						<button
							type="button"
							class="font-ms-gothic rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
							onclick={handleDownloadJSON}
							aria-label="見積データをJSONで保存"
						>
							JSON保存
						</button>
						<button
							type="button"
							class="font-ms-gothic rounded-full bg-blue-600 px-3 py-2 text-sm font-bold text-white hover:bg-blue-500"
							onclick={handlePrint}
							aria-label="見積書を印刷して発行"
						>
							見積書発行
						</button>
						<button
							type="button"
							class="font-ms-gothic rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
							onclick={() => {
								showSeal = !showSeal;
							}}
							aria-pressed={showSeal}
							aria-label="見積書に印影を表示"
						>
							{showSeal ? '印影OFF' : '印影ON'}
						</button>
						<div
							role="radiogroup"
							aria-label="プレビュー表示モード"
							class="inline-flex overflow-hidden rounded-full border border-slate-300 bg-slate-50"
						>
							<button
								type="button"
								role="radio"
								aria-checked={isFitMode}
								tabindex={isFitMode ? 0 : -1}
								class={`font-ms-gothic px-3 py-1.5 text-xs font-bold ${
									isFitMode
										? 'bg-slate-800 text-white'
										: 'bg-transparent text-slate-600 hover:bg-slate-100'
								}`}
								onclick={() => updatePreviewScaleMode('fit')}
								onkeydown={(event) => handleScaleKeydown(event, 'fit')}
							>
								画面幅
							</button>
							<button
								type="button"
								role="radio"
								aria-checked={!isFitMode}
								tabindex={isFitMode ? -1 : 0}
								class={`font-ms-gothic px-3 py-1.5 text-xs font-bold ${
									!isFitMode
										? 'bg-slate-800 text-white'
										: 'bg-transparent text-slate-600 hover:bg-slate-100'
								}`}
								onclick={() => updatePreviewScaleMode('a4')}
								onkeydown={(event) => handleScaleKeydown(event, 'a4')}
							>
								A4実寸
							</button>
						</div>
					</div>

					<p class="text-xs text-slate-500">
						{isFitMode ? '表示モード: デフォルト(画面幅)' : '表示モード: A4実寸（横スクロール可）'}
					</p>

					<details
						bind:open={isA4SummaryOpen}
						class="rounded-lg border border-blue-100 bg-blue-50 text-[11px] text-slate-700"
					>
						<summary
							class="flex cursor-pointer items-center justify-between gap-2 px-3 py-2 font-bold text-slate-800 select-none"
							aria-label="A4ページ予想を展開"
						>
							<span>A4ページ予想</span>
							<span class="font-mono text-slate-600"
								>{isA4Mode ? `${a4PreviewPlan.totalPages}枚` : '未確定'}</span
							>
						</summary>
						<div class="mt-1 border-t border-blue-200 px-3 py-2">
							<div>
								ヘッダー: {a4PreviewPlan.headerPage ?? '-'} / 合計欄: {a4PreviewPlan.totalsPage ??
									'-'} / 備考: {a4PreviewPlan.termsPage ?? '-'}
							</div>
							{#if a4PreviewPlan.warning}
								<div class="mt-1 font-bold text-red-600">{a4PreviewPlan.warning}</div>
							{/if}
							{#if a4PreviewPlan.sections.length > 0}
								<div class="mt-1 space-y-0.5">
									{#each a4PreviewPlan.sections as section}
										<div>
											{section.title}: {section.startPage}{#if section.startPage !== section.endPage}-{section.endPage}{/if}枚目
										</div>
									{/each}
								</div>
							{/if}
						</div>
					</details>

					<div class="space-y-1 text-sm" aria-live="polite" aria-atomic="true">
						<div class="flex justify-between text-slate-600">
							<span>税抜小計:</span>
							<span class="font-mono">{formatMoney(estimate.baseTotal)}</span>
						</div>
						<div class="flex items-center justify-between text-red-600">
							<span>値引き:</span>
							<div class="flex items-center">
								<span>▲</span>
								<label for={ids.discountInput} class="sr-only">値引き額</label>
								<input
									id={ids.discountInput}
									type="number"
									class="w-20 border-b border-red-300 bg-transparent text-right font-mono text-red-600 focus:ring-2 focus:ring-red-300 focus:outline-none"
									inputmode="numeric"
									bind:value={estimate.discount}
									step="1"
								/>
							</div>
						</div>
						<div class="flex justify-between text-xs text-slate-500">
							<span>(工事価格: {formatMoney(estimate.constructionPrice)})</span>
						</div>
						<div class="flex justify-between text-slate-600">
							<span>消費税 (10%):</span>
							<span class="font-mono">{formatMoney(estimate.taxAmount)}</span>
						</div>
					</div>

					<div class="text-right">
						<div class="mb-1 text-xs text-slate-500">合計金額 (税込)</div>
						<div class="font-mono text-4xl font-bold tracking-tight text-slate-800">
							¥ {formatMoney(estimate.grandTotal)}
						</div>
					</div>

					<div class="rounded-lg border border-blue-100 bg-blue-50 p-3">
						<div class="flex items-center justify-between gap-2">
							<span class="font-ms-gothic text-xs font-bold tracking-[0.08em] text-blue-800"
								>目標金額調整</span
							>
							<span class="text-[11px] text-slate-500">{formatMoney(targetPriceInput)} へ</span>
						</div>
						<div class="mt-3 flex flex-wrap items-center gap-2">
							<label for={ids.targetPrice} class="font-ms-gothic text-sm text-slate-700"
								>目標金額:</label
							>
							<div class="relative">
								<span
									class="pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 text-sm text-slate-400"
									>¥</span
								>
								<input
									id={ids.targetPrice}
									type="number"
									class="w-32 rounded border border-blue-200 px-2 py-1 pl-6 text-right font-mono outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
									inputmode="numeric"
									step="1"
									min="0"
									bind:value={targetPriceInput}
								/>
							</div>
							<button
								type="button"
								class="font-ms-gothic rounded bg-blue-600 px-4 py-1.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95"
								onclick={handleAutoAdjust}
							>
								自動調整
							</button>
						</div>
					</div>
				</section>
			</div>
			<EstimateEditor {estimate} />
		</section>

		<!-- 右パネル (Preview) を主役に -->
		<section
			class="relative w-[68%] overflow-hidden border-l border-slate-200 bg-slate-100 print:bg-white"
			aria-label="見積書プレビュー"
		>
			<div class="h-full overflow-x-auto overflow-y-auto px-5 pt-1 pb-5">
				<div class="mx-auto flex w-full justify-center">
					<div
						style={`width: ${isA4Mode ? '210mm' : '100%'}; max-width: ${isA4Mode ? '210mm' : '100%'};`}
						class="rounded-[10px] bg-slate-300/40 p-2 shadow-[0_18px_40px_rgba(15,23,42,0.2)]"
					>
						<div class="origin-top rounded-[4px] bg-white print:scale-100">
							<PrintLayout
								{estimate}
								fitMode={previewScaleMode}
								{showSeal}
								onA4PlanChange={(plan: A4PreviewPlan) => {
									a4PreviewPlan = plan;
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	</section>
</main>
