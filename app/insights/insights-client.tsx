'use client';

import Link from 'next/link';
import Image from 'next/image';
import type React from 'react';
import { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  BookOpenText,
  Calculator,
  ChartNoAxesCombined,
  Gauge,
  PanelsTopLeft,
  RefreshCw,
  Search,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { AnimatedLinkText } from '@/components/AnimatedTextLink';
import { ExpandingCtaBackground } from '@/components/ExpandingCtaBackground';

type InsightNote = {
  num: string;
  category: string;
  title: string;
  summary: string;
  readTime: string;
  usefulFor: string;
  href: string;
  ctaLabel: string;
  image: string;
  imageAlt: string;
  tags: string[];
  imageShape: 'tall' | 'wide' | 'square';
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
};

type QuestionCard = {
  question: string;
  body: string;
  path: string;
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
};

type ReadingPath = {
  title: string;
  eyebrow: string;
  body: string;
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
};

type RhythmStep = {
  num: string;
  title: string;
  body: string;
};

const insightNotes: InsightNote[] = [
  {
    num: '01',
    category: 'Pricing',
    title: 'How Much Does a Website Cost in South Africa in 2026',
    summary:
      'You want a website built. First question: how much? The answer you will hear most is "it depends." True, but not helpful.',
    readTime: '10 min read',
    usefulFor: 'Website budgeting',
    href: '/insights/website-cost-south-africa-2026',
    ctaLabel: 'Read article',
    image:
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Business owner reviewing website project numbers on a laptop.',
    tags: ['Pricing', 'Planning'],
    imageShape: 'tall',
  },
  {
    num: '02',
    category: 'Conversion',
    title: "Why Your Website Looks Good But Doesn't Convert",
    summary:
      "Most business owners think their website problem is traffic. Wrong. You don't need more visitors if the ones you have aren't converting.",
    readTime: '9 min read',
    usefulFor: 'Website conversion',
    href: '/insights/why-your-website-looks-good-but-doesnt-convert',
    ctaLabel: 'Read article',
    image:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Clean office workspace used as a conversion website reference.',
    tags: ['Conversion', 'Websites'],
    imageShape: 'wide',
  },
  {
    num: '03',
    category: 'Visibility',
    title: 'Local SEO for Johannesburg Service Businesses',
    summary:
      'A beautiful website means nothing if nobody can find it. Local SEO is how Johannesburg service businesses show up when people are ready to call.',
    readTime: '8 min read',
    usefulFor: 'Search readiness',
    href: '/insights/local-seo-johannesburg-service-businesses',
    ctaLabel: 'Read article',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Local street and building detail representing local search visibility.',
    tags: ['SEO', 'Local'],
    imageShape: 'tall',
  },
  {
    num: '04',
    category: 'Dashboards',
    title: 'When Does a Business Need a Custom Dashboard or Client Portal',
    summary:
      "Most businesses don't need custom dashboards or client portals. They need to stop using spreadsheets and start using proper tools.",
    readTime: '10 min read',
    usefulFor: 'Operations systems',
    href: '/insights/when-does-a-business-need-a-custom-dashboard-or-client-portal',
    ctaLabel: 'Read article',
    image:
      'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Team reviewing a dashboard and workflow system.',
    tags: ['Dashboards', 'Systems'],
    imageShape: 'wide',
  },
  {
    num: '05',
    category: 'AI SEO',
    title: 'What AI SEO Actually Means for Small Business',
    summary:
      "ChatGPT, Perplexity, Google AI Overviews, Gemini. Everyone's talking about AI search. Most of it is hype. Some of it matters.",
    readTime: '9 min read',
    usefulFor: 'AI search readiness',
    href: '/insights/what-ai-seo-actually-means-for-small-business',
    ctaLabel: 'Read article',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Laptop screen and digital work setup for AI search research.',
    tags: ['AI SEO', 'Search'],
    imageShape: 'square',
  },
  {
    num: '06',
    category: 'Tool',
    title: 'Website Lead Leak Scorecard',
    summary:
      'A practical scorecard for finding the speed, mobile, trust, clarity, and CTA issues that stop website visitors from becoming leads.',
    readTime: '5 min tool',
    usefulFor: 'Conversion diagnosis',
    href: '/tools/website-lead-leak-scorecard',
    ctaLabel: 'Use tool',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Analytics dashboard showing website performance data.',
    tags: ['Tool', 'Scorecard'],
    imageShape: 'wide',
    icon: Gauge,
  },
  {
    num: '07',
    category: 'Tool',
    title: 'Local Visibility Scorecard',
    summary:
      'A Johannesburg-focused diagnostic for Google Business Profile, reviews, directories, suburb pages, local SEO, and AI-search visibility.',
    readTime: '8 min tool',
    usefulFor: 'Local search visibility',
    href: '/tools/local-visibility-scorecard',
    ctaLabel: 'Use tool',
    image:
      'https://images.unsplash.com/photo-1465447142348-e9952c393450?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'City street and storefronts representing local visibility.',
    tags: ['Tool', 'Local SEO'],
    imageShape: 'tall',
    icon: Search,
  },
  {
    num: '08',
    category: 'Tool',
    title: 'Lead Response Leak Calculator',
    summary:
      'A calculator for estimating monthly, annual, and three-year revenue loss from slow lead response, with automation ROI.',
    readTime: '4 min tool',
    usefulFor: 'Response automation',
    href: '/tools/lead-response-leak-calculator',
    ctaLabel: 'Use tool',
    image:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Business team responding to enquiries and workflow messages.',
    tags: ['Tool', 'Automation'],
    imageShape: 'square',
    icon: Calculator,
  },
  {
    num: '09',
    category: 'Tool',
    title: 'Website Rebuild vs Refresh Quiz',
    summary:
      'A decision quiz for choosing between a full rebuild, a design and content refresh, or focused optimization.',
    readTime: '6 min tool',
    usefulFor: 'Website scope decisions',
    href: '/tools/website-rebuild-vs-refresh-quiz',
    ctaLabel: 'Use tool',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Architectural structure used as a metaphor for rebuild decisions.',
    tags: ['Tool', 'Scope'],
    imageShape: 'wide',
    icon: RefreshCw,
  },
  {
    num: '10',
    category: 'Strategy',
    title: 'Do not build the system until the bottleneck is clear.',
    summary:
      'The wrong build can make complexity permanent. The right first step is a map of what is actually slowing the business down.',
    readTime: '7 min read',
    usefulFor: 'Project planning',
    href: '/services/consulting',
    ctaLabel: 'Related service',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Planning workshop with notes and strategy discussion.',
    tags: ['Strategy', 'Consulting'],
    imageShape: 'square',
  },
  {
    num: '11',
    category: 'Support',
    title: 'Launch is not the finish line.',
    summary:
      'A website or dashboard becomes useful through care, updates, fixes, and the small improvements that happen after launch.',
    readTime: '4 min read',
    usefulFor: 'After-launch care',
    href: '/services/maintenance',
    ctaLabel: 'Related service',
    image:
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Quiet workspace for ongoing support and site maintenance.',
    tags: ['Support', 'Care'],
    imageShape: 'tall',
  },
];

const articleNotes = insightNotes.filter((note) => note.href.startsWith('/insights/'));
const insightToolNotes = insightNotes.filter((note) => note.category === 'Tool');
const articleTags = Array.from(new Set(articleNotes.flatMap((note) => note.tags)));

const questionCards: QuestionCard[] = [
  {
    question: 'What should we budget?',
    body: 'Use the 2026 website-cost guide to compare quote ranges, hidden costs, and what changes the price.',
    path: 'Pricing guide',
    href: '/insights/website-cost-south-africa-2026',
    icon: PanelsTopLeft,
  },
  {
    question: 'Why are we not showing up?',
    body: 'Explore how local search, AI answers, reviews, and structured pages shape discoverability.',
    path: 'Local SEO guide',
    href: '/insights/local-seo-johannesburg-service-businesses',
    icon: Search,
  },
  {
    question: 'What should the dashboard show?',
    body: 'Think through the difference between useful operational signals and a screen full of numbers.',
    path: 'Dashboard guide',
    href: '/insights/when-does-a-business-need-a-custom-dashboard-or-client-portal',
    icon: ChartNoAxesCombined,
  },
  {
    question: 'What should we automate first?',
    body: 'Start with repeated work, missed follow-ups, manual reporting, and tasks with clear rules.',
    path: 'Automation service',
    href: '/services/automation',
    icon: Workflow,
  },
  {
    question: 'Where are leads leaking?',
    body: 'Run the scorecard to identify whether speed, mobile, trust, clarity, or forms are weakening enquiries.',
    path: 'Lead leak scorecard',
    href: '/tools/website-lead-leak-scorecard',
    icon: Gauge,
  },
  {
    question: 'What does slow response cost?',
    body: 'Use the calculator to turn lead volume, close rate, response time, and deal value into a monthly revenue leak.',
    path: 'Response calculator',
    href: '/tools/lead-response-leak-calculator',
    icon: Calculator,
  },
  {
    question: 'Should we rebuild or refresh?',
    body: 'Use the quiz to separate deep technical debt from design, messaging, and conversion optimization problems.',
    path: 'Rebuild vs refresh quiz',
    href: '/tools/website-rebuild-vs-refresh-quiz',
    icon: RefreshCw,
  },
];

const readingPaths: ReadingPath[] = [
  {
    title: 'Website clarity',
    eyebrow: 'Trust and conversion',
    body: 'For businesses reviewing whether the current site explains the offer, builds confidence, and makes enquiry feel obvious.',
    href: '/services/web-design',
    icon: PanelsTopLeft,
  },
  {
    title: 'Search readiness',
    eyebrow: 'Local and AI SEO',
    body: 'For teams that need their site, listings, service pages, FAQs, and proof points to be easier for search systems to understand.',
    href: '/services/seo',
    icon: Search,
  },
  {
    title: 'Operational systems',
    eyebrow: 'Dashboards and portals',
    body: 'For businesses trying to replace scattered tools with clearer client portals, internal dashboards, and decision surfaces.',
    href: '/services/saas-development',
    icon: BookOpenText,
  },
  {
    title: 'Workflow cleanup',
    eyebrow: 'Automation and support',
    body: 'For teams that want to reduce admin, tighten follow-ups, and keep digital systems healthy after launch.',
    href: '/services/automation',
    icon: Sparkles,
  },
];

const rhythmSteps: RhythmStep[] = [
  {
    num: '01',
    title: 'Diagnose',
    body: 'Start with a real business question, not a trend. What is unclear, slow, invisible, or manual?',
  },
  {
    num: '02',
    title: 'Explain',
    body: 'Turn the messy problem into language a founder, team, or client can actually use.',
  },
  {
    num: '03',
    title: 'Apply',
    body: 'Connect the insight back to a practical next move: fix the page, map the workflow, or build the system.',
  },
];

const insightCardStyles = [
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

const utilityCardHoverStyles = [
  'hover:border-[#DD6211] hover:bg-[#DD6211] hover:text-[#060808]',
  'hover:border-[#5F9FAA] hover:bg-[#5F9FAA] hover:text-[#060808]',
  'hover:border-[#C7AA94] hover:bg-[#C7AA94] hover:text-[#060808]',
  'hover:border-[#B92717] hover:bg-[#B92717] hover:text-[#FFF6E9]',
  'hover:border-[#FAE18F] hover:bg-[#FAE18F] hover:text-[#060808]',
  'hover:border-[#596C72] hover:bg-[#596C72] hover:text-[#FFF6E9]',
];

const diagnosticToolHoverStyles = [
  'hover:border-[#FAE18F] hover:bg-[#FAE18F] hover:text-[#060808]',
  'hover:border-[#5F9FAA] hover:bg-[#5F9FAA] hover:text-[#060808]',
  'hover:border-[#C7AA94] hover:bg-[#C7AA94] hover:text-[#060808]',
  'hover:border-[#B92717] hover:bg-[#B92717] hover:text-[#FFF6E9]',
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
      initial={reduceMotion ? false : { opacity: 0, x: -28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-15% 0px -10% 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
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

function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
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

function SecondaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
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

function InsightsGridLines() {
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

function HeroInsightCard({ note, index }: { note: InsightNote; index: number }) {
  const style = insightCardStyles[index % insightCardStyles.length];

  return (
    <Link
      href={note.href}
      className={`group relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-[2.25rem] p-7 shadow-[0_28px_70px_rgba(21,20,25,0.12)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-[0_34px_86px_rgba(21,20,25,0.18)] md:p-9 ${style.card}`}
      style={{ zIndex: index + 1 }}
    >
      <div>
        <div className="flex items-start justify-between gap-8">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] opacity-[0.68]">
            {note.num}
          </span>
          <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.05rem] border transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:rotate-3 ${style.icon}`}>
            <BookOpenText className="h-6 w-6" strokeWidth={1.8} />
          </span>
        </div>
        <p className="mt-10 font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.22em] opacity-[0.68]">
          {note.category}
        </p>
        <h2 className="mt-4 max-w-2xl font-playfair text-[clamp(2.25rem,4.4vw,4.3rem)] font-bold leading-[0.94] tracking-tight">
          {note.title}
        </h2>
        <p className="mt-6 max-w-xl font-montserrat text-base leading-7 opacity-[0.78]">
          {note.summary}
        </p>
      </div>

      <span className={`mt-10 inline-flex min-h-12 w-fit items-center justify-center gap-3 rounded-full px-6 font-montserrat text-xs font-bold uppercase tracking-[0.12em] transition-colors ${style.cta}`}>
        <AnimatedLinkText hiddenClassName={style.hidden}>{note.ctaLabel}</AnimatedLinkText>
        <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

function HeroSection() {
  return (
    <section className="content-gutter relative z-10 py-24 md:py-28 lg:py-24">
      <div className="relative grid gap-12 lg:min-h-[125vh] lg:grid-cols-[minmax(0,0.82fr)_minmax(420px,1fr)] lg:items-start lg:gap-16">
        <div className="lg:sticky lg:top-20 lg:-mt-8 lg:self-start">
          <SectionLabel>Insights</SectionLabel>
          <h1 className="mt-8 max-w-5xl font-playfair text-[clamp(3.05rem,7.4vw,7.4rem)] font-bold leading-[0.93] tracking-tight text-[#151419] dark:text-[#FBFBFB]">
            Field notes for the systems behind the business.
          </h1>
          <p className="mt-8 max-w-2xl font-montserrat text-base leading-8 text-[#151419]/70 dark:text-[#FBFBFB]/68 md:text-lg">
            Practical thinking on websites, dashboards, visibility, automation,
            and the decisions that make digital work easier to understand.
          </p>
          <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <PrimaryButton href="#insight-library">Explore notes</PrimaryButton>
            <SecondaryButton href="/services">See services</SecondaryButton>
          </div>
        </div>

        <div className="relative grid content-start gap-10 lg:ml-auto lg:w-[95%]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-12 -left-16 hidden h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(21,20,25,0.24)_1.2px,transparent_1.2px)] bg-[length:12px_12px] opacity-60 [mask-image:radial-gradient(circle_at_center,black_0%,black_55%,transparent_78%)] dark:bg-[radial-gradient(circle,rgba(251,251,251,0.3)_1.2px,transparent_1.2px)] dark:opacity-35 lg:block"
          />
          {articleNotes.slice(0, 4).map((note, index) => (
            <HeroInsightCard key={note.title} note={note} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function QuestionCardLink({
  card,
  index,
}: {
  card: QuestionCard;
  index: number;
}) {
  const Icon = card.icon;
  const hoverStyle = utilityCardHoverStyles[index % utilityCardHoverStyles.length];

  return (
    <Link
      href={card.href}
      className={`group flex min-h-[19rem] w-[19.5rem] shrink-0 flex-col justify-between rounded-[1.35rem] border border-[#151419]/10 bg-[#F0EFED] p-6 text-[#151419] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_22px_54px_rgba(21,20,25,0.14)] dark:border-[#FBFBFB]/10 dark:bg-[#F0EFED] dark:text-[#151419] md:w-[21rem] ${hoverStyle}`}
    >
      <div>
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-current/60">
            {String(index + 1).padStart(2, '0')}
          </span>
          <Icon
            className="h-5 w-5 text-current/34 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:rotate-3"
            strokeWidth={1.7}
          />
        </div>
        <h3 className="mt-7 font-playfair text-3xl font-bold leading-none tracking-tight">
          {card.question}
        </h3>
        <p className="mt-5 font-montserrat text-sm leading-7 text-current/64">
          {card.body}
        </p>
      </div>
      <div className="mt-10 flex items-center justify-between border-t border-current/10 pt-4">
        <span className="font-montserrat text-[0.7rem] font-bold uppercase tracking-[0.18em]">
          {card.path}
        </span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function QuestionChooser() {
  const carouselCards = [...questionCards, ...questionCards];

  return (
    <section id="start-question" className="content-gutter relative z-10 py-20 md:py-28">
      <div className="grid gap-12 min-[900px]:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] min-[900px]:items-center">
        <div className="max-w-3xl">
          <SectionLabel>Start with the question</SectionLabel>
          <h2 className="mt-5 font-playfair text-[clamp(2.8rem,6.7vw,6.6rem)] font-bold leading-[0.94] tracking-tight text-[#151419] dark:text-[#FBFBFB]">
            What are you trying to understand?
          </h2>
          <p className="mt-6 max-w-xl font-montserrat text-base leading-8 text-[#151419]/65 dark:text-[#FBFBFB]/62">
            The insights page should help a client find the thinking that
            matches the problem they are already feeling.
          </p>
        </div>

        <div className="insight-question-carousel group/carousel relative overflow-hidden py-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-4 left-0 z-10 w-20 bg-gradient-to-r from-[#F0EFED] via-[#F0EFED]/82 to-transparent backdrop-blur-[2px] dark:from-[#151419] dark:via-[#151419]/82"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-4 right-0 z-10 w-20 bg-gradient-to-l from-[#F0EFED] via-[#F0EFED]/82 to-transparent backdrop-blur-[2px] dark:from-[#151419] dark:via-[#151419]/82"
          />
          <div className="insight-question-carousel-track flex w-max gap-4 pr-4">
            {carouselCards.map((card, index) => (
              <QuestionCardLink
                key={`${card.question}-${index}`}
                card={card}
                index={index % questionCards.length}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TagButton({
  tag,
  isActive,
  onSelect,
}: {
  tag: string;
  isActive: boolean;
  onSelect: (tag: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(tag)}
      className={`rounded-full border px-2.5 py-1 font-montserrat text-[0.62rem] font-bold leading-none transition-colors duration-200 ${
        isActive
          ? 'border-[#DD6211] bg-[#DD6211] text-[#060808]'
          : 'border-transparent bg-[#151419]/7 text-[#060808] hover:border-[#DD6211] hover:bg-transparent hover:text-[#DD6211]'
      }`}
    >
      {tag}
    </button>
  );
}

function BlogGridCard({
  note,
  index,
  selectedTag,
  onTagSelect,
}: {
  note: InsightNote;
  index: number;
  selectedTag: string;
  onTagSelect: (tag: string) => void;
}) {
  const imageHeight =
    index % 2 === 0 ? 'h-[25rem] md:h-[28rem]' : 'h-[17rem] md:h-[18.75rem]';

  return (
    <article
      className="group block text-[#060808] transition-transform duration-300 ease-out hover:-translate-y-1"
      style={{ transitionDelay: `${Math.min(index * 16, 96)}ms` }}
    >
      <Link
        href={note.href}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-[#FC6E20] focus-visible:ring-offset-4 focus-visible:ring-offset-[#F0EFED]"
      >
        <div className={`relative overflow-hidden rounded-[0.55rem] bg-[#151419]/8 ${imageHeight}`}>
          <Image
            src={note.image}
            alt={note.imageAlt}
            fill
            sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
            className="object-cover transition duration-500 ease-out group-hover:scale-[1.045]"
          />
          <div className="absolute inset-0 bg-[#060808]/0 transition-colors duration-300 group-hover:bg-[#060808]/10" />
        </div>

        <div className="pt-4">
          <p className="font-montserrat text-[0.72rem] font-medium leading-none text-[#060808]/66">
            {note.category} - {note.readTime}
          </p>
          <h3 className="mt-2 max-w-[34rem] font-montserrat text-[1.05rem] font-extrabold leading-[1.14] tracking-normal text-[#060808] transition-colors duration-300 group-hover:text-[#DD6211] md:text-[1.08rem]">
            {note.title}
          </h3>
        </div>
      </Link>

      <div className="mt-3 flex flex-wrap gap-2">
        {note.tags.map((tag) => (
          <TagButton
            key={tag}
            tag={tag}
            isActive={selectedTag === tag}
            onSelect={onTagSelect}
          />
        ))}
      </div>
    </article>
  );
}

function InsightLibrary() {
  const [selectedTag, setSelectedTag] = useState('All');
  const filteredArticleNotes = useMemo(
    () =>
      selectedTag === 'All'
        ? articleNotes
        : articleNotes.filter((note) => note.tags.includes(selectedTag)),
    [selectedTag],
  );

  return (
    <section id="insight-library" className="content-gutter relative z-10 py-16 md:py-24">
      <Reveal className="max-w-4xl">
        <SectionLabel>All field notes</SectionLabel>
        <h2 className="mt-5 font-playfair text-[clamp(2.8rem,6vw,5.9rem)] font-bold leading-[0.94] tracking-tight text-[#151419] dark:text-[#FBFBFB]">
          Browse the working library.
        </h2>
        <p className="mt-6 max-w-2xl font-montserrat text-base leading-8 text-[#151419]/64 dark:text-[#FBFBFB]/60">
          Featured notes get the larger scroll moment above. Everything else
          lives here as a fast-scanning archive for pricing, conversion,
          visibility, and systems thinking.
        </p>
      </Reveal>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedTag('All')}
          className={`rounded-full border px-4 py-2 font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.12em] transition-colors ${
            selectedTag === 'All'
              ? 'border-[#060808] bg-[#060808] text-[#FBFBFB]'
              : 'border-[#151419]/12 bg-[#F0EFED] text-[#060808]/70 hover:border-[#DD6211] hover:text-[#DD6211]'
          }`}
        >
          All
        </button>
        {articleTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setSelectedTag(tag)}
            className={`rounded-full border px-4 py-2 font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.12em] transition-colors ${
              selectedTag === tag
                ? 'border-[#DD6211] bg-[#DD6211] text-[#060808]'
                : 'border-[#151419]/12 bg-[#F0EFED] text-[#060808]/70 hover:border-[#DD6211] hover:text-[#DD6211]'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="mt-12 grid gap-10 md:hidden">
        {filteredArticleNotes.map((note, index) => (
          <BlogGridCard
            key={note.title}
            note={note}
            index={index}
            selectedTag={selectedTag}
            onTagSelect={setSelectedTag}
          />
        ))}
      </div>

      <div className="mt-12 hidden gap-5 md:grid md:grid-cols-3">
        {[0, 1, 2].map((column) => (
          <div key={column} className="grid content-start gap-10">
            {filteredArticleNotes
              .filter((_, index) => index % 3 === column)
              .map((note, index) => (
                <BlogGridCard
                  key={note.title}
                  note={note}
                  index={column + index * 3}
                  selectedTag={selectedTag}
                  onTagSelect={setSelectedTag}
                />
              ))}
          </div>
        ))}
      </div>

      <Reveal delay={0.14}>
        <div className="mt-12 flex items-center gap-4 font-montserrat text-sm font-bold text-[#060808] dark:text-[#FBFBFB] md:mt-16">
          <span className="mr-2 font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#060808]/45 dark:text-[#FBFBFB]/45">
            {filteredArticleNotes.length} shown
          </span>
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#060808] text-xs text-[#FBFBFB]">
            1
          </span>
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs text-[#060808]/70 transition-colors hover:bg-[#151419]/8 dark:text-[#FBFBFB]/70">
            2
          </span>
          <Link
            href="#insight-library"
            aria-label="Next insights page"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-[#151419]/8"
          >
            <ArrowRight className="h-4 w-4" strokeWidth={1.9} />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

function InsightToolCard({ note, index }: { note: InsightNote; index: number }) {
  const Icon = note.icon ?? Gauge;
  const hoverStyle = diagnosticToolHoverStyles[index % diagnosticToolHoverStyles.length];
  const isPatternInterrupt = index === 3;

  return (
    <Link
      href={note.href}
      className={`group flex min-h-[21rem] flex-col justify-between rounded-[1.35rem] p-6 transition-all duration-300 ease-out md:p-7 ${
        isPatternInterrupt
          ? 'border border-[#DD6211] bg-[#DD6211] text-[#060808] sm:-rotate-3 hover:-translate-y-1 hover:rotate-0 hover:border-[#151419]/10 hover:bg-[#F0EFED] hover:text-[#151419]'
          : `border border-[#151419]/10 bg-[#F0EFED] text-[#151419] hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_22px_54px_rgba(21,20,25,0.13)] dark:border-[#FBFBFB]/10 dark:bg-[#F0EFED] dark:text-[#151419] ${hoverStyle}`
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-6">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-current/55">
            {String(index + 1).padStart(2, '0')}
          </span>
          <Icon
            className="h-5 w-5 text-current/38 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:rotate-3"
            strokeWidth={1.7}
          />
        </div>

        <h3 className="mt-9 max-w-xs font-playfair text-[clamp(2rem,3.2vw,3.3rem)] font-bold leading-[0.94] tracking-tight">
          {note.title}
        </h3>
        <p className="mt-6 max-w-sm font-montserrat text-sm leading-7 text-current/62">
          {note.summary}
        </p>
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-current/10 pt-5">
        <span className="font-montserrat text-[0.7rem] font-bold uppercase tracking-[0.18em]">
          {note.ctaLabel}
        </span>
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function InsightsToolsSection() {
  return (
    <section id="diagnostic-tools" className="content-gutter relative z-10 py-16 md:py-24">
      <div className="grid gap-10 md:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] md:items-start">
        <div className="md:sticky md:top-28 md:self-start">
          <SectionLabel>Diagnostic tools</SectionLabel>
          <h2 className="mt-5 font-playfair text-[clamp(2.8rem,6vw,5.9rem)] font-bold leading-[0.94] tracking-tight text-[#151419] dark:text-[#FBFBFB]">
            Run the diagnosis before the rebuild.
          </h2>
          <p className="mt-6 max-w-md font-montserrat text-base leading-8 text-[#151419]/64 dark:text-[#FBFBFB]/60">
            Articles explain the thinking. These tools turn that thinking into a
            quick score, calculator, or decision path you can act on.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {insightToolNotes.map((note, index) => (
            <InsightToolCard key={note.title} note={note} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReadingPaths() {
  return (
    <section className="relative z-10 overflow-hidden bg-[#060808] py-20 text-[#FBFBFB] md:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[29%] top-1/2 hidden h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.2)_1.1px,transparent_1.1px)] bg-[length:13px_13px] opacity-45 [mask-image:radial-gradient(circle_at_center,black_0%,black_48%,transparent_73%)] lg:block"
      />
      <div className="content-gutter">
        <Reveal className="max-w-4xl">
          <SectionLabel>Reading paths</SectionLabel>
          <h2 className="mt-5 font-playfair text-[clamp(2.8rem,6.8vw,6.6rem)] font-bold leading-[0.94] tracking-tight">
            Follow the topic that matches the business problem.
          </h2>
        </Reveal>

        <div className="mt-12 grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-4">
          {readingPaths.map((path, index) => {
            const Icon = path.icon;
            const style = insightCardStyles[index % insightCardStyles.length];

            return (
              <Reveal key={path.title} delay={index * 0.06} className="h-full">
                <Link
                  href={path.href}
                  className={`group flex h-full min-h-[26rem] flex-col justify-between rounded-[1.35rem] p-6 shadow-[0_22px_60px_rgba(0,0,0,0.22)] transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.01] md:p-8 ${style.card}`}
                >
                  <div>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-[1.05rem] border transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:rotate-3 ${style.icon}`}>
                      <Icon className="h-5 w-5" strokeWidth={1.7} />
                    </div>
                    <p className="mt-8 font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.22em] opacity-[0.68]">
                      {path.eyebrow}
                    </p>
                    <h3 className="mt-4 font-playfair text-4xl font-bold leading-none tracking-tight">
                      {path.title}
                    </h3>
                    <p className="mt-5 font-montserrat text-sm leading-7 opacity-[0.72]">
                      {path.body}
                    </p>
                  </div>
                  <span className={`mt-10 inline-flex min-h-12 w-fit items-center justify-center gap-3 rounded-full px-6 font-montserrat text-xs font-bold uppercase tracking-[0.12em] transition-colors ${style.cta}`}>
                    <AnimatedLinkText hiddenClassName={style.hidden}>Explore service</AnimatedLinkText>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PublishingRhythm() {
  return (
    <section className="content-gutter relative z-10 py-20 md:py-28">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
        <Reveal>
          <SectionLabel>Publishing rhythm</SectionLabel>
          <h2 className="mt-5 font-playfair text-[clamp(2.7rem,5.8vw,5.6rem)] font-bold leading-[0.95] tracking-tight text-[#151419] dark:text-[#FBFBFB]">
            Every note should earn its place.
          </h2>
        </Reveal>

        <div className="rhythm-card-list grid gap-4">
          {rhythmSteps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.08}>
              <article className="rhythm-card grid gap-5 rounded-[1.35rem] border border-[#151419]/10 bg-[#F0EFED] p-6 text-[#151419] transition-all duration-300 ease-out hover:relative hover:z-10 hover:-translate-y-1 hover:shadow-[0_22px_54px_rgba(21,20,25,0.12)] dark:border-[#FBFBFB]/10 dark:bg-[#1B1B1E] dark:text-[#FBFBFB] md:grid-cols-[0.25fr_0.45fr_1fr] md:p-8">
                <span className="font-mono text-[0.72rem] uppercase tracking-[0.24em] text-[#FC6E20]">
                  {step.num}
                </span>
                <h3 className="font-playfair text-4xl font-bold leading-none tracking-tight text-[#151419] dark:text-[#FBFBFB]">
                  {step.title}
                </h3>
                <p className="font-montserrat text-sm leading-7 text-[#151419]/64 dark:text-[#FBFBFB]/60">
                  {step.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="content-gutter relative z-10 pb-24 pt-12 md:pb-32 md:pt-16">
      <Reveal>
        <ExpandingCtaBackground>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <SectionLabel>Apply the thinking</SectionLabel>
              <h2 className="mt-5 max-w-4xl font-playfair text-[clamp(2.7rem,6.6vw,6.8rem)] font-bold leading-[0.9] tracking-tight">
                Useful ideas are better when they become working systems.
              </h2>
              <p className="mt-6 max-w-2xl font-montserrat text-base leading-8 text-[#151419]/64">
                If one of these notes sounds like the problem inside your
                business, bring the messy version. We will help turn it into a
                clear next move.
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

export function InsightsClient() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#F0EFED] text-[#151419] selection:bg-[#FC6E20] selection:text-[#151419] [--left-gutter:4.5rem] [--right-gutter:1rem] dark:bg-[#151419] dark:text-[#FBFBFB] sm:[--left-gutter:4.75rem] sm:[--right-gutter:1.5rem] lg:[--left-gutter:5.5rem] lg:[--right-gutter:3.5rem] xl:[--right-gutter:75px]">
      <InsightsGridLines />
      <HeroSection />
      <QuestionChooser />
      <InsightLibrary />
      <InsightsToolsSection />
      <ReadingPaths />
      <PublishingRhythm />
      <FinalCta />
    </main>
  );
}
