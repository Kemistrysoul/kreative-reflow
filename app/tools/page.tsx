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
import { AnimatedLinkText } from '@/components/AnimatedTextLink';
import { ExpandingCtaBackground } from '@/components/ExpandingCtaBackground';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Website SEO & Conversion Tools | Kreative Reflow',
  description:
    'Use interactive website, conversion, local SEO, lead response, and rebuild decision tools from Kreative Reflow for South African service businesses.',
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

const featuredToolCardStyles = [
  {
    card: 'bg-[#5F9FAA] text-[#060808]',
    icon: 'border-[#060808]/18 bg-[#060808]/8 text-[#060808]/62',
    cta: 'bg-[#060808] text-[#FBFBFB] group-hover:bg-[#FBFBFB] group-hover:text-[#060808]',
    hidden: 'text-[#060808]',
  },
  {
    card: 'bg-[#DD6211] text-[#060808]',
    icon: 'border-[#060808]/18 bg-[#060808]/8 text-[#060808]/58',
    cta: 'bg-[#060808] text-[#FBFBFB] group-hover:bg-[#FBFBFB] group-hover:text-[#060808]',
    hidden: 'text-[#060808]',
  },
  {
    card: 'bg-[#FFF6E9] text-[#0A171D]',
    icon: 'border-[#0A171D]/16 bg-[#0A171D]/[0.07] text-[#0A171D]/56',
    cta: 'bg-[#0A171D] text-[#FBFBFB] group-hover:bg-[#DD6211] group-hover:text-[#060808]',
    hidden: 'text-[#060808]',
  },
  {
    card: 'bg-[#B92717] text-[#FFF6E9]',
    icon: 'border-[#FFF6E9]/20 bg-[#FFF6E9]/8 text-[#FFF6E9]/68',
    cta: 'bg-[#FFF6E9] text-[#060808] group-hover:bg-[#060808] group-hover:text-[#FFF6E9]',
    hidden: 'text-[#FFF6E9]',
  },
];

const leadMagnetCardStyles = [
  'hover:border-[#DD6211] hover:bg-[#DD6211] hover:text-[#060808]',
  'hover:border-[#5F9FAA] hover:bg-[#5F9FAA] hover:text-[#060808]',
  'hover:border-[#C7AA94] hover:bg-[#C7AA94] hover:text-[#060808]',
  'hover:border-[#B92717] hover:bg-[#B92717] hover:text-[#FFF6E9]',
  'hover:border-[#FAE18F] hover:bg-[#FAE18F] hover:text-[#060808]',
  'hover:border-[#596C72] hover:bg-[#596C72] hover:text-[#FFF6E9]',
];

const leadMagnetBaseStyles = [
  'bg-[#F0EFED] text-[#151419] dark:bg-[#F0EFED] dark:text-[#151419]',
  'bg-[#F0EFED] text-[#151419] dark:bg-[#F0EFED] dark:text-[#151419]',
  'bg-[#F0EFED] text-[#151419] dark:bg-[#F0EFED] dark:text-[#151419]',
  'bg-[#F0EFED] text-[#151419] dark:bg-[#F0EFED] dark:text-[#151419]',
  'bg-[#F0EFED] text-[#151419] dark:bg-[#F0EFED] dark:text-[#151419]',
  'bg-[#F0EFED] text-[#151419] dark:bg-[#F0EFED] dark:text-[#151419]',
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#FC6E20]">
      <span>[</span>
      {children}
      <span>]</span>
    </span>
  );
}

function VerticalLines() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
      {[1, 2, 3, 4, 5, 6].map((line) => (
        <span
          key={line}
          className="absolute top-0 h-full border-l border-[#151419]/[0.045] dark:border-[#FBFBFB]/[0.055]"
          style={{ left: `${(line / 7) * 100}%` }}
        />
      ))}
    </div>
  );
}

function FeaturedToolCard({
  tool,
  index,
}: {
  tool: (typeof featuredTools)[number];
  index: number;
}) {
  const Icon = tool.icon;
  const style = featuredToolCardStyles[index % featuredToolCardStyles.length];

  return (
    <Link
      href={tool.href}
      className={`group relative flex min-h-[23rem] flex-col justify-between overflow-hidden rounded-[2.25rem] p-7 shadow-[0_28px_70px_rgba(21,20,25,0.12)] transition-all duration-300 ease-out will-change-transform hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-[0_34px_86px_rgba(21,20,25,0.18)] md:p-9 lg:sticky lg:top-28 ${style.card}`}
      style={{ zIndex: index + 1 }}
    >
      <div>
        <div className="flex items-start justify-between gap-8">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] opacity-[0.68]">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.05rem] border transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:rotate-3 ${style.icon}`}>
            <Icon className="h-6 w-6" strokeWidth={1.8} />
          </span>
        </div>
        <p className="mt-10 font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.22em] opacity-[0.68]">
          {tool.eyebrow}
        </p>
        <h2 className="mt-4 max-w-2xl font-playfair text-[clamp(2.3rem,4.4vw,4.6rem)] font-bold leading-[0.94] tracking-tight">
          {tool.title}
        </h2>
        <p className="mt-6 max-w-xl font-montserrat text-base leading-7 opacity-[0.78]">
          {tool.body}
        </p>
      </div>

      <span className={`mt-10 inline-flex min-h-12 w-fit items-center justify-center gap-3 rounded-full px-6 font-montserrat text-xs font-bold uppercase tracking-[0.12em] transition-colors ${style.cta}`}>
        <AnimatedLinkText hiddenClassName={style.hidden}>{tool.cta}</AnimatedLinkText>
        <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

export default function ToolsPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#F0EFED] text-[#151419] selection:bg-[#FC6E20] selection:text-[#151419] [--left-gutter:4.5rem] [--right-gutter:1rem] dark:bg-[#151419] dark:text-[#FBFBFB] sm:[--left-gutter:4.75rem] sm:[--right-gutter:1.5rem] lg:[--left-gutter:5.5rem] lg:[--right-gutter:3.5rem] xl:[--right-gutter:75px]">
      <VerticalLines />
      <section className="content-gutter relative z-10 py-24 md:py-28 lg:py-24">
        <div className="relative grid gap-12 lg:min-h-[155vh] lg:grid-cols-[minmax(0,0.82fr)_minmax(420px,1fr)] lg:items-start lg:gap-16">
          <div className="lg:min-h-[128vh] lg:self-start">
            <div className="lg:sticky lg:top-20 lg:-mt-8">
              <SectionLabel>Tools</SectionLabel>
              <h1 className="mt-8 max-w-5xl font-playfair text-[clamp(3.1rem,7.2vw,7.2rem)] font-bold leading-[0.93] tracking-tight text-[#151419] dark:text-[#FBFBFB]">
                Diagnose the leak before you rebuild the whole pipe<span className="text-[#FC6E20]">.</span>
              </h1>
              <p className="mt-8 max-w-2xl font-montserrat text-base leading-8 text-[#151419]/70 dark:text-[#FBFBFB]/68 md:text-lg">
                Practical interactive tools for South African service businesses
                that want clearer websites, stronger trust signals, better enquiry
                paths, and fewer guesses before the next build decision.
              </p>
              <Link
                href="/tools/website-lead-leak-scorecard"
                className="group mt-10 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-[#151419] px-6 py-3 text-center font-montserrat text-sm font-bold uppercase tracking-[0.06em] text-[#FBFBFB] transition-colors duration-300 hover:bg-[#FC6E20] hover:text-[#151419] dark:bg-[#FBFBFB] dark:text-[#151419] dark:hover:bg-[#FC6E20] sm:w-auto"
              >
                <AnimatedLinkText hiddenClassName="text-[#151419]">Start with scorecard</AnimatedLinkText>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="relative grid content-start gap-10 lg:ml-auto lg:w-[95%]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-12 -left-16 hidden h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(21,20,25,0.24)_1.2px,transparent_1.2px)] bg-[length:12px_12px] opacity-60 [mask-image:radial-gradient(circle_at_center,black_0%,black_55%,transparent_78%)] dark:bg-[radial-gradient(circle,rgba(251,251,251,0.3)_1.2px,transparent_1.2px)] dark:opacity-35 lg:block"
            />
            {featuredTools.slice(0, 2).map((tool, index) => (
              <FeaturedToolCard key={tool.title} tool={tool} index={index} />
            ))}
          </div>
        </div>

        <div className="relative mt-12 grid gap-12 lg:-mt-[18vh] lg:min-h-[128vh] lg:grid-cols-[minmax(420px,1fr)_minmax(0,0.82fr)] lg:items-start lg:gap-16">
          <div className="relative grid content-start gap-10 lg:w-[95%]">
            {featuredTools.slice(2).map((tool, index) => (
              <FeaturedToolCard key={tool.title} tool={tool} index={index + 2} />
            ))}
          </div>
          <div className="hidden lg:block" />
        </div>
      </section>

      <section className="content-gutter relative z-10 py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <SectionLabel>Lead magnets</SectionLabel>
            <h2 className="mt-5 max-w-xl font-playfair text-[clamp(2.8rem,6vw,5.9rem)] font-bold leading-[0.94] tracking-tight text-[#151419] dark:text-[#FBFBFB]">
              Downloads should support the diagnosis<span className="text-[#FC6E20]">.</span>
            </h2>
            <p className="mt-6 max-w-xl font-montserrat text-base leading-8 text-[#151419]/64 dark:text-[#FBFBFB]/62">
              The scorecard gives the moment of truth. The downloadable assets
              give the business owner something useful to keep, share, and act
              on after they see where the site is leaking.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {leadMagnets.map((item, index) => {
              const Icon = item.icon;
              const baseStyle = leadMagnetBaseStyles[index % leadMagnetBaseStyles.length];
              const hoverStyle = leadMagnetCardStyles[index % leadMagnetCardStyles.length];

              return (
                <article
                  key={item.title}
                  className={`group flex min-h-[18rem] flex-col justify-between rounded-[1.35rem] border border-[#151419]/10 p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_22px_54px_rgba(21,20,25,0.14)] dark:border-[#FBFBFB]/10 ${baseStyle} ${hoverStyle}`}
                >
                  <div>
                    <Icon className="h-5 w-5 text-current/42 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:rotate-3" strokeWidth={1.7} />
                    <h3 className="mt-8 font-playfair text-3xl font-bold leading-none tracking-tight">
                      {item.title}
                    </h3>
                    <p className="mt-4 font-montserrat text-sm leading-7 text-current/64">
                      {item.body}
                    </p>
                  </div>
                  <p className="mt-8 border-t border-current/10 pt-4 font-mono text-xs uppercase tracking-[0.16em] text-current/60 transition-colors duration-300 group-hover:border-current/25">
                    {item.trigger}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="content-gutter relative z-10 pb-24 md:pb-32">
        <ExpandingCtaBackground>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <SectionLabel>Start with the live tool</SectionLabel>
              <h2 className="mt-5 max-w-4xl font-playfair text-[clamp(2.7rem,6.6vw,6.8rem)] font-bold leading-[0.9] tracking-tight">
                Run the scorecard, then turn the result into a fix plan<span className="text-[#FC6E20]">.</span>
              </h2>
              <p className="mt-6 max-w-2xl font-montserrat text-base leading-8 text-[#151419]/64">
                Start with a practical diagnostic, then use the downloadable
                report as the first map for what needs to be fixed.
              </p>
            </div>
            <Link
              href="/tools/website-lead-leak-scorecard"
              className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-[#FC6E20] px-6 py-3 text-center font-montserrat text-sm font-bold uppercase tracking-[0.06em] text-[#151419] transition-colors duration-300 hover:bg-[#FBFBFB] sm:w-auto"
            >
              <ListChecks className="h-4 w-4" />
              <AnimatedLinkText hiddenClassName="text-[#151419]">
                Open scorecard
              </AnimatedLinkText>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </ExpandingCtaBackground>
      </section>
    </main>
  );
}
