'use client';

import type React from 'react';
import { useState, useRef, useEffect, useSyncExternalStore } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calculator,
  ChartNoAxesCombined,
  Gauge,
  Globe2,
  ListChecks,
  Monitor,
  RefreshCw,
  SearchCheck,
  Settings,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useScroll, useSpring, useTransform, useReducedMotion, type MotionValue } from 'motion/react';
import { AnimatedLinkText, AnimatedTextLink } from '@/components/AnimatedTextLink';
import { ExpandingCtaBackground } from '@/components/ExpandingCtaBackground';

export function IntroSection() {
  const ref = useRef<HTMLDivElement>(null);

  // Original open scroll — untouched
  const { scrollYProgress: openProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "start 15%"]
  });
  const bgOpen = useTransform(openProgress, [0, 0.5], [0, 1]);

  // Close scroll — triggers as the cards scroll out of view
  const { scrollYProgress: closeProgress } = useScroll({
    target: ref,
    offset: ["end 50%", "end 10%"]
  });
  const bgClose = useTransform(closeProgress, [0, 1], [1, 0]);

  // Combine: take the minimum so open wins until close takes over
  const bgScaleX = useTransform([bgOpen, bgClose], ([open, close]: number[]) => Math.min(open, close));

  // Services state
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const services = [
    {
      num: '01', total: '04',
      title: 'Web Design & Development',
      href: '/services/web-design',
      subhead: 'Built for your business. Not borrowed from a template.',
      desc: 'Your website should work as hard as you do. We build custom sites that bring in leads, build trust, and run 24/7. Designed for your audience, built for speed, and made to grow with you.',
      bg: '#151419',
      textColor: 'white',
      canvasAnimation: 'dotmatrix' as const,
    },
    {
      num: '02', total: '04',
      title: 'Local & AI SEO',
      href: '/services/seo',
      subhead: 'Get found by the people who are already looking for you.',
      desc: 'A great website means nothing if nobody sees it. We help your business show up on Google, maps, and AI search with clearer structure, stronger local signals, and content search systems can understand.',
      bg: '#3D7A7A',
      textColor: 'white',
      canvasAnimation: 'sinewave' as const,
    },
    {
      num: '03', total: '04',
      title: 'SaaS & Custom Web Applications',
      href: '/services/saas-development',
      subhead: 'Your workflow, engineered around the way the business runs.',
      desc: 'Need a portal, booking system, internal dashboard, or SaaS product? We build web applications around your real operating model, not what off-the-shelf tools can almost do.',
      bg: '#FC6E20',
      textColor: '#151419',
      canvasAnimation: 'radial' as const,
    },
    {
      num: '04', total: '04',
      title: 'AI & Business Automation',
      href: '/services/automation',
      subhead: 'Stop doing manually what a system can do for you.',
      desc: 'Follow-ups, data entry, scheduling, reporting. If your team repeats it daily, we automate it. We build systems that handle the busywork so your people can focus on what actually needs a human.',
      bg: '#F0EFED',
      textColor: '#151419',
      canvasAnimation: 'helix' as const,
    },
  ];

  return (
    <section ref={ref} className="relative w-full overflow-hidden bg-[#070A0F] py-24 md:py-28">
      <motion.div
        className="absolute inset-0 origin-left bg-[#070A0F] z-0"
        style={{ scaleX: bgScaleX, borderRadius: '0 0 0 0' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_74%_20%,rgba(95,159,170,0.14),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent_42%)]"
      />
      <div className="absolute inset-0 pointer-events-none z-0">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 border-l"
            style={{
              left: `${(i / 7) * 100}%`,
              borderColor: "rgba(255, 255, 255, 0.07)",
            }}
          />
        ))}
      </div>
      <div className="w-full content-gutter relative z-10 text-snow">
        <div className="mx-0 max-w-[1770px] px-0">
          <div className="mb-32 grid gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(560px,1.08fr)] lg:items-start lg:gap-16 xl:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -42 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.82, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-100px" }}
              className="lg:sticky lg:top-28 lg:pt-8"
            >
              <span className="mb-6 block font-montserrat text-xs font-bold uppercase tracking-[0.3em] text-[#FC6E20]">
                [ Digital infrastructure ]
              </span>
              <h2 className="max-w-[790px] font-playfair text-[clamp(3.1rem,4.7vw,5.45rem)] font-bold leading-[0.92] tracking-tight text-[#F7F4EE] [text-wrap:balance]">
                We build websites, systems, and automation that give your business an{' '}
                <span className="text-[#FC6E20]">unfair advantage</span><span className="text-[#FC6E20]">.</span>
              </h2>
              <p className="mt-8 max-w-2xl font-montserrat text-base leading-8 text-[#FBFBFB]/68 md:text-lg">
                Custom-built digital infrastructure for businesses ready to grow beyond templates, manual processes, and agencies that disappear after launch.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/services"
                  className="group/link inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#FC6E20] px-6 font-montserrat text-sm font-bold uppercase tracking-[0.08em] text-[#151419] transition-colors duration-300 hover:bg-[#FAE18F]"
                >
                  <AnimatedLinkText hiddenClassName="text-[#151419]">View services</AnimatedLinkText>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                </Link>
                <Link
                  href="/work"
                  className="group/link inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-[#FBFBFB]/16 px-6 font-montserrat text-sm font-bold uppercase tracking-[0.08em] text-[#FBFBFB] transition-colors duration-300 hover:border-[#FC6E20] hover:text-[#FC6E20]"
                >
                  <AnimatedLinkText>See the proof</AnimatedLinkText>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                </Link>
              </div>

              <div className="mt-16 hidden max-w-3xl lg:block">
                <div className="grid max-w-2xl grid-cols-[auto_1fr] items-center gap-5 font-montserrat text-sm leading-6 text-white/48">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/14 bg-white/[0.035] text-white/80">
                    <Globe2 className="h-6 w-6" strokeWidth={1.7} />
                  </span>
                  <span>
                    Based in Johannesburg and working with clients across South Africa and internationally.
                  </span>
                </div>
              </div>
            </motion.div>

            <div className="grid gap-5 lg:pt-8 xl:pt-10">
              <motion.article
                initial={{ opacity: 0, x: 42 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.78, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative overflow-hidden rounded-[1.65rem] bg-[#F4F1EA] p-7 text-[#151419] shadow-[0_34px_90px_rgba(0,0,0,0.24)] md:p-8 lg:p-9"
              >
                <div
                  aria-hidden="true"
                  className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full border border-[#151419]/10 opacity-50"
                />
                <div
                  aria-hidden="true"
                  className="absolute -bottom-36 -right-28 h-[28rem] w-[28rem] rounded-full bg-[repeating-radial-gradient(circle_at_center,transparent_0,transparent_10px,rgba(21,20,25,0.08)_11px,transparent_12px)] opacity-55"
                />
                <div className="relative grid gap-8 md:grid-cols-[0.78fr_1.08fr] md:items-center">
                  <div>
                    <p className="font-montserrat text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#FC6E20]">
                      The signal
                    </p>
                    <span className="mt-3 block h-px w-8 bg-[#FC6E20]" aria-hidden="true" />
                    <p className="mt-6 max-w-[9ch] font-playfair text-[clamp(2.45rem,3.05vw,3.65rem)] font-bold leading-[0.92] tracking-tight">
                      Built properly, from the ground up<span className="text-[#FC6E20]">.</span>
                    </p>
                  </div>
                  <div className="space-y-6 font-montserrat text-sm leading-7 text-[#45454A] md:text-base">
                    <p className="max-w-md">
                      Whether you need a high-performance website, a custom dashboard, a SaaS product, or an automated system that runs while you sleep, we build the foundation around the way your business actually works.
                    </p>
                    <p className="max-w-md border-l border-[#FC6E20] pl-5 font-semibold text-[#151419]">
                      No page builders. No shortcuts.<br />
                      No unnecessary complexity.
                    </p>
                  </div>
                </div>
              </motion.article>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    num: '01',
                    title: 'Website clarity',
                    body: 'Public pages that explain the offer, earn trust, and move people toward the right enquiry.',
                    icon: Monitor,
                    className: 'bg-[#0F7189] text-[#F8FBFA]',
                    line: 'border-white/28',
                  },
                  {
                    num: '02',
                    title: 'Systems underneath',
                    body: 'Dashboards, portals, forms, and workflows shaped around the real operating model.',
                    icon: Settings,
                    className: 'bg-[#FC6E20] text-[#FFF8EF]',
                    line: 'border-white/34',
                  },
                  {
                    num: '03',
                    title: 'Follow-up logic',
                    body: 'Automation and lead response paths that keep momentum after the first enquiry.',
                    icon: Zap,
                    className: 'bg-[#3E5361] text-[#F8FBFA]',
                    line: 'border-white/24',
                  },
                ].map((card, index) => {
                  const Icon = card.icon;

                  return (
                    <motion.article
                      key={card.title}
                      initial={{ opacity: 0, y: 34 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.72, delay: 0.3 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      viewport={{ once: true, margin: "-100px" }}
                      className={`group flex min-h-[18.5rem] flex-col justify-between overflow-hidden rounded-[1.35rem] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.2)] transition-transform duration-300 hover:-translate-y-2 lg:min-h-[21rem] xl:min-h-[22.5rem] ${card.className}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <span className="font-mono text-xs uppercase tracking-[0.16em] opacity-80">{card.num}</span>
                        <Icon className="h-5 w-5 opacity-80 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.7} />
                      </div>
                      <div>
                        <h3 className="max-w-[10.5ch] break-words font-playfair text-[clamp(2rem,2.1vw,3rem)] font-bold leading-[0.9] tracking-tight">
                          {card.title}
                        </h3>
                        <div className={`my-6 border-t ${card.line}`} />
                        <p className="font-montserrat text-sm leading-7 opacity-78">
                          {card.body}
                        </p>
                      </div>
                      <Link href={index === 0 ? '/services/web-design' : index === 1 ? '/services/saas-development' : '/services/automation'} className="mt-7 inline-flex w-fit items-center gap-3 font-montserrat text-sm font-bold">
                        <AnimatedLinkText>Explore</AnimatedLinkText>
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </motion.article>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.72, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: "-100px" }}
                className="grid gap-4 rounded-[1.15rem] border border-white/12 bg-white/[0.035] p-5 font-montserrat text-sm leading-7 text-[#FBFBFB]/66 shadow-[0_24px_70px_rgba(0,0,0,0.18)] sm:grid-cols-[auto_1fr] sm:items-center md:p-6"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] text-[#FBFBFB]">
                  <ChartNoAxesCombined className="h-6 w-6" strokeWidth={1.7} />
                </span>
                <span>
                  We combine technical depth with a clear understanding of what actually moves the needle for small and growing businesses.
                </span>
              </motion.div>
            </div>
          </div>
        </div>
        <div className="mt-72 mb-12">
          <span className="font-montserrat text-xs tracking-[0.2em] uppercase mb-4 block" style={{ fontWeight: 400, color: '#FC6E20', fontSize: '12px', lineHeight: '16px' }}>
            [ WHAT WE DO ]
          </span>
          <h2 className="max-w-3xl font-playfair text-[clamp(2.8rem,6vw,5.9rem)] font-bold leading-[0.94] tracking-tight text-white mb-6">
            One studio<br />Every layer of your digital business<span className="text-[#FC6E20]">.</span>
          </h2>
          <p className="text-base md:text-[1.25rem] text-white/60 max-w-2xl font-montserrat leading-relaxed">
            Most agencies sell you a website and disappear. We build the website, the systems behind it, and the strategy that makes all of it work.
          </p>
        </div>
        <div
          className="services-cards-wrapper mt-14 md:mt-16"
        >
          <div
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {services.map((s, i) => (
              <ServiceCard
                key={i} {...s} index={i}
                isHovered={hoveredIndex === i}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


function useDotMatrixCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>, dotColor: string) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    let t = 0;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const spacing = 18;
      const cols = Math.floor(canvas.width / spacing);
      const rows = Math.floor(canvas.height / spacing);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * spacing + spacing / 2;
          const y = r * spacing + spacing / 2;
          const wave = Math.sin((c + r) * 0.4 + t) * 0.5 + 0.5;
          const radius = 1.2 + wave * 2;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = dotColor;
          ctx.globalAlpha = 0.3 + wave * 0.5;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      t += 0.012;
      if (!prefersReducedMotion) {
        raf = requestAnimationFrame(draw);
      }
    };
    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [canvasRef, dotColor, prefersReducedMotion]);
}

function useSineWaveCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>, dotColor: string) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    let t = 0;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const numWaves = 4;
      const dotsPerWave = 60;
      for (let w = 0; w < numWaves; w++) {
        const yOffset = canvas.height * (0.2 + w * 0.2);
        const amp = 20 + w * 8;
        const freq = 0.018 + w * 0.004;
        for (let i = 0; i < dotsPerWave; i++) {
          const x = (i / dotsPerWave) * canvas.width;
          const y = yOffset + Math.sin(x * freq + t + w * 1.2) * amp;
          const phase = Math.sin(x * freq + t + w) * 0.5 + 0.5;
          ctx.beginPath();
          ctx.arc(x, y, 1.5 + phase * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = dotColor;
          ctx.globalAlpha = 0.25 + phase * 0.55;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      t += 0.01;
      if (!prefersReducedMotion) {
        raf = requestAnimationFrame(draw);
      }
    };
    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [canvasRef, dotColor, prefersReducedMotion]);
}

function useRadialBurstCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>, lineColor: string) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    let t = 0;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const numLines = 36;
      const maxLen = Math.min(canvas.width, canvas.height) * 0.45;
      for (let i = 0; i < numLines; i++) {
        const angle = (i / numLines) * Math.PI * 2 + t;
        const pulse = Math.sin(t * 2 + i * 0.3) * 0.2 + 0.8;
        const len = maxLen * pulse;
        const dotCount = 12;
        for (let d = 1; d <= dotCount; d++) {
          const frac = d / dotCount;
          const x = cx + Math.cos(angle) * len * frac;
          const y = cy + Math.sin(angle) * len * frac;
          ctx.beginPath();
          ctx.arc(x, y, 1.2 + frac * 1.2, 0, Math.PI * 2);
          ctx.fillStyle = lineColor;
          ctx.globalAlpha = frac * 0.7;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      t += 0.004;
      if (!prefersReducedMotion) {
        raf = requestAnimationFrame(draw);
      }
    };
    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [canvasRef, lineColor, prefersReducedMotion]);
}

function useHelixCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>, dotColor: string) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    let t = 0;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const totalPoints = 120;
      const radiusX = canvas.width * 0.22;
      const radiusY = canvas.height * 0.38;
      for (let i = 0; i < totalPoints; i++) {
        const frac = i / totalPoints;
        const theta = frac * Math.PI * 4 + t;
        const x = cx + Math.cos(theta) * radiusX;
        const y = cy - radiusY + frac * radiusY * 2;
        const depth = (Math.sin(theta) + 1) / 2;
        const r = 1 + depth * 2.5;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = dotColor;
        ctx.globalAlpha = 0.2 + depth * 0.65;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      t += 0.006;
      if (!prefersReducedMotion) {
        raf = requestAnimationFrame(draw);
      }
    };
    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [canvasRef, dotColor, prefersReducedMotion]);
}

type ServiceCardProps = {
  num: string;
  title: string;
  href: string;
  subhead: string;
  desc: string;
  bg: string;
  textColor: string;
  canvasAnimation: 'dotmatrix' | 'sinewave' | 'radial' | 'helix';
  index: number;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

function ServiceCard({ num, title, href, subhead, desc, bg, textColor, canvasAnimation, index, isHovered, onMouseEnter, onMouseLeave }: ServiceCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hoverTextColor = textColor === 'white' ? '#FBFBFB' : '#151419';
  const dotColor = isHovered
    ? textColor === 'white'
      ? 'rgba(251,251,251,0.78)'
      : 'rgba(21,20,25,0.7)'
    : 'rgba(251,251,251,0.48)';
  const cardStyle = {
    '--service-hover-bg': bg,
    '--service-hover-text': hoverTextColor,
  } as React.CSSProperties;

  useDotMatrixCanvas(canvasAnimation === 'dotmatrix' ? canvasRef : { current: null }, dotColor);
  useSineWaveCanvas(canvasAnimation === 'sinewave' ? canvasRef : { current: null }, dotColor);
  useRadialBurstCanvas(canvasAnimation === 'radial' ? canvasRef : { current: null }, dotColor);
  useHelixCanvas(canvasAnimation === 'helix' ? canvasRef : { current: null }, dotColor);

  return (
    <motion.div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onMouseEnter}
      onBlur={onMouseLeave}
      className="services-card h-full focus-within:outline-none"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.68, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      style={cardStyle}
    >
      <Link
        href={href}
        className="group flex h-full min-h-[22rem] flex-col justify-between overflow-hidden rounded-[1.35rem] border border-white/12 bg-transparent p-6 text-[#FBFBFB] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[var(--service-hover-bg)] hover:bg-[var(--service-hover-bg)] hover:text-[var(--service-hover-text)] hover:shadow-[0_22px_54px_rgba(0,0,0,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FC6E20] md:min-h-[24rem]"
      >
        <div>
          <div className="flex items-start justify-between gap-5">
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-current/60">
              {num}
            </span>
            <span
              aria-hidden="true"
              className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[1.05rem] border border-current/12 bg-white/[0.035] transition-colors duration-300 group-hover:bg-[#151419]/[0.045] md:h-[4.5rem] md:w-[4.5rem]"
            >
              <canvas
                ref={canvasRef}
                className="absolute inset-1 h-[calc(100%-0.5rem)] w-[calc(100%-0.5rem)] opacity-80 transition-opacity duration-300 group-hover:opacity-100"
              />
            </span>
          </div>
          <h3
            className="mt-8 max-w-[12ch] font-playfair text-[clamp(2rem,2.25vw,3rem)] font-bold leading-none tracking-tight"
          >
            {title}
          </h3>
          <p className="mt-5 font-montserrat text-sm font-semibold leading-6 text-current/72">
            {subhead}
          </p>
          <p className="mt-5 font-montserrat text-sm leading-7 text-current/62">
            {desc}
          </p>
        </div>
        <div className="mt-10 flex items-center justify-between border-t border-current/10 pt-4">
          <span className="font-montserrat text-[0.7rem] font-bold uppercase tracking-[0.18em]">
            <AnimatedLinkText>View service</AnimatedLinkText>
          </span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.div>
  );
}

// ──[ How It Works ]Canvas hooks for How It Works cards ────────────────────────────────────


function useOrbitCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>, color: string) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    let t = 0;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radii = [40, 70, 100, 130];
      const speeds = [0.018, -0.012, 0.009, -0.006];
      const dotCounts = [3, 5, 7, 9];
      radii.forEach((r, ri) => {
        // orbit ring
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.08;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        // orbiting dots
        for (let d = 0; d < dotCounts[ri]; d++) {
          const angle = (d / dotCounts[ri]) * Math.PI * 2 + t * speeds[ri] * 60;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          const pulse = Math.sin(t * 2 + d + ri) * 0.5 + 0.5;
          ctx.beginPath();
          ctx.arc(x, y, 1.2 + pulse * 1.8, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.3 + pulse * 0.55;
          ctx.fill();
        }
      });
      // centre glow
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28);
      grad.addColorStop(0, color.replace(')', ', 0.35)').replace('rgb', 'rgba'));
      grad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(cx, cy, 28, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.globalAlpha = 1;
      ctx.fill();
      ctx.globalAlpha = 1;
      t += 0.008;
      if (!prefersReducedMotion) {
        raf = requestAnimationFrame(draw);
      }
    };
    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [canvasRef, color, prefersReducedMotion]);
}

function useBuildGridCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>, color: string) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    let t = 0;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cells = 6;
      const size = Math.min(canvas.width, canvas.height) * 0.72;
      const ox = (canvas.width - size) / 2;
      const oy = (canvas.height - size) / 2;
      const cell = size / cells;
      for (let r = 0; r < cells; r++) {
        for (let c = 0; c < cells; c++) {
          const wave = Math.sin((c + r) * 0.7 + t * 1.5) * 0.5 + 0.5;
          const x = ox + c * cell;
          const y = oy + r * cell;
          // filled block
          ctx.fillStyle = color;
          ctx.globalAlpha = wave * 0.22;
          ctx.fillRect(x + 2, y + 2, cell - 4, cell - 4);
          // border
          ctx.strokeStyle = color;
          ctx.globalAlpha = 0.12 + wave * 0.18;
          ctx.lineWidth = 0.7;
          ctx.strokeRect(x + 2, y + 2, cell - 4, cell - 4);
        }
      }
      t += 0.018;
      if (!prefersReducedMotion) {
        raf = requestAnimationFrame(draw);
      }
    };
    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [canvasRef, color, prefersReducedMotion]);
}

function useLaunchArcCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>, color: string) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    let t = 0;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height * 0.72;
      const arcs = 5;
      for (let a = 0; a < arcs; a++) {
        const r = 30 + a * 28;
        const phase = t * (0.4 + a * 0.08);
        const startA = Math.PI + phase;
        const endA = Math.PI * 2 + phase;
        ctx.beginPath();
        ctx.arc(cx, cy, r, startA, endA);
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.08 + (a / arcs) * 0.2;
        ctx.lineWidth = 1;
        ctx.stroke();
        // particle on arc
        const particleAngle = startA + (endA - startA) * ((t * 0.6) % 1);
        const px = cx + Math.cos(particleAngle) * r;
        const py = cy + Math.sin(particleAngle) * r;
        const pulse = Math.sin(t * 3 + a) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(px, py, 2 + pulse * 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.5 + pulse * 0.4;
        ctx.fill();
      }
      // rising streak lines
      for (let s = 0; s < 8; s++) {
        const sx = cx - 80 + s * 24;
        const progress = ((t * 0.7 + s * 0.3) % 1);
        const sy = cy - progress * cy * 1.4;
        ctx.beginPath();
        ctx.moveTo(sx, cy);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = color;
        ctx.globalAlpha = (1 - progress) * 0.18;
        ctx.lineWidth = 0.7;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = (1 - progress) * 0.55;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      t += 0.007;
      if (!prefersReducedMotion) {
        raf = requestAnimationFrame(draw);
      }
    };
    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [canvasRef, color, prefersReducedMotion]);
}

// ──[ How It Works ] Components ─────────────────────────────────────────────────

export function HowItWorks() {
  const ref = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isStackedLayout, setIsStackedLayout] = useState(false);

  useEffect(() => {
    const check = () => setIsStackedLayout(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const getFlexValue = (i: number) => {
    if (hoveredIndex === null) return 1;
    if (hoveredIndex === i) return 1.27;
    return 0.865;
  };

  const steps = [
    {
      num: "01",
      label: "Discover",
      subtitle: "We start by listening.",
      body: "You tell us what is happening in the business, what is working, what feels stuck, and what keeps getting pushed back. We ask direct questions and give you a straight answer. Sometimes that answer is that you do not need us yet.",
      pills: ["Business Audit", "Market Analysis", "Goal Mapping", "Honest Assessment"],
      accentColor: "#FC6E20",
      canvasAnimation: 'orbit' as const,
      bg: '#100c0b',
      borderTop: '#FC6E20',
    },
    {
      num: "02",
      label: "Build",
      subtitle: "You see everything as it happens.",
      body: "We design and build in short, focused rounds. You can see live previews, leave feedback, and track what is done inside a private project portal. You should not have to chase for updates.",
      pills: ["UI/UX Design", "Dev Sprints", "Live Previews", "Feedback Portal"],
      accentColor: "#FC6E20",
      canvasAnimation: 'buildgrid' as const,
      bg: '#FC6E20',
      borderTop: '#FC6E20',
    },
    {
      num: "03",
      label: "Launch & Grow",
      subtitle: "Launching is the starting line.",
      body: "Before launch, we test the site, clean up the details, and hand everything over properly. After that, we can stay close with maintenance, SEO, and automation so the system keeps improving.",
      pills: ["QA Testing", "Smooth Handoff", "SEO Setup", "Ongoing Support"],
      accentColor: "#FC6E20",
      canvasAnimation: 'launch' as const,
      bg: '#dddddd',
      borderTop: '#FC6E20',
    },
  ];

  return (
    <div className="relative z-[7] w-full bg-[#F0EFED] dark:bg-[#1a1a1a]">
      <section id="process" ref={ref} className="py-28 md:py-36">
        {/* Section Header */}
        <div className="mb-16 content-gutter">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
            className="font-montserrat text-[#FC6E20] text-xs uppercase tracking-[0.2em] mb-4 block"
          >
            [ How It Works ]
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            className="font-playfair text-[clamp(2.8rem,6vw,5.9rem)] font-bold leading-[0.94] tracking-tight dark:text-snow text-dark-void"
          >
            From first conversation<br />
            to live product<span className="text-[#FC6E20]">.</span>
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 120 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            className="mt-6 h-1 bg-[#DD6211] rounded-full"
          />
        </div>

        {/* Accordion Cards — vertical stack on mobile, horizontal flex on desktop */}
        <div
          style={{
            marginLeft: 'var(--left-gutter)',
            marginRight: 'var(--right-gutter)',
            width: 'auto',
            overflow: 'visible',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: isStackedLayout ? 'column' : 'row',
              gap: isStackedLayout ? '1rem' : 0,
              width: '100%',
              overflow: 'visible',
            }}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {steps.map((step, i) => (
              <HowItWorksCard
                key={i}
                step={step}
                index={i}
                flexValue={getFlexValue(i)}
                isHovered={hoveredIndex === i}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                isStackedLayout={isStackedLayout}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

type HowItWorksStep = {
  num: string;
  label: string;
  subtitle: string;
  body: string;
  pills: string[];
  accentColor: string;
  canvasAnimation: 'orbit' | 'buildgrid' | 'launch';
  bg: string;
  borderTop: string;
};

function HowItWorksCard({
  step, index, flexValue, isHovered, onMouseEnter, onMouseLeave, isStackedLayout
}: {
  step: HowItWorksStep;
  index: number;
  flexValue: number;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isStackedLayout: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isLightBg = index === 2;
  const isDarkAccentBg = index === 1;
  const useDarkAccentText = index === 1;
  const isExpanded = isStackedLayout || isHovered;
  const textColor = isLightBg || useDarkAccentText ? '#151419' : 'white';

  const canvasColor = useDarkAccentText ? 'rgba(21,20,25,0.42)' : step.accentColor;

  useOrbitCanvas(step.canvasAnimation === 'orbit' ? canvasRef : { current: null }, canvasColor);
  useBuildGridCanvas(step.canvasAnimation === 'buildgrid' ? canvasRef : { current: null }, canvasColor);
  useLaunchArcCanvas(step.canvasAnimation === 'launch' ? canvasRef : { current: null }, canvasColor);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dy, setDy] = useState(-180);

  useEffect(() => {
    let rafId = 0;
    const update = () => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        setDy(12 - rect.top + window.scrollY);
      }
    };
    const scheduleUpdate = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };
    scheduleUpdate();
    window.addEventListener('resize', scheduleUpdate);
    return () => {
      window.removeEventListener('resize', scheduleUpdate);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.15 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-80px" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        flex: isStackedLayout ? '1 1 auto' : `${flexValue} 1 0%`,
        transition: 'flex 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        backgroundColor: step.bg,
        color: textColor,
        overflow: 'hidden',
        minHeight: isStackedLayout ? 'clamp(470px, 58vh, 620px)' : '580px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        marginLeft: (!isStackedLayout && index > 0) ? '-16px' : '0',
        zIndex: isExpanded ? 10 : index + 1,
        borderRadius: '20px 20px 20px 20px',
        borderTop: isDarkAccentBg ? 'none' : `1px solid ${isLightBg ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}`,
        borderLeft: isDarkAccentBg ? 'none' : `1px solid ${isLightBg ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}`,
        borderRight: isDarkAccentBg ? 'none' : `1px solid ${isLightBg ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)'}`,
        borderBottom: 'none',
        boxShadow: isExpanded
          ? `0 0 0 1px ${step.borderTop}33, 0 24px 60px rgba(0,0,0,0.15)`
          : '0 8px 32px rgba(0,0,0,0.08)',
      }}
    >
      {/* Removed accent top-border glow strip */}

      <div
        style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: isStackedLayout ? '1.5rem' : '2rem 2rem 2rem 2rem',
        }}
      >
        {/* Step number + label row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{
            fontFamily: 'var(--font-montserrat, sans-serif)',
            fontSize: '12.8px',
            fontWeight: 600,
            lineHeight: 1,
            color: useDarkAccentText ? '#151419' : (isLightBg ? '#151419' : 'rgba(255,255,255,0.9)'),
            userSelect: 'none',
            border: `1px solid ${useDarkAccentText ? 'rgba(21,20,25,0.16)' : (isLightBg ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)')}`,
            borderRadius: '4px',
            padding: '4px 10px',
            display: 'inline-block',
          }}>
            {step.num}
          </div>
        </div>

        {/* Accent bar */}
        <div style={{ width: isHovered ? '48px' : '24px', height: '2px', background: useDarkAccentText ? '#151419' : step.accentColor, marginBottom: '1.25rem', transition: 'width 0.4s ease', borderRadius: '2px' }} />

        {/* Label */}
        <h3
          style={{
            fontFamily: 'var(--font-montserrat, sans-serif)',
            fontSize: 'clamp(1rem, 1.4vw, 1.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            color: useDarkAccentText ? '#151419' : textColor,
            marginBottom: '0.5rem',
          }}
        >
          {step.label}
        </h3>

        {/* Italic subtitle */}
        <p style={{ fontFamily: 'var(--font-montserrat, sans-serif)', fontSize: 'clamp(0.8rem, 1vw, 1rem)', fontWeight: 500, color: useDarkAccentText ? 'rgba(21,20,25,0.78)' : step.accentColor, marginBottom: '1.5rem', opacity: 0.9 }}>
          {step.subtitle}
        </p>

        {/* Canvas animation & Body text area */}
        <div ref={wrapperRef} style={{ flex: 1, position: 'relative', minHeight: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

          <motion.div
            initial={false}
            animate={{
              scale: isExpanded ? (isStackedLayout ? 0.62 : 0.52) : 1,
              x: isExpanded ? (isStackedLayout ? 0 : 20) : 0,
              y: isExpanded ? (isStackedLayout ? -58 : dy) : 0,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              position: 'absolute',
              inset: 0,
              transformOrigin: 'top right',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            <canvas
              ref={canvasRef}
              style={{ width: '100%', height: '100%' }}
            />
          </motion.div>

          {/* Body text */}
          <motion.div
            initial={false}
            animate={{ opacity: isExpanded ? 1 : 0, y: isExpanded ? 0 : 8 }}
            transition={{ duration: 0.25, delay: isExpanded ? 0.05 : 0, ease: "easeOut" }}
            className="font-montserrat"
            style={{
              fontSize: isStackedLayout ? '14px' : '17px',
              lineHeight: isStackedLayout ? 1.65 : 1.7,
              color: useDarkAccentText ? 'rgba(21,20,25,0.74)' : (index === 2 ? '#1a1a1a' : 'rgba(255,255,255,0.72)'),
              textTransform: 'none',
              letterSpacing: '0',
              maxWidth: isStackedLayout ? 'min(34rem, 92%)' : '85%',
              textAlign: 'center',
              pointerEvents: 'none',
              position: 'relative',
              zIndex: 5,
            }}
          >
            {step.body}
          </motion.div>
        </div>

        {/* Pills (always visible) */}
        <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', paddingRight: (!isStackedLayout && index === 2) ? 'var(--right-gutter)' : 0 }}>
          {step.pills.map((pill, j) => (
            <span
              key={j}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '40px',
                padding: '0 10px',
                border: 'none',
                borderRadius: '9999px',
                fontSize: '0.7rem',
                fontFamily: 'var(--font-montserrat, sans-serif)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: useDarkAccentText ? '#151419' : (isLightBg ? '#1a1a1a' : 'rgba(255,255,255,0.5)'),
                background: useDarkAccentText ? 'rgba(255,255,255,0.18)' : (isLightBg ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)'),
              }}
            >
              {pill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}


type HomeInsightNote = {
  category: string;
  title: string;
  summary: string;
  readTime: string;
  href: string;
  image: string;
  imageAlt: string;
  tags: string[];
};

const homeInsightNotes: HomeInsightNote[] = [
  {
    category: 'Pricing',
    title: 'How Much Does a Website Cost in South Africa in 2026',
    summary:
      'A practical guide to quote ranges, hidden costs, and what actually changes the price of a serious website build.',
    readTime: '10 min read',
    href: '/insights/website-cost-south-africa-2026',
    image: '/images/insights/website-cost-planning.webp',
    imageAlt: 'Business owner comparing website quotes and pricing breakdowns at a desk.',
    tags: ['Pricing', 'Planning'],
  },
  {
    category: 'Conversion',
    title: "Why Your Website Looks Good But Doesn't Convert",
    summary:
      'A clear breakdown of why polished pages still leak enquiries when trust, copy, mobile paths, and CTAs are weak.',
    readTime: '9 min read',
    href: '/insights/why-your-website-looks-good-but-doesnt-convert',
    image: '/images/insights/website-conversion-diagnostics.webp',
    imageAlt: 'Business owner reviewing website analytics, heatmap activity, and conversion data.',
    tags: ['Conversion', 'Websites'],
  },
  {
    category: 'Visibility',
    title: 'Local SEO for Johannesburg Service Businesses',
    summary:
      'How maps, reviews, local pages, service clarity, and search structure help Johannesburg businesses get found.',
    readTime: '8 min read',
    href: '/insights/local-seo-johannesburg-service-businesses',
    image: '/images/insights/local-seo-johannesburg-visibility.webp',
    imageAlt: 'Local business storefront with mobile search map results and local visibility signals.',
    tags: ['SEO', 'Local'],
  },
];

function HomeSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#FC6E20]">
      <span>[</span>
      {children}
      <span>]</span>
    </span>
  );
}

function HomeInsightCard({ note, index }: { note: HomeInsightNote; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.68, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group h-full"
    >
      <Link href={note.href} className="flex h-full flex-col text-[#151419]">
        <div className="relative h-[21rem] overflow-hidden rounded-[0.55rem] bg-[#151419]/8 md:h-[24rem]">
          <Image
            src={note.image}
            alt={note.imageAlt}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
            className="object-cover transition duration-500 ease-out group-hover:scale-[1.045]"
          />
          <div className="absolute inset-0 bg-[#060808]/0 transition-colors duration-300 group-hover:bg-[#060808]/10" />
        </div>
        <div className="flex flex-1 flex-col pt-5">
          <p className="font-montserrat text-[0.72rem] font-medium leading-none text-[#060808]/66">
            {note.category} - {note.readTime}
          </p>
          <h3 className="mt-3 max-w-[34rem] font-montserrat text-[1.05rem] font-extrabold leading-[1.14] tracking-normal text-[#060808] transition-colors duration-300 group-hover:text-[#DD6211] md:text-[1.08rem]">
            {note.title}
          </h3>
          <p className="mt-4 font-montserrat text-sm leading-7 text-[#151419]/62">
            {note.summary}
          </p>
          <div className="mt-auto flex flex-wrap gap-2 pt-6">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#151419]/10 bg-[#151419]/5 px-3 py-1.5 font-montserrat text-[0.62rem] font-bold uppercase tracking-[0.12em] text-[#151419]/62"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export function Insights() {
  return (
    <section id="insights" className="content-gutter relative z-[7] py-20 text-[#151419] md:py-28">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)] lg:items-end">
        <motion.div
          initial={{ opacity: 0, x: -26 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-15% 0px -10% 0px' }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
          <HomeSectionLabel>Insights</HomeSectionLabel>
          <h2 className="mt-5 max-w-4xl font-playfair text-[clamp(2.8rem,6vw,5.9rem)] font-bold leading-[0.94] tracking-tight text-[#151419]">
            Field notes that lead back to practical decisions<span className="text-[#FC6E20]">.</span>
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 26 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-15% 0px -10% 0px' }}
          transition={{ duration: 0.72, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="lg:ml-auto lg:max-w-xl"
        >
          <p className="font-montserrat text-base leading-8 text-[#151419]/64 md:text-lg">
            Start with the question the business is already asking: what should
            this cost, why is the site not converting, or why are the right
            clients not finding us?
          </p>
          <AnimatedTextLink
            href="/insights"
            withArrow
            className="mt-7 font-montserrat text-sm font-bold uppercase tracking-[0.12em] text-[#151419]"
          >
            Browse all insights
          </AnimatedTextLink>
        </motion.div>
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-3">
        {homeInsightNotes.map((note, index) => (
          <HomeInsightCard key={note.title} note={note} index={index} />
        ))}
      </div>
    </section>
  );
}


type FeaturedBuild = {
  id: string;
  title: string;
  eyebrow: string;
  summary: string;
  outcome: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  accent: string;
  tags: string[];
  features: string[];
};

const featuredBuilds: FeaturedBuild[] = [
  {
    id: '01',
    title: 'Coach Kagiso',
    eyebrow: 'Career coaching platform',
    summary:
      'A warm editorial personal-brand website that turns career clarity into bookings, paid services, diagnostics, and lead capture.',
    outcome:
      'Built around service pathways for diagnostics, PayFast checkout, Cal.com booking, lead magnets, intake, and resources.',
    image: '/images/work/coach-kagiso-showcase.jpg',
    imageWidth: 960,
    imageHeight: 5490,
    accent: '#C7AA94',
    tags: ['Website', 'Booking Flow', 'PayFast', 'Lead Magnet'],
    features: ['5-minute career diagnostic', 'Paid service buying flow', 'Resource and insights hub'],
  },
  {
    id: '02',
    title: 'Touch Teq Engineering',
    eyebrow: 'Industrial engineering website',
    summary:
      'A safety-critical engineering website that makes complex services feel credible, clear, and ready for qualified enquiries.',
    outcome:
      'Built with service architecture, quote paths, facility risk assessment, technical insights, and private operations tooling behind the public site.',
    image: '/images/work/touch-teq-showcase.jpg',
    imageWidth: 960,
    imageHeight: 7158,
    accent: '#FC6E20',
    tags: ['B2B Website', 'Quote Flow', 'Risk Assessment', 'Dashboard'],
    features: ['Industrial service grid', 'Facility risk lead tool', 'Office workflow foundation'],
  },
  {
    id: '03',
    title: 'Ubuntu Memorial Services',
    eyebrow: 'Funeral services platform concept',
    summary:
      'A self-initiated funeral-services concept that pairs package browsing, online registration, contribution records, receipts, and staff review workflows.',
    outcome:
      'ParlourPay models member records, dependant rules, demo payments, digital stamp-book receipts, and office reconciliation behind a dignified public brand.',
    image: '/images/work/ubuntu-memorial-services-showcase.jpg',
    imageWidth: 960,
    imageHeight: 8016,
    accent: '#154230',
    tags: ['Industry Concept', 'Funeral Tech', 'Registration UX', 'Payment Records', 'Dashboard'],
    features: ['Funeral parlour website', 'Registration and payment flow', 'Staff dashboard with audit trail'],
  },
];

export function BusinessHeroSection() {
  return <FeaturedBuildsSection />;
}

function useIsDesktopViewport() {
  return useSyncExternalStore(
    (callback) => {
      const mediaQuery = window.matchMedia('(min-width: 1024px)');
      mediaQuery.addEventListener('change', callback);

      return () => {
        mediaQuery.removeEventListener('change', callback);
      };
    },
    () => window.matchMedia('(min-width: 1024px)').matches,
    () => false,
  );
}

function buildScrollStackKeyframes(index: number, total: number) {
  const lastIndex = Math.max(total - 1, 1);
  const input = Array.from({ length: total }, (_, itemIndex) => itemIndex / lastIndex);
  const scale = input.map((_, itemIndex) => 1 - Math.max(0, itemIndex - index) * 0.045);
  const rotate = input.map((_, itemIndex) => -Math.max(0, itemIndex - index) * 1.15);
  const entryStart = index === 0 ? 0 : (index - 1) / lastIndex;
  const entryEnd = index / lastIndex;

  return {
    input,
    scale,
    rotate,
    yInput: index === 0 ? [0, 1] : [entryStart, entryEnd],
    yOutput:
      index === 0
        ? ['0px', `${-28 * Math.max(total - 1, 0)}px`]
        : ['18vh', `${index * 34}px`],
  };
}

function FeaturedBuildsSection() {
  const stackRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktopViewport();
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section className="relative z-[7] w-full [overflow-x:clip] bg-[#F0EFED] py-20 text-[#151419] dark:bg-[#1a1a1a] dark:text-snow md:py-28 lg:py-36">
      <div className="absolute right-0 top-0 hidden h-1/2 w-[46vw] bg-[#151419] dark:bg-[#0f0f12] lg:block" />

      <div className="absolute inset-0 pointer-events-none opacity-70">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 border-l border-black/[0.06] dark:border-white/[0.06]"
            style={{ left: `${(i / 7) * 100}%` }}
          />
        ))}
      </div>

      <div className="content-gutter relative z-10">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:gap-16 xl:gap-20">
          <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:self-start lg:py-24">
            <span className="font-montserrat text-xs font-semibold uppercase tracking-[0.24em] text-[#FC6E20]">
              [ WHAT WE&apos;VE BUILT ]
            </span>
            <h2 className="mt-5 max-w-xl font-playfair text-[clamp(2.8rem,6vw,5.9rem)] font-bold leading-[0.94] tracking-tight text-[#151419] dark:text-snow">
              Recent builds with the system underneath<span className="text-[#FC6E20]">.</span>
            </h2>
            <p className="mt-6 max-w-md font-montserrat text-base leading-8 text-[#6b6b6b] dark:text-snow/60 md:text-lg">
              Selected client and self-initiated builds shown as working digital infrastructure: coaching, industrial engineering, and funeral-services systems with public trust and operational depth.
            </p>
            <p className="hidden">
              For founders, professional practices, and engineering teams across South Africa. Work built to be used, not just admired.
            </p>
            <div className="mt-10 grid max-w-md grid-cols-2 gap-3 font-montserrat">
              <div className="border border-[#151419]/10 bg-white/55 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#595959]">Projects</span>
                <span className="mt-2 block font-mono text-3xl text-[#151419] dark:text-white">03</span>
              </div>
              <div className="border border-[#151419]/10 bg-white/55 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#595959]">Scope</span>
                <span className="mt-2 block font-mono text-3xl text-[#151419] dark:text-white">Full</span>
              </div>
            </div>
            <Link
              href="/work"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#151419] px-6 py-3 font-montserrat text-sm font-semibold text-white transition-colors hover:bg-[#FC6E20] hover:text-[#151419] dark:bg-white dark:text-[#151419] dark:hover:bg-[#FC6E20]"
            >
              <AnimatedLinkText hiddenClassName="text-[#151419]">View the work</AnimatedLinkText>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div ref={stackRef} className="space-y-8 lg:space-y-0 lg:pb-[18vh]">
            {featuredBuilds.map((build, index) => (
              <FeaturedBuildCard
                key={build.id}
                build={build}
                index={index}
                total={featuredBuilds.length}
                scrollYProgress={scrollYProgress}
                isDesktop={isDesktop}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedBuildCard({
  build,
  index,
  total,
  scrollYProgress,
  isDesktop,
}: {
  build: FeaturedBuild;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  isDesktop: boolean;
}) {
  const keyframes = buildScrollStackKeyframes(index, total);
  const y = useTransform(scrollYProgress, keyframes.yInput, keyframes.yOutput);
  const scale = useTransform(scrollYProgress, keyframes.input, keyframes.scale);
  const rotate = useTransform(scrollYProgress, keyframes.input, keyframes.rotate);
  const desktopInset = index * 28;

  return (
    <motion.div
      className="lg:sticky lg:top-0 lg:flex lg:min-h-screen lg:items-center lg:py-10"
      style={{ zIndex: 20 + index }}
    >
      <motion.article
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-12% 0px' }}
        transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="group relative w-full overflow-hidden border border-[#151419]/10 bg-[#F8F7F4] shadow-[0_28px_90px_rgba(21,20,25,0.14)] dark:border-white/10 dark:bg-[#151419]"
        style={
          isDesktop
            ? {
                y,
                scale,
                rotate,
                width: `calc(100% - ${desktopInset}px)`,
                marginLeft: `${desktopInset}px`,
                transformOrigin: 'top center',
              }
            : undefined
        }
      >
        <div
          className="absolute inset-x-0 top-0 h-1"
          style={{ background: `linear-gradient(90deg, ${build.accent}, transparent)` }}
        />
        <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[0.82fr_1.18fr] lg:p-8 xl:p-10">
          <div className="flex min-h-full flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 font-montserrat">
                <span className="font-mono text-sm text-[#595959]">{build.id}</span>
                <span
                  className="rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
                  style={{ borderColor: `${build.accent}55`, color: build.accent }}
                >
                  Featured build
                </span>
              </div>
              <p className="mt-8 font-montserrat text-xs font-semibold uppercase tracking-[0.24em] text-[#595959]">
                {build.eyebrow}
              </p>
              <h3 className="mt-4 font-playfair text-4xl font-bold leading-[1.02] tracking-tight text-[#151419] dark:text-white md:text-5xl">
                {build.title}
              </h3>
              <p className="mt-5 font-montserrat text-sm leading-7 text-[#606060] dark:text-white/60 md:text-base">
                {build.summary}
              </p>
              <p className="mt-5 border-l-2 pl-4 font-montserrat text-sm leading-7 text-[#151419] dark:text-white/80" style={{ borderColor: build.accent }}>
                {build.outcome}
              </p>
            </div>

            <div className="mt-8">
              <div className="grid gap-3">
                {build.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 font-montserrat text-sm text-[#505050] dark:text-white/60">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: build.accent }} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap gap-2">
                {build.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[#151419]/10 px-3 py-1.5 font-montserrat text-[11px] font-semibold uppercase tracking-[0.12em] text-[#505050] dark:border-white/10 dark:text-white/55">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[1.4rem] border border-[#151419]/15 bg-[#151419] p-2 shadow-[0_28px_80px_rgba(0,0,0,0.22)] dark:border-white/10">
              <div className="flex h-8 items-center justify-between border-b border-white/10 px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FC6E20]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/35" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                </div>
                <span>Full homepage capture</span>
              </div>
              <div className="relative h-[440px] overflow-hidden rounded-b-[1rem] bg-white sm:h-[520px] lg:h-[560px]">
                <Image
                  src={build.image}
                  alt={`${build.title} homepage screenshot`}
                  width={build.imageWidth}
                  height={build.imageHeight}
                  sizes="(min-width: 1280px) 45vw, (min-width: 1024px) 52vw, 100vw"
                  loading="lazy"
                  className="w-full max-w-none origin-top object-top transition-transform duration-[6500ms] ease-linear group-hover:-translate-y-[62%] motion-reduce:transform-none"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#151419]/80 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}

const projectOutcomes = [
  {
    statement: 'A warm coaching brand became a guided service platform with diagnostics, paid pathways, booking, intake, and resources working together.',
    project: 'Coach Kagiso',
    scope: 'Career coaching platform',
    badge: 'Personal brand and service conversion',
  },
  {
    statement: 'A technical engineering business gained a sharper digital presence for safety-critical services, quote requests, and risk-assessment leads.',
    project: 'Touch Teq Engineering',
    scope: 'Industrial website and lead flow',
    badge: 'Engineering and B2B enquiries',
  },
  {
    statement: 'A self-initiated funeral-services concept turned booklet-style member routines into registration, contribution, receipt, and review workflows.',
    project: 'Ubuntu Memorial Services',
    scope: 'Funeral services platform concept',
    badge: 'Industry concept and operations demo',
  },
  {
    statement: 'The selected builds go beyond brochure pages: they connect public trust, lead capture, member journeys, and private operational workflows.',
    project: 'Across selected builds',
    scope: 'Website plus workflow systems',
    badge: 'Digital infrastructure',
  },
];

export function Testimonial() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useSpring(mouseX, { damping: 25, stiffness: 200 });
  const y = useSpring(mouseY, { damping: 25, stiffness: 200 });
  const numberX = useTransform(x, [-200, 200], [-18, 18]);
  const numberY = useTransform(y, [-200, 200], [-10, 10]);

  const goNext = () => setActiveIndex((prev) => (prev + 1) % projectOutcomes.length);
  const goPrev = () => setActiveIndex((prev) => (prev - 1 + projectOutcomes.length) % projectOutcomes.length);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    mouseX.set(event.clientX - (rect.left + rect.width / 2));
    mouseY.set(event.clientY - (rect.top + rect.height / 2));
  };

  const current = projectOutcomes[activeIndex];

  return (
    <section className="relative z-[7] overflow-hidden bg-[#F0EFED] py-20 text-[#151419] dark:bg-[#151419] dark:text-[#FBFBFB] md:py-28">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          mouseX.set(0);
          mouseY.set(0);
        }}
        className="relative w-full pl-[var(--left-gutter)] pr-[var(--right-gutter)]"
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -left-5 top-0 select-none font-montserrat text-[8rem] font-black leading-none tracking-normal text-[#151419]/[0.035] dark:text-white/[0.045] sm:text-[13rem] md:-left-10 md:text-[18rem] lg:-left-16 lg:text-[24rem]"
          style={prefersReducedMotion ? undefined : { x: numberX, y: numberY }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.86, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.08, filter: 'blur(10px)' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              {String(activeIndex + 1).padStart(2, '0')}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <div className="relative grid gap-8 border-y border-[#151419]/12 py-10 dark:border-white/12 md:grid-cols-[88px_minmax(0,1fr)] md:gap-12 lg:grid-cols-[120px_minmax(0,1fr)] lg:py-16">
          <div className="flex items-center gap-4 md:flex-col md:justify-center md:border-r md:border-[#151419]/12 md:pr-8 md:dark:border-white/12 lg:pr-12">
            <motion.span
              className="font-montserrat text-[11px] uppercase tracking-[0.22em] text-[#595959] md:[writing-mode:vertical-rl]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.45 }}
            >
              Project outcomes
            </motion.span>
            <div className="relative h-px flex-1 bg-[#151419]/14 dark:bg-white/14 md:h-36 md:w-px md:flex-none">
              <motion.div
                className="absolute left-0 top-0 h-full bg-[#FC6E20] md:w-full"
                animate={{
                  width: `${((activeIndex + 1) / projectOutcomes.length) * 100}%`,
                  height: `${((activeIndex + 1) / projectOutcomes.length) * 100}%`,
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>

          <div className="min-w-0 py-2 md:py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={`badge-${activeIndex}`}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 18 }}
                transition={{ duration: 0.35 }}
                className="mb-8"
              >
                <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#151419]/12 px-3 py-1 font-montserrat text-[11px] uppercase tracking-[0.16em] text-[#595959] dark:border-white/14">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FC6E20]" />
                  {current.badge}
                </span>
              </motion.div>
            </AnimatePresence>

            <div className="relative mb-10 min-h-[150px] sm:min-h-[170px] lg:min-h-[200px]">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`quote-${activeIndex}`}
                  className="max-w-4xl font-playfair text-[clamp(2.5rem,5vw,5rem)] font-semibold leading-[1.04] tracking-normal text-[#151419] dark:text-white"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
                  transition={{ duration: prefersReducedMotion ? 0.18 : 0.38, ease: [0.22, 1, 0.36, 1] }}
                >
                  {current.statement}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`author-${activeIndex}`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.4, delay: 0.18 }}
                  className="flex items-center gap-4"
                >
                  <motion.div
                    className="h-px w-9 bg-[#151419] dark:bg-white"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.55, delay: 0.28 }}
                    style={{ originX: 0 }}
                  />
                  <div>
                    <p className="font-montserrat text-sm font-semibold text-[#151419] dark:text-white">{current.project}</p>
                    <p className="mt-1 font-montserrat text-sm text-[#595959]">{current.scope}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center gap-3">
                <motion.button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous project outcome"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#151419]/15 text-[#151419] transition hover:border-[#FC6E20] hover:text-[#FC6E20] dark:border-white/15 dark:text-white"
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="h-4 w-4" />
                </motion.button>
                <motion.button
                  type="button"
                  onClick={goNext}
                  aria-label="Next project outcome"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#151419]/15 text-[#151419] transition hover:border-[#FC6E20] hover:text-[#FC6E20] dark:border-white/15 dark:text-white"
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

const diagnosticToolCards = [
  {
    eyebrow: 'Website conversion',
    title: 'Website Lead Leak Scorecard',
    body: 'Find the speed, mobile, trust, clarity, and CTA issues that could be costing the site qualified enquiries.',
    href: '/tools/website-lead-leak-scorecard',
    cta: 'Run scorecard',
    icon: Gauge,
    card: 'bg-[#5F9FAA] text-[#060808]',
    iconBox: 'border-[#060808]/18 bg-[#060808]/8 text-[#060808]/62',
    ctaStyle: 'bg-[#060808] text-[#FBFBFB] group-hover:bg-[#FBFBFB] group-hover:text-[#060808]',
    hidden: 'text-[#060808]',
  },
  {
    eyebrow: 'Local search and maps',
    title: 'Local Visibility Scorecard',
    body: 'Assess Google Business Profile, reviews, local pages, directories, and AI-search readiness for Johannesburg queries.',
    href: '/tools/local-visibility-scorecard',
    cta: 'Check visibility',
    icon: SearchCheck,
    card: 'bg-[#DD6211] text-[#060808]',
    iconBox: 'border-[#060808]/18 bg-[#060808]/8 text-[#060808]/58',
    ctaStyle: 'bg-[#060808] text-[#FBFBFB] group-hover:bg-[#FBFBFB] group-hover:text-[#060808]',
    hidden: 'text-[#060808]',
  },
  {
    eyebrow: 'Lead response speed',
    title: 'Lead Response Leak Calculator',
    body: 'Turn slow replies into a monthly and annual revenue-leak estimate before deciding what to automate.',
    href: '/tools/lead-response-leak-calculator',
    cta: 'Calculate leak',
    icon: Calculator,
    card: 'bg-[#FFF6E9] text-[#0A171D]',
    iconBox: 'border-[#0A171D]/16 bg-[#0A171D]/[0.07] text-[#0A171D]/56',
    ctaStyle: 'bg-[#0A171D] text-[#FBFBFB] group-hover:bg-[#DD6211] group-hover:text-[#060808]',
    hidden: 'text-[#060808]',
  },
  {
    eyebrow: 'Website scope decision',
    title: 'Website Rebuild vs Refresh Quiz',
    body: 'Separate deep technical debt from content, design, and conversion problems before choosing the scope.',
    href: '/tools/website-rebuild-vs-refresh-quiz',
    cta: 'Take quiz',
    icon: RefreshCw,
    card: 'bg-[#B92717] text-[#FFF6E9]',
    iconBox: 'border-[#FFF6E9]/20 bg-[#FFF6E9]/8 text-[#FFF6E9]/68',
    ctaStyle: 'bg-[#FFF6E9] text-[#060808] group-hover:bg-[#060808] group-hover:text-[#FFF6E9]',
    hidden: 'text-[#FFF6E9]',
  },
];

type DiagnosticToolCard = (typeof diagnosticToolCards)[number];

export function DiagnosticToolsBridge() {
  const stackRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktopViewport();
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section className="relative z-[7] overflow-x-clip bg-[#060808] py-20 text-[#FBFBFB] md:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[30%] top-1/2 hidden h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.2)_1.1px,transparent_1.1px)] bg-[length:13px_13px] opacity-35 [mask-image:radial-gradient(circle_at_center,black_0%,black_48%,transparent_73%)] lg:block"
      />
      <div className="content-gutter relative grid gap-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(420px,1fr)] lg:items-start lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-15% 0px -10% 0px' }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          className="lg:sticky lg:top-28"
        >
          <HomeSectionLabel>Diagnostic tools</HomeSectionLabel>
          <h2 className="mt-5 max-w-3xl font-playfair text-[clamp(2.8rem,6vw,5.9rem)] font-bold leading-[0.94] tracking-tight">
            Start with the leak before you rebuild the whole system<span className="text-[#FC6E20]">.</span>
          </h2>
          <p className="mt-7 max-w-xl font-montserrat text-base leading-8 text-white/64 md:text-lg">
            The newer Tools page gives business owners a practical first step:
            score the page, check local visibility, estimate response loss, or
            decide whether the current site needs a rebuild or a tighter refresh.
          </p>
          <Link
            href="/tools"
            className="group mt-9 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full border border-white/22 px-6 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:border-[#DD6211] hover:bg-[#DD6211] hover:text-[#060808] sm:w-auto"
          >
            <ListChecks className="h-4 w-4" />
            <AnimatedLinkText hiddenClassName="text-[#060808]">Open tools hub</AnimatedLinkText>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <div ref={stackRef} className="grid content-start gap-5 lg:block lg:pb-[18vh]">
          {diagnosticToolCards.map((tool, index) => (
            <DiagnosticToolStackCard
              key={tool.title}
              tool={tool}
              index={index}
              total={diagnosticToolCards.length}
              scrollYProgress={scrollYProgress}
              isDesktop={isDesktop}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function DiagnosticToolStackCard({
  tool,
  index,
  total,
  scrollYProgress,
  isDesktop,
}: {
  tool: DiagnosticToolCard;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  isDesktop: boolean;
}) {
  const Icon = tool.icon;
  const keyframes = buildScrollStackKeyframes(index, total);
  const y = useTransform(scrollYProgress, keyframes.yInput, keyframes.yOutput);
  const scale = useTransform(scrollYProgress, keyframes.input, keyframes.scale);
  const rotate = useTransform(scrollYProgress, keyframes.input, keyframes.rotate);
  const desktopInset = index * 28;

  return (
    <motion.div
      data-diagnostic-stack-card
      className="lg:sticky lg:top-0 lg:flex lg:min-h-screen lg:items-center lg:py-10"
      style={{ zIndex: 20 + index }}
    >
      <motion.div
        className="w-full"
        style={
          isDesktop
            ? {
                y,
                scale,
                rotate,
                width: `calc(100% - ${desktopInset}px)`,
                marginLeft: `${desktopInset}px`,
                transformOrigin: 'top center',
              }
            : undefined
        }
      >
        <Link
          href={tool.href}
          className={`group flex min-h-[28rem] flex-col justify-between rounded-[2.25rem] p-7 shadow-[0_28px_70px_rgba(0,0,0,0.2)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_34px_86px_rgba(0,0,0,0.26)] md:p-8 lg:min-h-[31rem] ${tool.card}`}
        >
          <div>
            <div className="flex items-start justify-between gap-8">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] opacity-[0.68]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.05rem] border transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:rotate-3 ${tool.iconBox}`}>
                <Icon className="h-6 w-6" strokeWidth={1.8} />
              </span>
            </div>
            <p className="mt-10 font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.22em] opacity-[0.68]">
              {tool.eyebrow}
            </p>
            <h3 className="mt-4 max-w-md font-playfair text-[clamp(2.15rem,4vw,4rem)] font-bold leading-[0.94] tracking-tight">
              {tool.title}
            </h3>
            <p className="mt-6 max-w-md font-montserrat text-sm leading-7 opacity-[0.76]">
              {tool.body}
            </p>
          </div>
          <span className={`mt-10 inline-flex min-h-12 w-fit items-center justify-center gap-3 rounded-full px-6 font-montserrat text-xs font-bold uppercase tracking-[0.12em] transition-colors ${tool.ctaStyle}`}>
            <AnimatedLinkText hiddenClassName={tool.hidden}>{tool.cta}</AnimatedLinkText>
            <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export function HomeFinalCta() {
  return (
    <section className="content-gutter relative z-[7] pb-24 pt-24 md:pb-32 md:pt-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15% 0px -10% 0px' }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
      >
        <ExpandingCtaBackground>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <HomeSectionLabel>Start the next build</HomeSectionLabel>
              <h2 className="mt-5 max-w-4xl font-playfair text-[clamp(2.7rem,6.6vw,6.8rem)] font-bold leading-[0.9] tracking-tight">
                Tell us where it leaks. We will make the next move clear<span className="text-[#FC6E20]">.</span>
              </h2>
              <p className="mt-6 max-w-2xl font-montserrat text-base leading-8 text-[#151419]/64">
                Whether the pressure point is a website, local visibility,
                manual admin, or a dashboard the business keeps describing in
                spreadsheets, the first move is to make the problem clear.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/contact"
                className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-[#FC6E20] px-6 py-3 text-center font-montserrat text-sm font-bold uppercase tracking-[0.06em] text-[#151419] transition-colors duration-300 hover:bg-[#FBFBFB] sm:w-auto"
              >
                <AnimatedLinkText hiddenClassName="text-[#151419]">Start a project</AnimatedLinkText>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/tools/website-lead-leak-scorecard"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[#151419]/15 px-6 py-3 text-center font-montserrat text-sm font-bold uppercase tracking-[0.06em] text-[#151419] transition-colors duration-300 hover:border-[#FC6E20] hover:text-[#FC6E20] sm:w-auto"
              >
                <AnimatedLinkText>Run scorecard first</AnimatedLinkText>
              </Link>
            </div>
          </div>
        </ExpandingCtaBackground>
      </motion.div>
    </section>
  );
}

