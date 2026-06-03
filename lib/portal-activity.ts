import 'server-only';
import type { PortalSupabaseClient } from '@/lib/portal-supabase';

export type PortalActivityEventType =
  | 'approval_submitted'
  | 'asset_reviewed'
  | 'asset_uploaded'
  | 'deliverable_published'
  | 'handoff_updated'
  | 'invoice_status_changed'
  | 'readiness_gate_updated'
  | 'milestone_completed'
  | 'revision_requested'
  | 'support_next_step_added';

export async function getPortalNotificationRule({
  eventType,
  projectId,
  supabase,
}: {
  eventType: PortalActivityEventType;
  projectId: string;
  supabase: PortalSupabaseClient;
}) {
  const { data } = await supabase
    .from('portal_project_notification_rules')
    .select('id,client_visible,enabled')
    .eq('project_id', projectId)
    .eq('event_type', eventType)
    .eq('surface', 'portal_activity')
    .maybeSingle<{
      id: string;
      client_visible: boolean;
      enabled: boolean;
    }>();

  if (!data?.enabled) {
    return null;
  }

  return data;
}

function formatActivityTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Just now';
  }

  return new Intl.DateTimeFormat('en-ZA', {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
  }).format(date);
}

export async function logPortalProjectActivity({
  actorEmail = '',
  eventType,
  meta,
  projectId,
  sourceRecordId,
  sourceTable,
  supabase,
  title,
}: {
  actorEmail?: string;
  eventType: PortalActivityEventType;
  meta: string;
  projectId: string;
  sourceRecordId?: string;
  sourceTable?: string;
  supabase: PortalSupabaseClient;
  title: string;
}) {
  const occurredAt = new Date().toISOString();
  const rule = await getPortalNotificationRule({
    eventType,
    projectId,
    supabase,
  });

  if (!rule) {
    return;
  }

  await supabase.from('portal_project_activity').insert({
    activity_type: eventType,
    actor_email: actorEmail,
    client_visible: rule.client_visible,
    display_time: formatActivityTime(occurredAt),
    meta,
    notification_rule_id: rule.id,
    occurred_at: occurredAt,
    project_id: projectId,
    sort_order: 0,
    source_record_id: sourceRecordId ?? null,
    source_table: sourceTable ?? null,
    title,
  });
}
