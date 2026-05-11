'use client';

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatedTextLink } from "@/components/AnimatedTextLink";

export default function FounderTeaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="px-6 py-24 md:py-32 bg-stone-50 dark:bg-stone-900 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-12 md:gap-16 items-start">

        {/* ── Image Column ── */}
        <div
          className="md:col-span-2"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {/* Image wrapper with gold corner brackets */}
          <div className="relative aspect-[4/5] w-full max-w-sm mx-auto md:mx-0 overflow-hidden rounded-2xl bg-stone-200 dark:bg-stone-800 group">
            <Image
              src="/images/delite-founder.svg"
              alt="Delite, Founder of Kreative Reflow"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 40vw"
              priority
            />

            {/* Subtle warm overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/20 via-transparent to-transparent pointer-events-none" />

            {/* Gold corner bracket — bottom-left */}
            <div className="absolute bottom-5 left-5 pointer-events-none" aria-hidden="true">
              <span className="absolute bottom-0 left-0 block h-[2px] w-7 bg-[#FC6E20]" />
              <span className="absolute bottom-0 left-0 block w-[2px] h-7 bg-[#FC6E20]" />
            </div>

            {/* Gold corner bracket — top-right */}
            <div className="absolute top-5 right-5 pointer-events-none" aria-hidden="true">
              <span className="absolute top-0 right-0 block h-[2px] w-7 bg-[#FC6E20]" />
              <span className="absolute top-0 right-0 block w-[2px] h-7 bg-[#FC6E20]" />
            </div>
          </div>
        </div>

        {/* ── Text Column ── */}
        <div className="md:col-span-3 flex flex-col">

          {/* Eyebrow — gold rule + label */}
          <div
            className="flex items-center gap-3 mb-7"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s',
            }}
          >
            <span className="inline-block w-8 h-[1.5px] bg-[#FC6E20] flex-shrink-0" aria-hidden="true" />
            <p
              className="text-[10px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400"
              style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
            >
              The Person Behind the Studio
            </p>
          </div>

          {/* Headline */}
          <h2
            className="text-stone-950 dark:text-stone-50 mb-8 text-balance"
            style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 'clamp(1.75rem, 3.5vw, 3rem)',
              lineHeight: 1.08,
              fontWeight: 400,
              letterSpacing: '-0.01em',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s',
            }}
          >
            I spent years inside hospitals watching great doctors lose patients to Google.
          </h2>

          {/* Body — left gold rule */}
          <div
            className="relative pl-5 border-l border-[#FC6E20]/35"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.35s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.35s',
            }}
          >
            <div
              className="text-stone-700 dark:text-stone-300 space-y-4"
              style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '15px', lineHeight: '1.75' }}
            >
              <p>
                Seven years in medical sales and neurology put me in operating theatres and surgeon's offices. I saw brilliant specialists with no digital presence. Practices running on referrals. A company making millions a month with a one-page website and a social feed full of holiday graphics.
              </p>
              <p className="text-stone-950 dark:text-stone-100 font-medium">
                They had brilliant products. Nobody knew.
              </p>
              <p>
                I kept thinking: someone should fix this. Eventually I realised that someone was going to have to be me.
              </p>
              <p>
                I taught myself how websites are supposed to work. Not just look good — capture leads, build trust, position you before you say a word. And I kept asking why everyone sells these pieces separately.
              </p>
              <p>
                Kreative Reflow exists because businesses deserve more than a transaction. I work with a small number of clients at a time. That's a choice, not a limitation.
              </p>
            </div>
          </div>

          {/* CTA row */}
          <div
            className="mt-9 flex items-center gap-6 flex-wrap"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s',
            }}
          >
            <AnimatedTextLink
              href="/about"
              withArrow
              className="text-stone-950 dark:text-stone-50"
              style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '14px', fontWeight: 500 }}
            >
              Read the full story
            </AnimatedTextLink>

            <span
              className="text-stone-400 dark:text-stone-600 text-xs"
              aria-hidden="true"
            >
              /
            </span>

            <p
              className="text-stone-500 dark:text-stone-400 italic"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '15px' }}
            >
              — Delite, Founder
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
