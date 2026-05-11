import type { Metadata } from 'next';
import { AlertCircle, Clock3, LayoutGrid, WalletCards } from 'lucide-react';
import {
  overviewActivity,
  overviewAtRiskProjects,
  overviewCrmSnapshot,
  overviewFinanceSnapshot,
  overviewMetrics,
  overviewPriorities,
  studioOverviewTabs,
} from '@/lib/dashboard-data';
import {
  StudioMetricCard,
  StudioPageHeader,
  StudioPanel,
  StudioStatusPill,
} from '@/components/studio/primitives';

export const metadata: Metadata = {
  title: 'Studio Overview | Kreative Reflow',
  description: 'Overview dashboard for priorities, recent activity, risk, and quick studio summaries.',
};

export default function StudioOverviewPage() {
  return (
    <div className="space-y-5">
      <StudioPageHeader
        eyebrow="Overview"
        title="Studio command center"
        description="A focused overview of what needs attention today: delivery pressure, active follow-ups, client risk, and a quick commercial pulse. This page stays summary-first on purpose."
        tabs={studioOverviewTabs}
        activeTab="Today"
      />

      <section className="grid gap-4 xl:grid-cols-4">
        {overviewMetrics.map((metric) => (
          <StudioMetricCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <StudioPanel title="Today's priority list" eyebrow="Top actions" icon={Clock3}>
          <div className="space-y-3">
            {overviewPriorities.map((item) => (
              <div key={`${item.time}-${item.title}`} className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-montserrat text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-2 font-montserrat text-sm text-[#878787]">{item.meta}</p>
                  </div>
                  <StudioStatusPill label={item.time} tone={item.tone === 'accent' ? 'accent' : 'muted'} />
                </div>
              </div>
            ))}
          </div>
        </StudioPanel>

        <StudioPanel title="Recent activity" eyebrow="Latest movement" icon={LayoutGrid}>
          <div className="space-y-3">
            {overviewActivity.map((item) => (
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
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_0.85fr_0.85fr]">
        <StudioPanel title="At-risk projects" eyebrow="Needs attention" icon={AlertCircle}>
          <div className="space-y-3">
            {overviewAtRiskProjects.map((project) => (
              <div key={`${project.project}-${project.client}`} className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-montserrat text-sm font-semibold text-white">{project.project}</p>
                    <p className="mt-1 font-montserrat text-sm text-[#878787]">
                      {project.client} - {project.phase}
                    </p>
                    <p className="mt-2 font-montserrat text-sm text-[#878787]">Deadline {project.deadline}</p>
                  </div>
                  <StudioStatusPill label={project.health} tone="accent" />
                </div>
              </div>
            ))}
          </div>
        </StudioPanel>

        <StudioPanel title="CRM snapshot" eyebrow="Quick pipeline read">
          <div className="grid gap-3">
            {overviewCrmSnapshot.map((item) => (
              <div key={item.label} className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
                <p className="font-montserrat text-xs uppercase tracking-[0.16em] text-[#878787]">{item.label}</p>
                <p className="mt-2 font-playfair text-4xl text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </StudioPanel>

        <StudioPanel title="Finance snapshot" eyebrow="Commercial pulse" icon={WalletCards}>
          <div className="grid gap-3">
            {overviewFinanceSnapshot.map((item) => (
              <div key={item.label} className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
                <p className="font-montserrat text-xs uppercase tracking-[0.16em] text-[#878787]">{item.label}</p>
                <p className="mt-2 font-playfair text-4xl text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </StudioPanel>
      </section>
    </div>
  );
}
