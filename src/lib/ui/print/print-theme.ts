export const PRINT_TOKENS = {
  b: {
    paper: {
      width: '210mm',
      minHeight: '297mm',
      pagePadding: '15mm',
      pagePrintPadding: '15mm',
      headerColumns: 'minmax(0,1fr) minmax(0,240px)',
      headerGap: '6mm',
      totalWidth: '50%'
    },
    typography: {
      bodyFontSize: '11pt',
      bodyLineHeight: '1.4',
      customerName: '16pt',
      headingMeta: '9pt',
      companyTitle: '11pt',
      permitText: '8pt',
      permitTopSpacing: '0.3rem',
      noteText: '10pt',
      tableText: '11pt',
      sectionTitle: '10.5pt',
      docTitle: '22pt',
      notesTitle: '10pt',
      docTitleTracking: '0.4em',
      headerCustomerBottom: '0.4rem',
      amountValue: '22pt',
      amountLabel: '14pt',
      grandTotalFontSize: '10.5pt'
    },
    spacing: {
      tablePadH: '3px',
      tablePadV: '3px',
      headerGapY: '0.3rem',
      headerBottom: '6px',
      footerGap: '0.4rem',
      metaGap: '0.2rem',
      dateGap: '1px',
      headerMetaLeft: '2px',
      tablePadBase: '3px',
      tablePadRightName: '4px',
      tablePadRightAmount: '4px',
      rowSpacing: '1',
      sectionGap: '0.3rem',
      sectionBodyGap: '0.2rem',
      sectionPaddingBottom: '1',
      sectionHeadingPb: '2px',
      sectionHeadingPl: '4px',
      grandTotalPyOuter: '3mm',
      totalMarginBottom: '8',
      headerMb: '6mm',
      titlePb: '3mm',
      titleMb: '3mm',
      gridPb: '3mm',
      dateMb: '1mm',
      customerNamePb: '1mm',
      customerNamePr: '20mm',
      metaGridMt: '1mm',
      metaLabelW: '6rem',
      amountPx: '4mm',
      amountMb: '4mm',
      tableMb: '5mm',
      totalBlockMb: '8mm',
      totalRowPy: '1.5mm',
      totalAmountW: '35mm',
      totalAmountPr: '2mm',
      grandTotalPy: '2.5mm',
      notesPad: '6mm',
      notesListMl: '4mm',
      notesListGap: '1.5mm',
      subtotalCellPad: '1mm',
      subtotalAmountPr: '3mm'
    },
    table: {
      cols: {
        name: '28%',
        qty: '8%',
        unit: '7%',
        unitPrice: '13%',
        amount: '20%',
        note: '24%'
      }
    }
  }
} as const;

export type PrintTokens = keyof typeof PRINT_TOKENS;

export const resolvePrintTokens = (theme: PrintTokens = 'b') => PRINT_TOKENS[theme];
