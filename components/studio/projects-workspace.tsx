'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CalendarRange,
  CheckCircle2,
  FolderKanban,
  Pencil,
  UploadCloud,
  X,
} from 'lucide-react';
import {
  projectBlockers,
  projectBoard,
  projectClientActivity,
  projectMetrics,
  projectRows,
  studioProjectTabs,
  type CrmHandoffRecord,
  type ProjectRecord,
  type StudioMetric,
} from '@/lib/dashboard-data';
import {
  type StudioTableColumn,
  StudioDataTable,
  StudioMetricCard,
  StudioPageHeader,
  StudioPanel,
  StudioStatusPill,
} from '@/components/studio/primitives';
import {
  type WorkflowProjectRecord,
  useStudioWorkflow,
} from '@/components/studio/studio-workflow-state';

type ProjectTableRow = ProjectRecord & {
  rowId: string;
  kind: 'handoff' | 'active' | 'seed';
  sourceHandoffId?: string;
  owner?: string;
  email?: string;
  notes?: string;
  startedAt?: string;
};

function makeId(prefix: string, ...parts: string[]) {
  return [prefix, ...parts]
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function asProjectDraft(handoff: CrmHandoffRecord): WorkflowProjectRecord {
  return {
    id: `project-${handoff.id ?? makeId('project', handoff.client, handoff.business)}`,
    sourceHandoffId: handoff.id,
    project: handoff.business,
    client: handoff.client,
    phase: 'Kickoff',
    deadline: 'TBD',
    value: handoff.budget ?? '-',
    health: 'On track',
    owner: handoff.owner,
    email: handoff.email,
    notes: handoff.notes ?? handoff.summary,
    startedAt: 'Today',
  };
}

export function StudioProjectsWorkspace() {
  const {
    projectHandoffs,
    activeProjects,
    activateProjectFromHandoff,
    updateActiveProject,
  } = useStudioWorkflow();
  const [selectedRow, setSelectedRow] = useState<ProjectTableRow | null>(null);

  const intakeRows: ProjectTableRow[] = projectHandoffs.map((handoff) => ({
    rowId: handoff.id ?? makeId('handoff', handoff.client, handoff.business),
    kind: 'handoff',
    sourceHandoffId: handoff.id,
    project: handoff.business,
    client: handoff.client,
    phase: 'Intake',
    deadline: handoff.createdAt ?? 'Today',
    value: handoff.budget ?? '-',
    health: handoff.stage,
    owner: handoff.owner,
    email: handoff.email,
    notes: handoff.notes ?? handoff.summary,
    startedAt: handoff.createdAt,
  }));

  const activeRows: ProjectTableRow[] = activeProjects.map((project) => ({
    rowId: project.id,
    kind: 'active',
    sourceHandoffId: project.sourceHandoffId,
    project: project.project,
    client: project.client,
    phase: project.phase,
    deadline: project.deadline,
    value: project.value,
    health: project.health,
    owner: project.owner,
    email: project.email,
    notes: project.notes,
    startedAt: project.startedAt,
  }));

  const seedRows: ProjectTableRow[] = projectRows.map((row) => ({
    rowId: makeId('seed-project', row.client, row.project),
    kind: 'seed',
    ...row,
  }));

  const liveWaitingCount = [...activeRows, ...seedRows].filter(
    (row) => row.health === 'Waiting on assets' || row.health === 'Needs scope sign-off' || row.health === 'Pending approval',
  ).length;

  const metrics: StudioMetric[] = [
    {
      ...projectMetrics[0],
      value: String(seedRows.length + activeRows.length),
      detail: `${intakeRows.length} intake item${intakeRows.length === 1 ? '' : 's'} waiting for kickoff`,
    },
    {
      label: 'Pending Kickoff',
      value: String(intakeRows.length),
      detail: intakeRows.length
        ? 'Won leads waiting to become real delivery work'
        : 'No unstarted intake in the queue',
      icon: ArrowRight,
      tone: 'accent',
      spark: [2, 3, 3, 4, 4, 5, intakeRows.length + 1],
    },
    {
      ...projectMetrics[1],
      value: String(liveWaitingCount),
      detail: 'Covers active blockers plus any kickoff still not structured',
    },
    projectMetrics[2],
  ];

  const mergedRows = [...intakeRows, ...activeRows, ...seedRows];
  const boardColumns = projectBoard.map((column) => {
    if (column.label === 'To Do') {
      return {
        ...column,
        items: [
          ...intakeRows.map((row) => `Kickoff ${row.client} - ${row.project}`),
          ...column.items,
        ],
      };
    }

    if (column.label === 'In Progress') {
      return {
        ...column,
        items: [
          ...activeRows.map((row) => `${row.client} - ${row.phase}`),
          ...column.items,
        ],
      };
    }

    return column;
  });

  const projectColumns: StudioTableColumn<ProjectTableRow>[] = [
    {
      key: 'project',
      label: 'Project',
      render: (row) => (
        <div>
          <p className="font-semibold text-white">{row.project}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#878787]">
            {row.kind === 'handoff' ? 'CRM intake' : row.kind === 'active' ? 'Live project' : 'Existing record'}
          </p>
        </div>
      ),
    },
    { key: 'client', label: 'Client', render: (row) => <span>{row.client}</span> },
    { key: 'phase', label: 'Phase', render: (row) => <span>{row.phase}</span> },
    { key: 'deadline', label: 'Deadline', render: (row) => <span className="font-mono">{row.deadline}</span> },
    { key: 'value', label: 'Value', render: (row) => <span className="font-mono text-[#FC6E20]">{row.value}</span> },
    {
      key: 'health',
      label: 'Health',
      render: (row) => (
        <StudioStatusPill
          label={row.health}
          tone={row.health === 'On track' ? 'neutral' : row.kind === 'handoff' ? 'accent' : 'muted'}
        />
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <StudioPageHeader
        eyebrow="Projects"
        title="Delivery and project execution"
        description="Track active delivery, review won-lead intake properly, and convert kickoff work into projects with enough structure to actually move."
        tabs={studioProjectTabs}
        activeTab="Active"
        actions={
          <div className="rounded-2xl border border-white/8 bg-[#151419] px-4 py-3">
            <p className="font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#878787]">Kickoff queue</p>
            <p className="mt-2 font-montserrat text-sm font-semibold text-white">
              {intakeRows.length} project intake item{intakeRows.length === 1 ? '' : 's'} waiting for review
            </p>
          </div>
        }
      />

      <section className="grid gap-4 xl:grid-cols-4">
        {metrics.map((metric) => (
          <StudioMetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.84fr_1.16fr]">
        <StudioPanel title="Kickoff from CRM" eyebrow="Review before delivery starts" icon={ArrowRight}>
          <div className="space-y-3">
            {intakeRows.length ? (
              intakeRows.map((row) => (
                <button
                  key={row.rowId}
                  type="button"
                  onClick={() => setSelectedRow(row)}
                  className="w-full rounded-[22px] border border-white/8 bg-[#151419] p-4 text-left transition hover:border-[#FC6E20]/40 hover:bg-white/[0.03]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-montserrat text-sm font-semibold text-white">{row.client}</p>
                      <p className="mt-2 text-sm text-[#878787]">{row.project}</p>
                    </div>
                    <StudioStatusPill label={row.health} tone="accent" />
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[18px] border border-white/8 bg-white/5 p-3">
                      <p className="font-montserrat text-[11px] uppercase tracking-[0.16em] text-[#878787]">Budget</p>
                      <p className="mt-2 font-mono text-sm text-[#FC6E20]">{row.value}</p>
                    </div>
                    <div className="rounded-[18px] border border-white/8 bg-white/5 p-3">
                      <p className="font-montserrat text-[11px] uppercase tracking-[0.16em] text-[#878787]">Owner</p>
                      <p className="mt-2 text-sm text-white">{row.owner ?? 'Delite'}</p>
                    </div>
                  </div>
                  {row.notes ? (
                    <p className="mt-4 text-sm leading-6 text-[#878787]">{row.notes}</p>
                  ) : null}
                </button>
              ))
            ) : (
              <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.02] p-5">
                <p className="font-montserrat text-sm text-[#878787]">
                  No new project handoffs yet. Won leads from CRM will land here automatically.
                </p>
              </div>
            )}
          </div>
          <Link
            href="/studio/crm"
            className="mt-4 inline-flex min-h-12 items-center rounded-2xl border border-white/8 bg-white/5 px-4 font-montserrat text-sm font-semibold text-white transition hover:border-[#FC6E20] hover:text-[#FC6E20]"
          >
            Open CRM
          </Link>
        </StudioPanel>

        <StudioPanel title="Project register" eyebrow="Live delivery plus new activations" icon={FolderKanban}>
          <StudioDataTable
            columns={projectColumns}
            rows={mergedRows}
            onRowClick={(row) => setSelectedRow(row)}
            getRowKey={(row) => row.rowId}
            emptyMessage="No projects or intake records are available."
          />
        </StudioPanel>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <StudioPanel title="Delivery board" eyebrow="Work by status" icon={CalendarRange}>
          <div className="grid gap-4">
            {boardColumns.map((column) => (
              <div key={column.label} className="rounded-[24px] border border-white/8 bg-[#151419] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-montserrat text-sm font-semibold text-white">{column.label}</p>
                  <StudioStatusPill label={String(column.items.length)} tone="muted" />
                </div>
                <div className="mt-4 space-y-3">
                  {column.items.map((item) => (
                    <div key={`${column.label}-${item}`} className="rounded-[18px] border border-white/8 bg-white/5 p-3">
                      <p className="font-montserrat text-sm text-white">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </StudioPanel>

        <div className="space-y-5">
          <StudioPanel title="Blockers" eyebrow="Needs resolution" icon={AlertCircle}>
            <div className="space-y-3">
              {projectBlockers.map((item) => (
                <div key={`${item.time}-${item.title}`} className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-montserrat text-sm font-semibold text-white">{item.title}</p>
                      <p className="mt-2 font-montserrat text-sm text-[#878787]">{item.meta}</p>
                    </div>
                    <StudioStatusPill label={item.time} tone="accent" />
                  </div>
                </div>
              ))}
            </div>
          </StudioPanel>

          <StudioPanel title="Client activity summary" eyebrow="Recent project movement" icon={UploadCloud}>
            <div className="space-y-3">
              {projectClientActivity.map((item) => (
                <div key={`${item.time}-${item.title}`} className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-montserrat text-sm font-semibold text-white">{item.title}</p>
                      <p className="mt-2 font-montserrat text-sm text-[#878787]">{item.meta}</p>
                    </div>
                    <span className="font-mono text-xs text-[#878787]">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </StudioPanel>
        </div>
      </section>

      {selectedRow ? (
        <ProjectKickoffDrawer
          key={selectedRow.rowId}
          row={selectedRow}
          sourceHandoff={projectHandoffs.find((handoff) => handoff.id === selectedRow.sourceHandoffId) ?? null}
          onClose={() => setSelectedRow(null)}
          onActivate={(project) => {
            if (selectedRow.sourceHandoffId) {
              activateProjectFromHandoff(selectedRow.sourceHandoffId, project);
              setSelectedRow(null);
            }
          }}
          onSaveProject={(project) => {
            updateActiveProject(project);
            setSelectedRow((current) =>
              current
                ? {
                    ...current,
                    kind: 'active',
                    project: project.project,
                    client: project.client,
                    phase: project.phase,
                    deadline: project.deadline,
                    value: project.value,
                    health: project.health,
                    owner: project.owner,
                    email: project.email,
                    notes: project.notes,
                    startedAt: project.startedAt,
                  }
                : current,
            );
          }}
        />
      ) : null}
    </div>
  );
}

function ProjectKickoffDrawer({
  row,
  sourceHandoff,
  onClose,
  onActivate,
  onSaveProject,
}: {
  row: ProjectTableRow;
  sourceHandoff: CrmHandoffRecord | null;
  onClose: () => void;
  onActivate: (project: WorkflowProjectRecord) => void;
  onSaveProject: (project: WorkflowProjectRecord) => void;
}) {
  const [editing, setEditing] = useState(row.kind !== 'seed');
  const [draft, setDraft] = useState<WorkflowProjectRecord>(() =>
    row.kind === 'active'
      ? {
          id: row.rowId,
          sourceHandoffId: row.sourceHandoffId,
          project: row.project,
          client: row.client,
          phase: row.phase,
          deadline: row.deadline,
          value: row.value,
          health: row.health,
          owner: row.owner ?? 'Delite',
          email: row.email,
          notes: row.notes,
          startedAt: row.startedAt ?? 'Today',
        }
      : asProjectDraft(sourceHandoff ?? {
          id: row.sourceHandoffId,
          type: 'Project',
          client: row.client,
          business: row.project,
          owner: row.owner ?? 'Delite',
          stage: row.health,
          summary: row.notes ?? '',
          email: row.email,
          budget: row.value,
          notes: row.notes,
          createdAt: row.startedAt ?? row.deadline,
        }),
  );

  const canActivate = row.kind === 'handoff' && !!row.sourceHandoffId;
  const canSave = row.kind === 'active';

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <aside
        className="h-full w-full max-w-[560px] overflow-y-auto border-l border-white/10 bg-[#151419] p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-montserrat text-[11px] uppercase tracking-[0.22em] text-[#FC6E20]">
              {row.kind === 'handoff' ? 'Kickoff intake' : row.kind === 'active' ? 'Active project' : 'Project record'}
            </p>
            <h3 className="mt-3 font-playfair text-4xl font-semibold text-white">{row.project}</h3>
            <p className="mt-3 text-sm leading-7 text-[#878787]">{row.client}</p>
          </div>
          <div className="flex items-center gap-2">
            {row.kind !== 'seed' ? (
              <button
                type="button"
                onClick={() => setEditing((current) => !current)}
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:border-[#FC6E20] hover:text-[#FC6E20]"
              >
                <Pencil className="h-4 w-4" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:border-[#FC6E20] hover:text-[#FC6E20]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <StudioStatusPill label={row.phase} tone={row.kind === 'handoff' ? 'accent' : 'neutral'} />
          <StudioStatusPill label={row.health} tone={row.health === 'On track' ? 'neutral' : 'accent'} />
          <StudioStatusPill label={row.value} tone="accent" />
        </div>

        {canActivate ? (
          <div className="mt-6 rounded-[24px] border border-white/8 bg-[#1B1B1E] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#FC6E20]">Kickoff decision</p>
                <p className="mt-3 text-sm leading-7 text-[#878787]">
                  Review this intake, fill in the delivery basics, then promote it into the active project register.
                </p>
              </div>
              <CheckCircle2 className="mt-1 h-5 w-5 text-[#FC6E20]" />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onActivate(draft)}
                className="inline-flex min-h-12 items-center rounded-2xl bg-[#FC6E20] px-4 font-montserrat text-sm font-semibold text-[#151419] transition hover:bg-[#e95f14]"
              >
                Start project
              </button>
            </div>
          </div>
        ) : null}

        {editing ? (
          <>
            <div className="mt-6 rounded-[24px] border border-white/8 bg-[#1B1B1E] p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Project name" value={draft.project} onChange={(value) => setDraft((current) => ({ ...current, project: value }))} />
                <Field label="Client" value={draft.client} onChange={(value) => setDraft((current) => ({ ...current, client: value }))} />
                <Field label="Phase" value={draft.phase} onChange={(value) => setDraft((current) => ({ ...current, phase: value }))} />
                <Field label="Deadline" value={draft.deadline} onChange={(value) => setDraft((current) => ({ ...current, deadline: value }))} />
                <Field label="Value" value={draft.value} onChange={(value) => setDraft((current) => ({ ...current, value: value }))} />
                <Field label="Health" value={draft.health} onChange={(value) => setDraft((current) => ({ ...current, health: value }))} />
                <Field label="Owner" value={draft.owner} onChange={(value) => setDraft((current) => ({ ...current, owner: value }))} />
                <Field label="Email" value={draft.email ?? ''} onChange={(value) => setDraft((current) => ({ ...current, email: value }))} />
                <TextAreaField label="Notes" value={draft.notes ?? ''} onChange={(value) => setDraft((current) => ({ ...current, notes: value }))} className="sm:col-span-2" />
              </div>
            </div>

            {canSave ? (
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onSaveProject(draft);
                    setEditing(false);
                  }}
                  className="inline-flex min-h-12 items-center rounded-2xl bg-[#FC6E20] px-4 font-montserrat text-sm font-semibold text-[#151419] transition hover:bg-[#e95f14]"
                >
                  Save project
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="inline-flex min-h-12 items-center rounded-2xl border border-white/8 bg-[#1B1B1E] px-4 font-montserrat text-sm font-semibold text-white transition hover:border-[#FC6E20]"
                >
                  Done editing
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <DetailCard label="Phase" value={row.phase} />
              <DetailCard label="Deadline" value={row.deadline} />
              <DetailCard label="Value" value={row.value} />
              <DetailCard label="Owner" value={row.owner ?? 'Delite'} />
            </div>

            {row.notes ? (
              <div className="mt-6 rounded-[24px] border border-white/8 bg-[#1B1B1E] p-5">
                <p className="font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#FC6E20]">Notes</p>
                <p className="mt-3 text-sm leading-7 text-[#FBFBFB]">{row.notes}</p>
              </div>
            ) : null}
          </>
        )}
      </aside>
    </div>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/8 bg-[#1B1B1E] p-4">
      <p className="font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#878787]">{label}</p>
      <p className="mt-3 font-montserrat text-sm font-semibold text-white">{value}</p>
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
      <span className="block font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#878787]">{label}</span>
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
      <span className="block font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#878787]">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="mt-2 w-full rounded-[18px] border border-white/8 bg-[#151419] px-4 py-3 font-montserrat text-sm text-white outline-none transition focus:border-[#FC6E20]"
      />
    </label>
  );
}
