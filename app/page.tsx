'use client';

import dynamic from 'next/dynamic';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Waves from '@/components/Waves';
import { AnimatedLinkText } from '@/components/AnimatedTextLink';

// Below-fold sections are code-split so the initial bundle only carries the
// hero. They stay server-rendered (ssr: true is the default), so SEO content
// is unaffected; only the hydration JS is deferred to separate chunks.
const IntroSection = dynamic(() => import('./home-sections').then((m) => m.IntroSection));
const BusinessHeroSection = dynamic(() => import('./home-sections').then((m) => m.BusinessHeroSection));
const Testimonial = dynamic(() => import('./home-sections').then((m) => m.Testimonial));
const DiagnosticToolsBridge = dynamic(() => import('./home-sections').then((m) => m.DiagnosticToolsBridge));
const HowItWorks = dynamic(() => import('./home-sections').then((m) => m.HowItWorks));
const Insights = dynamic(() => import('./home-sections').then((m) => m.Insights));
const HomeFinalCta = dynamic(() => import('./home-sections').then((m) => m.HomeFinalCta));
const DottedSection = dynamic(() => import('@/components/dotted-section'));
const FounderTeaser = dynamic(() => import('@/components/FounderTeaser'));

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F0EFED] dark:bg-[#1a1a1a] text-dark-void dark:text-snow font-sans selection:bg-liquid-lava selection:text-snow [overflow-x:clip]">
      <main className="flex-grow relative z-10 w-full [overflow-x:clip]">
        <Hero />
        <IntroSection />
        <DottedSection />
        <div className="mt-12 md:mt-20">
          <BusinessHeroSection />
        </div>
        <Testimonial />
        <DiagnosticToolsBridge />
        <HowItWorks />
        <FounderTeaser />
        <Insights />
        <HomeFinalCta />
      </main>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-stone-50 dark:bg-[#1A1A1A] isolate">
      <Waves />

      <div className="relative z-10 text-center w-full max-w-6xl px-4 sm:px-6">
        <h1 className="font-playfair text-[clamp(3.1rem,7.2vw,7.2rem)] font-bold leading-[0.93] tracking-tight text-stone-950 dark:text-stone-50">
          Websites that bring in work.<span className="sr-only"> </span><br />
          Systems that keep it running<span className="text-[#FC6E20]">.</span>
        </h1>
        <p className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl font-montserrat text-stone-600 dark:text-stone-400 max-w-3xl mx-auto px-2">
          Custom-built for South African service businesses and founders.
          The public pages earn trust and capture leads, and the systems
          behind them cut the manual admin.
        </p>
        <div className="mt-8 sm:mt-10 flex w-full flex-col items-center justify-center gap-4 px-4 sm:flex-row sm:px-0">
          <Link
            href="/contact"
            className="group/link inline-flex min-h-[44px] w-full items-center justify-center gap-2 overflow-visible rounded-full bg-[#FC6E20] px-8 py-4 font-montserrat font-medium text-stone-950 transition-colors hover:bg-[#DD6211] sm:w-auto"
          >
            <AnimatedLinkText hiddenClassName="text-stone-950">Book a Discovery Call</AnimatedLinkText>
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover/link:translate-x-1"
            />
          </Link>
          <Link
            href="/work"
            className="group/link inline-flex min-h-[44px] w-full items-center justify-center gap-2 overflow-visible px-4 py-3 font-montserrat font-medium text-stone-950 transition-colors hover:text-stone-700 dark:text-stone-50 dark:hover:text-stone-300 sm:w-auto"
          >
            <AnimatedLinkText hiddenClassName="text-[#FC6E20]">View Selected Work</AnimatedLinkText>
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover/link:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
