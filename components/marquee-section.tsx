'use client';

import { useAnimate, useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';

const words: { text: string; accent: boolean }[] = [
  { text: "Disrupt.", accent: true },
  { text: "Break Rules.", accent: false },
  { text: "Create.", accent: true },
  { text: "Ship Bold.", accent: false },
  { text: "Dominate.", accent: true },
  { text: "Go Live.", accent: false },
  { text: "Reflow.", accent: true },
  { text: "Own It.", accent: false },
];

export default function MarqueeSection() {
  const [scope, animate] = useAnimate();
  const animationRef = useRef<any>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    animationRef.current = animate(
      scope.current,
      { x: ["0%", "-50%"] },
      {
        duration: 140,
        repeat: Infinity,
        ease: "linear"
      }
    );

    return () => animationRef.current?.stop();
  }, [animate, scope, prefersReducedMotion]);

  return (
    <section
      className="relative z-[30] w-full py-10 bg-[#F0EFED] dark:bg-[#1a1a1a] overflow-hidden border-y border-liquid-lava/20"
    >
      {/* Gradient Mask for smooth edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#F0EFED] dark:from-[#1a1a1a] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#F0EFED] dark:from-[#1a1a1a] to-transparent z-10 pointer-events-none" />

      <div className="flex -translate-y-2">
        <div
          ref={scope}
          className="flex whitespace-nowrap cursor-default items-baseline gap-6 md:gap-10"
        >
          {[...Array(6)].map((_, setIndex) => (
            <div key={setIndex} className="flex items-baseline gap-6 md:gap-10">
              {words.map((word, i) => {
                if (word.accent) {
                  // Accent words: dark text, orange period
                  const base = word.text.slice(0, -1);
                  return (
                    <span
                      key={`${setIndex}-${i}`}
                      className="text-5xl md:text-7xl lg:text-8xl font-bold font-display uppercase tracking-tighter text-dark-void dark:text-snow"
                    >
                      {base}<span className="text-liquid-lava">.</span>
                    </span>
                  );
                } else {
                  // Muted words: muted text, muted period
                  return (
                    <span
                      key={`${setIndex}-${i}`}
                      className="text-5xl md:text-7xl lg:text-8xl font-bold font-display uppercase tracking-tighter text-dark-void/30 dark:text-snow/25"
                    >
                      {word.text}
                    </span>
                  );
                }
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
