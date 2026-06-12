'use client';

import Link from 'next/link';
import type React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { AnimatedLinkText } from '@/components/AnimatedTextLink';
import { ExpandingCtaBackground } from '@/components/ExpandingCtaBackground';
import { ContactForm } from './contact-form';

type RevealDirection = 'up' | 'left' | 'right' | 'fade';

type ProjectType = {
  icon: LucideIcon;
  title: string;
  body: string;
};

type ContactMethod = {
  label: string;
  value: string;
  href: string;
  helper: string;
  icon: LucideIcon;
};

const intakeSignals = [
  {
    label: 'Best first step',
    value: 'Messy brief welcome',
  },
  {
    label: 'Reply rhythm',
    value: 'Within 1-2 business days',
  },
  {
    label: 'Where we work',
    value: 'Johannesburg + remote',
  },
];

const projectTypes: ProjectType[] = [
  {
    icon: Sparkles,
    title: 'Website rebuild',
    body: 'For brands that need a stronger public face, sharper conversion path, and cleaner content architecture.',
  },
  {
    icon: Workflow,
    title: 'Dashboard or system',
    body: 'For operational tools, CRM workflows, client portals, internal boards, and custom SaaS-style products.',
  },
  {
    icon: ShieldCheck,
    title: 'Automation support',
    body: 'For handoffs, lead capture, reporting, reminders, content workflows, and repetitive admin that should not stay manual.',
  },
];

const contactMethods: ContactMethod[] = [
  {
    label: 'Email',
    value: 'hello@kreativereflow.com',
    href: 'mailto:hello@kreativereflow.com',
    helper: 'Best for project notes, screenshots, and longer context.',
    icon: Mail,
  },
  {
    label: 'Phone',
    value: '+27 65 575 0713',
    href: 'tel:+27655750713',
    helper: 'Best once there is enough context to talk through the next step.',
    icon: Phone,
  },
  {
    label: 'Location',
    value: 'Johannesburg, South Africa',
    href: 'https://www.google.com/maps/place/Johannesburg,+South+Africa',
    helper: 'Building locally, working with clients across South Africa and beyond.',
    icon: MapPin,
  },
];

const intakeCardStyles = [
  'bg-[#5F9FAA] text-[#060808]',
  'bg-[#FC6E20] text-[#060808]',
  'bg-[#151419] text-[#FBFBFB]',
];

const projectCardStyles = [
  {
    card: 'bg-[#FAE18F] text-[#060808]',
    icon: 'border-[#060808]/16 bg-[#060808]/8 text-[#060808]/60',
    rule: 'border-[#060808]/16',
  },
  {
    card: 'bg-[#DD6211] text-[#060808]',
    icon: 'border-[#060808]/18 bg-[#060808]/8 text-[#060808]/58',
    rule: 'border-[#060808]/18',
  },
  {
    card: 'bg-[#596C72] text-[#FFF6E9]',
    icon: 'border-[#FFF6E9]/22 bg-[#FFF6E9]/8 text-[#FFF6E9]/72',
    rule: 'border-[#FFF6E9]/22',
  },
];

const contactCardStyles = [
  {
    card: 'text-[#151419] hover:border-[#596C72] hover:text-[#596C72]',
    icon: 'border-[#151419]/12 text-[#151419]/55 group-hover:border-[#596C72]/35 group-hover:text-[#596C72]',
    rule: 'border-[#151419]/10 group-hover:border-[#596C72]/30',
    muted: 'text-[#696969] group-hover:text-[#596C72]/80',
  },
  {
    card: 'text-[#151419] hover:border-[#FC6E20] hover:text-[#FC6E20]',
    icon: 'border-[#151419]/12 text-[#151419]/55 group-hover:border-[#FC6E20]/35 group-hover:text-[#FC6E20]',
    rule: 'border-[#151419]/10 group-hover:border-[#FC6E20]/30',
    muted: 'text-[#696969] group-hover:text-[#151419]/72',
  },
  {
    card: 'text-[#151419] hover:border-[#5F9FAA] hover:text-[#5F9FAA]',
    icon: 'border-[#151419]/12 text-[#151419]/55 group-hover:border-[#5F9FAA]/35 group-hover:text-[#5F9FAA]',
    rule: 'border-[#151419]/10 group-hover:border-[#5F9FAA]/30',
    muted: 'text-[#696969] group-hover:text-[#151419]/72',
  },
];

function revealInitial(direction: RevealDirection) {
  if (direction === 'left') return { opacity: 0, x: -34 };
  if (direction === 'right') return { opacity: 0, x: 34 };
  if (direction === 'fade') return { opacity: 0 };

  return { opacity: 0, y: 34 };
}

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

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : revealInitial(direction)}
      whileInView={reduceMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-15% 0px -10% 0px' }}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function GridLines({ dark = false }: { dark?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 left-[var(--left-gutter)] right-[var(--right-gutter)] z-0 grid grid-cols-6"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <span
          key={index}
          className={`border-l ${dark ? 'border-[#FBFBFB]/[0.055]' : 'border-[#151419]/[0.055]'}`}
        />
      ))}
      <span
        className={`border-l ${dark ? 'border-[#FBFBFB]/[0.055]' : 'border-[#151419]/[0.055]'}`}
      />
    </div>
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

function PrimaryButton({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-[#151419] px-6 py-3 font-montserrat text-sm font-bold uppercase tracking-[0.06em] text-[#FBFBFB] transition-colors duration-300 hover:bg-[#FC6E20] hover:text-[#151419] sm:w-auto"
    >
      <AnimatedLinkText hiddenClassName="text-[#151419]">{children}</AnimatedLinkText>
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

function HeroSection() {
  return (
    <section className="content-gutter relative z-10 grid min-h-screen grid-cols-1 items-start gap-12 py-28 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.86fr)] lg:items-center lg:gap-16 lg:py-32">
      <Reveal direction="left">
        <div>
          <SectionLabel>Project intake</SectionLabel>
          <h1 className="mt-6 max-w-5xl font-playfair text-[clamp(4.4rem,10vw,8.7rem)] font-bold leading-[0.88] tracking-normal text-[#151419]">
            Send the messy version.
            {' '}
            <br />
            We will find the next move<span className="text-[#FC6E20]">.</span>
          </h1>
          <p className="mt-7 max-w-2xl font-montserrat text-base leading-8 text-[#5d5d5d] md:text-lg">
            Bring the goal, friction, screenshots, rough idea, or workflow that keeps stealing time. The first reply should turn the noise into a practical next step.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {intakeSignals.map((signal, index) => (
              <div
                key={signal.label}
                className={`min-h-[8rem] rounded-[1.35rem] p-5 shadow-[0_20px_54px_rgba(21,20,25,0.08)] ${intakeCardStyles[index % intakeCardStyles.length]}`}
              >
                <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.22em] opacity-65">
                  {signal.label}
                </p>
                <p className="mt-5 font-mono text-sm leading-6">{signal.value}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal direction="right" delay={0.08}>
        <div className="relative lg:rotate-1">
          <div className="absolute -inset-5 -z-10 rounded-[2.75rem] bg-[#FC6E20]/10 blur-2xl" />
          <ContactForm />
        </div>
      </Reveal>
    </section>
  );
}

function ProjectFitSection() {
  return (
    <section className="relative z-10 bg-[#060808] py-20 text-[#FBFBFB] md:py-28">
      <div className="content-gutter grid gap-12 lg:grid-cols-[minmax(0,1.18fr)_minmax(320px,0.82fr)] lg:items-start lg:gap-16">
        <Reveal className="grid gap-5 md:grid-cols-3" direction="left">
          {projectTypes.map((type, index) => {
            const Icon = type.icon;
            const style = projectCardStyles[index % projectCardStyles.length];

            return (
              <article
                key={type.title}
                className={`group flex min-h-[23rem] flex-col justify-between rounded-[2.25rem] p-7 shadow-[0_28px_70px_rgba(0,0,0,0.22)] transition-transform duration-300 hover:-translate-y-2 md:p-8 ${style.card}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`grid h-12 w-12 place-items-center rounded-[1.05rem] border ${style.icon}`}
                  >
                    <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.7} />
                  </div>
                  <span className="font-mono text-xs opacity-65">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <div>
                  <h3 className="max-w-[12rem] font-playfair text-4xl font-bold leading-[0.9] tracking-normal">
                    {type.title}
                  </h3>
                  <div className={`my-7 border-t ${style.rule}`} />
                  <p className="font-montserrat text-sm leading-7 opacity-75">{type.body}</p>
                </div>
              </article>
            );
          })}
        </Reveal>

        <Reveal className="lg:ml-auto lg:max-w-xl" direction="right" delay={0.08}>
          <SectionLabel>What belongs here</SectionLabel>
          <h2 className="mt-5 font-playfair text-5xl font-bold leading-[0.96] tracking-normal text-[#FBFBFB] md:text-7xl">
            Start with the thing that feels hard to explain<span className="text-[#FC6E20]">.</span>
          </h2>
          <p className="mt-6 font-montserrat text-base leading-8 text-[#FBFBFB]/68">
            The form is built for early context, not a perfect specification. Send enough signal for us to understand the work, the pressure, and the outcome you want.
          </p>
          <p className="mt-8 border-l border-[#FC6E20] pl-5 font-montserrat text-sm leading-7 text-[#FBFBFB]/72">
            You do not need a perfect brief. A clear sentence about what is not working is enough to start.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function ContactMethodsSection() {
  return (
    <section className="content-gutter relative z-10 py-20 md:py-28">
      <Reveal className="grid gap-10 lg:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)] lg:items-end" direction="up">
        <div>
          <SectionLabel>Direct routes</SectionLabel>
          <h2 className="mt-5 max-w-xl font-playfair text-5xl font-bold leading-[0.98] tracking-normal text-[#151419] md:text-7xl">
            Choose the channel that fits the context<span className="text-[#FC6E20]">.</span>
          </h2>
        </div>
        <p className="max-w-2xl font-montserrat text-base leading-8 text-[#696969] lg:ml-auto">
          Email is best for a proper brief, phone is best once the problem has shape, and location matters because most of the work is grounded in South African service-business reality.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {contactMethods.map((method, index) => {
          const Icon = method.icon;
          const style = contactCardStyles[index % contactCardStyles.length];

          return (
            <Reveal key={method.label} delay={index * 0.06} direction="up">
              <a
                href={method.href}
                className={`group flex min-h-[24rem] flex-col justify-between rounded-[2.25rem] border border-[#151419]/10 p-7 transition-colors duration-300 ${style.card}`}
                target={method.label === 'Location' ? '_blank' : undefined}
                rel={method.label === 'Location' ? 'noreferrer' : undefined}
              >
                <span className="flex items-center justify-between">
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-[1.05rem] border transition-colors ${style.icon}`}
                  >
                    <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.7} />
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-5 w-5 opacity-55 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                    strokeWidth={1.7}
                  />
                </span>
                <span className="block min-h-[11.25rem]">
                  <span className="font-montserrat text-[10px] font-bold uppercase tracking-[0.22em] opacity-62">
                    {method.label}
                  </span>
                  <span className="mt-4 block whitespace-nowrap font-playfair text-[clamp(1rem,1.72vw,2rem)] font-bold leading-[0.96] tracking-normal">
                    {method.value}
                  </span>
                  <span className={`my-7 block border-t transition-colors ${style.rule}`} />
                  <span className={`block font-montserrat text-sm leading-7 transition-colors ${style.muted}`}>
                    {method.helper}
                  </span>
                </span>
              </a>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function NextStepSection() {
  return (
    <section className="content-gutter relative z-10 pb-24 md:pb-32">
      <Reveal direction="up">
        <ExpandingCtaBackground>
          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <SectionLabel>Still unsure</SectionLabel>
              <h2 className="mt-5 font-playfair text-5xl font-bold leading-[0.96] tracking-normal md:text-7xl">
                Not ready to write it down? Pick a starting point first<span className="text-[#FC6E20]">.</span>
              </h2>
              <p className="mt-6 max-w-2xl font-montserrat text-base leading-8 text-[#151419]/64">
                If the project is still blurry, look through the services or use a diagnostic tool before you write the brief. Either route is fine.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <PrimaryButton href="/services">View services</PrimaryButton>
              <Link
                href="/tools"
                className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full border border-[#151419]/15 px-6 py-3 font-montserrat text-sm font-bold uppercase tracking-[0.06em] text-[#151419] transition-colors duration-300 hover:border-[#FC6E20] hover:text-[#FC6E20] sm:w-auto"
              >
                <AnimatedLinkText>Use a tool</AnimatedLinkText>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </ExpandingCtaBackground>
      </Reveal>
    </section>
  );
}

export function ContactClient() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#F0EFED] text-[#151419] selection:bg-[#FC6E20] selection:text-[#151419] [--left-gutter:4.5rem] [--right-gutter:1rem] dark:bg-[#151419] dark:text-[#FBFBFB] sm:[--left-gutter:4.75rem] sm:[--right-gutter:1.5rem] lg:[--left-gutter:5.5rem] lg:[--right-gutter:3.5rem] xl:[--right-gutter:75px]">
      <GridLines />
      <HeroSection />
      <ProjectFitSection />
      <ContactMethodsSection />
      <NextStepSection />
    </main>
  );
}
