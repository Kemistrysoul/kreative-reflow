'use client';

import Link from 'next/link';
import type React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  CheckCircle2,
  CircleDot,
  Compass,
  Layers3,
  PanelTop,
  Search,
  Workflow,
  Wrench,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { AnimatedLinkText } from '@/components/AnimatedTextLink';

type ServiceChapter = {
  num: string;
  slug: string;
  eyebrow: string;
  title: string;
  shortTitle: string;
  for: string;
  problem: string;
  outcome: string;
  includes: string[];
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
};

type ChooserCard = {
  title: string;
  body: string;
  match: string;
  href: string;
};

type ComboCard = {
  title: string;
  services: string;
  body: string;
};

type ProcessStep = {
  num: string;
  title: string;
  body: string;
};

type IncludedItem = {
  title: string;
  body: string;
};

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const serviceChapters: ServiceChapter[] = [
  {
    num: '01',
    slug: 'web-design',
    eyebrow: 'Trust and conversion',
    title: 'Web Design & Development',
    shortTitle: 'Website',
    for: 'For businesses that need a serious digital home, not another template.',
    problem:
      'Your site needs to explain what you do, earn trust quickly, and turn attention into enquiries without making visitors work for it.',
    outcome:
      'A custom website that feels aligned with your brand, performs properly, and gives clients a clear path to act.',
    includes: ['Custom UI direction', 'Responsive build', 'Conversion copy flow', 'Launch-ready handover'],
    icon: PanelTop,
  },
  {
    num: '02',
    slug: 'saas-development',
    eyebrow: 'Systems and portals',
    title: 'SaaS & Custom Web Applications',
    shortTitle: 'Dashboard',
    for: 'For teams that have outgrown spreadsheets, forms, and tools that almost fit.',
    problem:
      'The work is happening in too many places. Clients, files, tasks, payments, and updates need one system that follows how your business actually works.',
    outcome:
      'A custom portal, dashboard, booking flow, or internal tool that organizes the work behind the scenes.',
    includes: ['Product flow mapping', 'Dashboard UI', 'Role-aware workflows', 'Data-ready foundations'],
    icon: Layers3,
  },
  {
    num: '03',
    slug: 'seo',
    eyebrow: 'Visibility and discovery',
    title: 'Local & AI SEO',
    shortTitle: 'SEO',
    for: 'For businesses that need to be found by people already searching.',
    problem:
      'A strong website still loses momentum if Google, maps, and AI answers cannot understand or recommend the business clearly.',
    outcome:
      'A search-ready foundation that improves discoverability, local relevance, and content structure.',
    includes: ['Technical SEO checks', 'Local search structure', 'AI-search readiness', 'Content guidance'],
    icon: Search,
  },
  {
    num: '04',
    slug: 'automation',
    eyebrow: 'Less manual work',
    title: 'AI & Business Automation',
    shortTitle: 'Automation',
    for: 'For businesses repeating the same admin, follow-up, and reporting work every week.',
    problem:
      'Manual tasks slow the team down, create missed follow-ups, and make simple operations feel heavier than they should.',
    outcome:
      'Automated workflows that handle repetitive tasks and keep people focused on the work that needs judgement.',
    includes: ['Workflow audit', 'AI-assisted flows', 'Form and email logic', 'Reporting automation'],
    icon: Workflow,
  },
  {
    num: '05',
    slug: 'consulting',
    eyebrow: 'Clarity before build',
    title: 'Business & Tech Consulting',
    shortTitle: 'Strategy',
    for: 'For founders and teams that know something needs to change, but not what to build first.',
    problem:
      'Jumping straight into tools can waste time. The better move is to map the business, identify the bottleneck, and choose the right next system.',
    outcome:
      'A practical roadmap that separates what matters now from what can wait.',
    includes: ['Discovery session', 'Systems map', 'Priority roadmap', 'Build recommendation'],
    icon: Compass,
  },
  {
    num: '06',
    slug: 'maintenance',
    eyebrow: 'After launch support',
    title: 'Maintenance & Support',
    shortTitle: 'Support',
    for: 'For businesses that need their website or system to stay fast, secure, and current.',
    problem:
      'Launch is not the end. Sites need updates, fixes, monitoring, and someone who understands how the build works.',
    outcome:
      'A supported digital product that keeps improving instead of slowly becoming a liability.',
    includes: ['Security updates', 'Performance checks', 'Content changes', 'Direct support'],
    icon: Wrench,
  },
];

const chooserCards: ChooserCard[] = [
  {
    title: 'I need more trust and leads',
    body: 'Your current presence is not giving people enough confidence to enquire.',
    match: 'Website + SEO',
    href: '#service-web-design',
  },
  {
    title: 'I need a website that converts',
    body: 'You need a clear offer, polished experience, and a path from visit to action.',
    match: 'Web Design',
    href: '#service-web-design',
  },
  {
    title: 'I need a dashboard or internal system',
    body: 'Your team needs one place to manage clients, work, assets, or operations.',
    match: 'SaaS + Custom Apps',
    href: '#service-saas-development',
  },
  {
    title: 'I need automation and support',
    body: 'The same tasks keep repeating and the system needs care after launch.',
    match: 'Automation + Maintenance',
    href: '#service-automation',
  },
];

const comboCards: ComboCard[] = [
  {
    title: 'Website + SEO',
    services: 'For visibility',
    body: 'A conversion-focused website paired with local and AI-search structure, so the right people can find and understand the offer.',
  },
  {
    title: 'Dashboard + Automation',
    services: 'For operations',
    body: 'A custom workspace with workflows that reduce admin, connect moving parts, and make daily work easier to manage.',
  },
  {
    title: 'Launch + Maintenance',
    services: 'For momentum',
    body: 'A supported launch with ongoing updates, performance checks, and practical care after the project goes live.',
  },
];

const processSteps: ProcessStep[] = [
  {
    num: '01',
    title: 'Discover',
    body: 'We map what you sell, who needs it, where the friction sits, and what the service needs to solve first.',
  },
  {
    num: '02',
    title: 'Build',
    body: 'The work moves through strategy, design, development, review, and testing with clear check-ins along the way.',
  },
  {
    num: '03',
    title: 'Launch & Grow',
    body: 'We ship the live product, hand it over properly, and keep the door open for support, SEO, automation, and iteration.',
  },
];

const includedItems: IncludedItem[] = [
  {
    title: 'Strategy',
    body: 'A focused plan before design or code begins.',
  },
  {
    title: 'Design',
    body: 'A visual system that feels specific to your business.',
  },
  {
    title: 'Development',
    body: 'A responsive build made for real devices and real users.',
  },
  {
    title: 'Launch support',
    body: 'Testing, polish, deployment, and launch preparation.',
  },
  {
    title: 'Handover',
    body: 'Clear guidance so you understand what has been built.',
  },
  {
    title: 'Optional support',
    body: 'Maintenance, improvements, and automation after launch.',
  },
];

const faqItems: FaqItem[] = [
  {
    id: '01',
    question: 'How do I know which service is right for me?',
    answer:
      'Start with a discovery call. We will talk through the current business, the friction, and the outcome you need. From there, you get a practical recommendation, even if that means starting smaller than expected.',
  },
  {
    id: '02',
    question: 'Do you show pricing on the website?',
    answer:
      'Not for this kind of work. Scope changes the shape of the project, so pricing is shared after discovery when the work is clear. You will know the investment before anything starts.',
  },
  {
    id: '03',
    question: 'Can services be combined?',
    answer:
      'Yes. Most projects combine two or three layers, such as website plus SEO, dashboard plus automation, or launch plus ongoing support. The service mix follows the business need.',
  },
  {
    id: '04',
    question: 'What happens after launch?',
    answer:
      'You receive a proper handover and can add maintenance or support if you want help with updates, performance, security, content changes, and future improvements.',
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

function AnimatedHeadline() {
  const lines = ['Build the layer', 'your business', 'needs next.'];

  return (
    <h1 className="max-w-5xl font-playfair text-[clamp(2.95rem,7.2vw,7.2rem)] font-bold leading-[0.93] tracking-tight text-[#151419] dark:text-[#FBFBFB]">
      {lines.map((line, index) => (
        <span className="block overflow-hidden pb-2" key={line}>
          <span className={index === 2 ? 'block text-[#151419]/58 dark:text-[#FBFBFB]/50' : 'block'}>
            {line}
            {index < lines.length - 1 ? <span className="sr-only"> </span> : null}
          </span>
        </span>
      ))}
    </h1>
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#FC6E20]">
      <span>[</span>
      {children}
      <span>]</span>
    </span>
  );
}

function ServicesGridLines() {
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

function SystemMap() {
  const reduceMotion = useReducedMotion();
  const nodes = [
    { label: 'Website', className: 'left-[7%] top-[16%]' },
    { label: 'SEO', className: 'right-[10%] top-[21%]' },
    { label: 'Dashboard', className: 'left-[22%] top-[48%]' },
    { label: 'Automation', className: 'right-[18%] top-[57%]' },
    { label: 'Support', className: 'left-[14%] bottom-[12%]' },
  ];

  return (
    <div className="relative min-h-[21rem] overflow-hidden border border-[#151419]/10 bg-[#151419] p-5 text-[#FBFBFB] shadow-2xl shadow-[#151419]/10 dark:border-[#FBFBFB]/10 dark:bg-[#1B1B1E] sm:min-h-[24rem] lg:min-h-[26rem]">
      <div className="flex items-center justify-between border-b border-white/10 pb-4 font-mono text-[0.65rem] uppercase tracking-[0.24em] text-white/45">
        <span>Service system</span>
        <span>01-06</span>
      </div>

      <div className="absolute left-1/2 top-1/2 h-px w-[68%] -translate-x-1/2 -rotate-12 bg-[#FC6E20]/60" />
      <div className="absolute left-1/2 top-1/2 h-px w-[58%] -translate-x-1/2 rotate-[28deg] bg-white/14" />
      <div className="absolute left-[34%] top-[18%] h-[62%] w-px rotate-[9deg] bg-white/12" />
      <div className="absolute right-[28%] top-[20%] h-[56%] w-px -rotate-[15deg] bg-[#FC6E20]/35" />

      <div className="absolute inset-x-8 bottom-9 rounded-full border border-white/10 bg-white/[0.03] p-2">
        <div className="h-1 rounded-full bg-[#FC6E20]" />
      </div>

      {nodes.map((node, index) => (
        <motion.div
          key={node.label}
          className={`absolute ${node.className} w-[min(10rem,38vw)] border border-white/10 bg-white/[0.075] p-4 backdrop-blur`}
          animate={
            reduceMotion
              ? undefined
              : {
                  y: index % 2 === 0 ? [0, -8, 0] : [0, 8, 0],
                }
          }
          transition={{
            duration: 5 + index,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        >
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-[#FC6E20]">
            {String(index + 1).padStart(2, '0')}
          </span>
          <p className="mt-2 font-montserrat text-sm font-semibold">{node.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

function HeroSection() {
  return (
    <section className="content-gutter relative z-10 grid min-h-screen grid-cols-1 items-start gap-12 py-28 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.72fr)] lg:items-center lg:gap-16 lg:py-32">
      <div className="min-w-0">
        <div>
          <SectionLabel>Services</SectionLabel>
        </div>

        <div className="mt-8">
          <AnimatedHeadline />
        </div>

        <p
          className="mt-8 max-w-full font-montserrat text-base leading-8 text-[#151419]/70 dark:text-[#FBFBFB]/68 sm:max-w-2xl md:text-lg"
        >
          Websites, dashboards, SEO, automation, and support, shaped into the
          layer your business actually needs next. Start with the problem. We
          will help choose the service mix.
        </p>

        <div
          className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
        >
          <PrimaryButton href="/contact">Start a project</PrimaryButton>
          <SecondaryButton href="#service-chooser">Compare services</SecondaryButton>
        </div>
      </div>

      <div className="min-w-0">
        <SystemMap />
      </div>
    </section>
  );
}

function ServiceChooser() {
  return (
    <section id="service-chooser" className="content-gutter relative z-10 py-20 md:py-28">
      <Reveal className="max-w-3xl">
        <SectionLabel>Choose your starting point</SectionLabel>
        <h2 className="mt-5 font-playfair text-[clamp(2.6rem,6vw,5.8rem)] font-bold leading-[0.96] tracking-tight text-[#151419] dark:text-[#FBFBFB]">
          What needs to move first?
        </h2>
        <p className="mt-6 max-w-2xl font-montserrat text-base leading-8 text-[#151419]/65 dark:text-[#FBFBFB]/62">
          You do not need to understand every technical option. Pick the pain
          point that sounds closest and use it as the doorway into the service
          walkthrough.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {chooserCards.map((card, index) => (
          <Reveal key={card.title} delay={index * 0.06}>
            <Link
              href={card.href}
              className="group flex min-h-[18rem] flex-col justify-between border border-[#151419]/10 bg-[#FBFBFB]/70 p-6 text-[#151419] transition-colors duration-300 hover:border-[#FC6E20] hover:bg-[#151419] hover:text-[#FBFBFB] dark:border-[#FBFBFB]/10 dark:bg-[#1B1B1E] dark:text-[#FBFBFB] dark:hover:border-[#FC6E20]"
            >
              <div>
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[#FC6E20]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-7 font-playfair text-3xl font-bold leading-none tracking-tight">
                  {card.title}
                </h3>
                <p className="mt-5 font-montserrat text-sm leading-7 text-current/64">
                  {card.body}
                </p>
              </div>
              <div className="mt-10 flex items-center justify-between border-t border-current/10 pt-4">
                <span className="font-montserrat text-[0.7rem] font-bold uppercase tracking-[0.18em]">
                  {card.match}
                </span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function ServiceChapterCard({ service, index }: { service: ServiceChapter; index: number }) {
  const Icon = service.icon;

  return (
    <section
      id={`service-${service.slug}`}
      className="grid gap-8 py-12 lg:min-h-[88vh] lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-start lg:gap-16 lg:py-20"
    >
      <Reveal className="lg:sticky lg:top-28">
        <span className="font-mono text-[0.72rem] uppercase tracking-[0.26em] text-[#FC6E20]">
          {service.num} / {service.eyebrow}
        </span>
        <h3 className="mt-5 max-w-xl font-playfair text-[clamp(2.8rem,5.8vw,6.4rem)] font-bold leading-[0.9] tracking-tight text-[#151419] dark:text-[#FBFBFB]">
          {service.title}
        </h3>
        <p className="mt-6 max-w-lg font-montserrat text-base leading-8 text-[#151419]/64 dark:text-[#FBFBFB]/62">
          {service.for}
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <article className="relative overflow-hidden border border-[#151419]/10 bg-[#151419] p-6 text-[#FBFBFB] dark:border-[#FBFBFB]/10 dark:bg-[#1B1B1E] md:p-8 lg:p-10">
          <div className="absolute right-0 top-0 h-32 w-32 border-l border-b border-[#FC6E20]/30" />
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center border border-white/12 bg-white/[0.04] text-[#FC6E20]">
                <Icon className="h-5 w-5" strokeWidth={1.7} />
              </div>
              <p className="mt-8 font-montserrat text-[0.7rem] font-bold uppercase tracking-[0.22em] text-white/42">
                {service.shortTitle}
              </p>
            </div>
            <span className="font-playfair text-[clamp(4rem,11vw,9rem)] font-bold leading-none text-white/[0.045]">
              {service.num}
            </span>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="border-t border-white/10 pt-5">
              <p className="font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#FC6E20]">
                Problem
              </p>
              <p className="mt-4 font-montserrat text-sm leading-7 text-white/68">
                {service.problem}
              </p>
            </div>
            <div className="border-t border-white/10 pt-5">
              <p className="font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#FC6E20]">
                Outcome
              </p>
              <p className="mt-4 font-montserrat text-sm leading-7 text-white/68">
                {service.outcome}
              </p>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6">
            <p className="font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.22em] text-white/42">
              Included
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {service.includes.map((item) => (
                <div key={item} className="flex items-center gap-3 font-montserrat text-sm text-white/72">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#FC6E20]" strokeWidth={1.8} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <Link
            href={`/services/${service.slug}`}
            className="group mt-10 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#FC6E20] px-6 py-3 font-montserrat text-sm font-bold uppercase tracking-[0.06em] text-[#151419] transition-colors hover:bg-[#FBFBFB]"
          >
            <AnimatedLinkText hiddenClassName="text-[#151419]">View service</AnimatedLinkText>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </article>
      </Reveal>

      <span aria-hidden="true" className="hidden lg:block">
        {index < serviceChapters.length - 1 && (
          <span className="block h-px w-full bg-[#151419]/10 dark:bg-[#FBFBFB]/10" />
        )}
      </span>
    </section>
  );
}

function ServiceWalkthrough() {
  return (
    <section id="service-walkthrough" className="content-gutter relative z-10 py-16 md:py-24">
      <Reveal className="max-w-3xl">
        <SectionLabel>Service walkthrough</SectionLabel>
        <h2 className="mt-5 font-playfair text-[clamp(2.7rem,6.5vw,6.7rem)] font-bold leading-[0.92] tracking-tight text-[#151419] dark:text-[#FBFBFB]">
          Six ways to build the next layer.
        </h2>
      </Reveal>

      <div className="mt-10">
        {serviceChapters.map((service, index) => (
          <ServiceChapterCard key={service.slug} service={service} index={index} />
        ))}
      </div>
    </section>
  );
}

function ServiceCombinations() {
  return (
    <section className="content-gutter relative z-10 py-20 md:py-28">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
        <Reveal className="lg:sticky lg:top-28">
          <SectionLabel>How they connect</SectionLabel>
          <h2 className="mt-5 font-playfair text-[clamp(2.7rem,5.8vw,5.6rem)] font-bold leading-[0.95] tracking-tight text-[#151419] dark:text-[#FBFBFB]">
            Services should work together, not compete for attention.
          </h2>
        </Reveal>

        <div className="grid gap-4">
          {comboCards.map((combo, index) => (
            <Reveal key={combo.title} delay={index * 0.08}>
              <article className="grid gap-5 border border-[#151419]/10 bg-[#FBFBFB]/70 p-6 dark:border-[#FBFBFB]/10 dark:bg-[#1B1B1E] md:grid-cols-[0.55fr_1fr] md:p-8">
                <div>
                  <span className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[#FC6E20]">
                    {combo.services}
                  </span>
                  <h3 className="mt-4 font-playfair text-4xl font-bold leading-none tracking-tight text-[#151419] dark:text-[#FBFBFB]">
                    {combo.title}
                  </h3>
                </div>
                <p className="font-montserrat text-sm leading-7 text-[#151419]/66 dark:text-[#FBFBFB]/62">
                  {combo.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessRhythm() {
  return (
    <section className="relative z-10 bg-[#151419] py-20 text-[#FBFBFB] dark:bg-[#1B1B1E] md:py-28">
      <div className="content-gutter">
        <Reveal className="max-w-4xl">
          <SectionLabel>Process rhythm</SectionLabel>
          <h2 className="mt-5 font-playfair text-[clamp(2.8rem,6.8vw,6.6rem)] font-bold leading-[0.94] tracking-tight">
            From first conversation to live product.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {processSteps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.08}>
              <article className="flex min-h-[20rem] flex-col justify-between border border-white/10 bg-white/[0.035] p-6 md:p-8">
                <div>
                  <span className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-[#FC6E20]">
                    {step.num}
                  </span>
                  <h3 className="mt-7 font-playfair text-4xl font-bold tracking-tight">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-12 font-montserrat text-sm leading-7 text-white/62">
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

function IncludedSection() {
  return (
    <section className="content-gutter relative z-10 py-20 md:py-28">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
        <Reveal>
          <SectionLabel>What is included</SectionLabel>
          <h2 className="mt-5 font-playfair text-[clamp(2.7rem,5.8vw,5.6rem)] font-bold leading-[0.95] tracking-tight text-[#151419] dark:text-[#FBFBFB]">
            The work is clear before the work begins.
          </h2>
          <p className="mt-6 max-w-xl font-montserrat text-base leading-8 text-[#151419]/64 dark:text-[#FBFBFB]/62">
            No package table, no public guesswork. Every project gets scoped
            around the actual job, then shaped into a clear path from strategy
            to handover.
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {includedItems.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.04}>
              <article className="min-h-[12rem] border border-[#151419]/10 bg-[#FBFBFB]/70 p-6 dark:border-[#FBFBFB]/10 dark:bg-[#1B1B1E]">
                <CircleDot className="h-5 w-5 text-[#FC6E20]" strokeWidth={1.8} />
                <h3 className="mt-8 font-montserrat text-sm font-bold uppercase tracking-[0.16em] text-[#151419] dark:text-[#FBFBFB]">
                  {item.title}
                </h3>
                <p className="mt-4 font-montserrat text-sm leading-7 text-[#151419]/62 dark:text-[#FBFBFB]/58">
                  {item.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesFaq() {
  return (
    <section className="relative z-10 bg-[#151419] py-20 text-[#FBFBFB] dark:bg-[#1B1B1E] md:py-28">
      <div className="content-gutter grid gap-12 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <SectionLabel>Before we begin</SectionLabel>
          <h2 className="mt-5 font-playfair text-[clamp(2.8rem,6vw,5.8rem)] font-bold leading-[0.92] tracking-tight">
            Clear answers before the call.
          </h2>
          <p className="mt-6 max-w-md font-montserrat text-sm leading-7 text-white/58">
            The page should help you understand the shape of the work before we
            talk. These are the practical questions that usually come up first.
          </p>
        </Reveal>

        <Reveal>
          <Accordion type="single" collapsible defaultValue="01" className="border-t border-white/10">
            {faqItems.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border-b border-white/10">
                <AccordionTrigger className="group py-7 text-left hover:no-underline [&>svg]:text-[#FC6E20]">
                  <span className="flex items-start gap-5 pr-5">
                    <span className="mt-1 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[#FC6E20]">
                      {item.id}
                    </span>
                    <span className="font-montserrat text-base font-bold uppercase tracking-[0.04em] text-white/82 transition-colors group-hover:text-white md:text-xl">
                      {item.question}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-7 pl-10 pr-4 font-montserrat text-sm leading-7 text-white/58 md:pl-16">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
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
              <SectionLabel>Start here</SectionLabel>
              <h2 className="mt-5 max-w-4xl font-playfair text-[clamp(2.7rem,6.6vw,6.8rem)] font-bold leading-[0.9] tracking-tight text-[#151419] dark:text-[#FBFBFB]">
                Bring the messy version. We will shape the system.
              </h2>
              <p className="mt-6 max-w-2xl font-montserrat text-base leading-8 text-[#151419]/64 dark:text-[#FBFBFB]/62">
                You do not need a perfect brief. Bring the goal, the friction,
                and the rough idea. The first job is turning that into a clear
                next move.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <PrimaryButton href="/contact">Start a project</PrimaryButton>
              <SecondaryButton href="mailto:hello@kreativereflow.com">Email us</SecondaryButton>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#F0EFED] text-[#151419] selection:bg-[#FC6E20] selection:text-[#151419] [--left-gutter:4.5rem] [--right-gutter:1rem] dark:bg-[#151419] dark:text-[#FBFBFB] sm:[--left-gutter:4.75rem] sm:[--right-gutter:1.5rem] lg:[--left-gutter:5.5rem] lg:[--right-gutter:3.5rem] xl:[--right-gutter:75px]">
      <ServicesGridLines />
      <HeroSection />
      <ServiceChooser />
      <ServiceWalkthrough />
      <ServiceCombinations />
      <ProcessRhythm />
      <IncludedSection />
      <ServicesFaq />
      <FinalCta />
    </main>
  );
}
