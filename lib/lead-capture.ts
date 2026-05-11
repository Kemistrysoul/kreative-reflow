export type LeadCaptureLead = {
  name?: string;
  email: string;
  business?: string;
};

export type LeadDeliveryStatus = {
  channel: string;
  status: 'sent' | 'skipped' | 'failed';
  detail: string;
};

export type LeadCaptureResponse = {
  ok: boolean;
  leadId: string;
  delivery: LeadDeliveryStatus[];
  message: string;
};

export type ToolReportLeadPayload = {
  type: 'tool-report';
  toolId: string;
  toolName: string;
  sourcePath: string;
  lead: LeadCaptureLead;
  reportTitle: string;
  reportFileName: string;
  reportText: string;
  reportHtml?: string;
  resultSummary?: Record<string, string | number | boolean | null>;
};

export type ContactLeadPayload = {
  type: 'contact';
  sourcePath: string;
  lead: LeadCaptureLead;
  service: string;
  timeline: string;
  budget: string;
  message: string;
};

export type LeadCapturePayload = ToolReportLeadPayload | ContactLeadPayload;

export async function submitLeadCapture(
  payload: LeadCapturePayload,
): Promise<LeadCaptureResponse> {
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const result = (await response.json().catch(() => null)) as
    | LeadCaptureResponse
    | { message?: string }
    | null;

  if (!response.ok || !result || !('ok' in result)) {
    throw new Error(
      result?.message || 'The report could not be unlocked. Please try again.',
    );
  }

  return result;
}

export function getLeadCaptureErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Something went wrong while preparing the report. Please try again.';
}

function getFileNameFromDisposition(header: string | null) {
  const match = header?.match(/filename="([^"]+)"/i);
  return match?.[1] || '';
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function downloadPdfReport(payload: ToolReportLeadPayload) {
  const response = await fetch('/api/reports/pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const result = (await response.json().catch(() => null)) as
      | { message?: string }
      | null;

    throw new Error(
      result?.message || 'The report PDF could not be prepared. Please try again.',
    );
  }

  const blob = await response.blob();
  const fileName =
    getFileNameFromDisposition(response.headers.get('content-disposition')) ||
    payload.reportFileName.replace(/\.(html?|txt)$/i, '.pdf');

  downloadBlob(blob, fileName);
}

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

type BrandedReportOptions = {
  reportText: string;
  reportTitle: string;
  toolName: string;
  lead: LeadCaptureLead;
  sourcePath: string;
  resultSummary?: Record<string, string | number | boolean | null>;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatSummaryLabel(key: string) {
  return key
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatReportLine(line: string) {
  const [label, ...valueParts] = line.split(':');

  if (valueParts.length > 0 && label.length <= 42) {
    return `<div class="kv-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(
      valueParts.join(':').trim(),
    )}</strong></div>`;
  }

  return `<p>${escapeHtml(line)}</p>`;
}

function renderReportLines(lines: string[]) {
  const html: string[] = [];
  let orderedItems: string[] = [];
  let unorderedItems: string[] = [];

  const flushOrdered = () => {
    if (orderedItems.length === 0) return;
    html.push(`<ol>${orderedItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ol>`);
    orderedItems = [];
  };

  const flushUnordered = () => {
    if (unorderedItems.length === 0) return;
    html.push(`<ul>${unorderedItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`);
    unorderedItems = [];
  };

  for (const line of lines) {
    if (!line.trim()) {
      flushOrdered();
      flushUnordered();
      continue;
    }

    const orderedMatch = line.match(/^\d+\.\s+(.*)$/);
    if (orderedMatch?.[1]) {
      flushUnordered();
      orderedItems.push(orderedMatch[1]);
      continue;
    }

    if (line.startsWith('- ')) {
      flushOrdered();
      unorderedItems.push(line.slice(2));
      continue;
    }

    flushOrdered();
    flushUnordered();
    html.push(formatReportLine(line));
  }

  flushOrdered();
  flushUnordered();

  return html.join('\n');
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

export function buildBrandedReportHtml({
  lead,
  reportText,
  reportTitle,
  resultSummary,
  sourcePath,
  toolName,
}: BrandedReportOptions) {
  const report = splitReport(reportText);
  const generatedAt = new Date().toLocaleDateString('en-ZA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const summaryRows = Object.entries(resultSummary || {});

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(reportTitle)} | Kreative Reflow</title>
  <style>
    :root {
      color-scheme: light;
      --ink: #151419;
      --paper: #fbfbfb;
      --soft: #f0efed;
      --muted: #68625c;
      --line: #dedbd6;
      --accent: #fc6e20;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--soft);
      color: var(--ink);
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.65;
    }
    .page {
      width: min(980px, calc(100% - 32px));
      margin: 28px auto;
      background: var(--paper);
      border: 1px solid var(--line);
      box-shadow: 0 24px 80px rgba(21, 20, 25, 0.12);
    }
    .hero {
      background: var(--ink);
      color: var(--paper);
      padding: 44px;
      position: relative;
      overflow: hidden;
    }
    .hero::after {
      content: "";
      position: absolute;
      inset: 0;
      background-image: linear-gradient(90deg, rgba(251,251,251,.08) 1px, transparent 1px), linear-gradient(180deg, rgba(251,251,251,.06) 1px, transparent 1px);
      background-size: 72px 72px;
      pointer-events: none;
    }
    .hero > * { position: relative; z-index: 1; }
    .eyebrow {
      color: var(--accent);
      font-size: 12px;
      font-weight: 800;
      letter-spacing: .22em;
      margin: 0 0 18px;
      text-transform: uppercase;
    }
    h1 {
      font-family: Georgia, "Times New Roman", serif;
      font-size: clamp(42px, 7vw, 78px);
      line-height: .92;
      letter-spacing: -0.01em;
      margin: 0;
      max-width: 820px;
    }
    .hero-meta {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(3, 1fr);
      margin-top: 34px;
    }
    .meta-card {
      border: 1px solid rgba(251,251,251,.14);
      padding: 16px;
      background: rgba(251,251,251,.045);
    }
    .meta-card span {
      display: block;
      color: rgba(251,251,251,.52);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: .16em;
      text-transform: uppercase;
    }
    .meta-card strong {
      display: block;
      color: var(--paper);
      font-size: 14px;
      margin-top: 8px;
    }
    .content { padding: 34px 44px 44px; }
    .summary-grid {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(3, 1fr);
      margin-bottom: 28px;
    }
    .summary-grid:empty { display: none; }
    .summary-item {
      border: 1px solid var(--line);
      padding: 16px;
      background: #fff;
    }
    .summary-item span {
      color: var(--muted);
      display: block;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: .14em;
      text-transform: uppercase;
    }
    .summary-item strong {
      display: block;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 26px;
      line-height: 1.05;
      margin-top: 8px;
    }
    section {
      border-top: 1px solid var(--line);
      padding: 28px 0 4px;
      break-inside: avoid;
    }
    h2 {
      font-family: Georgia, "Times New Roman", serif;
      font-size: 34px;
      line-height: 1;
      margin: 0 0 18px;
    }
    p { margin: 0 0 14px; color: #3d3935; }
    ol, ul { margin: 0 0 18px 22px; padding: 0; }
    li { margin: 0 0 10px; color: #3d3935; }
    .kv-row {
      align-items: baseline;
      border-bottom: 1px solid rgba(21,20,25,.09);
      display: grid;
      gap: 16px;
      grid-template-columns: minmax(140px, .42fr) 1fr;
      padding: 10px 0;
    }
    .kv-row span {
      color: var(--muted);
      font-size: 12px;
      font-weight: 800;
      letter-spacing: .08em;
      text-transform: uppercase;
    }
    .kv-row strong {
      color: var(--ink);
      font-weight: 700;
    }
    .footer {
      border-top: 1px solid var(--line);
      color: var(--muted);
      display: flex;
      gap: 18px;
      justify-content: space-between;
      padding: 22px 44px;
      font-size: 12px;
    }
    .print-actions {
      display: flex;
      justify-content: flex-end;
      padding: 18px 44px 0;
    }
    .print-actions button {
      border: 0;
      border-radius: 999px;
      background: var(--accent);
      color: var(--ink);
      cursor: pointer;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: .12em;
      min-height: 42px;
      padding: 0 18px;
      text-transform: uppercase;
    }
    @media (max-width: 720px) {
      .hero, .content, .footer { padding-left: 22px; padding-right: 22px; }
      .hero-meta, .summary-grid { grid-template-columns: 1fr; }
      .kv-row { grid-template-columns: 1fr; gap: 4px; }
      .print-actions { padding-left: 22px; padding-right: 22px; }
    }
    @page { margin: 14mm; }
    @media print {
      body { background: #fff; }
      .page { width: 100%; margin: 0; box-shadow: none; border: 0; }
      .print-actions { display: none; }
      .hero { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <main class="page">
    <div class="print-actions"><button onclick="window.print()">Save as PDF</button></div>
    <header class="hero">
      <p class="eyebrow">${escapeHtml(toolName)}</p>
      <h1>${escapeHtml(report.documentTitle || reportTitle)}</h1>
      <div class="hero-meta">
        <div class="meta-card"><span>Prepared for</span><strong>${escapeHtml(
          lead.business || lead.name || 'Not provided',
        )}</strong></div>
        <div class="meta-card"><span>Generated</span><strong>${escapeHtml(generatedAt)}</strong></div>
        <div class="meta-card"><span>Source</span><strong>${escapeHtml(sourcePath)}</strong></div>
      </div>
    </header>
    <div class="content">
      <div class="summary-grid">
        ${summaryRows
          .map(
            ([key, value]) =>
              `<div class="summary-item"><span>${escapeHtml(formatSummaryLabel(key))}</span><strong>${escapeHtml(
                String(value ?? 'Not captured'),
              )}</strong></div>`,
          )
          .join('')}
      </div>
      ${report.meta.length ? `<section><h2>Lead Details</h2>${renderReportLines(report.meta)}</section>` : ''}
      ${report.sections
        .map(
          (section) =>
            `<section><h2>${escapeHtml(section.heading)}</h2>${renderReportLines(section.lines)}</section>`,
        )
        .join('\n')}
    </div>
    <footer class="footer">
      <span>${escapeHtml(report.brandLine)}</span>
      <span>kreativereflow.com</span>
    </footer>
  </main>
</body>
</html>`;
}

export function downloadHtmlReport(reportHtml: string, fileName: string) {
  downloadBlob(new Blob([reportHtml], { type: 'text/html;charset=utf-8' }), fileName);
}
