'use client';

import { useEffect } from 'react';

export function StartGlowTracker() {
  useEffect(() => {
    const root = document.documentElement;
    let pointerX = window.innerWidth * 0.5;
    let pointerY = window.innerHeight * 0.5;

    const setPointer = (x: number, y: number) => {
      pointerX = x;
      pointerY = y;
      const width = Math.max(window.innerWidth, 1);
      const height = Math.max(window.innerHeight, 1);

      root.style.setProperty('--start-glow-x', `${x.toFixed(2)}px`);
      root.style.setProperty('--start-glow-y', `${y.toFixed(2)}px`);
      root.style.setProperty('--start-glow-xp', (x / width).toFixed(3));
      root.style.setProperty('--start-glow-yp', (y / height).toFixed(3));

      document.querySelectorAll<HTMLElement>('.start-glow-card').forEach((card) => {
        const rect = card.getBoundingClientRect();
        const localX = x - rect.left;
        const localY = y - rect.top;

        card.style.setProperty('--start-card-x', `${localX.toFixed(2)}px`);
        card.style.setProperty('--start-card-y', `${localY.toFixed(2)}px`);
        card.style.setProperty(
          '--start-card-xp',
          (localX / Math.max(rect.width, 1)).toFixed(3),
        );
      });
    };

    const syncCurrentPointer = () => {
      setPointer(pointerX, pointerY);
    };

    window.requestAnimationFrame(syncCurrentPointer);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const syncPointer = (event: PointerEvent | MouseEvent) => {
      setPointer(event.clientX, event.clientY);
    };

    document.addEventListener('pointermove', syncPointer, { passive: true });
    document.addEventListener('mousemove', syncPointer, { passive: true });
    window.addEventListener('resize', syncCurrentPointer, { passive: true });
    window.addEventListener('scroll', syncCurrentPointer, { passive: true });

    return () => {
      document.removeEventListener('pointermove', syncPointer);
      document.removeEventListener('mousemove', syncPointer);
      window.removeEventListener('resize', syncCurrentPointer);
      window.removeEventListener('scroll', syncCurrentPointer);
    };
  }, []);

  return (
    <style>{`
      .start-glow-card {
        --start-glow-base: 28;
        --start-glow-spread: 14;
        --start-glow-hue: calc(var(--start-glow-base) + (var(--start-card-xp, var(--start-glow-xp, 0.5)) * var(--start-glow-spread)));
        --start-glow-size: 220px;
        --start-glow-border-opacity: 0.72;
        --start-glow-fill-opacity: 0.07;
        --start-glow-white-opacity: 0.18;
        position: relative;
        isolation: isolate;
        overflow: hidden;
      }

      .start-glow-card::before,
      .start-glow-card::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
        background-repeat: no-repeat;
        background-position: 0 0;
      }

      .start-glow-card::before {
        z-index: 2;
        padding: 1px;
        opacity: 0.62;
        background-image: radial-gradient(
          var(--start-glow-size) var(--start-glow-size) at
          var(--start-card-x, 50%) var(--start-card-y, 50%),
          hsl(var(--start-glow-hue) 100% 56% / var(--start-glow-border-opacity)),
          transparent 62%
        );
        -webkit-mask:
          linear-gradient(#000 0 0) content-box,
          linear-gradient(#000 0 0);
        -webkit-mask-composite: xor;
        mask:
          linear-gradient(#000 0 0) content-box,
          linear-gradient(#000 0 0);
        mask-composite: exclude;
        transition: opacity 220ms ease;
      }

      .start-glow-card::after {
        z-index: 0;
        opacity: 0.78;
        background-image:
          radial-gradient(
            calc(var(--start-glow-size) * 0.88) calc(var(--start-glow-size) * 0.88) at
            var(--start-card-x, 50%) var(--start-card-y, 50%),
            hsl(var(--start-glow-hue) 100% 58% / var(--start-glow-fill-opacity)),
            transparent 68%
          ),
          radial-gradient(
            calc(var(--start-glow-size) * 0.42) calc(var(--start-glow-size) * 0.42) at
            var(--start-card-x, 50%) var(--start-card-y, 50%),
            hsl(0 0% 100% / var(--start-glow-white-opacity)),
            transparent 70%
          );
        transition: opacity 220ms ease;
      }

      .start-glow-card > * {
        position: relative;
        z-index: 1;
      }

      .start-glow-card:hover::before,
      .start-glow-card:focus-within::before {
        opacity: 1;
      }

      .start-glow-card:hover::after,
      .start-glow-card:focus-within::after {
        opacity: 1;
      }

      .start-glow-card--dark {
        --start-glow-border-opacity: 0.95;
        --start-glow-fill-opacity: 0.12;
        --start-glow-white-opacity: 0.12;
      }

      .start-glow-card--form {
        --start-glow-size: 300px;
        --start-glow-border-opacity: 0.7;
        --start-glow-fill-opacity: 0.055;
        --start-glow-white-opacity: 0.14;
      }

      .start-glow-card:hover,
      .start-glow-card:focus-within {
        --start-glow-border-opacity: 0.96;
        --start-glow-fill-opacity: 0.12;
        --start-glow-white-opacity: 0.22;
      }

      .start-glow-card--dark:hover,
      .start-glow-card--dark:focus-within {
        --start-glow-fill-opacity: 0.18;
        --start-glow-white-opacity: 0.1;
      }

      .start-glow-card--form:hover,
      .start-glow-card--form:focus-within {
        --start-glow-size: 340px;
        --start-glow-fill-opacity: 0.09;
        --start-glow-white-opacity: 0.17;
      }

      @media (prefers-reduced-motion: reduce) {
        .start-glow-card::before,
        .start-glow-card::after {
          transition: none;
        }
      }
    `}</style>
  );
}
