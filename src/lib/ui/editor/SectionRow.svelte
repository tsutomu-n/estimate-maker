<script lang="ts">
  import type { Section } from '$lib/core/models/Section.svelte';
  import { formatMoney } from '$lib/core/utils/money';
  import LineItemRow from './LineItemRow.svelte';

  let { section }: { section: Section } = $props();
</script>

<div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 overflow-hidden">
  <!-- セクションヘッダー -->
  <div class="bg-gray-100 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
    <input 
      class="font-bold font-ms-gothic tracking-[0.04em] text-gray-700 bg-transparent border-none focus:ring-0 w-2/3"
      bind:value={section.title}
    />
    <div class="text-sm font-bold tracking-[0.04em] font-ms-gothic text-blue-900">
      小計: ¥ {formatMoney(section.subTotal)}
    </div>
  </div>

  <!-- 行リスト -->
  <div class="p-2">
    <!-- ヘッダーラベル -->
    <div class="grid grid-cols-12 gap-2 text-xs text-gray-500 px-1 mb-1">
      <div class="col-span-5">品名・備考</div>
      <div class="col-span-2 text-right">数量</div>
      <div class="col-span-1 text-center">単位</div>
      <div class="col-span-2 text-right">単価</div>
      <div class="col-span-2">金額</div>
    </div>

    {#each section.items as item, i}
      <LineItemRow 
        {item} 
        onRemove={() => section.removeItem(i)} 
      />
    {/each}

    <!-- 行追加ボタン -->
    <button
      class="w-full mt-2 py-1 text-sm text-blue-600 border border-dashed border-blue-300 rounded hover:bg-blue-50 transition flex items-center justify-center gap-1"
      onclick={() => section.addItem()}
    >
      <span>＋ 行を追加</span>
    </button>
  </div>
</div>
