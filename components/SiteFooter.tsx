'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { AnimatedLinkText, AnimatedTextLink } from '@/components/AnimatedTextLink';

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

type FooterColumn = {
  title: string;
  links: FooterLink[];
};

const footerColumns: FooterColumn[] = [
  {
    title: 'Studio',
    links: [
      { label: 'Work', href: '/work' },
      { label: 'About', href: '/about' },
      { label: 'Insights', href: '/insights' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Websites', href: '/services/web-design' },
      { label: 'SaaS products', href: '/services/saas-development' },
      { label: 'Automation', href: '/services/automation' },
      { label: 'SEO systems', href: '/services/seo' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Services', href: '/services' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Tools', href: '/tools' },
      { label: 'Start a project', href: '/contact' },
    ],
  },
  {
    title: 'Social',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/company/kreativereflow', external: true },
      { label: 'Instagram', href: 'https://www.instagram.com/kreativereflow', external: true },
      { label: 'Facebook', href: 'https://www.facebook.com/KreativeReflow', external: true },
      { label: 'TikTok', href: 'https://www.tiktok.com/@kreativereflow', external: true },
    ],
  },
];

const marqueeText = [
  'KREATIVE REFLOW',
  'KREATIVE REFLOW',
  'KREATIVE REFLOW',
  'KREATIVE REFLOW',
];

const footerHeadline =
  'Build the website, dashboard, or automation your business keeps trying to run without.';

function MagicFooterWord({
  children,
  index,
  progress,
  total,
}: {
  children: string;
  index: number;
  progress: MotionValue<number>;
  total: number;
}) {
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const isIntro = index < 6;
  const hasTerminalPeriod = children.endsWith('.');
  const word = hasTerminalPeriod ? children.slice(0, -1) : children;
  const accentWord = (
    <>
      {word}
      {hasTerminalPeriod ? <span className="text-[#FC6E20]">.</span> : null}
    </>
  );
  const ghostWord = hasTerminalPeriod ? `${word}.` : word;

  return (
    <span
      aria-hidden="true"
      className={`relative mr-[0.18em] inline-block ${isIntro ? 'text-white/42' : 'text-white'}`}
    >
      <span aria-hidden="true" className="absolute inset-0 opacity-20">
        {ghostWord}
      </span>
      <motion.span style={{ opacity }}>{accentWord}</motion.span>
    </span>
  );
}

function MagicFooterText({ text }: { text: string }) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.9', 'start 0.25'],
  });

  const words = text.split(' ');
  const staticProgress = useTransform(scrollYProgress, [0, 1], [1, 1]);
  const progress = prefersReducedMotion ? staticProgress : scrollYProgress;

  return (
    <h2
      aria-label={text}
      ref={containerRef}
      className="max-w-5xl font-playfair text-4xl font-bold leading-[1.04] text-white md:text-6xl lg:text-[5.5rem]"
    >
      {words.map((word, index) => (
        <MagicFooterWord
          key={`${word}-${index}`}
          index={index}
          progress={progress}
          total={words.length}
        >
          {word}
        </MagicFooterWord>
      ))}
    </h2>
  );
}

export function SiteFooter() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <footer className="relative overflow-hidden bg-[#151419] text-[#FBFBFB]">
      <div className="pointer-events-none absolute inset-0 opacity-35">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:12rem_12rem]" />
      </div>

      <div className="content-gutter relative z-10 pt-20 md:pt-28">
        <div className="grid gap-10 border-b border-white/10 pb-16 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:pb-20">
          <MagicFooterText text={footerHeadline} />

          <Link
            href="/contact"
            className="group inline-flex h-16 w-full items-center justify-between rounded-full bg-[#FC6E20] px-5 font-montserrat text-sm font-bold uppercase text-[#151419] transition hover:bg-[#FBFBFB] sm:w-auto sm:min-w-[218px]"
          >
            <AnimatedLinkText hiddenClassName="text-[#151419]">Start a project</AnimatedLinkText>
            <span className="ml-4 grid h-10 w-10 place-items-center rounded-full bg-[#151419] text-white transition group-hover:-translate-y-1 group-hover:translate-x-1">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        </div>

        <div className="grid gap-12 py-14 md:grid-cols-[1.1fr_0.9fr] md:py-16 lg:gap-20">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-4"
            >
              <img src="/images/kr_logo.png" alt="Kreative Reflow" className="h-12 w-auto" />
              <span className="font-playfair text-2xl font-bold uppercase leading-none text-white">
                KREATIVE<br /><span className="tracking-[0.14em] text-[#F0EFED]">REFLOW</span>
              </span>
            </Link>
            <p className="mt-6 max-w-md font-montserrat text-base leading-8 text-white/68">
              We build websites, SaaS products, dashboards, and automation
              systems for businesses that need more than a pretty page.
            </p>
          </div>

          <div>
            <p className="font-montserrat text-sm font-semibold text-white">
              Tell us what you need built
            </p>
            <form
              action="/contact"
              method="get"
              className="mt-4 flex min-h-14 overflow-hidden rounded-full border border-white/14 bg-white/[0.055] focus-within:border-[#FC6E20]"
            >
              <label className="sr-only" htmlFor="footer-project">
                Project idea
              </label>
              <input
                id="footer-project"
                name="project"
                type="text"
                placeholder="Website, dashboard, automation..."
                className="min-w-0 flex-1 bg-transparent px-5 font-montserrat text-sm text-white outline-none placeholder:text-white/36"
              />
              <button
                type="submit"
                aria-label="Start project enquiry"
                className="m-1 grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/12 text-white transition hover:bg-[#FC6E20] hover:text-[#151419]"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            <p className="mt-3 font-mono text-[10px] uppercase text-white/32">
              No newsletter detour. This goes straight to the project
              conversation.
            </p>
          </div>
        </div>

        <div className="grid gap-8 border-y border-white/10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="font-mono text-[11px] font-bold uppercase text-white/42">
                <span className="text-[#FC6E20]">[ </span>
                {column.title}
                <span className="text-[#FC6E20]"> ]</span>
              </h3>
              <ul className="mt-5 space-y-3 font-montserrat text-sm text-white/58">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <AnimatedTextLink
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                    >
                      {link.label}
                    </AnimatedTextLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-5 py-8 font-mono text-[11px] uppercase text-white/36 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Kreative Reflow. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <AnimatedTextLink href="/privacy" className="text-white/36">
              Privacy Policy
            </AnimatedTextLink>
            <AnimatedTextLink href="/terms" className="text-white/36">
              Terms of Service
            </AnimatedTextLink>
          </div>
        </div>
      </div>

      <div className="relative z-0 overflow-hidden pb-4 pt-2">
        <motion.div
          className="flex w-max whitespace-nowrap bg-gradient-to-b from-[rgba(255,255,255,0.035)] to-[#151419] bg-clip-text font-sans text-[clamp(5rem,18vw,18rem)] font-black uppercase leading-none text-transparent"
          animate={prefersReducedMotion ? { x: '0%' } : { x: ['0%', '-50%'] }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 132, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }
          }
        >
          {[...marqueeText, ...marqueeText].map((item, index) => (
            <span key={`${item}-${index}`} className="mr-16">
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </footer>
  );
}
