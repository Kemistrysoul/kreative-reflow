'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BellRing,
  CalendarRange,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileCheck2,
  FolderKanban,
  Loader2,
  Mail,
  MessageSquareText,
  PackageCheck,
  Pencil,
  ReceiptText,
  ShieldCheck,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';
import {
  projectBlockers,
  projectBoard,
  projectClientActivity,
  projectMetrics,
  projectRows,
  studioProjectTabs,
  type CrmHandoffRecord,
  type ProjectRecord,
  type StudioMetric,
} from '@/lib/dashboard-data';
import {
  type StudioTableColumn,
  StudioDataTable,
  StudioMetricCard,
  StudioPageHeader,
  StudioPanel,
  StudioStatusPill,
} from '@/components/studio/primitives';
import {
  type WorkflowProjectRecord,
  useStudioWorkflow,
} from '@/components/studio/studio-workflow-state';
import type { PortalDeliverableApproval, PortalNotificationRule } from '@/lib/portal-approvals';
import type { PortalProjectAsset } from '@/lib/portal-assets';
import type {
  PortalFinanceHandoffData,
  PortalHandoffStatus,
  PortalInvoiceStatus,
  PortalProjectHandoffItem,
  PortalProjectInvoice,
  PortalProjectSupportNextStep,
  PortalSupportStatus,
} from '@/lib/portal-finance-handoff';
import type { PortalOperationalEvent, PortalOperationalSeverity } from '@/lib/portal-monitoring';
import type { StudioOnboardingResponse } from '@/lib/portal-onboarding-types';

type ProjectTableRow = ProjectRecord & {
  rowId: string;
  kind: 'handoff' | 'active' | 'seed';
  sourceHandoffId?: string;
  owner?: string;
  email?: string;
  notes?: string;
  startedAt?: string;
};

const approvalStatusCopy: Record<PortalDeliverableApproval['status'], string> = {
  approved: 'Approved',
  revision_requested: 'Revision requested',
  superseded: 'Superseded',
  waiting_review: 'Waiting review',
};

const emptyFinanceHandoff: PortalFinanceHandoffData = {
  handoffItems: [],
  invoices: [],
  supportNextSteps: [],
};

const invoiceStatusCopy: Record<PortalInvoiceStatus, string> = {
  cancelled: 'Cancelled',
  draft: 'Draft',
  due: 'Due',
  overdue: 'Overdue',
  paid: 'Paid',
  waiting: 'Waiting',
};

const handoffStatusCopy: Record<PortalHandoffStatus, string> = {
  blocked: 'Blocked',
  done: 'Done',
  in_progress: 'In progress',
  not_started: 'Not started',
  waiting_client: 'Waiting client',
};

const supportStatusCopy: Record<PortalSupportStatus, string> = {
  active: 'Active',
  available: 'Available',
  declined: 'Declined',
  recommended: 'Recommended',
  scheduled: 'Scheduled',
};

function getApprovalTone(status: PortalDeliverableApproval['status']): 'accent' | 'muted' | 'neutral' {
  if (status === 'waiting_review' || status === 'revision_requested') {
    return 'accent';
  }

  return status === 'superseded' ? 'muted' : 'neutral';
}

function getInvoiceTone(status: PortalInvoiceStatus): 'accent' | 'muted' | 'neutral' {
  if (status === 'due' || status === 'overdue') {
    return 'accent';
  }

  return status === 'paid' ? 'neutral' : 'muted';
}

function getHandoffTone(status: PortalHandoffStatus): 'accent' | 'muted' | 'neutral' {
  if (status === 'blocked' || status === 'waiting_client') {
    return 'accent';
  }

  return status === 'done' ? 'neutral' : 'muted';
}

function makeId(prefix: string, ...parts: string[]) {
  return [prefix, ...parts]
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function asProjectDraft(handoff: CrmHandoffRecord): WorkflowProjectRecord {
  return {
    id: `project-${handoff.id ?? makeId('project', handoff.client, handoff.business)}`,
    sourceHandoffId: handoff.id,
    project: handoff.business,
    client: handoff.client,
    phase: 'Kickoff',
    deadline: 'TBD',
    value: handoff.budget ?? '-',
    health: 'On track',
    owner: handoff.owner,
    email: handoff.email,
    notes: handoff.notes ?? handoff.summary,
    startedAt: 'Today',
  };
}

export function StudioProjectsWorkspace({
  approvalQueue = [],
  assetReviews = [],
  financeHandoff = emptyFinanceHandoff,
  notificationRules = [],
  onboardingResponses = [],
  operationalEvents = [],
}: {
  approvalQueue?: PortalDeliverableApproval[];
  assetReviews?: PortalProjectAsset[];
  financeHandoff?: PortalFinanceHandoffData;
  notificationRules?: PortalNotificationRule[];
  onboardingResponses?: StudioOnboardingResponse[];
  operationalEvents?: PortalOperationalEvent[];
}) {
  const {
    projectHandoffs,
    activeProjects,
    activateProjectFromHandoff,
    updateActiveProject,
  } = useStudioWorkflow();
  const [selectedRow, setSelectedRow] = useState<ProjectTableRow | null>(null);
  const submittedOnboardingCount = onboardingResponses.filter((response) => response.status === 'submitted').length;
  const latestOnboardingResponse = onboardingResponses[0];
  const pendingAssetCount = assetReviews.filter((asset) => asset.reviewStatus === 'pending_review').length;
  const pendingApprovalCount = approvalQueue.filter((approval) =>
    approval.status === 'waiting_review' || approval.status === 'revision_requested'
  ).length;
  const enabledNotificationCount = notificationRules.filter((rule) => rule.enabled).length;
  const financeActionCount = financeHandoff.invoices.filter((invoice) =>
    invoice.status === 'due' || invoice.status === 'overdue'
  ).length;
  const incompleteHandoffCount = financeHandoff.handoffItems.filter((item) => item.status !== 'done').length;
  const unresolvedOperationalEvents = operationalEvents.filter((event) => !event.resolvedAt);
  const urgentOperationalEvents = unresolvedOperationalEvents.filter((event) =>
    event.severity === 'critical' || event.severity === 'error'
  );

  const intakeRows: ProjectTableRow[] = projectHandoffs.map((handoff) => ({
    rowId: handoff.id ?? makeId('handoff', handoff.client, handoff.business),
    kind: 'handoff',
    sourceHandoffId: handoff.id,
    project: handoff.business,
    client: handoff.client,
    phase: 'Intake',
    deadline: handoff.createdAt ?? 'Today',
    value: handoff.budget ?? '-',
    health: handoff.stage,
    owner: handoff.owner,
    email: handoff.email,
    notes: handoff.notes ?? handoff.summary,
    startedAt: handoff.createdAt,
  }));

  const activeRows: ProjectTableRow[] = activeProjects.map((project) => ({
    rowId: project.id,
    kind: 'active',
    sourceHandoffId: project.sourceHandoffId,
    project: project.project,
    client: project.client,
    phase: project.phase,
    deadline: project.deadline,
    value: project.value,
    health: project.health,
    owner: project.owner,
    email: project.email,
    notes: project.notes,
    startedAt: project.startedAt,
  }));

  const seedRows: ProjectTableRow[] = projectRows.map((row) => ({
    rowId: makeId('seed-project', row.client, row.project),
    kind: 'seed',
    ...row,
  }));

  const metrics: StudioMetric[] = [
    {
      ...projectMetrics[0],
      value: String(seedRows.length + activeRows.length),
      detail: `${intakeRows.length} intake item${intakeRows.length === 1 ? '' : 's'} waiting for kickoff`,
    },
    {
      label: 'Pending Kickoff',
      value: String(intakeRows.length),
      detail: intakeRows.length
        ? 'Won leads waiting to become real delivery work'
        : 'No unstarted intake in the queue',
      icon: ArrowRight,
      tone: 'accent',
      spark: [2, 3, 3, 4, 4, 5, intakeRows.length + 1],
    },
    {
      label: 'Onboarding Reviews',
      value: String(submittedOnboardingCount),
      detail: onboardingResponses.length
        ? `${onboardingResponses.length} portal response${onboardingResponses.length === 1 ? '' : 's'} available for review`
        : 'No portal onboarding responses yet',
      icon: ClipboardCheck,
      tone: 'accent',
      spark: [0, 0, 1, 1, 1, onboardingResponses.length + 1, submittedOnboardingCount + 1],
    },
    {
      label: 'Approval Queue',
      value: String(pendingApprovalCount),
      detail: approvalQueue.length
        ? `${approvalQueue.length} deliverable${approvalQueue.length === 1 ? '' : 's'} tracked with version decisions`
        : 'No deliverables are waiting for client approval',
      icon: FileCheck2,
      tone: 'accent',
      spark: [0, 1, 1, 2, 2, approvalQueue.length + 1, pendingApprovalCount + 1],
    },
    {
      label: 'Asset Reviews',
      value: String(pendingAssetCount),
      detail: assetReviews.length
        ? `${assetReviews.length} uploaded file${assetReviews.length === 1 ? '' : 's'} in the review queue`
        : 'No uploaded assets waiting for review',
      icon: UploadCloud,
      tone: 'muted',
      spark: [0, 0, 1, 1, 2, assetReviews.length + 1, pendingAssetCount + 1],
    },
    {
      label: 'Finance + Handoff',
      value: String(financeActionCount + incompleteHandoffCount),
      detail: `${financeActionCount} finance action${financeActionCount === 1 ? '' : 's'} and ${incompleteHandoffCount} handoff item${incompleteHandoffCount === 1 ? '' : 's'}`,
      icon: ReceiptText,
      tone: 'muted',
      spark: [0, 1, financeHandoff.invoices.length + 1, 2, financeHandoff.handoffItems.length + 1, incompleteHandoffCount + 1],
    },
    {
      label: 'Operations',
      value: String(unresolvedOperationalEvents.length),
      detail: urgentOperationalEvents.length
        ? `${urgentOperationalEvents.length} urgent portal event${urgentOperationalEvents.length === 1 ? '' : 's'} need review`
        : 'No urgent portal events in the current readiness view',
      icon: Activity,
      tone: urgentOperationalEvents.length ? 'accent' : 'muted',
      spark: [0, operationalEvents.length + 1, unresolvedOperationalEvents.length + 1, 1, urgentOperationalEvents.length + 1],
    },
  ];

  const clientActivityItems = useMemo(
    () => [
      ...assetReviews.slice(0, 2).map((asset) => ({
        time: asset.reviewStatus === 'pending_review' ? 'Review' : asset.reviewStatus,
        title: `${asset.clientName} uploaded ${asset.fileName}`,
        meta: `${asset.categoryTitle} - ${asset.uploadedAt}`,
      })),
      ...onboardingResponses.slice(0, 2).map((response) => ({
        time: response.status === 'submitted' ? 'Submitted' : 'Draft',
        title: `${response.clientName} onboarding ${response.status}`,
        meta: `${response.projectName} - ${response.lastSavedAt}`,
      })),
      ...approvalQueue.slice(0, 2).map((approval) => ({
        time: approvalStatusCopy[approval.status],
        title: `${approval.clientName} - ${approval.title} ${approval.versionLabel}`,
        meta: approval.latestEvent
          ? `${approval.latestEvent.decision === 'approved' ? 'Approved' : 'Revision requested'} by ${approval.latestEvent.decidedByEmail}`
          : `${approval.projectName} - due ${approval.dueDate}`,
      })),
      ...financeHandoff.invoices.slice(0, 1).map((invoice) => ({
        time: invoiceStatusCopy[invoice.status],
        title: `${invoice.clientName} - ${invoice.invoiceNumber} ${invoice.label}`,
        meta: `${invoice.amountLabel} - due ${invoice.dueDate}`,
      })),
      ...financeHandoff.handoffItems.slice(0, 1).map((item) => ({
        time: handoffStatusCopy[item.status],
        title: `${item.clientName} - ${item.title}`,
        meta: `${item.ownerName} - due ${item.dueDate}`,
      })),
      ...projectClientActivity,
    ],
    [approvalQueue, assetReviews, financeHandoff, onboardingResponses],
  );

  const mergedRows = [...intakeRows, ...activeRows, ...seedRows];
  const boardColumns = projectBoard.map((column) => {
    if (column.label === 'To Do') {
      return {
        ...column,
        items: [
          ...intakeRows.map((row) => `Kickoff ${row.client} - ${row.project}`),
          ...column.items,
        ],
      };
    }

    if (column.label === 'In Progress') {
      return {
        ...column,
        items: [
          ...activeRows.map((row) => `${row.client} - ${row.phase}`),
          ...column.items,
        ],
      };
    }

    return column;
  });
  const launchReadinessItems = [
    {
      label: 'Privacy and terms',
      status: 'Visible',
      detail: 'Portal, onboarding, and login screens now expose client-facing privacy and terms paths.',
      tone: 'neutral' as const,
    },
    {
      label: 'POPIA copy',
      status: 'Visible',
      detail: 'Data use, access, retention, deletion, and credential boundaries are visible before client submission.',
      tone: 'neutral' as const,
    },
    {
      label: 'Route states',
      status: 'Covered',
      detail: 'Portal and studio project routes have loading and retry states for slower protected data loads.',
      tone: 'neutral' as const,
    },
    {
      label: 'Operational events',
      status: urgentOperationalEvents.length ? 'Review' : 'Clear',
      detail: urgentOperationalEvents.length
        ? 'Resolve urgent auth, upload, approval, or project data events before launch.'
        : 'No urgent launch-readiness event is currently open.',
      tone: urgentOperationalEvents.length ? 'accent' as const : 'neutral' as const,
    },
    {
      label: 'Handoff path',
      status: incompleteHandoffCount ? 'Active' : 'Ready',
      detail: incompleteHandoffCount
        ? 'Launch handoff still has open client or studio steps to finish.'
        : 'Launch handoff is clear in the current project view.',
      tone: incompleteHandoffCount ? 'muted' as const : 'neutral' as const,
    },
  ];

  const projectColumns: StudioTableColumn<ProjectTableRow>[] = [
    {
      key: 'project',
      label: 'Project',
      render: (row) => (
        <div>
          <p className="font-semibold text-white">{row.project}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#878787]">
            {row.kind === 'handoff' ? 'CRM intake' : row.kind === 'active' ? 'Live project' : 'Existing record'}
          </p>
        </div>
      ),
    },
    { key: 'client', label: 'Client', render: (row) => <span>{row.client}</span> },
    { key: 'phase', label: 'Phase', render: (row) => <span>{row.phase}</span> },
    { key: 'deadline', label: 'Deadline', render: (row) => <span className="font-mono">{row.deadline}</span> },
    { key: 'value', label: 'Value', render: (row) => <span className="font-mono text-[#FC6E20]">{row.value}</span> },
    {
      key: 'health',
      label: 'Health',
      render: (row) => (
        <StudioStatusPill
          label={row.health}
          tone={row.health === 'On track' ? 'neutral' : row.kind === 'handoff' ? 'accent' : 'muted'}
        />
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <StudioPageHeader
        eyebrow="Projects"
        title="Delivery and project execution"
        description="Track active delivery, review won-lead intake properly, and convert kickoff work into projects with enough structure to actually move."
        tabs={studioProjectTabs}
        activeTab="Active"
        actions={
          <div className="rounded-2xl border border-white/8 bg-[#151419] px-4 py-3">
            <p className="font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#878787]">Kickoff queue</p>
            <p className="mt-2 font-montserrat text-sm font-semibold text-white">
              {intakeRows.length} project intake item{intakeRows.length === 1 ? '' : 's'} waiting for review
            </p>
          </div>
        }
      />

      <section className="grid gap-4 xl:grid-cols-3 2xl:grid-cols-6">
        {metrics.map((metric) => (
          <StudioMetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.84fr_1.16fr]">
        <StudioPanel title="Kickoff from CRM" eyebrow="Review before delivery starts" icon={ArrowRight}>
          <div className="space-y-3">
            {intakeRows.length ? (
              intakeRows.map((row) => (
                <button
                  key={row.rowId}
                  type="button"
                  onClick={() => setSelectedRow(row)}
                  className="w-full rounded-[22px] border border-white/8 bg-[#151419] p-4 text-left transition hover:border-[#FC6E20]/40 hover:bg-white/[0.03]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-montserrat text-sm font-semibold text-white">{row.client}</p>
                      <p className="mt-2 text-sm text-[#878787]">{row.project}</p>
                    </div>
                    <StudioStatusPill label={row.health} tone="accent" />
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[18px] border border-white/8 bg-white/5 p-3">
                      <p className="font-montserrat text-[11px] uppercase tracking-[0.16em] text-[#878787]">Budget</p>
                      <p className="mt-2 font-mono text-sm text-[#FC6E20]">{row.value}</p>
                    </div>
                    <div className="rounded-[18px] border border-white/8 bg-white/5 p-3">
                      <p className="font-montserrat text-[11px] uppercase tracking-[0.16em] text-[#878787]">Owner</p>
                      <p className="mt-2 text-sm text-white">{row.owner ?? 'Delite'}</p>
                    </div>
                  </div>
                  {row.notes ? (
                    <p className="mt-4 text-sm leading-6 text-[#878787]">{row.notes}</p>
                  ) : null}
                </button>
              ))
            ) : (
              <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.02] p-5">
                <p className="font-montserrat text-sm text-[#878787]">
                  No new project handoffs yet. Won leads from CRM will land here automatically.
                </p>
              </div>
            )}
          </div>
          <Link
            href="/studio/crm"
            className="mt-4 inline-flex min-h-12 items-center rounded-2xl border border-white/8 bg-white/5 px-4 font-montserrat text-sm font-semibold text-white transition hover:border-[#FC6E20] hover:text-[#FC6E20]"
          >
            Open CRM
          </Link>
        </StudioPanel>

        <StudioPanel title="Project register" eyebrow="Live delivery plus new activations" icon={FolderKanban}>
          <StudioDataTable
            columns={projectColumns}
            rows={mergedRows}
            onRowClick={(row) => setSelectedRow(row)}
            getRowKey={(row) => row.rowId}
            emptyMessage="No projects or intake records are available."
          />
        </StudioPanel>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <StudioPanel
          title="Asset review queue"
          eyebrow="Client uploads"
          icon={UploadCloud}
          actions={
            <Link
              href="/portal"
              className="inline-flex min-h-11 items-center rounded-2xl border border-white/8 bg-white/5 px-4 font-montserrat text-sm font-semibold text-white transition hover:border-[#FC6E20] hover:text-[#FC6E20]"
            >
              Open portal
            </Link>
          }
        >
          <div className="grid gap-3">
            {assetReviews.length ? (
              assetReviews.map((asset) => <AssetReviewCard key={asset.id} asset={asset} />)
            ) : (
              <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.02] p-5">
                <p className="font-montserrat text-sm text-[#878787]">
                  Uploaded client assets will appear here with review status, category, size, and submitter context.
                </p>
              </div>
            )}
          </div>
        </StudioPanel>

        <StudioPanel title="Asset handling rules" eyebrow="Manual review gate" icon={ShieldCheck}>
          <div className="space-y-3">
            <DetailCard label="Default status" value="Received, pending review" />
            <DetailCard label="Client access" value="Project members only" />
            <DetailCard label="Storage" value="Private Supabase bucket" />
            <div className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
              <p className="font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#878787]">Before use</p>
              <p className="mt-3 font-montserrat text-sm leading-6 text-[#FBFBFB]">
                Keep client uploads out of production work until the studio marks the file accepted or requests a replacement.
              </p>
            </div>
          </div>
        </StudioPanel>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <StudioPanel
          title="Approval queue"
          eyebrow="Versioned client decisions"
          icon={FileCheck2}
          actions={
            <Link
              href="/portal"
              className="inline-flex min-h-11 items-center rounded-2xl border border-white/8 bg-white/5 px-4 font-montserrat text-sm font-semibold text-white transition hover:border-[#FC6E20] hover:text-[#FC6E20]"
            >
              Open portal
            </Link>
          }
        >
          <div className="grid gap-3">
            {approvalQueue.length ? (
              approvalQueue.map((approval) => <ApprovalReviewCard key={approval.id} approval={approval} />)
            ) : (
              <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.02] p-5">
                <p className="font-montserrat text-sm text-[#878787]">
                  Client approval decisions will appear here with version, approver, timestamp, and revision notes.
                </p>
              </div>
            )}
          </div>
        </StudioPanel>

        <StudioPanel title="Notification rules" eyebrow="Client-visible activity" icon={BellRing}>
          <div className="space-y-3">
            <div className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
              <p className="font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#878787]">Enabled rules</p>
              <p className="mt-2 font-playfair text-4xl font-semibold text-white">{enabledNotificationCount}</p>
              <p className="mt-2 font-montserrat text-sm leading-6 text-[#878787]">
                Portal activity is written only when its project notification rule is enabled.
              </p>
            </div>
            {notificationRules.length ? (
              notificationRules.map((rule) => <NotificationRuleCard key={rule.id} rule={rule} />)
            ) : (
              <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.02] p-5">
                <p className="font-montserrat text-sm text-[#878787]">
                  Notification rules will appear after the project workflow tables are configured.
                </p>
              </div>
            )}
          </div>
        </StudioPanel>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <StudioPanel title="Portal operations" eyebrow="Monitoring and errors" icon={Activity}>
          <div className="grid gap-3">
            {operationalEvents.length ? (
              operationalEvents.map((event) => <OperationalEventCard key={event.id} event={event} />)
            ) : (
              <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.02] p-5">
                <p className="font-montserrat text-sm text-[#878787]">
                  Auth, upload, approval, onboarding, and project data failures will appear here as launch-readiness events.
                </p>
              </div>
            )}
          </div>
        </StudioPanel>

        <StudioPanel title="Launch readiness" eyebrow="Compliance and support path" icon={ShieldCheck}>
          <div className="space-y-3">
            {launchReadinessItems.map((item) => (
              <ReadinessGateCard key={item.label} item={item} />
            ))}
          </div>
        </StudioPanel>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <StudioPanel
          title="Finance status"
          eyebrow="Client-safe invoice view"
          icon={ReceiptText}
          actions={
            <Link
              href="/studio/finance"
              className="inline-flex min-h-11 items-center rounded-2xl border border-white/8 bg-white/5 px-4 font-montserrat text-sm font-semibold text-white transition hover:border-[#FC6E20] hover:text-[#FC6E20]"
            >
              Open finance
            </Link>
          }
        >
          <div className="grid gap-3">
            {financeHandoff.invoices.length ? (
              financeHandoff.invoices.map((invoice) => <StudioInvoiceCard key={invoice.id} invoice={invoice} />)
            ) : (
              <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.02] p-5">
                <p className="font-montserrat text-sm text-[#878787]">
                  Client-safe invoice status will appear here without exposing internal finance notes.
                </p>
              </div>
            )}
          </div>
        </StudioPanel>

        <StudioPanel title="Launch handoff" eyebrow="Checklist and support" icon={PackageCheck}>
          <div className="space-y-4">
            <div className="grid gap-3">
              {financeHandoff.handoffItems.length ? (
                financeHandoff.handoffItems.map((item) => <StudioHandoffCard key={item.id} item={item} />)
              ) : (
                <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.02] p-5">
                  <p className="font-montserrat text-sm text-[#878787]">
                    Launch, final asset, credential, and support handoff checks will appear when the project reaches testing.
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-white/8 pt-4">
              <div className="mb-3 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#FC6E20]" />
                <p className="font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#878787]">Support next steps</p>
              </div>
              <div className="grid gap-3">
                {financeHandoff.supportNextSteps.length ? (
                  financeHandoff.supportNextSteps.map((step) => (
                    <StudioSupportCard key={step.id} supportStep={step} />
                  ))
                ) : (
                  <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.02] p-5">
                    <p className="font-montserrat text-sm text-[#878787]">
                      Maintenance and support next steps will appear once launch timing is confirmed.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </StudioPanel>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <StudioPanel
          title="Portal onboarding review"
          eyebrow="Submitted client context"
          icon={ClipboardCheck}
          actions={
            <Link
              href="/portal/onboarding"
              className="inline-flex min-h-11 items-center rounded-2xl border border-white/8 bg-white/5 px-4 font-montserrat text-sm font-semibold text-white transition hover:border-[#FC6E20] hover:text-[#FC6E20]"
            >
              Open client form
            </Link>
          }
        >
          <div className="grid gap-3">
            {onboardingResponses.length ? (
              onboardingResponses.map((response) => (
                <OnboardingReviewCard key={response.id} response={response} />
              ))
            ) : (
              <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.02] p-5">
                <p className="font-montserrat text-sm text-[#878787]">
                  No onboarding responses have been saved yet. Once a client saves a draft or submits the form,
                  the studio can review the project context here.
                </p>
              </div>
            )}
          </div>
        </StudioPanel>

        <StudioPanel title="Onboarding handoff checks" eyebrow="What delivery can use" icon={ShieldCheck}>
          {latestOnboardingResponse ? (
            <div className="space-y-3">
              <DetailCard label="Latest response" value={`${latestOnboardingResponse.clientName} - ${latestOnboardingResponse.status}`} />
              <DetailCard label="Approval owner" value={`${latestOnboardingResponse.contactName || 'Not provided'} (${latestOnboardingResponse.approvalRole || 'Role missing'})`} />
              <DetailCard label="Deadline target" value={latestOnboardingResponse.preferredDeadline} />
              <div className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
                <p className="font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#878787]">Data boundary</p>
                <p className="mt-3 font-montserrat text-sm leading-6 text-[#FBFBFB]">
                  Review goals, audience, services, and handoff blockers here. Keep private credentials and finance
                  commentary out of the onboarding response.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.02] p-5">
              <p className="font-montserrat text-sm text-[#878787]">
                Onboarding handoff checks will appear after the first portal response is saved.
              </p>
            </div>
          )}
        </StudioPanel>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <StudioPanel title="Delivery board" eyebrow="Work by status" icon={CalendarRange}>
          <div className="grid gap-4">
            {boardColumns.map((column) => (
              <div key={column.label} className="rounded-[24px] border border-white/8 bg-[#151419] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-montserrat text-sm font-semibold text-white">{column.label}</p>
                  <StudioStatusPill label={String(column.items.length)} tone="muted" />
                </div>
                <div className="mt-4 space-y-3">
                  {column.items.map((item) => (
                    <div key={`${column.label}-${item}`} className="rounded-[18px] border border-white/8 bg-white/5 p-3">
                      <p className="font-montserrat text-sm text-white">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </StudioPanel>

        <div className="space-y-5">
          <StudioPanel title="Blockers" eyebrow="Needs resolution" icon={AlertCircle}>
            <div className="space-y-3">
              {projectBlockers.map((item) => (
                <div key={`${item.time}-${item.title}`} className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-montserrat text-sm font-semibold text-white">{item.title}</p>
                      <p className="mt-2 font-montserrat text-sm text-[#878787]">{item.meta}</p>
                    </div>
                    <StudioStatusPill label={item.time} tone="accent" />
                  </div>
                </div>
              ))}
            </div>
          </StudioPanel>

          <StudioPanel title="Client activity summary" eyebrow="Recent project movement" icon={UploadCloud}>
            <div className="space-y-3">
              {clientActivityItems.map((item) => (
                <div key={`${item.time}-${item.title}`} className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-montserrat text-sm font-semibold text-white">{item.title}</p>
                      <p className="mt-2 font-montserrat text-sm text-[#878787]">{item.meta}</p>
                    </div>
                    <span className="font-mono text-xs text-[#878787]">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </StudioPanel>
        </div>
      </section>

      {selectedRow ? (
        <ProjectKickoffDrawer
          key={selectedRow.rowId}
          row={selectedRow}
          sourceHandoff={projectHandoffs.find((handoff) => handoff.id === selectedRow.sourceHandoffId) ?? null}
          onClose={() => setSelectedRow(null)}
          onActivate={(project) => {
            if (selectedRow.sourceHandoffId) {
              activateProjectFromHandoff(selectedRow.sourceHandoffId, project);
              setSelectedRow(null);
            }
          }}
          onSaveProject={(project) => {
            updateActiveProject(project);
            setSelectedRow((current) =>
              current
                ? {
                    ...current,
                    kind: 'active',
                    project: project.project,
                    client: project.client,
                    phase: project.phase,
                    deadline: project.deadline,
                    value: project.value,
                    health: project.health,
                    owner: project.owner,
                    email: project.email,
                    notes: project.notes,
                    startedAt: project.startedAt,
                  }
                : current,
            );
          }}
        />
      ) : null}
    </div>
  );
}

function maskEmail(value: string) {
  const [name, domain] = value.split('@');

  if (!name || !domain) {
    return value || 'Email missing';
  }

  return `${name.slice(0, 2)}***@${domain}`;
}

const operationalEventTypeCopy: Record<PortalOperationalEvent['eventType'], string> = {
  approval_failure: 'Approval failure',
  asset_failure: 'Asset failure',
  auth_failure: 'Auth failure',
  monitoring_note: 'Monitoring note',
  onboarding_failure: 'Onboarding failure',
  project_data_error: 'Project data error',
  upload_failure: 'Upload failure',
};

function getOperationalEventTone(severity: PortalOperationalSeverity): 'accent' | 'muted' | 'neutral' {
  if (severity === 'critical' || severity === 'error') {
    return 'accent';
  }

  return severity === 'warning' ? 'muted' : 'neutral';
}

function OperationalEventCard({ event }: { event: PortalOperationalEvent }) {
  const actor = event.actorEmail && event.actorEmail !== 'system' ? maskEmail(event.actorEmail) : 'System';

  return (
    <article className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="font-montserrat text-sm font-semibold text-white">{event.title}</p>
          <p className="mt-2 font-montserrat text-sm text-[#878787]">
            {event.clientName} - {event.projectName}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StudioStatusPill label={event.severity} tone={getOperationalEventTone(event.severity)} />
          <StudioStatusPill label={event.resolvedAt ? 'Resolved' : 'Open'} tone={event.resolvedAt ? 'neutral' : 'accent'} />
        </div>
      </div>

      <p className="mt-4 font-montserrat text-sm leading-6 text-[#FBFBFB]">{event.detail}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <DetailCard label="Type" value={operationalEventTypeCopy[event.eventType]} />
        <DetailCard label="Route" value={event.sourceRoute || 'Not captured'} />
        <DetailCard label="Created" value={event.createdAtLabel} />
      </div>

      <p className="mt-3 font-montserrat text-xs uppercase tracking-[0.16em] text-[#878787]">
        Actor: {actor}
      </p>
    </article>
  );
}

function ReadinessGateCard({
  item,
}: {
  item: {
    detail: string;
    label: string;
    status: string;
    tone: 'accent' | 'muted' | 'neutral';
  };
}) {
  return (
    <article className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-montserrat text-sm font-semibold text-white">{item.label}</p>
          <p className="mt-2 font-montserrat text-sm leading-6 text-[#878787]">{item.detail}</p>
        </div>
        <StudioStatusPill label={item.status} tone={item.tone} />
      </div>
    </article>
  );
}

function ApprovalReviewCard({ approval }: { approval: PortalDeliverableApproval }) {
  const latestDecision = approval.latestEvent
    ? `${approval.latestEvent.decision === 'approved' ? 'Approved' : 'Revision requested'} by ${maskEmail(approval.latestEvent.decidedByEmail)}`
    : 'No client decision yet';

  return (
    <article className="rounded-[24px] border border-white/8 bg-[#151419] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="font-montserrat text-sm font-semibold text-white">{approval.title}</p>
          <p className="mt-2 font-montserrat text-sm text-[#878787]">
            {approval.clientName} - {approval.projectName}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StudioStatusPill label={approvalStatusCopy[approval.status]} tone={getApprovalTone(approval.status)} />
          <StudioStatusPill label={approval.versionLabel} tone="muted" />
        </div>
      </div>

      <p className="mt-4 font-montserrat text-sm leading-6 text-[#FBFBFB]">{approval.summary}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <DetailCard label="Due" value={approval.dueDate} />
        <DetailCard label="Published" value={approval.publishedAt} />
        <DetailCard label="Approved" value={approval.approvedAt} />
      </div>

      <div className="mt-4 rounded-[18px] border border-white/8 bg-white/5 p-3">
        <p className="flex items-center gap-2 font-montserrat text-[11px] uppercase tracking-[0.16em] text-[#878787]">
          <MessageSquareText className="h-3.5 w-3.5 text-[#FC6E20]" />
          Latest decision
        </p>
        <p className="mt-2 font-montserrat text-sm text-white">{latestDecision}</p>
        {approval.latestEvent?.note ? (
          <p className="mt-2 line-clamp-3 font-montserrat text-sm leading-6 text-[#878787]">
            {approval.latestEvent.note}
          </p>
        ) : null}
        {approval.latestEvent ? (
          <p className="mt-2 font-mono text-xs text-[#878787]">{approval.latestEvent.decidedAt}</p>
        ) : null}
      </div>
    </article>
  );
}

function NotificationRuleCard({ rule }: { rule: PortalNotificationRule }) {
  return (
    <article className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-montserrat text-sm font-semibold text-white">{rule.label}</p>
          <p className="mt-2 font-mono text-xs text-[#878787]">{rule.eventType.replace(/_/g, ' ')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StudioStatusPill label={rule.enabled ? 'Enabled' : 'Paused'} tone={rule.enabled ? 'neutral' : 'muted'} />
          <StudioStatusPill label={rule.clientVisible ? 'Client visible' : 'Internal'} tone="muted" />
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <DetailCard label="Surface" value={rule.surface.replace(/_/g, ' ')} />
        <DetailCard label="Source" value={rule.source} />
      </div>
    </article>
  );
}

function StudioInvoiceCard({ invoice }: { invoice: PortalProjectInvoice }) {
  return (
    <article className="rounded-[24px] border border-white/8 bg-[#151419] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="font-montserrat text-sm font-semibold text-white">
            {invoice.invoiceNumber} - {invoice.label}
          </p>
          <p className="mt-2 font-playfair text-3xl font-semibold text-white">{invoice.amountLabel}</p>
          <p className="mt-2 font-montserrat text-sm text-[#878787]">
            {invoice.clientName} - {invoice.projectName}
          </p>
        </div>
        <StudioStatusPill label={invoiceStatusCopy[invoice.status]} tone={getInvoiceTone(invoice.status)} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <DetailCard label="Issued" value={invoice.issuedDate} />
        <DetailCard label="Due" value={invoice.dueDate} />
        <DetailCard label="Paid" value={invoice.paidDate} />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <SnippetBlock label="Client note" value={invoice.clientNote} />
        <SnippetBlock label="Internal note" value={invoice.internalNote || 'No internal finance note.'} />
      </div>

      <div className="mt-4 rounded-[18px] border border-white/8 bg-white/5 p-3">
        <p className="font-montserrat text-[11px] uppercase tracking-[0.16em] text-[#878787]">Payment reference</p>
        <p className="mt-2 font-mono text-sm text-[#FBFBFB]">{invoice.paymentReference || 'Not issued'}</p>
      </div>
    </article>
  );
}

function StudioHandoffCard({ item }: { item: PortalProjectHandoffItem }) {
  return (
    <article className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-montserrat text-sm font-semibold text-white">{item.title}</p>
          <p className="mt-2 font-montserrat text-sm leading-6 text-[#878787]">{item.detail}</p>
        </div>
        <StudioStatusPill label={handoffStatusCopy[item.status]} tone={getHandoffTone(item.status)} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <DetailCard label="Owner" value={`${item.ownerName} / ${item.ownerRole}`} />
        <DetailCard label="Due" value={item.dueDate} />
        <DetailCard label="Completed" value={item.completedAt} />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <SnippetBlock label="Client note" value={item.clientNote} />
        <SnippetBlock label="Internal note" value={item.internalNote || 'No internal handoff note.'} />
      </div>
    </article>
  );
}

function StudioSupportCard({ supportStep }: { supportStep: PortalProjectSupportNextStep }) {
  return (
    <article className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-montserrat text-sm font-semibold text-white">{supportStep.title}</p>
          <p className="mt-2 font-montserrat text-sm leading-6 text-[#878787]">{supportStep.description}</p>
        </div>
        <StudioStatusPill label={supportStatusCopy[supportStep.status]} tone="muted" />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <DetailCard label="Starts" value={supportStep.startsOn} />
        <DetailCard label="Cadence" value={supportStep.cadence} />
        <DetailCard label="Owner" value={supportStep.ownerName} />
      </div>
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <SnippetBlock label="Client note" value={supportStep.clientNote} />
        <SnippetBlock label="Internal note" value={supportStep.internalNote || 'No internal support note.'} />
      </div>
    </article>
  );
}

function OnboardingReviewCard({ response }: { response: StudioOnboardingResponse }) {
  return (
    <article className="rounded-[24px] border border-white/8 bg-[#151419] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-montserrat text-sm font-semibold text-white">{response.clientName}</p>
          <p className="mt-2 font-montserrat text-sm text-[#878787]">{response.projectName}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StudioStatusPill label={response.status} tone={response.status === 'submitted' ? 'accent' : 'muted'} />
          <StudioStatusPill label={response.source} tone="muted" />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[18px] border border-white/8 bg-white/5 p-3">
          <p className="font-montserrat text-[11px] uppercase tracking-[0.16em] text-[#878787]">Approver</p>
          <p className="mt-2 font-montserrat text-sm text-white">{response.contactName || 'Not provided'}</p>
          <p className="mt-2 inline-flex items-center gap-2 font-mono text-xs text-[#878787]">
            <Mail className="h-3.5 w-3.5" />
            {maskEmail(response.contactEmail)}
          </p>
        </div>
        <DetailCard label="Role" value={response.approvalRole || 'Role missing'} />
        <DetailCard label="Deadline" value={response.preferredDeadline} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {response.services.length ? (
          response.services.map((service) => (
            <span
              key={`${response.id}-${service}`}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-montserrat text-[11px] uppercase tracking-[0.12em] text-[#FBFBFB]"
            >
              {service}
            </span>
          ))
        ) : (
          <StudioStatusPill label="Services missing" tone="accent" />
        )}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <SnippetBlock label="Goals" value={response.projectGoals} />
        <SnippetBlock label="Audience" value={response.primaryAudience} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <DetailCard label="Brand assets" value={response.brandAssetsStatus} />
        <DetailCard label="Last saved" value={response.lastSavedAt} />
        <DetailCard label="Submitted" value={response.submittedAt} />
      </div>
    </article>
  );
}

const assetStatusCopy = {
  accepted: 'Accepted',
  needs_replacement: 'Needs replacement',
  quarantined: 'Quarantined',
  received: 'Received',
};

const assetReviewCopy = {
  approved: 'Approved',
  pending_review: 'Pending review',
  rejected: 'Rejected',
};

type AssetReviewAction = 'accept' | 'quarantine' | 'replacement' | 'reset';

type AssetReviewResponse = {
  ok?: boolean;
  error?: string;
  reviewStatus?: PortalProjectAsset['reviewStatus'];
  uploadStatus?: PortalProjectAsset['uploadStatus'];
};

type AssetDeleteResponse = {
  ok?: boolean;
  error?: string;
};

const assetReviewActionCopy = {
  accept: {
    label: 'Accept',
    note: 'Accepted by studio review.',
  },
  quarantine: {
    label: 'Hold',
    note: 'Held for manual safety review.',
  },
  replacement: {
    label: 'Replace',
    note: 'Replacement requested by studio review.',
  },
  reset: {
    label: 'Reset',
    note: 'Returned to pending review.',
  },
} satisfies Record<AssetReviewAction, { label: string; note: string }>;

function AssetReviewCard({ asset }: { asset: PortalProjectAsset }) {
  const [currentAsset, setCurrentAsset] = useState(asset);
  const [reviewingAction, setReviewingAction] = useState<AssetReviewAction | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [reviewError, setReviewError] = useState('');

  async function reviewAsset(action: AssetReviewAction) {
    setReviewingAction(action);
    setReviewError('');

    try {
      const response = await fetch('/api/portal/assets', {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          assetId: currentAsset.id,
          reviewNote: assetReviewActionCopy[action].note,
        }),
      });
      const payload = (await response.json()) as AssetReviewResponse;

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || 'Asset review could not be saved.');
      }

      setCurrentAsset((previous) => ({
        ...previous,
        reviewNote: assetReviewActionCopy[action].note,
        reviewStatus: payload.reviewStatus ?? previous.reviewStatus,
        uploadStatus: payload.uploadStatus ?? previous.uploadStatus,
      }));
    } catch (error) {
      setReviewError(error instanceof Error ? error.message : 'Asset review could not be saved.');
    } finally {
      setReviewingAction(null);
    }
  }

  async function deleteAsset() {
    if (!window.confirm('Delete this client asset from private storage?')) {
      return;
    }

    setDeleting(true);
    setReviewError('');

    try {
      const response = await fetch(`/api/portal/assets/${currentAsset.id}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      const payload = (await response.json()) as AssetDeleteResponse;

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || 'Asset could not be deleted.');
      }

      setDeleted(true);
    } catch (error) {
      setReviewError(error instanceof Error ? error.message : 'Asset could not be deleted.');
    } finally {
      setDeleting(false);
    }
  }

  if (deleted) {
    return null;
  }

  return (
    <article className="rounded-[24px] border border-white/8 bg-[#151419] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="truncate font-montserrat text-sm font-semibold text-white">{currentAsset.fileName}</p>
          <p className="mt-2 font-montserrat text-sm text-[#878787]">
            {currentAsset.clientName} - {currentAsset.projectName}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StudioStatusPill
            label={assetReviewCopy[currentAsset.reviewStatus]}
            tone={currentAsset.reviewStatus === 'pending_review' ? 'accent' : 'muted'}
          />
          <StudioStatusPill label={assetStatusCopy[currentAsset.uploadStatus]} tone="muted" />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <DetailCard label="Bucket" value={currentAsset.categoryTitle} />
        <DetailCard label="Size" value={currentAsset.sizeLabel} />
        <DetailCard label="Uploaded" value={currentAsset.uploadedAt} />
      </div>

      <div className="mt-4 rounded-[18px] border border-white/8 bg-white/5 p-3">
        <p className="font-montserrat text-[11px] uppercase tracking-[0.16em] text-[#878787]">Submitted by</p>
        <p className="mt-2 inline-flex items-center gap-2 font-mono text-xs text-[#FBFBFB]">
          <Mail className="h-3.5 w-3.5" />
          {maskEmail(currentAsset.uploadedByEmail)}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={`/api/portal/assets/${currentAsset.id}`}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl border border-white/8 bg-white/5 px-3 font-montserrat text-xs font-semibold text-white transition hover:border-[#FC6E20] hover:text-[#FC6E20]"
        >
          <Download className="h-3.5 w-3.5" />
          Download
        </a>
        {(['accept', 'replacement', 'quarantine', 'reset'] as AssetReviewAction[]).map((action) => (
          <button
            key={`${currentAsset.id}-${action}`}
            type="button"
            onClick={() => void reviewAsset(action)}
            disabled={reviewingAction !== null}
            className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl px-3 font-montserrat text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
              action === 'accept'
                ? 'bg-[#FC6E20] text-[#151419] hover:bg-[#e95f14]'
                : 'border border-white/8 bg-white/5 text-white hover:border-[#FC6E20] hover:text-[#FC6E20]'
            }`}
          >
            {reviewingAction === action ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            {assetReviewActionCopy[action].label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => void deleteAsset()}
          disabled={reviewingAction !== null || deleting}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl border border-red-400/25 bg-red-400/10 px-3 font-montserrat text-xs font-semibold text-red-100 transition hover:border-red-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
          Delete
        </button>
      </div>

      {reviewError ? (
        <p className="mt-4 flex items-start gap-2 rounded-[18px] border border-red-400/25 bg-red-400/10 p-3 font-montserrat text-sm leading-6 text-red-100">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {reviewError}
        </p>
      ) : null}

      {currentAsset.reviewNote ? (
        <div className="mt-4">
          <SnippetBlock label="Review note" value={currentAsset.reviewNote} />
        </div>
      ) : null}
    </article>
  );
}

function SnippetBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-white/8 bg-white/5 p-3">
      <p className="font-montserrat text-[11px] uppercase tracking-[0.16em] text-[#878787]">{label}</p>
      <p className="mt-2 line-clamp-4 font-montserrat text-sm leading-6 text-[#FBFBFB]">
        {value || 'Not provided yet.'}
      </p>
    </div>
  );
}

function ProjectKickoffDrawer({
  row,
  sourceHandoff,
  onClose,
  onActivate,
  onSaveProject,
}: {
  row: ProjectTableRow;
  sourceHandoff: CrmHandoffRecord | null;
  onClose: () => void;
  onActivate: (project: WorkflowProjectRecord) => void;
  onSaveProject: (project: WorkflowProjectRecord) => void;
}) {
  const [editing, setEditing] = useState(row.kind !== 'seed');
  const [draft, setDraft] = useState<WorkflowProjectRecord>(() =>
    row.kind === 'active'
      ? {
          id: row.rowId,
          sourceHandoffId: row.sourceHandoffId,
          project: row.project,
          client: row.client,
          phase: row.phase,
          deadline: row.deadline,
          value: row.value,
          health: row.health,
          owner: row.owner ?? 'Delite',
          email: row.email,
          notes: row.notes,
          startedAt: row.startedAt ?? 'Today',
        }
      : asProjectDraft(sourceHandoff ?? {
          id: row.sourceHandoffId,
          type: 'Project',
          client: row.client,
          business: row.project,
          owner: row.owner ?? 'Delite',
          stage: row.health,
          summary: row.notes ?? '',
          email: row.email,
          budget: row.value,
          notes: row.notes,
          createdAt: row.startedAt ?? row.deadline,
        }),
  );

  const canActivate = row.kind === 'handoff' && !!row.sourceHandoffId;
  const canSave = row.kind === 'active';

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <aside
        className="h-full w-full max-w-[560px] overflow-y-auto border-l border-white/10 bg-[#151419] p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-montserrat text-[11px] uppercase tracking-[0.22em] text-[#FC6E20]">
              {row.kind === 'handoff' ? 'Kickoff intake' : row.kind === 'active' ? 'Active project' : 'Project record'}
            </p>
            <h3 className="mt-3 font-playfair text-4xl font-semibold text-white">{row.project}</h3>
            <p className="mt-3 text-sm leading-7 text-[#878787]">{row.client}</p>
          </div>
          <div className="flex items-center gap-2">
            {row.kind !== 'seed' ? (
              <button
                type="button"
                onClick={() => setEditing((current) => !current)}
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:border-[#FC6E20] hover:text-[#FC6E20]"
              >
                <Pencil className="h-4 w-4" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:border-[#FC6E20] hover:text-[#FC6E20]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <StudioStatusPill label={row.phase} tone={row.kind === 'handoff' ? 'accent' : 'neutral'} />
          <StudioStatusPill label={row.health} tone={row.health === 'On track' ? 'neutral' : 'accent'} />
          <StudioStatusPill label={row.value} tone="accent" />
        </div>

        {canActivate ? (
          <div className="mt-6 rounded-[24px] border border-white/8 bg-[#1B1B1E] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#FC6E20]">Kickoff decision</p>
                <p className="mt-3 text-sm leading-7 text-[#878787]">
                  Review this intake, fill in the delivery basics, then promote it into the active project register.
                </p>
              </div>
              <CheckCircle2 className="mt-1 h-5 w-5 text-[#FC6E20]" />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onActivate(draft)}
                className="inline-flex min-h-12 items-center rounded-2xl bg-[#FC6E20] px-4 font-montserrat text-sm font-semibold text-[#151419] transition hover:bg-[#e95f14]"
              >
                Start project
              </button>
            </div>
          </div>
        ) : null}

        {editing ? (
          <>
            <div className="mt-6 rounded-[24px] border border-white/8 bg-[#1B1B1E] p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Project name" value={draft.project} onChange={(value) => setDraft((current) => ({ ...current, project: value }))} />
                <Field label="Client" value={draft.client} onChange={(value) => setDraft((current) => ({ ...current, client: value }))} />
                <Field label="Phase" value={draft.phase} onChange={(value) => setDraft((current) => ({ ...current, phase: value }))} />
                <Field label="Deadline" value={draft.deadline} onChange={(value) => setDraft((current) => ({ ...current, deadline: value }))} />
                <Field label="Value" value={draft.value} onChange={(value) => setDraft((current) => ({ ...current, value: value }))} />
                <Field label="Health" value={draft.health} onChange={(value) => setDraft((current) => ({ ...current, health: value }))} />
                <Field label="Owner" value={draft.owner} onChange={(value) => setDraft((current) => ({ ...current, owner: value }))} />
                <Field label="Email" value={draft.email ?? ''} onChange={(value) => setDraft((current) => ({ ...current, email: value }))} />
                <TextAreaField label="Notes" value={draft.notes ?? ''} onChange={(value) => setDraft((current) => ({ ...current, notes: value }))} className="sm:col-span-2" />
              </div>
            </div>

            {canSave ? (
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onSaveProject(draft);
                    setEditing(false);
                  }}
                  className="inline-flex min-h-12 items-center rounded-2xl bg-[#FC6E20] px-4 font-montserrat text-sm font-semibold text-[#151419] transition hover:bg-[#e95f14]"
                >
                  Save project
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="inline-flex min-h-12 items-center rounded-2xl border border-white/8 bg-[#1B1B1E] px-4 font-montserrat text-sm font-semibold text-white transition hover:border-[#FC6E20]"
                >
                  Done editing
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <DetailCard label="Phase" value={row.phase} />
              <DetailCard label="Deadline" value={row.deadline} />
              <DetailCard label="Value" value={row.value} />
              <DetailCard label="Owner" value={row.owner ?? 'Delite'} />
            </div>

            {row.notes ? (
              <div className="mt-6 rounded-[24px] border border-white/8 bg-[#1B1B1E] p-5">
                <p className="font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#FC6E20]">Notes</p>
                <p className="mt-3 text-sm leading-7 text-[#FBFBFB]">{row.notes}</p>
              </div>
            ) : null}
          </>
        )}
      </aside>
    </div>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-[#1B1B1E] p-4">
      <p className="font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#878787]">{label}</p>
      <p className="mt-3 font-montserrat text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="block font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#878787]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-[18px] border border-white/8 bg-[#151419] px-4 py-3 font-montserrat text-sm text-white outline-none transition focus:border-[#FC6E20]"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="block font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#878787]">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="mt-2 w-full rounded-[18px] border border-white/8 bg-[#151419] px-4 py-3 font-montserrat text-sm text-white outline-none transition focus:border-[#FC6E20]"
      />
    </label>
  );
}
