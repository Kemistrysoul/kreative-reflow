"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

const DottedSurface = dynamic(
  () => import("@/components/ui/dotted-surface").then((m) => ({ default: m.DottedSurface })),
  { ssr: false }
);

const ITEMS = [
  {
    name: "SERVICE BUSINESSES",
    desc: "When trust drives the sale, your website has to make the next step feel obvious. We build clear service pages, enquiry paths, and follow-up systems for professional firms."
  },
  {
    name: "ENGINEERING FIRMS",
    desc: "Your clients need to see the work, the method, and the proof. We build project portfolios, tender-ready sites, and client dashboards for engineering teams."
  },
  {
    name: "MEDICAL PRACTICES",
    desc: "Patients need clarity before they book. We build practice websites and patient-facing systems that make services, trust, and next steps easier to understand."
  },
  {
    name: "SAAS FOUNDERS",
    desc: "Early product work gets messy fast. We help shape the site, app flow, and onboarding so people understand the product and know what to do next."
  },
  {
    name: "RETAIL & E-COMMERCE",
    desc: "People should be able to find the right product, trust the store, and check out without friction. We build fast online shops with cleaner product paths."
  },
  {
    name: "LEGAL & PROFESSIONAL",
    desc: "People come to you with serious questions. We build websites that explain your services clearly and help the right clients reach out with confidence."
  },
];

export default function DottedSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>(0);
  const activeIndexRef = useRef<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 25%", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 30,
    restDelta: 0.001,
  });

  const introY = useTransform(smoothProgress, [0, 0.18, 0.42], ["64vh", "0vh", "-72vh"]);
  const introOpacity = useTransform(smoothProgress, [0, 0.08, 0.32, 0.42], [0, 1, 1, 0]);
  const introScale = useTransform(smoothProgress, [0, 0.18, 0.42], [0.96, 1, 0.985]);

  useEffect(() => {
    if (prefersReducedMotion) {
      itemRefs.current.forEach((item) => {
        if (!item) return;
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
        item.style.pointerEvents = 'auto';
      });
      return;
    }

    const updateItems = () => {
      if (!sectionRef.current) return;

      const sectionRect = sectionRef.current.getBoundingClientRect();
      const sectionH = sectionRef.current.offsetHeight;
      const viewportH = window.innerHeight;
      const scrolled = Math.max(0, -sectionRect.top);
      const totalScroll = Math.max(1, sectionH - viewportH);
      const progress = Math.min(1, scrolled / totalScroll);

      // ── Intro: simple fade-out over the first 30% of scroll ──
      // ── Industry list: distance-based focal lens ──
      const viewportCenter = viewportH / 2;

      let nextActiveIndex: number | null = null;
      let nextActiveDistance = Number.POSITIVE_INFINITY;

      itemRefs.current.forEach((item, index) => {
        if (!item) return;

        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        const offsetFromCenter = itemCenter - viewportCenter; // positive = below, negative = above
        const distanceFromCenter = Math.abs(offsetFromCenter);

        // Same zones as headline: sharp center, smooth edges
        const fullColorZone = 80;
        const fadeZone = viewportH * 0.6;

        let focalOpacity: number;
        let yShift: number;

        if (distanceFromCenter <= fullColorZone) {
          // Dead center — full brightness, no shift (same as headline hold zone)
          focalOpacity = 1;
          yShift = 0;
        } else if (offsetFromCenter > 0) {
          // Below center — visible and rising up
          const fadT = Math.min((distanceFromCenter - fullColorZone) / (fadeZone - fullColorZone), 1);
          focalOpacity = 0.35 + (1 - fadT) * 0.65; // 0.35 at bottom, 1.0 near center
          yShift = fadT * 30;
        } else {
          // Above center — fade out gently
          const fadT = Math.min((distanceFromCenter - fullColorZone) / (fadeZone - fullColorZone), 1);
          focalOpacity = 1 - fadT * 0.95;
          yShift = 0;
        }

        const opacity = focalOpacity;
        item.style.opacity = String(Math.max(0, opacity));
        item.style.transform = `translateY(${yShift}px)`;
        item.style.pointerEvents = opacity > 0.15 ? 'auto' : 'none';

        if (opacity > 0.48 && distanceFromCenter < nextActiveDistance) {
          nextActiveDistance = distanceFromCenter;
          nextActiveIndex = index;
        }
      });

      if (activeIndexRef.current !== nextActiveIndex) {
        activeIndexRef.current = nextActiveIndex;
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateItems);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateItems();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative z-[5] w-full bg-[#F0EFED] dark:bg-[#1a1a1a]"
      style={{ isolation: 'isolate' }}
    >
      {/* Layer 1 — Sticky dot background (marginBottom trick keeps it pinned) */}
      <div className="sticky top-0 h-screen w-full pointer-events-none z-0" style={{ marginBottom: '-100vh' }}>
        <DottedSurface sectionRef={sectionRef} className="inset-0" />
      </div>

      {/* Layer 2 — Sticky intro heading (fades out as you scroll) */}
      <motion.div
        className="sticky top-0 z-10 flex h-screen flex-col items-center justify-center overflow-hidden pointer-events-none select-none px-6"
      >
        <motion.div
          className="w-full max-w-4xl text-center will-change-transform"
          style={prefersReducedMotion ? { y: 0, opacity: 1, scale: 1 } : { y: introY, opacity: introOpacity, scale: introScale }}
        >
          <span className="font-montserrat text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#6b6b6b] dark:text-snow/50 mb-4 block">
            <span className="text-[#FC6E20]">[</span> OUR FOCUS <span className="text-[#FC6E20]">]</span>
          </span>
          <h2 className="font-playfair text-[clamp(2.8rem,6vw,5.9rem)] font-bold uppercase leading-[0.94] tracking-tight text-dark-void dark:text-snow mb-6">
            WE BUILD FOR INDUSTRIES<br className="hidden md:block" /> THAT DEMAND PRECISION<span className="text-[#FC6E20]">.</span>
          </h2>
          <p className="text-base md:text-lg text-[#6b6b6b] dark:text-snow/60 max-w-2xl mx-auto font-sans leading-relaxed">
            We work with medical practices, engineering firms, SaaS founders, and service businesses that need websites and systems built around how their teams actually work.
          </p>
        </motion.div>
      </motion.div>

      {/* Layer 3 — Naturally scrolling industry list */}
      <div
        className="relative z-20 flex flex-col items-center"
        style={{ paddingTop: '30vh', paddingBottom: '50vh' }}
      >
        {ITEMS.map((item, i) => {
          const showDetails = hoveredIndex === i;

          return (
            <div
              key={i}
              ref={(el) => { itemRefs.current[i] = el; }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative flex flex-col items-center justify-center text-center cursor-pointer group px-4 py-6 md:py-8"
              style={{ opacity: 0, transition: 'opacity 180ms ease-out' }}
            >
              {/* Focal Brackets */}
              <div className={`absolute -inset-x-8 -inset-y-4 transition-all duration-500 sm:-inset-x-12 ${showDetails ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#DD6211]" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#DD6211]" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#DD6211]" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#DD6211]" />
              </div>

              <h3 className="industry-heading font-playfair text-[clamp(2.8rem,6vw,5.9rem)] font-bold uppercase leading-[0.94] tracking-tight text-[#151419] dark:text-snow selection:bg-none transition-opacity duration-150 ease-out">
                {item.name}
              </h3>

              {/* Description reveal */}
              <div
                className="overflow-hidden"
                style={{
                  display: 'grid',
                  gridTemplateRows: showDetails ? '1fr' : '0fr',
                  opacity: showDetails ? 1 : 0,
                  transition: 'grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
                }}
              >
                <div className="min-h-0">
                  <p className="mt-6 text-base md:text-lg text-[#6b6b6b] dark:text-snow/60 max-w-md font-sans leading-relaxed mx-auto px-4">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
