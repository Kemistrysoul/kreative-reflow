'use client';

import Link from 'next/link';
import { useAnimate, motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

type TickerItem = {
  label: string;
  href: string;
  accent?: boolean;
};

const primaryRow: TickerItem[] = [
  { label: 'Web Design', href: '/services/web-design', accent: true },
  { label: 'SaaS Apps', href: '/services/saas-development' },
  { label: 'Local SEO', href: '/services/seo' },
  { label: 'Automation', href: '/services/automation', accent: true },
  { label: 'Strategy Calls', href: '/contact' },
  { label: 'Support Plans', href: '/contact' },
];

const secondaryRow: TickerItem[] = [
  { label: 'Lead Funnels', href: '/services/web-design' },
  { label: 'Client Portals', href: '/services/saas-development', accent: true },
  { label: 'Google Maps SEO', href: '/services/seo' },
  { label: 'AI Workflows', href: '/services/automation' },
  { label: 'Discovery Session', href: '/contact', accent: true },
  { label: 'Ongoing Care', href: '/contact' },
];

function TickerRow({
  items,
  direction,
  duration,
}: {
  items: TickerItem[];
  direction: 'left' | 'right';
  duration: number;
}) {
  const [scope, animate] = useAnimate();
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);

  useEffect(() => {
    animationRef.current = animate(
      scope.current,
      { x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'] },
      {
        duration,
        repeat: Infinity,
        ease: 'linear',
      },
    );

    return () => animationRef.current?.stop();
  }, [animate, direction, duration, scope]);

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#151419] to-transparent md:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#151419] to-transparent md:w-28" />

      <div ref={scope} className="flex w-max">
        {[0, 1].map((setIndex) => (
          <div
            key={setIndex}
            className="flex shrink-0 items-center gap-3 px-3 py-2 md:gap-5 md:px-5"
          >
            {items.map((item) => (
              <motion.div key={`${setIndex}-${item.label}`} whileHover={{ y: -4, scale: 1.02 }}>
                <Link
                  href={item.href}
                  className={[
                    'group flex items-center gap-3 rounded-full border px-4 py-3 transition-colors duration-300 md:px-6',
                    item.accent
                      ? 'border-[#FC6E20]/60 bg-[#FC6E20] text-[#151419] hover:bg-[#ffd2b8]'
                      : 'border-white/15 bg-white/[0.04] text-white hover:border-[#FC6E20]/70 hover:bg-white/[0.1]',
                  ].join(' ')}
                >
                  <span className="font-montserrat text-[0.68rem] uppercase tracking-[0.3em] text-current/60">
                    Service
                  </span>
                  <span className="font-playfair text-2xl font-bold tracking-tight md:text-4xl">
                    {item.label}
                  </span>
                  <span
                    className={[
                      'flex size-9 items-center justify-center rounded-full border transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1',
                      item.accent ? 'border-black/15' : 'border-white/15',
                    ].join(' ')}
                  >
                    <ArrowUpRight className="size-4" strokeWidth={1.8} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ServicesInteractiveTicker() {
  return (
    <section className="relative overflow-hidden bg-[#151419] py-16 text-white md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(252,110,32,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_35%)]" />

      <div className="relative flex flex-col gap-4 md:gap-6">
        <TickerRow items={primaryRow} direction="left" duration={28} />
        <TickerRow items={secondaryRow} direction="right" duration={32} />
      </div>
    </section>
  );
}
