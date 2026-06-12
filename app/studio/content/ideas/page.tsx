'use client';

import { ClipboardList, FileText, Sparkles } from 'lucide-react';
import { contentIdeaMetrics, contentIdeas } from '@/lib/dashboard-data';
import { ideaRecordDetail } from '@/lib/content-detail';
import { matchesContentFilters, useStudioContent } from '@/components/studio/content-state';
import {
  type StudioTableColumn,
  StudioDataTable,
  StudioMetricCard,
  StudioPanel,
  StudioStatusPill,
} from '@/components/studio/primitives';

const ideaColumns: StudioTableColumn<(typeof contentIdeas)[number]>[] = [
  {
    key: 'title',
    label: 'Idea',
    render: (row) => (
      <div>
        <p className="font-semibold text-white">{row.title}</p>
        <p className="mt-2 text-[#595959]">{row.goal}</p>
      </div>
    ),
  },
  { key: 'audience', label: 'Audience', render: (row) => <span>{row.audience}</span> },
  { key: 'contentType', label: 'Type', render: (row) => <span>{row.contentType}</span> },
  {
    key: 'priority',
    label: 'Priority',
    render: (row) => <StudioStatusPill label={row.priority} tone={row.priority === 'High' ? 'accent' : 'neutral'} />,
  },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <StudioStatusPill label={row.status} tone={row.status === 'Approved' ? 'accent' : 'muted'} />,
  },
];

const briefChecklist = [
  'Choose the audience and commercial goal before writing.',
  'Link every idea to a content type, channel, and CTA.',
  'Use research notes as source material, not as hidden reference.',
  'Move only approved ideas into pipeline so the board stays honest.',
];

export default function StudioContentIdeasPage() {
  const { filters, openDetail, ideaItems } = useStudioContent();
  const filteredIdeas = ideaItems.filter((item) => matchesContentFilters(ideaRecordDetail(item), filters));

  return (
    <div className="space-y-5">
      <section className="grid gap-4 xl:grid-cols-3">
        {contentIdeaMetrics.map((metric) => (
          <StudioMetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.22fr_0.78fr]">
        <StudioPanel title="Idea and brief queue" eyebrow="Structured opportunities" icon={Sparkles}>
          <StudioDataTable
            columns={ideaColumns}
            rows={filteredIdeas}
            getRowKey={(row) => `${row.project}-${row.title}`}
            onRowClick={(row) => openDetail(ideaRecordDetail(row))}
            emptyMessage="No ideas match the current filters."
          />
        </StudioPanel>

        <StudioPanel title="Brief builder" eyebrow="Rules for a clean handoff" icon={ClipboardList}>
          <div className="space-y-3">
            {briefChecklist.map((item) => (
              <div key={item} className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-[#FC6E20]/12 text-[#FC6E20]">
                    <FileText className="h-4 w-4" />
                  </span>
                  <p className="font-montserrat text-sm leading-7 text-[#FBFBFB]">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </StudioPanel>
      </section>
    </div>
  );
}
