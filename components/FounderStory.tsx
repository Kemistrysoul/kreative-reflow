'use client';

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* ─── Reveal hook ─────────────────────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── Chapter marker ──────────────────────────────────────── */
function ChapterMarker({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span
        className="text-[#FC6E20] select-none"
        style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em' }}
        aria-hidden="true"
      >
        {number}
      </span>
      <span className="flex-1 h-[1px] bg-[#FC6E20]/30" aria-hidden="true" />
      <span
        className="text-stone-400 dark:text-stone-500 uppercase"
        style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '9px', letterSpacing: '0.25em' }}
      >
        {label}
      </span>
    </div>
  );
}

/* ─── Inline pull quote ───────────────────────────────────── */
function PullQuote({ quote, delay = 0 }: { quote: string; delay?: number }) {
  const { ref, visible } = useReveal(0.2);
  return (
    <div
      ref={ref}
      className="my-14 md:my-20 px-0 md:px-8"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 1s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 1s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      <div className="relative pl-7 border-l-2 border-[#FC6E20]">
        <p
          className="text-stone-800 dark:text-stone-200 text-balance italic"
          style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
            lineHeight: 1.35,
            fontWeight: 400,
          }}
        >
          {quote}
        </p>
      </div>
    </div>
  );
}

/* ─── Body paragraph block ────────────────────────────────── */
function BodyText({ children, delay = 0, visible }: { children: React.ReactNode; delay?: number; visible: boolean }) {
  return (
    <div
      className="text-stone-700 dark:text-stone-300 space-y-5"
      style={{
        fontFamily: 'var(--font-montserrat), sans-serif',
        fontSize: '16px',
        lineHeight: '1.8',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */
/*  Main component                                             */
/* ═══════════════════════════════════════════════════════════ */
export default function FounderStory() {
  return (
    <article className="bg-stone-50 dark:bg-stone-900">

      {/* ── OPENING HOOK ──────────────────────────────────────── */}
      <OpeningHook />

      {/* ── CHAPTER 01 — The Scene ────────────────────────────── */}
      <ChapterScene />

      {/* ── CHAPTER 02 — The Turn ────────────────────────────── */}
      <ChapterTurn />

      {/* ── CHAPTER 03 — The Build ────────────────────────────── */}
      <ChapterBuild />

      {/* ── SIGNATURE CLOSE ───────────────────────────────────── */}
      <SignatureClose />

    </article>
  );
}

/* ─── Opening Hook ────────────────────────────────────────── */
function OpeningHook() {
  const { ref, visible } = useReveal(0.1);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-stone-950 dark:bg-stone-950 px-6 py-24 md:py-36"
    >
      {/* Background texture — grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '180px',
        }}
      />

      {/* Faint gold horizontal rule across the top */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FC6E20]/50 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Oversized decorative quote mark */}
        <div
          className="select-none"
          aria-hidden="true"
          style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(7rem, 16vw, 12rem)',
            lineHeight: 0.7,
            color: '#FC6E20',
            opacity: visible ? 0.9 : 0,
            transition: 'opacity 1.2s cubic-bezier(0.16,1,0.3,1) 0s',
            marginBottom: '1.5rem',
            display: 'block',
          }}
        >
          "
        </div>

        {/* The hook quote */}
        <h1
          className="text-stone-50 text-balance"
          style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(1.6rem, 3.8vw, 3rem)',
            lineHeight: 1.15,
            fontWeight: 400,
            letterSpacing: '-0.01em',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1) 0.2s, transform 1s cubic-bezier(0.16,1,0.3,1) 0.2s',
          }}
        >
          I spent years inside hospitals watching great doctors lose patients to Google<span className="text-[#FC6E20]">.</span>
        </h1>

        {/* Closing mark + attribution */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s',
          }}
        >
          <div className="flex items-center justify-center gap-4 mt-10">
            <span className="h-[1px] w-8 bg-[#FC6E20]/50" aria-hidden="true" />
            <p
              className="text-stone-400 italic"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '15px' }}
            >
              Disele Mphafe, Founder - Kreative Reflow
            </p>
            <span className="h-[1px] w-8 bg-[#FC6E20]/50" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Gold rule at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FC6E20]/50 to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </section>
  );
}

/* ─── Chapter 01 — The Scene ──────────────────────────────── */
function ChapterScene() {
  const { ref, visible } = useReveal(0.08);

  return (
    <section ref={ref} className="px-6 py-20 md:py-28">
      <div className="max-w-5xl mx-auto">

        {/* Two-column editorial layout */}
        <div className="grid md:grid-cols-12 gap-8 md:gap-16">

          {/* Left — chapter label, image */}
          <div
            className="md:col-span-4 md:pt-1"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s',
            }}
          >
            <ChapterMarker number="01" label="The Scene" />

            {/* Portrait — smaller editorial size */}
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-stone-200 dark:bg-stone-800 group">
              <Image
                src="/images/disele-founder-warm.webp"
                alt="Disele Mphafe, Founder of Kreative Reflow"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 90vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/30 via-transparent to-transparent pointer-events-none" />

              {/* Gold corner — bottom-left */}
              <div className="absolute bottom-4 left-4" aria-hidden="true">
                <span className="absolute bottom-0 left-0 block h-[2px] w-6 bg-[#FC6E20]" />
                <span className="absolute bottom-0 left-0 block w-[2px] h-6 bg-[#FC6E20]" />
              </div>
            </div>

            {/* Caption */}
            <p
              className="mt-3 text-stone-400 dark:text-stone-500"
              style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '11px', letterSpacing: '0.08em' }}
            >
              Seven years in operating theatres and surgeon's offices.
            </p>
          </div>

          {/* Right — story text */}
          <div className="md:col-span-8 flex flex-col justify-start md:pt-12">
            <BodyText delay={200} visible={visible}>
              <p>
                Seven years in medical sales and neurology put me in operating theatres and surgeon's offices. I saw brilliant specialists with no digital presence. Practices running entirely on referrals. A company making millions a month with a one-page website and a social feed full of holiday graphics.
              </p>
              <p>
                I was in rooms where the work was extraordinary. The craft was exceptional. But outside those rooms, nobody knew any of it existed.
              </p>
            </BodyText>

            <PullQuote quote="They had brilliant products. Nobody knew." delay={100} />

            <BodyText delay={350} visible={visible}>
              <p>
                I watched patients go to a less qualified practitioner because they had a better website. I watched engineering firms lose tenders to competitors who could not match their capability but had better proposal documents and a sharper online presence.
              </p>
              <p>
                Every time, the same pattern. Excellence. Invisibility.
              </p>
            </BodyText>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Chapter 02 — The Turn ───────────────────────────────── */
function ChapterTurn() {
  const { ref, visible } = useReveal(0.08);

  return (
    <section
      ref={ref}
      className="relative px-6 py-20 md:py-28 bg-stone-100 dark:bg-stone-950/60"
    >
      <div className="max-w-5xl mx-auto">

        {/* Full-width chapter marker */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.8s ease 0.05s',
          }}
        >
          <ChapterMarker number="02" label="The Turn" />
        </div>

        {/* Large centred statement */}
        <div
          className="max-w-3xl mb-14"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s',
          }}
        >
          <h2
            className="text-stone-950 dark:text-stone-50 text-balance"
            style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)',
              lineHeight: 1.12,
              fontWeight: 400,
              letterSpacing: '-0.01em',
            }}
          >
            I kept thinking: someone should fix this. Eventually I realised that someone was going to have to be me<span className="text-[#FC6E20]">.</span>
          </h2>
        </div>

        {/* Two-col body text */}
        <div className="grid md:grid-cols-2 gap-10 md:gap-16">
          <BodyText delay={300} visible={visible}>
            <p>
              I didn't come from design or tech. I came from the other side: from being in the room where the sale was lost because the company's digital presence couldn't hold up the reputation the team had built in person.
            </p>
            <p>
              So I taught myself. Not how to make something pretty. How to make something that works: captures leads, builds credibility, positions a business before a single word is said in a meeting.
            </p>
          </BodyText>
          <BodyText delay={420} visible={visible}>
            <p>
              I kept asking why everyone sold these things separately. A web designer here. An SEO agency there. A content person somewhere else. A developer nobody talks to. Each piece optimised for its own lane. None of them talking to each other.
            </p>
            <p>
              That fragmentation is expensive. And it is almost entirely unnecessary.
            </p>
          </BodyText>
        </div>

        {/* Highlight row — key realization */}
        <div
          className="mt-16 p-8 md:p-10 border border-[#FC6E20]/25 rounded-2xl bg-stone-50 dark:bg-stone-900"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s',
          }}
        >
          <div className="flex items-start gap-5">
            <span
              className="flex-shrink-0 text-[#FC6E20] select-none"
              aria-hidden="true"
              style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: '3.5rem',
                lineHeight: 0.9,
              }}
            >
              "
            </span>
            <p
              className="text-stone-800 dark:text-stone-200 text-balance italic"
              style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                lineHeight: 1.45,
                fontWeight: 400,
              }}
            >
              The question was never whether businesses deserved better. The question was whether I was willing to be the one who built it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Chapter 03 — The Build ──────────────────────────────── */
function ChapterBuild() {
  const { ref, visible } = useReveal(0.08);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-stone-950 dark:bg-[#0f0e0d] px-6 py-20 md:py-28"
    >
      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '180px',
        }}
      />

      <div className="relative max-w-5xl mx-auto">

        <div
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.8s ease 0.05s',
          }}
        >
          {/* Chapter marker — light version */}
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-[#FC6E20] select-none"
              style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em' }}
              aria-hidden="true"
            >
              03
            </span>
            <span className="flex-1 h-[1px] bg-[#FC6E20]/30" aria-hidden="true" />
            <span
              className="text-stone-500 uppercase"
              style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '9px', letterSpacing: '0.25em' }}
            >
              The Build
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-12 md:gap-20">

          {/* Text */}
          <div className="md:col-span-7">
            <h2
              className="text-stone-50 mb-10 text-balance"
              style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)',
                lineHeight: 1.15,
                fontWeight: 400,
                letterSpacing: '-0.01em',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(28px)',
                transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s',
              }}
            >
              Kreative Reflow exists because businesses deserve more than a transaction<span className="text-[#FC6E20]">.</span>
            </h2>

            <div
              className="text-stone-400 space-y-5"
              style={{
                fontFamily: 'var(--font-montserrat), sans-serif',
                fontSize: '16px',
                lineHeight: '1.8',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s',
              }}
            >
              <p>
                The studio does what I couldn't find anywhere else: strategy, design, development, SEO, and automation built as one system. Not bolted together. Not sold separately and handed over as disconnected deliverables. Designed from the start to work together.
              </p>
              <p>
                I work with a small number of clients at a time. That is a deliberate choice. It means I can know your business properly, move quickly when something needs attention, and care about the outcome in a way that is not possible at scale.
              </p>
            </div>

            {/* Highlight stat row */}
            <div
              className="mt-12 grid grid-cols-3 gap-6"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(16px)',
                transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s',
              }}
            >
              {[
                { value: '7+', label: 'Years industry experience' },
                { value: 'Small', label: 'Intentional client roster' },
                { value: 'One', label: 'Integrated system, not parts' },
              ].map(({ value, label }) => (
                <div key={label} className="border-t border-stone-700 pt-4">
                  <p
                    className="text-stone-50 mb-1"
                    style={{
                      fontFamily: 'var(--font-playfair), Georgia, serif',
                      fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
                      fontWeight: 400,
                      color: '#FC6E20',
                    }}
                  >
                    {value}
                  </p>
                  <p
                    className="text-stone-500"
                    style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '11px', lineHeight: '1.5', letterSpacing: '0.04em' }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — decorative quote panel */}
          <div
            className="md:col-span-5 flex items-center"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.4s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.4s',
            }}
          >
            <div className="relative w-full border border-[#FC6E20]/20 rounded-2xl p-8 md:p-10">
              {/* Gold accent top bar */}
              <div className="absolute -top-[1px] left-10 right-10 h-[2px] bg-gradient-to-r from-transparent via-[#FC6E20] to-transparent" aria-hidden="true" />

              <p
                className="text-[#FC6E20] select-none mb-4"
                aria-hidden="true"
                style={{
                  fontFamily: 'var(--font-playfair), Georgia, serif',
                  fontSize: '2.5rem',
                  lineHeight: 0.9,
                }}
              >
                "
              </p>
              <p
                className="text-stone-300 italic text-balance"
                style={{
                  fontFamily: 'var(--font-playfair), Georgia, serif',
                  fontSize: 'clamp(1rem, 1.8vw, 1.3rem)',
                  lineHeight: 1.5,
                }}
              >
                I work with a small number of clients at a time. That's a choice, not a limitation. It's the only way to do the work properly.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <span className="h-[1px] w-5 bg-[#FC6E20]/50" aria-hidden="true" />
                <span
                  className="text-stone-500"
                  style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '11px', letterSpacing: '0.15em' }}
                >
                  DISELE · FOUNDER
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Signature Close ─────────────────────────────────────── */
function SignatureClose() {
  const { ref, visible } = useReveal(0.15);

  return (
    <section
      ref={ref}
      className="px-6 py-20 md:py-28 bg-stone-50 dark:bg-stone-900"
    >
      <div className="max-w-5xl mx-auto">

        {/* Full-width gold rule */}
        <div
          className="h-[1px] bg-gradient-to-r from-transparent via-[#FC6E20] to-transparent mb-14"
          aria-hidden="true"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 1s ease 0.1s',
          }}
        />

        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-end">

          {/* Left — closing statement */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s',
            }}
          >
            <p
              className="text-stone-500 uppercase mb-5"
              style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '9px', letterSpacing: '0.25em' }}
            >
              Why I do this
            </p>
            <p
              className="text-stone-800 dark:text-stone-200 text-balance"
              style={{
                fontFamily: 'var(--font-playfair), Georgia, serif',
                fontSize: 'clamp(1.3rem, 2.2vw, 1.7rem)',
                lineHeight: 1.4,
                fontWeight: 400,
              }}
            >
              The businesses I work with are better than their competition. My job is to make sure the world can see that.
            </p>
          </div>

          {/* Right — signature + CTA */}
          <div
            className="flex flex-col items-start md:items-end gap-6"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(24px)',
              transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.35s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.35s',
            }}
          >
            {/* Signature-style name */}
            <div className="text-right">
              <p
                className="text-stone-950 dark:text-stone-50 italic"
                style={{
                  fontFamily: 'var(--font-playfair), Georgia, serif',
                  fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                  lineHeight: 1,
                  fontWeight: 400,
                  letterSpacing: '-0.01em',
                }}
              >
                Disele Mphafe
              </p>
              <p
                className="text-stone-500 uppercase mt-1"
                style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '10px', letterSpacing: '0.2em' }}
              >
                Founder, Kreative Reflow
              </p>

              {/* Gold underline flourish */}
              <div
                className="mt-3 ml-auto h-[2px] bg-[#FC6E20] rounded-full"
                aria-hidden="true"
                style={{ width: '60%' }}
              />
            </div>

            {/* CTA button */}
            <a
              href="/contact"
              className="group inline-flex items-center gap-3 px-7 py-3.5 bg-stone-950 dark:bg-stone-50 text-stone-50 dark:text-stone-950 rounded-full transition-all duration-300 hover:bg-[#FC6E20] dark:hover:bg-[#FC6E20] dark:hover:text-stone-950 hover:gap-4"
              style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em' }}
            >
              Work with me
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
