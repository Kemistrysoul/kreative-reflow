'use client';

import { SearchCheck, Target, Lightbulb } from 'lucide-react';
import {
  contentResearchMetrics,
  contentResearchQuestions,
  contentResearchRecords,
} from '@/lib/dashboard-data';
import { researchRecordDetail } from '@/lib/content-detail';
import { matchesContentFilters, useStudioContent } from '@/components/studio/content-state';
import {
  type StudioTableColumn,
  StudioDataTable,
  StudioList,
  StudioMetricCard,
  StudioPanel,
  StudioStatusPill,
} from '@/components/studio/primitives';

const researchColumns: StudioTableColumn<(typeof contentResearchRecords)[number]>[] = [
  {
    key: 'topic',
    label: 'Topic',
    render: (row) => (
      <div>
        <p className="font-semibold text-white">{row.topic}</p>
        <p className="mt-2 text-[#878787]">{row.focus}</p>
      </div>
    ),
  },
  {
    key: 'workspace',
    label: 'Workspace',
    render: (row) => <StudioStatusPill label={row.workspace} tone={row.workspace === 'Client Content' ? 'neutral' : 'accent'} />,
  },
  { key: 'source', label: 'Source', render: (row) => <span>{row.source}</span> },
  {
    key: 'nextAction',
    label: 'Next action',
    render: (row) => <span className="text-[#F0EFED]">{row.nextAction}</span>,
  },
];

const researchLanes = [
  {
    title: 'Audience pain',
    description: 'Capture the exact hesitations people have before they trust a website, campaign, or case study.',
  },
  {
    title: 'Search opportunity',
    description: 'Track keyword patterns, AI-search phrasing, and query clusters that should inform briefs.',
  },
  {
    title: 'Commercial proof',
    description: 'Pull metrics, client quotes, and before-and-after shifts into case-study-ready research packets.',
  },
];

export default function StudioContentResearchPage() {
  const { filters, openDetail, researchItems } = useStudioContent();
  const filteredResearch = researchItems.filter((item) => matchesContentFilters(researchRecordDetail(item), filters));

  return (
    <div className="space-y-5">
      <section className="grid gap-4 xl:grid-cols-3">
        {contentResearchMetrics.map((metric) => (
          <StudioMetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.18fr_0.82fr]">
        <StudioPanel title="Research backlog" eyebrow="Inputs and source notes" icon={SearchCheck}>
          <StudioDataTable
            columns={researchColumns}
            rows={filteredResearch}
            getRowKey={(row) => `${row.project}-${row.topic}`}
            onRowClick={(row) => openDetail(researchRecordDetail(row))}
            emptyMessage="No research notes match the current filters."
          />
        </StudioPanel>

        <StudioPanel title="Question bank" eyebrow="What to answer next" icon={Target}>
          <StudioList items={contentResearchQuestions} />
        </StudioPanel>
      </section>

      <StudioPanel title="Research lanes" eyebrow="How this tab should be used" icon={Lightbulb}>
        <div className="grid gap-4 lg:grid-cols-3">
          {researchLanes.map((lane) => (
            <article key={lane.title} className="rounded-[24px] border border-white/8 bg-[#151419] p-5">
              <p className="font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#FC6E20]">Focus</p>
              <h3 className="mt-3 font-playfair text-3xl font-semibold text-white">{lane.title}</h3>
              <p className="mt-3 font-montserrat text-sm leading-7 text-[#878787]">{lane.description}</p>
            </article>
          ))}
        </div>
      </StudioPanel>
    </div>
  );
}
