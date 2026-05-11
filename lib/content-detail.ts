import type {
  ContentCalendarEntry,
  ContentDetailItem,
  ContentRecord,
  IdeaRecord,
  PipelineCard,
  ResearchRecord,
} from '@/lib/dashboard-data';

function fallbackId(prefix: string, ...parts: string[]) {
  return [prefix, ...parts]
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function contentRecordDetail(record: ContentRecord): ContentDetailItem {
  return {
    id: record.id ?? fallbackId('record', record.project, record.title),
    entityType: 'record',
    editable: true,
    title: record.title,
    kind: 'Content record',
    workspace: record.workspace,
    client: record.client,
    project: record.project,
    contentType: record.contentType,
    channel: record.channel,
    status: record.status,
    priority: record.priority,
    owner: record.owner,
    dueDate: record.dueDate,
    publishDate: record.publishDate,
    summary: `${record.contentType} work item in ${record.workspace} content operations.`,
    notes: [
      `Category: ${record.category}`,
      `Publish target: ${record.publishDate}`,
      `Current owner: ${record.owner}`,
    ],
  };
}

export function researchRecordDetail(record: ResearchRecord): ContentDetailItem {
  return {
    id: record.id ?? fallbackId('research', record.project, record.topic),
    entityType: 'research',
    editable: true,
    title: record.topic,
    kind: 'Research note',
    workspace: record.workspace,
    client: record.client,
    project: record.project,
    contentType: record.contentType,
    channel: record.channel,
    status: 'Research',
    priority: 'Medium',
    owner: record.owner,
    source: record.source,
    focus: record.focus,
    nextAction: record.nextAction,
    summary: 'Research packets should turn into briefs, not disappear into notes.',
    notes: [
      `Owner: ${record.owner}`,
      `Channel context: ${record.channel}`,
    ],
  };
}

export function ideaRecordDetail(record: IdeaRecord): ContentDetailItem {
  return {
    id: record.id ?? fallbackId('idea', record.project, record.title),
    entityType: 'idea',
    editable: true,
    title: record.title,
    kind: 'Idea or brief',
    workspace: record.workspace,
    client: record.client,
    project: record.project,
    contentType: record.contentType,
    channel: record.channel,
    status: record.status,
    priority: record.priority,
    owner: record.owner,
    goal: record.goal,
    audience: record.audience,
    cta: record.cta,
    summary: 'Ideas become useful only once audience, goal, and CTA are explicit.',
    notes: [
      `Owner: ${record.owner}`,
      `Planned channel: ${record.channel}`,
    ],
  };
}

export function pipelineCardDetail(record: PipelineCard, stage: string): ContentDetailItem {
  return {
    id: record.id ?? fallbackId('pipeline', record.project, record.title),
    entityType: 'pipeline',
    editable: false,
    title: record.title,
    kind: 'Pipeline card',
    workspace: record.workspace,
    client: record.client,
    project: record.project,
    contentType: record.contentType,
    channel: record.channel,
    status: stage,
    priority: record.priority,
    dueDate: record.due,
    summary: `This item is currently sitting in the ${stage} stage of production.`,
    notes: [
      `Client context: ${record.client === '-' ? 'Internal content work' : record.client}`,
      `Channel: ${record.channel}`,
    ],
  };
}

export function calendarEntryDetail(record: ContentCalendarEntry): ContentDetailItem {
  return {
    id: record.id ?? fallbackId('calendar', record.project, record.title, record.date),
    entityType: 'calendar',
    editable: true,
    title: record.title,
    kind: 'Scheduled item',
    workspace: record.workspace,
    client: record.client,
    project: record.project,
    contentType: record.contentType,
    channel: record.channel,
    status: record.status,
    priority: record.priority,
    publishDate: `${record.day} ${record.date}`,
    calendarDay: record.day,
    calendarDate: record.date,
    summary: 'Scheduled items represent publishing commitments, not just draft intentions.',
    notes: [
      `Publish window: ${record.day} ${record.date}`,
      `Priority: ${record.priority}`,
    ],
  };
}
