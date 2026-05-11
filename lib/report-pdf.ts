import { PDFDocument, PDFFont, rgb, StandardFonts } from 'pdf-lib';

type PdfReportLead = {
  name?: string;
  email: string;
  business?: string;
};

export type PdfReportOptions = {
  lead: PdfReportLead;
  reportFileName: string;
  reportText: string;
  reportTitle: string;
  resultSummary?: Record<string, string | number | boolean | null>;
  sourcePath: string;
  toolName: string;
};

const pageWidth = 595.28;
const pageHeight = 841.89;
const margin = 46;
const accent = rgb(0.988, 0.431, 0.125);
const ink = rgb(0.082, 0.078, 0.098);
const paper = rgb(0.984, 0.984, 0.984);
const muted = rgb(0.408, 0.384, 0.361);
const soft = rgb(0.941, 0.937, 0.929);
const line = rgb(0.87, 0.859, 0.839);

const sectionHeadings = new Set([
  'Action Plan',
  'Category Breakdown',
  'Cost and Timeline',
  'Diagnosis',
  'Executive Summary',
  'Full Check Breakdown',
  'Full Quiz Breakdown',
  'Inputs',
  'Next Step',
  'Priority Fixes',
  'Priority Issues',
  'Quick Win Roadmap',
  'Recommended Fixes',
  'Risks',
  'ROI Estimate',
  'Timeline Estimate',
  'What If You Choose Wrong',
  'What You Get',
  'Why',
]);

function toPdfText(value: string) {
  return value
    .replace(/\u00a0/g, ' ')
    .replace(/[–—]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/×/g, 'x')
    .replace(/[^\x09\x0a\x0d\x20-\x7e]/g, '');
}

function formatSummaryLabel(key: string) {
  return key
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function splitReport(reportText: string) {
  const lines = reportText.split(/\r?\n/);
  const documentTitle = lines.shift()?.trim() || 'Kreative Reflow Report';
  const brandLine = lines.shift()?.trim() || 'Kreative Reflow';
  const meta: string[] = [];
  const sections: Array<{ heading: string; lines: string[] }> = [];
  let current: { heading: string; lines: string[] } | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (sectionHeadings.has(line)) {
      if (current) sections.push(current);
      current = { heading: line, lines: [] };
      continue;
    }

    if (current) {
      current.lines.push(rawLine);
    } else if (line) {
      meta.push(line);
    }
  }

  if (current) sections.push(current);

  return { brandLine, documentTitle, meta, sections };
}

function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number) {
  const cleanText = toPdfText(text).replace(/\s+/g, ' ').trim();
  if (!cleanText) return [];

  const lines: string[] = [];
  let current = '';

  for (const word of cleanText.split(' ')) {
    const next = current ? `${current} ${word}` : word;

    if (font.widthOfTextAtSize(next, fontSize) <= maxWidth) {
      current = next;
      continue;
    }

    if (current) {
      lines.push(current);
      current = word;
      continue;
    }

    let fragment = '';
    for (const letter of word) {
      const nextFragment = `${fragment}${letter}`;
      if (font.widthOfTextAtSize(nextFragment, fontSize) <= maxWidth) {
        fragment = nextFragment;
      } else {
        if (fragment) lines.push(fragment);
        fragment = letter;
      }
    }
    current = fragment;
  }

  if (current) lines.push(current);
  return lines;
}

export function getPdfFileName(fileName: string) {
  const sanitized = fileName.replace(/[^a-z0-9._-]/gi, '-').toLowerCase();
  if (sanitized.endsWith('.pdf')) return sanitized;
  return sanitized.replace(/\.(html?|txt)$/i, '') + '.pdf';
}

export async function createReportPdf({
  lead,
  reportFileName,
  reportText,
  reportTitle,
  resultSummary,
  sourcePath,
  toolName,
}: PdfReportOptions) {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const serif = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const report = splitReport(reportText);
  const summaryRows = Object.entries(resultSummary || {});
  const generatedAt = new Date().toLocaleDateString('en-ZA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  let page = pdf.addPage([pageWidth, pageHeight]);
  let cursorY = pageHeight - margin;

  const addPage = () => {
    page = pdf.addPage([pageWidth, pageHeight]);
    cursorY = pageHeight - margin;
  };

  const ensureSpace = (height: number) => {
    if (cursorY - height < margin + 34) addPage();
  };

  const drawWrappedText = (
    text: string,
    options: {
      color?: ReturnType<typeof rgb>;
      font?: PDFFont;
      fontSize?: number;
      indent?: number;
      lineHeight?: number;
      maxWidth?: number;
    } = {},
  ) => {
    const font = options.font || regular;
    const fontSize = options.fontSize || 10.5;
    const indent = options.indent || 0;
    const lineHeight = options.lineHeight || fontSize * 1.45;
    const maxWidth = options.maxWidth || pageWidth - margin * 2 - indent;
    const lines = wrapText(text, font, fontSize, maxWidth);
    if (lines.length === 0) return;

    ensureSpace(lines.length * lineHeight + 6);
    for (const lineText of lines) {
      page.drawText(lineText, {
        x: margin + indent,
        y: cursorY,
        size: fontSize,
        font,
        color: options.color || rgb(0.24, 0.224, 0.208),
      });
      cursorY -= lineHeight;
    }
    cursorY -= 4;
  };

  const drawHeading = (heading: string) => {
    ensureSpace(52);
    cursorY -= 8;
    page.drawLine({
      start: { x: margin, y: cursorY },
      end: { x: pageWidth - margin, y: cursorY },
      thickness: 0.8,
      color: line,
    });
    cursorY -= 30;
    page.drawText(toPdfText(heading), {
      x: margin,
      y: cursorY,
      size: 22,
      font: serif,
      color: ink,
    });
    cursorY -= 24;
  };

  const drawKeyValue = (lineText: string) => {
    const [label, ...valueParts] = lineText.split(':');
    const value = valueParts.join(':').trim();

    ensureSpace(32);
    page.drawText(toPdfText(label.toUpperCase()), {
      x: margin,
      y: cursorY,
      size: 7.5,
      font: bold,
      color: muted,
    });
    drawWrappedText(value, {
      font: bold,
      fontSize: 10.5,
      indent: 148,
      lineHeight: 14,
      maxWidth: pageWidth - margin * 2 - 148,
      color: ink,
    });
    cursorY += 2;
    page.drawLine({
      start: { x: margin, y: cursorY },
      end: { x: pageWidth - margin, y: cursorY },
      thickness: 0.5,
      color: line,
    });
    cursorY -= 12;
  };

  const drawReportLines = (lines: string[]) => {
    for (const rawLine of lines) {
      const lineText = rawLine.trim();
      if (!lineText) {
        cursorY -= 5;
        continue;
      }

      const ordered = lineText.match(/^(\d+)\.\s+(.*)$/);
      if (ordered?.[1] && ordered[2]) {
        drawWrappedText(`${ordered[1]}. ${ordered[2]}`, {
          indent: 14,
          fontSize: 10.5,
          lineHeight: 15,
        });
        continue;
      }

      if (lineText.startsWith('- ')) {
        drawWrappedText(`- ${lineText.slice(2)}`, {
          indent: 14,
          fontSize: 10.5,
          lineHeight: 15,
        });
        continue;
      }

      if (lineText.includes(':') && lineText.split(':')[0].length <= 42) {
        drawKeyValue(lineText);
        continue;
      }

      drawWrappedText(lineText);
    }
  };

  page.drawRectangle({
    x: 0,
    y: pageHeight - 226,
    width: pageWidth,
    height: 226,
    color: ink,
  });
  page.drawText(toPdfText(toolName.toUpperCase()), {
    x: margin,
    y: pageHeight - 68,
    size: 9,
    font: bold,
    color: accent,
  });

  let titleY = pageHeight - 112;
  const titleLines = wrapText(report.documentTitle || reportTitle, serif, 38, pageWidth - margin * 2);
  for (const lineText of titleLines.slice(0, 3)) {
    page.drawText(lineText, {
      x: margin,
      y: titleY,
      size: 38,
      font: serif,
      color: paper,
    });
    titleY -= 39;
  }

  const metaCards = [
    ['Prepared for', lead.business || lead.name || 'Not provided'],
    ['Generated', generatedAt],
    ['Source', sourcePath],
  ];
  const cardWidth = (pageWidth - margin * 2 - 16) / 3;
  metaCards.forEach(([label, value], index) => {
    const x = margin + index * (cardWidth + 8);
    page.drawRectangle({
      x,
      y: pageHeight - 208,
      width: cardWidth,
      height: 48,
      borderColor: rgb(0.28, 0.28, 0.3),
      borderWidth: 0.7,
      color: rgb(0.11, 0.106, 0.122),
    });
    page.drawText(toPdfText(label.toUpperCase()), {
      x: x + 10,
      y: pageHeight - 180,
      size: 6.8,
      font: bold,
      color: rgb(0.62, 0.62, 0.64),
    });
    page.drawText(wrapText(value, bold, 8.5, cardWidth - 20)[0] || 'Not provided', {
      x: x + 10,
      y: pageHeight - 196,
      size: 8.5,
      font: bold,
      color: paper,
    });
  });

  cursorY = pageHeight - 266;

  if (summaryRows.length > 0) {
    const cardGap = 10;
    const summaryCardWidth = (pageWidth - margin * 2 - cardGap) / 2;
    const summaryCardHeight = 64;

    summaryRows.forEach(([key, value], index) => {
      const row = Math.floor(index / 2);
      const column = index % 2;
      const x = margin + column * (summaryCardWidth + cardGap);
      const y = cursorY - row * (summaryCardHeight + cardGap) - summaryCardHeight;

      page.drawRectangle({
        x,
        y,
        width: summaryCardWidth,
        height: summaryCardHeight,
        borderColor: line,
        borderWidth: 0.8,
        color: rgb(1, 1, 1),
      });
      page.drawText(toPdfText(formatSummaryLabel(key).toUpperCase()), {
        x: x + 12,
        y: y + 41,
        size: 7,
        font: bold,
        color: muted,
      });
      page.drawText(toPdfText(String(value ?? 'Not captured')), {
        x: x + 12,
        y: y + 16,
        size: 20,
        font: serif,
        color: ink,
      });
    });

    cursorY -= Math.ceil(summaryRows.length / 2) * (summaryCardHeight + cardGap) + 8;
  }

  if (report.meta.length > 0) {
    drawHeading('Lead Details');
    drawReportLines(report.meta);
  }

  for (const section of report.sections) {
    drawHeading(section.heading);
    drawReportLines(section.lines);
  }

  const pages = pdf.getPages();
  pages.forEach((pdfPage, index) => {
    pdfPage.drawLine({
      start: { x: margin, y: 34 },
      end: { x: pageWidth - margin, y: 34 },
      thickness: 0.5,
      color: line,
    });
    pdfPage.drawText(toPdfText(report.brandLine || 'Kreative Reflow'), {
      x: margin,
      y: 20,
      size: 8,
      font: bold,
      color: muted,
    });
    pdfPage.drawText(`Page ${index + 1} of ${pages.length}`, {
      x: pageWidth - margin - 58,
      y: 20,
      size: 8,
      font: regular,
      color: muted,
    });
  });

  const pdfBytes = await pdf.save();

  return {
    bytes: pdfBytes,
    fileName: getPdfFileName(reportFileName),
  };
}
