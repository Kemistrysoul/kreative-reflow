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
    getOwnerEmailSubject(record),
    '',
    getOwnerFollowUpLine(record),
    '',
    `Lead ID: ${record.id}`,
    `Submitted: ${record.submittedAt}`,
    `Name: ${record.lead.name || 'Not provided'}`,
    `Email: ${record.lead.email}`,
    `Business: ${record.lead.business || 'Not provided'}`,
    `Source: ${record.sourcePath}`,
    '',
    'Result summary:',
    ...summaryLines(record.resultSummary),
    '',
    'Suggested next step:',
    getOwnerNextStep(record),
    '',
    'The visitor report PDF is attached.',
  ].join('\n');
}

function leadEmailText(record: ToolReportPayload & LeadRecord) {
  const copy = getToolEmailCopy(record);

  return [
    `Hi ${record.lead.name || 'there'},`,
    '',
    copy.opening,
    '',
    `Your ${record.reportTitle} is attached as a PDF.`,
    '',
    copy.body,
    '',
    `Next step: ${copy.ctaLabel}`,
    getContactUrl(),
    '',
    `- ${siteName}`,
  ].join('\n');
}

function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.APP_URL ||
    'https://kreativereflow.com'
  ).replace(/\/$/, '');
}

function getContactUrl() {
  return `${getSiteUrl()}/contact`;
}

function formatSummaryLabel(key: string) {
  return key
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function summaryLines(summary?: Record<string, string | number | boolean | null>) {
  const entries = Object.entries(summary || {});

  if (entries.length === 0) return ['No result summary captured.'];

  return entries.map(
    ([key, value]) => `${formatSummaryLabel(key)}: ${String(value ?? 'Not captured')}`,
  );
}

function getSummaryValue(
  record: ToolReportPayload & LeadRecord,
  keys: string[],
) {
  for (const key of keys) {
    const value = record.resultSummary?.[key];
    if (value !== undefined && value !== null && value !== '') {
      return String(value);
    }
  }

  return '';
}

function getPrimaryResult(record: ToolReportPayload & LeadRecord) {
  switch (record.toolId) {
    case 'lead-response-leak-calculator':
      return getSummaryValue(record, ['monthlyLeak', 'annualLeak', 'severity']);
    case 'website-lead-leak-scorecard':
    case 'local-visibility-scorecard':
      return getSummaryValue(record, ['score', 'range', 'firstPriority']);
    case 'website-rebuild-vs-refresh-quiz':
      return getSummaryValue(record, ['recommendation', 'path', 'score']);
    default:
      return getSummaryValue(record, ['score', 'range', 'severity', 'recommendation']);
  }
}

function getToolEmailCopy(record: ToolReportPayload & LeadRecord) {
  const primaryResult = getPrimaryResult(record);

  switch (record.toolId) {
    case 'lead-response-leak-calculator':
      return {
        body:
          'Start with response speed before adding more traffic. The fastest win is usually an instant first reply, missed-call recovery, and a simple follow-up path for leads that arrive after hours.',
        ctaLabel: 'Book a Lead Response Audit',
        opening: primaryResult
          ? `Your estimated lead response leak is ${primaryResult}.`
          : 'Your lead response report is ready.',
      };
    case 'website-lead-leak-scorecard':
      return {
        body:
          'Use the report to fix the friction points that stop visitors from becoming enquiries: speed, mobile usability, trust signals, value clarity, and calls to action.',
        ctaLabel: 'Book a Website Leak Review',
        opening: primaryResult
          ? `Your website lead leak score is ${primaryResult}.`
          : 'Your website lead leak scorecard is ready.',
      };
    case 'local-visibility-scorecard':
      return {
        body:
          'Use the report to tighten the local signals that help nearby buyers find you, trust you, and choose the next step without hunting for contact details.',
        ctaLabel: 'Book a Local Visibility Review',
        opening: primaryResult
          ? `Your local visibility score is ${primaryResult}.`
          : 'Your local visibility action plan is ready.',
      };
    case 'website-rebuild-vs-refresh-quiz':
      return {
        body:
          'Use the report to avoid the wrong scope. A refresh can sharpen a healthy site, but a rebuild is safer when the structure, message, or technical foundation is holding the business back.',
        ctaLabel: 'Discuss the Right Website Scope',
        opening: primaryResult
          ? `Your recommended website path is ${primaryResult}.`
          : 'Your website scope recommendation is ready.',
      };
    default:
      return {
        body:
          'Use the attached report as a practical first pass. Fix the highest-friction items first, then come back to the wider strategy once the leak is clearer.',
        ctaLabel: 'Book a Review',
        opening: `Your ${record.reportTitle} is ready.`,
      };
  }
}

function getOwnerFollowUpLine(record: ToolReportPayload & LeadRecord) {
  switch (record.toolId) {
    case 'lead-response-leak-calculator':
      return 'Follow-up priority: response-speed leads are time sensitive. Reply the same business day if possible.';
    case 'website-lead-leak-scorecard':
      return 'Follow-up priority: ask what page or channel currently brings the most enquiries, then review the highest leak first.';
    case 'local-visibility-scorecard':
      return 'Follow-up priority: ask which suburb or service area matters most, then check the local visibility gaps.';
    case 'website-rebuild-vs-refresh-quiz':
      return 'Follow-up priority: confirm whether the site needs a rebuild, refresh, or optimization plan before quoting.';
    default:
      return 'Follow-up priority: review the attached report and reply with one clear next step.';
  }
}

function getOwnerNextStep(record: ToolReportPayload & LeadRecord) {
  switch (record.toolId) {
    case 'lead-response-leak-calculator':
      return 'Offer a 30-minute response audit focused on WhatsApp, missed calls, and after-hours capture.';
    case 'website-lead-leak-scorecard':
      return 'Offer a short website leak review and start with the first priority issue from the report.';
    case 'local-visibility-scorecard':
      return 'Offer a local visibility review covering Google Business Profile, service pages, reviews, and local trust signals.';
    case 'website-rebuild-vs-refresh-quiz':
      return 'Offer a scope call to validate whether a rebuild, refresh, or optimization sprint is the better investment.';
    default:
      return 'Reply with the attached report context and invite them to a short review call.';
  }
}

function getOwnerEmailSubject(record: ToolReportPayload & LeadRecord) {
  const business = record.lead.business || record.lead.name || record.lead.email;
  const primaryResult = getPrimaryResult(record);

  return [
    `New tool lead: ${business}`,
    primaryResult ? `${record.toolName} - ${primaryResult}` : record.toolName,
  ].join(' | ');
}

function getVisitorEmailSubject(record: ToolReportPayload & LeadRecord) {
  const primaryResult = getPrimaryResult(record);

  switch (record.toolId) {
    case 'lead-response-leak-calculator':
      return primaryResult
        ? `Your lead response leak estimate: ${primaryResult}`
        : 'Your Lead Response Recovery Plan';
    case 'website-lead-leak-scorecard':
      return primaryResult
        ? `Your website lead leak score: ${primaryResult}`
        : 'Your Website Lead Leak Scorecard';
    case 'local-visibility-scorecard':
      return primaryResult
        ? `Your local visibility score: ${primaryResult}`
        : 'Your Local Visibility Action Plan';
    case 'website-rebuild-vs-refresh-quiz':
      return primaryResult
        ? `Your website scope recommendation: ${primaryResult}`
        : 'Your Website Scope Decision Plan';
    default:
      return `Your ${record.reportTitle}`;
  }
}

function renderSummaryRows(summary?: Record<string, string | number | boolean | null>) {
  const entries = Object.entries(summary || {});

  if (entries.length === 0) {
    return '<p style="margin:0;color:#5b5651;line-height:1.65">No result summary captured.</p>';
  }

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
      ${entries
        .map(
          ([key, value]) => `
            <tr>
              <td style="border-bottom:1px solid #dedbd6;padding:10px 0;color:#68625c;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em">${escapeHtml(
                formatSummaryLabel(key),
              )}</td>
              <td align="right" style="border-bottom:1px solid #dedbd6;padding:10px 0 10px 16px;color:#151419;font-size:14px;font-weight:700">${escapeHtml(
                String(value ?? 'Not captured'),
              )}</td>
            </tr>
          `,
        )
        .join('')}
    </table>
  `;
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

function brandedEmailShell({
  bodyHtml,
  ctaHref,
  ctaLabel,
  eyebrow,
  footer,
  intro,
  title,
}: {
  bodyHtml: string;
  ctaHref?: string;
  ctaLabel?: string;
  eyebrow: string;
  footer?: string;
  intro: string;
  title: string;
}) {
  return `
    <div style="margin:0;background:#f0efed;padding:32px 18px;font-family:Arial,Helvetica,sans-serif;color:#151419">
      <div style="max-width:680px;margin:0 auto;background:#fbfbfb;border:1px solid #dedbd6">
        <div style="background:#151419;color:#fbfbfb;padding:34px 32px">
          <p style="margin:0 0 16px;color:#fc6e20;font-size:12px;font-weight:800;letter-spacing:.18em;text-transform:uppercase">${escapeHtml(
            eyebrow,
          )}</p>
          <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:36px;line-height:1.05;color:#fbfbfb">${escapeHtml(
            title,
          )}</h1>
          <p style="margin:18px 0 0;color:#f0efed;line-height:1.7;font-size:15px">${escapeHtml(
            intro,
          )}</p>
        </div>
        <div style="padding:30px 32px">
          ${bodyHtml}
          ${
            ctaHref && ctaLabel
              ? `<div style="margin-top:28px"><a href="${escapeHtml(
                  ctaHref,
                )}" style="display:inline-block;background:#fc6e20;color:#151419;text-decoration:none;border-radius:999px;padding:14px 20px;font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase">${escapeHtml(
                  ctaLabel,
                )}</a></div>`
              : ''
          }
        </div>
        <div style="border-top:1px solid #dedbd6;padding:18px 32px;color:#68625c;font-size:12px;line-height:1.6">
          ${escapeHtml(footer || `${siteName} | Websites, systems, and automation for service businesses.`)}
        </div>
      </div>
    </div>
  `;
}

function visitorEmailHtml(record: ToolReportPayload & LeadRecord) {
  const copy = getToolEmailCopy(record);

  return brandedEmailShell({
    bodyHtml: `
      <p style="margin:0 0 16px;color:#3d3935;line-height:1.7;font-size:15px">${escapeHtml(
        copy.body,
      )}</p>
      <div style="margin:24px 0;padding:20px;border:1px solid #dedbd6;background:#fff">
        <p style="margin:0 0 14px;color:#fc6e20;font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase">Your result snapshot</p>
        ${renderSummaryRows(record.resultSummary)}
      </div>
      <p style="margin:0;color:#3d3935;line-height:1.7;font-size:15px">The full PDF report is attached. Keep it handy as a fix list, not a once-off score.</p>
    `,
    ctaHref: getContactUrl(),
    ctaLabel: copy.ctaLabel,
    eyebrow: record.toolName,
    footer: 'You received this because you requested a report from Kreative Reflow.',
    intro: copy.opening,
    title: record.reportTitle,
  });
}

function ownerEmailHtml(record: LeadRecord) {
  if (record.type === 'contact') {
    return htmlShell(
      'New website enquiry',
      'A new contact enquiry came through the website.',
      ownerEmailText(record),
    );
  }

  return brandedEmailShell({
    bodyHtml: `
      <div style="margin:0 0 22px;padding:18px 20px;background:#151419;color:#fbfbfb">
        <p style="margin:0 0 8px;color:#fc6e20;font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase">Follow-up note</p>
        <p style="margin:0;color:#fbfbfb;line-height:1.7;font-size:15px">${escapeHtml(
          getOwnerFollowUpLine(record),
        )}</p>
      </div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-bottom:24px">
        ${[
          ['Name', record.lead.name || 'Not provided'],
          ['Email', record.lead.email],
          ['Business', record.lead.business || 'Not provided'],
          ['Tool', record.toolName],
          ['Source', record.sourcePath],
          ['Submitted', record.submittedAt],
        ]
          .map(
            ([label, value]) => `
              <tr>
                <td style="border-bottom:1px solid #dedbd6;padding:10px 0;color:#68625c;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em">${escapeHtml(
                  label,
                )}</td>
                <td align="right" style="border-bottom:1px solid #dedbd6;padding:10px 0 10px 16px;color:#151419;font-size:14px;font-weight:700">${escapeHtml(
                  value,
                )}</td>
              </tr>
            `,
          )
          .join('')}
      </table>
      <div style="margin:0 0 24px;padding:20px;border:1px solid #dedbd6;background:#fff">
        <p style="margin:0 0 14px;color:#fc6e20;font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase">Result summary</p>
        ${renderSummaryRows(record.resultSummary)}
      </div>
      <p style="margin:0;color:#3d3935;line-height:1.7;font-size:15px"><strong>Suggested next step:</strong> ${escapeHtml(
        getOwnerNextStep(record),
      )}</p>
      <p style="margin:16px 0 0;color:#3d3935;line-height:1.7;font-size:15px">The same PDF sent to the visitor is attached here for context.</p>
    `,
    ctaHref: `mailto:${record.lead.email}?subject=${encodeURIComponent(`Re: Your ${record.reportTitle}`)}`,
    ctaLabel: 'Reply to lead',
    eyebrow: 'New lead captured',
    intro: getOwnerFollowUpLine(record),
    title: getOwnerEmailSubject(record),
  });
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
            : getOwnerEmailSubject(record),
        text,
        html: ownerEmailHtml(record),
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
        subject: getVisitorEmailSubject(record),
        text,
        html: visitorEmailHtml(record),
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
