import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createReportPdf } from '@/lib/report-pdf';
import { siteName } from '@/lib/seo';

export const runtime = 'nodejs';

type LeadCaptureLead = {
  name?: string;
  email: string;
  business?: string;
};

type ToolReportPayload = {
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

type ContactPayload = {
  type: 'contact';
  sourcePath: string;
  lead: LeadCaptureLead;
  service: string;
  timeline: string;
  budget: string;
  message: string;
};

type LeadPayload = ToolReportPayload | ContactPayload;

type LeadRecord = LeadPayload & {
  id: string;
  submittedAt: string;
  userAgent: string | null;
  referrer: string | null;
};

type DeliveryStatus = {
  channel: string;
  status: 'sent' | 'skipped' | 'failed';
  detail: string;
};

type EmailAttachment = {
  filename: string;
  content: string;
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

function sanitizeFileName(value: string) {
  return value.replace(/[^a-z0-9._-]/gi, '-').toLowerCase();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseLead(value: unknown): LeadCaptureLead | null {
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

function parsePayload(body: unknown): LeadPayload | null {
  if (!isRecord(body)) return null;

  const type = asString(body.type);
  const lead = parseLead(body.lead);
  const sourcePath = asString(body.sourcePath);

  if (!lead || !sourcePath.startsWith('/')) return null;

  if (type === 'tool-report') {
    const toolId = asString(body.toolId);
    const toolName = asString(body.toolName);
    const reportTitle = asString(body.reportTitle);
    const reportFileName = sanitizeFileName(asString(body.reportFileName));
    const reportText = asString(body.reportText);
    const reportHtml = asString(body.reportHtml);

    if (
      !validToolIds.has(toolId) ||
      !toolName ||
      !reportTitle ||
      !reportFileName ||
      reportText.length < 100 ||
      reportText.length > 75000 ||
      (reportHtml && (reportHtml.length < 500 || reportHtml.length > 150000))
    ) {
      return null;
    }

    return {
      type,
      toolId,
      toolName,
      sourcePath,
      lead,
      reportTitle,
      reportFileName,
      reportText,
      reportHtml: reportHtml || undefined,
      resultSummary: parseResultSummary(body.resultSummary),
    };
  }

  if (type === 'contact') {
    const message = asString(body.message);
    const service = asString(body.service);
    const timeline = asString(body.timeline);
    const budget = asString(body.budget);

    if (!message || message.length > 5000 || !service || !timeline || !budget) {
      return null;
    }

    return {
      type,
      sourcePath,
      lead,
      service,
      timeline,
      budget,
      message,
    };
  }

  return null;
}

function getCaptureDir() {
  return (
    process.env.LEAD_CAPTURE_DIR ||
    (process.env.VERCEL
      ? '/tmp/kreative-reflow-leads'
      : path.join(process.cwd(), '.lead-captures'))
  );
}

async function storeLead(record: LeadRecord): Promise<DeliveryStatus> {
  try {
    const dir = getCaptureDir();
    await mkdir(dir, { recursive: true });
    await appendFile(
      path.join(dir, 'leads.jsonl'),
      `${JSON.stringify(record)}\n`,
      'utf8',
    );

    return {
      channel: 'local_store',
      status: 'sent',
      detail: `Captured in ${dir}`,
    };
  } catch (error) {
    return {
      channel: 'local_store',
      status: 'failed',
      detail: error instanceof Error ? error.message : 'Could not store lead',
    };
  }
}

async function sendWebhook(record: LeadRecord): Promise<DeliveryStatus> {
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;

  if (!webhookUrl) {
    return {
      channel: 'webhook',
      status: 'skipped',
      detail: 'LEAD_WEBHOOK_URL is not configured',
    };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.LEAD_WEBHOOK_SECRET
          ? { Authorization: `Bearer ${process.env.LEAD_WEBHOOK_SECRET}` }
          : {}),
      },
      body: JSON.stringify(record),
    });

    if (!response.ok) {
      throw new Error(`Webhook responded with ${response.status}`);
    }

    return {
      channel: 'webhook',
      status: 'sent',
      detail: 'Sent to configured lead webhook',
    };
  } catch (error) {
    return {
      channel: 'webhook',
      status: 'failed',
      detail: error instanceof Error ? error.message : 'Webhook delivery failed',
    };
  }
}

function ownerEmailText(record: LeadRecord) {
  if (record.type === 'contact') {
    return [
      `New ${siteName} contact enquiry`,
      '',
      `Lead ID: ${record.id}`,
      `Submitted: ${record.submittedAt}`,
      `Name: ${record.lead.name || 'Not provided'}`,
      `Email: ${record.lead.email}`,
      `Business: ${record.lead.business || 'Not provided'}`,
      `Service: ${record.service}`,
      `Timeline: ${record.timeline}`,
      `Budget: ${record.budget}`,
      '',
      'Message:',
      record.message,
    ].join('\n');
  }

  return [
    `New ${record.toolName} lead`,
    '',
    `Lead ID: ${record.id}`,
    `Submitted: ${record.submittedAt}`,
    `Name: ${record.lead.name || 'Not provided'}`,
    `Email: ${record.lead.email}`,
    `Business: ${record.lead.business || 'Not provided'}`,
    `Source: ${record.sourcePath}`,
    '',
    'Result summary:',
    ...Object.entries(record.resultSummary || {}).map(([key, value]) => `${key}: ${value}`),
    '',
    'The visitor report is attached.',
  ].join('\n');
}

function leadEmailText(record: ToolReportPayload & LeadRecord) {
  return [
    `Hi ${record.lead.name || 'there'},`,
    '',
    `Your ${record.reportTitle} is attached.`,
    '',
    'Use it as a practical action plan: fix the highest-friction items first, then come back to the wider strategy once the leak is clearer.',
    '',
    `- ${siteName}`,
  ].join('\n');
}

async function getReportAttachment(record: ToolReportPayload & LeadRecord): Promise<EmailAttachment> {
  const reportPdf = await createReportPdf(record);

  return {
    filename: reportPdf.fileName,
    content: Buffer.from(reportPdf.bytes).toString('base64'),
  };
}

function htmlShell(title: string, intro: string, body: string) {
  return `
    <div style="margin:0;background:#f0efed;padding:32px;font-family:Arial,sans-serif;color:#151419">
      <div style="max-width:680px;margin:0 auto;background:#fbfbfb;border:1px solid #dedbd6;padding:32px">
        <p style="margin:0 0 18px;color:#fc6e20;font-size:12px;font-weight:700;letter-spacing:.18em;text-transform:uppercase">${siteName}</p>
        <h1 style="margin:0 0 18px;font-size:34px;line-height:1.05">${escapeHtml(title)}</h1>
        <p style="margin:0 0 24px;color:#555;line-height:1.7">${escapeHtml(intro)}</p>
        <pre style="white-space:pre-wrap;margin:0;background:#151419;color:#fbfbfb;padding:20px;line-height:1.6;font-size:13px">${escapeHtml(body)}</pre>
      </div>
    </div>
  `;
}

function getBrevoConfig() {
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = process.env.BREVO_FROM_EMAIL;

  if (!apiKey || !fromEmail) return null;

  return {
    apiKey,
    fromEmail,
    fromName: process.env.BREVO_FROM_NAME || siteName,
  };
}

function parseBrevoError(body: string) {
  if (!body) return '';

  try {
    const parsed = JSON.parse(body) as {
      code?: string;
      message?: string;
    };

    return [parsed.code, parsed.message].filter(Boolean).join(': ');
  } catch {
    return body;
  }
}

async function sendBrevoEmail({
  attachments,
  html,
  subject,
  text,
  to,
  toName,
}: {
  attachments?: EmailAttachment[];
  html: string;
  subject: string;
  text: string;
  to: string;
  toName?: string;
}) {
  const config = getBrevoConfig();

  if (!config) {
    throw new Error('BREVO_API_KEY and BREVO_FROM_EMAIL are required for Brevo email delivery');
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'api-key': config.apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: {
        email: config.fromEmail,
        name: config.fromName,
      },
      to: [
        {
          email: to,
          ...(toName ? { name: toName } : {}),
        },
      ],
      subject,
      htmlContent: html,
      textContent: text,
      ...(attachments?.length
        ? {
            attachment: attachments.map((attachment) => ({
              content: attachment.content,
              name: attachment.filename,
            })),
          }
        : {}),
    }),
  });

  const responseText = await response.text().catch(() => '');

  if (!response.ok) {
    const detail = parseBrevoError(responseText);
    throw new Error(`Brevo responded with ${response.status}${detail ? `: ${detail}` : ''}`);
  }

  if (!responseText) return 'accepted by Brevo';

  const parsed = JSON.parse(responseText) as {
    messageId?: string;
    messageIds?: string[];
  };

  return parsed.messageId || parsed.messageIds?.join(', ') || 'accepted by Brevo';
}

async function sendEmail(record: LeadRecord): Promise<DeliveryStatus[]> {
  if (!getBrevoConfig()) {
    return [
      {
        channel: 'owner_email',
        status: 'skipped',
        detail: 'BREVO_API_KEY and BREVO_FROM_EMAIL are not configured',
      },
      {
        channel: 'visitor_email',
        status: 'skipped',
        detail: 'Email delivery is not configured',
      },
    ];
  }

  const ownerEmail = process.env.LEAD_NOTIFY_EMAIL;
  const statuses: DeliveryStatus[] = [];
  let reportAttachment: EmailAttachment | undefined;
  let reportAttachmentError: unknown;

  if (!ownerEmail) {
    statuses.push({
      channel: 'owner_email',
      status: 'failed',
      detail: 'LEAD_NOTIFY_EMAIL is not configured',
    });
  }

  if (record.type === 'tool-report') {
    try {
      reportAttachment = await getReportAttachment(record);
    } catch (error) {
      reportAttachmentError = error;
    }
  }

  if (ownerEmail) {
    try {
      if (record.type === 'tool-report' && !reportAttachment) {
        throw reportAttachmentError instanceof Error
          ? reportAttachmentError
          : new Error('Report PDF could not be generated');
      }

      const text = ownerEmailText(record);
      const messageId = await sendBrevoEmail({
        to: ownerEmail,
        toName: siteName,
        subject:
          record.type === 'contact'
            ? `New website enquiry: ${record.lead.business || record.lead.name || record.lead.email}`
            : `New tool lead: ${record.toolName}`,
        text,
        html: htmlShell('New lead captured', 'A new lead came through the website.', text),
        attachments: reportAttachment ? [reportAttachment] : undefined,
      });

      statuses.push({
        channel: 'owner_email',
        status: 'sent',
        detail: `Sent to ${ownerEmail}${messageId ? ` (${messageId})` : ''}`,
      });
    } catch (error) {
      statuses.push({
        channel: 'owner_email',
        status: 'failed',
        detail: error instanceof Error ? error.message : 'Owner email failed',
      });
    }
  }

  if (record.type === 'tool-report') {
    try {
      if (!reportAttachment) {
        throw reportAttachmentError instanceof Error
          ? reportAttachmentError
          : new Error('Report PDF could not be generated');
      }

      const text = leadEmailText(record);
      const messageId = await sendBrevoEmail({
        to: record.lead.email,
        toName: record.lead.name || record.lead.business,
        subject: `Your ${record.reportTitle}`,
        text,
        html: htmlShell(record.reportTitle, 'Your report is ready.', text),
        attachments: reportAttachment ? [reportAttachment] : undefined,
      });

      statuses.push({
        channel: 'visitor_email',
        status: 'sent',
        detail: `Sent to ${record.lead.email}${messageId ? ` (${messageId})` : ''}`,
      });
    } catch (error) {
      statuses.push({
        channel: 'visitor_email',
        status: 'failed',
        detail: error instanceof Error ? error.message : 'Visitor email failed',
      });
    }
  } else {
    statuses.push({
      channel: 'visitor_email',
      status: 'skipped',
      detail: 'Contact enquiries only notify the studio',
    });
  }

  return statuses;
}

function responseMessage(delivery: DeliveryStatus[]) {
  if (delivery.some((item) => item.channel === 'visitor_email' && item.status === 'sent')) {
    return 'Captured and emailed. You can also download the report now.';
  }

  if (delivery.some((item) => item.channel === 'webhook' && item.status === 'sent')) {
    return 'Captured and sent to the lead workflow. You can download the report now.';
  }

  if (delivery.some((item) => item.channel === 'local_store' && item.status === 'sent')) {
    return 'Captured locally. Configure email or webhook delivery for production.';
  }

  return 'The lead was received, but delivery needs attention.';
}

export async function POST(request: NextRequest) {
  const payload = parsePayload(await request.json().catch(() => null));

  if (!payload) {
    return NextResponse.json(
      { message: 'Please check the lead details and try again.' },
      { status: 400 },
    );
  }

  const record: LeadRecord = {
    ...payload,
    id: randomUUID(),
    submittedAt: new Date().toISOString(),
    userAgent: request.headers.get('user-agent'),
    referrer: request.headers.get('referer'),
  };

  const delivery = [
    await storeLead(record),
    await sendWebhook(record),
    ...(await sendEmail(record)),
  ];
  const emailFailures = delivery.filter(
    (item) =>
      (item.channel === 'owner_email' || item.channel === 'visitor_email') &&
      item.status === 'failed',
  );

  if (getBrevoConfig() && emailFailures.length > 0) {
    const failureMessage = [...new Set(emailFailures.map((item) => item.detail))].join(' ');

    return NextResponse.json(
      {
        ok: false,
        leadId: record.id,
        delivery,
        message: failureMessage,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    leadId: record.id,
    delivery,
    message: responseMessage(delivery),
  });
}
