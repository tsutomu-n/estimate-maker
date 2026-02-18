<script lang="ts">
  import { Estimate } from '$lib/core/models/Estimate.svelte';
  import EstimateEditor from '$lib/ui/editor/EstimateEditor.svelte';
  import PrintLayout from '$lib/ui/print/PrintLayout.svelte';

  const estimate = new Estimate();
  
  // Bテーマ固定（官公庁提出向けレイアウト）
  const isClassicMode = true;
</script>

<div class="flex flex-row min-h-screen bg-gray-800">
  
  <!-- 左パネル (Editor) -->
  <div class="w-1/2 min-w-0 h-screen overflow-y-auto border-r border-gray-600 print:hidden">
    <EstimateEditor {estimate} />
  </div>

  <!-- 右パネル (Preview) -->
  <div class="w-1/2 min-w-0 h-screen overflow-y-auto overflow-x-auto bg-gray-500 p-8 flex flex-col items-center print:w-full print:min-h-0 print:h-auto print:bg-white print:p-0 print:block print:items-stretch print:justify-start">
    
    <!-- ★追加: スタイル切り替えスイッチ -->
  <div class="mb-4 bg-white px-4 py-2 rounded-full shadow flex items-center gap-3 print:hidden">
    <span class="text-xs font-bold font-ms-gothic text-gray-500">スタイル:</span>
    <span class="text-sm font-medium font-ms-gothic text-black">役所提出用 (固定:B)</span>
  </div>

    <!-- プレビュー本体 -->
    <div class="scale-100 origin-top print:scale-100">
      <!-- ★追加: isClassic プロパティを渡す -->
      <PrintLayout {estimate} isClassic={isClassicMode} />
    </div>

  </div>
</div>

<!-- 印刷ボタン -->
  <button
  class="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-500 text-white font-bold font-ms-gothic py-4 px-8 rounded-full shadow-2xl flex items-center gap-2 print:hidden z-50 transition-transform hover:scale-105"
  onclick={() => window.print()}
>
  <span class="text-2xl">🖨</span>
  <span>見積書を発行</span>
</button>
