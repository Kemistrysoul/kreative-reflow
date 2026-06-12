import { NextRequest, NextResponse } from 'next/server';
import { getStudioAccess } from '@/lib/portal-access';
import { logPortalProjectActivity } from '@/lib/portal-activity';
import { recordPortalOperationalEvent } from '@/lib/portal-monitoring';
import { getPortalSupabaseClient } from '@/lib/portal-supabase';
import type { PortalReadinessStatus } from '@/lib/portal-readiness';

export const runtime = 'nodejs';

const readinessStatuses = new Set<PortalReadinessStatus>([
  'blocked',
  'done',
  'in_progress',
  'not_started',
  'waiting_client',
]);

function hasSameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (!origin) return true;

  return origin === new URL(request.url).origin;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asBodyString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function asOptionalBodyString(value: unknown) {
  if (value === undefined) {
    return undefined;
  }

  return asBodyString(value);
}

function asOptionalBoolean(value: unknown) {
  return typeof value === 'boolean' ? value : undefined;
}

function isReadinessStatus(value: string): value is PortalReadinessStatus {
  return readinessStatuses.has(value as PortalReadinessStatus);
}

function isDateInput(value: string) {
  return !value || /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function PATCH(request: NextRequest) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: 'Invalid readiness update origin.' }, { status: 403 });
  }

  const access = await getStudioAccess();

  if (access.status === 'missing-config') {
    await recordPortalOperationalEvent({
      detail: 'Studio readiness update could not check access because Supabase Auth is not configured.',
      eventType: 'auth_failure',
      severity: 'error',
      sourceRoute: '/api/portal/readiness',
      title: 'Readiness update blocked by missing auth config',
    });

    return NextResponse.json({ error: 'Supabase Auth is not configured.' }, { status: 503 });
  }

  if (access.status === 'unauthenticated') {
    return NextResponse.json({ error: 'Studio authentication is required.' }, { status: 401 });
  }

  if (access.status !== 'authorized') {
    return NextResponse.json({ error: access.message }, { status: access.status === 'expired' ? 410 : 403 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid readiness update payload.' }, { status: 400 });
  }

  if (!isRecord(body)) {
    return NextResponse.json({ error: 'Invalid readiness update payload.' }, { status: 400 });
  }

  const itemId = asBodyString(body.itemId);
  const status = asOptionalBodyString(body.status);
  const clientNote = asOptionalBodyString(body.clientNote);
  const internalNote = asOptionalBodyString(body.internalNote);
  const ownerName = asOptionalBodyString(body.ownerName);
  const ownerRole = asOptionalBodyString(body.ownerRole);
  const dueOn = asOptionalBodyString(body.dueOn);
  const requiredForActiveDelivery = asOptionalBoolean(body.requiredForActiveDelivery);
  const blocksActiveDelivery = asOptionalBoolean(body.blocksActiveDelivery);

  if (!itemId) {
    return NextResponse.json({ error: 'Choose a readiness item to update.' }, { status: 400 });
  }

  if (status !== undefined && !isReadinessStatus(status)) {
    return NextResponse.json({ error: 'Choose a valid readiness status.' }, { status: 400 });
  }

  if (dueOn !== undefined && !isDateInput(dueOn)) {
    return NextResponse.json({ error: 'Use a valid readiness due date.' }, { status: 400 });
  }

  const supabase = getPortalSupabaseClient();

  if (!supabase) {
    await recordPortalOperationalEvent({
      actorEmail: access.auth.email,
      detail: 'Studio readiness update reached the API, but Supabase project data is not configured.',
      eventType: 'project_data_error',
      metadata: { itemId },
      severity: 'error',
      sourceRoute: '/api/portal/readiness',
      title: 'Readiness update blocked by missing project data',
    });

    return NextResponse.json({ error: 'Supabase project data is not configured.' }, { status: 503 });
  }

  const { data: item, error: itemError } = await supabase
    .from('portal_project_readiness_items')
    .select('id,project_id,item_key,label,status')
    .eq('id', itemId)
    .maybeSingle<{
      id: string;
      item_key: string;
      label: string;
      project_id: string;
      status: PortalReadinessStatus;
    }>();

  if (itemError || !item) {
    if (itemError) {
      await recordPortalOperationalEvent({
        actorEmail: access.auth.email,
        detail: itemError.message || 'Readiness item lookup failed before studio update.',
        eventType: 'project_data_error',
        metadata: { itemId },
        severity: 'error',
        sourceRoute: '/api/portal/readiness',
        title: 'Readiness item lookup failed',
      });
    }

    return NextResponse.json({ error: 'Readiness item could not be found.' }, { status: 404 });
  }

  if (!access.projectIds.includes(item.project_id)) {
    return NextResponse.json({ error: 'This studio account cannot update that project readiness item.' }, { status: 403 });
  }

  const updatePayload: {
    blocks_active_delivery?: boolean;
    client_note?: string;
    completed_at?: string | null;
    due_on?: string | null;
    internal_note?: string;
    owner_name?: string;
    owner_role?: string;
    required_for_active_delivery?: boolean;
    status?: PortalReadinessStatus;
    updated_at: string;
  } = {
    updated_at: new Date().toISOString(),
  };

  if (status !== undefined) {
    updatePayload.status = status;
    updatePayload.completed_at = status === 'done' ? updatePayload.updated_at : null;
  }

  if (clientNote !== undefined) updatePayload.client_note = clientNote;
  if (internalNote !== undefined) updatePayload.internal_note = internalNote;
  if (ownerName !== undefined) updatePayload.owner_name = ownerName || 'Kreative Reflow';
  if (ownerRole !== undefined) updatePayload.owner_role = ownerRole || 'Studio';
  if (dueOn !== undefined) updatePayload.due_on = dueOn || null;
  if (requiredForActiveDelivery !== undefined) {
    updatePayload.required_for_active_delivery = requiredForActiveDelivery;
  }
  if (blocksActiveDelivery !== undefined) {
    updatePayload.blocks_active_delivery = blocksActiveDelivery;
  }

  if (Object.keys(updatePayload).length === 1) {
    return NextResponse.json({ error: 'No readiness changes were provided.' }, { status: 400 });
  }

  const { error: updateError } = await supabase
    .from('portal_project_readiness_items')
    .update(updatePayload)
    .eq('id', item.id);

  if (updateError) {
    await recordPortalOperationalEvent({
      actorEmail: access.auth.email,
      detail: updateError.message || 'Readiness item update failed.',
      eventType: 'project_data_error',
      metadata: { itemId, nextStatus: status },
      projectId: item.project_id,
      severity: 'error',
      sourceRoute: '/api/portal/readiness',
      title: 'Readiness update could not be saved',
    });

    return NextResponse.json({ error: 'Readiness update could not be saved.' }, { status: 500 });
  }

  await logPortalProjectActivity({
    actorEmail: access.auth.email,
    eventType: 'readiness_gate_updated',
    meta: `${item.label} was updated${status ? ` to ${status.replace(/_/g, ' ')}` : ''}.`,
    projectId: item.project_id,
    sourceRecordId: item.id,
    sourceTable: 'portal_project_readiness_items',
    supabase,
    title: `Readiness updated: ${item.label}`,
  });

  return NextResponse.json({
    ok: true,
    completedAt: updatePayload.completed_at ?? null,
    status: updatePayload.status ?? item.status,
  });
}
