'use client';

import { useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';

// ── Vector helpers ──
type V3 = [number, number, number];
const v3sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const v3cross = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const v3norm = (a: V3): V3 => {
  const l = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
const v3dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

// ── Trefoil knot curve ──
function trefoil(t: number): V3 {
  return [
    Math.sin(t) + 2 * Math.sin(2 * t),
    Math.cos(t) - 2 * Math.cos(2 * t),
    -Math.sin(3 * t),
  ];
}

// ── Numerical Frenet frame ──
function frenet(t: number) {
  const h = 0.0005;
  const p0 = trefoil(t - h);
  const p1 = trefoil(t);
  const p2 = trefoil(t + h);

  const T = v3norm(v3sub(p2, p0));

  // Second derivative
  const d2: V3 = [
    p2[0] - 2 * p1[0] + p0[0],
    p2[1] - 2 * p1[1] + p0[1],
    p2[2] - 2 * p1[2] + p0[2],
  ];
  const proj = v3dot(d2, T);
  let N = v3norm([d2[0] - proj * T[0], d2[1] - proj * T[1], d2[2] - proj * T[2]]);

  // Fallback if normal is degenerate
  const nLen = Math.sqrt(N[0] * N[0] + N[1] * N[1] + N[2] * N[2]);
  if (nLen < 0.5) N = [0, 1, 0];

  const B = v3norm(v3cross(T, N));
  return { P: p1, N, B };
}

// ── Generate dots on a tube surface around the trefoil ──
function generateKnotDots(
  cx: number, cy: number,
  scale: number, tubeR: number,
  perspective: number, rotX: number, rotY: number,
  numLines: number, dotsPerLine: number,
) {
  const cosRx = Math.cos(rotX), sinRx = Math.sin(rotX);
  const cosRy = Math.cos(rotY), sinRy = Math.sin(rotY);
  const out: { x: number; y: number; sz: number; op: number }[] = [];

  for (let i = 0; i < numLines; i++) {
    const theta = (i / numLines) * Math.PI * 2;
    const ct = Math.cos(theta), st = Math.sin(theta);

    for (let j = 0; j < dotsPerLine; j++) {
      const t = (j / dotsPerLine) * Math.PI * 2;
      const { P, N, B } = frenet(t);

      // Point on tube surface
      let x = (P[0] + tubeR * (N[0] * ct + B[0] * st)) * scale;
      let y = (P[1] + tubeR * (N[1] * ct + B[1] * st)) * scale;
      let z = (P[2] + tubeR * (N[2] * ct + B[2] * st)) * scale;

      // Rotate Y then X
      const x1 = x * cosRy + z * sinRy;
      const z1 = -x * sinRy + z * cosRy;
      const y1 = y * cosRx - z1 * sinRx;
      const z2 = y * sinRx + z1 * cosRx;

      // Perspective
      const depth = z2 + scale * 4.5;
      const ps = perspective / (perspective + depth);

      out.push({
        x: cx + x1 * ps,
        y: cy + y1 * ps,
        sz: Math.max(0.6, 1.2 + 1.8 * ps),
        op: Math.max(0.05, 0.08 + 0.75 * ps),
      });
    }
  }
  return out;
}

// ── Dot type ──
interface Dot {
  x1: number; y1: number;
  x2: number; y2: number;
  cx: number; cy: number;
  vx: number; vy: number;
  sz: number; op: number;
}

export default function ParticleBrainArt({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isDark = resolvedTheme === 'dark';
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    let dots: Dot[] = [];
    let mx = -1000, my = -1000, hovering = false;
    let scrollP = 0, raf = 0, paused = false, w = 0, h = 0;

    const MR = 160, MF = 10, TEN = 0.025, FRIC = 0.9;
    const NL = 32, DPL = 90;

    const setSize = () => {
      const r = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initDots = () => {
      const cx = w * 0.5, cy = h * 0.48;
      const sc = Math.min(w, h) * 0.22;

      // Shape 1: trefoil knot, slight tilt
      const s1 = generateKnotDots(cx, cy, sc, 0.55, 600, -0.35, 0.25, NL, DPL);
      // Shape 2: same knot, different rotation & thinner tube (morph target)
      const s2 = generateKnotDots(cx, cy, sc * 1.08, 0.35, 600, 0.3, -0.6, NL, DPL);

      dots = [];
      const cnt = Math.min(s1.length, s2.length);
      for (let i = 0; i < cnt; i++) {
        dots.push({
          x1: s1[i].x, y1: s1[i].y,
          x2: s2[i].x, y2: s2[i].y,
          cx: s1[i].x, cy: s1[i].y,
          vx: 0, vy: 0,
          sz: s1[i].sz, op: s1[i].op,
        });
      }
    };

    setSize();
    initDots();

    const rgb = isDark ? '210,210,210' : '20,20,20';

    const tick = () => {
      if (paused) return;
      ctx.clearRect(0, 0, w, h);
      const p = scrollP;

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const tx = d.x1 + (d.x2 - d.x1) * p;
        const ty = d.y1 + (d.y2 - d.y1) * p;

        if (hovering && !isTouch) {
          const dx = d.cx - mx, dy = d.cy - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MR && dist > 0.1) {
            const f = (1 - dist / MR) * MF;
            d.vx += (dx / dist) * f;
            d.vy += (dy / dist) * f;
          }
        }

        d.vx += (tx - d.cx) * TEN;
        d.vy += (ty - d.cy) * TEN;
        d.vx *= FRIC; d.vy *= FRIC;
        d.cx += d.vx; d.cy += d.vy;

        ctx.beginPath();
        ctx.arc(d.cx, d.cy, d.sz, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},${d.op})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    const onMM = (e: MouseEvent) => {
      const r = container.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top; hovering = true;
    };
    const onML = () => { hovering = false; mx = -1000; my = -1000; };
    const onScroll = () => {
      const r = container.getBoundingClientRect();
      scrollP = Math.max(0, Math.min(1, -r.top / Math.max(r.height, 1)));
    };
    const onResize = () => { setSize(); initDots(); };

    const obs = new IntersectionObserver(([e]) => {
      paused = !e.isIntersecting;
      if (!paused) raf = requestAnimationFrame(tick);
    }, { threshold: 0 });
    obs.observe(container);

    canvas.addEventListener('mousemove', onMM);
    canvas.addEventListener('mouseleave', onML);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf); obs.disconnect();
      canvas.removeEventListener('mousemove', onMM);
      canvas.removeEventListener('mouseleave', onML);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [resolvedTheme]);

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />
    </div>
  );
}
