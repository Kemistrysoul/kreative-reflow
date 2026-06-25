'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  contentCalendarEntries,
  contentFilters,
  contentIdeas,
  contentRecords,
  contentResearchRecords,
  type ContentCalendarEntry,
  type ContentDetailItem,
  type ContentFilterState,
  type ContentRecord,
  type IdeaRecord,
  type ResearchRecord,
} from '@/lib/dashboard-data';
import { calendarEntryDetail, contentRecordDetail, ideaRecordDetail } from '@/lib/content-detail';
import { useStudioWorkflow } from '@/components/studio/studio-workflow-state';

type ComposerKind = 'idea' | 'research' | 'calendar';

type StudioContentContextValue = {
  filters: ContentFilterState;
  setFilter: <K extends keyof ContentFilterState>(key: K, value: ContentFilterState[K]) => void;
  resetFilters: () => void;
  selectedItem: ContentDetailItem | null;
  openDetail: (item: ContentDetailItem) => void;
  closeDetail: () => void;
  saveDetail: (item: ContentDetailItem) => void;
  composerKind: ComposerKind | null;
  openComposer: (kind: ComposerKind) => void;
  closeComposer: () => void;
  createIdea: (item: Omit<IdeaRecord, 'id'>) => void;
  createResearch: (item: Omit<ResearchRecord, 'id'>) => void;
  createCalendarEntry: (item: Omit<ContentCalendarEntry, 'id'> & { owner?: string }) => void;
  convertResearchToIdea: (researchId: string) => void;
  promoteIdeaToBrief: (ideaId: string) => void;
  sendIdeaToPipeline: (ideaId: string) => void;
  scheduleRecord: (recordId: string) => void;
  ideaItems: IdeaRecord[];
  researchItems: ResearchRecord[];
  recordItems: ContentRecord[];
  calendarItems: ContentCalendarEntry[];
};

const initialFilters: ContentFilterState = {
  workspace: contentFilters.workspaces[0],
  client: contentFilters.clients[0],
  project: contentFilters.projects[0],
  contentType: contentFilters.contentTypes[0],
  status: contentFilters.statuses[0],
  channel: contentFilters.channels[0],
};

const StudioContentContext = createContext<StudioContentContextValue | null>(null);

function makeId(prefix: string, ...parts: string[]) {
  return [prefix, ...parts]
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const seededIdeas = contentIdeas.map((item) => ({
  ...item,
  id: item.id ?? makeId('idea', item.project, item.title),
}));

const seededResearch = contentResearchRecords.map((item) => ({
  ...item,
  id: item.id ?? makeId('research', item.project, item.topic),
}));

const seededRecords = contentRecords.map((item) => ({
  ...item,
  id: item.id ?? makeId('record', item.project, item.title),
}));

const seededCalendar = contentCalendarEntries.map((item) => ({
  ...item,
  id: item.id ?? makeId('calendar', item.project, item.title, item.date),
}));

function inferContentType(service?: string) {
  const normalized = (service ?? '').toLowerCase();

  if (normalized.includes('email')) {
    return 'Email';
  }

  if (normalized.includes('social')) {
    return 'Social';
  }

  if (normalized.includes('case study')) {
    return 'Case Study';
  }

  return 'Case Study';
}

function inferChannel(contentType: string) {
  if (contentType === 'Email') {
    return 'Email';
  }

  if (contentType === 'Social') {
    return 'Instagram';
  }

  return 'Website';
}

export function StudioContentProvider({ children }: { children: ReactNode }) {
  const { contentHandoffs } = useStudioWorkflow();
  const [filters, setFilters] = useState<ContentFilterState>(initialFilters);
  const [selectedItem, setSelectedItem] = useState<ContentDetailItem | null>(null);
  const [composerKind, setComposerKind] = useState<ComposerKind | null>(null);
  const [ideaItemsState, setIdeaItemsState] = useState<IdeaRecord[]>(seededIdeas);
  const [researchItems, setResearchItems] = useState<ResearchRecord[]>(seededResearch);
  const [recordItems, setRecordItems] = useState<ContentRecord[]>(seededRecords);
  const [calendarItems, setCalendarItems] = useState<ContentCalendarEntry[]>(seededCalendar);

  const crmIntakeIdeas = useMemo(() => {
    return contentHandoffs.map((handoff) => {
      const contentType = inferContentType(handoff.requestedService ?? handoff.business);

      return {
        id: handoff.id ? `idea-${handoff.id}` : makeId('idea', handoff.client, handoff.business),
        title: `${handoff.client} - ${handoff.requestedService ?? handoff.business}`,
        workspace: 'Client Content',
        client: handoff.client,
        project: handoff.business,
        contentType,
        channel: inferChannel(contentType),
        owner: handoff.owner,
        goal: handoff.summary,
        audience: `${handoff.client} audience`,
        cta: 'Prepare content intake brief',
        priority: 'High',
        status: 'Brief',
      } satisfies IdeaRecord;
    });
  }, [contentHandoffs]);

  const ideaItems = useMemo(() => {
    const next = [...ideaItemsState];

    crmIntakeIdeas.forEach((idea) => {
      if (!next.some((entry) => entry.id === idea.id)) {
        next.unshift(idea);
      }
    });

    return next;
  }, [crmIntakeIdeas, ideaItemsState]);

  const setFilter = useCallback(
    <K extends keyof ContentFilterState>(key: K, nextValue: ContentFilterState[K]) => {
      setFilters((current) => ({ ...current, [key]: nextValue }));
    },
    [],
  );

  const resetFilters = useCallback(() => setFilters(initialFilters), []);
  const openDetail = useCallback((item: ContentDetailItem) => setSelectedItem(item), []);
  const closeDetail = useCallback(() => setSelectedItem(null), []);
  const openComposer = useCallback((kind: ComposerKind) => setComposerKind(kind), []);
  const closeComposer = useCallback(() => setComposerKind(null), []);

  const createIdea = useCallback((item: Omit<IdeaRecord, 'id'>) => {
    const next = { ...item, id: makeId('idea', item.project, item.title) };
    setIdeaItemsState((current) => [next, ...current]);
  }, []);

  const createResearch = useCallback((item: Omit<ResearchRecord, 'id'>) => {
    const next = { ...item, id: makeId('research', item.project, item.topic) };
    setResearchItems((current) => [next, ...current]);
  }, []);

  const createCalendarEntry = useCallback(
    (item: Omit<ContentCalendarEntry, 'id'> & { owner?: string }) => {
      const calendarEntry = {
        ...item,
        id: makeId('calendar', item.project, item.title, item.date),
      };

      const recordEntry: ContentRecord = {
        id: makeId('record', item.project, item.title),
        title: item.title,
        workspace: item.workspace,
        client: item.client,
        project: item.project,
        contentType: item.contentType,
        channel: item.channel,
        owner: item.owner ?? 'Disele',
        priority: item.priority,
        status: item.status,
        category: item.contentType,
        dueDate: item.date,
        publishDate: item.date,
      };

      setCalendarItems((current) => [calendarEntry, ...current]);
      setRecordItems((current) => [recordEntry, ...current]);
    },
    [],
  );

  const convertResearchToIdea = useCallback((researchId: string) => {
    setResearchItems((current) =>
      current.map((entry) =>
        entry.id === researchId
          ? {
              ...entry,
              nextAction: 'Converted to content idea',
            }
          : entry,
      ),
    );

    const source = researchItems.find((entry) => entry.id === researchId);
    if (!source) return;

    const createdIdea: IdeaRecord = {
      id: makeId('idea', source.project, source.topic),
      title: source.topic,
      workspace: source.workspace,
      client: source.client,
      project: source.project,
      contentType: source.contentType,
      channel: source.channel,
      owner: source.owner,
      goal: source.focus,
      audience: source.client === '-' ? 'Studio growth audience' : `${source.client} audience`,
      cta: 'Refine into brief',
      priority: 'Medium',
      status: 'Idea',
    };

    setIdeaItemsState((current) => {
      if (current.some((entry) => entry.id === createdIdea.id)) {
        return current;
      }

      return [createdIdea, ...current];
    });

    setSelectedItem(ideaRecordDetail(createdIdea));
  }, [researchItems]);

  const promoteIdeaToBrief = useCallback((ideaId: string) => {
    let nextIdea: IdeaRecord | null = null;

    setIdeaItemsState((current) =>
      current.map((entry) => {
        if (entry.id !== ideaId) {
          return entry;
        }

        nextIdea = {
          ...entry,
          status: 'Brief',
        };

        return nextIdea;
      }),
    );

    if (nextIdea) {
      setSelectedItem(ideaRecordDetail(nextIdea));
    }
  }, []);

  const sendIdeaToPipeline = useCallback((ideaId: string) => {
    const idea = ideaItems.find((entry) => entry.id === ideaId);
    if (!idea) return;

    const recordId = makeId('record', idea.project, idea.title);
    const record: ContentRecord = {
      id: recordId,
      title: idea.title,
      workspace: idea.workspace,
      client: idea.client,
      project: idea.project,
      contentType: idea.contentType,
      channel: idea.channel,
      owner: idea.owner,
      priority: idea.priority,
      status: 'Brief',
      category: idea.contentType,
      dueDate: 'Jul 18',
      publishDate: 'Jul 24',
    };

    setIdeaItemsState((current) =>
      current.map((entry) => (entry.id === ideaId ? { ...entry, status: 'Brief' } : entry)),
    );

    setRecordItems((current) => {
      if (current.some((entry) => entry.id === record.id)) {
        return current.map((entry) => (entry.id === record.id ? { ...entry, ...record } : entry));
      }

      return [record, ...current];
    });

    setSelectedItem(contentRecordDetail(record));
  }, [ideaItems]);

  const scheduleRecord = useCallback((recordId: string) => {
    const record = recordItems.find((entry) => entry.id === recordId);
    if (!record) return;

    const publishDate = record.publishDate || record.dueDate || 'Jul 24';
    const dateParts = publishDate.split(' ');
    const calendarEntry: ContentCalendarEntry = {
      id: makeId('calendar', record.project, record.title, publishDate),
      day: dateParts[0] && dateParts[0].length <= 3 ? dateParts[0] : 'Thu',
      date: publishDate,
      title: record.title,
      workspace: record.workspace,
      client: record.client,
      project: record.project,
      contentType: record.contentType,
      channel: record.channel,
      priority: record.priority,
      status: 'Scheduled',
    };

    const updatedRecord = {
      ...record,
      status: 'Scheduled',
      publishDate,
    };

    setRecordItems((current) =>
      current.map((entry) => (entry.id === recordId ? updatedRecord : entry)),
    );

    setCalendarItems((current) => {
      if (current.some((entry) => entry.title === record.title && entry.project === record.project)) {
        return current.map((entry) =>
          entry.title === record.title && entry.project === record.project ? { ...entry, ...calendarEntry } : entry,
        );
      }

      return [calendarEntry, ...current];
    });

    setSelectedItem(calendarEntryDetail(calendarEntry));
  }, [recordItems]);

  const saveDetail = useCallback((item: ContentDetailItem) => {
    if (item.entityType === 'idea') {
      setIdeaItemsState((current) => {
        if (current.some((entry) => entry.id === item.id)) {
          return current.map((entry) =>
            entry.id === item.id
              ? {
                  ...entry,
                  title: item.title,
                  workspace: item.workspace,
                  client: item.client,
                  project: item.project,
                  contentType: item.contentType,
                  channel: item.channel,
                  owner: item.owner ?? entry.owner,
                  goal: item.goal ?? entry.goal,
                  audience: item.audience ?? entry.audience,
                  cta: item.cta ?? entry.cta,
                  priority: item.priority ?? entry.priority,
                  status: item.status,
                }
              : entry,
          );
        }

        return [
          {
            id: item.id,
            title: item.title,
            workspace: item.workspace,
            client: item.client,
            project: item.project,
            contentType: item.contentType,
            channel: item.channel,
            owner: item.owner ?? 'Disele',
            goal: item.goal ?? '',
            audience: item.audience ?? '',
            cta: item.cta ?? '',
            priority: item.priority ?? 'Medium',
            status: item.status,
          },
          ...current,
        ];
      });
    }

    if (item.entityType === 'research') {
      setResearchItems((current) =>
        current.map((entry) =>
          entry.id === item.id
            ? {
                ...entry,
                topic: item.title,
                workspace: item.workspace,
                client: item.client,
                project: item.project,
                contentType: item.contentType,
                channel: item.channel,
                owner: item.owner ?? entry.owner,
                source: item.source ?? entry.source,
                focus: item.focus ?? entry.focus,
                nextAction: item.nextAction ?? entry.nextAction,
              }
            : entry,
        ),
      );
    }

    if (item.entityType === 'record') {
      setRecordItems((current) =>
        current.map((entry) =>
          entry.id === item.id
            ? {
                ...entry,
                title: item.title,
                workspace: item.workspace,
                client: item.client,
                project: item.project,
                contentType: item.contentType,
                channel: item.channel,
                owner: item.owner ?? entry.owner,
                priority: item.priority ?? entry.priority,
                status: item.status,
                dueDate: item.dueDate ?? entry.dueDate,
                publishDate: item.publishDate ?? entry.publishDate,
              }
            : entry,
        ),
      );
    }

    if (item.entityType === 'calendar') {
      setCalendarItems((current) =>
        current.map((entry) =>
          entry.id === item.id
            ? {
                ...entry,
                title: item.title,
                workspace: item.workspace,
                client: item.client,
                project: item.project,
                contentType: item.contentType,
                channel: item.channel,
                priority: item.priority ?? entry.priority,
                status: item.status,
                day: item.calendarDay ?? entry.day,
                date: item.calendarDate ?? entry.date,
              }
            : entry,
        ),
      );
    }

    setSelectedItem(item);
  }, []);

  const value = useMemo<StudioContentContextValue>(
    () => ({
      filters,
      setFilter,
      resetFilters,
      selectedItem,
      openDetail,
      closeDetail,
      saveDetail,
      composerKind,
      openComposer,
      closeComposer,
      createIdea,
      createResearch,
      createCalendarEntry,
      convertResearchToIdea,
      promoteIdeaToBrief,
      sendIdeaToPipeline,
      scheduleRecord,
      ideaItems,
      researchItems,
      recordItems,
      calendarItems,
    }),
    [
      calendarItems,
      closeComposer,
      closeDetail,
      composerKind,
      convertResearchToIdea,
      createCalendarEntry,
      createIdea,
      createResearch,
      filters,
      ideaItems,
      openComposer,
      openDetail,
      promoteIdeaToBrief,
      recordItems,
      researchItems,
      resetFilters,
      scheduleRecord,
      saveDetail,
      sendIdeaToPipeline,
      selectedItem,
      setFilter,
    ],
  );

  return <StudioContentContext.Provider value={value}>{children}</StudioContentContext.Provider>;
}

export function useStudioContent() {
  const context = useContext(StudioContentContext);

  if (!context) {
    throw new Error('useStudioContent must be used within StudioContentProvider');
  }

  return context;
}

const allValuePattern = /^all\b/i;

function matchesFilter(selected: string, value?: string) {
  if (allValuePattern.test(selected)) {
    return true;
  }

  if (!value || value === '-') {
    return false;
  }

  return value === selected;
}

export function matchesContentFilters(
  item: Pick<ContentDetailItem, 'workspace' | 'client' | 'project' | 'contentType' | 'status' | 'channel'>,
  filters: ContentFilterState,
) {
  return (
    matchesFilter(filters.workspace, item.workspace) &&
    matchesFilter(filters.client, item.client) &&
    matchesFilter(filters.project, item.project) &&
    matchesFilter(filters.contentType, item.contentType) &&
    matchesFilter(filters.status, item.status) &&
    matchesFilter(filters.channel, item.channel)
  );
}
