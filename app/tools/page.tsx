import type React from 'react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import {
  ArrowRight,
  Calculator,
  Clock3,
  ClipboardCheck,
  FileDown,
  Gauge,
  ListChecks,
  RefreshCw,
  SearchCheck,
} from 'lucide-react';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Tools | Kreative Reflow',
  description:
    'Interactive website, conversion, SEO, and business systems tools from Kreative Reflow for South African service businesses.',
  path: '/tools',
});

const featuredTools: Array<{
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  icon: LucideIcon;
}> = [
  {
    eyebrow: 'Website conversion',
    title: 'Website Lead Leak Scorecard',
    body: 'Find the speed, mobile, trust, clarity, and CTA issues that could be costing your website qualified enquiries.',
    href: '/tools/website-lead-leak-scorecard',
    cta: 'Run scorecard',
    icon: Gauge,
  },
  {
    eyebrow: 'Local search and maps',
    title: 'Local Visibility Scorecard',
    body: 'Assess your Google Business Profile, reviews, local directories, suburb pages, and AI-search readiness for Johannesburg queries.',
    href: '/tools/local-visibility-scorecard',
    cta: 'Check visibility',
    icon: SearchCheck,
  },
  {
    eyebrow: 'Website scope decision',
    title: 'Website Rebuild vs Refresh Quiz',
    body: 'Decide whether your current site needs a rebuild, a design and content refresh, or focused optimization.',
    href: '/tools/website-rebuild-vs-refresh-quiz',
    cta: 'Take quiz',
    icon: RefreshCw,
  },
  {
    eyebrow: 'Lead response speed',
    title: 'Lead Response Leak Calculator',
    body: 'Calculate how much slow replies could be leaking every month, then compare the loss against a simple automation fix.',
    href: '/tools/lead-response-leak-calculator',
    cta: 'Calculate leak',
    icon: Calculator,
  },
];

const leadMagnets: Array<{
  title: string;
  body: string;
  trigger: string;
  icon: LucideIcon;
}> = [
  {
    title: 'Full Lead Leak Report',
    body: 'A personalized report with the score, category breakdown, missed checks, and priority action plan.',
    trigger: 'Generated after the scorecard',
    icon: FileDown,
  },
  {
    title: 'Local Visibility Action Plan',
    body: 'A local search report with the score, category gaps, priority fixes, and realistic timeline to improvement.',
    trigger: 'Generated after the local scorecard',
    icon: SearchCheck,
  },
  {
    title: 'Lead Response Recovery Plan',
    body: 'A revenue-leak breakdown with monthly loss, annual projection, automation ROI, and the first fixes to implement.',
    trigger: 'Generated after the calculator',
    icon: Clock3,
  },
  {
    title: 'Website Scope Decision Plan',
    body: 'A rebuild, refresh, or optimization recommendation with score breakdown, scope risks, cost range, and next steps.',
    trigger: 'Generated after the rebuild quiz',
    icon: RefreshCw,
  },
  {
    title: 'Website Conversion Checklist',
    body: 'A practical checklist for homepage clarity, trust signals, mobile actions, forms, and conversion flow.',
    trigger: 'Best paired with the scorecard',
    icon: ClipboardCheck,
  },
  {
    title: 'Local Trust Signal Checklist',
    body: 'A South African service-business checklist for reviews, phone numbers, locations, photos, and proof.',
    trigger: 'Useful after a low trust score',
    icon: SearchCheck,
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-montserrat text-xs font-bold uppercase tracking-[0.3em] text-[#FC6E20]">
      [ {children} ]
    </p>
  );
}

export default function ToolsPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F0EFED] text-[#151419] dark:bg-[#151419] dark:text-[#FBFBFB]">
      <section className="relative isolate overflow-x-hidden bg-[#151419] text-[#FBFBFB]">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(251,251,251,0.055)_1px,transparent_1px),linear-gradient(180deg,rgba(251,251,251,0.04)_1px,transparent_1px)] bg-[size:clamp(72px,10vw,156px)_clamp(72px,10vw,156px)]" />
        <div className="content-gutter grid gap-12 pb-16 pt-28 md:pb-24 md:pt-36 lg:min-h-screen lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div>
            <SectionLabel>Tools</SectionLabel>
            <h1 className="mt-6 max-w-4xl font-playfair text-5xl font-bold leading-none text-[#FBFBFB] md:text-7xl lg:text-8xl">
              Diagnose the leak before you rebuild the whole pipe.
            </h1>
            <p className="mt-7 max-w-2xl font-montserrat text-base leading-8 text-[#F0EFED]/76 md:text-lg">
              Practical interactive tools for South African service businesses
              that want clearer websites, stronger trust signals, better
              enquiry paths, and fewer guesses before the next build decision.
            </p>
          </div>

          <div className="grid gap-4">
            {featuredTools.map((tool, index) => {
              const Icon = tool.icon;

              return (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className="group relative min-h-[26rem] overflow-hidden border border-white/10 bg-white/[0.035] p-7 text-[#FBFBFB] transition-colors hover:border-[#FC6E20] hover:bg-white/[0.06] md:p-9"
                >
                  <div className="absolute right-0 top-0 h-28 w-28 border-b border-l border-[#FC6E20]/35" />
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-12 w-12 items-center justify-center border border-white/12 bg-white/[0.04] text-[#FC6E20]">
                      <Icon className="h-5 w-5" strokeWidth={1.7} />
                    </span>
                    <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#878787]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <p className="mt-12 font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#FC6E20]">
                    {tool.eyebrow}
                  </p>
                  <h2 className="mt-5 max-w-2xl font-playfair text-4xl font-bold leading-none text-[#FBFBFB] md:text-6xl">
                    {tool.title}
                  </h2>
                  <p className="mt-6 max-w-xl font-montserrat text-sm leading-7 text-[#F0EFED]/66 md:text-base">
                    {tool.body}
                  </p>

                  <span className="mt-12 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#FC6E20] px-6 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-[#151419] transition-colors group-hover:bg-[#FBFBFB]">
                    {tool.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="content-gutter py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <SectionLabel>Lead magnets</SectionLabel>
            <h2 className="mt-5 max-w-xl font-playfair text-4xl font-bold leading-none text-[#151419] dark:text-[#FBFBFB] md:text-6xl">
              Downloads should support the diagnosis.
            </h2>
            <p className="mt-6 max-w-xl font-montserrat text-base leading-8 text-[#151419]/64 dark:text-[#FBFBFB]/62">
              The scorecard gives the moment of truth. The downloadable assets
              give the business owner something useful to keep, share, and act
              on after they see where the site is leaking.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {leadMagnets.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="flex min-h-[18rem] flex-col justify-between border border-[#151419]/12 bg-[#FBFBFB] p-6 dark:border-[#FBFBFB]/10 dark:bg-[#1B1B1E]"
                >
                  <div>
                    <Icon className="h-5 w-5 text-[#FC6E20]" strokeWidth={1.7} />
                    <h3 className="mt-8 font-montserrat text-sm font-bold uppercase text-[#151419] dark:text-[#FBFBFB]">
                      {item.title}
                    </h3>
                    <p className="mt-4 font-montserrat text-sm leading-7 text-[#151419]/62 dark:text-[#FBFBFB]/58">
                      {item.body}
                    </p>
                  </div>
                  <p className="mt-8 border-t border-[#151419]/10 pt-4 font-mono text-xs uppercase tracking-[0.16em] text-[#FC6E20] dark:border-[#FBFBFB]/10">
                    {item.trigger}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="content-gutter pb-24 md:pb-32">
        <div className="border border-[#151419]/12 bg-[#151419] p-7 text-[#FBFBFB] md:p-10 lg:p-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <SectionLabel>Start with the live tool</SectionLabel>
              <h2 className="mt-5 max-w-4xl font-playfair text-4xl font-bold leading-none md:text-6xl">
                Run the scorecard, then turn the result into a fix plan.
              </h2>
            </div>
            <Link
              href="/tools/website-lead-leak-scorecard"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#FC6E20] px-6 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-[#151419] transition-colors hover:bg-[#FBFBFB]"
            >
              <ListChecks className="h-4 w-4" />
              Open scorecard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
