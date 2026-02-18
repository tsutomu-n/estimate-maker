<script lang="ts">
  import type { LineItem } from '$lib/core/models/LineItem.svelte';
  import { formatMoney } from '$lib/core/utils/money';

  let { item, onRemove }: { item: LineItem; onRemove: () => void } = $props();
</script>

<div class="grid grid-cols-12 gap-2 items-center text-sm py-1 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
  <!-- 品名 -->
  <div class="col-span-5">
    <input
      type="text"
      class="w-full p-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      placeholder="品名 / 摘要"
      bind:value={item.name}
    />
    <!-- 備考 (小さく表示) -->
    <input
      type="text"
      class="w-full mt-1 text-xs text-gray-500 border-none bg-transparent focus:bg-white focus:ring-1 p-0.5 font-ms-gothic tracking-[0.03em]"
      placeholder="備考 (任意)"
      bind:value={item.note}
    />
  </div>

  <!-- 数量 -->
  <div class="col-span-2">
    <input
      type="number"
      class="w-full p-1 text-right border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
      bind:value={item.quantity}
      min="0"
      step="0.1"
    />
  </div>

  <!-- 単位 -->
  <div class="col-span-1">
    <input
      type="text"
      class="w-full p-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none font-ms-gothic"
      bind:value={item.unit}
      list="unit-options"
    />
    <datalist id="unit-options">
      <option value="式"></option>
      <option value="坪"></option>
      <option value="m3"></option>
      <option value="m2"></option>
      <option value="台"></option>
      <option value="枚"></option>
    </datalist>
  </div>

  <!-- 単価 -->
  <div class="col-span-2">
    <input
      type="number"
      class="w-full p-1 text-right border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
      bind:value={item.unitPrice}
    />
  </div>

  <!-- 金額（自動計算・削除） -->
  <div class="col-span-2 flex justify-between items-center pl-1">
    <span class="font-ms-gothic text-gray-700">{formatMoney(item.amount)}</span>
    <button
      class="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition"
      onclick={onRemove}
      title="行を削除"
    >
      ✕
    </button>
  </div>
</div>
