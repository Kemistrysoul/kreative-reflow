'use client';

import Link from 'next/link';
import type React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, CheckCircle2, CircleDot, CornerDownRight } from 'lucide-react';
import { AnimatedLinkText, AnimatedTextLink } from '@/components/AnimatedTextLink';

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
      viewport={{ once: true, margin: '-14% 0px -10% 0px' }}
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
          ? 'inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#FBFBFB]/18 px-6 py-3 text-center font-montserrat text-sm font-bold uppercase tracking-[0.06em] text-[#FBFBFB] transition-colors duration-300 hover:border-[#FC6E20] hover:text-[#FC6E20] sm:w-auto'
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
    <main className="relative min-h-screen overflow-hidden bg-[#F0EFED] text-[#151419] dark:bg-[#151419] dark:text-[#FBFBFB]">
      <GridLines />

      <section className="content-gutter relative z-10 grid min-h-screen gap-12 py-28 md:py-32 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)] lg:items-center">
        <Reveal>
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

        <Reveal delay={0.12}>
          <div className="relative border border-[#151419]/10 bg-[#151419] p-5 text-[#FBFBFB] shadow-2xl shadow-[#151419]/10 dark:border-[#FBFBFB]/10 dark:bg-[#1B1B1E] md:p-7">
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
              <div className="border-l border-[#FC6E20] bg-white/[0.045] p-4 font-montserrat text-sm leading-7 text-white/72">
                {proof}
              </div>
            ) : null}
          </div>
        </Reveal>
      </section>

      <section className="content-gutter relative z-10 pb-20 md:pb-28">
        <Reveal className="max-w-4xl">
          <SectionLabel>Proof signals</SectionLabel>
          <h2 className="mt-5 font-playfair text-[clamp(2.4rem,5.2vw,5.4rem)] font-bold leading-[0.96] tracking-tight">
            Evidence without pretending the results are already approved.
          </h2>
          <p className="mt-5 max-w-2xl font-montserrat text-base leading-8 text-[#151419]/62 dark:text-[#FBFBFB]/62">
            These are the kinds of practical signals this service can create. Strong public claims still need real client approval before they become case-study copy.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {proofPoints.map((point, index) => (
            <Reveal key={point.title} delay={index * 0.06}>
              <article className="group min-h-full border border-[#151419]/10 bg-[#FBFBFB]/72 p-6 transition-colors hover:border-[#FC6E20] dark:border-[#FBFBFB]/10 dark:bg-[#1B1B1E]">
                <span className="font-mono text-[0.64rem] font-bold uppercase tracking-[0.22em] text-[#FC6E20]">
                  {point.label}
                </span>
                <h3 className="mt-8 font-playfair text-2xl font-bold leading-tight">{point.title}</h3>
                <p className="mt-4 font-montserrat text-sm leading-7 text-[#151419]/62 dark:text-[#FBFBFB]/62">
                  {point.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="service-fit" className="content-gutter relative z-10 scroll-mt-24 py-20 md:py-28">
        <Reveal className="max-w-4xl">
          <SectionLabel>When this is the right move</SectionLabel>
          <h2 className="mt-5 font-playfair text-[clamp(2.6rem,5.8vw,6rem)] font-bold leading-[0.95] tracking-tight">
            The symptoms are usually visible before the scope is.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {symptoms.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <article className="min-h-full border border-[#151419]/10 bg-[#FBFBFB]/72 p-6 dark:border-[#FBFBFB]/10 dark:bg-[#1B1B1E]">
                <span className="font-mono text-xs text-[#FC6E20]">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-8 font-playfair text-2xl font-bold leading-tight">{item.title}</h3>
                <p className="mt-4 font-montserrat text-sm leading-7 text-[#151419]/62 dark:text-[#FBFBFB]/62">
                  {item.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative z-10 bg-[#151419] py-20 text-[#FBFBFB] md:py-28">
        <div className="content-gutter">
          <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <Reveal className="lg:sticky lg:top-28">
              <SectionLabel>What we build into it</SectionLabel>
              <h2 className="mt-5 font-playfair text-[clamp(2.5rem,5.5vw,5.8rem)] font-bold leading-[0.95] tracking-tight">
                Practical pieces, not vague deliverables.
              </h2>
              <p className="mt-6 max-w-md font-montserrat text-base leading-8 text-white/58">
                Every service is scoped around a usable outcome, clear ownership,
                and the next business decision it needs to support.
              </p>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature, index) => (
                <Reveal key={feature.title} delay={index * 0.04}>
                  <article className="min-h-full border border-white/10 bg-white/[0.045] p-6 transition-colors hover:border-[#FC6E20]/60">
                    <CheckCircle2 className="h-5 w-5 text-[#FC6E20]" strokeWidth={1.7} />
                    <h3 className="mt-7 font-playfair text-2xl font-bold leading-tight">{feature.title}</h3>
                    <p className="mt-4 font-montserrat text-sm leading-7 text-white/62">{feature.description}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="content-gutter relative z-10 py-20 md:py-28">
        <Reveal className="max-w-4xl">
          <SectionLabel>How the work moves</SectionLabel>
          <h2 className="mt-5 font-playfair text-[clamp(2.5rem,5.4vw,5.6rem)] font-bold leading-[0.96] tracking-tight">
            A clear rhythm from messy idea to useful system.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-4">
          {process.map((step, index) => (
            <Reveal key={step.num} delay={index * 0.06}>
              <article className="relative min-h-full border-t border-[#151419]/16 pt-6 dark:border-[#FBFBFB]/14">
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-[#FC6E20]">
                  Step {step.num}
                </span>
                <h3 className="mt-7 font-playfair text-3xl font-bold leading-none tracking-tight">{step.title}</h3>
                <p className="mt-5 font-montserrat text-sm leading-7 text-[#151419]/62 dark:text-[#FBFBFB]/62">
                  {step.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="content-gutter relative z-10 grid gap-8 pb-20 md:pb-28 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <SectionLabel>Connected services</SectionLabel>
          <h2 className="mt-5 font-playfair text-[clamp(2.3rem,4.8vw,5rem)] font-bold leading-[0.98] tracking-tight">
            This can stand alone or connect into a bigger system.
          </h2>
        </Reveal>
        <div className="grid gap-4">
          {related.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.06}>
              <Link
                href={service.href}
                className="group grid gap-5 border border-[#151419]/10 bg-[#FBFBFB]/72 p-5 transition-colors hover:border-[#FC6E20] dark:border-[#FBFBFB]/10 dark:bg-[#1B1B1E] sm:grid-cols-[auto_1fr_auto] sm:items-center"
              >
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#FC6E20]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>
                  <span className="block font-playfair text-2xl font-bold">{service.title}</span>
                  <span className="mt-2 block font-montserrat text-sm leading-6 text-[#151419]/60 dark:text-[#FBFBFB]/60">
                    {service.description}
                  </span>
                </span>
                <CornerDownRight className="h-5 w-5 text-[#878787] transition-transform group-hover:translate-x-1 group-hover:text-[#FC6E20]" />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative z-10 bg-[#F8F7F4] py-20 dark:bg-[#101014] md:py-28">
        <div className="content-gutter grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <Reveal>
            <SectionLabel>Questions clients ask</SectionLabel>
            <h2 className="mt-5 font-playfair text-[clamp(2.3rem,4.8vw,5rem)] font-bold leading-[0.98] tracking-tight">
              Before you book, these are worth knowing.
            </h2>
          </Reveal>
          <div className="grid gap-4">
            {faqs.map((faq, index) => (
              <Reveal key={faq.question} delay={index * 0.04}>
                <article className="border-t border-[#151419]/12 py-6 dark:border-[#FBFBFB]/12">
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
        <Reveal>
          <div className="grid gap-10 border border-[#151419]/10 bg-[#151419] p-7 text-[#FBFBFB] dark:border-[#FBFBFB]/10 dark:bg-[#1B1B1E] md:p-10 lg:grid-cols-[1fr_auto] lg:items-end lg:p-14">
            <div>
              <SectionLabel>Start here</SectionLabel>
              <h2 className="mt-5 max-w-4xl font-playfair text-[clamp(2.7rem,6.2vw,6.5rem)] font-bold leading-[0.9] tracking-tight">
                {ctaTitle}
              </h2>
              <p className="mt-6 max-w-2xl font-montserrat text-base leading-8 text-white/62">{ctaBody}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <PrimaryButton href="/contact">Book a call</PrimaryButton>
              <SecondaryButton href="mailto:hello@kreativereflow.com" inverse>
                Email us
              </SecondaryButton>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
