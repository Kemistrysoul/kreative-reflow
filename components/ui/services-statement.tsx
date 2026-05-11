'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';

const BODY_COPY =
  'One person handles your website, your SEO, your automations, and your support. No vendor juggling, no briefing four different specialists, no one passing the buck when something breaks.';
const BODY_WORDS = BODY_COPY.split(' ');

function RevealWord({
  word,
  index,
  total,
  progress,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(progress, [start, end], [0, 1]);

  return (
    <motion.span style={{ opacity, display: 'inline' }}>
      {word}{' '}
    </motion.span>
  );
}

export function ServicesStatement() {
  const copyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: copyRef,
    offset: ['start 90%', 'end 35%'],
  });
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1], { clamp: true });

  return (
    <section className="py-16 md:py-24 lg:py-28 content-gutter overflow-hidden relative">
      {/* Vertical lines - visible on light background */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none z-0 hidden md:block" style={{ height: '100%' }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 border-l"
            style={{
              left: `${(i / 7) * 100}%`,
              borderColor: "rgba(0, 0, 0, 0.07)",
            }}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-y-14 md:min-h-[770px] md:w-full md:grid-cols-12 md:gap-x-8 md:gap-y-0">
        <div className="md:col-start-7 md:col-span-6 md:self-start lg:col-start-8 lg:col-span-5 mr-5 lg:mr-[3.25rem]">
          <h2 className="font-montserrat text-4xl font-black uppercase leading-[0.9] tracking-tighter text-stone-950 md:text-right md:text-5xl lg:text-[70px]">
            ONE EXPERT.<br />END-TO-END<span className="text-[#FC6E20]">.</span>
          </h2>

          <p className="mt-4 max-w-xs font-montserrat text-base leading-relaxed text-stone-500 md:ml-auto md:text-right">
            Direct access. No account managers.
          </p>
        </div>

        <div className="md:col-start-1 md:col-span-6 md:mt-32 md:self-start ml-0 lg:ml-0">
          <div className="mb-6 h-12 w-12 text-[#FC6E20]" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
              <path
                d="M9 10.5C9 9.67157 9.67157 9 10.5 9H23C23.8284 9 24.5 9.67157 24.5 10.5V23C24.5 23.3978 24.342 23.7794 24.0607 24.0607L10.5 37.6213C9.55546 38.5659 8 37.897 8 36.5607V10.5H9Z"
                fill="currentColor"
              />
              <path
                d="M39 37.5C39 38.3284 38.3284 39 37.5 39H25C24.1716 39 23.5 38.3284 23.5 37.5V25C23.5 24.6022 23.658 24.2206 23.9393 23.9393L37.5 10.3787C38.4445 9.43414 40 10.103 40 11.4393V37.5H39Z"
                fill="currentColor"
              />
            </svg>
          </div>

          <div ref={copyRef} className="max-w-[22rem] sm:max-w-[26rem] md:max-w-[30rem]">
            <p className="font-montserrat text-xl leading-snug text-[#FC6E20] md:text-2xl">
              {BODY_WORDS.map((word, index) => (
                <RevealWord
                  key={`${word}-${index}`}
                  word={word}
                  index={index}
                  total={BODY_WORDS.length}
                  progress={progress}
                />
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
