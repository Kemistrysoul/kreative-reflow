'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

type ParallaxSignalCardProps = {
  signalLabel: string;
  signalValue: string;
  signalBody: string;
  signalNote?: string;
};

export function ParallaxSignalCard({
  signalLabel,
  signalValue,
  signalBody,
  signalNote,
}: ParallaxSignalCardProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 82%', 'end 18%'],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [0, -82]);

  return (
    <motion.aside
      ref={ref}
      style={{ y }}
      className="relative w-full min-w-0 overflow-hidden rounded-[1.35rem] border border-[#151419]/12 bg-[#FC6E20] p-6 text-[#151419] shadow-[0_24px_80px_rgba(21,20,25,0.24)] md:p-8 lg:mb-4 lg:max-w-[34rem] lg:justify-self-end xl:p-9"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full border border-[#151419]/14"
        aria-hidden="true"
      />
      <p className="font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#151419]/72">
        {signalLabel}
      </p>
      <p className="mt-8 max-w-full font-playfair text-[clamp(3.15rem,4.1vw,5.35rem)] font-bold leading-[0.92] tracking-tight [text-wrap:balance]">
        {signalValue}
      </p>
      <p className="mt-5 max-w-sm font-montserrat text-sm leading-7 text-[#151419]/72">
        {signalBody}
      </p>
      {signalNote ? (
        <p className="mt-6 border-t border-[#151419]/18 pt-5 font-mono text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#151419]/72">
          {signalNote}
        </p>
      ) : null}
    </motion.aside>
  );
}
