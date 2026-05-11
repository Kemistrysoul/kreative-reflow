'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type AnimType = 'dotmatrix' | 'sinewave' | 'radial' | 'helix';

// ─── Data ─────────────────────────────────────────────────────────────────────
// `copies` is tuned per word so the focused track width ≈ default track width,
// giving the same visual scroll speed with a shared animation duration.

const ITEMS: {
  text: string;
  href: string;
  anim: AnimType;
  color: string;
  copies: number;
}[] = [
  { text: 'Design',     href: '/services/web-design',      anim: 'dotmatrix', color: 'rgba(252,110,32,0.85)',  copies: 16 },
  { text: 'Visibility', href: '/services/seo',              anim: 'radial',    color: 'rgba(255,255,255,0.72)', copies: 12 },
  { text: 'Automation', href: '/services/automation',       anim: 'sinewave',  color: 'rgba(61,122,122,0.9)',   copies: 12 },
  { text: 'Innovation', href: '/services/saas-development', anim: 'helix',     color: 'rgba(252,110,32,0.85)',  copies: 12 },
  { text: 'Strategy',   href: '/services/consulting',       anim: 'radial',    color: 'rgba(245,225,106,0.88)', copies: 12 },
  { text: 'Support',    href: '/services/maintenance',      anim: 'dotmatrix', color: 'rgba(180,180,180,0.75)', copies: 14 },
];

const TEXT_STYLE: React.CSSProperties = {
  fontSize: 'clamp(3rem, 6vw, 5.5rem)',
  fontWeight: 800,
  fontFamily: 'Montserrat, sans-serif',
  letterSpacing: '-0.03em',
  whiteSpace: 'nowrap',
  lineHeight: 1,
  textTransform: 'uppercase',
};

// ─── Canvas background ────────────────────────────────────────────────────────
// Each animation is designed for a wide/short (full-width × 200px) viewport.
// The RAF loop only runs while this canvas is the active item.

function CanvasBg({ anim, color, active }: { anim: AnimType; color: string; active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    let t = 0;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width;
      const H = canvas.height;

      // ── Dot matrix grid ──────────────────────────────────────────────────────
      if (anim === 'dotmatrix') {
        const spacing = 18;
        const cols = Math.ceil(W / spacing);
        const rows = Math.ceil(H / spacing);
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const x = c * spacing + spacing / 2;
            const y = r * spacing + spacing / 2;
            const wave = Math.sin((c + r) * 0.4 + t) * 0.5 + 0.5;
            ctx.beginPath();
            ctx.arc(x, y, 1.2 + wave * 2, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.3 + wave * 0.5;
            ctx.fill();
          }
        }

      // ── Sine wave dots ────────────────────────────────────────────────────────
      } else if (anim === 'sinewave') {
        const numWaves = 4;
        const dotsPerWave = 80;
        for (let w = 0; w < numWaves; w++) {
          const yOffset = H * (0.15 + w * 0.23);
          const amp = 18 + w * 7;
          const freq = 0.016 + w * 0.004;
          for (let i = 0; i < dotsPerWave; i++) {
            const x = (i / (dotsPerWave - 1)) * W;
            const y = yOffset + Math.sin(x * freq + t + w * 1.2) * amp;
            const phase = Math.sin(x * freq + t + w) * 0.5 + 0.5;
            ctx.beginPath();
            ctx.arc(x, y, 1.4 + phase * 1.6, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.22 + phase * 0.58;
            ctx.fill();
          }
        }

      // ── Radial bursts — tiled across full width ────────────────────────────────
      } else if (anim === 'radial') {
        const cellW  = H * 1.6;                          // one burst per ~1.6H of width
        const nCells = Math.ceil(W / cellW) + 1;
        const maxLen = H * 0.52;
        for (let k = 0; k < nCells; k++) {
          const cx = (k + 0.5) * cellW;
          const cy = H / 2;
          const rot = t * (k % 2 === 0 ? 1 : -1);       // alternate spin direction
          for (let i = 0; i < 36; i++) {
            const angle = (i / 36) * Math.PI * 2 + rot;
            const pulse = Math.sin(t * 2 + i * 0.3 + k) * 0.2 + 0.8;
            const len   = maxLen * pulse;
            for (let d = 1; d <= 10; d++) {
              const frac = d / 10;
              const x = cx + Math.cos(angle) * len * frac;
              const y = cy + Math.sin(angle) * len * frac;
              ctx.beginPath();
              ctx.arc(x, y, 1.1 + frac * 1.2, 0, Math.PI * 2);
              ctx.fillStyle = color;
              ctx.globalAlpha = frac * 0.68;
              ctx.fill();
            }
          }
        }

      // ── Horizontal helix — spans full width ───────────────────────────────────
      } else if (anim === 'helix') {
        const pts   = 200;
        const waves = 5;                                  // full helix cycles across width
        for (let i = 0; i < pts; i++) {
          const frac  = i / (pts - 1);
          const theta = frac * Math.PI * 2 * waves + t;
          const x     = frac * W;
          const y     = H / 2 + Math.sin(theta) * (H * 0.38);
          const depth = (Math.sin(theta) + 1) / 2;
          ctx.beginPath();
          ctx.arc(x, y, 1 + depth * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.18 + depth * 0.68;
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      t += anim === 'radial' ? 0.008 : anim === 'helix' ? 0.014 : 0.025;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [anim, color, active]);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
}

// ─── Main component ───────────────────────────────────────────────────────────

export function InteractiveTicker() {
  const [active, setActive] = useState<number | null>(null);
  const defaultItems = [...ITEMS, ...ITEMS];

  return (
    <section
      className="relative overflow-hidden bg-[#0a0a0a]"
      style={{ height: 200 }}
      onMouseLeave={() => setActive(null)}
    >
      {/* Single shared keyframe — both tracks use same duration for equal speed */}
      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ticker-track { animation: ticker-scroll 22s linear infinite; will-change: transform; }
      `}</style>

      {/* ── Canvas backgrounds ── */}
      {ITEMS.map((item, i) => (
        <div
          key={item.text}
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            opacity: active === i ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        >
          <CanvasBg anim={item.anim} color={item.color} active={active === i} />
        </div>
      ))}

      {/* ── Edge fades ── */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-30 w-28"
        style={{ background: 'linear-gradient(to right, #0a0a0a, transparent)' }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-30 w-28"
        style={{ background: 'linear-gradient(to left, #0a0a0a, transparent)' }}
      />

      {/* ── Default track: all words ── */}
      <div
        className="ticker-track absolute inset-y-0 flex items-center z-20"
        style={{
          width: 'max-content',
          gap: '4rem',
          paddingInline: '4rem',
          opacity: active === null ? 1 : 0,
          transition: 'opacity 0.2s',
          pointerEvents: active === null ? 'auto' : 'none',
        }}
      >
        {defaultItems.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className="flex-shrink-0 font-montserrat text-white select-none
                       transition-opacity duration-150 hover:opacity-60 flex items-baseline"
            style={TEXT_STYLE}
            onMouseEnter={() => setActive(idx % ITEMS.length)}
          >
            {item.text}
            <span className={idx % 2 === 0 ? 'text-[#FC6E20]' : 'text-stone-500'}>.</span>
          </Link>
        ))}
      </div>

      {/* ── Focused tracks: one per item ── */}
      {ITEMS.map((item, i) => (
        <div
          key={`focus-${item.text}`}
          className="ticker-track absolute inset-y-0 flex items-center z-20"
          style={{
            width: 'max-content',
            gap: '3.5rem',
            paddingInline: '3.5rem',
            opacity: active === i ? 1 : 0,
            transition: 'opacity 0.2s',
            pointerEvents: active === i ? 'auto' : 'none',
          }}
          onMouseEnter={() => setActive(i)}
        >
          {Array.from({ length: item.copies }, (_, j) => (
            <Link
              key={j}
              href={item.href}
              className="flex-shrink-0 font-montserrat text-white select-none flex items-baseline"
              style={TEXT_STYLE}
            >
              <span style={{ opacity: 0.8, fontSize: '0.55em', marginRight: '0.35em' }} className="font-montserrat font-normal text-orange-500">↗</span>
              {item.text}
            </Link>
          ))}
        </div>
      ))}
    </section>
  );
}
