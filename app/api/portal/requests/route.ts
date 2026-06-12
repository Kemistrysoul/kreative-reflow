import { NextRequest, NextResponse } from 'next/server';
import { getPortalAccess, getStudioAccess } from '@/lib/portal-access';
import { logPortalProjectActivity } from '@/lib/portal-activity';
import { recordPortalOperationalEvent } from '@/lib/portal-monitoring';
import {
  type PortalRequestClassification,
  type PortalRequestClientDecision,
  type PortalRequestSourceChannel,
  type PortalRequestStatus,
  type PortalRequestType,
  type PortalRequestUrgency,
} from '@/lib/portal-requests';
import { defaultPortalProjectSlug, getPortalSupabaseClient } from '@/lib/portal-supabase';

export const runtime = 'nodejs';

const requestTypes = new Set<PortalRequestType>([
  'bug_fix',
  'maintenance_request',
  'meeting_request',
  'question',
  'scope_change',
  'small_change',
  'support_request',
]);
const requestUrgencies = new Set<PortalRequestUrgency>(['high', 'low', 'normal', 'urgent']);
const sourceChannels = new Set<PortalRequestSourceChannel>([
  'email',
  'meeting',
  'phone',
  'portal',
  'studio_logged',
  'whatsapp',
]);
const requestClassifications = new Set<PortalRequestClassification>([
  'change_request',
  'fix',
  'included_revision',
  'maintenance',
  'out_of_scope',
  'unclassified',
]);
const requestStatuses = new Set<PortalRequestStatus>([
  'approved',
  'closed',
  'declined',
  'in_progress',
  'parked',
  'resolved',
  'submitted',
  'triage',
  'waiting_approval',
  'waiting_client',
]);
const clientDecisions = new Set<PortalRequestClientDecision>(['approved', 'declined', 'parked']);
const scopeDecisionClassifications = new Set<PortalRequestClassification>(['change_request', 'out_of_scope']);
const approvedWorkStatuses = new Set<PortalRequestStatus>(['approved', 'closed', 'in_progress', 'resolved']);

type ProjectRow = {
  id: string;
  slug: string;
};

type RequestLookupRow = {
  id: string;
  project_id: string;
  request_number: string;
  title: string;
  status: PortalRequestStatus;
  classification: PortalRequestClassification;
  client_decision: PortalRequestClientDecision | 'not_required';
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

function asOptionalString(value: unknown) {
  return value === undefined ? undefined : asString(value);
}

function asOptionalBoolean(value: unknown) {
  return typeof value === 'boolean' ? value : undefined;
}

function isDateInput(value: string) {
  return !value || /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isHttpUrl(value: string) {
  if (!value) return true;

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function getRequestProject(row: RequestLookupRow) {
  if (Array.isArray(row.portal_projects)) {
    return row.portal_projects[0] ?? null;
  }

  return row.portal_projects;
}

async function getProjectBySlug(projectSlug: string) {
  const supabase = getPortalSupabaseClient();

  if (!supabase) {
    return { error: 'Supabase project data is not configured.', project: null, supabase: null };
  }

  const { data, error } = await supabase
    .from('portal_projects')
    .select('id,slug')
    .eq('slug', projectSlug)
    .maybeSingle<ProjectRow>();

  if (error || !data) {
    return { error: error?.message || 'Project could not be found.', project: null, supabase };
  }

  return { error: '', project: data, supabase };
}

async function getNextRequestNumber(projectId: string) {
  const supabase = getPortalSupabaseClient();

  if (!supabase) {
    return 'REQ-001';
  }

  const { count } = await supabase
    .from('portal_project_requests')
    .select('id', { count: 'exact', head: true })
    .eq('project_id', projectId);

  return `REQ-${String((count ?? 0) + 1).padStart(3, '0')}`;
}

function getClientDecisionCopy(decision: PortalRequestClientDecision) {
  if (decision === 'approved') {
    return {
      nextAction: 'Studio can schedule the approved request into delivery.',
      status: 'approved' as const,
      title: 'Request approved',
    };
  }

  if (decision === 'parked') {
    return {
      nextAction: 'This request is parked for Phase 2 or a later planning conversation.',
      status: 'parked' as const,
      title: 'Request parked',
    };
  }

  return {
    nextAction: 'No work will start on this request unless it is resubmitted or re-scoped.',
    status: 'declined' as const,
    title: 'Request declined',
  };
}

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
  }

  if (!isRecord(body)) {
    return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
  }

  const projectSlug = asString(body.projectSlug) || defaultPortalProjectSlug;
  const requestType = asString(body.requestType);
  const title = asString(body.title);
  const affectedArea = asString(body.affectedArea);
  const requestDetail = asString(body.requestDetail);
  const reason = asString(body.reason);
  const urgency = asString(body.urgency) || 'normal';
  const desiredDeadline = asString(body.desiredDeadline);
  const relatedItemLabel = asString(body.relatedItemLabel);
  const attachmentLabel = asString(body.attachmentLabel);
  const attachmentUrl = asString(body.attachmentUrl);
  const sourceChannel = asString(body.sourceChannel) || 'portal';

  if (!requestTypes.has(requestType as PortalRequestType)) {
    return NextResponse.json({ error: 'Choose a valid request type.' }, { status: 400 });
  }

  if (!title || title.length < 3) {
    return NextResponse.json({ error: 'Add a short request title.' }, { status: 400 });
  }

  if (requestDetail.length < 8) {
    return NextResponse.json({ error: 'Describe the request clearly before submitting.' }, { status: 400 });
  }

  if (!requestUrgencies.has(urgency as PortalRequestUrgency)) {
    return NextResponse.json({ error: 'Choose a valid urgency.' }, { status: 400 });
  }

  if (!sourceChannels.has(sourceChannel as PortalRequestSourceChannel)) {
    return NextResponse.json({ error: 'Choose a valid request source.' }, { status: 400 });
  }

  if (!isDateInput(desiredDeadline)) {
    return NextResponse.json({ error: 'Use a valid desired deadline.' }, { status: 400 });
  }

  if (!isHttpUrl(attachmentUrl)) {
    return NextResponse.json({ error: 'Use a valid attachment link.' }, { status: 400 });
  }

  const { error: projectError, project, supabase } = await getProjectBySlug(projectSlug);

  if (!supabase) {
    await recordPortalOperationalEvent({
      detail: projectError,
      eventType: 'project_data_error',
      metadata: { projectSlug },
      severity: 'error',
      sourceRoute: '/api/portal/requests',
      title: 'Request API missing project data config',
    });

    return NextResponse.json({ error: projectError }, { status: 503 });
  }

  if (!project) {
    return NextResponse.json({ error: projectError }, { status: 404 });
  }

  const access =
    sourceChannel === 'portal'
      ? await getPortalAccess(project.slug)
      : await getStudioAccess();

  if (access.status === 'missing-config') {
    await recordPortalOperationalEvent({
      detail: 'Portal request access could not be checked because Supabase Auth is not configured.',
      eventType: 'auth_failure',
      metadata: { projectSlug, sourceChannel },
      projectId: project.id,
      severity: 'error',
      sourceRoute: '/api/portal/requests',
      title: 'Request submit blocked by missing auth config',
    });

    return NextResponse.json({ error: 'Supabase Auth is not configured.' }, { status: 503 });
  }

  if (access.status === 'unauthenticated') {
    return NextResponse.json({ error: 'Portal authentication is required.' }, { status: 401 });
  }

  if (access.status !== 'authorized') {
    return NextResponse.json({ error: access.message }, { status: access.status === 'expired' ? 410 : 403 });
  }

  if ('projectIds' in access) {
    if (!access.projectIds.includes(project.id)) {
      return NextResponse.json({ error: 'This studio account cannot log requests for that project.' }, { status: 403 });
    }
  } else if (!access.canSubmitOnboarding) {
    return NextResponse.json({ error: 'Your portal role has read-only access for project requests.' }, { status: 403 });
  }

  const submittedAt = new Date().toISOString();
  const requestNumber = await getNextRequestNumber(project.id);
  const actorEmail = access.auth.email;
  const actorRole = access.role;

  const { data: insertedRequest, error: insertError } = await supabase
    .from('portal_project_requests')
    .insert({
      affected_area: affectedArea,
      attachment_label: attachmentLabel,
      attachment_url: attachmentUrl,
      desired_deadline: desiredDeadline || null,
      next_action: 'The studio will triage this request and confirm the next step.',
      owner_name: 'Kreative Reflow',
      owner_role: 'Studio',
      project_id: project.id,
      reason,
      related_item_label: relatedItemLabel,
      request_detail: requestDetail,
      request_number: requestNumber,
      request_type: requestType,
      source_channel: sourceChannel,
      status: sourceChannel === 'portal' ? 'submitted' : 'triage',
      submitted_at: submittedAt,
      submitted_by_email: actorEmail,
      submitted_by_role: actorRole,
      submitted_by_user_id: access.auth.userId,
      title,
      urgency,
      updated_at: submittedAt,
    })
    .select('id,request_number,status')
    .single<{ id: string; request_number: string; status: PortalRequestStatus }>();

  if (insertError || !insertedRequest) {
    await recordPortalOperationalEvent({
      actorEmail,
      detail: insertError?.message || 'Request insert returned no request id.',
      eventType: 'project_data_error',
      metadata: { projectSlug, requestType, sourceChannel },
      projectId: project.id,
      severity: 'error',
      sourceRoute: '/api/portal/requests',
      title: 'Project request could not be saved',
    });

    return NextResponse.json({ error: 'Project request could not be saved.' }, { status: 500 });
  }

  await logPortalProjectActivity({
    actorEmail,
    eventType: 'request_submitted',
    meta: `${requestNumber} submitted from ${sourceChannel.replace(/_/g, ' ')}: ${title}.`,
    projectId: project.id,
    sourceRecordId: insertedRequest.id,
    sourceTable: 'portal_project_requests',
    supabase,
    title: `Request submitted: ${title}`,
  });

  return NextResponse.json({
    ok: true,
    request: {
      id: insertedRequest.id,
      requestNumber: insertedRequest.request_number,
      status: insertedRequest.status,
      submittedAt,
    },
  });
}

export async function PATCH(request: NextRequest) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: 'Invalid request update origin.' }, { status: 403 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request update payload.' }, { status: 400 });
  }

  if (!isRecord(body)) {
    return NextResponse.json({ error: 'Invalid request update payload.' }, { status: 400 });
  }

  const requestId = asString(body.requestId);
  const action = asString(body.action);

  if (!requestId) {
    return NextResponse.json({ error: 'Choose a request to update.' }, { status: 400 });
  }

  const supabase = getPortalSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ error: 'Supabase project data is not configured.' }, { status: 503 });
  }

  const { data: projectRequest, error: lookupError } = await supabase
    .from('portal_project_requests')
    .select('id,project_id,request_number,title,status,classification,client_decision,portal_projects!inner(slug)')
    .eq('id', requestId)
    .maybeSingle<RequestLookupRow>();

  const project = projectRequest ? getRequestProject(projectRequest) : null;

  if (lookupError || !projectRequest || !project?.slug) {
    if (lookupError) {
      await recordPortalOperationalEvent({
        detail: lookupError.message || 'Request lookup failed before update.',
        eventType: 'project_data_error',
        metadata: { requestId },
        severity: 'error',
        sourceRoute: '/api/portal/requests',
        title: 'Request lookup failed',
      });
    }

    return NextResponse.json({ error: 'Project request could not be found.' }, { status: 404 });
  }

  if (action === 'client_decision') {
    const decision = asString(body.clientDecision);
    const clientDecisionNote = asString(body.clientDecisionNote);

    if (!clientDecisions.has(decision as PortalRequestClientDecision)) {
      return NextResponse.json({ error: 'Choose a valid request decision.' }, { status: 400 });
    }

    const access = await getPortalAccess(project.slug);

    if (access.status === 'missing-config') {
      return NextResponse.json({ error: 'Supabase Auth is not configured.' }, { status: 503 });
    }

    if (access.status === 'unauthenticated') {
      return NextResponse.json({ error: 'Portal authentication is required.' }, { status: 401 });
    }

    if (access.status !== 'authorized') {
      return NextResponse.json({ error: access.message }, { status: access.status === 'expired' ? 410 : 403 });
    }

    if (!access.canSubmitOnboarding) {
      return NextResponse.json({ error: 'Your portal role cannot decide project requests.' }, { status: 403 });
    }

    if (projectRequest.client_decision !== 'pending') {
      return NextResponse.json({ error: 'This request is not waiting for a client scope decision.' }, { status: 409 });
    }

    const decidedAt = new Date().toISOString();
    const copy = getClientDecisionCopy(decision as PortalRequestClientDecision);
    const { error: updateError } = await supabase
      .from('portal_project_requests')
      .update({
        client_decision: decision,
        client_decision_at: decidedAt,
        client_decision_note: clientDecisionNote,
        next_action: copy.nextAction,
        owner_name: decision === 'approved' ? 'Kreative Reflow' : 'Client',
        owner_role: decision === 'approved' ? 'Studio' : 'Client owner',
        status: copy.status,
        updated_at: decidedAt,
      })
      .eq('id', projectRequest.id);

    if (updateError) {
      await recordPortalOperationalEvent({
        actorEmail: access.auth.email,
        detail: updateError.message || 'Request client decision update failed.',
        eventType: 'project_data_error',
        metadata: { decision, requestId },
        projectId: projectRequest.project_id,
        severity: 'error',
        sourceRoute: '/api/portal/requests',
        title: 'Request decision could not be saved',
      });

      return NextResponse.json({ error: 'Request decision could not be saved.' }, { status: 500 });
    }

    await logPortalProjectActivity({
      actorEmail: access.auth.email,
      eventType: 'request_decision_submitted',
      meta: `${projectRequest.request_number} ${decision}: ${projectRequest.title}.`,
      projectId: projectRequest.project_id,
      sourceRecordId: projectRequest.id,
      sourceTable: 'portal_project_requests',
      supabase,
      title: `${copy.title}: ${projectRequest.title}`,
    });

    return NextResponse.json({
      ok: true,
      clientDecision: decision,
      decidedAt,
      nextAction: copy.nextAction,
      status: copy.status,
    });
  }

  if (action !== 'classify') {
    return NextResponse.json({ error: 'Choose a valid request update action.' }, { status: 400 });
  }

  const access = await getStudioAccess();

  if (access.status === 'missing-config') {
    return NextResponse.json({ error: 'Supabase Auth is not configured.' }, { status: 503 });
  }

  if (access.status === 'unauthenticated') {
    return NextResponse.json({ error: 'Studio authentication is required.' }, { status: 401 });
  }

  if (access.status !== 'authorized') {
    return NextResponse.json({ error: access.message }, { status: access.status === 'expired' ? 410 : 403 });
  }

  if (!access.projectIds.includes(projectRequest.project_id)) {
    return NextResponse.json({ error: 'This studio account cannot update that project request.' }, { status: 403 });
  }

  const classification = asString(body.classification) || 'unclassified';
  const requestedStatus = asString(body.status);
  const ownerName = asString(body.ownerName) || 'Kreative Reflow';
  const ownerRole = asString(body.ownerRole) || 'Studio';
  const nextAction = asString(body.nextAction) || 'Studio will confirm the next step.';
  const impactCostLabel = asOptionalString(body.impactCostLabel);
  const impactTimeLabel = asOptionalString(body.impactTimeLabel);
  const launchImpact = asOptionalString(body.launchImpact);
  const studioAssessment = asOptionalString(body.studioAssessment);
  const internalNote = asOptionalString(body.internalNote);
  const phase2Option = asOptionalBoolean(body.phase2Option);

  if (!requestClassifications.has(classification as PortalRequestClassification)) {
    return NextResponse.json({ error: 'Choose a valid request classification.' }, { status: 400 });
  }

  const requiresClientDecision = scopeDecisionClassifications.has(classification as PortalRequestClassification);
  const nextStatus = requestedStatus || (requiresClientDecision ? 'waiting_approval' : 'triage');

  if (!requestStatuses.has(nextStatus as PortalRequestStatus)) {
    return NextResponse.json({ error: 'Choose a valid request status.' }, { status: 400 });
  }

  if (
    requiresClientDecision &&
    approvedWorkStatuses.has(nextStatus as PortalRequestStatus) &&
    projectRequest.client_decision !== 'approved'
  ) {
    return NextResponse.json({
      error: 'Out-of-scope or change-request work cannot be approved or started until the client approves the impact.',
    }, { status: 409 });
  }

  const classifiedAt = new Date().toISOString();
  const { error: updateError } = await supabase
    .from('portal_project_requests')
    .update({
      classification,
      classified_at: classifiedAt,
      classified_by_email: access.auth.email,
      client_decision: requiresClientDecision ? 'pending' : 'not_required',
      impact_cost_label: impactCostLabel,
      impact_time_label: impactTimeLabel,
      internal_note: internalNote,
      launch_impact: launchImpact,
      next_action: nextAction,
      owner_name: ownerName,
      owner_role: ownerRole,
      phase2_option: phase2Option,
      status: nextStatus,
      studio_assessment: studioAssessment,
      updated_at: classifiedAt,
    })
    .eq('id', projectRequest.id);

  if (updateError) {
    await recordPortalOperationalEvent({
      actorEmail: access.auth.email,
      detail: updateError.message || 'Request classification update failed.',
      eventType: 'project_data_error',
      metadata: { classification, requestId },
      projectId: projectRequest.project_id,
      severity: 'error',
      sourceRoute: '/api/portal/requests',
      title: 'Request classification could not be saved',
    });

    return NextResponse.json({ error: 'Request classification could not be saved.' }, { status: 500 });
  }

  await logPortalProjectActivity({
    actorEmail: access.auth.email,
    eventType: 'request_classified',
    meta: `${projectRequest.request_number} classified as ${classification.replace(/_/g, ' ')}.`,
    projectId: projectRequest.project_id,
    sourceRecordId: projectRequest.id,
    sourceTable: 'portal_project_requests',
    supabase,
    title: `Request classified: ${projectRequest.title}`,
  });

  return NextResponse.json({
    ok: true,
    classification,
    clientDecision: requiresClientDecision ? 'pending' : 'not_required',
    classifiedAt,
    status: nextStatus,
  });
}
