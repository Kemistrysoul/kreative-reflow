import 'server-only';
import { defaultPortalProjectSlug, getPortalSupabaseClient } from '@/lib/portal-supabase';

export type PortalDeliverableStatus = 'approved' | 'revision_requested' | 'superseded' | 'waiting_review';
export type PortalApprovalDecision = 'approved' | 'revision_requested';

export type PortalApprovalEvent = {
  id: string;
  decision: PortalApprovalDecision;
  note: string;
  decidedByEmail: string;
  decidedByRole: string;
  decidedAt: string;
};

export type PortalDeliverableApproval = {
  id: string;
  projectSlug: string;
  projectName: string;
  clientName: string;
  title: string;
  versionLabel: string;
  summary: string;
  status: PortalDeliverableStatus;
  dueDate: string;
  publishedAt: string;
  approvedAt: string;
  approvedByEmail: string;
  latestEvent: PortalApprovalEvent | null;
  source: 'demo' | 'supabase';
};

export type PortalNotificationRule = {
  id: string;
  eventType: string;
  label: string;
  surface: string;
  clientVisible: boolean;
  enabled: boolean;
  source: 'demo' | 'supabase';
};

type PortalDeliverableRow = {
  id: string;
  title: string;
  version_label: string;
  summary: string;
  status: PortalDeliverableStatus;
  due_on: string | null;
  published_at: string | null;
  approved_at: string | null;
  approved_by_email: string;
  portal_projects:
    | {
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
      }
    | {
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
      }[]
    | null;
};

type PortalApprovalEventRow = {
  id: string;
  deliverable_id: string;
  decision: PortalApprovalDecision;
  note: string;
  decided_by_email: string;
  decided_by_role: string;
  decided_at: string | null;
};

type PortalNotificationRuleRow = {
  id: string;
  event_type: string;
  label: string;
  surface: string;
  client_visible: boolean;
  enabled: boolean;
};

const demoApprovals: PortalDeliverableApproval[] = [
  {
    id: 'demo-homepage-v1',
    projectSlug: defaultPortalProjectSlug,
    projectName: 'Website Redesign',
    clientName: 'ABC Engineering',
    title: 'Homepage design concept',
    versionLabel: 'v1',
    summary: 'Homepage concept ready for client approval or revision notes.',
    status: 'waiting_review',
    dueDate: '30 May 2026',
    publishedAt: '30 May 2026, 09:15',
    approvedAt: 'Not approved',
    approvedByEmail: '',
    latestEvent: null,
    source: 'demo',
  },
];

const demoNotificationRules: PortalNotificationRule[] = [
  {
    id: 'demo-deliverable-published',
    eventType: 'deliverable_published',
    label: 'New deliverables appear for approval',
    surface: 'portal_activity',
    clientVisible: true,
    enabled: true,
    source: 'demo',
  },
  {
    id: 'demo-approval-submitted',
    eventType: 'approval_submitted',
    label: 'Client approvals notify the studio and portal',
    surface: 'portal_activity',
    clientVisible: true,
    enabled: true,
    source: 'demo',
  },
];

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

function getProject(row: PortalDeliverableRow) {
  if (Array.isArray(row.portal_projects)) {
    return row.portal_projects[0] ?? null;
  }

  return row.portal_projects;
}

function getClientName(row: PortalDeliverableRow) {
  const project = getProject(row);

  if (Array.isArray(project?.portal_clients)) {
    return project.portal_clients[0]?.name || 'Unknown client';
  }

  return project?.portal_clients?.name || 'Unknown client';
}

function mapEvent(row: PortalApprovalEventRow): PortalApprovalEvent {
  return {
    id: row.id,
    decision: row.decision,
    note: row.note,
    decidedByEmail: row.decided_by_email,
    decidedByRole: row.decided_by_role,
    decidedAt: formatDateTime(row.decided_at, 'Not decided'),
  };
}

function mapDeliverable(
  row: PortalDeliverableRow,
  eventsByDeliverable: Map<string, PortalApprovalEventRow[]>,
): PortalDeliverableApproval {
  const project = getProject(row);
  const latestEvent = eventsByDeliverable.get(row.id)?.[0] ?? null;

  return {
    id: row.id,
    projectSlug: project?.slug || defaultPortalProjectSlug,
    projectName: project?.project_name || 'Unknown project',
    clientName: getClientName(row),
    title: row.title,
    versionLabel: row.version_label,
    summary: row.summary,
    status: row.status,
    dueDate: formatDate(row.due_on),
    publishedAt: formatDateTime(row.published_at),
    approvedAt: formatDateTime(row.approved_at, 'Not approved'),
    approvedByEmail: row.approved_by_email,
    latestEvent: latestEvent ? mapEvent(latestEvent) : null,
    source: 'supabase',
  };
}

function mapNotificationRule(row: PortalNotificationRuleRow): PortalNotificationRule {
  return {
    id: row.id,
    eventType: row.event_type,
    label: row.label,
    surface: row.surface,
    clientVisible: row.client_visible,
    enabled: row.enabled,
    source: 'supabase',
  };
}

async function getApprovalEvents(deliverableIds: string[]) {
  const supabase = getPortalSupabaseClient();

  if (!supabase || !deliverableIds.length) {
    return new Map<string, PortalApprovalEventRow[]>();
  }

  const { data, error } = await supabase
    .from('portal_project_approval_events')
    .select('id,deliverable_id,decision,note,decided_by_email,decided_by_role,decided_at')
    .in('deliverable_id', deliverableIds)
    .order('decided_at', { ascending: false });

  if (error || !data) {
    return new Map<string, PortalApprovalEventRow[]>();
  }

  return (data as PortalApprovalEventRow[]).reduce((map, event) => {
    const events = map.get(event.deliverable_id) ?? [];
    events.push(event);
    map.set(event.deliverable_id, events);
    return map;
  }, new Map<string, PortalApprovalEventRow[]>());
}

export async function getPortalApprovalQueue(
  projectSlug = defaultPortalProjectSlug,
): Promise<PortalDeliverableApproval[]> {
  const supabase = getPortalSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('portal_project_deliverables')
    .select(
      [
        'id',
        'title',
        'version_label',
        'summary',
        'status',
        'due_on',
        'published_at',
        'approved_at',
        'approved_by_email',
        'portal_projects!inner(slug,project_name,portal_clients!inner(name))',
      ].join(','),
    )
    .eq('portal_projects.slug', projectSlug)
    .eq('client_visible', true)
    .order('sort_order', { ascending: true });

  if (error || !data) {
    return [];
  }

  const rows = data as unknown as PortalDeliverableRow[];
  const eventsByDeliverable = await getApprovalEvents(rows.map((row) => row.id));

  return rows.map((row) => mapDeliverable(row, eventsByDeliverable));
}

export async function getStudioApprovalQueue(): Promise<PortalDeliverableApproval[]> {
  const supabase = getPortalSupabaseClient();

  if (!supabase) {
    return demoApprovals;
  }

  const { data, error } = await supabase
    .from('portal_project_deliverables')
    .select(
      [
        'id',
        'title',
        'version_label',
        'summary',
        'status',
        'due_on',
        'published_at',
        'approved_at',
        'approved_by_email',
        'portal_projects!inner(slug,project_name,portal_clients!inner(name))',
      ].join(','),
    )
    .eq('client_visible', true)
    .order('updated_at', { ascending: false })
    .limit(12);

  if (error || !data) {
    return demoApprovals;
  }

  const rows = data as unknown as PortalDeliverableRow[];
  const eventsByDeliverable = await getApprovalEvents(rows.map((row) => row.id));

  return rows.map((row) => mapDeliverable(row, eventsByDeliverable));
}

export async function getPortalNotificationRules(
  projectSlug = defaultPortalProjectSlug,
): Promise<PortalNotificationRule[]> {
  const supabase = getPortalSupabaseClient();

  if (!supabase) {
    return demoNotificationRules;
  }

  const { data, error } = await supabase
    .from('portal_project_notification_rules')
    .select('id,event_type,label,surface,client_visible,enabled,portal_projects!inner(slug)')
    .eq('portal_projects.slug', projectSlug)
    .order('event_type', { ascending: true });

  if (error || !data) {
    return demoNotificationRules;
  }

  return (data as unknown as PortalNotificationRuleRow[]).map(mapNotificationRule);
}
