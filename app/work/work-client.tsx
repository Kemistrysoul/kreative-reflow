'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useSyncExternalStore } from 'react';
import type React from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import {
  ArrowRight,
  CalendarCheck,
  LockKeyhole,
  PanelsTopLeft,
  Search,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { AnimatedLinkText } from '@/components/AnimatedTextLink';
import { ExpandingCtaBackground } from '@/components/ExpandingCtaBackground';

type FeaturedProject = {
  id: string;
  title: string;
  eyebrow: string;
  industry: string;
  audience: string;
  headline: string;
  summary: string;
  problem: string;
  built: string[];
  features: string[];
  conversion: string;
  privateNotes: string[];
  image: string;
  imageWidth: number;
  imageHeight: number;
  accent: string;
  serviceHref: string;
};

type ProofLens = {
  title: string;
  body: string;
  ctaLabel?: string;
  href?: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
};

const featuredProjects: FeaturedProject[] = [
  {
    id: '01',
    title: 'Coach Kagiso',
    eyebrow: 'Career coaching platform',
    industry: 'Career coaching, personal branding, CV and LinkedIn services',
    audience:
      'South African professionals, job seekers, career changers, early-to-mid-career professionals, and first-time leaders.',
    headline: 'A conversion-ready coaching platform for career clarity and personal brand growth.',
    summary:
      'A warm editorial personal-brand website that turns career clarity into bookings, paid services, diagnostics, resources, and lead capture.',
    problem:
      'The business needed to explain multiple offers, build trust, capture leads, and support paid service intake without feeling generic.',
    built: [
      'Homepage, service pathways, resources, insights, and booking pages',
      '5-minute career diagnostic and lead magnet flow',
      'Paid service buying journey with intake-ready structure',
      'Cal.com booking paths and email-gated resource moments',
    ],
    features: ['Diagnostic tool', 'Booking flow', 'Paid service pathway', 'Resource hub'],
    conversion:
      'Discovery calls, paid CV and LinkedIn services, lead magnet signups, diagnostic completions, and coaching enquiries.',
    privateNotes: [
      'Diagnostic submissions and uploaded files stay private.',
      'Payment references and client data should not be shown publicly.',
      'Testimonials or job outcomes should only be used once approved.',
    ],
    image: '/images/work/coach-kagiso-showcase.jpg',
    imageWidth: 960,
    imageHeight: 5490,
    accent: '#C7AA94',
    serviceHref: '/services/web-design',
  },
  {
    id: '02',
    title: 'Touch Teq Engineering',
    eyebrow: 'Industrial engineering website',
    industry:
      'Industrial engineering, fire and gas detection, control and instrumentation, electrical engineering',
    audience:
      'Industrial operators, plant managers, HSE teams, procurement teams, engineering managers, refineries, mining, chemical, utilities, and manufacturing facilities.',
    headline: 'A safety-critical engineering website with a private operations system behind it.',
    summary:
      'A technical lead-generation site that makes complex industrial services feel credible, clear, and ready for qualified enquiries.',
    problem:
      'The business needed to communicate technical credibility, safety compliance, regional capability, and service scope for serious industrial buyers.',
    built: [
      'Public engineering website with strong service architecture',
      'Industries, technical insights, and quote/contact pathways',
      'Facility risk assessment lead tool',
      'Private office foundation for quotes, invoices, reports, and operational workflows',
    ],
    features: ['Industrial service grid', 'Risk assessment flow', 'Quote path', 'Office workflow foundation'],
    conversion:
      'Technical consultations, quote requests, phone calls, facility risk assessment submissions, and stronger business credibility.',
    privateNotes: [
      'Internal office dashboard data should stay private unless sanitized.',
      'Quotes, invoices, VAT reports, client records, and assistant logs should not be shown publicly.',
      'Project numbers and results should only be used after client approval.',
    ],
    image: '/images/work/touch-teq-showcase.jpg',
    imageWidth: 960,
    imageHeight: 7158,
    accent: '#FC6E20',
    serviceHref: '/services/saas-development',
  },
  {
    id: '03',
    title: 'Ubuntu Memorial Services + ParlourPay',
    eyebrow: 'Self-initiated funeral services platform concept',
    industry: 'Funeral services, community funeral parlours, burial societies, and local service businesses',
    audience:
      'Funeral parlour owners, office teams, consultants, and families managing cover, monthly contributions, or funeral arrangements.',
    headline:
      'A funeral parlour website that turns package browsing, member registration, and monthly contribution records into one demo-ready system.',
    summary:
      'A self-initiated concept build for community funeral providers, combining a polished public website with demo-powered registration, receipt, status, and staff-dashboard workflows.',
    problem:
      'Local funeral parlours often depend on trusted walk-in relationships, booklet stamps, and manual monthly payment records, while families need clearer package information and remote ways to start admin-heavy steps.',
    built: [
      'Multi-page funeral parlour website with services, packages, tombstones, contact, about, how-it-works, and articles routes',
      'Package comparison UX with practical benefits, waiting-period language, add-ons, and fine print',
      'Multi-step registration flow with SA ID format validation, dependant rules, next-of-kin, extras, documents, and consent',
      'Demo monthly contribution flow with member lookup, safety check, receipt download, and digital stamp-book entries',
      'Staff dashboard with seed data, review queue, member profiles, cash payment capture, reconciliation export, and audit trail',
    ],
    features: ['Online registration', 'Digital stamp book', 'Review dashboard', 'Tombstone catalogue'],
    conversion:
      'Funeral parlour owners can request a tailored demo, while families can see how they would register, pay, contact the office, or check status.',
    privateNotes: [
      'Demo member, contact, ID-like, and payment details should stay sanitized in screenshots.',
      'Raw lead research and confidential scope documents should not be used as public portfolio assets.',
      'Do not claim client work, live payments, real cover, user traction, or production integrations.',
    ],
    image: '/images/work/ubuntu-memorial-services-showcase.jpg',
    imageWidth: 960,
    imageHeight: 8016,
    accent: '#154230',
    serviceHref: '/services/saas-development',
  },
];

const proofLenses: ProofLens[] = [
  {
    title: 'Positioning',
    body: 'Each build has to explain the business clearly before asking for a conversion.',
    icon: Sparkles,
  },
  {
    title: 'Conversion paths',
    body: 'Booking, quote, diagnostic, lead magnet, intake, and contact flows are part of the work, not an afterthought.',
    icon: CalendarCheck,
  },
  {
    title: 'Systems underneath',
    body: 'The strongest builds connect public trust to private workflows, dashboards, files, and follow-up logic.',
    icon: Workflow,
  },
  {
    title: 'Public boundaries',
    body: 'Client data, payment references, internal dashboards, and unapproved claims stay out of the showcase.',
    icon: LockKeyhole,
  },
  {
    title: 'Start the next build',
    body: 'Use this page as the reference point: public proof on the surface, useful business infrastructure underneath.',
    ctaLabel: 'Start similar work',
    href: '/contact',
    icon: ArrowRight,
  },
];

const proofLensCardStyles = [
  {
    card: 'bg-[#5F9FAA] text-[#060808]',
    icon: 'border-[#060808]/18 bg-[#060808]/8 text-[#060808]/62',
    number: 'opacity-[0.68]',
    rule: 'border-[#060808]/18',
  },
  {
    card: 'bg-[#DD6211] text-[#060808]',
    icon: 'border-[#060808]/18 bg-[#060808]/8 text-[#060808]/58',
    number: 'opacity-[0.68]',
    rule: 'border-[#060808]/18',
  },
  {
    card: 'bg-[#FFF6E9] text-[#0A171D]',
    icon: 'border-[#0A171D]/16 bg-[#0A171D]/[0.07] text-[#0A171D]/56',
    number: 'opacity-[0.68]',
    rule: 'border-[#0A171D]/16',
  },
  {
    card: 'bg-[#B92717] text-[#FFF6E9]',
    icon: 'border-[#FFF6E9]/20 bg-[#FFF6E9]/8 text-[#FFF6E9]/68',
    number: 'opacity-[0.68]',
    rule: 'border-[#FFF6E9]/22',
  },
  {
    card: 'bg-[#151419] text-[#FBFBFB] ring-1 ring-[#FC6E20]/28',
    icon: 'border-[#FC6E20]/22 bg-[#FC6E20]/10 text-[#FC6E20]',
    number: 'text-[#FC6E20]',
    rule: 'border-[#FBFBFB]/14',
  },
];

const serviceDirections = [
  {
    title: 'Conversion websites',
    description:
      'Custom marketing sites for service businesses that need trust, clarity, speed, and better lead capture.',
    href: '/services/web-design',
    icon: PanelsTopLeft,
  },
  {
    title: 'Custom dashboards',
    description:
      'Client portals, booking systems, internal boards, and SaaS-style tools designed around real workflows.',
    href: '/services/saas-development',
    icon: Workflow,
  },
  {
    title: 'Visibility foundations',
    description:
      'Local SEO, AI-search readiness, structured content, and the technical layer that helps clients find you.',
    href: '/services/seo',
    icon: Search,
  },
  {
    title: 'Automation support',
    description:
      'Workflow automation for repetitive admin, reporting, follow-ups, scheduling, and connected tools.',
    href: '/services/automation',
    icon: ShieldCheck,
  },
];

const serviceDirectionCardStyles = [
  'hover:border-[#DD6211] hover:bg-[#DD6211] hover:text-[#060808] dark:hover:border-[#DD6211] dark:hover:bg-[#DD6211] dark:hover:text-[#060808]',
  'hover:border-[#5F9FAA] hover:bg-[#5F9FAA] hover:text-[#060808] dark:hover:border-[#5F9FAA] dark:hover:bg-[#5F9FAA] dark:hover:text-[#060808]',
  'hover:border-[#C7AA94] hover:bg-[#C7AA94] hover:text-[#060808] dark:hover:border-[#C7AA94] dark:hover:bg-[#C7AA94] dark:hover:text-[#060808]',
  'hover:border-[#B92717] hover:bg-[#B92717] hover:text-[#FFF6E9] dark:hover:border-[#B92717] dark:hover:bg-[#B92717] dark:hover:text-[#FFF6E9]',
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

function useIsDesktopViewport() {
  return useSyncExternalStore(
    (callback) => {
      const mediaQuery = window.matchMedia('(min-width: 1024px)');
      mediaQuery.addEventListener('change', callback);

      return () => {
        mediaQuery.removeEventListener('change', callback);
      };
    },
    () => window.matchMedia('(min-width: 1024px)').matches,
    () => false,
  );
}

function buildScrollStackKeyframes(index: number, total: number) {
  const lastIndex = Math.max(total - 1, 1);
  const input = Array.from({ length: total }, (_, itemIndex) => itemIndex / lastIndex);
  const scale = input.map((_, itemIndex) => 1 - Math.max(0, itemIndex - index) * 0.045);
  const rotate = input.map((_, itemIndex) => -Math.max(0, itemIndex - index) * 1.15);
  const entryStart = index === 0 ? 0 : (index - 1) / lastIndex;
  const entryEnd = index / lastIndex;

  return {
    input,
    scale,
    rotate,
    yInput: index === 0 ? [0, 1] : [entryStart, entryEnd],
    yOutput:
      index === 0
        ? ['0px', `${-28 * Math.max(total - 1, 0)}px`]
        : ['18vh', `${index * 34}px`],
  };
}

function WorkHero() {
  return (
    <section className="content-gutter relative z-10 grid min-h-screen grid-cols-1 items-start gap-12 py-28 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.78fr)] lg:items-center lg:gap-16 lg:py-32">
      <Reveal>
        <SectionLabel>Selected work</SectionLabel>
        <h1 className="mt-8 max-w-5xl font-playfair text-[clamp(3.1rem,7.2vw,7.2rem)] font-bold leading-[0.93] tracking-tight text-[#151419] dark:text-[#FBFBFB]">
          Work built as proof, not decoration<span className="text-[#FC6E20]">.</span>
        </h1>
        <p className="mt-8 max-w-2xl font-montserrat text-base leading-8 text-[#151419]/70 dark:text-[#FBFBFB]/68 md:text-lg">
          The homepage shows the highlights. This page gives each build the
          room it deserves: the context, what we built, what stays private,
          and the system working behind the screen.
        </p>
        <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <PrimaryButton href="#featured-work">View featured builds</PrimaryButton>
          <SecondaryButton href="/contact">Start similar work</SecondaryButton>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <ProofIndexStage />
      </Reveal>
    </section>
  );
}

function ProofIndexStage() {
  return (
    <div className="relative overflow-hidden px-2 pb-20 pt-3 text-[#151419] dark:text-[#FBFBFB] sm:px-3 sm:pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(21,20,25,0.24)_1.2px,transparent_1.2px)] bg-[length:12px_12px] opacity-75 [mask-image:radial-gradient(circle_at_center,black_0%,black_55%,transparent_78%)] dark:bg-[radial-gradient(circle,rgba(251,251,251,0.3)_1.2px,transparent_1.2px)] dark:opacity-45"
      />
      <div className="relative flex items-center justify-between pb-6 font-mono text-[0.65rem] uppercase tracking-[0.24em] text-[#151419]/45 dark:text-white/45">
        <span>Proof index</span>
        <span>03 builds</span>
      </div>
      <div className="relative grid gap-5 lg:ml-auto lg:w-[92%] xl:w-[95%]">
        {featuredProjects.map((project) => {
          const isCoach = project.id === '01';
          const isTouchTeq = project.title === 'Touch Teq Engineering';
          const isUbuntu = project.title.includes('Ubuntu Memorial');
          const Icon = isCoach ? PanelsTopLeft : isUbuntu ? ShieldCheck : Workflow;

          return (
            <Link
              href={`#${project.title.toLowerCase().replaceAll(' ', '-')}`}
              key={project.title}
              className="group block overflow-hidden rounded-[2.25rem] p-7 text-[#151419] shadow-[0_28px_70px_rgba(21,20,25,0.12)] transition-transform duration-300 hover:-translate-y-1 sm:p-9 lg:p-10"
              style={{
                backgroundColor: isCoach ? '#C7AA94' : isUbuntu ? '#A6824A' : '#FC6E20',
              }}
            >
              <div className="flex items-start justify-between gap-6">
                <div className={isTouchTeq || isUbuntu ? 'max-w-[18rem]' : 'max-w-[16rem]'}>
                  <p className="font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#151419]/62">
                    {project.eyebrow}
                  </p>
                  <h3 className="mt-5 font-montserrat text-[clamp(1.9rem,4vw,2.75rem)] font-black uppercase leading-[0.92] tracking-[-0.04em]">
                    {isTouchTeq ? (
                      <>
                        <span className="block">Touch Teq</span>
                        <span className="block">Engineering</span>
                      </>
                    ) : isUbuntu ? (
                      <>
                        <span className="block">Ubuntu Memorial</span>
                        <span className="block">+ ParlourPay</span>
                      </>
                    ) : (
                      project.title
                    )}
                  </h3>
                </div>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#151419]/14 bg-[#151419]/6 text-[#151419]/55 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                  <Icon className="h-5 w-5" strokeWidth={1.9} />
                </span>
              </div>
              <div className="mt-20 border-t border-[#151419]/16 pt-5">
                <div className="flex items-center justify-between gap-4 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[#151419]/62">
                  <span>{project.id}</span>
                  <span className="inline-flex items-center gap-2">
                    <AnimatedLinkText hiddenClassName="text-[#151419]">
                      Open case
                    </AnimatedLinkText>
                    <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
                <p className="mt-5 max-w-md font-montserrat text-base leading-7 text-[#151419]/78">
                  {project.summary}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
      <p className="relative mt-6 max-w-sm font-montserrat text-sm leading-7 text-[#151419]/58 dark:text-white/58">
        Public pages up front. The deeper context, workflow logic, and private
        boundaries get explained once you open the case study.
      </p>
    </div>
  );
}

function BrowserFrame({ project }: { project: FeaturedProject }) {
  return (
    <div className="relative overflow-hidden border border-[#151419]/10 bg-[#151419] p-3 shadow-2xl shadow-[#151419]/15 dark:border-white/10 dark:bg-[#0f0f12]">
      <div className="flex items-center justify-between border-b border-white/10 px-2 pb-3">
        <div className="flex gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FC6E20]" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </div>
        <span className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-white/38">
          Homepage capture
        </span>
      </div>
      <div className="relative mt-3 aspect-[4/3] overflow-hidden bg-[#F0EFED] sm:aspect-[16/10] lg:aspect-[4/3]">
        <Image
          src={project.image}
          alt={`${project.title} website screenshot`}
          fill
          sizes="(min-width: 1024px) 44vw, 100vw"
          className="object-cover object-top"
          priority={project.id === '01'}
        />
      </div>
    </div>
  );
}

function ProjectCaseStudy({ project, index }: { project: FeaturedProject; index: number }) {
  return (
    <motion.article
      id={project.title.toLowerCase().replaceAll(' ', '-')}
      initial={{ opacity: 0, y: 54 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.75, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden border border-[#151419]/10 bg-[#FBFBFB]/72 text-[#151419] shadow-[0_24px_80px_rgba(21,20,25,0.1)] dark:border-[#FBFBFB]/10 dark:bg-[#1B1B1E] dark:text-[#FBFBFB]"
    >
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: `linear-gradient(90deg, ${project.accent}, transparent)` }}
      />
      <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:p-10 xl:p-12">
        <div className="flex min-h-full flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="font-mono text-sm text-[#595959]">{project.id}</span>
              <span
                className="rounded-full border px-3 py-1 font-montserrat text-[0.62rem] font-bold uppercase tracking-[0.18em]"
                style={{ borderColor: `${project.accent}55`, color: project.accent }}
              >
                Featured build
              </span>
            </div>
            <p className="mt-8 font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#595959]">
              {project.eyebrow}
            </p>
            <h2 className="mt-4 max-w-[12ch] font-playfair text-[clamp(2.45rem,4.2vw,4.7rem)] font-bold leading-[0.94] tracking-tight sm:max-w-none">
              {project.title}
            </h2>
            <p className="mt-5 font-montserrat text-base leading-8 text-[#151419]/68 dark:text-[#FBFBFB]/64">
              {project.summary}
            </p>
            <p
              className="mt-6 border-l-2 pl-5 font-montserrat text-sm leading-7 text-[#151419] dark:text-[#FBFBFB]/82"
              style={{ borderColor: project.accent }}
            >
              {project.headline}
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {project.features.map((feature) => (
              <div
                key={feature}
                className="border border-[#151419]/10 bg-[#F0EFED]/60 px-4 py-3 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-[#151419]/62 dark:border-white/10 dark:bg-white/[0.035] dark:text-white/55"
              >
                {feature}
              </div>
            ))}
          </div>
        </div>

        <BrowserFrame project={project} />
      </div>

      <div className="grid gap-6 border-t border-[#151419]/10 p-5 dark:border-white/10 sm:p-7 lg:grid-cols-3 lg:p-10 xl:p-12">
        <div>
          <p className="font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#FC6E20]">
            Problem
          </p>
          <p className="mt-4 font-montserrat text-sm leading-7 text-[#151419]/66 dark:text-[#FBFBFB]/60">
            {project.problem}
          </p>
        </div>
        <div>
          <p className="font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#FC6E20]">
            Built
          </p>
          <ul className="mt-4 space-y-3">
            {project.built.map((item) => (
              <li
                key={item}
                className="flex gap-3 font-montserrat text-sm leading-6 text-[#151419]/66 dark:text-[#FBFBFB]/60"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FC6E20]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#FC6E20]">
            Conversion goal
          </p>
          <p className="mt-4 font-montserrat text-sm leading-7 text-[#151419]/66 dark:text-[#FBFBFB]/60">
            {project.conversion}
          </p>
          <Link
            href={project.serviceHref}
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#151419] px-5 py-3 font-montserrat text-xs font-bold uppercase tracking-[0.08em] text-[#FBFBFB] transition-colors hover:bg-[#FC6E20] hover:text-[#151419] dark:bg-[#FBFBFB] dark:text-[#151419] dark:hover:bg-[#FC6E20]"
          >
            Related service
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

function FeaturedWork() {
  return (
    <section id="featured-work" className="content-gutter relative z-10 py-16 md:py-24">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.58fr)_minmax(0,1.42fr)] lg:items-start">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <SectionLabel>What we've built</SectionLabel>
          <h2 className="mt-5 max-w-xl font-playfair text-[clamp(2.8rem,6vw,5.9rem)] font-bold leading-[0.94] tracking-tight text-[#151419] dark:text-[#FBFBFB]">
            The full story behind each build<span className="text-[#FC6E20]">.</span>
          </h2>
          <p className="mt-6 max-w-md font-montserrat text-base leading-8 text-[#151419]/64 dark:text-[#FBFBFB]/60">
            The problem each build had to solve, and the system we built
            underneath the visible pages.
          </p>
          <div className="mt-10 grid max-w-md grid-cols-2 gap-3">
            <div className="border border-[#151419]/10 bg-[#FBFBFB]/60 p-4 dark:border-white/10 dark:bg-white/[0.035]">
              <span className="block font-montserrat text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#595959]">
                Featured
              </span>
              <span className="mt-2 block font-mono text-3xl text-[#151419] dark:text-white">03</span>
            </div>
            <div className="border border-[#151419]/10 bg-[#FBFBFB]/60 p-4 dark:border-white/10 dark:bg-white/[0.035]">
              <span className="block font-montserrat text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#595959]">
                Scope
              </span>
              <span className="mt-2 block font-mono text-3xl text-[#151419] dark:text-white">Full</span>
            </div>
          </div>
        </Reveal>

        <div className="space-y-8 lg:space-y-10">
          {featuredProjects.map((project, index) => (
            <ProjectCaseStudy key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProofLensArticle({
  lens,
  index,
  className = '',
  inlineStyle,
}: {
  lens: ProofLens;
  index: number;
  className?: string;
  inlineStyle?: React.CSSProperties;
}) {
  const Icon = lens.icon;
  const style = proofLensCardStyles[index % proofLensCardStyles.length];
  const isCta = Boolean(lens.href);

  return (
    <article
      className={`relative flex flex-col justify-between rounded-[1.35rem] p-7 shadow-[0_22px_60px_rgba(0,0,0,0.22)] md:p-9 ${style.card} ${className}`}
      style={inlineStyle}
    >
      <div className="flex items-start justify-between gap-8">
        <div>
          <span className={`font-mono text-xs font-bold uppercase tracking-[0.18em] ${style.number}`}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="mt-8 max-w-lg font-playfair text-[clamp(2.25rem,4.6vw,4rem)] font-bold leading-none tracking-tight">
            {lens.title}
          </h3>
        </div>
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.05rem] border ${style.icon}`}>
          <Icon className="h-6 w-6" strokeWidth={1.8} />
        </div>
      </div>
      <div className={`mt-14 border-t pt-6 ${style.rule}`}>
        <p className="max-w-xl font-montserrat text-base leading-7 opacity-[0.82]">
          {lens.body}
        </p>
        {isCta && lens.href && lens.ctaLabel ? (
          <Link
            href={lens.href}
            className="group mt-7 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#FC6E20] px-6 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-[#060808] transition-colors hover:bg-[#FBFBFB]"
          >
            <AnimatedLinkText hiddenClassName="text-[#060808]">
              {lens.ctaLabel}
            </AnimatedLinkText>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        ) : null}
      </div>
    </article>
  );
}

function ProofLensStackCard({
  lens,
  index,
  total,
  scrollYProgress,
  isDesktop,
}: {
  lens: ProofLens;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  isDesktop: boolean;
}) {
  const keyframes = buildScrollStackKeyframes(index, total);
  const y = useTransform(scrollYProgress, keyframes.yInput, keyframes.yOutput);
  const scale = useTransform(scrollYProgress, keyframes.input, keyframes.scale);
  const rotate = useTransform(scrollYProgress, keyframes.input, keyframes.rotate);
  const desktopInset = index * 28;

  return (
    <motion.div
      className="lg:sticky lg:top-0 lg:flex lg:min-h-screen lg:items-center lg:py-10"
      style={{ zIndex: 20 + index }}
    >
      <motion.div
        className="w-full"
        style={
          isDesktop
            ? {
                y,
                scale,
                rotate,
                width: `calc(100% - ${desktopInset}px)`,
                marginLeft: `${desktopInset}px`,
                transformOrigin: 'top center',
              }
            : undefined
        }
      >
        <ProofLensArticle
          lens={lens}
          index={index}
          className="min-h-[19rem] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_28px_72px_rgba(0,0,0,0.28)] md:min-h-[21rem] lg:min-h-[24rem]"
        />
      </motion.div>
    </motion.div>
  );
}

function ProofLenses() {
  const stackRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktopViewport();
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section className="relative z-10 overflow-x-clip bg-[#060808] py-20 text-[#FBFBFB] md:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[29%] top-1/2 hidden h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.2)_1.1px,transparent_1.1px)] bg-[length:13px_13px] opacity-45 [mask-image:radial-gradient(circle_at_center,black_0%,black_48%,transparent_73%)] lg:block"
      />
      <div className="content-gutter relative grid gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(420px,1fr)] lg:items-start lg:gap-16">
        <Reveal className="lg:sticky lg:top-28">
          <div className="max-w-xl">
            <SectionLabel>How to read the work</SectionLabel>
            <h2 className="mt-6 border-b border-white/18 pb-7 font-playfair text-[clamp(2.8rem,6.2vw,6rem)] font-bold leading-[0.94] tracking-tight text-white/88">
              The screenshot is only the surface<span className="text-[#FC6E20]">.</span>
            </h2>
            <p className="mt-8 max-w-md font-montserrat text-base leading-8 text-white/62">
              The real work sits in the decisions behind the screen: trust,
              conversion, follow-up, and what stays private after the first enquiry.
            </p>
            <Link
              href="/contact"
              className="mt-9 inline-flex min-h-12 items-center justify-center rounded-full border border-white/38 px-6 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:border-[#DD6211] hover:bg-[#DD6211] hover:text-[#060808]"
            >
              <AnimatedLinkText hiddenClassName="text-[#060808]">Start similar work</AnimatedLinkText>
            </Link>
          </div>
        </Reveal>

        <div ref={stackRef} className="grid content-start gap-5 lg:block lg:pb-[18vh]">
          {proofLenses.map((lens, index) => (
            <ProofLensStackCard
              key={lens.title}
              lens={lens}
              index={index}
              total={proofLenses.length}
              scrollYProgress={scrollYProgress}
              isDesktop={isDesktop}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceDirections() {
  return (
    <section className="content-gutter relative z-10 py-20 md:py-28">
      <Reveal className="max-w-4xl">
        <SectionLabel>Project directions</SectionLabel>
        <h2 className="mt-5 font-playfair text-[clamp(2.8rem,6vw,5.9rem)] font-bold leading-[0.94] tracking-tight text-[#151419] dark:text-[#FBFBFB]">
          The work can start from different pressure points<span className="text-[#FC6E20]">.</span>
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {serviceDirections.map((direction, index) => {
          const Icon = direction.icon;
          const cardStyle = serviceDirectionCardStyles[index % serviceDirectionCardStyles.length];

          return (
            <Reveal key={direction.title} delay={index * 0.06}>
              <Link
                href={direction.href}
                className={`group flex min-h-[20rem] flex-col justify-between rounded-[1.35rem] border border-[#151419]/10 bg-[#F0EFED] p-6 text-[#151419] transition-colors duration-300 dark:border-[#FBFBFB]/10 dark:bg-[#F0EFED] dark:text-[#151419] ${cardStyle}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-current/60">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <Icon className="h-5 w-5 text-current/34" strokeWidth={1.7} />
                  </div>
                  <h3 className="mt-7 font-playfair text-3xl font-bold leading-none tracking-tight">
                    {direction.title}
                  </h3>
                  <p className="mt-5 font-montserrat text-sm leading-7 text-current/64">
                    {direction.description}
                  </p>
                </div>
                <div className="mt-10 flex items-center justify-between border-t border-current/10 pt-4">
                  <span className="font-montserrat text-[0.7rem] font-bold uppercase tracking-[0.18em]">
                    <AnimatedLinkText>View service</AnimatedLinkText>
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

function PublicBoundary() {
  return (
    <section className="content-gutter relative z-10 pb-20 md:pb-28">
      <Reveal>
        <div className="rounded-[1.35rem] border border-[#151419]/10 bg-[#FBFBFB]/70 p-7 dark:border-[#FBFBFB]/10 dark:bg-[#1B1B1E] md:p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:items-start">
            <div>
              <SectionLabel>Public by design</SectionLabel>
              <h2 className="mt-5 font-playfair text-[clamp(2.5rem,5vw,5rem)] font-bold leading-[0.96] tracking-tight text-[#151419] dark:text-[#FBFBFB]">
                Strong proof without exposing private systems<span className="text-[#FC6E20]">.</span>
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featuredProjects.map((project) => (
                <article
                  key={project.title}
                  className="rounded-[1.35rem] border border-[#151419]/10 bg-[#F0EFED]/60 p-5 dark:border-white/10 dark:bg-white/[0.035]"
                >
                  <h3 className="font-playfair text-3xl font-bold text-[#151419] dark:text-[#FBFBFB]">
                    {project.title}
                  </h3>
                  <ul className="mt-5 space-y-3">
                    {project.privateNotes.map((note) => (
                      <li
                        key={note}
                        className="flex gap-3 font-montserrat text-sm leading-6 text-[#151419]/64 dark:text-[#FBFBFB]/58"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FC6E20]" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="content-gutter relative z-10 pb-24 md:pb-32">
      <Reveal>
        <ExpandingCtaBackground>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <SectionLabel>Start the next build</SectionLabel>
              <h2 className="mt-5 max-w-4xl font-playfair text-[clamp(2.7rem,6.6vw,6.8rem)] font-bold leading-[0.9] tracking-tight">
                Bring the business problem. We will shape the proof<span className="text-[#FC6E20]">.</span>
              </h2>
              <p className="mt-6 max-w-2xl font-montserrat text-base leading-8 text-[#151419]/64">
                Whether it is a public website, a dashboard, a quote flow, or
                the workflow behind the scenes, the work starts with clarity.
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
                href="/services"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#151419]/15 px-6 py-3 text-center font-montserrat text-sm font-bold uppercase tracking-[0.06em] text-[#151419] transition-colors duration-300 hover:border-[#FC6E20] hover:text-[#FC6E20] sm:w-auto"
              >
                <AnimatedLinkText>View services</AnimatedLinkText>
              </Link>
            </div>
          </div>
        </ExpandingCtaBackground>
      </Reveal>
    </section>
  );
}

export function WorkClient() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#F0EFED] text-[#151419] selection:bg-[#FC6E20] selection:text-[#151419] [--left-gutter:4.5rem] [--right-gutter:1rem] dark:bg-[#151419] dark:text-[#FBFBFB] sm:[--left-gutter:4.75rem] sm:[--right-gutter:1.5rem] lg:[--left-gutter:5.5rem] lg:[--right-gutter:3.5rem] xl:[--right-gutter:75px]">
      <GridLines />
      <WorkHero />
      <FeaturedWork />
      <ProofLenses />
      <ServiceDirections />
      <PublicBoundary />
      <FinalCta />
    </main>
  );
}
