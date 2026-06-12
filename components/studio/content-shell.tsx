'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { CalendarRange, Pencil, Plus, RotateCcw, X } from 'lucide-react';
import {
  contentFilters,
  studioContentTabs,
  type ContentCalendarEntry,
  type ContentDetailItem,
  type IdeaRecord,
  type ResearchRecord,
} from '@/lib/dashboard-data';
import { useStudioContent } from '@/components/studio/content-state';
import { StudioPageHeader, StudioStatusPill } from '@/components/studio/primitives';

const contentMeta: Record<string, { title: string; description: string; activeTab: string }> = {
  '/studio/content': {
    title: 'Content operations hub',
    description:
      'Manage studio content and client content in one system, from research and ideation through drafting, scheduling, publishing, and reuse.',
    activeTab: 'Overview',
  },
  '/studio/content/research': {
    title: 'Research and source intelligence',
    description:
      'Capture audience pains, keyword direction, competitor observations, AI-search questions, and source material before writing begins.',
    activeTab: 'Research',
  },
  '/studio/content/ideas': {
    title: 'Ideas and brief building',
    description:
      'Turn raw opportunities into structured briefs with clear audience, goal, CTA, channel, and priority before they enter production.',
    activeTab: 'Ideas',
  },
  '/studio/content/pipeline': {
    title: 'Production pipeline',
    description:
      'Run the full content workflow across internal and client work, from early-stage thinking through scheduled, published, and repurpose-ready pieces.',
    activeTab: 'Pipeline',
  },
  '/studio/content/calendar': {
    title: '30-day schedule and publishing view',
    description:
      'See what is scheduled, what is unscheduled, and where internal or client publishing commitments are clustering across the next month.',
    activeTab: 'Calendar',
  },
  '/studio/content/library': {
    title: 'Content types and reusable systems',
    description:
      'Keep repeatable content formats, templates, CTA patterns, and channel rules in one place so the team writes from systems instead of from scratch.',
    activeTab: 'Library',
  },
};

export function StudioContentShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const meta = contentMeta[pathname] ?? contentMeta['/studio/content'];
  const {
    filters,
    setFilter,
    resetFilters,
    selectedItem,
    closeDetail,
    saveDetail,
    convertResearchToIdea,
    promoteIdeaToBrief,
    sendIdeaToPipeline,
    scheduleRecord,
    composerKind,
    openComposer,
    closeComposer,
    createIdea,
    createResearch,
    createCalendarEntry,
  } = useStudioContent();

  useEffect(() => {
    closeDetail();
  }, [pathname, closeDetail]);

  return (
    <div className="space-y-5">
      <StudioPageHeader
        eyebrow="Content"
        title={meta.title}
        description={meta.description}
        tabs={studioContentTabs}
        activeTab={meta.activeTab}
        actions={
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => openComposer('idea')}
              className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#FC6E20] px-4 font-montserrat text-sm font-semibold text-[#151419] transition hover:bg-[#e95f14]"
            >
              <Plus className="h-4 w-4" />
              New item
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-white/8 bg-[#151419] px-4 font-montserrat text-sm font-semibold text-white transition hover:border-[#FC6E20] hover:text-[#FC6E20]"
            >
              <RotateCcw className="h-4 w-4" />
              Reset filters
            </button>
          </div>
        }
      />

      <section className="min-w-0 rounded-[30px] border border-white/8 bg-[#1B1B1E]/92 p-5 shadow-[0_28px_80px_rgba(0,0,0,0.34)] backdrop-blur lg:p-6">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <FilterSelect
            label="Workspace"
            value={filters.workspace}
            options={contentFilters.workspaces}
            onChange={(value) => setFilter('workspace', value)}
          />
          <FilterSelect
            label="Client"
            value={filters.client}
            options={contentFilters.clients}
            onChange={(value) => setFilter('client', value)}
          />
          <FilterSelect
            label="Project"
            value={filters.project}
            options={contentFilters.projects}
            onChange={(value) => setFilter('project', value)}
          />
          <FilterSelect
            label="Type"
            value={filters.contentType}
            options={contentFilters.contentTypes}
            onChange={(value) => setFilter('contentType', value)}
          />
          <FilterSelect
            label="Status"
            value={filters.status}
            options={contentFilters.statuses}
            onChange={(value) => setFilter('status', value)}
          />
          <FilterSelect
            label="Channel"
            value={filters.channel}
            options={contentFilters.channels}
            onChange={(value) => setFilter('channel', value)}
          />
        </div>
      </section>

      {children}

      {selectedItem ? (
        <ContentDetailDrawer
          key={selectedItem.id}
          item={selectedItem}
          onClose={closeDetail}
          onSave={saveDetail}
          onConvertResearchToIdea={convertResearchToIdea}
          onPromoteIdeaToBrief={promoteIdeaToBrief}
          onSendIdeaToPipeline={sendIdeaToPipeline}
          onScheduleRecord={scheduleRecord}
        />
      ) : null}
      {composerKind ? (
        <ContentComposerModal
          key={composerKind}
          kind={composerKind}
          onClose={closeComposer}
          onCreateIdea={createIdea}
          onCreateResearch={createResearch}
          onCreateCalendar={createCalendarEntry}
          onChangeKind={openComposer}
        />
      ) : null}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="rounded-[20px] border border-white/8 bg-[#151419] px-4 py-3 transition hover:border-[#FC6E20]/40">
      <span className="block font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#595959]">{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full appearance-none bg-transparent font-montserrat text-sm font-semibold text-white outline-none"
      >
        {options.map((option) => (
          <option key={`${label}-${option}`} value={option} className="bg-[#151419] text-white">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function ContentDetailDrawer({
  item,
  onClose,
  onSave,
  onConvertResearchToIdea,
  onPromoteIdeaToBrief,
  onSendIdeaToPipeline,
  onScheduleRecord,
}: {
  item: ContentDetailItem | null;
  onClose: () => void;
  onSave: (item: ContentDetailItem) => void;
  onConvertResearchToIdea: (id: string) => void;
  onPromoteIdeaToBrief: (id: string) => void;
  onSendIdeaToPipeline: (id: string) => void;
  onScheduleRecord: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ContentDetailItem | null>(item);

  if (!item || !draft) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <aside
        className="h-full w-full max-w-[560px] overflow-y-auto border-l border-white/10 bg-[#151419] p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-montserrat text-[11px] uppercase tracking-[0.22em] text-[#FC6E20]">{item.kind}</p>
            <h3 className="mt-3 font-playfair text-4xl font-semibold text-white">{item.title}</h3>
            {item.summary ? (
              <p className="mt-3 font-montserrat text-sm leading-7 text-[#595959]">{item.summary}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {item.editable ? (
              <button
                type="button"
                onClick={() => setEditing((current) => !current)}
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:border-[#FC6E20] hover:text-[#FC6E20]"
              >
                <Pencil className="h-4 w-4" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:border-[#FC6E20] hover:text-[#FC6E20]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <StudioStatusPill label={draft.workspace} tone={draft.workspace === 'Kreative Reflow' ? 'accent' : 'neutral'} />
          <StudioStatusPill label={draft.status} tone={draft.status === 'Scheduled' || draft.status === 'Ready' || draft.status === 'Approved' ? 'accent' : 'muted'} />
          <StudioStatusPill label={draft.contentType} tone="muted" />
          <StudioStatusPill label={draft.channel} tone="muted" />
        </div>

        {!editing ? (
          <div className="mt-5 flex flex-wrap gap-3">
            {item.entityType === 'research' ? (
              <button
                type="button"
                onClick={() => onConvertResearchToIdea(item.id)}
                className="inline-flex min-h-12 items-center rounded-2xl bg-[#FC6E20] px-4 font-montserrat text-sm font-semibold text-[#151419] transition hover:bg-[#e95f14]"
              >
                Convert to idea
              </button>
            ) : null}
            {item.entityType === 'idea' && item.status !== 'Brief' ? (
              <button
                type="button"
                onClick={() => onPromoteIdeaToBrief(item.id)}
                className="inline-flex min-h-12 items-center rounded-2xl bg-[#FC6E20] px-4 font-montserrat text-sm font-semibold text-[#151419] transition hover:bg-[#e95f14]"
              >
                Promote to brief
              </button>
            ) : null}
            {item.entityType === 'idea' ? (
              <button
                type="button"
                onClick={() => onSendIdeaToPipeline(item.id)}
                className="inline-flex min-h-12 items-center rounded-2xl border border-white/8 bg-[#1B1B1E] px-4 font-montserrat text-sm font-semibold text-white transition hover:border-[#FC6E20] hover:text-[#FC6E20]"
              >
                Send to pipeline
              </button>
            ) : null}
            {item.entityType === 'record' && item.status !== 'Scheduled' ? (
              <button
                type="button"
                onClick={() => onScheduleRecord(item.id)}
                className="inline-flex min-h-12 items-center rounded-2xl bg-[#FC6E20] px-4 font-montserrat text-sm font-semibold text-[#151419] transition hover:bg-[#e95f14]"
              >
                Schedule item
              </button>
            ) : null}
          </div>
        ) : null}

        {editing ? (
          <>
            <div className="mt-6 rounded-[24px] border border-white/8 bg-[#1B1B1E] p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Title" value={draft.title} onChange={(value) => setDraft((current) => (current ? { ...current, title: value } : current))} className="sm:col-span-2" />
                <Field label="Workspace" value={draft.workspace} onChange={(value) => setDraft((current) => (current ? { ...current, workspace: value } : current))} />
                <Field label="Client" value={draft.client} onChange={(value) => setDraft((current) => (current ? { ...current, client: value } : current))} />
                <Field label="Project" value={draft.project} onChange={(value) => setDraft((current) => (current ? { ...current, project: value } : current))} />
                <Field label="Type" value={draft.contentType} onChange={(value) => setDraft((current) => (current ? { ...current, contentType: value } : current))} />
                <Field label="Channel" value={draft.channel} onChange={(value) => setDraft((current) => (current ? { ...current, channel: value } : current))} />
                <Field label="Status" value={draft.status} onChange={(value) => setDraft((current) => (current ? { ...current, status: value } : current))} />
                <Field label="Priority" value={draft.priority ?? ''} onChange={(value) => setDraft((current) => (current ? { ...current, priority: value } : current))} />
                <Field label="Owner" value={draft.owner ?? ''} onChange={(value) => setDraft((current) => (current ? { ...current, owner: value } : current))} />
                {draft.entityType === 'record' ? (
                  <>
                    <Field label="Due date" value={draft.dueDate ?? ''} onChange={(value) => setDraft((current) => (current ? { ...current, dueDate: value } : current))} />
                    <Field label="Publish date" value={draft.publishDate ?? ''} onChange={(value) => setDraft((current) => (current ? { ...current, publishDate: value } : current))} />
                  </>
                ) : null}
                {draft.entityType === 'calendar' ? (
                  <>
                    <Field label="Day" value={draft.calendarDay ?? ''} onChange={(value) => setDraft((current) => (current ? { ...current, calendarDay: value } : current))} />
                    <Field label="Date" value={draft.calendarDate ?? ''} onChange={(value) => setDraft((current) => (current ? { ...current, calendarDate: value } : current))} />
                  </>
                ) : null}
                {draft.entityType === 'idea' ? (
                  <>
                    <TextAreaField label="Goal" value={draft.goal ?? ''} onChange={(value) => setDraft((current) => (current ? { ...current, goal: value } : current))} className="sm:col-span-2" />
                    <TextAreaField label="Audience" value={draft.audience ?? ''} onChange={(value) => setDraft((current) => (current ? { ...current, audience: value } : current))} />
                    <TextAreaField label="CTA" value={draft.cta ?? ''} onChange={(value) => setDraft((current) => (current ? { ...current, cta: value } : current))} />
                  </>
                ) : null}
                {draft.entityType === 'research' ? (
                  <>
                    <Field label="Source" value={draft.source ?? ''} onChange={(value) => setDraft((current) => (current ? { ...current, source: value } : current))} />
                    <TextAreaField label="Focus" value={draft.focus ?? ''} onChange={(value) => setDraft((current) => (current ? { ...current, focus: value } : current))} />
                    <TextAreaField label="Next action" value={draft.nextAction ?? ''} onChange={(value) => setDraft((current) => (current ? { ...current, nextAction: value } : current))} className="sm:col-span-2" />
                  </>
                ) : null}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  onSave(draft);
                  setEditing(false);
                }}
                className="inline-flex min-h-12 items-center rounded-2xl bg-[#FC6E20] px-4 font-montserrat text-sm font-semibold text-[#151419] transition hover:bg-[#e95f14]"
              >
                Save changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraft(item);
                  setEditing(false);
                }}
                className="inline-flex min-h-12 items-center rounded-2xl border border-white/8 bg-[#1B1B1E] px-4 font-montserrat text-sm font-semibold text-white transition hover:border-[#FC6E20]"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <DetailCard label="Client" value={item.client} />
              <DetailCard label="Project" value={item.project} />
              <DetailCard label="Priority" value={item.priority ?? '-'} />
              <DetailCard label="Owner" value={item.owner ?? '-'} />
              <DetailCard label="Due date" value={item.dueDate ?? '-'} />
              <DetailCard label="Publish date" value={item.publishDate ?? '-'} />
            </div>

            <div className="mt-6 space-y-4">
              {item.goal ? <NarrativeBlock title="Goal" body={item.goal} /> : null}
              {item.audience ? <NarrativeBlock title="Audience" body={item.audience} /> : null}
              {item.cta ? <NarrativeBlock title="CTA" body={item.cta} /> : null}
              {item.source ? <NarrativeBlock title="Source" body={item.source} /> : null}
              {item.focus ? <NarrativeBlock title="Focus" body={item.focus} /> : null}
              {item.nextAction ? <NarrativeBlock title="Next action" body={item.nextAction} /> : null}
            </div>

            {item.notes?.length ? (
              <div className="mt-6 rounded-[24px] border border-white/8 bg-[#1B1B1E] p-5">
                <div className="flex items-center gap-3">
                  <CalendarRange className="h-4 w-4 text-[#FC6E20]" />
                  <p className="font-montserrat text-sm font-semibold text-white">Notes</p>
                </div>
                <div className="mt-4 space-y-3">
                  {item.notes.map((note) => (
                    <div key={note} className="rounded-[18px] border border-white/8 bg-[#151419] p-4">
                      <p className="font-montserrat text-sm leading-7 text-[#FBFBFB]">{note}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </>
        )}
      </aside>
    </div>
  );
}

function ContentComposerModal({
  kind,
  onClose,
  onCreateIdea,
  onCreateResearch,
  onCreateCalendar,
  onChangeKind,
}: {
  kind: 'idea' | 'research' | 'calendar' | null;
  onClose: () => void;
  onCreateIdea: (item: Omit<IdeaRecord, 'id'>) => void;
  onCreateResearch: (item: Omit<ResearchRecord, 'id'>) => void;
  onCreateCalendar: (item: Omit<ContentCalendarEntry, 'id'> & { owner?: string }) => void;
  onChangeKind: (kind: 'idea' | 'research' | 'calendar') => void;
}) {
  const [ideaDraft, setIdeaDraft] = useState({
    title: '',
    workspace: 'Kreative Reflow',
    client: '-',
    project: 'Insights',
    contentType: 'Insight',
    channel: 'Blog',
    owner: 'Delite',
    goal: '',
    audience: '',
    cta: '',
    priority: 'Medium',
    status: 'Idea',
  });
  const [researchDraft, setResearchDraft] = useState({
    topic: '',
    workspace: 'Kreative Reflow',
    client: '-',
    project: 'Insights',
    contentType: 'Insight',
    channel: 'Blog',
    owner: 'Delite',
    source: '',
    focus: '',
    nextAction: '',
  });
  const [calendarDraft, setCalendarDraft] = useState({
    day: 'Mon',
    date: 'Jul 15',
    title: '',
    workspace: 'Kreative Reflow',
    client: '-',
    project: 'Insights',
    contentType: 'Insight',
    channel: 'Blog',
    priority: 'Medium',
    status: 'Scheduled',
    owner: 'Delite',
  });

  if (!kind) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-3xl rounded-[32px] border border-white/10 bg-[#151419] p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-montserrat text-[11px] uppercase tracking-[0.22em] text-[#FC6E20]">Quick capture</p>
            <h3 className="mt-3 font-playfair text-4xl font-semibold text-white">Create a new content item</h3>
            <p className="mt-3 max-w-2xl font-montserrat text-sm leading-7 text-[#595959]">
              Capture the next worthwhile thing before it gets lost: research, ideas, or something ready to schedule.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:border-[#FC6E20] hover:text-[#FC6E20]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {(['idea', 'research', 'calendar'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onChangeKind(option)}
              className={`rounded-full border px-4 py-2 font-montserrat text-sm transition ${
                option === kind
                  ? 'border-[#FC6E20] bg-[#FC6E20] text-[#151419]'
                  : 'border-white/8 bg-white/5 text-white'
              }`}
            >
              {option === 'idea' ? 'Idea' : option === 'research' ? 'Research note' : 'Scheduled item'}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-[24px] border border-white/8 bg-[#1B1B1E] p-5">
          {kind === 'idea' ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title" value={ideaDraft.title} onChange={(value) => setIdeaDraft((current) => ({ ...current, title: value }))} className="sm:col-span-2" />
              <Field label="Workspace" value={ideaDraft.workspace} onChange={(value) => setIdeaDraft((current) => ({ ...current, workspace: value }))} />
              <Field label="Client" value={ideaDraft.client} onChange={(value) => setIdeaDraft((current) => ({ ...current, client: value }))} />
              <Field label="Project" value={ideaDraft.project} onChange={(value) => setIdeaDraft((current) => ({ ...current, project: value }))} />
              <Field label="Type" value={ideaDraft.contentType} onChange={(value) => setIdeaDraft((current) => ({ ...current, contentType: value }))} />
              <Field label="Channel" value={ideaDraft.channel} onChange={(value) => setIdeaDraft((current) => ({ ...current, channel: value }))} />
              <Field label="Owner" value={ideaDraft.owner} onChange={(value) => setIdeaDraft((current) => ({ ...current, owner: value }))} />
              <Field label="Priority" value={ideaDraft.priority} onChange={(value) => setIdeaDraft((current) => ({ ...current, priority: value }))} />
              <TextAreaField label="Goal" value={ideaDraft.goal} onChange={(value) => setIdeaDraft((current) => ({ ...current, goal: value }))} className="sm:col-span-2" />
              <TextAreaField label="Audience" value={ideaDraft.audience} onChange={(value) => setIdeaDraft((current) => ({ ...current, audience: value }))} />
              <TextAreaField label="CTA" value={ideaDraft.cta} onChange={(value) => setIdeaDraft((current) => ({ ...current, cta: value }))} />
            </div>
          ) : null}

          {kind === 'research' ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Topic" value={researchDraft.topic} onChange={(value) => setResearchDraft((current) => ({ ...current, topic: value }))} className="sm:col-span-2" />
              <Field label="Workspace" value={researchDraft.workspace} onChange={(value) => setResearchDraft((current) => ({ ...current, workspace: value }))} />
              <Field label="Client" value={researchDraft.client} onChange={(value) => setResearchDraft((current) => ({ ...current, client: value }))} />
              <Field label="Project" value={researchDraft.project} onChange={(value) => setResearchDraft((current) => ({ ...current, project: value }))} />
              <Field label="Type" value={researchDraft.contentType} onChange={(value) => setResearchDraft((current) => ({ ...current, contentType: value }))} />
              <Field label="Channel" value={researchDraft.channel} onChange={(value) => setResearchDraft((current) => ({ ...current, channel: value }))} />
              <Field label="Owner" value={researchDraft.owner} onChange={(value) => setResearchDraft((current) => ({ ...current, owner: value }))} />
              <Field label="Source" value={researchDraft.source} onChange={(value) => setResearchDraft((current) => ({ ...current, source: value }))} />
              <TextAreaField label="Focus" value={researchDraft.focus} onChange={(value) => setResearchDraft((current) => ({ ...current, focus: value }))} />
              <TextAreaField label="Next action" value={researchDraft.nextAction} onChange={(value) => setResearchDraft((current) => ({ ...current, nextAction: value }))} className="sm:col-span-2" />
            </div>
          ) : null}

          {kind === 'calendar' ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title" value={calendarDraft.title} onChange={(value) => setCalendarDraft((current) => ({ ...current, title: value }))} className="sm:col-span-2" />
              <Field label="Day" value={calendarDraft.day} onChange={(value) => setCalendarDraft((current) => ({ ...current, day: value }))} />
              <Field label="Date" value={calendarDraft.date} onChange={(value) => setCalendarDraft((current) => ({ ...current, date: value }))} />
              <Field label="Workspace" value={calendarDraft.workspace} onChange={(value) => setCalendarDraft((current) => ({ ...current, workspace: value }))} />
              <Field label="Client" value={calendarDraft.client} onChange={(value) => setCalendarDraft((current) => ({ ...current, client: value }))} />
              <Field label="Project" value={calendarDraft.project} onChange={(value) => setCalendarDraft((current) => ({ ...current, project: value }))} />
              <Field label="Type" value={calendarDraft.contentType} onChange={(value) => setCalendarDraft((current) => ({ ...current, contentType: value }))} />
              <Field label="Channel" value={calendarDraft.channel} onChange={(value) => setCalendarDraft((current) => ({ ...current, channel: value }))} />
              <Field label="Owner" value={calendarDraft.owner} onChange={(value) => setCalendarDraft((current) => ({ ...current, owner: value }))} />
              <Field label="Priority" value={calendarDraft.priority} onChange={(value) => setCalendarDraft((current) => ({ ...current, priority: value }))} />
            </div>
          ) : null}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              if (kind === 'idea' && ideaDraft.title.trim()) {
                onCreateIdea(ideaDraft);
              }
              if (kind === 'research' && researchDraft.topic.trim()) {
                onCreateResearch(researchDraft);
              }
              if (kind === 'calendar' && calendarDraft.title.trim()) {
                onCreateCalendar(calendarDraft);
              }
              onClose();
            }}
            className="inline-flex min-h-12 items-center rounded-2xl bg-[#FC6E20] px-4 font-montserrat text-sm font-semibold text-[#151419] transition hover:bg-[#e95f14]"
          >
            Create item
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-12 items-center rounded-2xl border border-white/8 bg-[#1B1B1E] px-4 font-montserrat text-sm font-semibold text-white transition hover:border-[#FC6E20]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-[#1B1B1E] p-4">
      <p className="font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#595959]">{label}</p>
      <p className="mt-3 font-montserrat text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function NarrativeBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[24px] border border-white/8 bg-[#1B1B1E] p-5">
      <p className="font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#FC6E20]">{title}</p>
      <p className="mt-3 font-montserrat text-sm leading-7 text-[#FBFBFB]">{body}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="block font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#595959]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-[18px] border border-white/8 bg-[#151419] px-4 py-3 font-montserrat text-sm text-white outline-none transition focus:border-[#FC6E20]"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="block font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#595959]">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="mt-2 w-full rounded-[18px] border border-white/8 bg-[#151419] px-4 py-3 font-montserrat text-sm text-white outline-none transition focus:border-[#FC6E20]"
      />
    </label>
  );
}
