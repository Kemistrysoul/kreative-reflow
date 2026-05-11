import { NextRequest, NextResponse } from 'next/server';
import { createReportPdf } from '@/lib/report-pdf';

export const runtime = 'nodejs';

type ReportLead = {
  name?: string;
  email: string;
  business?: string;
};

const validToolIds = new Set([
  'website-lead-leak-scorecard',
  'local-visibility-scorecard',
  'lead-response-leak-calculator',
  'website-rebuild-vs-refresh-quiz',
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function parseLead(value: unknown): ReportLead | null {
  if (!isRecord(value)) return null;

  const email = asString(value.email).toLowerCase();
  if (!isEmail(email)) return null;

  return {
    name: asString(value.name),
    email,
    business: asString(value.business),
  };
}

function parseResultSummary(value: unknown) {
  if (!isRecord(value)) return undefined;

  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => {
      return (
        typeof item === 'string' ||
        typeof item === 'number' ||
        typeof item === 'boolean' ||
        item === null
      );
    }),
  ) as Record<string, string | number | boolean | null>;
}

function parseReportPayload(body: unknown) {
  if (!isRecord(body)) return null;

  const type = asString(body.type);
  const toolId = asString(body.toolId);
  const toolName = asString(body.toolName);
  const sourcePath = asString(body.sourcePath);
  const lead = parseLead(body.lead);
  const reportTitle = asString(body.reportTitle);
  const reportFileName = asString(body.reportFileName);
  const reportText = asString(body.reportText);

  if (
    type !== 'tool-report' ||
    !validToolIds.has(toolId) ||
    !toolName ||
    !sourcePath.startsWith('/') ||
    !lead ||
    !reportTitle ||
    !reportFileName ||
    reportText.length < 100 ||
    reportText.length > 75000
  ) {
    return null;
  }

  return {
    lead,
    reportFileName,
    reportText,
    reportTitle,
    resultSummary: parseResultSummary(body.resultSummary),
    sourcePath,
    toolName,
  };
}

export async function POST(request: NextRequest) {
  const payload = parseReportPayload(await request.json().catch(() => null));

  if (!payload) {
    return NextResponse.json(
      { message: 'The report PDF could not be prepared. Please try again.' },
      { status: 400 },
    );
  }

  const reportPdf = await createReportPdf(payload);

  return new NextResponse(Buffer.from(reportPdf.bytes), {
    headers: {
      'Cache-Control': 'no-store',
      'Content-Disposition': `attachment; filename="${reportPdf.fileName}"`,
      'Content-Type': 'application/pdf',
    },
  });
}
