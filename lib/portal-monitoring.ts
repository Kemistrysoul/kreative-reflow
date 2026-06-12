import 'server-only';
import { getPortalSupabaseClient, type PortalSupabaseClient } from '@/lib/portal-supabase';

export type PortalOperationalEventType =
  | 'approval_failure'
  | 'asset_failure'
  | 'auth_failure'
  | 'monitoring_note'
  | 'onboarding_failure'
  | 'project_data_error'
  | 'upload_failure';

export type PortalOperationalSeverity = 'critical' | 'error' | 'info' | 'warning';

export type PortalOperationalMetadata = Record<string, boolean | null | number | string>;

export type PortalOperationalEvent = {
  id: string;
  actorEmail: string;
  clientName: string;
  createdAt: string;
  createdAtLabel: string;
  detail: string;
  eventType: PortalOperationalEventType;
  metadata: PortalOperationalMetadata;
  projectId: string | null;
  projectName: string;
  resolvedAt: string | null;
  severity: PortalOperationalSeverity;
  sourceRoute: string;
  title: string;
};

type PortalOperationalEventRow = {
  id: string;
  actor_email: string;
  created_at: string;
  detail: string;
  event_metadata: unknown;
  event_type: PortalOperationalEventType;
  project_id: string | null;
  resolved_at: string | null;
  severity: PortalOperationalSeverity;
  source_route: string;
  title: string;
  portal_projects:
    | {
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

export type RecordPortalOperationalEventInput = {
  actorEmail?: string;
  detail?: string;
  eventType: PortalOperationalEventType;
  metadata?: Record<string, unknown>;
  projectId?: string | null;
  severity: PortalOperationalSeverity;
  sourceRoute?: string;
  title: string;
};

const fallbackOperationalEvents: PortalOperationalEvent[] = [
  {
    id: 'fallback-auth-monitoring',
    actorEmail: 'system',
    clientName: 'Kreative Reflow',
    createdAt: '',
    createdAtLabel: 'Setup mode',
    detail: 'Supabase Auth is not configured in this environment, so live auth failure logging is waiting on env setup.',
    eventType: 'auth_failure',
    metadata: { launch_gate: 'auth' },
    projectId: null,
    projectName: 'Portal launch readiness',
    resolvedAt: null,
    severity: 'warning',
    sourceRoute: '/api/portal/login',
    title: 'Auth monitoring needs Supabase env',
  },
  {
    id: 'fallback-upload-monitoring',
    actorEmail: 'system',
    clientName: 'Kreative Reflow',
    createdAt: '',
    createdAtLabel: 'Setup mode',
    detail: 'Client asset failures will be recorded once the private Supabase Storage bucket and service key are available.',
    eventType: 'upload_failure',
    metadata: { launch_gate: 'uploads' },
    projectId: null,
    projectName: 'Portal launch readiness',
    resolvedAt: null,
    severity: 'warning',
    sourceRoute: '/api/portal/assets',
    title: 'Upload monitoring waiting on storage config',
  },
  {
    id: 'fallback-project-data-monitoring',
    actorEmail: 'system',
    clientName: 'Kreative Reflow',
    createdAt: '',
    createdAtLabel: 'Setup mode',
    detail: 'Project data read failures are captured in production once Supabase project tables are connected.',
    eventType: 'project_data_error',
    metadata: { launch_gate: 'project_data' },
    projectId: null,
    projectName: 'Portal launch readiness',
    resolvedAt: null,
    severity: 'info',
    sourceRoute: '/studio/projects',
    title: 'Project data monitoring fallback active',
  },
];

function getProject(row: PortalOperationalEventRow) {
  if (Array.isArray(row.portal_projects)) {
    return row.portal_projects[0] ?? null;
  }

  return row.portal_projects;
}

function getClientName(project: NonNullable<ReturnType<typeof getProject>>) {
  if (Array.isArray(project.portal_clients)) {
    return project.portal_clients[0]?.name || 'Client project';
  }

  return project.portal_clients?.name || 'Client project';
}

function formatEventDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown time';
  }

  return new Intl.DateTimeFormat('en-ZA', {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
  }).format(date);
}

function sanitizeText(value: unknown, fallback = '') {
  if (typeof value !== 'string') {
    return fallback;
  }

  return value.trim().slice(0, 480);
}

function sanitizeMonitoringMetadata(metadata: Record<string, unknown> = {}): PortalOperationalMetadata {
  return Object.fromEntries(
    Object.entries(metadata)
      .slice(0, 16)
      .map(([key, value]) => {
        const safeKey = key.replace(/[^a-zA-Z0-9_.:-]/g, '_').slice(0, 64) || 'value';

        if (typeof value === 'string') {
          return [safeKey, value.slice(0, 240)];
        }

        if (typeof value === 'number') {
          return [safeKey, Number.isFinite(value) ? value : null];
        }

        if (typeof value === 'boolean' || value === null) {
          return [safeKey, value];
        }

        const serialized = JSON.stringify(value) ?? String(value);
        return [safeKey, serialized.slice(0, 240)];
      }),
  );
}

function mapEventRow(row: PortalOperationalEventRow): PortalOperationalEvent {
  const project = getProject(row);
  const metadata = row.event_metadata && typeof row.event_metadata === 'object' && !Array.isArray(row.event_metadata)
    ? sanitizeMonitoringMetadata(row.event_metadata as Record<string, unknown>)
    : {};

  return {
    id: row.id,
    actorEmail: row.actor_email,
    clientName: project ? getClientName(project) : 'Kreative Reflow',
    createdAt: row.created_at,
    createdAtLabel: formatEventDate(row.created_at),
    detail: row.detail,
    eventType: row.event_type,
    metadata,
    projectId: row.project_id,
    projectName: project?.project_name || 'Portal launch readiness',
    resolvedAt: row.resolved_at,
    severity: row.severity,
    sourceRoute: row.source_route,
    title: row.title,
  };
}

async function insertMonitoringEvent(
  supabase: PortalSupabaseClient,
  input: RecordPortalOperationalEventInput,
) {
  return supabase.from('portal_operational_events').insert({
    actor_email: sanitizeText(input.actorEmail, 'system'),
    detail: sanitizeText(input.detail),
    event_metadata: sanitizeMonitoringMetadata(input.metadata),
    event_type: input.eventType,
    project_id: input.projectId ?? null,
    severity: input.severity,
    source_route: sanitizeText(input.sourceRoute),
    title: sanitizeText(input.title, 'Portal operational event'),
  });
}

export async function recordPortalOperationalEvent(input: RecordPortalOperationalEventInput) {
  const supabase = getPortalSupabaseClient();

  if (!supabase) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[portal-monitoring]', input.eventType, input.title);
    }

    return;
  }

  try {
    const { error } = await insertMonitoringEvent(supabase, input);

    if (error && process.env.NODE_ENV !== 'production') {
      console.warn('[portal-monitoring] insert failed', error.message);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[portal-monitoring] insert threw', error);
    }
  }
}

export async function getStudioOperationalEvents(limit = 12): Promise<PortalOperationalEvent[]> {
  const supabase = getPortalSupabaseClient();

  if (!supabase) {
    return fallbackOperationalEvents;
  }

  const { data, error } = await supabase
    .from('portal_operational_events')
    .select('id,project_id,event_type,severity,title,detail,source_route,actor_email,event_metadata,resolved_at,created_at,portal_projects(project_name,portal_clients(name))')
    .order('resolved_at', { ascending: true, nullsFirst: true })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) {
    return fallbackOperationalEvents.map((event) => ({
      ...event,
      detail: error?.message
        ? `Monitoring table could not be read: ${error.message}`
        : event.detail,
      severity: event.id === 'fallback-project-data-monitoring' ? 'error' : event.severity,
    }));
  }

  return (data as PortalOperationalEventRow[]).map(mapEventRow);
}
