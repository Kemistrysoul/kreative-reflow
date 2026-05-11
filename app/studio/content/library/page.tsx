'use client';

import { BookOpenText, Layers3, WandSparkles } from 'lucide-react';
import { contentLibraryTypes, type StudioMetric } from '@/lib/dashboard-data';
import { matchesContentFilters, useStudioContent } from '@/components/studio/content-state';
import {
  StudioMetricCard,
  StudioPanel,
  StudioStatusPill,
} from '@/components/studio/primitives';

const libraryMetrics: StudioMetric[] = [
  {
    label: 'Content Systems',
    value: `${contentLibraryTypes.length}`,
    detail: 'Reusable formats the studio can write from repeatedly',
    icon: Layers3,
    tone: 'accent',
    spark: [2, 3, 3, 4, 4, 5, 6],
  },
  {
    label: 'Primary Channels',
    value: '6',
    detail: 'Website, blog, email, LinkedIn, Instagram, and PDF proof',
    icon: BookOpenText,
    tone: 'neutral',
    spark: [1, 2, 2, 3, 4, 5, 6],
  },
  {
    label: 'Default CTA Modes',
    value: '4',
    detail: 'Book, reply, engage, or download depending on intent',
    icon: WandSparkles,
    tone: 'muted',
    spark: [1, 1, 2, 2, 3, 3, 4],
  },
];

const libraryRules = [
  'Every content type should define its purpose, structure, channel rules, and CTA pattern.',
  'Case studies need source proof before they enter writing.',
  'SEO pages and service pages should always align to commercial search intent.',
  'Repurposed content should carry the original source link so proof and claims stay grounded.',
];

const libraryMeta = {
  'Insights and educational articles': { type: 'Insight', channel: 'Blog' },
  'SEO pages and service pages': { type: 'Service Page', channel: 'Website' },
  'Case studies': { type: 'Case Study', channel: 'Website' },
  'Email and nurture sequences': { type: 'Email', channel: 'Email' },
  'Social and short-form distribution': { type: 'Social', channel: 'Instagram' },
  'Lead magnets and downloadable assets': { type: 'Lead Magnet', channel: 'Website' },
} as const;

export default function StudioContentLibraryPage() {
  const { filters, openDetail } = useStudioContent();
  const filteredLibrary = contentLibraryTypes.filter((item) =>
    matchesContentFilters(
      {
        workspace: filters.workspace === 'Client Content' ? 'Client Content' : 'Kreative Reflow',
        client: filters.client,
        project: filters.project,
        contentType: libraryMeta[item.title as keyof typeof libraryMeta]?.type ?? item.title,
        status: filters.status === 'All statuses' ? 'Library' : '',
        channel: libraryMeta[item.title as keyof typeof libraryMeta]?.channel ?? 'Website',
      },
      filters,
    ),
  );

  return (
    <div className="space-y-5">
      <section className="grid gap-4 xl:grid-cols-3">
        {libraryMetrics.map((metric) => (
          <StudioMetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <StudioPanel title="Content systems library" eyebrow="Types, channels, and CTA defaults" icon={BookOpenText}>
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filteredLibrary.map((item) => {
            const meta = libraryMeta[item.title as keyof typeof libraryMeta];
            return (
              <button
                key={item.title}
                type="button"
                onClick={() =>
                  openDetail({
                    id: `library-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
                    entityType: 'library',
                    editable: false,
                    title: item.title,
                    kind: 'Library template',
                    workspace: filters.workspace === 'Client Content' ? 'Client Content' : 'Kreative Reflow',
                    client: filters.client === 'All clients' ? '-' : filters.client,
                    project: filters.project === 'All projects' ? 'Content system' : filters.project,
                    contentType: meta?.type ?? item.title,
                    channel: meta?.channel ?? 'Website',
                    status: 'Library',
                    priority: 'System',
                    summary: item.description,
                    cta: item.defaultCta,
                    notes: [
                      `Channels: ${item.channels}`,
                      'Use this as a repeatable format rather than starting from scratch.',
                    ],
                  })
                }
                className="rounded-[24px] border border-white/8 bg-[#151419] p-5 text-left transition hover:border-[#FC6E20]/40"
              >
                <div className="flex flex-wrap gap-2">
                  {item.channels.split(', ').map((channel) => (
                    <StudioStatusPill key={`${item.title}-${channel}`} label={channel} tone="muted" />
                  ))}
                </div>
                <h3 className="mt-4 font-playfair text-3xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 font-montserrat text-sm leading-7 text-[#878787]">{item.description}</p>
                <div className="mt-4 rounded-[18px] border border-[#FC6E20]/20 bg-[#FC6E20]/8 px-4 py-3">
                  <p className="font-montserrat text-[11px] uppercase tracking-[0.18em] text-[#FC6E20]">Default CTA</p>
                  <p className="mt-2 font-montserrat text-sm text-[#FBFBFB]">{item.defaultCta}</p>
                </div>
              </button>
            );
          })}
          {!filteredLibrary.length ? (
            <div className="rounded-[24px] border border-dashed border-white/12 bg-[#151419] p-6">
              <p className="font-montserrat text-sm text-[#878787]">
                No library templates match the current filters.
              </p>
            </div>
          ) : null}
        </div>
      </StudioPanel>

      <StudioPanel title="Operating rules" eyebrow="Keep the system coherent" icon={Layers3}>
        <div className="grid gap-4 lg:grid-cols-2">
          {libraryRules.map((rule) => (
            <div key={rule} className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
              <p className="font-montserrat text-sm leading-7 text-[#FBFBFB]">{rule}</p>
            </div>
          ))}
        </div>
      </StudioPanel>
    </div>
  );
}
