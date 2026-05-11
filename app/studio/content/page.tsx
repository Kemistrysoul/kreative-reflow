'use client';

import { Activity, CalendarRange, CheckCircle2, Signal } from 'lucide-react';
import {
  type ContentCalendarEntry,
  contentMetrics,
  contentOverviewAttention,
  contentOverviewPublished,
  contentOverviewWorkspaceSplit,
} from '@/lib/dashboard-data';
import { calendarEntryDetail } from '@/lib/content-detail';
import { matchesContentFilters, useStudioContent } from '@/components/studio/content-state';
import { useStudioWorkflow } from '@/components/studio/studio-workflow-state';
import {
  type StudioTableColumn,
  StudioDataTable,
  StudioList,
  StudioMetricCard,
  StudioPanel,
  StudioStatusPill,
} from '@/components/studio/primitives';

const overviewColumns: StudioTableColumn<ContentCalendarEntry>[] = [
  { key: 'date', label: 'Date', render: (row) => <span className="font-mono">{`${row.day} ${row.date}`}</span> },
  {
    key: 'title',
    label: 'Upcoming item',
    render: (row) => (
      <div>
        <p className="font-semibold text-white">{row.title}</p>
        <p className="mt-2 text-[#878787]">{row.channel}</p>
      </div>
    ),
  },
  {
    key: 'workspace',
    label: 'Workspace',
    render: (row) => <StudioStatusPill label={row.workspace} tone={row.workspace === 'Kreative Reflow' ? 'accent' : 'neutral'} />,
  },
  {
    key: 'status',
    label: 'Status',
    render: (row) => <StudioStatusPill label={row.status} tone={row.status === 'Ready' || row.status === 'Scheduled' ? 'accent' : 'muted'} />,
  },
];

export default function StudioContentPage() {
  const { filters, openDetail, calendarItems } = useStudioContent();
  const { contentHandoffs } = useStudioWorkflow();
  const filteredSchedule = calendarItems.filter((item) => matchesContentFilters(calendarEntryDetail(item), filters));
  const filteredSplit = contentOverviewWorkspaceSplit.map((item) => {
    const matchingCount = filteredSchedule.filter((entry) => entry.workspace === item.label).length;
    return {
      ...item,
      value: `${matchingCount || 0} active`,
    };
  });

  return (
    <div className="space-y-5">
      <section className="grid gap-4 xl:grid-cols-4">
        {contentMetrics.map((metric) => (
          <StudioMetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <StudioPanel title="Needs attention" eyebrow="What is slowing momentum" icon={Signal}>
          <StudioList items={contentOverviewAttention} />
        </StudioPanel>

        <StudioPanel title="Upcoming 30-day schedule" eyebrow="Next commitments" icon={CalendarRange}>
          <StudioDataTable
            columns={overviewColumns}
            rows={filteredSchedule.slice(0, 6)}
            getRowKey={(row) => `${row.date}-${row.title}`}
            onRowClick={(row) => openDetail(calendarEntryDetail(row))}
            emptyMessage="No scheduled content matches the current filters."
          />
        </StudioPanel>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <StudioPanel title="Workspace split" eyebrow="Where current content energy sits" icon={Activity}>
          <div className="space-y-3">
            {filteredSplit.map((item) => (
              <div key={item.label} className="rounded-[22px] border border-white/8 bg-[#151419] p-5">
                <p className="font-montserrat text-[11px] uppercase tracking-[0.16em] text-[#878787]">{item.label}</p>
                <p className="mt-3 font-playfair text-4xl font-semibold text-white">{item.value}</p>
                <p className="mt-2 font-montserrat text-sm text-[#878787]">
                  {item.label === 'Kreative Reflow'
                    ? 'Internal publishing, offer support, and thought-leadership work.'
                    : 'Client deliverables, campaigns, case studies, and distribution support.'}
                </p>
              </div>
            ))}
          </div>
        </StudioPanel>

        <StudioPanel title="CRM content intake" eyebrow="Won work entering content ops" icon={CheckCircle2}>
          <div className="space-y-3">
            {contentHandoffs.length ? (
              contentHandoffs.map((handoff) => (
                <div key={handoff.id} className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-montserrat text-sm font-semibold text-white">{handoff.client}</p>
                      <p className="mt-2 text-sm text-[#878787]">{handoff.requestedService ?? handoff.business}</p>
                    </div>
                    <StudioStatusPill label={handoff.stage} tone="accent" />
                  </div>
                  <p className="mt-3 font-montserrat text-sm leading-6 text-[#F0EFED]">{handoff.summary}</p>
                </div>
              ))
            ) : (
              <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.02] p-5">
                <p className="font-montserrat text-sm text-[#878787]">No CRM content handoffs yet. New client content work will land here automatically.</p>
              </div>
            )}
          </div>
          <div className="mt-4 rounded-[22px] border border-white/8 bg-white/5 p-4">
            <p className="font-montserrat text-sm leading-6 text-[#878787]">
              Every intake above is also inserted into the Ideas queue as a real briefable content record.
            </p>
          </div>
        </StudioPanel>
      </section>

      <StudioPanel title="Recently published" eyebrow="Proof that work is shipping" icon={CheckCircle2}>
        <StudioList items={contentOverviewPublished} />
      </StudioPanel>
    </div>
  );
}
