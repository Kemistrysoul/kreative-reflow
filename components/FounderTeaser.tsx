'use client';

import type React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Blocks, MonitorCheck, Search, Workflow } from 'lucide-react';
import { AnimatedLinkText } from '@/components/AnimatedTextLink';

const founderSignals = [
  {
    title: 'Founder-led',
    body: 'The strategy, design, build, and support stay close to the person responsible for the thinking.',
    icon: Blocks,
  },
  {
    title: 'Visibility-aware',
    body: 'Search, structure, proof, and AI-readable content are considered from the start.',
    icon: Search,
  },
  {
    title: 'System-minded',
    body: 'Websites, forms, dashboards, follow-ups, and workflows are mapped as one operating layer.',
    icon: Workflow,
  },
  {
    title: 'After-launch ready',
    body: 'The goal is a digital foundation that can keep improving once the first release is live.',
    icon: MonitorCheck,
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
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function FounderTeaser() {
  return (
    <section className="relative z-[7] overflow-hidden bg-[#F0EFED] pb-20 pt-28 text-[#151419] md:pb-28 md:pt-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[12%] top-20 hidden h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(21,20,25,0.18)_1.1px,transparent_1.1px)] bg-[length:13px_13px] opacity-50 [mask-image:radial-gradient(circle_at_center,black_0%,black_46%,transparent_72%)] lg:block"
      />
      <div className="content-gutter relative grid gap-12 lg:grid-cols-[minmax(320px,0.78fr)_minmax(0,1.08fr)] lg:items-center lg:gap-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.25rem] border border-[#151419]/10 bg-[#151419] p-4 text-[#FBFBFB] shadow-[0_28px_70px_rgba(21,20,25,0.14)]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.65rem] bg-[#F0EFED]">
              <Image
                src="/images/disele-founder-editorial.webp"
                alt="Disele, Founder of Kreative Reflow"
                fill
                sizes="(min-width: 1024px) 36vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#151419]/46 via-transparent to-transparent" />
            </div>
            <div className="grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-3">
              {[
                ['7+', 'Years industry'],
                ['Small', 'Client roster'],
                ['One', 'Connected system'],
              ].map(([value, label]) => (
                <div key={label}>
                  <span className="block font-mono text-2xl text-[#FC6E20]">{value}</span>
                  <span className="mt-1 block font-montserrat text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white/45">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal delay={0.08}>
            <SectionLabel>Behind the studio</SectionLabel>
            <h2 className="mt-5 max-w-4xl font-playfair text-[clamp(2.8rem,6vw,5.9rem)] font-bold leading-[0.94] tracking-tight">
              The studio exists because great work kept going unseen<span className="text-[#FC6E20]">.</span>
            </h2>
            <div className="mt-7 grid gap-5 font-montserrat text-base leading-8 text-[#151419]/66 md:text-lg">
              <p>
                Seven years in medical sales and neurology put Disele close to
                specialist teams doing excellent work while their websites,
                content, and systems made them look smaller than they were.
              </p>
              <p className="border-l border-[#FC6E20] pl-5 text-[#151419]">
                The work was never just to make things look better. It was to
                make the business easier to understand, find, trust, and run.
              </p>
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/about"
                className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-[#151419] px-6 py-3 font-montserrat text-sm font-bold uppercase tracking-[0.06em] text-[#FBFBFB] transition-colors duration-300 hover:bg-[#FC6E20] hover:text-[#151419] sm:w-auto"
              >
                <AnimatedLinkText hiddenClassName="text-[#151419]">Read the full story</AnimatedLinkText>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#151419]/15 px-6 py-3 font-montserrat text-sm font-bold uppercase tracking-[0.06em] text-[#151419] transition-colors duration-300 hover:border-[#FC6E20] hover:text-[#FC6E20] sm:w-auto"
              >
                <AnimatedLinkText>Start a conversation</AnimatedLinkText>
              </Link>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="content-gutter relative mt-12 grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {founderSignals.map((signal, index) => {
          const Icon = signal.icon;
          const cardStyle =
            index === founderSignals.length - 1
              ? 'border border-[#151419]/10 bg-[#FC6E20] text-[#060808] lg:translate-y-4 lg:-rotate-2 hover:translate-y-0 hover:rotate-0'
              : 'border border-[#151419]/10 text-[#151419]';

          return (
            <Reveal key={signal.title} className="h-full" delay={index * 0.06}>
              <article
                className={`flex h-full min-h-[18rem] flex-col justify-between rounded-[1.35rem] p-6 transition-all duration-300 hover:-translate-y-1 md:p-7 ${cardStyle}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-current/55">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <Icon className="h-5 w-5 text-current/38" strokeWidth={1.7} />
                </div>
                <div>
                  <h3 className="font-playfair text-3xl font-bold leading-none tracking-tight">
                    {signal.title}
                  </h3>
                  <p className="mt-5 font-montserrat text-sm leading-7 text-current/64">
                    {signal.body}
                  </p>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
