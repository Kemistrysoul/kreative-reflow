import 'server-only';
import { defaultPortalProjectSlug, getPortalSupabaseClient } from '@/lib/portal-supabase';

export type PortalRequestType =
  | 'bug_fix'
  | 'maintenance_request'
  | 'meeting_request'
  | 'question'
  | 'scope_change'
  | 'small_change'
  | 'support_request';

export type PortalRequestUrgency = 'high' | 'low' | 'normal' | 'urgent';

export type PortalRequestSourceChannel = 'email' | 'meeting' | 'phone' | 'portal' | 'studio_logged' | 'whatsapp';

export type PortalRequestStatus =
  | 'approved'
  | 'closed'
  | 'declined'
  | 'in_progress'
  | 'parked'
  | 'resolved'
  | 'submitted'
  | 'triage'
  | 'waiting_approval'
  | 'waiting_client';

export type PortalRequestClassification =
  | 'change_request'
  | 'fix'
  | 'included_revision'
  | 'maintenance'
  | 'out_of_scope'
  | 'unclassified';

export type PortalRequestClientDecision = 'approved' | 'declined' | 'not_required' | 'parked' | 'pending';

export type PortalProjectRequest = {
  id: string;
  projectSlug: string;
  projectName: string;
  clientName: string;
  requestNumber: string;
  requestType: PortalRequestType;
  title: string;
  affectedArea: string;
  requestDetail: string;
  reason: string;
  urgency: PortalRequestUrgency;
  desiredDeadline: string;
  desiredDeadlineRaw: string;
  relatedItemLabel: string;
  attachmentLabel: string;
  attachmentUrl: string;
  sourceChannel: PortalRequestSourceChannel;
  status: PortalRequestStatus;
  classification: PortalRequestClassification;
  impactCostLabel: string;
  impactTimeLabel: string;
  launchImpact: string;
  studioAssessment: string;
  phase2Option: boolean;
  clientDecision: PortalRequestClientDecision;
  clientDecisionNote: string;
  clientDecisionAt: string;
  ownerName: string;
  ownerRole: string;
  nextAction: string;
  submittedByEmail: string;
  submittedByRole: string;
  submittedAt: string;
  classifiedByEmail: string;
  classifiedAt: string;
  clientVisible: boolean;
  internalNote: string;
  source: 'demo' | 'supabase';
};

export type PortalRequestSummary = {
  requests: PortalProjectRequest[];
  openCount: number;
  waitingClientCount: number;
  waitingApprovalCount: number;
  outOfScopePendingCount: number;
  latestRequest: PortalProjectRequest | null;
  source: 'demo' | 'supabase';
};

type ProjectRelation = {
  slug: string;
  project_name: string;
  portal_clients:
    | {
        name: string;
      }
    | {
        name: string;
      }[]
    | null;
};

type ProjectScopedRow = {
  portal_projects: ProjectRelation | ProjectRelation[] | null;
};

type PortalRequestRow = ProjectScopedRow & {
  id: string;
  request_number: string;
  request_type: PortalRequestType;
  title: string;
  affected_area: string;
  request_detail: string;
  reason: string;
  urgency: PortalRequestUrgency;
  desired_deadline: string | null;
  related_item_label: string;
  attachment_label: string;
  attachment_url: string;
  source_channel: PortalRequestSourceChannel;
  status: PortalRequestStatus;
  classification: PortalRequestClassification;
  impact_cost_label: string;
  impact_time_label: string;
  launch_impact: string;
  studio_assessment: string;
  phase2_option: boolean;
  client_decision: PortalRequestClientDecision;
  client_decision_note: string;
  client_decision_at: string | null;
  owner_name: string;
  owner_role: string;
  next_action: string;
  submitted_by_email: string;
  submitted_by_role: string;
  submitted_at: string;
  classified_by_email: string;
  classified_at: string | null;
  client_visible: boolean;
  internal_note?: string;
};

const demoProject = {
  clientName: 'ABC Engineering',
  projectName: 'Website Redesign',
  projectSlug: defaultPortalProjectSlug,
} as const;

function formatDate(value: string | null, fallback = 'Not set') {
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

function formatDateTime(value: string | null, fallback = 'Not saved') {
  if (!value) return fallback;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return new Intl.DateTimeFormat('en-ZA', {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function getProject(row: ProjectScopedRow) {
  if (Array.isArray(row.portal_projects)) {
    return row.portal_projects[0] ?? null;
  }

  return row.portal_projects;
}

function getClientName(row: ProjectScopedRow) {
  const project = getProject(row);

  if (Array.isArray(project?.portal_clients)) {
    return project.portal_clients[0]?.name || 'Unknown client';
  }

  return project?.portal_clients?.name || 'Unknown client';
}

function getProjectScope(row: ProjectScopedRow) {
  const project = getProject(row);

  return {
    clientName: getClientName(row),
    projectName: project?.project_name || 'Unknown project',
    projectSlug: project?.slug || defaultPortalProjectSlug,
  };
}

function mapRequest(row: PortalRequestRow, source: 'demo' | 'supabase'): PortalProjectRequest {
  return {
    id: row.id,
    ...getProjectScope(row),
    requestNumber: row.request_number,
    requestType: row.request_type,
    title: row.title,
    affectedArea: row.affected_area,
    requestDetail: row.request_detail,
    reason: row.reason,
    urgency: row.urgency,
    desiredDeadline: formatDate(row.desired_deadline),
    desiredDeadlineRaw: row.desired_deadline ?? '',
    relatedItemLabel: row.related_item_label,
    attachmentLabel: row.attachment_label,
    attachmentUrl: row.attachment_url,
    sourceChannel: row.source_channel,
    status: row.status,
    classification: row.classification,
    impactCostLabel: row.impact_cost_label,
    impactTimeLabel: row.impact_time_label,
    launchImpact: row.launch_impact,
    studioAssessment: row.studio_assessment,
    phase2Option: row.phase2_option,
    clientDecision: row.client_decision,
    clientDecisionNote: row.client_decision_note,
    clientDecisionAt: formatDateTime(row.client_decision_at, 'Not decided'),
    ownerName: row.owner_name,
    ownerRole: row.owner_role,
    nextAction: row.next_action,
    submittedByEmail: row.submitted_by_email,
    submittedByRole: row.submitted_by_role,
    submittedAt: formatDateTime(row.submitted_at),
    classifiedByEmail: row.classified_by_email,
    classifiedAt: formatDateTime(row.classified_at, 'Not classified'),
    clientVisible: row.client_visible,
    internalNote: row.internal_note ?? '',
    source,
  };
}

function makeDemoRequest(
  input: Omit<
    PortalProjectRequest,
    'clientName' | 'projectName' | 'projectSlug' | 'source'
  >,
): PortalProjectRequest {
  return {
    ...demoProject,
    ...input,
    source: 'demo',
  };
}

const demoRequests: PortalProjectRequest[] = [
  makeDemoRequest({
    id: 'demo-request-cta',
    requestNumber: 'REQ-001',
    requestType: 'small_change',
    title: 'Adjust homepage services CTA',
    affectedArea: 'Homepage hero and services cards',
    requestDetail: 'Client asked whether the CTA can say Request a quote instead of Start project.',
    reason: 'They want the button to feel more natural for industrial buyers.',
    urgency: 'normal',
    desiredDeadline: '7 June 2026',
    desiredDeadlineRaw: '2026-06-07',
    relatedItemLabel: 'Homepage design concept v1',
    attachmentLabel: 'WhatsApp screenshot summary',
    attachmentUrl: '',
    sourceChannel: 'whatsapp',
    status: 'triage',
    classification: 'included_revision',
    impactCostLabel: 'Included',
    impactTimeLabel: 'Same sprint',
    launchImpact: 'No launch impact if handled before build lock.',
    studioAssessment: 'Fits within included copy refinement because it changes wording only.',
    phase2Option: false,
    clientDecision: 'not_required',
    clientDecisionNote: '',
    clientDecisionAt: 'Not decided',
    ownerName: 'Kreative Reflow',
    ownerRole: 'Studio',
    nextAction: 'Studio will fold this into the next homepage copy pass.',
    submittedByEmail: 'operations@abc-engineering.example',
    submittedByRole: 'client_owner',
    submittedAt: '2 June 2026, 10:00',
    classifiedByEmail: 'hello@kreativereflow.com',
    classifiedAt: '2 June 2026, 12:00',
    clientVisible: true,
    internalNote: 'Logged from WhatsApp so the request does not live only in chat.',
  }),
  makeDemoRequest({
    id: 'demo-request-scope',
    requestNumber: 'REQ-002',
    requestType: 'scope_change',
    title: 'Add client login for maintenance certificates',
    affectedArea: 'Future portal idea',
    requestDetail: 'Client asked if customers can log in to download maintenance certificates after launch.',
    reason: 'They see this becoming useful for recurring maintenance clients.',
    urgency: 'high',
    desiredDeadline: '14 June 2026',
    desiredDeadlineRaw: '2026-06-14',
    relatedItemLabel: 'Phase 2 backlog',
    attachmentLabel: '',
    attachmentUrl: '',
    sourceChannel: 'portal',
    status: 'waiting_approval',
    classification: 'change_request',
    impactCostLabel: 'Estimate required',
    impactTimeLabel: 'Adds discovery and build time',
    launchImpact: 'Should be parked for Phase 2 unless approved as paid scope.',
    studioAssessment: 'This is outside the current SOW and should not start until cost/time impact is approved.',
    phase2Option: true,
    clientDecision: 'pending',
    clientDecisionNote: '',
    clientDecisionAt: 'Not decided',
    ownerName: 'ABC Engineering',
    ownerRole: 'Client owner',
    nextAction: 'Review the scope impact, then approve, decline, or park this request.',
    submittedByEmail: 'operations@abc-engineering.example',
    submittedByRole: 'client_owner',
    submittedAt: '2 June 2026, 15:00',
    classifiedByEmail: 'hello@kreativereflow.com',
    classifiedAt: '3 June 2026, 09:00',
    clientVisible: true,
    internalNote: 'Keep out of active delivery until decision is recorded.',
  }),
];

function buildSummary(requests: PortalProjectRequest[], source: 'demo' | 'supabase'): PortalRequestSummary {
  const openStatuses = new Set<PortalRequestStatus>([
    'approved',
    'in_progress',
    'submitted',
    'triage',
    'waiting_approval',
    'waiting_client',
  ]);

  return {
    requests,
    openCount: requests.filter((request) => openStatuses.has(request.status)).length,
    waitingClientCount: requests.filter((request) => request.status === 'waiting_client').length,
    waitingApprovalCount: requests.filter((request) => request.status === 'waiting_approval').length,
    outOfScopePendingCount: requests.filter((request) =>
      (request.classification === 'change_request' || request.classification === 'out_of_scope') &&
      request.clientDecision === 'pending'
    ).length,
    latestRequest: requests[0] ?? null,
    source,
  };
}

async function loadProjectRequests({
  clientVisibleOnly,
  fallback,
  includeInternalNotes,
  projectSlug,
}: {
  clientVisibleOnly: boolean;
  fallback: PortalRequestSummary;
  includeInternalNotes: boolean;
  projectSlug: string;
}): Promise<PortalRequestSummary> {
  const supabase = getPortalSupabaseClient();

  if (!supabase) {
    return fallback;
  }

  const projectSelect = 'portal_projects!inner(slug,project_name,portal_clients!inner(name))';
  const columns = [
    'id',
    'request_number',
    'request_type',
    'title',
    'affected_area',
    'request_detail',
    'reason',
    'urgency',
    'desired_deadline',
    'related_item_label',
    'attachment_label',
    'attachment_url',
    'source_channel',
    'status',
    'classification',
    'impact_cost_label',
    'impact_time_label',
    'launch_impact',
    'studio_assessment',
    'phase2_option',
    'client_decision',
    'client_decision_note',
    'client_decision_at',
    'owner_name',
    'owner_role',
    'next_action',
    'submitted_by_email',
    'submitted_by_role',
    'submitted_at',
    'classified_by_email',
    'classified_at',
    'client_visible',
    includeInternalNotes ? 'internal_note' : '',
    projectSelect,
  ].filter(Boolean);

  let query = supabase
    .from('portal_project_requests')
    .select(columns.join(','))
    .eq('portal_projects.slug', projectSlug)
    .order('submitted_at', { ascending: false });

  if (clientVisibleOnly) {
    query = query.eq('client_visible', true);
  }

  const { data, error } = await query;

  if (error || !data) {
    return fallback;
  }

  return buildSummary(
    (data as unknown as PortalRequestRow[]).map((row) => mapRequest(row, 'supabase')),
    'supabase',
  );
}

const demoRequestSummary = buildSummary(demoRequests, 'demo');
const emptyRequestSummary = buildSummary([], 'supabase');

export async function getPortalProjectRequests(projectSlug = defaultPortalProjectSlug) {
  return loadProjectRequests({
    clientVisibleOnly: true,
    fallback: emptyRequestSummary,
    includeInternalNotes: false,
    projectSlug,
  });
}

export async function getStudioProjectRequests(projectSlug = defaultPortalProjectSlug) {
  return loadProjectRequests({
    clientVisibleOnly: false,
    fallback: demoRequestSummary,
    includeInternalNotes: true,
    projectSlug,
  });
}
