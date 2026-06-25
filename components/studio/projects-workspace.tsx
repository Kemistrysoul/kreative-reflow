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
  PortalCommunicationContextType,
  PortalCommunicationSummary,
  PortalDecisionSourceChannel,
  PortalDecisionType,
  PortalMeetingRequest,
  PortalMeetingStatus,
  PortalMessageThread,
  PortalProjectDecision,
  PortalThreadStatus,
} from '@/lib/portal-communications';
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
import type {
  PortalReadinessGateData,
  PortalReadinessItem,
  PortalReadinessStatus,
} from '@/lib/portal-readiness';
import type {
  PortalProjectRequest,
  PortalRequestClassification,
  PortalRequestClientDecision,
  PortalRequestSourceChannel,
  PortalRequestStatus,
  PortalRequestSummary,
  PortalRequestType,
  PortalRequestUrgency,
} from '@/lib/portal-requests';

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

const emptyReadinessGate: PortalReadinessGateData = {
  blockingItems: [],
  clientActionItems: [],
  completeRequiredCount: 0,
  contractStatusLabel: 'Not tracked',
  depositStatusLabel: 'Not tracked',
  isReadyForActiveDelivery: false,
  items: [],
  nextAction: 'No readiness gate records are available yet.',
  requiredCount: 0,
  source: 'demo',
  sowStatusLabel: 'Not tracked',
  summary: 'No readiness gate records are available yet.',
};

const emptyRequestSummary: PortalRequestSummary = {
  latestRequest: null,
  openCount: 0,
  outOfScopePendingCount: 0,
  requests: [],
  source: 'supabase',
  waitingApprovalCount: 0,
  waitingClientCount: 0,
};

const emptyCommunicationSummary: PortalCommunicationSummary = {
  decisions: [],
  latestDecision: null,
  latestMeeting: null,
  latestMessage: null,
  meetings: [],
  openMeetingCount: 0,
  openThreadCount: 0,
  pendingActionCount: 0,
  source: 'supabase',
  threads: [],
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

const readinessStatusCopy: Record<PortalReadinessStatus, string> = {
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

const requestTypeCopy: Record<PortalRequestType, string> = {
  bug_fix: 'Bug or fix',
  maintenance_request: 'Maintenance',
  meeting_request: 'Meeting',
  question: 'Question',
  scope_change: 'Scope change',
  small_change: 'Small change',
  support_request: 'Support',
};

const requestStatusCopy: Record<PortalRequestStatus, string> = {
  approved: 'Approved',
  closed: 'Closed',
  declined: 'Declined',
  in_progress: 'In progress',
  parked: 'Parked',
  resolved: 'Resolved',
  submitted: 'Submitted',
  triage: 'Triage',
  waiting_approval: 'Waiting approval',
  waiting_client: 'Waiting client',
};

const requestClassificationCopy: Record<PortalRequestClassification, string> = {
  change_request: 'Change request',
  fix: 'Fix',
  included_revision: 'Included revision',
  maintenance: 'Maintenance',
  out_of_scope: 'Out of scope',
  unclassified: 'Unclassified',
};

const requestUrgencyCopy: Record<PortalRequestUrgency, string> = {
  high: 'High',
  low: 'Low',
  normal: 'Normal',
  urgent: 'Urgent',
};

const requestSourceCopy: Record<PortalRequestSourceChannel, string> = {
  email: 'Email',
  meeting: 'Meeting',
  phone: 'Phone',
  portal: 'Portal',
  studio_logged: 'Studio logged',
  whatsapp: 'WhatsApp',
};

const decisionTypeCopy: Record<PortalDecisionType, string> = {
  approval: 'Approval',
  kickoff_outcome: 'Kickoff outcome',
  meeting_outcome: 'Meeting outcome',
  phone_call: 'Phone call',
  project_decision: 'Project decision',
  scope_decision: 'Scope decision',
  support: 'Support',
  whatsapp_summary: 'WhatsApp summary',
};

const decisionSourceCopy: Record<PortalDecisionSourceChannel, string> = {
  approval: 'Approval',
  email: 'Email',
  meeting: 'Meeting',
  phone: 'Phone',
  portal: 'Portal',
  studio_logged: 'Studio logged',
  whatsapp: 'WhatsApp',
};

const communicationContextCopy: Record<PortalCommunicationContextType, string> = {
  approval: 'Approval',
  deliverable: 'Deliverable',
  handoff: 'Handoff',
  invoice: 'Invoice',
  meeting: 'Meeting',
  milestone: 'Milestone',
  other: 'Other',
  project: 'Project',
  request: 'Request',
  support: 'Support',
};

const meetingStatusCopy: Record<PortalMeetingStatus, string> = {
  cancelled: 'Cancelled',
  completed: 'Completed',
  declined: 'Declined',
  requested: 'Requested',
  scheduled: 'Scheduled',
};

const threadStatusCopy: Record<PortalThreadStatus, string> = {
  archived: 'Archived',
  open: 'Open',
  resolved: 'Resolved',
  waiting_client: 'Waiting client',
  waiting_studio: 'Waiting studio',
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

function getReadinessTone(status: PortalReadinessStatus): 'accent' | 'muted' | 'neutral' {
  if (status === 'blocked' || status === 'waiting_client') {
    return 'accent';
  }

  return status === 'done' ? 'neutral' : 'muted';
}

function getRequestStatusTone(status: PortalRequestStatus): 'accent' | 'muted' | 'neutral' {
  if (status === 'submitted' || status === 'triage' || status === 'waiting_approval' || status === 'waiting_client') {
    return 'accent';
  }

  if (status === 'approved' || status === 'in_progress') {
    return 'neutral';
  }

  return 'muted';
}

function getRequestClassificationTone(classification: PortalRequestClassification): 'accent' | 'muted' | 'neutral' {
  if (classification === 'change_request' || classification === 'out_of_scope') {
    return 'accent';
  }

  return classification === 'unclassified' ? 'muted' : 'neutral';
}

function getMeetingTone(status: PortalMeetingStatus): 'accent' | 'muted' | 'neutral' {
  if (status === 'requested') {
    return 'accent';
  }

  return status === 'scheduled' ? 'neutral' : 'muted';
}

function getThreadTone(status: PortalThreadStatus): 'accent' | 'muted' | 'neutral' {
  if (status === 'waiting_studio') {
    return 'accent';
  }

  return status === 'open' || status === 'waiting_client' ? 'neutral' : 'muted';
}

function formatStudioDate(value: string, fallback = 'Not set') {
  if (!value) return fallback;

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return new Intl.DateTimeFormat('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
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
  portalCommunications = emptyCommunicationSummary,
  projectRequests = emptyRequestSummary,
  readinessGate = emptyReadinessGate,
}: {
  approvalQueue?: PortalDeliverableApproval[];
  assetReviews?: PortalProjectAsset[];
  financeHandoff?: PortalFinanceHandoffData;
  notificationRules?: PortalNotificationRule[];
  onboardingResponses?: StudioOnboardingResponse[];
  operationalEvents?: PortalOperationalEvent[];
  portalCommunications?: PortalCommunicationSummary;
  projectRequests?: PortalRequestSummary;
  readinessGate?: PortalReadinessGateData;
}) {
  const {
    projectHandoffs,
    activeProjects,
    activateProjectFromHandoff,
    updateActiveProject,
  } = useStudioWorkflow();
  const [selectedRow, setSelectedRow] = useState<ProjectTableRow | null>(null);
  const [communicationSummary, setCommunicationSummary] = useState<PortalCommunicationSummary>(portalCommunications);
  const [requests, setRequests] = useState<PortalProjectRequest[]>(projectRequests.requests);
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
  const readinessOpenCount = Math.max(readinessGate.requiredCount - readinessGate.completeRequiredCount, 0);
  const readinessBlockingCount = readinessGate.blockingItems.length;
  const openRequestStatuses = new Set<PortalRequestStatus>([
    'approved',
    'in_progress',
    'submitted',
    'triage',
    'waiting_approval',
    'waiting_client',
  ]);
  const requestOpenCount = requests.filter((request) => openRequestStatuses.has(request.status)).length;
  const requestWaitingApprovalCount = requests.filter((request) => request.status === 'waiting_approval').length;
  const requestScopePendingCount = requests.filter((request) =>
    (request.classification === 'change_request' || request.classification === 'out_of_scope') &&
    request.clientDecision === 'pending'
  ).length;
  const communicationActionCount = communicationSummary.openMeetingCount + communicationSummary.pendingActionCount;
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
      label: 'Commercial Gate',
      value: readinessGate.isReadyForActiveDelivery ? 'Ready' : String(readinessBlockingCount),
      detail: readinessGate.isReadyForActiveDelivery
        ? 'Agreement, SOW, deposit, kickoff, access, and client blockers are clear'
        : `${readinessOpenCount} required gate item${readinessOpenCount === 1 ? '' : 's'} still open`,
      icon: ShieldCheck,
      tone: readinessBlockingCount ? 'accent' : 'neutral',
      spark: [0, 1, readinessGate.completeRequiredCount + 1, readinessGate.requiredCount + 1, readinessBlockingCount + 1],
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
      label: 'Request Queue',
      value: String(requestWaitingApprovalCount || requestOpenCount),
      detail: requestScopePendingCount
        ? `${requestScopePendingCount} scope decision${requestScopePendingCount === 1 ? '' : 's'} waiting for client approval`
        : `${requestOpenCount} open request${requestOpenCount === 1 ? '' : 's'} in triage or delivery`,
      icon: MessageSquareText,
      tone: requestWaitingApprovalCount ? 'accent' : 'muted',
      spark: [0, 1, requests.length + 1, requestOpenCount + 1, requestWaitingApprovalCount + 1],
    },
    {
      label: 'Communications',
      value: String(communicationActionCount + communicationSummary.openThreadCount),
      detail: communicationActionCount
        ? `${communicationActionCount} meeting or message action${communicationActionCount === 1 ? '' : 's'} need follow-up`
        : `${communicationSummary.decisions.length} written decision${communicationSummary.decisions.length === 1 ? '' : 's'} captured`,
      icon: Mail,
      tone: communicationActionCount ? 'accent' : 'muted',
      spark: [
        0,
        communicationSummary.meetings.length + 1,
        communicationSummary.threads.length + 1,
        communicationSummary.decisions.length + 1,
        communicationActionCount + 1,
      ],
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
      ...requests.slice(0, 2).map((request) => ({
        time: requestStatusCopy[request.status],
        title: `${request.clientName} - ${request.requestNumber} ${request.title}`,
        meta: `${requestTypeCopy[request.requestType]} - ${request.nextAction}`,
      })),
      ...communicationSummary.meetings.slice(0, 1).map((meeting) => ({
        time: meetingStatusCopy[meeting.status],
        title: `${meeting.clientName} - ${meeting.meetingNumber} ${meeting.title}`,
        meta: `${meeting.scheduledFor} - ${meeting.nextAction}`,
      })),
      ...communicationSummary.threads.slice(0, 1).map((thread) => ({
        time: threadStatusCopy[thread.status],
        title: `${thread.clientName} - ${thread.subject}`,
        meta: `${communicationContextCopy[thread.contextType]} - ${thread.lastMessageAt}`,
      })),
      ...communicationSummary.decisions.slice(0, 1).map((decision) => ({
        time: decisionTypeCopy[decision.decisionType],
        title: `${decision.clientName} - ${decision.decisionNumber} ${decision.title}`,
        meta: `${decisionSourceCopy[decision.sourceChannel]} - ${decision.decidedAt}`,
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
    [approvalQueue, assetReviews, communicationSummary, financeHandoff, onboardingResponses, requests],
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
      label: 'Commercial gate',
      status: readinessGate.isReadyForActiveDelivery ? 'Ready' : 'Blocked',
      detail: readinessGate.summary,
      tone: readinessGate.isReadyForActiveDelivery ? 'neutral' as const : 'accent' as const,
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
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#595959]">
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
            <p className="font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#595959]">Kickoff queue</p>
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
                      <p className="mt-2 text-sm text-[#595959]">{row.project}</p>
                    </div>
                    <StudioStatusPill label={row.health} tone="accent" />
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[18px] border border-white/8 bg-white/5 p-3">
                      <p className="font-montserrat text-[11px] uppercase tracking-[0.16em] text-[#595959]">Budget</p>
                      <p className="mt-2 font-mono text-sm text-[#FC6E20]">{row.value}</p>
                    </div>
                    <div className="rounded-[18px] border border-white/8 bg-white/5 p-3">
                      <p className="font-montserrat text-[11px] uppercase tracking-[0.16em] text-[#595959]">Owner</p>
                      <p className="mt-2 text-sm text-white">{row.owner ?? 'Disele'}</p>
                    </div>
                  </div>
                  {row.notes ? (
                    <p className="mt-4 text-sm leading-6 text-[#595959]">{row.notes}</p>
                  ) : null}
                </button>
              ))
            ) : (
              <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.02] p-5">
                <p className="font-montserrat text-sm text-[#595959]">
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

      <section className="grid gap-5 xl:grid-cols-[1.14fr_0.86fr]">
        <StudioPanel
          title="Request queue"
          eyebrow="Scope control and client changes"
          icon={MessageSquareText}
          actions={
            <Link
              href="/portal?section=requests"
              className="inline-flex min-h-11 items-center rounded-2xl border border-white/8 bg-white/5 px-4 font-montserrat text-sm font-semibold text-white transition hover:border-[#FC6E20] hover:text-[#FC6E20]"
            >
              Open portal
            </Link>
          }
        >
          <StudioRequestQueue
            requests={requests}
            onRequestChange={(updatedRequest) =>
              setRequests((currentRequests) =>
                currentRequests.map((request) =>
                  request.id === updatedRequest.id ? updatedRequest : request
                )
              )
            }
          />
        </StudioPanel>

        <StudioPanel title="Log outside request" eyebrow="WhatsApp, phone, email, or meeting" icon={ClipboardCheck}>
          <StudioRequestLogForm
            templateRequest={requests[0] ?? projectRequests.latestRequest}
            onRequestCreated={(createdRequest) =>
              setRequests((currentRequests) => [createdRequest, ...currentRequests])
            }
          />
        </StudioPanel>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.12fr_0.88fr]">
        <StudioPanel
          title="Communication hub"
          eyebrow="Meetings, threads, and decisions"
          icon={Mail}
          actions={
            <Link
              href="/portal?section=messages"
              className="inline-flex min-h-11 items-center rounded-2xl border border-white/8 bg-white/5 px-4 font-montserrat text-sm font-semibold text-white transition hover:border-[#FC6E20] hover:text-[#FC6E20]"
            >
              Open portal
            </Link>
          }
        >
          <StudioCommunicationHub communicationSummary={communicationSummary} />
        </StudioPanel>

        <StudioPanel title="Decision capture" eyebrow="Phone, WhatsApp, email, or meeting" icon={ClipboardCheck}>
          <StudioDecisionLogForm
            templateDecision={communicationSummary.latestDecision}
            onDecisionCreated={(decision) =>
              setCommunicationSummary((currentSummary) => ({
                ...currentSummary,
                decisions: [decision, ...currentSummary.decisions],
                latestDecision: decision,
                pendingActionCount: decision.actionItems
                  ? currentSummary.pendingActionCount + 1
                  : currentSummary.pendingActionCount,
              }))
            }
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
                <p className="font-montserrat text-sm text-[#595959]">
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
              <p className="font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#595959]">Before use</p>
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
                <p className="font-montserrat text-sm text-[#595959]">
                  Client approval decisions will appear here with version, approver, timestamp, and revision notes.
                </p>
              </div>
            )}
          </div>
        </StudioPanel>

        <StudioPanel title="Notification rules" eyebrow="Client-visible activity" icon={BellRing}>
          <div className="space-y-3">
            <div className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
              <p className="font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#595959]">Enabled rules</p>
              <p className="mt-2 font-playfair text-4xl font-semibold text-white">{enabledNotificationCount}</p>
              <p className="mt-2 font-montserrat text-sm leading-6 text-[#595959]">
                Portal activity is written only when its project notification rule is enabled.
              </p>
            </div>
            {notificationRules.length ? (
              notificationRules.map((rule) => <NotificationRuleCard key={rule.id} rule={rule} />)
            ) : (
              <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.02] p-5">
                <p className="font-montserrat text-sm text-[#595959]">
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
                <p className="font-montserrat text-sm text-[#595959]">
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

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <StudioPanel
          title="Commercial readiness gate"
          eyebrow="Contract, SOW, deposit, and start control"
          icon={ShieldCheck}
        >
          <StudioReadinessGateEditor readinessGate={readinessGate} />
        </StudioPanel>

        <StudioPanel title="Active-delivery decision" eyebrow="Can the project start?" icon={ClipboardCheck}>
          <div className="space-y-3">
            <DetailCard
              label="Gate state"
              value={readinessGate.isReadyForActiveDelivery ? 'Ready for active delivery' : 'Blocked before active delivery'}
            />
            <DetailCard label="Required complete" value={`${readinessGate.completeRequiredCount}/${readinessGate.requiredCount}`} />
            <DetailCard label="Contract" value={readinessGate.contractStatusLabel} />
            <DetailCard label="SOW" value={readinessGate.sowStatusLabel} />
            <DetailCard label="Deposit" value={readinessGate.depositStatusLabel} />
            <div className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
              <p className="font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#595959]">Next action</p>
              <p className="mt-3 font-montserrat text-sm leading-6 text-[#FBFBFB]">{readinessGate.nextAction}</p>
            </div>
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
                <p className="font-montserrat text-sm text-[#595959]">
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
                  <p className="font-montserrat text-sm text-[#595959]">
                    Launch, final asset, credential, and support handoff checks will appear when the project reaches testing.
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-white/8 pt-4">
              <div className="mb-3 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#FC6E20]" />
                <p className="font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#595959]">Support next steps</p>
              </div>
              <div className="grid gap-3">
                {financeHandoff.supportNextSteps.length ? (
                  financeHandoff.supportNextSteps.map((step) => (
                    <StudioSupportCard key={step.id} supportStep={step} />
                  ))
                ) : (
                  <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.02] p-5">
                    <p className="font-montserrat text-sm text-[#595959]">
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
                <p className="font-montserrat text-sm text-[#595959]">
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
                <p className="font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#595959]">Data boundary</p>
                <p className="mt-3 font-montserrat text-sm leading-6 text-[#FBFBFB]">
                  Review goals, audience, services, and handoff blockers here. Keep private credentials and finance
                  commentary out of the onboarding response.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.02] p-5">
              <p className="font-montserrat text-sm text-[#595959]">
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
                      <p className="mt-2 font-montserrat text-sm text-[#595959]">{item.meta}</p>
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
                      <p className="mt-2 font-montserrat text-sm text-[#595959]">{item.meta}</p>
                    </div>
                    <span className="font-mono text-xs text-[#595959]">{item.time}</span>
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
          <p className="mt-2 font-montserrat text-sm text-[#595959]">
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

      <p className="mt-3 font-montserrat text-xs uppercase tracking-[0.16em] text-[#595959]">
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
          <p className="mt-2 font-montserrat text-sm leading-6 text-[#595959]">{item.detail}</p>
        </div>
        <StudioStatusPill label={item.status} tone={item.tone} />
      </div>
    </article>
  );
}

type ReadinessUpdateResponse = {
  completedAt?: string | null;
  error?: string;
  ok?: boolean;
  status?: PortalReadinessStatus;
};

function StudioReadinessGateEditor({ readinessGate }: { readinessGate: PortalReadinessGateData }) {
  const [items, setItems] = useState<PortalReadinessItem[]>(readinessGate.items);
  const [savingId, setSavingId] = useState('');
  const [saveError, setSaveError] = useState('');
  const requiredItems = items.filter((item) => item.requiredForActiveDelivery);
  const blockingItems = requiredItems.filter((item) =>
    item.blocksActiveDelivery && item.status !== 'done'
  );
  const completeRequiredCount = requiredItems.filter((item) => item.status === 'done').length;

  function updateItem(itemId: string, patch: Partial<PortalReadinessItem>) {
    setItems((currentItems) =>
      currentItems.map((item) => (item.id === itemId ? { ...item, ...patch } : item))
    );
  }

  async function saveItem(item: PortalReadinessItem) {
    setSavingId(item.id);
    setSaveError('');

    try {
      const response = await fetch('/api/portal/readiness', {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blocksActiveDelivery: item.blocksActiveDelivery,
          clientNote: item.clientNote,
          dueOn: item.dueOn,
          internalNote: item.internalNote,
          itemId: item.id,
          ownerName: item.ownerName,
          ownerRole: item.ownerRole,
          requiredForActiveDelivery: item.requiredForActiveDelivery,
          status: item.status,
        }),
      });
      const payload = (await response.json()) as ReadinessUpdateResponse;

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || 'Readiness update could not be saved.');
      }

      updateItem(item.id, {
        completedAt: item.status === 'done' ? 'Updated just now' : 'Not completed',
        status: payload.status ?? item.status,
      });
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Readiness update could not be saved.');
    } finally {
      setSavingId('');
    }
  }

  if (!items.length) {
    return (
      <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.02] p-5">
        <p className="font-montserrat text-sm text-[#595959]">
          Readiness gate records will appear here after the Supabase migration is applied.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <DetailCard label="Required complete" value={`${completeRequiredCount}/${requiredItems.length}`} />
        <DetailCard label="Blocking items" value={String(blockingItems.length)} />
        <DetailCard label="Source" value={readinessGate.source} />
      </div>

      {saveError ? (
        <p className="flex items-start gap-2 rounded-[18px] border border-red-400/25 bg-red-400/10 p-3 font-montserrat text-sm leading-6 text-red-100">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {saveError}
        </p>
      ) : null}

      <div className="grid gap-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-[24px] border border-white/8 bg-[#151419] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="font-montserrat text-sm font-semibold text-white">{item.label}</p>
                <p className="mt-2 font-montserrat text-sm leading-6 text-[#595959]">{item.detail}</p>
              </div>
              <StudioStatusPill label={readinessStatusCopy[item.status]} tone={getReadinessTone(item.status)} />
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <label>
                <span className="block font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#595959]">
                  Status
                </span>
                <select
                  value={item.status}
                  onChange={(event) =>
                    updateItem(item.id, { status: event.target.value as PortalReadinessStatus })
                  }
                  className="mt-2 min-h-12 w-full rounded-[18px] border border-white/8 bg-[#1B1B1E] px-4 font-montserrat text-sm text-white outline-none transition focus:border-[#FC6E20]"
                >
                  {(Object.keys(readinessStatusCopy) as PortalReadinessStatus[]).map((status) => (
                    <option key={status} value={status}>
                      {readinessStatusCopy[status]}
                    </option>
                  ))}
                </select>
              </label>
              <Field
                label="Owner"
                value={item.ownerName}
                onChange={(value) => updateItem(item.id, { ownerName: value })}
              />
              <Field
                label="Owner role"
                value={item.ownerRole}
                onChange={(value) => updateItem(item.id, { ownerRole: value })}
              />
              <label>
                <span className="block font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#595959]">
                  Due date
                </span>
                <input
                  type="date"
                  value={item.dueOn}
                  onChange={(event) => updateItem(item.id, { dueOn: event.target.value })}
                  className="mt-2 min-h-12 w-full rounded-[18px] border border-white/8 bg-[#1B1B1E] px-4 font-montserrat text-sm text-white outline-none transition focus:border-[#FC6E20]"
                />
              </label>
              <label className="flex min-h-12 items-center gap-3 rounded-[18px] border border-white/8 bg-[#1B1B1E] px-4 py-3">
                <input
                  type="checkbox"
                  checked={item.requiredForActiveDelivery}
                  onChange={(event) => updateItem(item.id, { requiredForActiveDelivery: event.target.checked })}
                  className="h-4 w-4 accent-[#FC6E20]"
                />
                <span className="font-montserrat text-xs font-semibold text-white">Required</span>
              </label>
              <label className="flex min-h-12 items-center gap-3 rounded-[18px] border border-white/8 bg-[#1B1B1E] px-4 py-3">
                <input
                  type="checkbox"
                  checked={item.blocksActiveDelivery}
                  onChange={(event) => updateItem(item.id, { blocksActiveDelivery: event.target.checked })}
                  className="h-4 w-4 accent-[#FC6E20]"
                />
                <span className="font-montserrat text-xs font-semibold text-white">Blocks active delivery</span>
              </label>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <TextAreaField
                label="Client note"
                value={item.clientNote}
                onChange={(value) => updateItem(item.id, { clientNote: value })}
              />
              <TextAreaField
                label="Internal note"
                value={item.internalNote}
                onChange={(value) => updateItem(item.id, { internalNote: value })}
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <StudioStatusPill label={item.requiredForActiveDelivery ? 'Required' : 'Optional'} tone="muted" />
                <StudioStatusPill
                  label={item.blocksActiveDelivery ? 'Start blocker' : 'Not blocking'}
                  tone={item.blocksActiveDelivery && item.status !== 'done' ? 'accent' : 'muted'}
                />
                {item.linkedInvoiceNumber ? (
                  <StudioStatusPill label={`Invoice ${item.linkedInvoiceNumber}`} tone="muted" />
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => void saveItem(item)}
                disabled={Boolean(savingId)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#FC6E20] px-4 font-montserrat text-sm font-semibold text-[#151419] transition hover:bg-[#e95f14] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {savingId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Save gate item
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

type RequestClassificationDraft = {
  classification: PortalRequestClassification;
  impactCostLabel: string;
  impactTimeLabel: string;
  internalNote: string;
  launchImpact: string;
  nextAction: string;
  ownerName: string;
  ownerRole: string;
  phase2Option: boolean;
  status: PortalRequestStatus;
  studioAssessment: string;
};

type RequestClassifyResponse = {
  classification?: PortalRequestClassification;
  classifiedAt?: string;
  clientDecision?: PortalRequestClientDecision;
  error?: string;
  ok?: boolean;
  status?: PortalRequestStatus;
};

type RequestCreateResponse = {
  error?: string;
  ok?: boolean;
  request?: {
    id: string;
    requestNumber: string;
    status: PortalRequestStatus;
    submittedAt: string;
  };
};

const scopeDecisionClassifications = new Set<PortalRequestClassification>(['change_request', 'out_of_scope']);
const approvedRequestStatuses = new Set<PortalRequestStatus>(['approved', 'closed', 'in_progress', 'resolved']);

function StudioRequestQueue({
  onRequestChange,
  requests,
}: {
  onRequestChange: (request: PortalProjectRequest) => void;
  requests: PortalProjectRequest[];
}) {
  if (!requests.length) {
    return (
      <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.02] p-5">
        <p className="font-montserrat text-sm text-[#595959]">
          Client change, support, meeting, and scope requests will appear here after the Request Center is used.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {requests.map((request) => (
        <StudioRequestQueueCard
          key={request.id}
          request={request}
          onRequestChange={onRequestChange}
        />
      ))}
    </div>
  );
}

function StudioRequestQueueCard({
  onRequestChange,
  request,
}: {
  onRequestChange: (request: PortalProjectRequest) => void;
  request: PortalProjectRequest;
}) {
  const [draft, setDraft] = useState<RequestClassificationDraft>(() => ({
    classification: request.classification,
    impactCostLabel: request.impactCostLabel,
    impactTimeLabel: request.impactTimeLabel,
    internalNote: request.internalNote,
    launchImpact: request.launchImpact,
    nextAction: request.nextAction,
    ownerName: request.ownerName || 'Kreative Reflow',
    ownerRole: request.ownerRole || 'Studio',
    phase2Option: request.phase2Option,
    status: request.status,
    studioAssessment: request.studioAssessment,
  }));
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  const requiresClientDecision = scopeDecisionClassifications.has(draft.classification);
  const blockedStartAttempt =
    requiresClientDecision &&
    approvedRequestStatuses.has(draft.status) &&
    request.clientDecision !== 'approved';

  function updateDraft(patch: Partial<RequestClassificationDraft>) {
    setDraft((currentDraft) => ({ ...currentDraft, ...patch }));
  }

  function updateClassification(classification: PortalRequestClassification) {
    setDraft((currentDraft) => {
      const needsDecision = scopeDecisionClassifications.has(classification);

      return {
        ...currentDraft,
        classification,
        status: needsDecision && currentDraft.status !== 'waiting_approval'
          ? 'waiting_approval'
          : currentDraft.status,
      };
    });
  }

  async function saveClassification() {
    setSaving(true);
    setSaveError('');

    try {
      const response = await fetch('/api/portal/requests', {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'classify',
          classification: draft.classification,
          impactCostLabel: draft.impactCostLabel,
          impactTimeLabel: draft.impactTimeLabel,
          internalNote: draft.internalNote,
          launchImpact: draft.launchImpact,
          nextAction: draft.nextAction,
          ownerName: draft.ownerName,
          ownerRole: draft.ownerRole,
          phase2Option: draft.phase2Option,
          requestId: request.id,
          status: draft.status,
          studioAssessment: draft.studioAssessment,
        }),
      });
      const payload = (await response.json()) as RequestClassifyResponse;

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || 'Request classification could not be saved.');
      }

      const nextClassification = payload.classification ?? draft.classification;
      const nextStatus = payload.status ?? draft.status;
      const nextDecision = payload.clientDecision ?? request.clientDecision;

      onRequestChange({
        ...request,
        classification: nextClassification,
        classifiedAt: 'Updated just now',
        clientDecision: nextDecision,
        impactCostLabel: draft.impactCostLabel,
        impactTimeLabel: draft.impactTimeLabel,
        internalNote: draft.internalNote,
        launchImpact: draft.launchImpact,
        nextAction: draft.nextAction,
        ownerName: draft.ownerName,
        ownerRole: draft.ownerRole,
        phase2Option: draft.phase2Option,
        status: nextStatus,
        studioAssessment: draft.studioAssessment,
      });
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Request classification could not be saved.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <article className="rounded-[24px] border border-white/8 bg-[#151419] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="font-montserrat text-sm font-semibold text-white">
            {request.requestNumber} - {request.title}
          </p>
          <p className="mt-2 font-montserrat text-sm text-[#595959]">
            {request.clientName} - {request.projectName}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StudioStatusPill label={requestTypeCopy[request.requestType]} tone="muted" />
          <StudioStatusPill label={requestStatusCopy[draft.status]} tone={getRequestStatusTone(draft.status)} />
          <StudioStatusPill
            label={requestClassificationCopy[draft.classification]}
            tone={getRequestClassificationTone(draft.classification)}
          />
        </div>
      </div>

      <p className="mt-4 font-montserrat text-sm leading-6 text-[#FBFBFB]">{request.requestDetail}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <DetailCard label="Affected area" value={request.affectedArea || 'Not provided'} />
        <DetailCard label="Urgency" value={requestUrgencyCopy[request.urgency]} />
        <DetailCard label="Source" value={requestSourceCopy[request.sourceChannel]} />
        <DetailCard label="Submitted" value={request.submittedAt} />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <SnippetBlock label="Reason" value={request.reason} />
        <SnippetBlock label="Next action" value={draft.nextAction} />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <label>
          <span className="block font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#595959]">
            Classification
          </span>
          <select
            value={draft.classification}
            onChange={(event) => updateClassification(event.target.value as PortalRequestClassification)}
            className="mt-2 min-h-12 w-full rounded-[18px] border border-white/8 bg-[#1B1B1E] px-4 font-montserrat text-sm text-white outline-none transition focus:border-[#FC6E20]"
          >
            {(Object.keys(requestClassificationCopy) as PortalRequestClassification[]).map((classification) => (
              <option key={classification} value={classification}>
                {requestClassificationCopy[classification]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="block font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#595959]">
            Status
          </span>
          <select
            value={draft.status}
            onChange={(event) => updateDraft({ status: event.target.value as PortalRequestStatus })}
            className="mt-2 min-h-12 w-full rounded-[18px] border border-white/8 bg-[#1B1B1E] px-4 font-montserrat text-sm text-white outline-none transition focus:border-[#FC6E20]"
          >
            {(Object.keys(requestStatusCopy) as PortalRequestStatus[]).map((status) => (
              <option key={status} value={status}>
                {requestStatusCopy[status]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-h-12 items-center gap-3 rounded-[18px] border border-white/8 bg-[#1B1B1E] px-4 py-3 md:mt-6">
          <input
            type="checkbox"
            checked={draft.phase2Option}
            onChange={(event) => updateDraft({ phase2Option: event.target.checked })}
            className="h-4 w-4 accent-[#FC6E20]"
          />
          <span className="font-montserrat text-xs font-semibold text-white">Parkable for Phase 2</span>
        </label>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Field label="Owner" value={draft.ownerName} onChange={(value) => updateDraft({ ownerName: value })} />
        <Field label="Owner role" value={draft.ownerRole} onChange={(value) => updateDraft({ ownerRole: value })} />
        <Field
          label="Cost impact"
          value={draft.impactCostLabel}
          onChange={(value) => updateDraft({ impactCostLabel: value })}
        />
        <Field
          label="Time impact"
          value={draft.impactTimeLabel}
          onChange={(value) => updateDraft({ impactTimeLabel: value })}
        />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <TextAreaField
          label="Launch impact"
          value={draft.launchImpact}
          onChange={(value) => updateDraft({ launchImpact: value })}
        />
        <TextAreaField
          label="Studio assessment"
          value={draft.studioAssessment}
          onChange={(value) => updateDraft({ studioAssessment: value })}
        />
        <TextAreaField
          label="Next action"
          value={draft.nextAction}
          onChange={(value) => updateDraft({ nextAction: value })}
        />
        <TextAreaField
          label="Internal note"
          value={draft.internalNote}
          onChange={(value) => updateDraft({ internalNote: value })}
        />
      </div>

      {requiresClientDecision ? (
        <p className="mt-4 rounded-[18px] border border-[#FC6E20]/25 bg-[#FC6E20]/10 p-3 font-montserrat text-sm leading-6 text-[#FFD7C1]">
          Scope-impact request. Keep the status at waiting approval until the client approves, declines, or parks the cost/time impact.
        </p>
      ) : null}

      {blockedStartAttempt ? (
        <p className="mt-3 flex items-start gap-2 rounded-[18px] border border-red-400/25 bg-red-400/10 p-3 font-montserrat text-sm leading-6 text-red-100">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          Out-of-scope or change-request work cannot be started until the client approves the impact.
        </p>
      ) : null}

      {saveError ? (
        <p className="mt-3 flex items-start gap-2 rounded-[18px] border border-red-400/25 bg-red-400/10 p-3 font-montserrat text-sm leading-6 text-red-100">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {saveError}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <StudioStatusPill label={`Decision: ${request.clientDecision.replace(/_/g, ' ')}`} tone={request.clientDecision === 'pending' ? 'accent' : 'muted'} />
          <StudioStatusPill label={`By ${maskEmail(request.submittedByEmail)}`} tone="muted" />
          {request.attachmentUrl ? <StudioStatusPill label="Attachment linked" tone="muted" /> : null}
        </div>
        <button
          type="button"
          onClick={() => void saveClassification()}
          disabled={saving || blockedStartAttempt}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#FC6E20] px-4 font-montserrat text-sm font-semibold text-[#151419] transition hover:bg-[#e95f14] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Save classification
        </button>
      </div>
    </article>
  );
}

function StudioRequestLogForm({
  onRequestCreated,
  templateRequest,
}: {
  onRequestCreated: (request: PortalProjectRequest) => void;
  templateRequest: PortalProjectRequest | null;
}) {
  const [draft, setDraft] = useState({
    affectedArea: '',
    desiredDeadline: '',
    reason: '',
    relatedItemLabel: '',
    requestDetail: '',
    requestType: 'small_change' as PortalRequestType,
    sourceChannel: 'whatsapp' as PortalRequestSourceChannel,
    title: '',
    urgency: 'normal' as PortalRequestUrgency,
  });
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  function updateDraft(patch: Partial<typeof draft>) {
    setDraft((currentDraft) => ({ ...currentDraft, ...patch }));
  }

  async function submitOutsideRequest() {
    setSaving(true);
    setSaveError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/portal/requests', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          affectedArea: draft.affectedArea,
          desiredDeadline: draft.desiredDeadline,
          projectSlug: templateRequest?.projectSlug,
          reason: draft.reason,
          relatedItemLabel: draft.relatedItemLabel,
          requestDetail: draft.requestDetail,
          requestType: draft.requestType,
          sourceChannel: draft.sourceChannel,
          title: draft.title,
          urgency: draft.urgency,
        }),
      });
      const payload = (await response.json()) as RequestCreateResponse;

      if (!response.ok || !payload.ok || !payload.request) {
        throw new Error(payload.error || 'Outside request could not be logged.');
      }

      const projectContext = templateRequest ?? {
        clientName: 'ABC Engineering',
        projectName: 'Website Redesign',
        projectSlug: 'abc-engineering-website-redesign',
      };

      onRequestCreated({
        affectedArea: draft.affectedArea,
        attachmentLabel: '',
        attachmentUrl: '',
        classification: 'unclassified',
        classifiedAt: 'Not classified',
        classifiedByEmail: '',
        clientDecision: 'not_required',
        clientDecisionAt: 'Not decided',
        clientDecisionNote: '',
        clientName: projectContext.clientName,
        clientVisible: true,
        desiredDeadline: draft.desiredDeadline || 'Not set',
        desiredDeadlineRaw: draft.desiredDeadline,
        id: payload.request.id,
        impactCostLabel: '',
        impactTimeLabel: '',
        internalNote: 'Logged by Studio from an outside channel.',
        launchImpact: '',
        nextAction: 'The studio will triage this request and confirm the next step.',
        ownerName: 'Kreative Reflow',
        ownerRole: 'Studio',
        phase2Option: false,
        projectName: projectContext.projectName,
        projectSlug: projectContext.projectSlug,
        reason: draft.reason,
        relatedItemLabel: draft.relatedItemLabel,
        requestDetail: draft.requestDetail,
        requestNumber: payload.request.requestNumber,
        requestType: draft.requestType,
        source: 'supabase',
        sourceChannel: draft.sourceChannel,
        status: payload.request.status,
        studioAssessment: '',
        submittedAt: 'Logged just now',
        submittedByEmail: 'Studio',
        submittedByRole: 'studio_admin',
        title: draft.title,
        urgency: draft.urgency,
      });

      setSuccessMessage(`${payload.request.requestNumber} was logged for triage.`);
      setDraft((currentDraft) => ({
        ...currentDraft,
        affectedArea: '',
        desiredDeadline: '',
        reason: '',
        relatedItemLabel: '',
        requestDetail: '',
        title: '',
      }));
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Outside request could not be logged.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        <label>
          <span className="block font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#595959]">
            Source
          </span>
          <select
            value={draft.sourceChannel}
            onChange={(event) => updateDraft({ sourceChannel: event.target.value as PortalRequestSourceChannel })}
            className="mt-2 min-h-12 w-full rounded-[18px] border border-white/8 bg-[#151419] px-4 font-montserrat text-sm text-white outline-none transition focus:border-[#FC6E20]"
          >
            {(['whatsapp', 'phone', 'email', 'meeting', 'studio_logged'] as PortalRequestSourceChannel[]).map((source) => (
              <option key={source} value={source}>
                {requestSourceCopy[source]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="block font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#595959]">
            Request type
          </span>
          <select
            value={draft.requestType}
            onChange={(event) => updateDraft({ requestType: event.target.value as PortalRequestType })}
            className="mt-2 min-h-12 w-full rounded-[18px] border border-white/8 bg-[#151419] px-4 font-montserrat text-sm text-white outline-none transition focus:border-[#FC6E20]"
          >
            {(Object.keys(requestTypeCopy) as PortalRequestType[]).map((requestType) => (
              <option key={requestType} value={requestType}>
                {requestTypeCopy[requestType]}
              </option>
            ))}
          </select>
        </label>
        <Field label="Title" value={draft.title} onChange={(value) => updateDraft({ title: value })} />
        <Field
          label="Affected page or feature"
          value={draft.affectedArea}
          onChange={(value) => updateDraft({ affectedArea: value })}
        />
        <TextAreaField
          label="Requested change"
          value={draft.requestDetail}
          onChange={(value) => updateDraft({ requestDetail: value })}
        />
        <TextAreaField
          label="Reason"
          value={draft.reason}
          onChange={(value) => updateDraft({ reason: value })}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            <span className="block font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#595959]">
              Urgency
            </span>
            <select
              value={draft.urgency}
              onChange={(event) => updateDraft({ urgency: event.target.value as PortalRequestUrgency })}
              className="mt-2 min-h-12 w-full rounded-[18px] border border-white/8 bg-[#151419] px-4 font-montserrat text-sm text-white outline-none transition focus:border-[#FC6E20]"
            >
              {(Object.keys(requestUrgencyCopy) as PortalRequestUrgency[]).map((urgency) => (
                <option key={urgency} value={urgency}>
                  {requestUrgencyCopy[urgency]}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="block font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#595959]">
              Desired deadline
            </span>
            <input
              type="date"
              value={draft.desiredDeadline}
              onChange={(event) => updateDraft({ desiredDeadline: event.target.value })}
              className="mt-2 min-h-12 w-full rounded-[18px] border border-white/8 bg-[#151419] px-4 font-montserrat text-sm text-white outline-none transition focus:border-[#FC6E20]"
            />
          </label>
        </div>
        <Field
          label="Related milestone or deliverable"
          value={draft.relatedItemLabel}
          onChange={(value) => updateDraft({ relatedItemLabel: value })}
        />
      </div>

      {saveError ? (
        <p className="flex items-start gap-2 rounded-[18px] border border-red-400/25 bg-red-400/10 p-3 font-montserrat text-sm leading-6 text-red-100">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {saveError}
        </p>
      ) : null}

      {successMessage ? (
        <p className="rounded-[18px] border border-emerald-400/25 bg-emerald-400/10 p-3 font-montserrat text-sm leading-6 text-emerald-100">
          {successMessage}
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => void submitOutsideRequest()}
        disabled={saving}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#FC6E20] px-4 font-montserrat text-sm font-semibold text-[#151419] transition hover:bg-[#e95f14] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Log request
      </button>
    </div>
  );
}

type DecisionCreateResponse = {
  decision?: {
    decidedAt: string;
    decisionNumber: string;
    id: string;
  };
  error?: string;
  ok?: boolean;
};

function StudioCommunicationHub({ communicationSummary }: { communicationSummary: PortalCommunicationSummary }) {
  const hasCommunicationRecords =
    communicationSummary.meetings.length ||
    communicationSummary.threads.length ||
    communicationSummary.decisions.length;

  if (!hasCommunicationRecords) {
    return (
      <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.02] p-5">
        <p className="font-montserrat text-sm text-[#595959]">
          Meeting requests, client message threads, and written decision records will appear here once the communication workflow is used.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <DetailCard label="Open meetings" value={String(communicationSummary.openMeetingCount)} />
        <DetailCard label="Open threads" value={String(communicationSummary.openThreadCount)} />
        <DetailCard label="Actions due" value={String(communicationSummary.pendingActionCount)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <p className="font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#595959]">Meeting queue</p>
          {communicationSummary.meetings.length ? (
            communicationSummary.meetings.slice(0, 3).map((meeting) => (
              <StudioMeetingCard key={meeting.id} meeting={meeting} />
            ))
          ) : (
            <EmptyMiniState label="No meeting requests yet." />
          )}
        </div>

        <div className="space-y-3">
          <p className="font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#595959]">Message threads</p>
          {communicationSummary.threads.length ? (
            communicationSummary.threads.slice(0, 3).map((thread) => (
              <StudioMessageThreadCard key={thread.id} thread={thread} />
            ))
          ) : (
            <EmptyMiniState label="No message threads yet." />
          )}
        </div>
      </div>

      <div className="space-y-3">
        <p className="font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#595959]">Decision log</p>
        {communicationSummary.decisions.length ? (
          communicationSummary.decisions.slice(0, 4).map((decision) => (
            <StudioDecisionCard key={decision.id} decision={decision} />
          ))
        ) : (
          <EmptyMiniState label="No written decisions yet." />
        )}
      </div>
    </div>
  );
}

function EmptyMiniState({ label }: { label: string }) {
  return (
    <div className="rounded-[18px] border border-dashed border-white/10 bg-white/[0.02] p-4">
      <p className="font-montserrat text-sm text-[#595959]">{label}</p>
    </div>
  );
}

function StudioMeetingCard({ meeting }: { meeting: PortalMeetingRequest }) {
  return (
    <article className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-montserrat text-sm font-semibold text-white">
            {meeting.meetingNumber} - {meeting.title}
          </p>
          <p className="mt-2 line-clamp-2 font-montserrat text-sm leading-6 text-[#595959]">{meeting.reason}</p>
        </div>
        <StudioStatusPill label={meetingStatusCopy[meeting.status]} tone={getMeetingTone(meeting.status)} />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <DetailCard label="Scheduled" value={meeting.scheduledFor} />
        <DetailCard label="Related" value={meeting.relatedItemLabel || communicationContextCopy[meeting.relatedItemType]} />
      </div>
      <p className="mt-3 font-montserrat text-sm leading-6 text-[#FBFBFB]">{meeting.nextAction}</p>
    </article>
  );
}

function StudioMessageThreadCard({ thread }: { thread: PortalMessageThread }) {
  const latestMessage = thread.messages[thread.messages.length - 1];

  return (
    <article className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-montserrat text-sm font-semibold text-white">{thread.subject}</p>
          <p className="mt-2 font-montserrat text-sm text-[#595959]">
            {communicationContextCopy[thread.contextType]} - {thread.contextLabel || 'Project'}
          </p>
        </div>
        <StudioStatusPill label={threadStatusCopy[thread.status]} tone={getThreadTone(thread.status)} />
      </div>
      {latestMessage ? (
        <div className="mt-4 rounded-[18px] border border-white/8 bg-white/5 p-3">
          <p className="line-clamp-3 font-montserrat text-sm leading-6 text-[#FBFBFB]">{latestMessage.messageBody}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <StudioStatusPill label={decisionSourceCopy[latestMessage.sourceChannel]} tone="muted" />
            {latestMessage.actionRequired ? (
              <StudioStatusPill label={`Action: ${latestMessage.actionOwner || 'Owner needed'}`} tone="accent" />
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}

function StudioDecisionCard({ decision }: { decision: PortalProjectDecision }) {
  return (
    <article className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="font-montserrat text-sm font-semibold text-white">
            {decision.decisionNumber} - {decision.title}
          </p>
          <p className="mt-2 font-montserrat text-sm text-[#595959]">
            {decisionTypeCopy[decision.decisionType]} - {decisionSourceCopy[decision.sourceChannel]}
          </p>
        </div>
        <StudioStatusPill label={decision.status.replace(/_/g, ' ')} tone="muted" />
      </div>
      <p className="mt-4 font-montserrat text-sm leading-6 text-[#FBFBFB]">{decision.outcome}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <DetailCard label="Decided" value={decision.decidedAt} />
        <DetailCard label="Owner" value={decision.ownerName || 'Not assigned'} />
        <DetailCard label="Due" value={decision.dueOn} />
      </div>
      {decision.actionItems ? (
        <SnippetBlock label="Action items" value={decision.actionItems} />
      ) : null}
    </article>
  );
}

function StudioDecisionLogForm({
  onDecisionCreated,
  templateDecision,
}: {
  onDecisionCreated: (decision: PortalProjectDecision) => void;
  templateDecision: PortalProjectDecision | null;
}) {
  const [draft, setDraft] = useState({
    actionItems: '',
    decisionSummary: '',
    decisionType: 'whatsapp_summary' as PortalDecisionType,
    dueOn: '',
    internalNote: '',
    outcome: '',
    ownerName: 'Kreative Reflow',
    ownerRole: 'Studio',
    rationale: '',
    relatedItemLabel: '',
    relatedItemType: 'request' as PortalCommunicationContextType,
    sourceChannel: 'whatsapp' as PortalDecisionSourceChannel,
    title: '',
  });
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  function updateDraft(patch: Partial<typeof draft>) {
    setDraft((currentDraft) => ({ ...currentDraft, ...patch }));
  }

  async function submitDecision() {
    setSaving(true);
    setSaveError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/portal/communications', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'decision_log',
          actionItems: draft.actionItems,
          decisionSummary: draft.decisionSummary,
          decisionType: draft.decisionType,
          dueOn: draft.dueOn,
          internalNote: draft.internalNote,
          outcome: draft.outcome,
          ownerName: draft.ownerName,
          ownerRole: draft.ownerRole,
          projectSlug: templateDecision?.projectSlug,
          rationale: draft.rationale,
          relatedItemLabel: draft.relatedItemLabel,
          relatedItemType: draft.relatedItemType,
          sourceChannel: draft.sourceChannel,
          title: draft.title,
        }),
      });
      const payload = (await response.json()) as DecisionCreateResponse;

      if (!response.ok || !payload.ok || !payload.decision) {
        throw new Error(payload.error || 'Decision could not be logged.');
      }

      const projectContext = templateDecision ?? {
        clientName: 'ABC Engineering',
        projectName: 'Website Redesign',
        projectSlug: 'abc-engineering-website-redesign',
      };

      onDecisionCreated({
        actionItems: draft.actionItems,
        clientName: projectContext.clientName,
        decidedAt: 'Logged just now',
        decidedByEmail: 'Studio',
        decidedByRole: 'studio_admin',
        decisionNumber: payload.decision.decisionNumber,
        decisionSummary: draft.decisionSummary,
        decisionType: draft.decisionType,
        dueOn: formatStudioDate(draft.dueOn),
        id: payload.decision.id,
        internalNote: draft.internalNote,
        outcome: draft.outcome,
        ownerName: draft.ownerName,
        ownerRole: draft.ownerRole,
        projectName: projectContext.projectName,
        projectSlug: projectContext.projectSlug,
        rationale: draft.rationale,
        relatedItemLabel: draft.relatedItemLabel,
        relatedItemType: draft.relatedItemType,
        source: 'supabase',
        sourceChannel: draft.sourceChannel,
        status: 'active',
        title: draft.title,
      });

      setSuccessMessage(`${payload.decision.decisionNumber} was added to the official portal record.`);
      setDraft((currentDraft) => ({
        ...currentDraft,
        actionItems: '',
        decisionSummary: '',
        dueOn: '',
        internalNote: '',
        outcome: '',
        rationale: '',
        relatedItemLabel: '',
        title: '',
      }));
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Decision could not be logged.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        <label>
          <span className="block font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#595959]">
            Source
          </span>
          <select
            value={draft.sourceChannel}
            onChange={(event) => updateDraft({ sourceChannel: event.target.value as PortalDecisionSourceChannel })}
            className="mt-2 min-h-12 w-full rounded-[18px] border border-white/8 bg-[#151419] px-4 font-montserrat text-sm text-white outline-none transition focus:border-[#FC6E20]"
          >
            {(['whatsapp', 'phone', 'email', 'meeting', 'approval', 'studio_logged'] as PortalDecisionSourceChannel[]).map((source) => (
              <option key={source} value={source}>
                {decisionSourceCopy[source]}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="block font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#595959]">
            Decision type
          </span>
          <select
            value={draft.decisionType}
            onChange={(event) => updateDraft({ decisionType: event.target.value as PortalDecisionType })}
            className="mt-2 min-h-12 w-full rounded-[18px] border border-white/8 bg-[#151419] px-4 font-montserrat text-sm text-white outline-none transition focus:border-[#FC6E20]"
          >
            {(Object.keys(decisionTypeCopy) as PortalDecisionType[]).map((decisionType) => (
              <option key={decisionType} value={decisionType}>
                {decisionTypeCopy[decisionType]}
              </option>
            ))}
          </select>
        </label>

        <Field label="Title" value={draft.title} onChange={(value) => updateDraft({ title: value })} />
        <TextAreaField
          label="What was decided"
          value={draft.decisionSummary}
          onChange={(value) => updateDraft({ decisionSummary: value })}
        />
        <TextAreaField
          label="Outcome"
          value={draft.outcome}
          onChange={(value) => updateDraft({ outcome: value })}
        />
        <TextAreaField
          label="Rationale"
          value={draft.rationale}
          onChange={(value) => updateDraft({ rationale: value })}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            <span className="block font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#595959]">
              Related to
            </span>
            <select
              value={draft.relatedItemType}
              onChange={(event) => updateDraft({ relatedItemType: event.target.value as PortalCommunicationContextType })}
              className="mt-2 min-h-12 w-full rounded-[18px] border border-white/8 bg-[#151419] px-4 font-montserrat text-sm text-white outline-none transition focus:border-[#FC6E20]"
            >
              {(Object.keys(communicationContextCopy) as PortalCommunicationContextType[]).map((contextType) => (
                <option key={contextType} value={contextType}>
                  {communicationContextCopy[contextType]}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span className="block font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#595959]">
              Due date
            </span>
            <input
              type="date"
              value={draft.dueOn}
              onChange={(event) => updateDraft({ dueOn: event.target.value })}
              className="mt-2 min-h-12 w-full rounded-[18px] border border-white/8 bg-[#151419] px-4 font-montserrat text-sm text-white outline-none transition focus:border-[#FC6E20]"
            />
          </label>
        </div>

        <Field
          label="Related milestone, request, or deliverable"
          value={draft.relatedItemLabel}
          onChange={(value) => updateDraft({ relatedItemLabel: value })}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Owner" value={draft.ownerName} onChange={(value) => updateDraft({ ownerName: value })} />
          <Field label="Owner role" value={draft.ownerRole} onChange={(value) => updateDraft({ ownerRole: value })} />
        </div>

        <TextAreaField
          label="Action items"
          value={draft.actionItems}
          onChange={(value) => updateDraft({ actionItems: value })}
        />
        <TextAreaField
          label="Internal note"
          value={draft.internalNote}
          onChange={(value) => updateDraft({ internalNote: value })}
        />
      </div>

      {saveError ? (
        <p className="flex items-start gap-2 rounded-[18px] border border-red-400/25 bg-red-400/10 p-3 font-montserrat text-sm leading-6 text-red-100">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {saveError}
        </p>
      ) : null}

      {successMessage ? (
        <p className="rounded-[18px] border border-emerald-400/25 bg-emerald-400/10 p-3 font-montserrat text-sm leading-6 text-emerald-100">
          {successMessage}
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => void submitDecision()}
        disabled={saving}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#FC6E20] px-4 font-montserrat text-sm font-semibold text-[#151419] transition hover:bg-[#e95f14] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Log decision
      </button>
    </div>
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
          <p className="mt-2 font-montserrat text-sm text-[#595959]">
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
        <p className="flex items-center gap-2 font-montserrat text-[11px] uppercase tracking-[0.16em] text-[#595959]">
          <MessageSquareText className="h-3.5 w-3.5 text-[#FC6E20]" />
          Latest decision
        </p>
        <p className="mt-2 font-montserrat text-sm text-white">{latestDecision}</p>
        {approval.latestEvent?.note ? (
          <p className="mt-2 line-clamp-3 font-montserrat text-sm leading-6 text-[#595959]">
            {approval.latestEvent.note}
          </p>
        ) : null}
        {approval.latestEvent ? (
          <p className="mt-2 font-mono text-xs text-[#595959]">{approval.latestEvent.decidedAt}</p>
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
          <p className="mt-2 font-mono text-xs text-[#595959]">{rule.eventType.replace(/_/g, ' ')}</p>
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
          <p className="mt-2 font-montserrat text-sm text-[#595959]">
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
        <p className="font-montserrat text-[11px] uppercase tracking-[0.16em] text-[#595959]">Payment reference</p>
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
          <p className="mt-2 font-montserrat text-sm leading-6 text-[#595959]">{item.detail}</p>
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
          <p className="mt-2 font-montserrat text-sm leading-6 text-[#595959]">{supportStep.description}</p>
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
          <p className="mt-2 font-montserrat text-sm text-[#595959]">{response.projectName}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <StudioStatusPill label={response.status} tone={response.status === 'submitted' ? 'accent' : 'muted'} />
          <StudioStatusPill label={response.source} tone="muted" />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[18px] border border-white/8 bg-white/5 p-3">
          <p className="font-montserrat text-[11px] uppercase tracking-[0.16em] text-[#595959]">Approver</p>
          <p className="mt-2 font-montserrat text-sm text-white">{response.contactName || 'Not provided'}</p>
          <p className="mt-2 inline-flex items-center gap-2 font-mono text-xs text-[#595959]">
            <Mail className="h-3.5 w-3.5" />
            {maskEmail(response.contactEmail)}
          </p>
        </div>
        <DetailCard label="Role" value={response.approvalRole || 'Role missing'} />
        <DetailCard label="Phone" value={response.contactPhone || 'Phone missing'} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <DetailCard label="Audience type" value={response.audienceType || 'Audience type missing'} />
        <DetailCard label="Current website" value={response.currentWebsite || 'Not provided'} />
        <DetailCard label="Budget" value={response.budgetRange || 'Budget missing'} />
        <DetailCard label="Deadline" value={response.preferredDeadline} />
      </div>

      <TagList emptyLabel="Services missing" id={response.id} items={response.services} />

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <SnippetBlock label="Goals" value={response.projectGoals} />
        <SnippetBlock label="Audience" value={response.primaryAudience} />
        <SnippetBlock label="Competitors / references" value={response.competitors} />
        <SnippetBlock label="Features and must-haves" value={response.specificFeatures} />
        <SnippetBlock label="Decision process" value={response.decisionProcess} />
        <SnippetBlock label="Tone and style" value={response.toneStylePreferences} />
        <SnippetBlock label="Previous agency experience" value={response.previousAgencyExperience} />
        <SnippetBlock label="Social presence" value={response.socialPresence} />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <SnippetBlock label="Access needs" value={response.accessNeeds} />
        <SnippetBlock label="Technical accounts" value={response.technicalAccounts} />
        <SnippetBlock label="Deadline constraints" value={response.launchConstraints} />
        <SnippetBlock label="Content notes" value={response.contentNotes} />
      </div>

      <div className="mt-4">
        <p className="font-montserrat text-[11px] uppercase tracking-[0.16em] text-[#595959]">Existing integrations</p>
        <TagList emptyLabel="No integrations selected" id={`${response.id}-integrations`} items={response.existingIntegrations} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <DetailCard label="Brand assets" value={response.brandAssetsStatus} />
        <DetailCard label="Missing content owner" value={response.missingContentOwner || 'Not assigned'} />
        <DetailCard label="Missing content due" value={response.missingContentDueDate} />
        <DetailCard label="Missing access owner" value={response.missingAccessOwner || 'Not assigned'} />
        <DetailCard label="Missing access due" value={response.missingAccessDueDate} />
        <DetailCard label="Update rhythm" value={response.updateCadence || 'Missing'} />
        <DetailCard label="Main channel" value={response.preferredUpdateChannel || 'Missing'} />
        <DetailCard label="Urgent channel" value={response.urgentChannel || 'Missing'} />
        <DetailCard label="Revision rounds" value={response.revisionRounds || 'Missing'} />
        <DetailCard label="Change authority" value={response.changeRequestAuthority || 'Missing'} />
        <DetailCard label="Scope accepted" value={response.scopeBoundaryAccepted ? 'Yes' : 'No'} />
        <DetailCard label="Last saved" value={response.lastSavedAt} />
        <DetailCard label="Submitted" value={response.submittedAt} />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <SnippetBlock label="Meeting availability" value={response.meetingAvailability} />
        <SnippetBlock label="Included scope" value={response.scopeInclusions} />
        <SnippetBlock label="Excluded scope" value={response.scopeExclusions} />
        <SnippetBlock
          label="Terms consent"
          value={response.consentToTerms ? 'Client accepted the privacy and terms acknowledgement.' : 'Consent missing.'}
        />
      </div>
    </article>
  );
}

function TagList({
  emptyLabel,
  id,
  items,
}: {
  emptyLabel: string;
  id: string;
  items: string[];
}) {
  if (!items.length) {
    return (
      <div className="mt-3">
        <StudioStatusPill label={emptyLabel} tone="accent" />
      </div>
    );
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={`${id}-${item}`}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-montserrat text-[11px] uppercase tracking-[0.12em] text-[#FBFBFB]"
        >
          {item}
        </span>
      ))}
    </div>
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
          <p className="mt-2 font-montserrat text-sm text-[#595959]">
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
        <p className="font-montserrat text-[11px] uppercase tracking-[0.16em] text-[#595959]">Submitted by</p>
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
      <p className="font-montserrat text-[11px] uppercase tracking-[0.16em] text-[#595959]">{label}</p>
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
          owner: row.owner ?? 'Disele',
          email: row.email,
          notes: row.notes,
          startedAt: row.startedAt ?? 'Today',
        }
      : asProjectDraft(sourceHandoff ?? {
          id: row.sourceHandoffId,
          type: 'Project',
          client: row.client,
          business: row.project,
          owner: row.owner ?? 'Disele',
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
            <p className="mt-3 text-sm leading-7 text-[#595959]">{row.client}</p>
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
                <p className="mt-3 text-sm leading-7 text-[#595959]">
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
              <DetailCard label="Owner" value={row.owner ?? 'Disele'} />
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
      <p className="font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#595959]">{label}</p>
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
      <span className="block font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#595959]">{label}</span>
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
      <span className="block font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#595959]">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="mt-2 w-full rounded-[18px] border border-white/8 bg-[#151419] px-4 py-3 font-montserrat text-sm text-white outline-none transition focus:border-[#FC6E20]"
      />
    </label>
  );
}
