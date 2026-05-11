'use client';

import { ArrowRightLeft, FolderKanban, UploadCloud } from 'lucide-react';
import {
  contentPipelineMetrics,
  contentPriorities,
  type ContentRecord,
} from '@/lib/dashboard-data';
import { contentRecordDetail, pipelineCardDetail } from '@/lib/content-detail';
import { matchesContentFilters, useStudioContent } from '@/components/studio/content-state';
import {
  type StudioTableColumn,
  StudioDataTable,
  StudioMetricCard,
  StudioPanel,
  StudioStatusPill,
} from '@/components/studio/primitives';

const productionColumns: StudioTableColumn<ContentRecord>[] = [
  {
    key: 'title',
    label: 'Piece',
    render: (row) => (
      <div>
        <p className="font-semibold text-white">{row.title}</p>
        <p className="mt-2 text-[#878787]">{row.contentType}</p>
      </div>
    ),
  },
  { key: 'owner', label: 'Owner', render: (row) => <span>{row.owner}</span> },
  { key: 'dueDate', label: 'Due', render: (row) => <span className="font-mono">{row.dueDate}</span> },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <StudioStatusPill label={row.status} tone={row.status === 'Scheduled' || row.status === 'Ready' ? 'accent' : 'neutral'} />,
  },
];

const blockedItems = contentPriorities.filter((item) => item.time === 'Blocked');
const pipelineStages = ['Brief', 'Draft', 'Edit', 'Ready', 'Scheduled'] as const;

export default function StudioContentPipelinePage() {
  const { filters, openDetail, recordItems } = useStudioContent();
  const filteredProduction = recordItems.filter((item) => matchesContentFilters(contentRecordDetail(item), filters));
  const liveBoard = pipelineStages.map((stage) => ({
    label: stage,
    items: filteredProduction
      .filter((item) => item.status === stage)
      .map((item) => ({
        id: item.id,
        title: item.title,
        workspace: item.workspace,
        client: item.client,
        project: item.project,
        contentType: item.contentType,
        channel: item.channel,
        priority: item.priority,
        due: item.dueDate,
      })),
  }));

  return (
    <div className="space-y-5">
      <section className="grid gap-4 xl:grid-cols-3">
        {contentPipelineMetrics.map((metric) => (
          <StudioMetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.16fr_0.84fr]">
        <StudioPanel title="Production board" eyebrow="Move pieces through the system" icon={FolderKanban}>
          <div className="overflow-x-auto pb-2">
            <div
              className="grid gap-4"
              style={{
                minWidth: `${Math.max(liveBoard.length, 3) * 220}px`,
                gridTemplateColumns: `repeat(${Math.max(liveBoard.length, 1)}, minmax(0, 1fr))`,
              }}
            >
              {liveBoard.map((column) => (
                <div key={column.label} className="rounded-[24px] border border-white/8 bg-[#151419] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-montserrat text-sm font-semibold uppercase tracking-[0.16em] text-white">
                      {column.label}
                    </h3>
                    <StudioStatusPill label={`${column.items.length} items`} tone="muted" />
                  </div>
                  <div className="mt-4 space-y-3">
                    {column.items.length ? column.items.map((item) => (
                      <button
                        key={`${column.label}-${item.title}`}
                        type="button"
                        onClick={() => openDetail(pipelineCardDetail(item, column.label))}
                        className="w-full rounded-[20px] border border-white/8 bg-[#1B1B1E] p-4 text-left transition hover:border-[#FC6E20]/40"
                      >
                        <p className="font-montserrat text-sm font-semibold text-white">{item.title}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <StudioStatusPill label={item.workspace} tone={item.workspace === 'Kreative Reflow' ? 'accent' : 'neutral'} />
                          <StudioStatusPill label={item.contentType} tone="muted" />
                        </div>
                        <p className="mt-3 font-montserrat text-sm text-[#878787]">
                          {item.client === '-' ? 'Internal system work' : item.client}
                        </p>
                        <p className="mt-2 font-mono text-xs text-[#878787]">Due {item.due}</p>
                      </button>
                    )) : (
                      <div className="rounded-[20px] border border-dashed border-white/10 bg-[#1B1B1E] p-4">
                        <p className="font-montserrat text-sm text-[#878787]">Nothing in this stage yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </StudioPanel>

        <div className="space-y-5">
          <StudioPanel title="Waiting on client" eyebrow="Operational friction" icon={UploadCloud}>
            <div className="space-y-3">
              {blockedItems.map((item) => (
                <div key={item.title} className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
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

          <StudioPanel title="Repurpose loop" eyebrow="Do not let published work stop at one format" icon={ArrowRightLeft}>
            <div className="space-y-3">
              {[
                'Turn strong insights into short-form social threads.',
                'Convert published articles into nurture email segments.',
                'Pull launch wins into case-study proof and sales pages.',
              ].map((item) => (
                <div key={item} className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
                  <p className="font-montserrat text-sm leading-7 text-[#FBFBFB]">{item}</p>
                </div>
              ))}
            </div>
          </StudioPanel>
        </div>
      </section>

      <StudioPanel title="Production queue" eyebrow="Everything currently in motion" icon={FolderKanban}>
        <StudioDataTable
          columns={productionColumns}
          rows={filteredProduction}
          getRowKey={(row) => `${row.project}-${row.title}`}
          onRowClick={(row) => openDetail(contentRecordDetail(row))}
          emptyMessage="No production items match the current filters."
        />
      </StudioPanel>
    </div>
  );
}
