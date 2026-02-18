<script lang="ts">
  import type { Estimate } from '$lib/core/models/Estimate.svelte';
  import { formatMoney } from '$lib/core/utils/money';

  // Props definition
  let { estimate, isClassic = false }: { estimate: Estimate, isClassic?: boolean } = $props();

  // 電子印鑑の表示状態 (デフォルトOFF)
  let showSeal = $state(false);

  // =================================================================
  // スタイル定義 (モダン vs クラシック 切り替えロジック)
  // =================================================================
  
  // 1. ベースフォントと文字色
  // 役所向けはMS明朝ベースで統一（標準/クラシック差分は色や罫線の扱い）
  let baseStyle = $derived(isClassic 
    ? "font-ms-mincho text-black" 
    : "font-ms-mincho text-slate-900"
  );

  // 2. 数値用フォント (ここが重要)
  // 数値は体裁を揃えるため明朝体ベースで等幅寄せ
  let numFont = $derived(isClassic
    ? "font-ms-mincho tabular-nums tracking-tight" 
    : "font-ms-mincho tracking-normal"
  );

  // 3. 罫線 (Border) の色
  let borderColor = $derived(isClassic ? "border-black" : "border-slate-800");
  let subBorderColor = $derived(isClassic ? "border-black" : "border-slate-300");

  // 4. テーブルの枠組み
  // モダン: 上下の太線のみ / クラシック: 全セルに枠線 (格子状)
  let tableWrapper = $derived(isClassic ? "border border-black" : "border-y-2 border-slate-800");
  
  // 5. セルの罫線
  // モダン: 下線のみ / クラシック: 右線 + 下線 (Grid)
  let cellBorder = $derived(isClassic 
    ? "border-r border-b border-black last:border-r-0" 
    : "border-b border-slate-200"
  );

  // 6. ヘッダー行の背景
  let headerStyle = $derived(isClassic 
    ? "bg-transparent border-b border-black font-bold font-ms-gothic" 
    : "bg-slate-100 border-y border-slate-800 text-xs font-ms-gothic"
  );

  // 7. 御見積金額のデザイン
  let grandTotalStyle = $derived(isClassic
    ? "border-2 border-black py-2 underline decoration-black decoration-1 underline-offset-4"
    : "border-t-[3px] border-b-[1px] border-slate-800 py-4 bg-slate-50 underline decoration-1 underline-offset-8"
  );

</script>

<!-- A4用紙設定 -->
<div class="w-[210mm] min-h-[297mm] mx-auto bg-white p-[15mm] text-[11pt] leading-relaxed shadow-lg print:shadow-none print:w-full print:h-full print:p-0 print:m-0 relative group {baseStyle}">
  
  <!-- ▼ 印刷プレビュー操作ボタン (画面上のみ表示) -->
    <div class="absolute top-2 right-2 flex gap-2 print:hidden opacity-0 group-hover:opacity-100 transition-opacity z-50">
      <button 
      class="bg-gray-200 text-xs px-2 py-1 rounded hover:bg-gray-300 font-ms-mincho text-slate-800"
      onclick={() => showSeal = !showSeal}
    >
      {showSeal ? '印影OFF' : '印影ON'}
    </button>
  </div>

  <!-- ========================================== -->
  <!-- ヘッダーエリア -->
  <!-- ========================================== -->
  <header class="flex justify-between items-start mb-10 pb-2 border-b-2 {borderColor}">
    <!-- 宛名・工事情報 -->
    <div class="w-7/12 pt-2">
      <p class="text-xs mb-1 ml-1">{estimate.date}</p>
      <h1 class="text-2xl font-bold font-ms-gothic border-b {subBorderColor} inline-block mb-6 pb-1 pr-8">
        {estimate.customerName} <span class="text-base font-normal">様</span>
      </h1>
      <div class="space-y-1 text-sm pl-1">
        <div class="flex items-start">
          <span class="w-24 shrink-0 opacity-70">工事名称：</span>
          <span class="font-medium">{estimate.title}</span>
        </div>
        <div class="flex items-start">
          <span class="w-24 shrink-0 opacity-70">工事場所：</span>
          <span class="break-words w-full pr-4">{estimate.place}</span>
        </div>
      </div>
    </div>

    <!-- 自社情報 (常に明朝体・右寄せ) -->
    <div class="w-5/12 text-right relative">
      <h2 class="text-3xl font-bold mb-4 tracking-[0.3em] font-ms-gothic">御見積書</h2>
      
      <div class="text-xs space-y-1.5">
        <p class="font-bold text-lg tracking-wide font-ms-gothic">西毛建設株式会社</p>
        <p class="text-sm">代表取締役　橳島 努</p>
        <p class="mt-1">〒370-2601</p>
        <!-- 住所は折り返してでも全て表示 -->
        <p class="whitespace-normal break-words leading-tight">
          群馬県甘楽郡下仁田町大字川井109-1
        </p>
        <p>TEL: 0274-82-3366 / FAX: 0274-82-3566</p>
        
        <!-- 建設業許可番号 (必須) -->
        <div class="mt-3 pt-2 border-t {subBorderColor} text-[10px] leading-tight opacity-90">
          <p>群馬県知事 許可（般-xx）第xxxxx号</p>
          <p>産業廃棄物収集運搬業許可 第xxxxxxxx号</p>
        </div>
      </div>

      <!-- 電子印鑑 -->
      {#if showSeal}
        <img 
          src="/hanko.png" 
          class="absolute top-20 right-0 w-20 opacity-80 mix-blend-multiply z-10" 
          alt="社印" 
        />
      {/if}
    </div>
  </header>

  <!-- ========================================== -->
  <!-- 御見積金額 (強調表示) -->
  <!-- ========================================== -->
  <div class="{grandTotalStyle} mb-8 text-center print:bg-transparent">
      <span class="text-lg font-ms-gothic font-bold mr-8 tracking-widest opacity-90">御見積金額 (税込)</span>
    <span class="text-3xl font-bold {numFont} tracking-tight underline decoration-1 underline-offset-8">
      ¥ {formatMoney(estimate.grandTotal)} -
    </span>
  </div>

  <!-- ========================================== -->
  <!-- 明細テーブル -->
  <!-- ========================================== -->
  <div class="w-full overflow-x-auto print:overflow-visible mb-6">
    <table class="w-full min-w-[700px] border-collapse text-sm {tableWrapper}">
      <thead>
        <tr class="{headerStyle} print:bg-transparent">
          <th class="p-2 text-left w-[45%] pl-4 font-ms-gothic {isClassic ? 'border-r border-black' : ''}">工事名 / 摘要</th>
          <th class="p-2 text-center w-[10%] font-ms-gothic {isClassic ? 'border-r border-black' : ''}">数量</th>
          <th class="p-2 text-center w-[10%] font-ms-gothic {isClassic ? 'border-r border-black' : ''}">単位</th>
          <th class="p-2 text-right w-[15%] font-ms-gothic {isClassic ? 'border-r border-black' : ''}">単価</th>
          <th class="p-2 text-right w-[20%] pr-4 font-ms-gothic">金額</th>
        </tr>
      </thead>
      <tbody>
        {#each estimate.sections as section}
          <!-- セクションヘッダー -->
          {#if section.items.length > 0}
            <tr class="break-inside-avoid">
              <td colspan="5" class="pt-4 pb-1 pl-2 font-bold border-b {borderColor} {isClassic ? 'bg-gray-100 print:bg-transparent' : ''}">
                <span class="font-ms-gothic">{section.title}</span>
              </td>
            </tr>
          {/if}
          
          <!-- 明細行 -->
          {#each section.items as item}
            <tr class="break-inside-avoid hover:bg-slate-50 print:hover:bg-transparent">
              <!-- 工事名 -->
              <td class="p-2 pl-6 align-top {cellBorder}">
                <span class="block">{item.name}</span>
                {#if item.note}
                  <span class="block text-[10px] mt-0.5 opacity-70 scale-95 origin-top-left">{item.note}</span>
                {/if}
              </td>
              <!-- 数量 -->
              <td class="p-2 text-center align-top {numFont} {cellBorder}">{item.quantity}</td>
              <!-- 単位 -->
              <td class="p-2 text-center text-xs align-top {cellBorder}">{item.unit}</td>
              <!-- 単価 -->
              <td class="p-2 text-right align-top {numFont} {cellBorder}">{formatMoney(item.unitPrice)}</td>
              <!-- 金額 -->
              <td class="p-2 text-right pr-4 align-top font-bold {numFont} {isClassic ? 'border-b border-black' : 'border-b border-slate-200'}">
                  {formatMoney(item.amount)}
              </td>
            </tr>
          {/each}

          <!-- セクション小計 -->
          {#if section.items.length > 0}
            <tr class="break-inside-avoid border-b-2 {isClassic ? 'border-black border-t' : 'border-slate-400'}">
              <!-- 役所風なら小計欄も罫線で区切る -->
              <td colspan="3" class="{isClassic ? 'border-r border-black' : ''}"></td>
              <td class="p-1 text-center text-xs font-ms-gothic {isClassic ? 'border-r border-black' : 'opacity-60'}">小計</td>
              <td class="p-1 text-right font-bold pr-4 {numFont} opacity-90">{formatMoney(section.subTotal)}</td>
            </tr>
          {/if}
        {/each}
      </tbody>
    </table>
  </div>

  <!-- ========================================== -->
  <!-- 合計計算ブロック (右寄せ・縦積み) -->
  <!-- ========================================== -->
  <div class="flex justify-end break-inside-avoid mb-10">
    <!-- 役所風の場合、合計欄にも枠線を付ける -->
    <div class="w-[55%] text-sm {isClassic ? 'border border-black' : ''}">
      
      <!-- 税抜小計 -->
      <div class="flex justify-between border-b {subBorderColor} py-1.5">
        <span class="pl-2 font-ms-gothic {isClassic ? 'border-r border-black flex-1' : ''}">税抜小計</span>
        <span class="pr-2 w-32 text-right {numFont}">{formatMoney(estimate.baseTotal)}</span>
      </div>
      
      <!-- 値引き -->
      <div class="flex justify-between border-b {subBorderColor} py-1.5 {isClassic ? '' : 'text-red-700'}">
        <span class="pl-2 font-ms-gothic {isClassic ? 'border-r border-black flex-1' : ''}">出精値引き</span>
        <span class="pr-2 w-32 text-right {numFont}">▲ {formatMoney(Math.abs(estimate.discount))}</span>
      </div>
      
      <!-- 工事価格 -->
      <div class="flex justify-between border-b {subBorderColor} py-1.5 font-bold">
        <span class="pl-2 font-ms-gothic {isClassic ? 'border-r border-black flex-1' : ''}">工事価格（税抜）</span>
        <span class="pr-2 w-32 text-right {numFont}">{formatMoney(estimate.constructionPrice)}</span>
      </div>
      
      <!-- 消費税 -->
      <div class="flex justify-between border-b {borderColor} py-1.5 opacity-80">
        <span class="pl-2 font-ms-gothic {isClassic ? 'border-r border-black flex-1' : ''}">消費税 (10%)</span>
        <span class="pr-2 w-32 text-right {numFont}">{formatMoney(estimate.taxAmount)}</span>
      </div>
      
      <!-- 合計欄：二重線で強調 -->
      <div class="flex justify-between border-b-4 border-double {borderColor} py-3 font-bold text-lg bg-slate-50 print:bg-transparent mt-1">
        <span class="pl-2 font-ms-gothic tracking-widest {isClassic ? 'border-r border-black flex-1' : ''}">合計金額</span>
        <span class="pr-2 w-32 text-right {numFont}">¥ {formatMoney(estimate.grandTotal)}</span>
      </div>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- 備考・条件 -->
  <!-- ========================================== -->
  <div class="border {isClassic ? 'border-black' : 'border-slate-400'} p-5 text-xs break-inside-avoid">
    <h3 class="font-bold font-ms-gothic mb-3 border-b {isClassic ? 'border-black' : 'border-dashed border-slate-400'} inline-block text-sm">【 備考・条件 】</h3>
    <ul class="list-disc list-outside ml-4 space-y-1.5 leading-relaxed opacity-90">
      <li>
        <span class="font-bold font-ms-gothic">地中埋設物について：</span>
        浄化槽、井戸、旧基礎、杭、埋設配管等が工事中に発見された場合は、別途協議の上、追加費用を申し受ける場合がございます。
      </li>
      <li>
        <span class="font-bold font-ms-gothic">アスベストについて：</span>
        事前調査に基づく対策費用を含みますが、隠蔽部より新たな石綿含有建材が発見された場合は別途協議となります。
      </li>
      <li>
        <span class="font-bold font-ms-gothic">お客様支給品：</span>
        工事に伴う散水用の水、および電気等のライフライン費用は御支給にてお願いいたします。
      </li>
      <li>
        <span class="font-bold font-ms-gothic">残置物処分：</span>
        屋内残置物（一般廃棄物）の処分費は、地域の許可業者への収集運搬・処分委託費としての計上です。
      </li>
      <li>
        <span class="font-bold font-ms-gothic">支払条件：</span>
        完了後、翌月末現金振込（または別途契約書による）
      </li>
      <li>
        <span class="font-bold font-ms-gothic">有効期限：</span>
        発行日より3ヶ月
      </li>
    </ul>
  </div>

</div>
