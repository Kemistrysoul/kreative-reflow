import 'server-only';
import { defaultPortalProjectSlug, getPortalSupabaseClient } from '@/lib/portal-supabase';

export type PortalMeetingTopicType = 'handoff' | 'kickoff' | 'other' | 'project' | 'review' | 'scope' | 'strategy' | 'support';
export type PortalMeetingStatus = 'cancelled' | 'completed' | 'declined' | 'requested' | 'scheduled';
export type PortalCommunicationContextType =
  | 'approval'
  | 'deliverable'
  | 'handoff'
  | 'invoice'
  | 'meeting'
  | 'milestone'
  | 'other'
  | 'project'
  | 'request'
  | 'support';
export type PortalThreadStatus = 'archived' | 'open' | 'resolved' | 'waiting_client' | 'waiting_studio';
export type PortalMessageSourceChannel = 'email' | 'meeting' | 'phone' | 'portal' | 'studio_logged' | 'whatsapp';
export type PortalDecisionSourceChannel = PortalMessageSourceChannel | 'approval';
export type PortalDecisionType =
  | 'approval'
  | 'kickoff_outcome'
  | 'meeting_outcome'
  | 'phone_call'
  | 'project_decision'
  | 'scope_decision'
  | 'support'
  | 'whatsapp_summary';
export type PortalDecisionStatus = 'active' | 'completed' | 'reversed' | 'superseded';

export type PortalMeetingRequest = {
  id: string;
  projectSlug: string;
  projectName: string;
  clientName: string;
  meetingNumber: string;
  topicType: PortalMeetingTopicType;
  title: string;
  reason: string;
  preferredSlots: string;
  attendees: string;
  agenda: string;
  relatedItemType: PortalCommunicationContextType;
  relatedItemLabel: string;
  status: PortalMeetingStatus;
  scheduledFor: string;
  meetingLink: string;
  ownerName: string;
  ownerRole: string;
  nextAction: string;
  requestedByEmail: string;
  requestedByRole: string;
  requestedAt: string;
  studioNote: string;
  source: 'demo' | 'supabase';
};

export type PortalProjectMessage = {
  id: string;
  threadId: string;
  messageBody: string;
  sourceChannel: PortalMessageSourceChannel;
  authorEmail: string;
  authorRole: string;
  visibility: 'client_visible' | 'studio_internal';
  actionRequired: boolean;
  actionOwner: string;
  actionDueOn: string;
  sentAt: string;
  source: 'demo' | 'supabase';
};

export type PortalMessageThread = {
  id: string;
  projectSlug: string;
  projectName: string;
  clientName: string;
  threadKey: string;
  subject: string;
  summary: string;
  contextType: PortalCommunicationContextType;
  contextLabel: string;
  status: PortalThreadStatus;
  ownerName: string;
  ownerRole: string;
  lastMessageAt: string;
  createdByEmail: string;
  internalNote: string;
  messages: PortalProjectMessage[];
  source: 'demo' | 'supabase';
};

export type PortalProjectDecision = {
  id: string;
  projectSlug: string;
  projectName: string;
  clientName: string;
  decisionNumber: string;
  decisionType: PortalDecisionType;
  title: string;
  decisionSummary: string;
  rationale: string;
  outcome: string;
  actionItems: string;
  ownerName: string;
  ownerRole: string;
  dueOn: string;
  sourceChannel: PortalDecisionSourceChannel;
  relatedItemType: PortalCommunicationContextType;
  relatedItemLabel: string;
  status: PortalDecisionStatus;
  decidedByEmail: string;
  decidedByRole: string;
  decidedAt: string;
  internalNote: string;
  source: 'demo' | 'supabase';
};

export type PortalCommunicationSummary = {
  decisions: PortalProjectDecision[];
  latestDecision: PortalProjectDecision | null;
  latestMessage: PortalProjectMessage | null;
  latestMeeting: PortalMeetingRequest | null;
  meetings: PortalMeetingRequest[];
  openMeetingCount: number;
  openThreadCount: number;
  pendingActionCount: number;
  source: 'demo' | 'supabase';
  threads: PortalMessageThread[];
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

type MeetingRow = ProjectScopedRow & {
  id: string;
  meeting_number: string;
  topic_type: PortalMeetingTopicType;
  title: string;
  reason: string;
  preferred_slots: string;
  attendees: string;
  agenda: string;
  related_item_type: PortalCommunicationContextType;
  related_item_label: string;
  status: PortalMeetingStatus;
  scheduled_for: string | null;
  meeting_link: string;
  owner_name: string;
  owner_role: string;
  next_action: string;
  requested_by_email: string;
  requested_by_role: string;
  requested_at: string;
  studio_note?: string;
};

type ThreadRow = ProjectScopedRow & {
  id: string;
  thread_key: string;
  subject: string;
  summary: string;
  context_type: PortalCommunicationContextType;
  context_label: string;
  status: PortalThreadStatus;
  owner_name: string;
  owner_role: string;
  last_message_at: string | null;
  created_by_email: string;
  internal_note?: string;
};

type MessageRow = {
  id: string;
  thread_id: string;
  message_body: string;
  source_channel: PortalMessageSourceChannel;
  author_email: string;
  author_role: string;
  visibility: 'client_visible' | 'studio_internal';
  action_required: boolean;
  action_owner: string;
  action_due_on: string | null;
  sent_at: string;
};

type DecisionRow = ProjectScopedRow & {
  id: string;
  decision_number: string;
  decision_type: PortalDecisionType;
  title: string;
  decision_summary: string;
  rationale: string;
  outcome: string;
  action_items: string;
  owner_name: string;
  owner_role: string;
  due_on: string | null;
  source_channel: PortalDecisionSourceChannel;
  related_item_type: PortalCommunicationContextType;
  related_item_label: string;
  status: PortalDecisionStatus;
  decided_by_email: string;
  decided_by_role: string;
  decided_at: string;
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

function formatDateTime(value: string | null, fallback = 'Not scheduled') {
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

function mapMeeting(row: MeetingRow, source: 'demo' | 'supabase'): PortalMeetingRequest {
  return {
    id: row.id,
    ...getProjectScope(row),
    agenda: row.agenda,
    attendees: row.attendees,
    meetingLink: row.meeting_link,
    meetingNumber: row.meeting_number,
    nextAction: row.next_action,
    ownerName: row.owner_name,
    ownerRole: row.owner_role,
    preferredSlots: row.preferred_slots,
    reason: row.reason,
    relatedItemLabel: row.related_item_label,
    relatedItemType: row.related_item_type,
    requestedAt: formatDateTime(row.requested_at),
    requestedByEmail: row.requested_by_email,
    requestedByRole: row.requested_by_role,
    scheduledFor: formatDateTime(row.scheduled_for),
    source,
    status: row.status,
    studioNote: row.studio_note ?? '',
    title: row.title,
    topicType: row.topic_type,
  };
}

function mapMessage(row: MessageRow, source: 'demo' | 'supabase'): PortalProjectMessage {
  return {
    actionDueOn: formatDate(row.action_due_on),
    actionOwner: row.action_owner,
    actionRequired: row.action_required,
    authorEmail: row.author_email,
    authorRole: row.author_role,
    id: row.id,
    messageBody: row.message_body,
    sentAt: formatDateTime(row.sent_at),
    source,
    sourceChannel: row.source_channel,
    threadId: row.thread_id,
    visibility: row.visibility,
  };
}

function mapThread(
  row: ThreadRow,
  messages: PortalProjectMessage[],
  source: 'demo' | 'supabase',
): PortalMessageThread {
  return {
    id: row.id,
    ...getProjectScope(row),
    contextLabel: row.context_label,
    contextType: row.context_type,
    createdByEmail: row.created_by_email,
    internalNote: row.internal_note ?? '',
    lastMessageAt: formatDateTime(row.last_message_at, 'No messages yet'),
    messages,
    ownerName: row.owner_name,
    ownerRole: row.owner_role,
    source,
    status: row.status,
    subject: row.subject,
    summary: row.summary,
    threadKey: row.thread_key,
  };
}

function mapDecision(row: DecisionRow, source: 'demo' | 'supabase'): PortalProjectDecision {
  return {
    id: row.id,
    ...getProjectScope(row),
    actionItems: row.action_items,
    decidedAt: formatDateTime(row.decided_at),
    decidedByEmail: row.decided_by_email,
    decidedByRole: row.decided_by_role,
    decisionNumber: row.decision_number,
    decisionSummary: row.decision_summary,
    decisionType: row.decision_type,
    dueOn: formatDate(row.due_on),
    internalNote: row.internal_note ?? '',
    outcome: row.outcome,
    ownerName: row.owner_name,
    ownerRole: row.owner_role,
    rationale: row.rationale,
    relatedItemLabel: row.related_item_label,
    relatedItemType: row.related_item_type,
    source,
    sourceChannel: row.source_channel,
    status: row.status,
    title: row.title,
  };
}

function makeDemoMeeting(input: Omit<PortalMeetingRequest, 'clientName' | 'projectName' | 'projectSlug' | 'source'>) {
  return {
    ...demoProject,
    ...input,
    source: 'demo' as const,
  };
}

function makeDemoThread(input: Omit<PortalMessageThread, 'clientName' | 'projectName' | 'projectSlug' | 'source'>) {
  return {
    ...demoProject,
    ...input,
    source: 'demo' as const,
  };
}

function makeDemoDecision(input: Omit<PortalProjectDecision, 'clientName' | 'projectName' | 'projectSlug' | 'source'>) {
  return {
    ...demoProject,
    ...input,
    source: 'demo' as const,
  };
}

const demoMeetings: PortalMeetingRequest[] = [
  makeDemoMeeting({
    agenda: 'Review homepage CTA wording, services order, and launch-sensitive content decisions.',
    attendees: 'Operations lead, CEO, Kreative Reflow',
    id: 'demo-meeting-homepage',
    meetingLink: 'https://meet.example.com/abc-homepage-review',
    meetingNumber: 'MTG-001',
    nextAction: 'Attend the scheduled review and confirm final CTA wording.',
    ownerName: 'Kreative Reflow',
    ownerRole: 'Studio',
    preferredSlots: '5 June morning or 6 June afternoon',
    reason: 'Client wants to confirm CTA wording before the next design pass.',
    relatedItemLabel: 'REQ-001 - Adjust homepage services CTA',
    relatedItemType: 'request',
    requestedAt: '3 June 2026, 11:30',
    requestedByEmail: 'operations@abc-engineering.example',
    requestedByRole: 'client_owner',
    scheduledFor: '5 June 2026, 10:00',
    status: 'scheduled',
    studioNote: '',
    title: 'Homepage review alignment call',
    topicType: 'review',
  }),
];

const demoThreads: PortalMessageThread[] = [
  makeDemoThread({
    contextLabel: 'REQ-001 - Homepage services CTA',
    contextType: 'request',
    createdByEmail: 'hello@kreativereflow.com',
    id: 'demo-thread-homepage',
    internalNote: '',
    lastMessageAt: '3 June 2026, 12:00',
    messages: [
      {
        actionDueOn: '5 June 2026',
        actionOwner: 'Client owner',
        actionRequired: true,
        authorEmail: 'hello@kreativereflow.com',
        authorRole: 'studio_admin',
        id: 'demo-message-1',
        messageBody: 'The homepage CTA can change to Request a quote if everyone is happy with that wording before build lock.',
        sentAt: '3 June 2026, 11:45',
        source: 'demo',
        sourceChannel: 'portal',
        threadId: 'demo-thread-homepage',
        visibility: 'client_visible',
      },
      {
        actionDueOn: 'Not set',
        actionOwner: '',
        actionRequired: false,
        authorEmail: 'operations@abc-engineering.example',
        authorRole: 'client_owner',
        id: 'demo-message-2',
        messageBody: 'Please keep the services order as engineering, maintenance, automation. We will confirm CTA wording in the meeting.',
        sentAt: '3 June 2026, 12:00',
        source: 'demo',
        sourceChannel: 'portal',
        threadId: 'demo-thread-homepage',
        visibility: 'client_visible',
      },
    ],
    ownerName: 'ABC Engineering',
    ownerRole: 'Client owner',
    status: 'waiting_client',
    subject: 'Homepage review questions',
    summary: 'Official discussion thread for CTA wording, homepage service priority, and content confirmation.',
    threadKey: 'homepage-review-thread',
  }),
];

const demoDecisions: PortalProjectDecision[] = [
  makeDemoDecision({
    actionItems: 'Studio to update the CTA wording in the next homepage pass.',
    decidedAt: '2 June 2026, 12:15',
    decidedByEmail: 'hello@kreativereflow.com',
    decidedByRole: 'studio_admin',
    decisionNumber: 'DEC-002',
    decisionSummary: 'The client asked on WhatsApp to make the homepage CTA feel more quote-led for industrial buyers.',
    decisionType: 'whatsapp_summary',
    dueOn: '5 June 2026',
    id: 'demo-decision-whatsapp',
    internalNote: '',
    outcome: 'Treat the wording change as an included revision unless it expands the page structure.',
    ownerName: 'Kreative Reflow',
    ownerRole: 'Studio',
    rationale: 'Outside-channel requests should not stay invisible in WhatsApp only.',
    relatedItemLabel: 'REQ-001 - Adjust homepage services CTA',
    relatedItemType: 'request',
    sourceChannel: 'whatsapp',
    status: 'active',
    title: 'WhatsApp CTA wording request logged',
  }),
];

function buildSummary({
  decisions,
  meetings,
  source,
  threads,
}: {
  decisions: PortalProjectDecision[];
  meetings: PortalMeetingRequest[];
  source: 'demo' | 'supabase';
  threads: PortalMessageThread[];
}): PortalCommunicationSummary {
  const allMessages = threads.flatMap((thread) => thread.messages);

  return {
    decisions,
    latestDecision: decisions[0] ?? null,
    latestMeeting: meetings[0] ?? null,
    latestMessage: allMessages.at(-1) ?? null,
    meetings,
    openMeetingCount: meetings.filter((meeting) => meeting.status === 'requested' || meeting.status === 'scheduled').length,
    openThreadCount: threads.filter((thread) => thread.status === 'open' || thread.status === 'waiting_client' || thread.status === 'waiting_studio').length,
    pendingActionCount: allMessages.filter((message) => message.actionRequired).length,
    source,
    threads,
  };
}

const demoCommunicationSummary = buildSummary({
  decisions: demoDecisions,
  meetings: demoMeetings,
  source: 'demo',
  threads: demoThreads,
});

const emptyCommunicationSummary = buildSummary({
  decisions: [],
  meetings: [],
  source: 'supabase',
  threads: [],
});

async function loadPortalCommunications({
  fallback,
  includeInternalNotes,
  projectSlug,
}: {
  fallback: PortalCommunicationSummary;
  includeInternalNotes: boolean;
  projectSlug: string;
}): Promise<PortalCommunicationSummary> {
  const supabase = getPortalSupabaseClient();

  if (!supabase) {
    return fallback;
  }

  const projectSelect = 'portal_projects!inner(slug,project_name,portal_clients!inner(name))';
  const meetingColumns = [
    'id',
    'meeting_number',
    'topic_type',
    'title',
    'reason',
    'preferred_slots',
    'attendees',
    'agenda',
    'related_item_type',
    'related_item_label',
    'status',
    'scheduled_for',
    'meeting_link',
    'owner_name',
    'owner_role',
    'next_action',
    'requested_by_email',
    'requested_by_role',
    'requested_at',
    includeInternalNotes ? 'studio_note' : '',
    projectSelect,
  ].filter(Boolean);
  const threadColumns = [
    'id',
    'thread_key',
    'subject',
    'summary',
    'context_type',
    'context_label',
    'status',
    'owner_name',
    'owner_role',
    'last_message_at',
    'created_by_email',
    includeInternalNotes ? 'internal_note' : '',
    projectSelect,
  ].filter(Boolean);
  const decisionColumns = [
    'id',
    'decision_number',
    'decision_type',
    'title',
    'decision_summary',
    'rationale',
    'outcome',
    'action_items',
    'owner_name',
    'owner_role',
    'due_on',
    'source_channel',
    'related_item_type',
    'related_item_label',
    'status',
    'decided_by_email',
    'decided_by_role',
    'decided_at',
    includeInternalNotes ? 'internal_note' : '',
    projectSelect,
  ].filter(Boolean);

  const [meetingResult, threadResult, decisionResult] = await Promise.all([
    supabase
      .from('portal_project_meeting_requests')
      .select(meetingColumns.join(','))
      .eq('portal_projects.slug', projectSlug)
      .eq('client_visible', true)
      .order('requested_at', { ascending: false }),
    supabase
      .from('portal_project_message_threads')
      .select(threadColumns.join(','))
      .eq('portal_projects.slug', projectSlug)
      .eq('client_visible', true)
      .order('last_message_at', { ascending: false }),
    supabase
      .from('portal_project_decisions')
      .select(decisionColumns.join(','))
      .eq('portal_projects.slug', projectSlug)
      .eq('client_visible', true)
      .order('decided_at', { ascending: false }),
  ]);

  if (meetingResult.error || threadResult.error || decisionResult.error) {
    return fallback;
  }

  const threadRows = (threadResult.data ?? []) as unknown as ThreadRow[];
  const threadIds = threadRows.map((thread) => thread.id);
  let messagesByThread = new Map<string, PortalProjectMessage[]>();

  if (threadIds.length) {
    const messageResult = await supabase
      .from('portal_project_messages')
      .select('id,thread_id,message_body,source_channel,author_email,author_role,visibility,action_required,action_owner,action_due_on,sent_at')
      .in('thread_id', threadIds)
      .eq('client_visible', true)
      .eq('visibility', 'client_visible')
      .order('sent_at', { ascending: true });

    if (messageResult.error) {
      return fallback;
    }

    messagesByThread = ((messageResult.data ?? []) as unknown as MessageRow[]).reduce((map, row) => {
      const nextMessages = map.get(row.thread_id) ?? [];
      nextMessages.push(mapMessage(row, 'supabase'));
      map.set(row.thread_id, nextMessages);
      return map;
    }, new Map<string, PortalProjectMessage[]>());
  }

  return buildSummary({
    decisions: ((decisionResult.data ?? []) as unknown as DecisionRow[]).map((row) => mapDecision(row, 'supabase')),
    meetings: ((meetingResult.data ?? []) as unknown as MeetingRow[]).map((row) => mapMeeting(row, 'supabase')),
    source: 'supabase',
    threads: threadRows.map((row) => mapThread(row, messagesByThread.get(row.id) ?? [], 'supabase')),
  });
}

export async function getPortalCommunications(projectSlug = defaultPortalProjectSlug) {
  return loadPortalCommunications({
    fallback: emptyCommunicationSummary,
    includeInternalNotes: false,
    projectSlug,
  });
}

export async function getStudioPortalCommunications(projectSlug = defaultPortalProjectSlug) {
  return loadPortalCommunications({
    fallback: demoCommunicationSummary,
    includeInternalNotes: true,
    projectSlug,
  });
}
