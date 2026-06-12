'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(hover: none), (pointer: coarse)').matches;
  });
  const [isInteractive, setIsInteractive] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const dotX = useSpring(cursorX, { damping: 32, stiffness: 520, mass: 0.35 });
  const dotY = useSpring(cursorY, { damping: 32, stiffness: 520, mass: 0.35 });
  const circleX = useSpring(cursorX, { damping: 38, stiffness: 240, mass: 0.7 });
  const circleY = useSpring(cursorY, { damping: 38, stiffness: 240, mass: 0.7 });
  const circleScale = useSpring(1, { damping: 30, stiffness: 500 });
  const dotScale = useSpring(1, { damping: 30, stiffness: 500 });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: none), (pointer: coarse)');

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handlePointerChange = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    const handleInteractiveState = (target: EventTarget | null) => {
      if (!(target instanceof Element)) {
        setIsInteractive(false);
        return;
      }

      const interactiveTarget = target.closest(
        'a, button, [role="button"], input, textarea, select, summary, label'
      );

      setIsInteractive(Boolean(interactiveTarget));
    };

    const handleMouseOver = (e: MouseEvent) => handleInteractiveState(e.target);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver);
    mediaQuery.addEventListener('change', handlePointerChange);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      mediaQuery.removeEventListener('change', handlePointerChange);
    };
  }, [cursorX, cursorY]);

  useEffect(() => {
    circleScale.set(isInteractive ? 1.4 : 1);
    dotScale.set(isInteractive ? 0.7 : 1);
  }, [circleScale, dotScale, isInteractive]);

  if (isTouch || !isVisible) return null;

  return (
    <>
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          translateX: dotX,
          translateY: dotY,
          x: '-50%',
          y: '-50%',
          scale: dotScale,
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '999px',
            backgroundColor: '#FBFBFB',
            border: '1px solid #151419',
            boxShadow: '0 0 0 1px rgba(252, 110, 32, 0.35)',
          }}
        />
      </motion.div>

      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          translateX: circleX,
          translateY: circleY,
          x: '-50%',
          y: '-50%',
          scale: circleScale,
          pointerEvents: 'none',
          zIndex: 9998,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '999px',
            border: isInteractive
              ? '2px solid rgba(21, 20, 25, 0.9)'
              : '2px solid rgba(251, 251, 251, 0.95)',
            backgroundColor: isInteractive ? 'rgba(252, 110, 32, 0.14)' : 'rgba(21, 20, 25, 0.08)',
            boxShadow: '0 0 0 1px rgba(252, 110, 32, 0.35), 0 4px 18px rgba(21, 20, 25, 0.18)',
          }}
        />
      </motion.div>
    </>
  );
}
