'use client';

import { useRef, useEffect, useCallback } from 'react';

interface Dot {
  originX: number;
  originY: number;
  x: number;
  y: number;
  radius: number;
  opacity: number;
}

interface InteractiveDotFieldProps {
  className?: string;
  dotColor?: string;
  dotCount?: number;
  disperseRadius?: number;
  disperseStrength?: number;
}

export function InteractiveDotField({
  className = '',
  dotColor = 'rgba(255, 255, 255, 0.15)',
  dotCount = 280,
  disperseRadius = 120,
  disperseStrength = 60,
}: InteractiveDotFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);

  const initDots = useCallback(
    (width: number, height: number) => {
      const dots: Dot[] = [];
      for (let i = 0; i < dotCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        dots.push({
          originX: x,
          originY: y,
          x,
          y,
          radius: Math.random() * 2.5 + 1,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
      dotsRef.current = dots;
    },
    [dotCount]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
      initDots(rect.width, rect.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;

      ctx.clearRect(0, 0, rect.width, rect.height);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const dot of dotsRef.current) {
        // Calculate distance from mouse
        const dx = dot.originX - mx;
        const dy = dot.originY - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < disperseRadius) {
          // Push dots away from the mouse
          const force = (disperseRadius - dist) / disperseRadius;
          const angle = Math.atan2(dy, dx);
          const targetX = dot.originX + Math.cos(angle) * force * disperseStrength;
          const targetY = dot.originY + Math.sin(angle) * force * disperseStrength;
          dot.x += (targetX - dot.x) * 0.15;
          dot.y += (targetY - dot.y) * 0.15;
        } else {
          // Return to origin
          dot.x += (dot.originX - dot.x) * 0.08;
          dot.y += (dot.originY - dot.y) * 0.08;
        }

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = dotColor.replace(
          /[\d.]+\)$/,
          `${dot.opacity})`
        );
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [initDots, dotColor, disperseRadius, disperseStrength]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-auto ${className}`}
    />
  );
}
