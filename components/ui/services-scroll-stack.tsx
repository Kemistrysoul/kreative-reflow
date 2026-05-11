'use client';

import { useScroll, useTransform, motion, MotionValue } from 'motion/react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import React, { useRef } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export type StackedService = {
  num: string;
  title: string;
  tagline: string;
  description: string;
  note?: string | null;
  bg: string;
  textColor: string;
  slug: string;
};

// ─── Keyframe computation (works for any N cards) ────────────────────────────

function buildCardKeyframes(index: number, total: number) {
  const step = 1 / (total - 1);
  const entryStart = (index - 1) * step;
  const entryEnd = index * step;

  const translateYIn: [number, number] | null =
    index === 0 ? null : [Math.max(0, entryStart), entryEnd];

  const scaleInputs: number[] = [];
  const scaleOutputs: number[] = [];
  const rotateOutputs: number[] = [];

  // Add the entry-start keyframe for cards 1+
  if (index > 0) {
    scaleInputs.push(Math.max(0, entryStart));
    scaleOutputs.push(0.95);
    rotateOutputs.push(2);
  }

  // One keyframe per transition from this card's arrival onward
  for (let j = index; j < total; j++) {
    const point = j === 0 ? 0 : j * step;
    scaleInputs.push(point);
    const pushbacks = j - index;
    scaleOutputs.push(1 - pushbacks * 0.04);
    rotateOutputs.push(-pushbacks * 1.5);
  }

  return { translateYIn, scaleInputs, scaleOutputs, rotateOutputs };
}

// ─── Individual stacked card ──────────────────────────────────────────────────

type StackedCardProps = {
  service: StackedService;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
};

function StackedCard({ service, index, total, scrollYProgress }: StackedCardProps) {
  const kf = buildCardKeyframes(index, total);

  const translateY = useTransform(
    scrollYProgress,
    kf.translateYIn ?? [0, 1],
    kf.translateYIn ? ['100%', '0%'] : ['0%', '0%'],
  );

  const scale = useTransform(scrollYProgress, kf.scaleInputs, kf.scaleOutputs);
  const rotate = useTransform(scrollYProgress, kf.scaleInputs, kf.rotateOutputs);

  const isDark =
    service.textColor === 'white' ||
    service.textColor === '#ffffff' ||
    service.textColor === '#FFFFFF';

  const dividerColor = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.15)';
  const muteOpacity = isDark ? 0.55 : 0.5;

  return (
    <motion.div
      className="sticky top-0 w-full"
      style={{
        height: '100vh',
        zIndex: index + 1,
        translateY,
        scale,
        rotate,
        transformOrigin: 'top center',
      }}
    >
      {/* Inset colored card — page background shows above it */}
      <div
        className="absolute overflow-hidden"
        style={{
          top: '14vh',
          bottom: '3vh',
          left: 'var(--left-gutter)',
          right: 'var(--right-gutter)',
          borderRadius: 20,
          backgroundColor: service.bg,
        }}
      >
        <div
          className="relative h-full flex flex-col"
          style={{
            padding: 'clamp(1.5rem, 4vw, 3.5rem)',
            color: service.textColor,
          }}
        >
          {/* ── Top row: number + arrow ── */}
          <div className="flex items-start justify-between mb-3">
            <span
              className="font-montserrat font-bold"
              style={{ fontSize: 'clamp(1.25rem, 2.5vw, 2rem)' }}
            >
              {service.num}
            </span>
            <Link
              href={`/services/${service.slug}`}
              className="transition-opacity hover:opacity-100"
              style={{ opacity: muteOpacity, color: service.textColor }}
              aria-label={`View ${service.title}`}
            >
              <ArrowRight size={28} strokeWidth={1.5} />
            </Link>
          </div>

          {/* ── Tagline ── */}
          <p
            className="font-montserrat"
            style={{
              fontSize: 'clamp(0.75rem, 1.1vw, 0.9rem)',
              opacity: muteOpacity,
              letterSpacing: '0.02em',
            }}
          >
            [ {service.tagline} ]
          </p>

          {/* ── Title ── */}
          <h2
            className="font-playfair font-bold leading-[1.05] mt-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: service.textColor }}
          >
            {service.title}
          </h2>

          {/* ── Spacer ── */}
          <div className="flex-1" />

          {/* ── Divider ── */}
          <div
            className="mb-5"
            style={{
              width: 'min(55%, 480px)',
              height: 1,
              backgroundColor: dividerColor,
            }}
          />

          {/* ── Bottom content: description, note, CTA ── */}
          <div style={{ maxWidth: 'min(55%, 520px)' }}>
            <p
              className="font-montserrat leading-relaxed"
              style={{
                fontSize: 'clamp(0.825rem, 1.15vw, 0.975rem)',
                opacity: 0.82,
              }}
            >
              {service.description}
            </p>

            {service.note && (
              <p
                className="font-montserrat mt-3"
                style={{
                  fontSize: 'clamp(0.75rem, 1vw, 0.85rem)',
                  opacity: muteOpacity,
                }}
              >
                [ {service.note} ]
              </p>
            )}

            <Link
              href={`/services/${service.slug}`}
              className="font-montserrat mt-4 inline-block transition-opacity hover:opacity-100"
              style={{
                fontSize: 'clamp(0.75rem, 1vw, 0.85rem)',
                opacity: muteOpacity,
                color: service.textColor,
              }}
            >
              Learn more →
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function ServicesScrollStack({ services }: { services: StackedService[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const total = services.length;

  return (
    <div
      ref={containerRef}
      style={{ height: `${total * 100}vh` }}
      className="relative"
    >
      {services.map((service, i) => (
        <StackedCard
          key={service.slug}
          service={service}
          index={i}
          total={total}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  );
}
