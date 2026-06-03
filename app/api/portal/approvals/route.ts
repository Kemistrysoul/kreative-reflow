import { NextRequest, NextResponse } from 'next/server';
import { getPortalAccess } from '@/lib/portal-access';
import { logPortalProjectActivity } from '@/lib/portal-activity';
import type { PortalApprovalDecision, PortalDeliverableStatus } from '@/lib/portal-approvals';
import { recordPortalOperationalEvent } from '@/lib/portal-monitoring';
import { getPortalSupabaseClient } from '@/lib/portal-supabase';

export const runtime = 'nodejs';

type DeliverableApprovalRow = {
  id: string;
  project_id: string;
  milestone_id: string | null;
  title: string;
  version_label: string;
  status: PortalDeliverableStatus;
  portal_projects:
    | {
        slug: string;
      }
    | {
        slug: string;
      }[]
    | null;
};

function hasSameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (!origin) return true;

  return origin === new URL(request.url).origin;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isDecision(value: string): value is PortalApprovalDecision {
  return value === 'approved' || value === 'revision_requested';
}

function getProject(row: DeliverableApprovalRow) {
  if (Array.isArray(row.portal_projects)) {
    return row.portal_projects[0] ?? null;
  }

  return row.portal_projects;
}

function getDecisionCopy(decision: PortalApprovalDecision) {
  if (decision === 'approved') {
    return {
      activityType: 'approval_submitted' as const,
      titlePrefix: 'Deliverable approved',
      milestoneState: 'Done',
      responseMessage: 'Approval recorded.',
    };
  }

  return {
    activityType: 'revision_requested' as const,
    titlePrefix: 'Revision requested',
    milestoneState: 'Review',
    responseMessage: 'Revision request recorded.',
  };
}

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: 'Invalid approval origin.' }, { status: 403 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid approval payload.' }, { status: 400 });
  }

  if (!isRecord(body)) {
    return NextResponse.json({ error: 'Invalid approval payload.' }, { status: 400 });
  }

  const deliverableId = asString(body.deliverableId);
  const decision = asString(body.decision);
  const note = asString(body.note);

  if (!deliverableId || !isDecision(decision)) {
    return NextResponse.json({ error: 'Choose a valid deliverable decision.' }, { status: 400 });
  }

  if (decision === 'revision_requested' && note.length < 8) {
    return NextResponse.json({ error: 'Add a clear revision note before requesting changes.' }, { status: 400 });
  }

  const supabase = getPortalSupabaseClient();

  if (!supabase) {
    await recordPortalOperationalEvent({
      detail: 'Approval decisions cannot be saved because Supabase project data is not configured.',
      eventType: 'project_data_error',
      metadata: { deliverableId },
      severity: 'error',
      sourceRoute: '/api/portal/approvals',
      title: 'Approval API missing project data config',
    });

    return NextResponse.json({ error: 'Supabase project data is not configured.' }, { status: 503 });
  }

  const { data: deliverable, error: deliverableError } = await supabase
    .from('portal_project_deliverables')
    .select('id,project_id,milestone_id,title,version_label,status,portal_projects!inner(slug)')
    .eq('id', deliverableId)
    .maybeSingle<DeliverableApprovalRow>();

  const project = deliverable ? getProject(deliverable) : null;

  if (deliverableError || !deliverable || !project?.slug) {
    if (deliverableError) {
      await recordPortalOperationalEvent({
        detail: deliverableError.message || 'Deliverable lookup failed.',
        eventType: 'approval_failure',
        metadata: { deliverableId },
        severity: 'error',
        sourceRoute: '/api/portal/approvals',
        title: 'Approval deliverable lookup failed',
      });
    }

    return NextResponse.json({ error: 'Deliverable could not be found.' }, { status: 404 });
  }

  const access = await getPortalAccess(project.slug);

  if (access.status === 'missing-config') {
    await recordPortalOperationalEvent({
      detail: 'Portal access could not be checked because Supabase Auth is not configured.',
      eventType: 'auth_failure',
      metadata: { deliverableId, projectSlug: project.slug },
      projectId: deliverable.project_id,
      severity: 'error',
      sourceRoute: '/api/portal/approvals',
      title: 'Approval access check blocked by missing auth config',
    });

    return NextResponse.json({ error: 'Supabase Auth is not configured.' }, { status: 503 });
  }

  if (access.status === 'unauthenticated') {
    return NextResponse.json({ error: 'Portal authentication is required.' }, { status: 401 });
  }

  if (access.status !== 'authorized') {
    return NextResponse.json({ error: access.message }, { status: access.status === 'expired' ? 410 : 403 });
  }

  if (!access.canSubmitOnboarding) {
    return NextResponse.json({ error: 'Your portal role has read-only access for approvals.' }, { status: 403 });
  }

  const decidedAt = new Date().toISOString();
  const { data: event, error: eventError } = await supabase
    .from('portal_project_approval_events')
    .insert({
      project_id: deliverable.project_id,
      deliverable_id: deliverable.id,
      decision,
      note,
      decided_by_user_id: access.auth.userId,
      decided_by_email: access.auth.email,
      decided_by_role: access.role,
      decided_at: decidedAt,
    })
    .select('id')
    .single<{ id: string }>();

  if (eventError || !event) {
    await recordPortalOperationalEvent({
      actorEmail: access.auth.email,
      detail: eventError?.message || 'Approval event insert returned no event id.',
      eventType: 'approval_failure',
      metadata: { decision, deliverableId, projectSlug: project.slug },
      projectId: deliverable.project_id,
      severity: 'error',
      sourceRoute: '/api/portal/approvals',
      title: 'Approval event could not be saved',
    });

    return NextResponse.json({ error: 'Approval decision could not be saved.' }, { status: 500 });
  }

  const copy = getDecisionCopy(decision);
  const nextStatus = decision === 'approved' ? 'approved' : 'revision_requested';
  const updatePayload =
    decision === 'approved'
      ? {
          approved_at: decidedAt,
          approved_by_email: access.auth.email,
          revision_requested_at: null,
          status: nextStatus,
          updated_at: decidedAt,
        }
      : {
          approved_at: null,
          approved_by_email: '',
          revision_requested_at: decidedAt,
          status: nextStatus,
          updated_at: decidedAt,
        };

  const { error: updateError } = await supabase
    .from('portal_project_deliverables')
    .update(updatePayload)
    .eq('id', deliverable.id);

  if (updateError) {
    await recordPortalOperationalEvent({
      actorEmail: access.auth.email,
      detail: updateError.message || 'Deliverable status update failed.',
      eventType: 'approval_failure',
      metadata: { decision, deliverableId, projectSlug: project.slug },
      projectId: deliverable.project_id,
      severity: 'error',
      sourceRoute: '/api/portal/approvals',
      title: 'Deliverable status could not be updated after approval',
    });

    return NextResponse.json({ error: 'Deliverable status could not be updated.' }, { status: 500 });
  }

  if (deliverable.milestone_id) {
    const milestoneUpdate =
      decision === 'approved'
        ? {
            completed_at: decidedAt,
            detail: `${deliverable.title} ${deliverable.version_label} approved by ${access.auth.email}.`,
            state: copy.milestoneState,
            updated_at: decidedAt,
          }
        : {
            detail: `${deliverable.title} ${deliverable.version_label} needs revisions: ${note}`,
            state: copy.milestoneState,
            updated_at: decidedAt,
          };

    const { error: milestoneError } = await supabase
      .from('portal_project_milestones')
      .update(milestoneUpdate)
      .eq('id', deliverable.milestone_id);

    if (milestoneError) {
      await recordPortalOperationalEvent({
        actorEmail: access.auth.email,
        detail: milestoneError.message || 'Milestone status could not be updated after approval.',
        eventType: 'project_data_error',
        metadata: { decision, deliverableId, milestoneId: deliverable.milestone_id, projectSlug: project.slug },
        projectId: deliverable.project_id,
        severity: 'warning',
        sourceRoute: '/api/portal/approvals',
        title: 'Approval saved but milestone update failed',
      });
    }
  }

  await logPortalProjectActivity({
    actorEmail: access.auth.email,
    eventType: copy.activityType,
    meta:
      decision === 'approved'
        ? `${deliverable.version_label} approved by ${access.auth.email}.`
        : `${deliverable.version_label} needs revision: ${note}`,
    projectId: deliverable.project_id,
    sourceRecordId: event.id,
    sourceTable: 'portal_project_approval_events',
    supabase,
    title: `${copy.titlePrefix}: ${deliverable.title} ${deliverable.version_label}`,
  });

  if (decision === 'approved' && deliverable.milestone_id) {
    await logPortalProjectActivity({
      actorEmail: access.auth.email,
      eventType: 'milestone_completed',
      meta: `${deliverable.title} moved to Done after client approval.`,
      projectId: deliverable.project_id,
      sourceRecordId: deliverable.milestone_id,
      sourceTable: 'portal_project_milestones',
      supabase,
      title: `Milestone completed: ${deliverable.title}`,
    });
  }

  return NextResponse.json({
    ok: true,
    approvedAt: decision === 'approved' ? decidedAt : null,
    decidedByEmail: access.auth.email,
    decision,
    message: copy.responseMessage,
    status: nextStatus,
  });
}
