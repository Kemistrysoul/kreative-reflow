'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarRange,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  FolderKanban,
  Inbox,
  MessageSquareText,
  Pencil,
  Plus,
  Route,
  Target,
  Users2,
  X,
} from 'lucide-react';
import {
  crmFollowUps,
  crmLeads,
  studioCrmTabs,
  type CrmHandoffRecord,
  type LeadRecord,
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
import { useStudioWorkflow } from '@/components/studio/studio-workflow-state';

const stageOrder = ['New', 'Contacted', 'Discovery call', 'Proposal sent', 'Won'] as const;

type CrmStage = (typeof stageOrder)[number];
type CrmView = 'Pipeline' | 'Leads' | 'Follow-ups';

const initialDraft = {
  name: '',
  business: '',
  email: '',
  source: 'Website',
  requestedService: '',
  budget: 'R18k',
  stage: 'New' as CrmStage,
  nextAction: 'Send first response',
  owner: 'Delite',
  lastTouch: 'Today',
  notes: '',
};

function makeId(prefix: string, ...parts: string[]) {
  return [prefix, ...parts]
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeLead(lead: LeadRecord): LeadRecord {
  return {
    ...lead,
    id: lead.id ?? makeId('lead', lead.business, lead.name),
  };
}

function parseBudgetValue(value: string) {
  const normalized = value.toLowerCase().replace(/,/g, '').trim();
  const digits = Number.parseFloat(normalized.replace(/[^0-9.]/g, ''));

  if (Number.isNaN(digits)) {
    return 0;
  }

  if (normalized.includes('m')) {
    return digits * 1_000_000;
  }

  if (normalized.includes('k')) {
    return digits * 1_000;
  }

  return digits;
}

function formatCurrencyShort(value: number) {
  if (value >= 1_000_000) {
    return `R${(value / 1_000_000).toFixed(1)}m`;
  }

  if (value >= 1_000) {
    return `R${Math.round(value / 1_000)}k`;
  }

  return `R${value}`;
}

function stageIndex(stage: string) {
  return stageOrder.findIndex((item) => item === stage);
}

function defaultNextAction(stage: CrmStage) {
  switch (stage) {
    case 'New':
      return 'Send first response';
    case 'Contacted':
      return 'Book discovery call';
    case 'Discovery call':
      return 'Draft scope summary';
    case 'Proposal sent':
      return 'Follow up on proposal';
    case 'Won':
      return 'Create project or content handoff';
    default:
      return 'Review next step';
  }
}

export function StudioCrmWorkspace({ openIntake = false }: { openIntake?: boolean }) {
  const router = useRouter();
  const [activeView, setActiveView] = useState<CrmView>('Pipeline');
  const [leadItems, setLeadItems] = useState<LeadRecord[]>(crmLeads.map(normalizeLead));
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [intakeOpen, setIntakeOpen] = useState(false);
  const {
    projectHandoffs,
    contentHandoffs,
    queueProjectHandoff,
    queueContentHandoff,
  } = useStudioWorkflow();
  const isIntakeOpen = intakeOpen || openIntake;

  function closeIntake() {
    setIntakeOpen(false);

    if (openIntake) {
      router.replace('/studio/crm', { scroll: false });
    }
  }

  const selectedLead = useMemo(
    () => leadItems.find((lead) => lead.id === selectedLeadId) ?? null,
    [leadItems, selectedLeadId],
  );

  const metrics = useMemo<StudioMetric[]>(() => {
    const discoveryCount = leadItems.filter((lead) => lead.stage === 'Discovery call').length;
    const proposalLeads = leadItems.filter((lead) => lead.stage === 'Proposal sent');
    const wonCount = leadItems.filter((lead) => lead.stage === 'Won').length;
    const proposalValue = proposalLeads.reduce((sum, lead) => sum + parseBudgetValue(lead.budget), 0);
    const handoffCount = projectHandoffs.length + contentHandoffs.length;

    return [
      {
        label: 'Leads In Motion',
        value: String(leadItems.length),
        detail: `${leadItems.filter((lead) => lead.stage === 'New' || lead.stage === 'Contacted').length} still in early qualification`,
        icon: Inbox,
        tone: 'accent',
        spark: [14, 16, 18, 19, 21, 23, leadItems.length + 12],
      },
      {
        label: 'Discovery Calls',
        value: String(discoveryCount),
        detail: `${leadItems.filter((lead) => lead.stage === 'Contacted').length} leads are one step behind`,
        icon: CalendarRange,
        tone: 'neutral',
        spark: [6, 8, 9, 10, 11, 12, discoveryCount + 8],
      },
      {
        label: 'Open Proposals',
        value: String(proposalLeads.length),
        detail: `${formatCurrencyShort(proposalValue)} combined value`,
        icon: CircleDollarSign,
        tone: 'neutral',
        spark: [8, 9, 10, 11, 13, 14, proposalLeads.length + 10],
      },
      {
        label: 'Won And Ready',
        value: String(wonCount),
        detail: `${handoffCount} handoffs already queued`,
        icon: CheckCircle2,
        tone: 'muted',
        spark: [2, 3, 3, 4, 4, 5, wonCount + 2],
      },
    ];
  }, [contentHandoffs.length, leadItems, projectHandoffs.length]);

  const pipeline = useMemo(
    () =>
      stageOrder.map((label) => ({
        label,
        items: leadItems.filter((lead) => lead.stage === label),
      })),
    [leadItems],
  );

  const sourceSummary = useMemo(() => {
    const total = leadItems.length || 1;
    const counts = new Map<string, number>();

    for (const lead of leadItems) {
      counts.set(lead.source, (counts.get(lead.source) ?? 0) + 1);
    }

    return Array.from(counts.entries())
      .map(([label, count]) => ({
        label,
        value: `${Math.round((count / total) * 100)}%`,
        count,
      }))
      .sort((left, right) => right.count - left.count);
  }, [leadItems]);

  const followUpQueue = useMemo(() => {
    const derived = leadItems
      .filter((lead) => lead.stage !== 'Won')
      .sort((left, right) => stageIndex(right.stage) - stageIndex(left.stage))
      .map((lead) => ({
        id: lead.id ?? makeId('lead', lead.business, lead.name),
        title: `${lead.name} - ${lead.nextAction}`,
        meta: `${lead.business} - ${lead.stage}`,
        time: lead.lastTouch ?? 'Needs update',
      }));

    return [...derived, ...crmFollowUps.map((item, index) => ({ id: `seed-followup-${index}`, ...item }))];
  }, [leadItems]);

  const readyToConvert = useMemo(() => leadItems.filter((lead) => lead.stage === 'Won'), [leadItems]);

  const projectHandoffIds = useMemo(() => new Set(projectHandoffs.map((handoff) => handoff.id)), [projectHandoffs]);
  const contentHandoffIds = useMemo(() => new Set(contentHandoffs.map((handoff) => handoff.id)), [contentHandoffs]);

  function openLead(lead: LeadRecord) {
    setSelectedLeadId(lead.id ?? makeId('lead', lead.business, lead.name));
  }

  function updateLead(leadId: string, updater: (lead: LeadRecord) => LeadRecord) {
    setLeadItems((current) => current.map((lead) => (lead.id === leadId ? updater(lead) : lead)));
  }

  function setLeadStage(leadId: string, stage: CrmStage) {
    updateLead(leadId, (lead) => ({
      ...lead,
      stage,
      lastTouch: 'Today',
    }));
  }

  function advanceLeadStage(leadId: string) {
    updateLead(leadId, (lead) => {
      const currentIndex = stageOrder.findIndex((entry) => entry === lead.stage);
      const nextStage = stageOrder[Math.min(currentIndex + 1, stageOrder.length - 1)];

      return {
        ...lead,
        stage: nextStage,
        nextAction: nextStage === lead.stage ? lead.nextAction : defaultNextAction(nextStage),
        lastTouch: 'Today',
      };
    });
  }

  function saveLead(nextLead: LeadRecord) {
    const normalized = normalizeLead(nextLead);
    updateLead(normalized.id!, () => normalized);
  }

  function createLead(draft: typeof initialDraft) {
    const nextLead: LeadRecord = {
      id: makeId('lead', draft.business, draft.name),
      name: draft.name,
      business: draft.business,
      email: draft.email,
      source: draft.source,
      requestedService: draft.requestedService,
      budget: draft.budget,
      stage: draft.stage,
      nextAction: draft.nextAction,
      owner: draft.owner,
      lastTouch: draft.lastTouch,
      notes: draft.notes,
    };

    setLeadItems((current) => [nextLead, ...current]);
    setActiveView('Leads');
    setSelectedLeadId(nextLead.id ?? null);
  }

  function createHandoff(lead: LeadRecord, type: CrmHandoffRecord['type']) {
    const handoffId = makeId('handoff', type.toLowerCase(), lead.id ?? lead.business, lead.name);
    const handoff: CrmHandoffRecord = {
      id: handoffId,
      type,
      sourceLeadId: lead.id,
      client: lead.name,
      business: lead.requestedService || lead.business,
      owner: lead.owner,
      stage: type === 'Project' ? 'Ready for project setup' : 'Ready for content intake',
      summary:
        type === 'Project'
          ? `${lead.business} is ready to move from CRM into structured delivery planning.`
          : `${lead.business} needs content discovery, briefs, and scheduling once the relationship is active.`,
      email: lead.email,
      budget: lead.budget,
      requestedService: lead.requestedService,
      notes: lead.notes,
      createdAt: 'Today',
    };

    if (type === 'Project') {
      queueProjectHandoff(handoff);
    } else {
      queueContentHandoff(handoff);
    }

    updateLead(lead.id!, (current) => ({
      ...current,
      nextAction: type === 'Project' ? 'Move into project kickoff' : 'Move into content intake',
      lastTouch: 'Today',
    }));
  }

  const leadColumns: StudioTableColumn<LeadRecord>[] = [
    {
      key: 'lead',
      label: 'Lead',
      render: (row) => (
        <div>
          <p className="font-semibold text-white">{row.name}</p>
          <p className="mt-1 text-[#595959]">{row.business}</p>
        </div>
      ),
    },
    {
      key: 'stage',
      label: 'Stage',
      render: (row) => (
        <StudioStatusPill
          label={row.stage}
          tone={row.stage === 'Won' ? 'accent' : row.stage === 'Proposal sent' ? 'neutral' : 'muted'}
        />
      ),
    },
    { key: 'source', label: 'Source', render: (row) => <span>{row.source}</span> },
    { key: 'budget', label: 'Budget', render: (row) => <span className="font-mono text-[#FC6E20]">{row.budget}</span> },
    {
      key: 'next',
      label: 'Next action',
      render: (row) => (
        <div>
          <p className="text-white">{row.nextAction}</p>
          <p className="mt-1 text-xs text-[#595959]">{row.requestedService ?? 'General enquiry'}</p>
        </div>
      ),
    },
    { key: 'owner', label: 'Owner', render: (row) => <span>{row.owner}</span> },
    {
      key: 'actions',
      label: 'Move',
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          {row.stage !== 'Won' ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                advanceLeadStage(row.id!);
              }}
              className="inline-flex min-h-10 items-center rounded-full border border-white/8 bg-white/5 px-3 font-montserrat text-xs font-semibold text-white transition hover:border-[#FC6E20] hover:text-[#FC6E20]"
            >
              Advance
            </button>
          ) : null}
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              openLead(row);
            }}
            className="inline-flex min-h-10 items-center rounded-full bg-[#FC6E20] px-3 font-montserrat text-xs font-semibold text-[#151419] transition hover:bg-[#e95f14]"
          >
            Open
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <StudioPageHeader
        eyebrow="CRM"
        title="Lead pipeline and follow-through"
        description="Track every lead from first contact to a real handoff. This page stays focused on progression, next actions, and knowing exactly when a lead becomes a project or content opportunity."
        tabs={studioCrmTabs}
        activeTab={activeView}
        onTabChange={(label) => setActiveView(label as CrmView)}
        actions={
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setIntakeOpen(true)}
              className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#FC6E20] px-4 font-montserrat text-sm font-semibold text-[#151419] transition hover:bg-[#e95f14]"
            >
              <Plus className="h-4 w-4" />
              New lead
            </button>
            <div className="rounded-2xl border border-white/8 bg-[#151419] px-4 py-3">
              <p className="font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#595959]">Current pressure</p>
              <p className="mt-2 font-montserrat text-sm font-semibold text-white">
                {readyToConvert.length} won lead{readyToConvert.length === 1 ? '' : 's'} ready for handoff
              </p>
            </div>
          </div>
        }
      />

      <section className="grid gap-4 xl:grid-cols-4">
        {metrics.map((metric) => (
          <StudioMetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      {activeView === 'Pipeline' ? (
        <section className="grid gap-5 xl:grid-cols-[1.45fr_0.85fr]">
          <StudioPanel title="Pipeline view" eyebrow="Stage board" icon={Users2}>
            <div className="grid gap-4 xl:grid-cols-5">
              {pipeline.map((stage) => (
                <div key={stage.label} className="rounded-[24px] border border-white/8 bg-[#151419] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-montserrat text-sm font-semibold text-white">{stage.label}</p>
                      <p className="mt-1 font-montserrat text-xs uppercase tracking-[0.16em] text-[#595959]">
                        {stage.items.length} records
                      </p>
                    </div>
                    <StudioStatusPill label={String(stage.items.length)} tone={stage.label === 'Won' ? 'accent' : 'muted'} />
                  </div>
                  <div className="mt-4 space-y-3">
                    {stage.items.length ? (
                      stage.items.map((lead) => (
                        <button
                          key={lead.id}
                          type="button"
                          onClick={() => openLead(lead)}
                          className="w-full rounded-[20px] border border-white/8 bg-white/5 p-4 text-left transition hover:border-[#FC6E20]/40 hover:bg-white/[0.08]"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-montserrat text-sm font-semibold text-white">{lead.name}</p>
                              <p className="mt-1 text-sm text-[#595959]">{lead.business}</p>
                            </div>
                            <span className="font-mono text-xs text-[#FC6E20]">{lead.budget}</span>
                          </div>
                          <p className="mt-3 text-xs uppercase tracking-[0.16em] text-[#595959]">{lead.requestedService}</p>
                          <p className="mt-3 text-sm text-[#F0EFED]">{lead.nextAction}</p>
                        </button>
                      ))
                    ) : (
                      <div className="rounded-[20px] border border-dashed border-white/10 bg-white/[0.02] p-4">
                        <p className="font-montserrat text-sm text-[#595959]">No leads in this stage right now.</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </StudioPanel>

          <div className="space-y-5">
            <HandoffPanel
              projectHandoffs={projectHandoffs}
              contentHandoffs={contentHandoffs}
              readyToConvert={readyToConvert}
              onOpenLead={openLead}
            />
            <StudioPanel title="Source summary" eyebrow="Channel mix" icon={Target}>
              <div className="grid gap-3">
                {sourceSummary.map((item) => (
                  <div key={item.label} className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-montserrat text-sm font-semibold text-white">{item.label}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#595959]">{item.count} leads</p>
                      </div>
                      <p className="font-playfair text-3xl text-white">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </StudioPanel>
          </div>
        </section>
      ) : null}

      {activeView === 'Leads' ? (
        <section className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
          <StudioPanel title="Lead records" eyebrow="All leads" icon={Inbox}>
            <StudioDataTable
              columns={leadColumns}
              rows={leadItems}
              onRowClick={openLead}
              getRowKey={(row) => row.id ?? makeId('lead', row.business, row.name)}
              emptyMessage="No leads captured yet. Use New lead to start the pipeline."
            />
          </StudioPanel>

          <div className="space-y-5">
            <StudioPanel title="Ready to win" eyebrow="Commercial watchlist" icon={BriefcaseBusiness}>
              <div className="space-y-3">
                {leadItems
                  .filter((lead) => lead.stage === 'Proposal sent' || lead.stage === 'Won')
                  .map((lead) => (
                    <button
                      key={lead.id}
                      type="button"
                      onClick={() => openLead(lead)}
                      className="w-full rounded-[22px] border border-white/8 bg-[#151419] p-4 text-left transition hover:border-[#FC6E20]/40"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-montserrat text-sm font-semibold text-white">{lead.name}</p>
                          <p className="mt-2 text-sm text-[#595959]">{lead.requestedService}</p>
                        </div>
                        <StudioStatusPill label={lead.stage} tone={lead.stage === 'Won' ? 'accent' : 'neutral'} />
                      </div>
                      <p className="mt-3 font-mono text-xs text-[#FC6E20]">{lead.budget}</p>
                    </button>
                  ))}
              </div>
            </StudioPanel>

            <StudioPanel title="Source summary" eyebrow="Lead quality">
              <div className="space-y-3">
                {sourceSummary.map((item) => (
                  <div key={item.label} className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-montserrat text-sm font-semibold text-white">{item.label}</p>
                        <p className="mt-2 text-sm text-[#595959]">{item.count} lead{item.count === 1 ? '' : 's'} in the current mix</p>
                      </div>
                      <p className="font-playfair text-3xl text-white">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </StudioPanel>
          </div>
        </section>
      ) : null}

      {activeView === 'Follow-ups' ? (
        <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <StudioPanel title="Follow-up queue" eyebrow="Contextual communication" icon={MessageSquareText}>
            <div className="space-y-3">
              {followUpQueue.map((item) => (
                <div key={item.id} className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-montserrat text-sm font-semibold text-white">{item.title}</p>
                      <p className="mt-2 font-montserrat text-sm text-[#595959]">{item.meta}</p>
                    </div>
                    <StudioStatusPill label={item.time} tone="muted" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-[22px] border border-white/8 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <MessageSquareText className="h-4 w-4 text-[#FC6E20]" />
                <p className="font-montserrat text-sm font-semibold text-white">Follow-up stays inside CRM on purpose</p>
              </div>
              <p className="mt-3 font-montserrat text-sm leading-6 text-[#595959]">
                These messages exist to move commercial conversations forward. They should stay attached to lead stage, requested service, and the next real decision.
              </p>
            </div>
          </StudioPanel>

          <div className="space-y-5">
            <HandoffPanel
              projectHandoffs={projectHandoffs}
              contentHandoffs={contentHandoffs}
              readyToConvert={readyToConvert}
              onOpenLead={openLead}
            />
            <StudioPanel title="Today to close" eyebrow="Priority motion" icon={ClipboardList}>
              <div className="space-y-3">
                {leadItems
                  .filter((lead) => lead.stage === 'Discovery call' || lead.stage === 'Proposal sent')
                  .map((lead) => (
                    <button
                      key={lead.id}
                      type="button"
                      onClick={() => openLead(lead)}
                      className="w-full rounded-[22px] border border-white/8 bg-[#151419] p-4 text-left transition hover:border-[#FC6E20]/40"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-montserrat text-sm font-semibold text-white">{lead.name}</p>
                          <p className="mt-2 text-sm text-[#595959]">{lead.nextAction}</p>
                        </div>
                        <ArrowRight className="mt-1 h-4 w-4 text-[#FC6E20]" />
                      </div>
                    </button>
                  ))}
              </div>
            </StudioPanel>
          </div>
        </section>
      ) : null}

      {selectedLead ? (
        <LeadDetailDrawer
          key={selectedLead.id}
          lead={selectedLead}
          projectHandoffExists={projectHandoffIds.has(makeId('handoff', 'project', selectedLead.id ?? '', selectedLead.name))}
          contentHandoffExists={contentHandoffIds.has(makeId('handoff', 'content', selectedLead.id ?? '', selectedLead.name))}
          onClose={() => setSelectedLeadId(null)}
          onSave={saveLead}
          onSetStage={setLeadStage}
          onAdvanceStage={advanceLeadStage}
          onCreateHandoff={createHandoff}
        />
      ) : null}

      {isIntakeOpen ? (
        <LeadIntakeModal
          onClose={closeIntake}
          onCreateLead={(draft) => {
            createLead(draft);
            closeIntake();
          }}
        />
      ) : null}
    </div>
  );
}

function HandoffPanel({
  projectHandoffs,
  contentHandoffs,
  readyToConvert,
  onOpenLead,
}: {
  projectHandoffs: CrmHandoffRecord[];
  contentHandoffs: CrmHandoffRecord[];
  readyToConvert: LeadRecord[];
  onOpenLead: (lead: LeadRecord) => void;
}) {
  return (
    <StudioPanel title="Won lead handoff" eyebrow="Projects and content" icon={Route}>
      <div className="space-y-4">
        <div className="rounded-[24px] border border-white/8 bg-[#151419] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-montserrat text-sm font-semibold text-white">Ready to convert</p>
              <p className="mt-2 text-sm text-[#595959]">Won leads should not stall here. Move them into the next operating system.</p>
            </div>
            <StudioStatusPill label={`${readyToConvert.length} won`} tone="accent" />
          </div>
          <div className="mt-4 space-y-3">
            {readyToConvert.length ? (
              readyToConvert.map((lead) => (
                <button
                  key={lead.id}
                  type="button"
                  onClick={() => onOpenLead(lead)}
                  className="w-full rounded-[20px] border border-white/8 bg-white/5 p-4 text-left transition hover:border-[#FC6E20]/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-montserrat text-sm font-semibold text-white">{lead.name}</p>
                      <p className="mt-1 text-sm text-[#595959]">{lead.requestedService}</p>
                    </div>
                    <span className="font-mono text-xs text-[#FC6E20]">{lead.budget}</span>
                  </div>
                </button>
              ))
            ) : (
              <p className="font-montserrat text-sm text-[#595959]">No won leads are waiting right now.</p>
            )}
          </div>
        </div>

        <HandoffQueueCard
          title="Project handoffs"
          href="/studio/projects"
          icon={FolderKanban}
          records={projectHandoffs}
        />
        <HandoffQueueCard
          title="Content handoffs"
          href="/studio/content"
          icon={BriefcaseBusiness}
          records={contentHandoffs}
        />
      </div>
    </StudioPanel>
  );
}

function HandoffQueueCard({
  title,
  href,
  icon: Icon,
  records,
}: {
  title: string;
  href: string;
  icon: typeof FolderKanban;
  records: CrmHandoffRecord[];
}) {
  return (
    <div className="rounded-[24px] border border-white/8 bg-[#151419] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-[#FC6E20]">
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <p className="font-montserrat text-sm font-semibold text-white">{title}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#595959]">{records.length} queued</p>
          </div>
        </div>
        <Link
          href={href}
          className="inline-flex min-h-10 items-center rounded-full border border-white/8 bg-white/5 px-3 font-montserrat text-xs font-semibold text-white transition hover:border-[#FC6E20] hover:text-[#FC6E20]"
        >
          Open
        </Link>
      </div>
      <div className="mt-4 space-y-3">
        {records.map((record) => (
          <div key={record.id} className="rounded-[20px] border border-white/8 bg-white/5 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-montserrat text-sm font-semibold text-white">{record.client}</p>
                <p className="mt-1 text-sm text-[#595959]">{record.business}</p>
              </div>
              <StudioStatusPill label={record.stage} tone="muted" />
            </div>
            <p className="mt-3 text-sm leading-6 text-[#F0EFED]">{record.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeadDetailDrawer({
  lead,
  projectHandoffExists,
  contentHandoffExists,
  onClose,
  onSave,
  onSetStage,
  onAdvanceStage,
  onCreateHandoff,
}: {
  lead: LeadRecord;
  projectHandoffExists: boolean;
  contentHandoffExists: boolean;
  onClose: () => void;
  onSave: (lead: LeadRecord) => void;
  onSetStage: (leadId: string, stage: CrmStage) => void;
  onAdvanceStage: (leadId: string) => void;
  onCreateHandoff: (lead: LeadRecord, type: CrmHandoffRecord['type']) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<LeadRecord>(lead);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <aside
        className="h-full w-full max-w-[560px] overflow-y-auto border-l border-white/10 bg-[#151419] p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-montserrat text-[11px] uppercase tracking-[0.22em] text-[#FC6E20]">Lead detail</p>
            <h3 className="mt-3 font-playfair text-4xl font-semibold text-white">{lead.name}</h3>
            <p className="mt-3 text-sm leading-7 text-[#595959]">{lead.business}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditing((current) => !current)}
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:border-[#FC6E20] hover:text-[#FC6E20]"
            >
              <Pencil className="h-4 w-4" />
            </button>
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
          <StudioStatusPill label={lead.stage} tone={lead.stage === 'Won' ? 'accent' : lead.stage === 'Proposal sent' ? 'neutral' : 'muted'} />
          <StudioStatusPill label={lead.source} tone="muted" />
          <StudioStatusPill label={lead.requestedService ?? 'General enquiry'} tone="muted" />
          <StudioStatusPill label={lead.budget} tone="accent" />
        </div>

        <div className="mt-6 rounded-[24px] border border-white/8 bg-[#1B1B1E] p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#595959]">Stage progression</p>
              <p className="mt-2 text-sm text-[#595959]">Move the lead deliberately. The CRM should make the next commercial action obvious.</p>
            </div>
            {lead.stage !== 'Won' ? (
              <button
                type="button"
                onClick={() => onAdvanceStage(lead.id!)}
                className="inline-flex min-h-10 items-center rounded-full bg-[#FC6E20] px-3 font-montserrat text-xs font-semibold text-[#151419] transition hover:bg-[#e95f14]"
              >
                Advance stage
              </button>
            ) : null}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {stageOrder.map((stage) => (
              <button
                key={stage}
                type="button"
                onClick={() => onSetStage(lead.id!, stage)}
                className={`rounded-full border px-3 py-2 font-montserrat text-xs font-semibold transition ${
                  lead.stage === stage
                    ? 'border-[#FC6E20] bg-[#FC6E20] text-[#151419]'
                    : 'border-white/8 bg-[#151419] text-white hover:border-[#FC6E20]/40'
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>

        {lead.stage === 'Won' ? (
          <div className="mt-4 rounded-[24px] border border-white/8 bg-[#1B1B1E] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#FC6E20]">Handoff actions</p>
                <p className="mt-3 text-sm leading-7 text-[#595959]">
                  Won leads should leave CRM with intention. Convert them into delivery or content work instead of letting them sit here.
                </p>
              </div>
              <CheckCircle2 className="mt-1 h-5 w-5 text-[#FC6E20]" />
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={projectHandoffExists}
                onClick={() => onCreateHandoff(lead, 'Project')}
                className="inline-flex min-h-12 items-center rounded-2xl bg-[#FC6E20] px-4 font-montserrat text-sm font-semibold text-[#151419] transition hover:bg-[#e95f14] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {projectHandoffExists ? 'Project handoff queued' : 'Create project handoff'}
              </button>
              <button
                type="button"
                disabled={contentHandoffExists}
                onClick={() => onCreateHandoff(lead, 'Content')}
                className="inline-flex min-h-12 items-center rounded-2xl border border-white/8 bg-[#151419] px-4 font-montserrat text-sm font-semibold text-white transition hover:border-[#FC6E20] hover:text-[#FC6E20] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {contentHandoffExists ? 'Content handoff queued' : 'Create content handoff'}
              </button>
            </div>
          </div>
        ) : null}

        {editing ? (
          <>
            <div className="mt-6 rounded-[24px] border border-white/8 bg-[#1B1B1E] p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Lead name" value={draft.name} onChange={(value) => setDraft((current) => ({ ...current, name: value }))} />
                <Field label="Business" value={draft.business} onChange={(value) => setDraft((current) => ({ ...current, business: value }))} />
                <Field label="Email" value={draft.email ?? ''} onChange={(value) => setDraft((current) => ({ ...current, email: value }))} />
                <Field label="Source" value={draft.source} onChange={(value) => setDraft((current) => ({ ...current, source: value }))} />
                <Field label="Requested service" value={draft.requestedService ?? ''} onChange={(value) => setDraft((current) => ({ ...current, requestedService: value }))} className="sm:col-span-2" />
                <Field label="Budget" value={draft.budget} onChange={(value) => setDraft((current) => ({ ...current, budget: value }))} />
                <Field label="Owner" value={draft.owner} onChange={(value) => setDraft((current) => ({ ...current, owner: value }))} />
                <Field label="Last touch" value={draft.lastTouch ?? ''} onChange={(value) => setDraft((current) => ({ ...current, lastTouch: value }))} />
                <Field label="Next action" value={draft.nextAction} onChange={(value) => setDraft((current) => ({ ...current, nextAction: value }))} className="sm:col-span-2" />
                <TextAreaField label="Notes" value={draft.notes ?? ''} onChange={(value) => setDraft((current) => ({ ...current, notes: value }))} className="sm:col-span-2" />
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
                  setDraft(lead);
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
              <DetailCard label="Business" value={lead.business} />
              <DetailCard label="Email" value={lead.email ?? '-'} />
              <DetailCard label="Requested service" value={lead.requestedService ?? '-'} />
              <DetailCard label="Budget" value={lead.budget} />
              <DetailCard label="Owner" value={lead.owner} />
              <DetailCard label="Last touch" value={lead.lastTouch ?? '-'} />
            </div>

            <div className="mt-6 space-y-4">
              <NarrativeBlock title="Next action" body={lead.nextAction} />
              {lead.notes ? <NarrativeBlock title="Notes" body={lead.notes} /> : null}
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function LeadIntakeModal({
  onClose,
  onCreateLead,
}: {
  onClose: () => void;
  onCreateLead: (draft: typeof initialDraft) => void;
}) {
  const [draft, setDraft] = useState(initialDraft);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-3xl rounded-[32px] border border-white/10 bg-[#151419] p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-montserrat text-[11px] uppercase tracking-[0.22em] text-[#FC6E20]">Quick intake</p>
            <h3 className="mt-3 font-playfair text-4xl font-semibold text-white">Capture a new lead</h3>
            <p className="mt-3 max-w-2xl font-montserrat text-sm leading-7 text-[#595959]">
              Keep this fast. The goal is to get a commercial record into the system with enough context to move it forward today.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:border-[#FC6E20] hover:text-[#FC6E20]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 rounded-[24px] border border-white/8 bg-[#1B1B1E] p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Lead name" value={draft.name} onChange={(value) => setDraft((current) => ({ ...current, name: value }))} />
            <Field label="Business" value={draft.business} onChange={(value) => setDraft((current) => ({ ...current, business: value }))} />
            <Field label="Email" value={draft.email} onChange={(value) => setDraft((current) => ({ ...current, email: value }))} />
            <Field label="Source" value={draft.source} onChange={(value) => setDraft((current) => ({ ...current, source: value }))} />
            <Field label="Requested service" value={draft.requestedService} onChange={(value) => setDraft((current) => ({ ...current, requestedService: value }))} className="sm:col-span-2" />
            <Field label="Budget" value={draft.budget} onChange={(value) => setDraft((current) => ({ ...current, budget: value }))} />
            <Field label="Owner" value={draft.owner} onChange={(value) => setDraft((current) => ({ ...current, owner: value }))} />
            <Field label="Stage" value={draft.stage} onChange={(value) => setDraft((current) => ({ ...current, stage: value as CrmStage }))} />
            <Field label="Last touch" value={draft.lastTouch} onChange={(value) => setDraft((current) => ({ ...current, lastTouch: value }))} />
            <Field label="Next action" value={draft.nextAction} onChange={(value) => setDraft((current) => ({ ...current, nextAction: value }))} className="sm:col-span-2" />
            <TextAreaField label="Notes" value={draft.notes} onChange={(value) => setDraft((current) => ({ ...current, notes: value }))} className="sm:col-span-2" />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              if (!draft.name.trim() || !draft.business.trim()) {
                return;
              }

              onCreateLead(draft);
            }}
            className="inline-flex min-h-12 items-center rounded-2xl bg-[#FC6E20] px-4 font-montserrat text-sm font-semibold text-[#151419] transition hover:bg-[#e95f14]"
          >
            Create lead
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
