import { NextRequest, NextResponse } from 'next/server';
import { getPortalAccess, getStudioAccess } from '@/lib/portal-access';
import { logPortalProjectActivity } from '@/lib/portal-activity';
import type {
  PortalCommunicationContextType,
  PortalDecisionSourceChannel,
  PortalDecisionType,
  PortalMeetingTopicType,
  PortalMessageSourceChannel,
} from '@/lib/portal-communications';
import { recordPortalOperationalEvent } from '@/lib/portal-monitoring';
import { defaultPortalProjectSlug, getPortalSupabaseClient } from '@/lib/portal-supabase';

export const runtime = 'nodejs';

const meetingTopicTypes = new Set<PortalMeetingTopicType>([
  'handoff',
  'kickoff',
  'other',
  'project',
  'review',
  'scope',
  'strategy',
  'support',
]);
const contextTypes = new Set<PortalCommunicationContextType>([
  'approval',
  'deliverable',
  'handoff',
  'invoice',
  'meeting',
  'milestone',
  'other',
  'project',
  'request',
  'support',
]);
const messageSourceChannels = new Set<PortalMessageSourceChannel>([
  'email',
  'meeting',
  'phone',
  'portal',
  'studio_logged',
  'whatsapp',
]);
const decisionSourceChannels = new Set<PortalDecisionSourceChannel>([
  'approval',
  'email',
  'meeting',
  'phone',
  'portal',
  'studio_logged',
  'whatsapp',
]);
const decisionTypes = new Set<PortalDecisionType>([
  'approval',
  'kickoff_outcome',
  'meeting_outcome',
  'phone_call',
  'project_decision',
  'scope_decision',
  'support',
  'whatsapp_summary',
]);

type ProjectRow = {
  id: string;
  slug: string;
};

type ThreadLookupRow = {
  id: string;
  project_id: string;
  subject: string;
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

function asOptionalBoolean(value: unknown) {
  return typeof value === 'boolean' ? value : undefined;
}

function isDateInput(value: string) {
  return !value || /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function getThreadProject(row: ThreadLookupRow) {
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

async function getNextNumber(table: string, column: string, prefix: string, projectId: string) {
  const supabase = getPortalSupabaseClient();

  if (!supabase) {
    return `${prefix}-001`;
  }

  const { count } = await supabase
    .from(table)
    .select(column, { count: 'exact', head: true })
    .eq('project_id', projectId);

  return `${prefix}-${String((count ?? 0) + 1).padStart(3, '0')}`;
}

async function assertProjectAccess({
  project,
  sourceChannel,
}: {
  project: ProjectRow;
  sourceChannel: string;
}) {
  const access = sourceChannel === 'portal' ? await getPortalAccess(project.slug) : await getStudioAccess();

  if (access.status === 'missing-config') {
    return { access, error: 'Supabase Auth is not configured.', status: 503 };
  }

  if (access.status === 'unauthenticated') {
    return { access, error: 'Portal authentication is required.', status: 401 };
  }

  if (access.status !== 'authorized') {
    return { access, error: access.message, status: access.status === 'expired' ? 410 : 403 };
  }

  if ('projectIds' in access) {
    if (!access.projectIds.includes(project.id)) {
      return { access, error: 'This studio account cannot update communication records for that project.', status: 403 };
    }
  } else if (!access.canSubmitOnboarding) {
    return { access, error: 'Your portal role has read-only communication access.', status: 403 };
  }

  return { access, error: '', status: 200 };
}

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: 'Invalid communication request origin.' }, { status: 403 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid communication payload.' }, { status: 400 });
  }

  if (!isRecord(body)) {
    return NextResponse.json({ error: 'Invalid communication payload.' }, { status: 400 });
  }

  const action = asString(body.action);
  const projectSlug = asString(body.projectSlug) || defaultPortalProjectSlug;
  const { error: projectError, project, supabase } = await getProjectBySlug(projectSlug);

  if (!supabase) {
    await recordPortalOperationalEvent({
      detail: projectError,
      eventType: 'project_data_error',
      metadata: { action, projectSlug },
      severity: 'error',
      sourceRoute: '/api/portal/communications',
      title: 'Communication API missing project data config',
    });

    return NextResponse.json({ error: projectError }, { status: 503 });
  }

  if (!project) {
    return NextResponse.json({ error: projectError }, { status: 404 });
  }

  if (action === 'meeting_request') {
    const topicType = asString(body.topicType) || 'project';
    const title = asString(body.title);
    const reason = asString(body.reason);
    const preferredSlots = asString(body.preferredSlots);
    const attendees = asString(body.attendees);
    const agenda = asString(body.agenda);
    const relatedItemType = asString(body.relatedItemType) || 'project';
    const relatedItemLabel = asString(body.relatedItemLabel);
    const sourceChannel = asString(body.sourceChannel) || 'portal';

    if (!meetingTopicTypes.has(topicType as PortalMeetingTopicType)) {
      return NextResponse.json({ error: 'Choose a valid meeting topic.' }, { status: 400 });
    }

    if (!contextTypes.has(relatedItemType as PortalCommunicationContextType)) {
      return NextResponse.json({ error: 'Choose a valid related item type.' }, { status: 400 });
    }

    if (!title || title.length < 3 || reason.length < 8 || preferredSlots.length < 4) {
      return NextResponse.json({ error: 'Add a title, reason, and preferred meeting slots.' }, { status: 400 });
    }

    const accessResult = await assertProjectAccess({ project, sourceChannel });

    if (accessResult.error || accessResult.access.status !== 'authorized') {
      return NextResponse.json({ error: accessResult.error }, { status: accessResult.status });
    }

    const requestedAt = new Date().toISOString();
    const meetingNumber = await getNextNumber('portal_project_meeting_requests', 'meeting_number', 'MTG', project.id);
    const actorEmail = accessResult.access.auth.email;
    const actorRole = accessResult.access.role;

    const { data: insertedMeeting, error: insertError } = await supabase
      .from('portal_project_meeting_requests')
      .insert({
        agenda,
        attendees,
        meeting_number: meetingNumber,
        next_action: 'The studio will confirm whether a meeting is needed and propose a slot.',
        owner_name: 'Kreative Reflow',
        owner_role: 'Studio',
        preferred_slots: preferredSlots,
        project_id: project.id,
        reason,
        related_item_label: relatedItemLabel,
        related_item_type: relatedItemType,
        requested_at: requestedAt,
        requested_by_email: actorEmail,
        requested_by_role: actorRole,
        requested_by_user_id: accessResult.access.auth.userId,
        source_channel: sourceChannel,
        title,
        topic_type: topicType,
        updated_at: requestedAt,
      })
      .select('id,meeting_number,status')
      .single<{ id: string; meeting_number: string; status: string }>();

    if (insertError || !insertedMeeting) {
      await recordPortalOperationalEvent({
        actorEmail,
        detail: insertError?.message || 'Meeting request insert returned no id.',
        eventType: 'project_data_error',
        metadata: { projectSlug, topicType },
        projectId: project.id,
        severity: 'error',
        sourceRoute: '/api/portal/communications',
        title: 'Meeting request could not be saved',
      });

      return NextResponse.json({ error: 'Meeting request could not be saved.' }, { status: 500 });
    }

    await logPortalProjectActivity({
      actorEmail,
      eventType: 'meeting_requested',
      meta: `${meetingNumber}: ${title}.`,
      projectId: project.id,
      sourceRecordId: insertedMeeting.id,
      sourceTable: 'portal_project_meeting_requests',
      supabase,
      title: `Meeting requested: ${title}`,
    });

    return NextResponse.json({
      meeting: {
        id: insertedMeeting.id,
        meetingNumber: insertedMeeting.meeting_number,
        requestedAt,
        status: insertedMeeting.status,
      },
      ok: true,
    });
  }

  if (action === 'message') {
    const messageBody = asString(body.messageBody);
    const sourceChannel = asString(body.sourceChannel) || 'portal';
    const threadId = asString(body.threadId);
    const subject = asString(body.subject);
    const contextType = asString(body.contextType) || 'project';
    const contextLabel = asString(body.contextLabel);
    const actionRequired = asOptionalBoolean(body.actionRequired) ?? false;
    const actionOwner = asString(body.actionOwner);
    const actionDueOn = asString(body.actionDueOn);

    if (!messageSourceChannels.has(sourceChannel as PortalMessageSourceChannel)) {
      return NextResponse.json({ error: 'Choose a valid message source.' }, { status: 400 });
    }

    if (!contextTypes.has(contextType as PortalCommunicationContextType)) {
      return NextResponse.json({ error: 'Choose a valid message context.' }, { status: 400 });
    }

    if (messageBody.length < 4) {
      return NextResponse.json({ error: 'Add a clear message before posting.' }, { status: 400 });
    }

    if (!threadId && subject.length < 3) {
      return NextResponse.json({ error: 'Add a subject for the message thread.' }, { status: 400 });
    }

    if (!isDateInput(actionDueOn)) {
      return NextResponse.json({ error: 'Use a valid action due date.' }, { status: 400 });
    }

    const accessResult = await assertProjectAccess({ project, sourceChannel });

    if (accessResult.error || accessResult.access.status !== 'authorized') {
      return NextResponse.json({ error: accessResult.error }, { status: accessResult.status });
    }

    const actorEmail = accessResult.access.auth.email;
    const actorRole = accessResult.access.role;
    const sentAt = new Date().toISOString();
    let resolvedThreadId = threadId;
    let resolvedSubject = subject;

    if (resolvedThreadId) {
      const { data: thread, error: threadError } = await supabase
        .from('portal_project_message_threads')
        .select('id,project_id,subject,portal_projects!inner(slug)')
        .eq('id', resolvedThreadId)
        .maybeSingle<ThreadLookupRow>();
      const threadProject = thread ? getThreadProject(thread) : null;

      if (threadError || !thread || thread.project_id !== project.id || !threadProject?.slug) {
        return NextResponse.json({ error: 'Message thread could not be found.' }, { status: 404 });
      }

      resolvedSubject = thread.subject;
    } else {
      const threadNumber = await getNextNumber('portal_project_message_threads', 'thread_key', 'MSG', project.id);
      const { data: thread, error: threadError } = await supabase
        .from('portal_project_message_threads')
        .insert({
          context_label: contextLabel,
          context_type: contextType,
          created_by_email: actorEmail,
          last_message_at: sentAt,
          owner_name: sourceChannel === 'portal' ? 'Kreative Reflow' : 'Client',
          owner_role: sourceChannel === 'portal' ? 'Studio' : 'Client owner',
          project_id: project.id,
          status: sourceChannel === 'portal' ? 'waiting_studio' : 'waiting_client',
          subject,
          summary: `Message thread for ${contextLabel || contextType.replace(/_/g, ' ')}.`,
          thread_key: threadNumber,
          updated_at: sentAt,
        })
        .select('id,subject')
        .single<{ id: string; subject: string }>();

      if (threadError || !thread) {
        return NextResponse.json({ error: 'Message thread could not be created.' }, { status: 500 });
      }

      resolvedThreadId = thread.id;
      resolvedSubject = thread.subject;
    }

    const { data: insertedMessage, error: messageError } = await supabase
      .from('portal_project_messages')
      .insert({
        action_due_on: actionDueOn || null,
        action_owner: actionOwner,
        action_required: actionRequired,
        author_email: actorEmail,
        author_role: actorRole,
        message_body: messageBody,
        project_id: project.id,
        sent_at: sentAt,
        source_channel: sourceChannel,
        thread_id: resolvedThreadId,
        visibility: 'client_visible',
      })
      .select('id')
      .single<{ id: string }>();

    if (messageError || !insertedMessage) {
      return NextResponse.json({ error: 'Message could not be saved.' }, { status: 500 });
    }

    await supabase
      .from('portal_project_message_threads')
      .update({
        last_message_at: sentAt,
        owner_name: sourceChannel === 'portal' ? 'Kreative Reflow' : 'Client',
        owner_role: sourceChannel === 'portal' ? 'Studio' : 'Client owner',
        status: sourceChannel === 'portal' ? 'waiting_studio' : 'waiting_client',
        updated_at: sentAt,
      })
      .eq('id', resolvedThreadId);

    await logPortalProjectActivity({
      actorEmail,
      eventType: 'message_posted',
      meta: `${resolvedSubject}: ${messageBody.slice(0, 140)}`,
      projectId: project.id,
      sourceRecordId: insertedMessage.id,
      sourceTable: 'portal_project_messages',
      supabase,
      title: `Message posted: ${resolvedSubject}`,
    });

    return NextResponse.json({
      message: {
        id: insertedMessage.id,
        sentAt,
        threadId: resolvedThreadId,
      },
      ok: true,
    });
  }

  if (action !== 'decision_log') {
    return NextResponse.json({ error: 'Choose a valid communication action.' }, { status: 400 });
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

  if (!access.projectIds.includes(project.id)) {
    return NextResponse.json({ error: 'This studio account cannot log decisions for that project.' }, { status: 403 });
  }

  const decisionType = asString(body.decisionType) || 'project_decision';
  const title = asString(body.title);
  const decisionSummary = asString(body.decisionSummary);
  const rationale = asString(body.rationale);
  const outcome = asString(body.outcome);
  const actionItems = asString(body.actionItems);
  const ownerName = asString(body.ownerName) || 'Kreative Reflow';
  const ownerRole = asString(body.ownerRole) || 'Studio';
  const dueOn = asString(body.dueOn);
  const sourceChannel = asString(body.sourceChannel) || 'studio_logged';
  const relatedItemType = asString(body.relatedItemType) || 'project';
  const relatedItemLabel = asString(body.relatedItemLabel);
  const internalNote = asString(body.internalNote);

  if (!decisionTypes.has(decisionType as PortalDecisionType)) {
    return NextResponse.json({ error: 'Choose a valid decision type.' }, { status: 400 });
  }

  if (!decisionSourceChannels.has(sourceChannel as PortalDecisionSourceChannel)) {
    return NextResponse.json({ error: 'Choose a valid decision source.' }, { status: 400 });
  }

  if (!contextTypes.has(relatedItemType as PortalCommunicationContextType)) {
    return NextResponse.json({ error: 'Choose a valid related item type.' }, { status: 400 });
  }

  if (!isDateInput(dueOn)) {
    return NextResponse.json({ error: 'Use a valid decision due date.' }, { status: 400 });
  }

  if (!title || decisionSummary.length < 8 || outcome.length < 4) {
    return NextResponse.json({ error: 'Add a title, decision summary, and outcome.' }, { status: 400 });
  }

  const decidedAt = new Date().toISOString();
  const decisionNumber = await getNextNumber('portal_project_decisions', 'decision_number', 'DEC', project.id);
  const { data: insertedDecision, error: insertError } = await supabase
    .from('portal_project_decisions')
    .insert({
      action_items: actionItems,
      decided_at: decidedAt,
      decided_by_email: access.auth.email,
      decided_by_role: access.role,
      decision_number: decisionNumber,
      decision_summary: decisionSummary,
      decision_type: decisionType,
      due_on: dueOn || null,
      internal_note: internalNote,
      outcome,
      owner_name: ownerName,
      owner_role: ownerRole,
      project_id: project.id,
      rationale,
      related_item_label: relatedItemLabel,
      related_item_type: relatedItemType,
      source_channel: sourceChannel,
      title,
      updated_at: decidedAt,
    })
    .select('id,decision_number')
    .single<{ id: string; decision_number: string }>();

  if (insertError || !insertedDecision) {
    await recordPortalOperationalEvent({
      actorEmail: access.auth.email,
      detail: insertError?.message || 'Decision log insert returned no id.',
      eventType: 'project_data_error',
      metadata: { decisionType, projectSlug },
      projectId: project.id,
      severity: 'error',
      sourceRoute: '/api/portal/communications',
      title: 'Decision log could not be saved',
    });

    return NextResponse.json({ error: 'Decision log could not be saved.' }, { status: 500 });
  }

  await logPortalProjectActivity({
    actorEmail: access.auth.email,
    eventType: 'decision_logged',
    meta: `${decisionNumber}: ${outcome}`,
    projectId: project.id,
    sourceRecordId: insertedDecision.id,
    sourceTable: 'portal_project_decisions',
    supabase,
    title: `Decision logged: ${title}`,
  });

  return NextResponse.json({
    decision: {
      decidedAt,
      decisionNumber: insertedDecision.decision_number,
      id: insertedDecision.id,
    },
    ok: true,
  });
}
