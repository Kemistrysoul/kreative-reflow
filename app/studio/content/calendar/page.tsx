'use client';

import { CalendarRange, Clock3, Send } from 'lucide-react';
import {
  contentCalendarEntries,
  contentMetrics,
  contentUnscheduled,
  type StudioMetric,
} from '@/lib/dashboard-data';
import { calendarEntryDetail } from '@/lib/content-detail';
import { matchesContentFilters, useStudioContent } from '@/components/studio/content-state';
import {
  type StudioTableColumn,
  StudioDataTable,
  StudioList,
  StudioMetricCard,
  StudioPanel,
  StudioStatusPill,
} from '@/components/studio/primitives';

const calendarColumns: StudioTableColumn<(typeof contentCalendarEntries)[number]>[] = [
  { key: 'date', label: 'Date', render: (row) => <span className="font-mono">{`${row.day} ${row.date}`}</span> },
  {
    key: 'title',
    label: 'Scheduled item',
    render: (row) => (
      <div>
        <p className="font-semibold text-white">{row.title}</p>
        <p className="mt-2 text-[#595959]">{row.channel}</p>
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
    render: (row) => <StudioStatusPill label={row.status} tone={row.status === 'Scheduled' || row.status === 'Ready' ? 'accent' : 'muted'} />,
  },
];

const calendarMetrics: StudioMetric[] = [
  contentMetrics[1],
  {
    label: 'Unscheduled Queue',
    value: `${contentUnscheduled.length}`,
    detail: 'Waiting for a committed publish date',
    icon: Clock3,
    tone: 'muted',
    spark: [3, 3, 2, 2, 2, 2, 2],
  },
  {
    label: 'Channels This Cycle',
    value: '4',
    detail: 'Blog, website, email, and Instagram are active this month',
    icon: Send,
    tone: 'neutral',
    spark: [2, 2, 3, 3, 4, 4, 4],
  },
];

const channelMix = [
  { label: 'Blog', value: '3 planned pieces' },
  { label: 'Website', value: '2 publish windows' },
  { label: 'Email', value: '1 nurture sequence' },
  { label: 'Instagram', value: '2 social deliveries' },
];

export default function StudioContentCalendarPage() {
  const { filters, openDetail, calendarItems } = useStudioContent();
  const filteredCalendar = calendarItems.filter((item) => matchesContentFilters(calendarEntryDetail(item), filters));

  return (
    <div className="space-y-5">
      <section className="grid gap-4 xl:grid-cols-3">
        {calendarMetrics.map((metric) => (
          <StudioMetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <StudioPanel title="30-day publishing board" eyebrow="Committed schedule" icon={CalendarRange}>
          <StudioDataTable
            columns={calendarColumns}
            rows={filteredCalendar}
            getRowKey={(row) => `${row.date}-${row.title}`}
            onRowClick={(row) => openDetail(calendarEntryDetail(row))}
            emptyMessage="No scheduled items match the current filters."
          />
        </StudioPanel>

        <div className="space-y-5">
          <StudioPanel title="Unscheduled queue" eyebrow="Pieces without dates" icon={Clock3}>
            <StudioList items={contentUnscheduled} />
          </StudioPanel>

          <StudioPanel title="Channel mix" eyebrow="Cadence by distribution channel" icon={Send}>
            <div className="space-y-3">
              {channelMix.map((item) => (
                <div key={item.label} className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
                  <p className="font-montserrat text-sm font-semibold text-white">{item.label}</p>
                  <p className="mt-2 font-montserrat text-sm text-[#595959]">{item.value}</p>
                </div>
              ))}
            </div>
          </StudioPanel>
        </div>
      </section>
    </div>
  );
}
