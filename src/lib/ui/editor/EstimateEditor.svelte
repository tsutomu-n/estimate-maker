<script lang="ts">
  import type { Estimate } from '$lib/core/models/Estimate.svelte';
  import type { EstimateSchema } from '$lib/types/schema';
  import { formatMoney } from '$lib/core/utils/money';
  import { LARGE_HOUSE_TEMPLATE } from '$lib/data/templates/largeHouse';
  import { SMALL_SHED_TEMPLATE } from '$lib/data/templates/smallShed';
  import SectionRow from './SectionRow.svelte';

  // Svelte 5 Props
  let { estimate }: { estimate: Estimate } = $props();

  // ファイル入力要素への参照
  let fileInput: HTMLInputElement;
  
  // 逆算用の入力値
  let targetPriceInput = $state(0);

  // 初期値セット (Estimateの合計金額が変わったら追従させるか、初期値だけか。
  // ここでは初期ロード時や合計変更時に使いやすいよう、0なら合計を入れるロジックにする)
  $effect(() => {
    if (targetPriceInput === 0 && estimate.grandTotal > 0) {
        targetPriceInput = estimate.grandTotal;
    }
  });

  // ---------------------------------------------------------
  // ハンドラ: JSON読み込み
  // ---------------------------------------------------------
  function handleFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        
        if(confirm('現在の入力内容を破棄して、ファイルを読み込みますか？')) {
            estimate.loadFromJSON(json);
            // 読み込み後に逆算用入力も更新
            targetPriceInput = estimate.grandTotal;
        }
      } catch (err) {
        alert('JSONパースエラー: 正しいJSONファイルを選択してください。');
        console.error(err);
      }
      // inputをリセット（同じファイルを再度選べるように）
      target.value = ''; 
    };
    reader.readAsText(file);
  }

  // ---------------------------------------------------------
  // ハンドラ: JSON保存
  // ---------------------------------------------------------
  function handleDownloadJSON() {
    const data = JSON.stringify(estimate.toJSON(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // ファイル名: 顧客名_日付.json (スペースはアンダースコアに置換)
    const filename = `${estimate.customerName.replace(/\s+/g, '_')}_見積データ.json`;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ---------------------------------------------------------
  // ハンドラ: 逆算調整
  // ---------------------------------------------------------
  function handleAutoAdjust() {
    if (targetPriceInput <= 0) return;
    
    if(confirm(`合計金額が ¥${formatMoney(targetPriceInput)} になるよう、値引き額を自動調整しますか？`)) {
        estimate.adjustToPrice(targetPriceInput);
    }
  }

  function applyTemplate(template: EstimateSchema, label: string) {
    if (!confirm(`「${label}」を読み込みますか？\n現在の入力内容は上書きされます。`)) {
      return;
    }
    estimate.loadFromJSON(template);
    targetPriceInput = estimate.grandTotal;
  }
</script>

<div class="p-4 space-y-6 bg-slate-50 min-h-screen pb-40 text-[10.5pt] leading-relaxed tracking-[0.01em]">
  
  <!-- ▼ ツールバー -->
  <div class="flex justify-between items-center bg-white p-3 rounded shadow-sm border border-gray-200">
    <h2 class="font-bold font-ms-gothic tracking-[0.08em] text-gray-700 px-2 flex items-center gap-2">
      <span class="text-xl">🛠️</span> 編集ツール
    </h2>
    <div class="flex gap-3">
        <!-- 読み込みボタン (input type=fileは隠す) -->
        <input 
            type="file" 
            accept=".json" 
            class="hidden" 
            bind:this={fileInput}
            onchange={handleFileUpload}
        />
        <button 
            class="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium font-ms-gothic rounded border border-gray-300 shadow-sm flex items-center gap-2 transition-colors"
            onclick={() => fileInput.click()}
        >
            <span>📂</span> JSON読込
        </button>

        <!-- 保存ボタン -->
        <button 
            class="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium font-ms-gothic rounded border border-gray-300 shadow-sm flex items-center gap-2 transition-colors"
            onclick={handleDownloadJSON}
        >
            <span>💾</span> JSON保存
        </button>

        <!-- テンプレート読込ボタン -->
        <button
          class="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium font-ms-gothic rounded border border-gray-300 shadow-sm flex items-center gap-2 transition-colors"
          onclick={() => applyTemplate(SMALL_SHED_TEMPLATE, '小屋解体（標準プラン）')}
        >
          <span>📄</span> 小屋解体
        </button>
        <button
          class="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium font-ms-gothic rounded border border-gray-300 shadow-sm flex items-center gap-2 transition-colors"
          onclick={() => applyTemplate(LARGE_HOUSE_TEMPLATE, '厚基礎プラン')}
        >
          <span>🏠</span> 厚基礎プラン
        </button>
    </div>
  </div>

  <!-- ▼ 基本情報フォーム -->
  <div class="bg-white p-5 rounded shadow-sm border border-gray-200 space-y-4">
    <h2 class="font-bold font-ms-gothic tracking-[0.08em] text-gray-700 border-b pb-2 mb-2 text-sm">基本情報</h2>
    <div class="grid grid-cols-2 gap-4">
      <label class="block">
          <span class="text-xs text-gray-500 font-bold font-ms-gothic block mb-1">お客様名</span>
        <input 
          type="text" 
          class="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
          placeholder="例：天野 茂"
          bind:value={estimate.customerName} 
        />
      </label>
      <label class="block">
          <span class="text-xs text-gray-500 font-bold font-ms-gothic block mb-1">日付</span>
        <input 
          type="text" 
          class="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
          placeholder="例：2026年 1月 16日"
          bind:value={estimate.date} 
        />
      </label>
      <label class="block col-span-2">
        <span class="text-xs text-gray-500 font-bold font-ms-gothic block mb-1">工事名称</span>
        <input 
          type="text" 
          class="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
          placeholder="例：木造農家住宅等 解体撤去工事"
          bind:value={estimate.title} 
        />
      </label>
      <label class="block col-span-2">
        <span class="text-xs text-gray-500 font-bold font-ms-gothic block mb-1">工事場所</span>
        <input 
          type="text" 
          class="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" 
          placeholder="例：群馬県甘楽郡下仁田町..."
          bind:value={estimate.place} 
        />
      </label>
    </div>
  </div>

  <!-- ▼ 明細エディタ (セクションごと) -->
  <div class="space-y-4">
    {#each estimate.sections as section}
      <SectionRow {section} />
    {/each}
  </div>

  <!-- ▼ 計算・調整エリア (フッター固定) -->
  <div class="fixed bottom-0 left-0 w-1/2 bg-white/95 backdrop-blur border-t-2 border-blue-600 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10 print:hidden">
    <div class="flex justify-between items-end mb-3">
      <!-- 左側：積み上げ計算 -->
      <div class="text-sm space-y-1">
        <div class="flex justify-between w-48 text-gray-600">
          <span>税抜小計:</span>
          <span class="font-mono">{formatMoney(estimate.baseTotal)}</span>
        </div>
        <div class="flex justify-between w-48 text-red-600 items-center">
          <span>出精値引き:</span>
          <div class="flex items-center">
            <span>▲</span>
            <input 
                type="number" 
                class="w-20 text-right border-b border-red-300 text-red-600 bg-transparent focus:outline-none font-mono" 
                bind:value={estimate.discount}
            />
          </div>
        </div>
        <div class="flex justify-between w-48 text-gray-500 text-xs">
          <span>(工事価格: {formatMoney(estimate.constructionPrice)})</span>
        </div>
        <div class="flex justify-between w-48 text-gray-600">
          <span>消费税 (10%):</span>
          <span class="font-mono">{formatMoney(estimate.taxAmount)}</span>
        </div>
      </div>

      <!-- 右側：合計金額 -->
      <div class="text-right">
        <div class="text-xs text-gray-500 mb-1">合計金額 (税込)</div>
        <div class="text-4xl font-bold font-mono text-slate-800 tracking-tight">
          ¥ {formatMoney(estimate.grandTotal)}
        </div>
      </div>
    </div>

    <!-- 逆算調整ツール -->
    <div class="flex items-center gap-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
    <span class="text-xs font-bold text-blue-800 uppercase tracking-wider font-ms-gothic">Target Price Adjustment</span>
      <div class="flex items-center gap-2 flex-1">
        <span class="text-sm text-gray-600 font-ms-gothic">目標金額:</span>
        <div class="relative">
          <span class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
          <input 
            type="number" 
            class="border border-blue-200 rounded px-2 pl-6 py-1 w-32 text-right font-mono focus:ring-2 focus:ring-blue-500 outline-none" 
            bind:value={targetPriceInput} 
          />
        </div>
        <span class="text-sm text-gray-600">へ</span>
      </div>
      <button 
        class="bg-blue-600 text-white px-4 py-1.5 rounded shadow-sm text-sm font-bold font-ms-gothic hover:bg-blue-700 active:transform active:scale-95 transition-all"
        onclick={handleAutoAdjust}
      >
        自動調整を実行
      </button>
    </div>
  </div>
</div>
