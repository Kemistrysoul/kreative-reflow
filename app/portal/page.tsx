import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Clock3, FileText, LockKeyhole, UploadCloud } from 'lucide-react';
import { SiteFooter } from '@/components/SiteFooter';
import { AnimatedLinkText, AnimatedTextLink } from '@/components/AnimatedTextLink';
import {
  assetBuckets,
  milestones,
  portalActivity,
  portalProject,
  portalSteps,
} from '@/lib/dashboard-data';

export const metadata: Metadata = {
  title: 'Client Portal Preview | Kreative Reflow',
  description: 'A protected client portal preview for onboarding, files, milestones, approvals, and handoff.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PortalPage() {
  return (
    <>
      <main className="min-h-screen bg-[#111111] text-stone-100">
        <PortalHeader />

        <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="rounded-lg border border-white/10 bg-[#181818] p-6 md:p-8">
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="font-montserrat text-xs uppercase tracking-[0.24em] text-[#FC6E20]">
                  Client workspace
                </p>
                <h1 className="mt-4 font-playfair text-4xl font-bold tracking-tight text-white md:text-6xl">
                  {portalProject.clientName}
                </h1>
                <p className="mt-3 max-w-2xl font-montserrat text-sm leading-6 text-stone-400 md:text-base">
                  {portalProject.projectName} is currently in {portalProject.phase.toLowerCase()}.
                  The client sees one calm place for onboarding, assets, project movement,
                  approvals, invoices, and handoff.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#FC6E20] px-5 font-montserrat text-sm font-semibold text-stone-950 transition-colors hover:bg-[#e05a15]"
              >
                <AnimatedLinkText hiddenClassName="text-stone-950">Start intake</AnimatedLinkText>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10">
              <div className="flex items-center justify-between gap-4 font-montserrat text-xs uppercase tracking-[0.18em] text-stone-500">
                <span>{portalProject.status}</span>
                <span>{portalProject.progress}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-[#FC6E20]" style={{ width: `${portalProject.progress}%` }} />
              </div>
              <div className="mt-5 grid gap-3 font-montserrat text-sm text-stone-400 sm:grid-cols-3">
                <span>Started: {portalProject.started}</span>
                <span>Target: {portalProject.targetLaunch}</span>
                <span>Next: {portalProject.nextAction}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {portalSteps.map((step) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="rounded-lg border border-white/10 bg-[#181818] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <Icon className="h-5 w-5 text-[#FC6E20]" />
                    <span className="rounded-full border border-white/10 px-3 py-1 font-montserrat text-[11px] uppercase tracking-[0.16em] text-stone-400">
                      {step.status}
                    </span>
                  </div>
                  <h2 className="mt-5 font-playfair text-2xl font-bold text-white">{step.title}</h2>
                  <p className="mt-3 font-montserrat text-sm leading-6 text-stone-400">{step.detail}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="rounded-lg border border-white/10 bg-[#181818] p-6">
            <div className="mb-6 flex items-center gap-3">
              <Clock3 className="h-5 w-5 text-[#FC6E20]" />
              <h2 className="font-playfair text-3xl font-bold text-white">Milestones</h2>
            </div>
            <div className="space-y-3">
              {milestones.map((milestone) => (
                <div
                  key={milestone.label}
                  className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-t border-white/10 py-4"
                >
                  <CheckCircle2
                    className={`h-5 w-5 ${milestone.state === 'Done' ? 'text-[#FC6E20]' : 'text-stone-600'}`}
                  />
                  <div>
                    <p className="font-montserrat text-sm font-semibold text-white">{milestone.label}</p>
                    <p className="font-montserrat text-xs uppercase tracking-[0.16em] text-stone-500">
                      {milestone.state}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-stone-400">{milestone.date}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#181818] p-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <UploadCloud className="h-5 w-5 text-[#FC6E20]" />
                <h2 className="font-playfair text-3xl font-bold text-white">Asset Library</h2>
              </div>
              <span className="font-montserrat text-xs uppercase tracking-[0.18em] text-stone-500">
                50MB file cap
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {assetBuckets.map((bucket) => (
                <article key={bucket.title} className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-montserrat text-sm font-semibold text-white">{bucket.title}</h3>
                      <p className="mt-1 font-montserrat text-xs leading-5 text-stone-500">{bucket.detail}</p>
                    </div>
                    <span className="font-mono text-sm text-[#FC6E20]">{bucket.files}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-lg border border-white/10 bg-[#181818] p-6">
            <div className="mb-6 flex items-center gap-3">
              <FileText className="h-5 w-5 text-[#FC6E20]" />
              <h2 className="font-playfair text-3xl font-bold text-white">Recent Activity</h2>
            </div>
            <div className="space-y-4">
              {portalActivity.map((activity) => (
                <div key={`${activity.time}-${activity.title}`} className="border-t border-white/10 pt-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-montserrat text-sm font-semibold text-white">{activity.title}</p>
                      <p className="mt-2 font-montserrat text-sm text-stone-400">{activity.meta}</p>
                    </div>
                    <span className="font-mono text-xs text-stone-500">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[#FC6E20]/40 bg-[#FC6E20] p-6 text-stone-950">
            <LockKeyhole className="h-6 w-6" />
            <h2 className="mt-5 font-playfair text-3xl font-bold">Next build step</h2>
            <p className="mt-3 max-w-xl font-montserrat text-sm leading-6">
              Wire this preview to authentication, lead capture, project records,
              and storage. Keep visual comments, live analytics, and automated
              invoice reminders out of the MVP until the core workflow is stable.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function PortalHeader() {
  return (
    <header className="border-b border-white/10 bg-[#111111]/95 px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link href="/" className="font-display text-xl font-bold tracking-tight text-white">
          kreative Reflow
        </Link>
        <nav className="flex items-center gap-4 font-montserrat text-xs uppercase tracking-[0.18em] text-stone-400">
          <AnimatedTextLink href="/studio" className="max-sm:hidden" underline={false}>
            Studio
          </AnimatedTextLink>
          <AnimatedTextLink href="/services/saas-development" underline={false}>
            Web apps
          </AnimatedTextLink>
        </nav>
      </div>
    </header>
  );
}
