'use client';

import { Fragment, useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';

const HEADLINE_WORDS = ['One', 'team.', 'The', 'whole', 'picture.'];

const BODY_WORDS =
  "Most businesses piece their digital presence together from a dozen disconnected sources: a freelancer here, a template there, a tool that almost does the job. We keep it under one roof. Every service on this page connects to the others. You don't have to use all of them. But they're better when you do."
    .split(' ');

const TOTAL = HEADLINE_WORDS.length + BODY_WORDS.length;

function Word({
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
  const end = (index + 1) / total;
  const opacity = useTransform(progress, [start, end], [0.06, 1]);

  const isPicture = word.includes('picture');
  
  return (
    <motion.span style={{ opacity }}>
      {isPicture ? (
        <>
          picture<span className="text-[#FC6E20]">.</span>
        </>
      ) : (
        <>{word}{' '}</>
      )}
    </motion.span>
  );
}

export default function ScrollRevealStatement() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // Full reveal completes at 80% of section scroll — last 20% holds fully revealed
  const progress = useTransform(scrollYProgress, [0, 0.8], [0, 1], { clamp: true });

  return (
    <section ref={ref} className="relative" style={{ height: '260vh' }}>
      <div className="sticky top-0 min-h-screen flex items-center content-gutter">
        {/* ml-auto pushes the block to the right; text-right aligns the words within it */}
        <div className="max-w-2xl w-full ml-auto mr-5 lg:mr-[3.25rem] py-24 text-right">

          {/* ── Headline ── */}
          <div className="relative mb-10">
            {/* Ghost layer */}
            <p
              aria-hidden
              className="absolute inset-0 pointer-events-none select-none font-playfair font-bold tracking-tight leading-[1.1] text-4xl md:text-6xl lg:text-7xl text-stone-900/[0.07] dark:text-stone-100/[0.07]"
            >
              One team.<br />The whole picture.
            </p>
            {/* Animated layer */}
            <p className="font-playfair font-bold tracking-tight leading-[1.1] text-4xl md:text-6xl lg:text-7xl text-stone-900 dark:text-stone-100">
              {HEADLINE_WORDS.map((word, i) => (
                <Fragment key={i}>
                  <Word word={word} index={i} total={TOTAL} progress={progress} />
                  {i === 1 && <br />}
                </Fragment>
              ))}
            </p>
          </div>

          {/* ── Body ── */}
          <div className="relative">
            {/* Ghost layer */}
            <p
              aria-hidden
              className="absolute inset-0 pointer-events-none select-none font-montserrat text-lg md:text-xl leading-relaxed text-stone-700/[0.07] dark:text-stone-300/[0.07]"
            >
              {BODY_WORDS.join(' ')}
            </p>
            {/* Animated layer */}
            <p className="font-montserrat text-lg md:text-xl leading-relaxed text-stone-700 dark:text-stone-300">
              {BODY_WORDS.map((word, i) => (
                <Word
                  key={i}
                  word={word}
                  index={HEADLINE_WORDS.length + i}
                  total={TOTAL}
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