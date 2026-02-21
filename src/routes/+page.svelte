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
	let isAdjustOpen = $state(false);
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
	const hasAnyLineItems = $derived(estimate.sections.some((section) => section.items.length > 0));
	const a4StatusText = $derived.by(() => {
		if (a4PreviewPlan.warning) return 'A4: 注意';
		return isA4Mode ? `A4: ${a4PreviewPlan.totalPages}枚` : 'A4: 未確定';
	});

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

<main
	class="min-h-screen overflow-x-auto bg-gradient-to-b from-slate-100 to-sky-50/60 p-4 print:hidden"
>
	<section
		class="mx-auto flex h-[calc(100vh-2rem)] w-full max-w-[clamp(64rem,95vw,2400px)] min-w-[64rem] flex-row gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
		aria-label="見積作成ワークスペース"
	>
		<!-- 左パネル: 固定ヘッダー / スクロール中央 / 固定フッター -->
		<section
			class="flex h-full w-[32%] flex-col border-r border-slate-200 bg-slate-50/80 print:hidden"
			aria-label="編集パネル"
		>
			<!-- ── 固定ヘッダー ── -->
			<header class="flex shrink-0 flex-col gap-3 border-b border-slate-200 bg-white px-4 py-3">
				<div class="flex items-center justify-between gap-2">
					<h1 class="font-ms-gothic text-base font-bold tracking-widest text-slate-800">
						解体依頼見積
					</h1>
					<span
						class={`rounded-full px-2.5 py-0.5 text-[11px] font-bold tabular-nums ${
							a4PreviewPlan.warning
								? 'bg-red-100 text-red-700'
								: isA4Mode
									? 'bg-blue-100 text-blue-700'
									: 'bg-slate-100 text-slate-500'
						}`}
					>
						{a4StatusText}
					</span>
				</div>
				<button
					type="button"
					class="font-ms-gothic h-10 w-full rounded-lg bg-blue-600 px-3 text-sm font-bold tracking-widest text-white shadow-sm transition hover:bg-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98]"
					onclick={handlePrint}
					aria-label="見積書を印刷して発行"
				>
					見積書を発行する
				</button>
			</header>

			<!-- ── スクロール中央（エディタ） ── -->
			<div class="min-h-0 flex-1 overflow-y-auto">
				<EstimateEditor {estimate} {hasAnyLineItems} />
			</div>

			<!-- ── 固定フッター ── -->
			<footer class="shrink-0 border-t border-slate-200 bg-white">
				<!-- 合計金額 -->
				<div class="border-b border-slate-100 px-4 py-3">
					<div class="flex items-end justify-between">
						<div class="space-y-0.5 text-xs text-slate-500" aria-live="polite" aria-atomic="true">
							<div class="flex justify-between gap-6">
								<span>税抜小計</span>
								<span class="font-mono tabular-nums">¥ {formatMoney(estimate.baseTotal)}</span>
							</div>
							{#if estimate.discount !== 0}
								<div class="flex justify-between gap-6 text-red-500">
									<span>値引き</span>
									<span class="font-mono tabular-nums"
										>− {formatMoney(Math.abs(estimate.discount))}</span
									>
								</div>
							{/if}
							<div class="flex justify-between gap-6">
								<span>消費税 (10%)</span>
								<span class="font-mono tabular-nums">¥ {formatMoney(estimate.taxAmount)}</span>
							</div>
						</div>
						<div class="text-right">
							<div class="text-[10px] text-slate-400">合計 (税込)</div>
							<div class="font-ms-gothic font-mono text-2xl font-bold text-slate-900 tabular-nums">
								¥{formatMoney(estimate.grandTotal)}
							</div>
						</div>
					</div>

					<!-- 値引き・目標金額調整パネル（展開式） -->
					<div class="mt-2">
						<button
							type="button"
							class="font-ms-gothic flex w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 focus-visible:outline-none"
							onclick={() => (isAdjustOpen = !isAdjustOpen)}
							aria-expanded={isAdjustOpen}
						>
							<span>金額調整</span>
							<span class="text-slate-400">{isAdjustOpen ? '▲' : '▼'}</span>
						</button>
						{#if isAdjustOpen}
							<div class="mt-2 space-y-3 rounded-md border border-slate-200 bg-slate-50 p-3">
								<div class="flex items-center justify-between gap-2 text-sm">
									<span class="font-ms-gothic text-slate-600">値引き</span>
									<div class="flex items-center gap-1 text-red-600">
										<span aria-hidden="true" class="text-xs">−</span>
										<label for={ids.discountInput} class="sr-only">値引き額</label>
										<input
											id={ids.discountInput}
											type="number"
											class="h-8 w-28 rounded border border-red-200 bg-white px-2 py-1 text-right font-mono text-red-600 tabular-nums focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:outline-none"
											inputmode="numeric"
											bind:value={estimate.discount}
											step="1"
										/>
									</div>
								</div>
								<div class="border-t border-slate-200 pt-2">
									<div class="font-ms-gothic mb-1.5 text-xs font-bold text-slate-600">
										目標金額から自動調整
									</div>
									<div class="flex items-center gap-2">
										<div class="relative flex-1">
											<span
												class="pointer-events-none absolute top-1/2 left-2 -translate-y-1/2 text-xs text-slate-400"
												>¥</span
											>
											<label for={ids.targetPrice} class="sr-only">目標金額</label>
											<input
												id={ids.targetPrice}
												type="number"
												class="h-8 w-full rounded border border-slate-300 py-1 pr-2 pl-6 text-right font-mono text-sm tabular-nums outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500"
												inputmode="numeric"
												step="1"
												min="0"
												bind:value={targetPriceInput}
											/>
										</div>
										<button
											type="button"
											class="font-ms-gothic h-8 shrink-0 rounded-md bg-blue-600 px-3 text-xs font-bold text-white transition hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 focus-visible:outline-none active:scale-95"
											onclick={handleAutoAdjust}
										>
											自動調整
										</button>
									</div>
								</div>
							</div>
						{/if}
					</div>
				</div>

				<!-- サブアクション行 -->
				<div class="flex items-center justify-between gap-2 px-4 py-2">
					<div class="flex items-center gap-1.5">
						<!-- ファイル読込 -->
						<label
							for="estimate-json-file"
							class="font-ms-gothic inline-flex h-8 cursor-pointer items-center rounded-md border border-slate-200 bg-white px-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 focus-visible:outline-none"
							aria-label="JSONファイルを読み込む"
							title="JSONファイルを読み込む（現在の内容を破棄）"
						>
							読込
						</label>
						<input
							id="estimate-json-file"
							type="file"
							accept=".json"
							class="sr-only"
							onchange={handleFileUpload}
						/>
						<!-- JSON保存 -->
						<button
							type="button"
							class="font-ms-gothic h-8 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 focus-visible:outline-none"
							onclick={handleDownloadJSON}
							aria-label="見積データをJSONで保存"
							title="見積データをJSONで保存"
						>
							保存
						</button>
					</div>
					<div class="flex items-center gap-1.5">
						<!-- 社印トグル -->
						<button
							type="button"
							class={`font-ms-gothic h-8 rounded-md border px-2.5 text-xs font-bold transition focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 focus-visible:outline-none ${
								showSeal
									? 'border-blue-300 bg-blue-50 text-blue-700'
									: 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
							}`}
							onclick={() => (showSeal = !showSeal)}
							aria-pressed={showSeal}
							title="社印の表示切替"
						>
							+ 社印
						</button>
						<!-- A4モード切替 -->
						<div
							role="radiogroup"
							aria-label="プレビュー表示モード"
							class="flex h-8 overflow-hidden rounded-md border border-slate-200"
						>
							<button
								type="button"
								role="radio"
								aria-checked={isFitMode}
								tabindex={isFitMode ? 0 : -1}
								class={`font-ms-gothic px-2.5 text-xs font-bold transition focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none focus-visible:ring-inset ${
									isFitMode
										? 'bg-slate-800 text-white'
										: 'bg-white text-slate-500 hover:bg-slate-50'
								}`}
								onclick={() => updatePreviewScaleMode('fit')}
								onkeydown={(event) => handleScaleKeydown(event, 'fit')}
								title="画面幅に合わせて表示"
							>
								画面幅
							</button>
							<button
								type="button"
								role="radio"
								aria-checked={isA4Mode}
								tabindex={isA4Mode ? 0 : -1}
								class={`font-ms-gothic border-l border-slate-200 px-2.5 text-xs font-bold transition focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none focus-visible:ring-inset ${
									isA4Mode ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'
								}`}
								onclick={() => updatePreviewScaleMode('a4')}
								onkeydown={(event) => handleScaleKeydown(event, 'a4')}
								title="A4実寸で表示"
							>
								A4実寸
							</button>
						</div>
					</div>
				</div>
			</footer>
		</section>

		<!-- 右パネル (Preview) -->
		<section
			class="relative w-[68%] overflow-hidden border-l border-slate-200 bg-slate-100"
			aria-label="見積書プレビュー"
		>
			<div class="h-full overflow-x-auto overflow-y-auto px-5 pt-1 pb-5">
				<div class="mx-auto flex w-full justify-center">
					<div
						style={`width: ${isA4Mode ? '210mm' : '100%'}; max-width: ${isA4Mode ? '210mm' : '100%'};`}
						class="rounded-[10px] bg-slate-400/30 p-2 shadow-[0_18px_40px_rgba(15,23,42,0.25)]"
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

<section class="hidden print:block print:bg-white print:p-0" aria-label="印刷用見積書">
	<PrintLayout {estimate} fitMode="a4" {showSeal} enableA4Plan={false} />
</section>
