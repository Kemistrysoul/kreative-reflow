'use client';

import { useEffect, useRef, useState } from 'react'; // useState kept for hoveredIndex
import { DottedSurface } from '@/components/ui/dotted-surface';

const INDUSTRIES = [
  {
    name: 'MEDICAL PRACTICES',
    description:
      'From specialist surgeries to dental clinics, we build patient-facing websites and practice management systems that reflect the precision of your work.',
  },
  {
    name: 'ENGINEERING FIRMS',
    description:
      'Technical credibility deserves a technical presence. We build project portfolios, tender-ready sites, and client dashboards for engineering businesses.',
  },
  {
    name: 'SERVICE BUSINESSES',
    description:
      'If your business runs on relationships and reputation, your website should do the same. We build lead-generating, trust-building digital presences for professional service firms.',
  },
  {
    name: 'SAAS FOUNDERS',
    description:
      'From MVP to market. We design and build SaaS products, marketing sites, and onboarding flows that turn signups into paying users.',
  },
  {
    name: 'RETAIL & E-COMMERCE',
    description:
      'Product-first design that converts browsers into buyers. We build fast, beautiful online stores and product experiences that sell.',
  },
  {
    name: 'LEGAL & PROFESSIONAL',
    description:
      'Authority and trust are your competitive advantage. We build digital presences that communicate both, instantly.',
  },
];

export default function IndustriesScrollSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const updateItems = () => {
      if (!sectionRef.current || !introRef.current) return;

      const sectionRect = sectionRef.current.getBoundingClientRect();
      const sectionH = sectionRef.current.offsetHeight;
      const viewportH = window.innerHeight;
      const scrolled = Math.max(0, -sectionRect.top);
      const totalScroll = Math.max(1, sectionH - viewportH);
      const progress = Math.min(1, scrolled / totalScroll);

      // Intro fades out over the first 30% of scroll progress
      introRef.current.style.opacity = String(Math.max(0, 1 - progress / 0.3));

      // Hide industry list until intro has fully faded (progress >= 0.3)
      const listReady = progress >= 0.3;
      const viewportCenter = viewportH / 2;
      itemRefs.current.forEach((item) => {
        if (!item) return;
        const nameEl = item.querySelector<HTMLElement>('.industry-name');
        if (!nameEl) return;
        if (!listReady) {
          nameEl.style.opacity = '0';
          return;
        }
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        const distanceFromCenter = Math.abs(itemCenter - viewportCenter);
        const maxDistance = viewportH * 0.5;
        const normalized = Math.min(distanceFromCenter / maxDistance, 1);
        const opacity = 0.15 + (1 - normalized) * 0.85;
        nameEl.style.opacity = String(opacity);
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateItems);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateItems();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-[6] w-full bg-[#F0EFED] dark:bg-[#1a1a1a] overflow-x-hidden"
      style={{ minHeight: 'calc(100vh + 400px)', isolation: 'isolate' }}
    >
      {/* Layer 1 — dot background, sticky so it stays in view for the full scroll */}
      <div className="sticky top-0 h-screen w-full pointer-events-none" style={{ marginBottom: '-100vh' }}>
        <DottedSurface sectionRef={sectionRef} className="inset-0" />
      </div>

      {/* Layer 2 — sticky intro heading */}
      <div
        ref={introRef}
        className="sticky top-0 z-10 flex flex-col items-center justify-center h-screen pointer-events-none select-none"
        style={{ transition: 'opacity 0.05s linear' }}
      >
        <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#6b7280] dark:text-[#8A9AB5] mb-6">
          OUR FOCUS
        </span>
        <h2
          className="font-bold uppercase text-center leading-tight text-[#1a1a1a] dark:text-[#F0F0EF] mb-6"
          style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            letterSpacing: '-0.02em',
            fontFamily: 'var(--font-space-grotesk), sans-serif',
          }}
        >
          We Build For Industries<br />
          That Demand Precision.
        </h2>
        <p className="font-montserrat text-sm md:text-base text-center text-[#4b5563] dark:text-[#8A9AB5] max-w-lg leading-relaxed">
          From medical practices to engineering firms,<br className="hidden md:block" />
          from SaaS founders to service businesses —<br className="hidden md:block" />
          we build digital infrastructure that matches<br className="hidden md:block" />
          the complexity of the work you do.
        </p>
      </div>

      {/* Layer 3 — scrolling industry list */}
      {/* padding-top: 100vh pushes list below the sticky intro's flow space */}
      <div
        className="relative z-20 flex flex-col items-center"
        style={{ paddingTop: '10vh', paddingBottom: '4vh' }}
      >
        {INDUSTRIES.map((industry, i) => {
          const isHovered = hoveredIndex === i;

          return (
            <div
              key={industry.name}
              ref={(el) => { itemRefs.current[i] = el; }}
              className="relative flex flex-col items-center py-3 px-4 md:px-16 cursor-default"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Top-left bracket */}
              <span
                className="absolute top-6 left-6 pointer-events-none"
                style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s ease' }}
              >
                <span style={{ position: 'absolute', top: 0, left: 0, width: 20, height: 2, background: '#F5A623', display: 'block' }} />
                <span style={{ position: 'absolute', top: 0, left: 0, width: 2, height: 20, background: '#F5A623', display: 'block' }} />
              </span>

              {/* Bottom-right bracket */}
              <span
                className="absolute bottom-6 right-6 pointer-events-none"
                style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s ease' }}
              >
                <span style={{ position: 'absolute', bottom: 0, right: 0, width: 20, height: 2, background: '#F5A623', display: 'block' }} />
                <span style={{ position: 'absolute', bottom: 0, right: 0, width: 2, height: 20, background: '#F5A623', display: 'block' }} />
              </span>

              {/* Industry name — styled directly by scroll handler via .industry-name */}
              <span
                className="industry-name text-[#1a1a1a] dark:text-[#F0F0EF]"
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', Georgia, serif",
                  fontSize: 'clamp(2rem, 12vw, 75px)',
                  lineHeight: 'clamp(2.5rem, 14vw, 80px)',
                  fontWeight: 400,
                  opacity: 0.25,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  transition: 'opacity 0.15s ease',
                  display: 'block',
                  textAlign: 'center',
                  willChange: 'opacity, font-size',
                }}
              >
                {industry.name}
              </span>

              {/* Description — smooth grid-row reveal on hover */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateRows: isHovered ? '1fr' : '0fr',
                  transition: 'grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <div style={{ overflow: 'hidden' }}>
                  <span
                    className="industry-description text-[#1a1a1a] dark:text-[#F0F0EF]"
                    style={{
                      fontSize: '17px',
                      opacity: isHovered ? 1 : 0,
                      maxWidth: '500px',
                      textAlign: 'center',
                      display: 'block',
                      marginTop: '0.5rem',
                      paddingBottom: '0.25rem',
                      transition: 'opacity 0.3s ease 0.05s',
                    }}
                  >
                    {industry.description}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
