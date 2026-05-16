'use client';

import Image from 'next/image';
import Link from 'next/link';
import type React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  Blocks,
  Eye,
  Handshake,
  Map,
  MonitorCheck,
  Search,
  ShieldCheck,
  Workflow,
} from 'lucide-react';
import { AnimatedLinkText } from '@/components/AnimatedTextLink';

type Principle = {
  title: string;
  body: string;
};

type TimelineItem = {
  num: string;
  label: string;
  title: string;
  body: string;
};

type StudioSignal = {
  title: string;
  body: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
};

type ClientFit = {
  title: string;
  body: string;
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
};

const principles: Principle[] = [
  {
    title: 'Build around the business, not the template.',
    body: 'The site, dashboard, or workflow has to match how the business earns trust, handles enquiries, and delivers the work.',
  },
  {
    title: 'Make the technical layer understandable.',
    body: 'Clients should know what was built, why it matters, and how to own it after launch.',
  },
  {
    title: 'Keep accountability close.',
    body: 'A small client roster means the thinking, design, build, and support stay connected.',
  },
  {
    title: 'Design for after launch.',
    body: 'A polished first release is only useful if the system can be maintained, improved, and trusted later.',
  },
];

const timeline: TimelineItem[] = [
  {
    num: '01',
    label: 'The gap',
    title: 'Great work was not being seen.',
    body: 'Years in medical sales and neurology put Delite in rooms where specialists, practices, and technical teams were excellent in person but invisible or unclear online.',
  },
  {
    num: '02',
    label: 'The turn',
    title: 'The problem was bigger than design.',
    body: 'A website alone was not enough. Lead capture, trust, SEO, booking, dashboards, and follow-up needed to be treated as one connected system.',
  },
  {
    num: '03',
    label: 'The studio',
    title: 'Kreative Reflow became the integrated answer.',
    body: 'The studio was shaped around practical strategy, strong design, careful development, visibility, and automation that work together from the beginning.',
  },
];

const studioSignals: StudioSignal[] = [
  {
    title: 'Founder-led',
    body: 'You work close to the person responsible for the thinking, not a sales layer passing notes around.',
    icon: Handshake,
  },
  {
    title: 'System-minded',
    body: 'Every page, form, dashboard, and workflow is mapped against the way the business actually operates.',
    icon: Blocks,
  },
  {
    title: 'Visibility-aware',
    body: 'Search, structure, proof, and AI-readable content are considered as part of the build, not later decoration.',
    icon: Search,
  },
  {
    title: 'Maintenance-ready',
    body: 'The goal is a digital foundation that can keep working after the launch excitement fades.',
    icon: MonitorCheck,
  },
];

const clientFits: ClientFit[] = [
  {
    title: 'Service businesses',
    body: 'For businesses that sell trust, expertise, and relationships before anyone fills in a form.',
    href: '/services/web-design',
    icon: Eye,
  },
  {
    title: 'Specialist practices',
    body: 'For practices and professionals whose credibility needs to be clear before the first conversation.',
    href: '/services/seo',
    icon: ShieldCheck,
  },
  {
    title: 'Operations-heavy teams',
    body: 'For teams with scattered data, manual admin, unclear handoffs, and workflows that need one home.',
    href: '/services/saas-development',
    icon: Workflow,
  },
  {
    title: 'Growing founders',
    body: 'For founders who know something is messy, but need help turning it into a clear build plan.',
    href: '/services/consulting',
    icon: Map,
  },
];

const principleCardStyles = [
  'bg-[#5F9FAA] text-[#060808]',
  'bg-[#DD6211] text-[#060808]',
  'bg-[#FFF6E9] text-[#0A171D]',
  'bg-[#B92717] text-[#FFF6E9]',
];

const studioSignalCardStyles = [
  {
    card: 'bg-[#5F9FAA] text-[#060808]',
    icon: 'border-[#060808]/18 bg-[#060808]/8 text-[#060808]/62',
    rule: 'border-[#060808]/18',
  },
  {
    card: 'bg-[#DD6211] text-[#060808]',
    icon: 'border-[#060808]/18 bg-[#060808]/8 text-[#060808]/58',
    rule: 'border-[#060808]/18',
  },
  {
    card: 'bg-[#FFF6E9] text-[#0A171D]',
    icon: 'border-[#0A171D]/16 bg-[#0A171D]/[0.07] text-[#0A171D]/56',
    rule: 'border-[#0A171D]/16',
  },
  {
    card: 'bg-[#B92717] text-[#FFF6E9]',
    icon: 'border-[#FFF6E9]/20 bg-[#FFF6E9]/8 text-[#FFF6E9]/68',
    rule: 'border-[#FFF6E9]/22',
  },
];

const clientFitCardStyles = [
  'hover:border-[#596C72] hover:bg-[#596C72] hover:text-[#FFF6E9] dark:hover:border-[#596C72] dark:hover:bg-[#596C72] dark:hover:text-[#FFF6E9]',
  'hover:border-[#5F9FAA] hover:bg-[#5F9FAA] hover:text-[#060808] dark:hover:border-[#5F9FAA] dark:hover:bg-[#5F9FAA] dark:hover:text-[#060808]',
  'hover:border-[#C7AA94] hover:bg-[#C7AA94] hover:text-[#060808] dark:hover:border-[#C7AA94] dark:hover:bg-[#C7AA94] dark:hover:text-[#060808]',
  'hover:border-[#FAE18F] hover:bg-[#FAE18F] hover:text-[#060808] dark:hover:border-[#FAE18F] dark:hover:bg-[#FAE18F] dark:hover:text-[#060808]',
];

function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, x: -26 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-15% 0px -10% 0px' }}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#FC6E20]">
      <span>[</span>
      {children}
      <span>]</span>
    </span>
  );
}

function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  const label = typeof children === 'string' ? children : null;

  return (
    <Link
      href={href}
      className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-[#151419] px-6 py-3 text-center font-montserrat text-sm font-bold uppercase tracking-[0.06em] text-[#FBFBFB] transition-colors duration-300 hover:bg-[#FC6E20] hover:text-[#151419] dark:bg-[#FBFBFB] dark:text-[#151419] dark:hover:bg-[#FC6E20] sm:w-auto"
    >
      {label ? <AnimatedLinkText hiddenClassName="text-[#151419]">{label}</AnimatedLinkText> : children}
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

function SecondaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  const label = typeof children === 'string' ? children : null;

  return (
    <Link
      href={href}
      className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#151419]/15 px-6 py-3 text-center font-montserrat text-sm font-bold uppercase tracking-[0.06em] text-[#151419] transition-colors duration-300 hover:border-[#FC6E20] hover:text-[#FC6E20] dark:border-[#FBFBFB]/18 dark:text-[#FBFBFB] dark:hover:border-[#FC6E20] dark:hover:text-[#FC6E20] sm:w-auto"
    >
      {label ? <AnimatedLinkText>{label}</AnimatedLinkText> : children}
    </Link>
  );
}

function GridLines() {
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

function FounderPortrait() {
  return (
    <div className="relative overflow-hidden rounded-[2.25rem] border border-[#151419]/10 bg-[#151419] p-4 text-[#FBFBFB] shadow-[0_28px_70px_rgba(21,20,25,0.14)] dark:border-[#FBFBFB]/10 dark:bg-[#1B1B1E]">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.65rem] bg-[#F0EFED]">
        <Image
          src="/images/delite-founder.svg"
          alt="Delite, Founder of Kreative Reflow"
          fill
          priority
          sizes="(min-width: 1024px) 36vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#151419]/40 via-transparent to-transparent" />
      </div>
      <div className="grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-3">
        <div>
          <span className="block font-mono text-2xl text-[#FC6E20]">7+</span>
          <span className="mt-1 block font-montserrat text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white/45">
            Years industry
          </span>
        </div>
        <div>
          <span className="block font-mono text-2xl text-[#FC6E20]">Small</span>
          <span className="mt-1 block font-montserrat text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white/45">
            Client roster
          </span>
        </div>
        <div>
          <span className="block font-mono text-2xl text-[#FC6E20]">One</span>
          <span className="mt-1 block font-montserrat text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white/45">
            Connected system
          </span>
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="content-gutter relative z-10 grid min-h-screen grid-cols-1 items-start gap-12 py-28 lg:grid-cols-[minmax(0,1.04fr)_minmax(320px,0.78fr)] lg:items-center lg:gap-16 lg:py-32">
      <Reveal>
        <SectionLabel>About the studio</SectionLabel>
        <h1 className="mt-8 max-w-5xl font-playfair text-[clamp(3.1rem,7.2vw,7.2rem)] font-bold leading-[0.93] tracking-tight text-[#151419] dark:text-[#FBFBFB]">
          Built from the gap between excellence and visibility.
        </h1>
        <p className="mt-8 max-w-2xl font-montserrat text-base leading-8 text-[#151419]/70 dark:text-[#FBFBFB]/68 md:text-lg">
          Kreative Reflow is a founder-led Johannesburg studio for businesses
          whose digital presence, systems, and workflows need to work as hard as
          the people behind them.
        </p>
        <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <PrimaryButton href="/services">View services</PrimaryButton>
          <SecondaryButton href="/contact">Start a conversation</SecondaryButton>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <FounderPortrait />
      </Reveal>
    </section>
  );
}

function FounderNote() {
  return (
    <section className="relative z-10 overflow-hidden bg-[#060808] py-20 text-[#FBFBFB] md:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[30%] top-1/2 hidden h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.2)_1.1px,transparent_1.1px)] bg-[length:13px_13px] opacity-35 [mask-image:radial-gradient(circle_at_center,black_0%,black_48%,transparent_73%)] lg:block"
      />
      <div className="content-gutter grid gap-12 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
        <Reveal>
          <SectionLabel>Founder note</SectionLabel>
          <h2 className="mt-5 font-playfair text-[clamp(2.8rem,6vw,6rem)] font-bold leading-[0.94] tracking-tight">
            I saw brilliant businesses lose trust before they ever spoke.
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="grid gap-7 rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-7 font-montserrat text-base leading-8 text-white/66 md:p-9 md:text-lg">
            <p>
              Seven years in medical sales and neurology put me in operating
              theatres and specialist offices. I saw teams doing exceptional
              work, while their websites, content, and systems made them look
              smaller than they were.
            </p>
            <p>
              The pattern kept repeating: capability in the room, weak proof
              online, manual work behind the scenes, and missed trust before
              the first conversation.
            </p>
            <p className="font-playfair text-3xl font-bold leading-tight text-white md:text-4xl">
              The work was not just to make things look better. It was to make
              the business easier to understand, find, trust, and run.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function OriginTimeline() {
  return (
    <section className="content-gutter relative z-10 py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.58fr)_minmax(0,1.42fr)] lg:items-start">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <SectionLabel>How it formed</SectionLabel>
          <h2 className="mt-5 max-w-xl font-playfair text-[clamp(2.8rem,6vw,5.9rem)] font-bold leading-[0.94] tracking-tight text-[#151419] dark:text-[#FBFBFB]">
            The studio came from a practical frustration.
          </h2>
          <p className="mt-6 max-w-md font-montserrat text-base leading-8 text-[#151419]/64 dark:text-[#FBFBFB]/60">
            Too many providers treat strategy, design, development, SEO, and
            automation as separate pieces. Kreative Reflow was shaped around
            making those pieces work together from the start.
          </p>
        </Reveal>

        <div className="ml-auto w-full max-w-[54rem] space-y-4">
          {timeline.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <article className="grid gap-6 rounded-[1.35rem] border border-[#151419]/10 bg-[#FBFBFB]/70 p-6 shadow-[0_18px_44px_rgba(21,20,25,0.05)] dark:border-[#FBFBFB]/10 dark:bg-[#1B1B1E] md:grid-cols-[0.28fr_1fr] md:p-8">
                <div>
                  <span className="font-mono text-sm text-[#FC6E20]">{item.num}</span>
                  <p className="mt-8 font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#878787]">
                    {item.label}
                  </p>
                </div>
                <div>
                  <h3 className="font-playfair text-[clamp(2.2rem,4vw,4.2rem)] font-bold leading-[0.96] tracking-tight text-[#151419] dark:text-[#FBFBFB]">
                    {item.title}
                  </h3>
                  <p className="mt-5 font-montserrat text-sm leading-7 text-[#151419]/64 dark:text-[#FBFBFB]/60 md:text-base md:leading-8">
                    {item.body}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PrinciplesSection() {
  return (
    <section className="content-gutter relative z-10 py-16 md:py-24">
      <Reveal className="max-w-4xl">
        <SectionLabel>Principles</SectionLabel>
        <h2 className="mt-5 font-playfair text-[clamp(2.7rem,6vw,5.9rem)] font-bold leading-[0.94] tracking-tight text-[#151419] dark:text-[#FBFBFB]">
          The rules behind the work.
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {principles.map((principle, index) => (
          <Reveal key={principle.title} delay={index * 0.06}>
            <article
              className={`flex min-h-[19rem] flex-col justify-between rounded-[1.35rem] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.12)] transition-transform duration-300 hover:-translate-y-1 ${principleCardStyles[index % principleCardStyles.length]}`}
            >
              <span className="font-mono text-sm text-current/62">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-playfair text-3xl font-bold leading-none tracking-tight">
                  {principle.title}
                </h3>
                <p className="mt-5 font-montserrat text-sm leading-7 text-current/64">
                  {principle.body}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function StudioModel() {
  return (
    <section className="relative z-10 overflow-hidden bg-[#060808] py-20 text-[#FBFBFB] md:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[18%] top-20 hidden h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.2)_1.1px,transparent_1.1px)] bg-[length:13px_13px] opacity-35 [mask-image:radial-gradient(circle_at_center,black_0%,black_46%,transparent_72%)] lg:block"
      />
      <div className="content-gutter">
        <Reveal className="ml-auto max-w-4xl text-right lg:w-[74%] xl:w-[68%]">
          <SectionLabel>How the studio works</SectionLabel>
          <h2 className="mt-5 font-playfair text-[clamp(2.8rem,6.8vw,6.6rem)] font-bold leading-[0.94] tracking-tight">
            Small by design. Serious by default.
          </h2>
          <p className="ml-auto mt-6 max-w-2xl font-montserrat text-base leading-8 text-white/62">
            The model is intentionally focused: fewer clients, deeper context,
            and builds where the visible layer and operational layer are
            planned together.
          </p>
        </Reveal>

        <div className="mt-12 grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-4">
          {studioSignals.map((signal, index) => {
            const Icon = signal.icon;
            const style = studioSignalCardStyles[index % studioSignalCardStyles.length];

            return (
              <Reveal key={signal.title} className="h-full" delay={index * 0.06}>
                <article
                  className={`flex h-full min-h-[20rem] flex-col justify-between rounded-[1.35rem] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.22)] transition-transform duration-300 hover:-translate-y-1 md:p-8 ${style.card}`}
                >
                  <div>
                    <div className={`flex h-14 w-14 items-center justify-center rounded-[1.05rem] border ${style.icon}`}>
                      <Icon className="h-5 w-5" strokeWidth={1.7} />
                    </div>
                    <h3 className="mt-8 font-playfair text-4xl font-bold leading-none tracking-tight">
                      {signal.title}
                    </h3>
                  </div>
                  <div className={`mt-10 border-t pt-6 ${style.rule}`}>
                    <p className="font-montserrat text-sm leading-7 opacity-[0.78]">
                      {signal.body}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ClientFitSection() {
  return (
    <section className="content-gutter relative z-10 py-20 md:py-28">
      <Reveal className="max-w-4xl">
        <SectionLabel>Who it is for</SectionLabel>
        <h2 className="mt-5 font-playfair text-[clamp(2.8rem,6vw,5.9rem)] font-bold leading-[0.94] tracking-tight text-[#151419] dark:text-[#FBFBFB]">
          Best fit for businesses with real complexity underneath.
        </h2>
      </Reveal>

      <div className="mt-12 grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {clientFits.map((fit, index) => {
          const Icon = fit.icon;
          const isAnomaly = index === 1;
          const cardStyle = isAnomaly
            ? '-translate-y-4 rotate-[1.5deg] border-[#151419]/15 bg-[#FC6E20] text-[#151419] shadow-[0_28px_70px_rgba(21,20,25,0.18)] hover:translate-y-0 hover:rotate-0 hover:bg-[#DD6211] dark:border-[#151419]/15 dark:bg-[#FC6E20] dark:text-[#151419] dark:hover:bg-[#DD6211]'
            : clientFitCardStyles[index % clientFitCardStyles.length];

          return (
            <Reveal key={fit.title} className="h-full" delay={index * 0.06}>
              <Link
                href={fit.href}
                className={`group flex h-full min-h-[20rem] flex-col justify-between rounded-[1.35rem] border p-6 transition-all duration-300 ${isAnomaly ? cardStyle : `border-[#151419]/10 bg-[#F0EFED] text-[#151419] dark:border-[#FBFBFB]/10 dark:bg-[#F0EFED] dark:text-[#151419] ${cardStyle}`}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className={`font-mono text-[0.68rem] uppercase tracking-[0.22em] ${isAnomaly ? 'text-[#151419]/56' : 'text-[#FC6E20]'}`}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <Icon className={`h-5 w-5 text-current/34 ${isAnomaly ? 'group-hover:text-current/70' : 'group-hover:text-[#FC6E20]'}`} strokeWidth={1.7} />
                  </div>
                  <h3 className="mt-7 font-playfair text-3xl font-bold leading-none tracking-tight">
                    {fit.title}
                  </h3>
                  <p className="mt-5 font-montserrat text-sm leading-7 text-current/64">
                    {fit.body}
                  </p>
                </div>
                <div className="mt-10 flex items-center justify-between border-t border-current/10 pt-4">
                  <span className="font-montserrat text-[0.7rem] font-bold uppercase tracking-[0.18em]">
                    Related service
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="content-gutter relative z-10 pb-24 md:pb-32">
      <Reveal>
        <div className="rounded-[1.35rem] border border-[#151419]/10 bg-[#151419] p-7 text-[#FBFBFB] dark:border-[#FBFBFB]/10 dark:bg-[#1B1B1E] md:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <SectionLabel>Work with the studio</SectionLabel>
              <h2 className="mt-5 max-w-4xl font-playfair text-[clamp(2.7rem,6.6vw,6.8rem)] font-bold leading-[0.9] tracking-tight">
                Bring the messy version. We will shape the system.
              </h2>
              <p className="mt-6 max-w-2xl font-montserrat text-base leading-8 text-white/62">
                You do not need a perfect brief. A rough problem, a broken
                workflow, or a website that no longer reflects the business is
                enough to start.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/contact"
                className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-[#FC6E20] px-6 py-3 text-center font-montserrat text-sm font-bold uppercase tracking-[0.06em] text-[#151419] transition-colors duration-300 hover:bg-[#FBFBFB] sm:w-auto"
              >
                <AnimatedLinkText hiddenClassName="text-[#151419]">Start a project</AnimatedLinkText>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/work"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/18 px-6 py-3 text-center font-montserrat text-sm font-bold uppercase tracking-[0.06em] text-[#FBFBFB] transition-colors duration-300 hover:border-[#FC6E20] hover:text-[#FC6E20] sm:w-auto"
              >
                <AnimatedLinkText>View the work</AnimatedLinkText>
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function AboutClient() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#F0EFED] text-[#151419] selection:bg-[#FC6E20] selection:text-[#151419] [--left-gutter:4.5rem] [--right-gutter:1rem] dark:bg-[#151419] dark:text-[#FBFBFB] sm:[--left-gutter:4.75rem] sm:[--right-gutter:1.5rem] lg:[--left-gutter:5.5rem] lg:[--right-gutter:3.5rem] xl:[--right-gutter:75px]">
      <GridLines />
      <HeroSection />
      <FounderNote />
      <OriginTimeline />
      <PrinciplesSection />
      <StudioModel />
      <ClientFitSection />
      <FinalCta />
    </main>
  );
}
