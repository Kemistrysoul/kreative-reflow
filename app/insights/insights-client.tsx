'use client';

import Link from 'next/link';
import type React from 'react';
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

type InsightNote = {
  num: string;
  category: string;
  title: string;
  summary: string;
  readTime: string;
  usefulFor: string;
  href: string;
  ctaLabel: string;
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
  },
];

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

function EditorialMap() {
  const reduceMotion = useReducedMotion();
  const items = ['Question', 'Signal', 'Pattern', 'Decision'];

  return (
    <div className="relative min-h-[28rem] overflow-hidden border border-[#151419]/10 bg-[#151419] p-5 text-[#FBFBFB] shadow-2xl shadow-[#151419]/10 dark:border-[#FBFBFB]/10 dark:bg-[#1B1B1E] sm:min-h-[30rem]">
      <div className="flex items-center justify-between border-b border-white/10 pb-4 font-mono text-[0.65rem] uppercase tracking-[0.24em] text-white/45">
        <span>Editorial radar</span>
        <span>Notes 01-06</span>
      </div>

      <div className="absolute left-1/2 top-[54%] h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
      <div className="absolute left-1/2 top-[54%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#FC6E20]/30" />
      <div className="absolute left-1/2 top-[54%] h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
      <div className="absolute left-1/2 top-[54%] h-px w-[68%] -translate-x-1/2 rotate-[-16deg] bg-[#FC6E20]/70" />
      <div className="absolute left-1/2 top-[54%] h-px w-[58%] -translate-x-1/2 rotate-[31deg] bg-white/16" />

      <div className="relative z-10 mt-8 grid grid-cols-2 gap-2 sm:hidden">
        {items.map((item, index) => (
          <div
            key={item}
            className="border border-white/10 bg-white/[0.075] px-3 py-3 font-montserrat text-xs font-semibold backdrop-blur"
          >
            <span className="mr-2 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[#FC6E20]">
              {String(index + 1).padStart(2, '0')}
            </span>
            {item}
          </div>
        ))}
      </div>

      {items.map((item, index) => (
        <motion.div
          key={item}
          className="absolute hidden border border-white/10 bg-white/[0.075] px-4 py-3 font-montserrat text-sm font-semibold backdrop-blur sm:block"
          style={{
            left: index === 0 ? '7%' : index === 1 ? '58%' : index === 2 ? '17%' : '54%',
            top: index === 0 ? '24%' : index === 1 ? '32%' : index === 2 ? '54%' : '60%',
          }}
          animate={reduceMotion ? undefined : { y: index % 2 === 0 ? [0, -7, 0] : [0, 7, 0] }}
          transition={{
            duration: 5 + index,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        >
          <span className="mr-3 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-[#FC6E20]">
            {String(index + 1).padStart(2, '0')}
          </span>
          {item}
        </motion.div>
      ))}

      <div className="relative z-10 mt-36 border-t border-white/10 pt-5 sm:absolute sm:inset-x-8 sm:bottom-7 sm:mt-0">
        <p className="max-w-sm font-montserrat text-sm leading-6 text-white/58">
          Useful thinking should point somewhere: clearer pages, better systems,
          cleaner workflows, or stronger visibility.
        </p>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="content-gutter relative z-10 grid min-h-screen grid-cols-1 items-start gap-12 py-28 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.78fr)] lg:items-center lg:gap-16 lg:py-32">
      <div className="min-w-0">
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

      <div className="min-w-0">
        <EditorialMap />
      </div>
    </section>
  );
}

function QuestionChooser() {
  return (
    <section className="content-gutter relative z-10 py-20 md:py-28">
      <Reveal className="max-w-3xl">
        <SectionLabel>Start with the question</SectionLabel>
        <h2 className="mt-5 font-playfair text-[clamp(2.6rem,6vw,5.8rem)] font-bold leading-[0.96] tracking-tight text-[#151419] dark:text-[#FBFBFB]">
          What are you trying to understand?
        </h2>
        <p className="mt-6 max-w-2xl font-montserrat text-base leading-8 text-[#151419]/65 dark:text-[#FBFBFB]/62">
          The insights page should help a client find the thinking that matches
          the problem they are already feeling.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {questionCards.map((card, index) => {
          const Icon = card.icon;

          return (
            <Reveal key={card.question} delay={index * 0.06}>
              <Link
                href={card.href}
                className="group flex min-h-[19rem] flex-col justify-between border border-[#151419]/10 bg-[#FBFBFB]/70 p-6 text-[#151419] transition-colors duration-300 hover:border-[#FC6E20] hover:bg-[#151419] hover:text-[#FBFBFB] dark:border-[#FBFBFB]/10 dark:bg-[#1B1B1E] dark:text-[#FBFBFB] dark:hover:border-[#FC6E20]"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[#FC6E20]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <Icon className="h-5 w-5 text-current/34 group-hover:text-[#FC6E20]" strokeWidth={1.7} />
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
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function InsightNoteCard({ note, index }: { note: InsightNote; index: number }) {
  const anchor =
    note.category === 'Websites'
      ? 'note-websites'
      : note.category === 'Dashboards'
        ? 'note-dashboards'
        : note.category === 'Visibility'
          ? 'note-visibility'
          : note.category === 'Automation'
            ? 'note-automation'
            : undefined;

  return (
    <Reveal delay={index * 0.05}>
      <article
        id={anchor}
        className="grid gap-6 border-t border-[#151419]/10 py-8 dark:border-[#FBFBFB]/10 lg:grid-cols-[0.35fr_1fr_0.42fr]"
      >
        <div className="flex items-start justify-between gap-4 lg:block">
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.24em] text-[#FC6E20]">
            {note.num}
          </span>
          <span className="font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#151419]/45 dark:text-[#FBFBFB]/42 lg:mt-10 lg:block">
            {note.readTime}
          </span>
        </div>

        <div>
          <span className="font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#FC6E20]">
            {note.category}
          </span>
          <h3 className="mt-4 max-w-3xl font-playfair text-[clamp(2.1rem,4.2vw,4.7rem)] font-bold leading-[0.96] tracking-tight text-[#151419] dark:text-[#FBFBFB]">
            {note.title}
          </h3>
          <p className="mt-5 max-w-2xl font-montserrat text-sm leading-7 text-[#151419]/64 dark:text-[#FBFBFB]/60 md:text-base md:leading-8">
            {note.summary}
          </p>
        </div>

        <div className="flex flex-col justify-between gap-8 border-[#151419]/10 dark:border-[#FBFBFB]/10 lg:border-l lg:pl-8">
          <div>
            <p className="font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#151419]/42 dark:text-[#FBFBFB]/40">
              Useful for
            </p>
            <p className="mt-3 font-montserrat text-sm font-semibold text-[#151419] dark:text-[#FBFBFB]">
              {note.usefulFor}
            </p>
          </div>
          <Link
            href={note.href}
            className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#151419] px-5 py-3 font-montserrat text-xs font-bold uppercase tracking-[0.08em] text-[#FBFBFB] transition-colors hover:bg-[#FC6E20] hover:text-[#151419] dark:bg-[#FBFBFB] dark:text-[#151419] dark:hover:bg-[#FC6E20]"
          >
            {note.ctaLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </article>
    </Reveal>
  );
}

function InsightLibrary() {
  return (
    <section id="insight-library" className="content-gutter relative z-10 py-16 md:py-24">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <SectionLabel>Insight library</SectionLabel>
          <h2 className="mt-5 font-playfair text-[clamp(2.8rem,6vw,5.9rem)] font-bold leading-[0.94] tracking-tight text-[#151419] dark:text-[#FBFBFB]">
            Not hot takes. Working notes.
          </h2>
          <p className="mt-6 max-w-md font-montserrat text-base leading-8 text-[#151419]/64 dark:text-[#FBFBFB]/60">
            These notes are placeholders for the kind of thinking the studio
            should publish and the tools clients can use: practical, grounded,
            and tied to decisions they actually need to make.
          </p>
        </Reveal>

        <div>
          {insightNotes.map((note, index) => (
            <InsightNoteCard key={note.title} note={note} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReadingPaths() {
  return (
    <section className="relative z-10 bg-[#151419] py-20 text-[#FBFBFB] dark:bg-[#1B1B1E] md:py-28">
      <div className="content-gutter">
        <Reveal className="max-w-4xl">
          <SectionLabel>Reading paths</SectionLabel>
          <h2 className="mt-5 font-playfair text-[clamp(2.8rem,6.8vw,6.6rem)] font-bold leading-[0.94] tracking-tight">
            Follow the topic that matches the business problem.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {readingPaths.map((path, index) => {
            const Icon = path.icon;

            return (
              <Reveal key={path.title} delay={index * 0.06}>
                <Link
                  href={path.href}
                  className="group flex min-h-[22rem] flex-col justify-between border border-white/10 bg-white/[0.035] p-6 transition-colors hover:border-[#FC6E20] hover:bg-white/[0.065] md:p-8"
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center border border-white/12 bg-white/[0.04] text-[#FC6E20]">
                      <Icon className="h-5 w-5" strokeWidth={1.7} />
                    </div>
                    <p className="mt-8 font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#FC6E20]">
                      {path.eyebrow}
                    </p>
                    <h3 className="mt-4 font-playfair text-4xl font-bold leading-none tracking-tight">
                      {path.title}
                    </h3>
                    <p className="mt-5 font-montserrat text-sm leading-7 text-white/62">
                      {path.body}
                    </p>
                  </div>
                  <span className="mt-10 inline-flex items-center gap-3 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-white/82">
                    <AnimatedLinkText>Explore service</AnimatedLinkText>
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

        <div className="grid gap-4">
          {rhythmSteps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.08}>
              <article className="grid gap-5 border border-[#151419]/10 bg-[#FBFBFB]/70 p-6 dark:border-[#FBFBFB]/10 dark:bg-[#1B1B1E] md:grid-cols-[0.25fr_0.45fr_1fr] md:p-8">
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
    <section className="content-gutter relative z-10 py-20 md:py-28">
      <Reveal>
        <div className="border border-[#151419]/10 bg-[#FBFBFB]/70 p-7 dark:border-[#FBFBFB]/10 dark:bg-[#1B1B1E] md:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <SectionLabel>Apply the thinking</SectionLabel>
              <h2 className="mt-5 max-w-4xl font-playfair text-[clamp(2.7rem,6.6vw,6.8rem)] font-bold leading-[0.9] tracking-tight text-[#151419] dark:text-[#FBFBFB]">
                Useful ideas are better when they become working systems.
              </h2>
              <p className="mt-6 max-w-2xl font-montserrat text-base leading-8 text-[#151419]/64 dark:text-[#FBFBFB]/62">
                If one of these notes sounds like the problem inside your
                business, bring the messy version. We will help turn it into a
                clear next move.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <PrimaryButton href="/contact">Start a project</PrimaryButton>
              <SecondaryButton href="/services">View services</SecondaryButton>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function InsightsClient() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#F0EFED] text-[#151419] selection:bg-[#FC6E20] selection:text-[#151419] [--left-gutter:4.5rem] [--right-gutter:1rem] dark:bg-[#151419] dark:text-[#FBFBFB] sm:[--left-gutter:4.75rem] sm:[--right-gutter:1.5rem] lg:[--left-gutter:5.5rem] lg:[--right-gutter:3.5rem] xl:[--right-gutter:4rem]">
      <InsightsGridLines />
      <HeroSection />
      <QuestionChooser />
      <InsightLibrary />
      <ReadingPaths />
      <PublishingRhythm />
      <FinalCta />
    </main>
  );
}
