'use client';

import Link from 'next/link';
import type React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, CheckCircle2, CircleDot, CornerDownRight } from 'lucide-react';
import { AnimatedLinkText, AnimatedTextLink } from '@/components/AnimatedTextLink';
import { ExpandingCtaBackground } from '@/components/ExpandingCtaBackground';

type ServicePoint = {
  title: string;
  description: string;
};

type ProcessStep = {
  num: string;
  title: string;
  description: string;
};

type RelatedService = {
  title: string;
  description: string;
  href: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type ProofPoint = {
  label: string;
  title: string;
  description: string;
};

type RevealDirection = 'up' | 'left' | 'right' | 'fade';

export type ServiceDetailPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  bestFor: string;
  problem: string;
  outcome: string;
  proof?: string;
  proofPoints: ProofPoint[];
  symptoms: ServicePoint[];
  features: ServicePoint[];
  process: ProcessStep[];
  related: RelatedService[];
  faqs: FaqItem[];
  ctaTitle: string;
  ctaBody: string;
};

function Reveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: RevealDirection;
}) {
  const reduceMotion = useReducedMotion();
  const initialByDirection: Record<RevealDirection, { opacity: number; x?: number; y?: number }> = {
    up: { opacity: 0, y: 34 },
    left: { opacity: 0, x: -42 },
    right: { opacity: 0, x: 42 },
    fade: { opacity: 0 },
  };

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : initialByDirection[direction]}
      whileInView={reduceMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-16% 0px -12% 0px' }}
      transition={{ duration: 0.78, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const cardHoverStyles = [
  'hover:border-[#DD6211] hover:bg-[#DD6211] hover:text-[#060808]',
  'hover:border-[#5F9FAA] hover:bg-[#5F9FAA] hover:text-[#060808]',
  'hover:border-[#FAE18F] hover:bg-[#FAE18F] hover:text-[#060808]',
  'hover:border-[#B92717] hover:bg-[#B92717] hover:text-[#FFF6E9]',
  'hover:border-[#596C72] hover:bg-[#596C72] hover:text-[#FBFBFB]',
  'hover:border-[#C7AA94] hover:bg-[#C7AA94] hover:text-[#060808]',
];

const proofCardStyles = [
  'bg-[#5F9FAA] text-[#060808]',
  'bg-[#FFF6E9] text-[#0A171D]',
  'bg-[#DD6211] text-[#060808]',
];

const featureCardStyles = [
  'bg-[#5F9FAA] text-[#060808]',
  'bg-[#DD6211] text-[#060808]',
  'bg-[#FFF6E9] text-[#0A171D]',
  'bg-[#B92717] text-[#FFF6E9]',
  'bg-[#596C72] text-[#FBFBFB]',
  'bg-[#C7AA94] text-[#060808]',
];

const processCardStyles = [
  {
    card: 'hover:border-[#151419]/35',
  },
  {
    card: 'hover:border-[#FC6E20]/45',
  },
  {
    card: 'hover:border-[#FAE18F]/80',
  },
  {
    card: 'hover:border-[#3D7A7A]/55',
  },
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

function PrimaryButton({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-[#FC6E20] px-6 py-3 text-center font-montserrat text-sm font-bold uppercase tracking-[0.06em] text-[#151419] transition-colors duration-300 hover:bg-[#FBFBFB] sm:w-auto"
    >
      <AnimatedLinkText hiddenClassName="text-[#151419]">{children}</AnimatedLinkText>
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

function SecondaryButton({
  href,
  children,
  inverse = false,
}: {
  href: string;
  children: string;
  inverse?: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        inverse
          ? 'inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#151419]/15 px-6 py-3 text-center font-montserrat text-sm font-bold uppercase tracking-[0.06em] text-[#151419] transition-colors duration-300 hover:border-[#FC6E20] hover:text-[#FC6E20] sm:w-auto'
          : 'inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#151419]/15 px-6 py-3 text-center font-montserrat text-sm font-bold uppercase tracking-[0.06em] text-[#151419] transition-colors duration-300 hover:border-[#FC6E20] hover:text-[#FC6E20] dark:border-[#FBFBFB]/18 dark:text-[#FBFBFB] dark:hover:border-[#FC6E20] dark:hover:text-[#FC6E20] sm:w-auto'
      }
    >
      <AnimatedLinkText>{children}</AnimatedLinkText>
    </Link>
  );
}

export function ServiceDetailPage({
  eyebrow,
  title,
  intro,
  bestFor,
  problem,
  outcome,
  proof,
  proofPoints,
  symptoms,
  features,
  process,
  related,
  faqs,
  ctaTitle,
  ctaBody,
}: ServiceDetailPageProps) {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#F0EFED] text-[#151419] selection:bg-[#FC6E20] selection:text-[#151419] [--left-gutter:4.5rem] [--right-gutter:1rem] dark:bg-[#151419] dark:text-[#FBFBFB] sm:[--left-gutter:4.75rem] sm:[--right-gutter:1.5rem] lg:[--left-gutter:5.5rem] lg:[--right-gutter:3.5rem] xl:[--right-gutter:75px]">
      <GridLines />

      <section className="content-gutter relative z-10 grid min-h-screen gap-12 py-28 md:py-32 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.78fr)] lg:items-center lg:gap-16">
        <Reveal direction="left">
          <nav className="mb-10 flex flex-wrap items-center gap-2 font-montserrat text-xs uppercase tracking-[0.22em] text-[#878787]">
            <AnimatedTextLink href="/services" className="text-[#878787]" underline={false}>
              Services
            </AnimatedTextLink>
            <span>/</span>
            <span className="text-[#151419]/60 dark:text-[#FBFBFB]/55">{title}</span>
          </nav>
          <SectionLabel>{eyebrow}</SectionLabel>
          <h1 className="mt-5 max-w-5xl font-playfair text-[clamp(3rem,7.2vw,7.6rem)] font-bold leading-[0.92] tracking-tight">
            {title}
          </h1>
          <p className="mt-7 max-w-3xl font-montserrat text-lg leading-9 text-[#151419]/64 dark:text-[#FBFBFB]/64 md:text-xl">
            {intro}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <PrimaryButton href="/contact">Start a project</PrimaryButton>
            <SecondaryButton href="#service-fit">See if this fits</SecondaryButton>
          </div>
        </Reveal>

        <Reveal delay={0.12} direction="right">
          <div className="relative rotate-0 overflow-hidden rounded-[2.25rem] border border-[#151419]/10 bg-[#151419] p-5 text-[#FBFBFB] shadow-[0_28px_70px_rgba(21,20,25,0.18)] transition-transform duration-500 hover:-translate-y-1 hover:rotate-0 dark:border-[#FBFBFB]/10 dark:bg-[#1B1B1E] md:p-7 lg:rotate-1">
            <div className="absolute right-0 top-0 h-36 w-36 rounded-bl-full border-b border-l border-[#FC6E20]/20" />
            <div className="flex items-center justify-between border-b border-white/10 pb-4 font-mono text-[0.64rem] uppercase tracking-[0.24em] text-white/42">
              <span>Service map</span>
              <span>Buyer signal</span>
            </div>
            <div className="grid gap-4 py-6">
              {[
                ['Best for', bestFor],
                ['Problem', problem],
                ['Outcome', outcome],
              ].map(([label, body], index) => (
                <div key={label} className="grid gap-3 border-b border-white/10 pb-4 last:border-b-0">
                  <div className="flex items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-white/42">
                    <span className="text-[#FC6E20]">{String(index + 1).padStart(2, '0')}</span>
                    {label}
                  </div>
                  <p className="font-montserrat text-sm leading-7 text-white/74">{body}</p>
                </div>
              ))}
            </div>
            {proof ? (
              <div className="rounded-[1.15rem] border border-[#FC6E20]/35 bg-white/[0.045] p-4 font-montserrat text-sm leading-7 text-white/72">
                {proof}
              </div>
            ) : null}
          </div>
        </Reveal>
      </section>

      <section className="content-gutter relative z-10 grid gap-10 pb-20 md:pb-28 lg:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.82fr)] lg:items-start">
        <div className="grid gap-4 md:grid-cols-3 lg:order-1">
          {proofPoints.map((point, index) => (
            <Reveal
              key={point.title}
              delay={index * 0.06}
              direction={index % 2 === 0 ? 'up' : 'left'}
            >
              <article
                className={`group flex min-h-[22rem] flex-col justify-between rounded-[2.25rem] p-6 shadow-[0_24px_60px_rgba(21,20,25,0.1)] transition-transform duration-300 hover:-translate-y-2 md:p-7 ${proofCardStyles[index % proofCardStyles.length]}`}
              >
                <div>
                  <span className="font-mono text-[0.64rem] font-bold uppercase tracking-[0.22em] opacity-[0.62]">
                    {String(index + 1).padStart(2, '0')} / {point.label}
                  </span>
                  <h3 className="mt-8 font-playfair text-3xl font-bold leading-[0.95] tracking-tight">
                    {point.title}
                  </h3>
                </div>
                <p className="mt-8 border-t border-current/12 pt-5 font-montserrat text-sm leading-7 opacity-[0.68]">
                  {point.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="max-w-4xl lg:order-2 lg:ml-auto lg:max-w-[34rem] lg:pt-12" direction="right">
          <SectionLabel>Proof signals</SectionLabel>
          <h2 className="mt-5 font-playfair text-[clamp(2.4rem,5.2vw,5.4rem)] font-bold leading-[0.96] tracking-tight">
            Evidence without pretending the results are already approved<span className="text-[#FC6E20]">.</span>
          </h2>
          <p className="mt-5 max-w-2xl font-montserrat text-base leading-8 text-[#151419]/62 dark:text-[#FBFBFB]/62">
            These are the kinds of practical signals this service can create. Strong public claims still need real client approval before they become case-study copy.
          </p>
        </Reveal>
      </section>

      <section id="service-fit" className="content-gutter relative z-10 scroll-mt-24 py-20 md:py-28">
        <Reveal className="max-w-4xl" direction="up">
          <SectionLabel>When this is the right move</SectionLabel>
          <h2 className="mt-5 font-playfair text-[clamp(2.6rem,5.8vw,6rem)] font-bold leading-[0.95] tracking-tight">
            The symptoms are usually visible before the scope is<span className="text-[#FC6E20]">.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {symptoms.map((item, index) => (
            <Reveal
              key={item.title}
              delay={index * 0.06}
              direction={index === 0 ? 'left' : index === 2 ? 'right' : 'up'}
            >
              <article
                className={`min-h-full rounded-[1.35rem] border border-[#151419]/10 bg-[#F0EFED] p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_22px_54px_rgba(21,20,25,0.12)] dark:border-[#FBFBFB]/10 dark:bg-[#F0EFED] dark:text-[#151419] ${cardHoverStyles[index % cardHoverStyles.length]}`}
              >
                <span className="font-mono text-xs text-[#FC6E20]">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-8 font-playfair text-3xl font-bold leading-[0.95] tracking-tight">{item.title}</h3>
                <p className="mt-5 border-t border-current/12 pt-5 font-montserrat text-sm leading-7 opacity-[0.68]">
                  {item.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative z-10 overflow-hidden bg-[#151419] py-20 text-[#FBFBFB] md:py-28">
        <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px bg-white/10 lg:block" />
        <div className="content-gutter">
          <div className="grid gap-12 lg:grid-cols-[1.22fr_0.78fr] lg:items-start">
            <div className="grid gap-4 sm:grid-cols-2 lg:order-1">
              {features.map((feature, index) => (
                <Reveal
                  key={feature.title}
                  delay={index * 0.04}
                  direction={index % 2 === 0 ? 'left' : 'up'}
                >
                  <article
                    className={`group flex min-h-[18rem] flex-col justify-between rounded-[1.35rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.16)] transition-transform duration-300 hover:-translate-y-1.5 md:p-7 ${featureCardStyles[index % featureCardStyles.length]}`}
                  >
                    <CheckCircle2 className="h-5 w-5 opacity-[0.66]" strokeWidth={1.7} />
                    <div>
                      <h3 className="font-playfair text-3xl font-bold leading-[0.92] tracking-tight">{feature.title}</h3>
                      <p className="mt-5 border-t border-current/12 pt-5 font-montserrat text-sm leading-7 opacity-[0.68]">{feature.description}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal className="lg:order-2 lg:sticky lg:top-28 lg:ml-auto lg:max-w-[32rem] lg:text-right" direction="right">
              <SectionLabel>What we build into it</SectionLabel>
              <h2 className="mt-5 font-playfair text-[clamp(2.5rem,5.5vw,5.8rem)] font-bold leading-[0.95] tracking-tight">
                Practical pieces, not vague deliverables<span className="text-[#FC6E20]">.</span>
              </h2>
              <p className="mt-6 font-montserrat text-base leading-8 text-white/58">
                Every service is scoped around a usable outcome, clear ownership,
                and the next business decision it needs to support.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="content-gutter relative z-10 py-20 md:py-28">
        <Reveal className="max-w-4xl" direction="left">
          <SectionLabel>How the work moves</SectionLabel>
          <h2 className="mt-5 font-playfair text-[clamp(2.5rem,5.4vw,5.6rem)] font-bold leading-[0.96] tracking-tight">
            A clear rhythm from messy idea to useful system<span className="text-[#FC6E20]">.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-4">
          {process.map((step, index) => {
            const style = processCardStyles[index % processCardStyles.length];

            return (
              <Reveal
                key={step.num}
                delay={index * 0.06}
                direction={index % 2 === 0 ? 'up' : 'right'}
              >
                <article
                  className={`group relative flex min-h-[24rem] flex-col justify-between overflow-hidden rounded-[2.25rem] border border-[#151419]/10 bg-transparent p-6 text-[#151419] shadow-[0_24px_60px_rgba(21,20,25,0.08)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_22px_54px_rgba(21,20,25,0.12)] md:p-7 ${style.card}`}
                >
                  <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-full border-b border-l border-current/12" />
                  <span className="font-mono text-xs uppercase tracking-[0.22em] opacity-[0.62]">
                    Step {step.num}
                  </span>
                  <div>
                    <h3 className="font-playfair text-4xl font-bold leading-none tracking-tight">{step.title}</h3>
                    <p className="mt-6 border-t border-current/12 pt-5 font-montserrat text-sm leading-7 opacity-[0.68]">
                      {step.description}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="content-gutter relative z-10 grid gap-8 pb-20 md:pb-28 lg:grid-cols-[1.12fr_0.88fr] lg:items-start">
        <div className="grid gap-4 lg:order-1">
          {related.map((service, index) => (
            <Reveal
              key={service.title}
              delay={index * 0.06}
              direction={index === 1 ? 'left' : 'up'}
            >
              <Link
                href={service.href}
                className={`group grid gap-5 rounded-[1.35rem] border border-[#151419]/10 bg-[#F0EFED] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_54px_rgba(21,20,25,0.12)] dark:border-[#FBFBFB]/10 dark:bg-[#F0EFED] dark:text-[#151419] sm:grid-cols-[auto_1fr_auto] sm:items-center ${cardHoverStyles[(index + 3) % cardHoverStyles.length]}`}
              >
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#FC6E20]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>
                  <span className="block font-playfair text-3xl font-bold leading-none">{service.title}</span>
                  <span className="mt-3 block font-montserrat text-sm leading-6 opacity-[0.64]">
                    {service.description}
                  </span>
                </span>
                <CornerDownRight className="h-5 w-5 text-current/48 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="lg:order-2 lg:ml-auto lg:max-w-[34rem] lg:pt-8 lg:text-right" direction="right">
          <SectionLabel>Connected services</SectionLabel>
          <h2 className="mt-5 font-playfair text-[clamp(2.3rem,4.8vw,5rem)] font-bold leading-[0.98] tracking-tight">
            This can stand alone or connect into a bigger system<span className="text-[#FC6E20]">.</span>
          </h2>
        </Reveal>
      </section>

      <section className="relative z-10 bg-[#F8F7F4] py-20 dark:bg-[#101014] md:py-28">
        <div className="content-gutter grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <Reveal direction="left">
            <SectionLabel>Questions clients ask</SectionLabel>
            <h2 className="mt-5 font-playfair text-[clamp(2.3rem,4.8vw,5rem)] font-bold leading-[0.98] tracking-tight">
              Before you book, these are worth knowing<span className="text-[#FC6E20]">.</span>
            </h2>
          </Reveal>
          <div className="grid gap-4 rounded-[1.35rem] border border-[#151419]/10 bg-[#FBFBFB]/70 p-5 shadow-[0_22px_54px_rgba(21,20,25,0.08)] dark:border-[#FBFBFB]/10 dark:bg-white/[0.035] md:p-7">
            {faqs.map((faq, index) => (
              <Reveal key={faq.question} delay={index * 0.04} direction={index % 2 === 0 ? 'right' : 'up'}>
                <article className="rounded-[1.15rem] border border-[#151419]/10 bg-[#F0EFED] p-5 transition-colors duration-300 hover:border-[#FC6E20]/55 dark:border-[#FBFBFB]/10 dark:bg-[#1B1B1E]">
                  <div className="flex items-start gap-4">
                    <CircleDot className="mt-1 h-4 w-4 shrink-0 text-[#FC6E20]" strokeWidth={1.8} />
                    <div>
                      <h3 className="font-montserrat text-sm font-bold uppercase tracking-[0.12em]">{faq.question}</h3>
                      <p className="mt-3 font-montserrat text-sm leading-7 text-[#151419]/62 dark:text-[#FBFBFB]/62">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="content-gutter relative z-10 py-20 md:py-28">
        <Reveal direction="up">
          <ExpandingCtaBackground contentClassName="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-bl-full border-b border-l border-[#FC6E20]/20" />
            <div>
              <SectionLabel>Start here</SectionLabel>
              <h2 className="mt-5 max-w-4xl font-playfair text-[clamp(2.7rem,6.2vw,6.5rem)] font-bold leading-[0.9] tracking-tight">
                {ctaTitle}
              </h2>
              <p className="mt-6 max-w-2xl font-montserrat text-base leading-8 text-[#151419]/64">{ctaBody}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <PrimaryButton href="/contact">Book a call</PrimaryButton>
              <SecondaryButton href="mailto:hello@kreativereflow.com" inverse>
                Email us
              </SecondaryButton>
            </div>
          </ExpandingCtaBackground>
        </Reveal>
      </section>
    </main>
  );
}
