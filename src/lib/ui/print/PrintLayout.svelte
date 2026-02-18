<script lang="ts">
  import type { Estimate } from '$lib/core/models/Estimate.svelte';
  import { formatMoney } from '$lib/core/utils/money';

  // Props definition
  let { estimate, isClassic = true }: { estimate: Estimate, isClassic?: boolean } = $props();

  // 電子印鑑の表示状態 (デフォルトOFF)
  let showSeal = $state(false);

  // Bテーマ（固定）
  const A4_PRINT_TOKENS = {
    b: {
      paper: {
        width: "210mm",
        minHeight: "297mm",
        pagePadding: "15mm",
        pagePrintPadding: "15mm",
        headerColumns: "minmax(0,1fr)_minmax(0,240px)",
        headerGap: "6mm",
        totalWidth: "50%"
      },
      typography: {
        bodyFontSize: "9pt",
        bodyLineHeight: "1.3",
        customerName: "16pt",
        headingMeta: "9pt",
        companyTitle: "11pt",
        permitText: "8pt",
        permitTopSpacing: "0.3rem",
        noteText: "8pt",
        tableText: "9pt",
        sectionTitle: "9.5pt",
        docTitle: "28pt",
        notesTitle: "10pt",
        docTitleTracking: "0.4em",
        headerCustomerBottom: "0.4rem",
        amountValue: "22pt",
        amountLabel: "13pt"
      },
      spacing: {
        tablePadH: "3px",
        tablePadV: "3px",
        headerGapY: "0.3rem",
        headerBottom: "6px",
        footerGap: "0.4rem",
        metaGap: "0.2rem",
        dateGap: "1px",
        headerMetaLeft: "2px",
        tablePadBase: "3px",
        tablePadRightName: "4px",
        tablePadRightAmount: "4px",
        rowSpacing: "1",
        sectionGap: "0.3rem",
        sectionBodyGap: "0.2rem",
        sectionPaddingBottom: "1",
        totalMarginBottom: "8"
      },
      table: {
        cols: {
          name: "30%",
          qty: "8%",
          unit: "8%",
          unitPrice: "12%",
          amount: "18%",
          note: "24%"
        }
      }
    }
  } as const;

  const tokens = A4_PRINT_TOKENS.b;
  let cssVars = $derived(`
    --a4-paper-width:${tokens.paper.width};
    --a4-paper-height:${tokens.paper.minHeight};
    --a4-paper-pad:${tokens.paper.pagePadding};
    --a4-paper-print-pad:${tokens.paper.pagePrintPadding};
    --a4-header-columns:${tokens.paper.headerColumns};
    --a4-header-gap:${tokens.paper.headerGap};
    --a4-total-width:${tokens.paper.totalWidth};
    --a4-font-body:${tokens.typography.bodyFontSize};
    --a4-lh-body:${tokens.typography.bodyLineHeight};
    --a4-font-customer:${tokens.typography.customerName};
    --a4-font-meta:${tokens.typography.headingMeta};
    --a4-font-company:${tokens.typography.companyTitle};
    --a4-font-permit:${tokens.typography.permitText};
    --a4-permit-pt:${tokens.typography.permitTopSpacing};
    --a4-font-note:${tokens.typography.noteText};
    --a4-font-table:${tokens.typography.tableText};
    --a4-font-doc-title:${tokens.typography.docTitle};
    --a4-font-notes-title:${tokens.typography.notesTitle};
    --a4-track-doc-title:${tokens.typography.docTitleTracking};
    --a4-customer-bottom:${tokens.typography.headerCustomerBottom};
    --a4-font-amount:${tokens.typography.amountValue};
    --a4-font-amount-label:${tokens.typography.amountLabel};
    --a4-section-size:${tokens.typography.sectionTitle};
    --a4-pad-base:${tokens.spacing.tablePadBase};
    --a4-pad-h:${tokens.spacing.tablePadH};
    --a4-pad-v:${tokens.spacing.tablePadV};
    --a4-pad-right-name:${tokens.spacing.tablePadRightName};
    --a4-pad-right-amount:${tokens.spacing.tablePadRightAmount};
    --a4-meta-gap:${tokens.spacing.metaGap};
    --a4-date-gap:${tokens.spacing.dateGap};
    --a4-header-meta-left:${tokens.spacing.headerMetaLeft};
    --a4-section-gap:${tokens.spacing.sectionGap};
    --a4-section-body-gap:${tokens.spacing.sectionBodyGap};
    --a4-header-bottom:${tokens.spacing.headerBottom};
    --a4-footer-gap:${tokens.spacing.footerGap};
    --a4-row-spacing:${tokens.spacing.rowSpacing};
    --a4-section-pad-bottom:${tokens.spacing.sectionPaddingBottom};
    --a4-total-margin:${tokens.spacing.totalMarginBottom};
    --a4-col-name:${tokens.table.cols.name};
    --a4-col-qty:${tokens.table.cols.qty};
    --a4-col-unit:${tokens.table.cols.unit};
    --a4-col-unitPrice:${tokens.table.cols.unitPrice};
    --a4-col-amount:${tokens.table.cols.amount};
    --a4-col-note:${tokens.table.cols.note};
  `);

  // =================================================================
  // スタイル定義 (Bテーマ固定)
  // =================================================================
  const baseStyle = "font-ms-mincho text-black";
  const numFont = "font-ms-mincho tabular-nums tracking-normal";
  const borderColor = "border-black";
  const subBorderColor = "border-black";
  const tableWrapper = "border border-black";
  const cellBorder = "border-r border-b border-black last:border-r-0";
  const headerStyle = "bg-transparent border-b border-black font-bold font-ms-gothic";
  const totalLabelClass = "font-ms-gothic font-bold opacity-90";
  const grandTotalLineLabelClass = "pl-2 font-ms-gothic";
  const grandTotalStyle = "border border-black py-2";

  let rootStyle = $derived(`
    ${cssVars};
    width: var(--a4-paper-width);
    min-height: var(--a4-paper-height);
    padding: var(--a4-paper-pad);
    margin: 0;
    box-sizing: border-box;
    font-family: var(--app-serif-font);
    font-size: var(--a4-font-body);
    line-height: var(--a4-lh-body);
  `);
  const themeClass = "is-classic-estimate";
  const sectionHeadingClass = "pb-1 pl-2 font-bold border-b border-black";
  const detailsHoverClass = "";
  const tableTextClass = "text-[10.5pt]";
  const subtotalAccentClass = "";
  const docTitleClass = "text-[32pt] font-bold mb-4 tracking-[0.22em] font-ms-gothic leading-none text-right";

</script>

<!-- A4用紙設定 -->
<div class="mx-auto bg-white shadow-lg overflow-visible relative group {baseStyle} {themeClass}" style={rootStyle}>
  
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
  <header class="mb-6">

    <!-- ① 御見積書タイトル（全幅・中央） -->
    <div class="text-center mb-4">
      <h2 class="font-bold font-ms-gothic inline-block" style="font-size: var(--a4-font-doc-title); letter-spacing: var(--a4-track-doc-title); line-height: 1;">御 見 積 書</h2>
    </div>

    <!-- ② 区切り線 -->
    <hr class="border-t-2 border-black mb-4" />

    <!-- ③ 2カラム：宛名・工事情報 ／ 自社情報 -->
    <div class="grid items-start pb-3 border-b-2 {borderColor}" style="grid-template-columns: var(--a4-header-columns); column-gap: var(--a4-header-gap);">

      <!-- 宛名・工事情報 -->
      <div class="min-w-0 pt-1">
        <p class="mb-1 ml-1" style="font-size: var(--a4-font-meta); margin-bottom: var(--a4-date-gap);">{estimate.date}</p>
        <h1 class="font-bold font-ms-gothic border-b {subBorderColor} inline-block pb-1 pr-8" style="font-size: var(--a4-font-customer); margin-bottom: var(--a4-customer-bottom);">
          {estimate.customerName} <span class="text-base font-normal">様</span>
        </h1>
        <div class="pl-1 mt-1" style="display:grid; gap: var(--a4-meta-gap); font-size: var(--a4-font-meta);">
          <div class="flex items-start">
            <span class="w-24 shrink-0 opacity-70" style="margin-left: var(--a4-header-meta-left);">工事名称：</span>
            <span class="font-medium">{estimate.title}</span>
          </div>
          <div class="flex items-start">
            <span class="w-24 shrink-0 opacity-70" style="margin-left: var(--a4-header-meta-left);">工事場所：</span>
            <span class="break-words w-full pr-4">{estimate.place}</span>
          </div>
        </div>
      </div>

      <!-- 自社情報（右寄せ・上揃え） -->
      <div class="min-w-0 text-right relative pt-1">
        <div class="leading-tight" style="display:grid; gap: var(--a4-meta-gap); font-size: var(--a4-font-table);">
          <p class="font-bold tracking-wide font-ms-gothic" style="font-size: var(--a4-font-company);">西毛建設株式会社</p>
          <p>代表取締役　橳島　努</p>
          <p class="mt-1">〒370-2601</p>
          <p class="whitespace-normal break-words leading-tight">
            群馬県甘楽郡下仁田町大字川井109-1
          </p>
          <p>TEL: 0274-82-3366 / FAX: 0274-82-3566</p>
          <!-- 建設業許可番号 -->
          <div class="pt-1 border-t {subBorderColor} leading-tight opacity-90" style="font-size: var(--a4-font-permit); margin-top: var(--a4-permit-pt);">
            <p>群馬県知事 許可（般-xx）第xxxxx号</p>
            <p>産業廃棄物収集運搬業許可 第xxxxxxxx号</p>
          </div>
        </div>

        <!-- 電子印鑑 -->
        {#if showSeal}
          <img
            src="/hanko.png"
            class="absolute top-0 right-0 w-20 opacity-80 mix-blend-multiply z-10"
            alt="社印"
          />
        {/if}
      </div>

    </div>
  </header>

  <!-- ========================================== -->
  <!-- 御見積金額 (強調表示) -->
  <!-- ========================================== -->
  <div class="{grandTotalStyle} mb-8 flex items-center justify-center gap-6">
    <span class="{totalLabelClass}" style="font-size: var(--a4-font-amount-label);">御見積金額 (税込)</span>
    <span class="font-bold {numFont} tracking-tight" style="font-size: var(--a4-font-amount);">
      ¥ {formatMoney(estimate.grandTotal)} -
    </span>
  </div>

  <!-- ========================================== -->
  <!-- 明細テーブル -->
  <!-- ========================================== -->
  <div class="w-full overflow-visible mb-6">
    <table class="w-full min-w-full border-collapse table-fixed {tableTextClass} {tableWrapper}">
      <colgroup>
        <col style="width: var(--a4-col-name);">
        <col style="width: var(--a4-col-qty);">
        <col style="width: var(--a4-col-unit);">
        <col style="width: var(--a4-col-unitPrice);">
        <col style="width: var(--a4-col-amount);">
        <col style="width: var(--a4-col-note);">
      </colgroup>
      <thead>
        <tr class="{headerStyle}">
          <th class="text-left pl-2.5 font-ms-gothic border-r border-black" style="padding: var(--a4-pad-v) var(--a4-pad-h);font-size: var(--a4-font-table);">工事名 / 摘要</th>
          <th class="text-center font-ms-gothic border-r border-black" style="padding: var(--a4-pad-v) var(--a4-pad-h);font-size: var(--a4-font-table);">数量</th>
          <th class="text-center font-ms-gothic border-r border-black" style="padding: var(--a4-pad-v) var(--a4-pad-h);font-size: var(--a4-font-table);">単位</th>
          <th class="text-right font-ms-gothic border-r border-black" style="padding: var(--a4-pad-v) var(--a4-pad-h);font-size: var(--a4-font-table);">単価</th>
          <th class="text-right font-ms-gothic border-r border-black" style="padding: var(--a4-pad-v) var(--a4-pad-right-amount);font-size: var(--a4-font-table);">金額</th>
          <th class="text-left pl-2 font-ms-gothic" style="padding: var(--a4-pad-v) var(--a4-pad-h);font-size: var(--a4-font-table);">備考</th>
        </tr>
      </thead>
      <tbody>
        {#each estimate.sections as section}
          <!-- セクションヘッダー -->
          {#if section.items.length > 0}
            <tr class="break-inside-avoid">
              <td colspan="6" class="{sectionHeadingClass}" style="padding-top: var(--a4-section-gap); padding-bottom: var(--a4-section-body-gap);">
                <span class="font-ms-gothic" style="font-size: var(--a4-section-size);">{section.title}</span>
              </td>
            </tr>
          {/if}

          <!-- 明細行 -->
          {#each section.items as item}
            <tr class="break-inside-avoid {detailsHoverClass}">
              <!-- 工事名 -->
              <td class="pl-2 align-top {cellBorder}" style="padding: var(--a4-pad-v) var(--a4-pad-h); font-size: var(--a4-font-table);">
                {item.name}
              </td>
              <!-- 数量 -->
              <td class="text-center align-top {numFont} {cellBorder}" style="padding: var(--a4-pad-v) var(--a4-pad-h);font-size: var(--a4-font-table);">{item.quantity}</td>
              <!-- 単位 -->
              <td class="text-center align-top {numFont} {cellBorder}" style="padding: var(--a4-pad-v) var(--a4-pad-h);font-size: var(--a4-font-table);">{item.unit}</td>
              <!-- 単価 -->
              <td class="text-right align-top {numFont} {cellBorder}" style="padding: var(--a4-pad-v) var(--a4-pad-h);font-size: var(--a4-font-table);">{formatMoney(item.unitPrice)}</td>
              <!-- 金額 -->
              <td class="text-right align-top font-bold {numFont} {cellBorder}" style="padding: var(--a4-pad-v) var(--a4-pad-right-amount);font-size: var(--a4-font-table);">
                {formatMoney(item.amount)}
              </td>
              <!-- 備考 -->
              <td class="pl-2 align-top border-b border-black" style="padding: var(--a4-pad-v) var(--a4-pad-h); font-size: var(--a4-font-note); opacity: 0.8;">
                {item.note}
              </td>
            </tr>
          {/each}

          <!-- セクション小計 -->
          {#if section.items.length > 0}
            <tr class="break-inside-avoid border-b-2 border-black border-t">
              <td colspan="3" class="border-r border-black"></td>
              <td class="p-1 text-center text-xs font-ms-gothic border-r border-black">小計</td>
              <td class="p-1 text-right font-bold pr-4 {numFont} border-b border-black opacity-90">{formatMoney(section.subTotal)}</td>
              <td class="border-b border-black"></td>
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
    <div class="border border-black" style="width: var(--a4-total-width); font-size: var(--a4-font-table);">
      
      <!-- 税抜小計 -->
      <div class="flex justify-between border-b {subBorderColor} py-1.5">
        <span class="pl-2 font-ms-gothic border-r border-black flex-1">税抜小計</span>
        <span class="pr-2 w-32 text-right {numFont}">{formatMoney(estimate.baseTotal)}</span>
      </div>
      
      <!-- 値引き -->
      <div class="flex justify-between border-b border-black py-1.5">
        <span class="pl-2 font-ms-gothic border-r border-black flex-1">出精値引き</span>
        <span class="pr-2 w-32 text-right {numFont}">▲ {formatMoney(Math.abs(estimate.discount))}</span>
      </div>
      
      <!-- 工事価格 -->
      <div class="flex justify-between border-b {subBorderColor} py-1.5 font-bold">
        <span class="pl-2 font-ms-gothic border-r border-black flex-1">工事価格（税抜）</span>
        <span class="pr-2 w-32 text-right {numFont}">{formatMoney(estimate.constructionPrice)}</span>
      </div>
      
      <!-- 消費税 -->
      <div class="flex justify-between border-b {borderColor} py-1.5 opacity-80">
        <span class="pl-2 font-ms-gothic border-r border-black flex-1">消費税 (10%)</span>
        <span class="pr-2 w-32 text-right {numFont}">{formatMoney(estimate.taxAmount)}</span>
      </div>
      
      <!-- 合計欄：二重線で強調 -->
      <div class="flex justify-between border-b-4 border-double {borderColor} py-3 font-bold {subtotalAccentClass} mt-1" style="padding-left: 0;padding-right: 0;">
        <span class="{grandTotalLineLabelClass} border-r border-black flex-1">合計金額</span>
        <span class="pr-2 w-32 text-right {numFont}">¥ {formatMoney(estimate.grandTotal)}</span>
      </div>
    </div>
  </div>

  <!-- ========================================== -->
  <!-- 備考・条件 -->
  <!-- ========================================== -->
  <div class="border border-black p-5 break-inside-avoid" style="font-size: var(--a4-font-note);">
    <h3 class="font-bold font-ms-gothic mb-3 border-b border-black inline-block" style="font-size: var(--a4-font-notes-title);">【 備考・条件 】</h3>
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
