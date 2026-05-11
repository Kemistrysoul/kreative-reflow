'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useScroll, useSpring, useTransform, useInView, useReducedMotion } from 'motion/react';
import DottedSection from "@/components/dotted-section";
import FounderTeaser from "@/components/FounderTeaser";
import Waves from '@/components/Waves';
import { AnimatedLinkText, AnimatedTextLink } from '@/components/AnimatedTextLink';
import { TextStaggerHover, TextStaggerHoverActive, TextStaggerHoverHidden } from '@/lib/animations';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F0EFED] dark:bg-[#1a1a1a] text-dark-void dark:text-snow font-sans selection:bg-liquid-lava selection:text-snow [overflow-x:clip]">
      <main className="flex-grow relative z-10 w-full [overflow-x:clip]">
        <Hero />
        <IntroSection />
        <DottedSection />
        <div className="mt-12 md:mt-20">
          <BusinessHeroSection />
        </div>
        <Testimonial />
        <HowItWorks />
        <FounderTeaser />
        <Insights />
      </main>
    </div>
  );
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = [
    { href: '/services', label: '01 — Services' },
    { href: '/insights', label: '02 — Insights' },
    { href: '/about', label: '03 — About' },
    { href: '/faq', label: '04 — FAQ' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F0EFED]/90 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl font-bold tracking-tighter text-dark-void">
          kreative Reflow
        </Link>

        <div className="flex items-center gap-6">
          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 font-montserrat text-sm uppercase tracking-wide">
            {navLinks.map((item) => (
              <AnimatedTextLink key={item.href} href={item.href}>
                {item.label}
              </AnimatedTextLink>
            ))}
          </nav>
          <Link href="/contact" className="hidden md:inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold uppercase tracking-tight font-montserrat text-snow bg-dark-void rounded-full hover:bg-liquid-lava transition-colors duration-300">
            05 — Let's Talk
          </Link>
          <button className="text-dark-void p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-0 right-0 bg-[#F0EFED] border-b border-black/5 p-6 flex flex-col gap-6 font-sans text-lg text-dark-void shadow-xl"
          >
            {navLinks.map((item) => (
              <AnimatedTextLink key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                {item.label}
              </AnimatedTextLink>
            ))}
            <Link href="/contact" onClick={() => setIsOpen(false)} className="inline-flex items-center justify-center px-6 py-3 font-medium text-snow bg-dark-void rounded-full hover:bg-liquid-lava transition-colors duration-300">
              05 — Let's Talk
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function LayeredAbstractShape() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const mouseRef = useRef(mousePos);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    mouseRef.current = mousePos;
  }, [mousePos]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current || prefersReducedMotion) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -1000, y: -1000 });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let observer: IntersectionObserver | null = null;
    let isVisible = false;
    let particles: PixelParticle[] = [];
    let time = 0;

    const init = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = [];
      const particleSize = 3; // Smaller pixels for more detail
      const radius = 220;

      const cols = (radius * 2) / particleSize;
      const rows = (radius * 2) / particleSize;

      const offsetX = rect.width / 2;
      const offsetY = rect.height / 2;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = (i * particleSize) - radius;
          const y = (j * particleSize) - radius;

          // Distance from center
          const dist = Math.sqrt(x * x + y * y);

          if (dist < radius) {
            // Create layered undulating shape using noise-like functions
            const angle = Math.atan2(y, x);

            // Complex shape function
            const shapeRadius = radius * 0.5 +
              radius * 0.3 * Math.sin(angle * 3) +
              radius * 0.2 * Math.cos(angle * 5 + dist * 0.05);

            // Only add particles if they fall within the complex shape boundary
            // We use a "thickness" to create the layered look
            const layerThickness = 15;
            const numLayers = 8;

            let isPart = false;
            let layerIndex = 0;

            for (let l = 0; l < numLayers; l++) {
              const layerOffset = l * 20;
              const currentShapeRadius = shapeRadius - layerOffset;

              if (Math.abs(dist - currentShapeRadius) < layerThickness) {
                isPart = true;
                layerIndex = l;
                break;
              }
            }

            if (isPart) {
              // Determine color based on layer and position
              // Mix of black/dark grey and peach/orange
              const isPeach = (layerIndex % 3 === 0) || (Math.sin(angle * 2 + dist * 0.02) > 0.5);

              let color;
              if (isPeach) {
                // Peach/Orange gradient
                const intensity = Math.floor(150 + (layerIndex / numLayers) * 105);
                color = `rgba(245, 150, 110, ${intensity / 255})`; // Peach/Orange
              } else {
                // Dark grey/Black gradient
                const intensity = Math.floor(20 + (layerIndex / numLayers) * 60);
                color = `rgba(${intensity}, ${intensity}, ${intensity}, 0.9)`; // Dark grey
              }

              particles.push(new PixelParticle(
                offsetX + x,
                offsetY + y,
                particleSize,
                color
              ));
            }
          }
        }
      }
    };

    const drawFrame = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const cx = rect.width / 2;
      const cy = rect.height / 2;

      // Slowly rotate the entire shape by updating base positions
      const cosT = Math.cos(time * 0.2);
      const sinT = Math.sin(time * 0.2);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Calculate original relative position
        // We need to store the very original position to rotate properly
        if (!(p as any).origX) {
          (p as any).origX = p.baseX - cx;
          (p as any).origY = p.baseY - cy;
        }

        const ox = (p as any).origX;
        const oy = (p as any).origY;

        // Apply rotation to base position
        p.baseX = cx + ox * cosT - oy * sinT;
        p.baseY = cy + ox * sinT + oy * cosT;

        // Add a subtle undulating effect to the base position
        const dist = Math.sqrt(ox * ox + oy * oy);
        p.baseX += Math.sin(time * 2 + dist * 0.05) * 2;
        p.baseY += Math.cos(time * 2 + dist * 0.05) * 2;

        p.update(mouseRef.current);
        p.draw(ctx);
      }
    };

    const animate = () => {
      if (!isVisible) {
        animationFrameId = 0;
        return;
      }

      time += 0.005;
      drawFrame();
      animationFrameId = requestAnimationFrame(animate);
    };

    const start = () => {
      if (animationFrameId || prefersReducedMotion) return;
      isVisible = true;
      animationFrameId = requestAnimationFrame(animate);
    };

    const stop = () => {
      isVisible = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
    };

    const handleResize = () => {
      init();
      drawFrame();
    };

    init();
    drawFrame();

    if (!prefersReducedMotion) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            start();
          } else {
            stop();
          }
        },
        { threshold: 0.08 }
      );
      observer.observe(canvas);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      observer?.disconnect();
      stop();
    };
  }, [prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full h-[500px] lg:h-[600px] cursor-crosshair touch-none"
    />
  );
}

function IntroSection() {
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const getFlexValue = (i: number) => {
    if (hoveredIndex === null) return 1;
    if (hoveredIndex === i) return 1.3;
    return 0.85;
  };

  const services = [
    {
      num: '01', total: '04',
      title: 'Web Design & Development',
      subhead: 'Built for your business. Not borrowed from a template.',
      desc: 'Your website should work as hard as you do. We build custom sites that bring in leads, build trust, and run 24/7. Designed for your audience, built for speed, and made to grow with you.',
      bg: '#151419',
      textColor: 'white',
      canvasAnimation: 'dotmatrix' as const,
    },
    {
      num: '02', total: '04',
      title: 'Local & AI SEO',
      subhead: 'Your idea, engineered for your business.',
      desc: 'Need a portal, booking system, or custom dashboard? We build web applications around how your business actually works, not what off-the-shelf tools can almost do. Built from scratch and handed over, fully yours.',
      bg: '#3D7A7A',
      textColor: 'white',
      canvasAnimation: 'sinewave' as const,
    },
    {
      num: '03', total: '04',
      title: 'SaaS & Custom Web Applications',
      subhead: 'Get found by the people who are already looking for you.',
      desc: 'A great website means nothing if nobody sees it. We make sure your business shows up where your clients are searching, on Google, on maps, and in AI search. More visibility. More enquiries. Less guessing.',
      bg: '#F56E0F',
      textColor: '#151419',
      canvasAnimation: 'radial' as const,
    },
    {
      num: '04', total: '04',
      title: 'AI & Business Automation',
      subhead: 'Stop doing manually what a system can do for you.',
      desc: 'Follow-ups, data entry, scheduling, reporting. If your team repeats it daily, we automate it. We build systems that handle the busywork so your people can focus on what actually needs a human.',
      bg: '#F0EFED',
      textColor: '#151419',
      canvasAnimation: 'helix' as const,
    },
  ];

  return (
    <section ref={ref} className="relative w-full py-32 overflow-hidden bg-[#F0EFED]">
      <motion.div
        className="absolute inset-0 bg-[#1a1a1a] origin-left z-0"
        style={{ scaleX: bgScaleX, borderRadius: '0 0 0 0' }}
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
        <div className="px-[3%]">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-24 mb-32">
            <div className="max-w-3xl">
              <motion.h2
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: false, margin: "-100px" }}
                className="font-playfair text-4xl md:text-5xl lg:text-[4.0625rem] font-bold tracking-tight mb-6 leading-[1.1]"
              >
                We build the <br />
                websites, systems, <br />
                and automation that <br />
                give your business an <br />
                <span className="text-[#e05a15]">unfair advantage</span>.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: false, margin: "-100px" }}
                className="text-lg md:text-[1.25rem] font-montserrat opacity-80"
              >
                Custom-built digital infrastructure for businesses ready to grow beyond templates, manual processes, and agencies that disappear after launch.
              </motion.p>
            </div>
            <div className="flex flex-col gap-8 max-w-2xl lg:mt-32">
              <motion.p
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: false, margin: "-100px" }}
                className="text-base leading-relaxed font-montserrat opacity-80"
              >
                Whether you need a high-performance website, a custom dashboard, a SaaS product, or an automated system that runs while you sleep - we build it properly, from the ground up. No page builders. No shortcuts. No unnecessary complexity.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: false, margin: "-100px" }}
                className="text-base leading-relaxed font-montserrat opacity-80"
              >
                Based in Johannesburg and working with clients across South Africa and internationally. We combine technical depth with a clear understanding of what actually moves the needle for small and growing businesses.
              </motion.p>
            </div>
          </div>
        </div>
        <div className="px-[3%] mt-72 mb-12">
          <span className="font-montserrat text-xs tracking-[0.2em] uppercase mb-4 block" style={{ fontWeight: 400, color: 'rgb(245, 110, 15)', fontSize: '12px', lineHeight: '16px' }}>
            [ WHAT WE DO ]
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-[4.0625rem] font-bold tracking-tighter font-playfair text-white mb-6 max-w-3xl">
            One studio<br />Every layer of your digital business.
          </h2>
          <p className="text-base md:text-[1.25rem] text-white/60 max-w-2xl font-montserrat leading-relaxed">
            Most agencies sell you a website and disappear. We build the website, the systems behind it, and the strategy that makes all of it work.
          </p>
        </div>
        <div
          className="services-cards-wrapper mt-32"
          style={isMobile ? { width: '100%', marginRight: 0, overflow: 'hidden' } : { width: 'calc(100% + 64px)', marginRight: '-64px', overflow: 'hidden' }}
        >
          <div
            style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', width: '100%', overflow: 'hidden' }}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {services.map((s, i) => (
              <ServiceCard
                key={i} {...s} index={i} flexValue={getFlexValue(i)}
                isHovered={hoveredIndex === i}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                isMobile={isMobile}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-stone-50 dark:bg-[#1A1A1A] isolate">
      <Waves />

      <div className="relative z-10 text-center w-full max-w-6xl px-4 sm:px-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-playfair font-bold leading-[1.1] sm:leading-[0.95] tracking-tight text-stone-950 dark:text-stone-50">
          Your business deserves<span className="sr-only"> </span><br />
          a better digital foundation
        </h1>
        <p className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl font-montserrat text-stone-600 dark:text-stone-400 max-w-3xl mx-auto px-2">
          We design and build websites, dashboards, portals, and systems that help you
          show up with confidence and run with less friction.
        </p>
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 sm:px-0">
          <TextStaggerHover as="button" className="w-full sm:w-auto min-h-[44px] rounded-full bg-[#FC6E20] px-8 py-4 font-montserrat font-medium text-stone-950 hover:bg-[#e05a15] transition-colors flex items-center justify-center">
            <TextStaggerHoverActive animation="blur" staggerDirection="middle">
              Book a Discovery Call →
            </TextStaggerHoverActive>
            <TextStaggerHoverHidden animation="blur" staggerDirection="middle">
              Book a Discovery Call →
            </TextStaggerHoverHidden>
          </TextStaggerHover>
          <TextStaggerHover as="button" className="w-full sm:w-auto min-h-[44px] font-montserrat font-medium text-stone-950 dark:text-stone-50 hover:text-stone-700 dark:hover:text-stone-300 transition-colors py-3 px-4 flex items-center justify-center">
            <TextStaggerHoverActive animation="blur" staggerDirection="middle">
              View Selected Work
            </TextStaggerHoverActive>
            <TextStaggerHoverHidden animation="blur" staggerDirection="middle">
              View Selected Work
            </TextStaggerHoverHidden>
          </TextStaggerHover>
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
  total: string;
  title: string;
  subhead: string;
  desc: string;
  bg: string;
  textColor: string;
  canvasAnimation: 'dotmatrix' | 'sinewave' | 'radial' | 'helix';
  flexValue: number;
  index: number;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isMobile: boolean;
};

function ServiceCard({ num, total, title, subhead, desc, bg, textColor, canvasAnimation, flexValue, index, isHovered, onMouseEnter, onMouseLeave, isMobile }: ServiceCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotColor = textColor === 'white' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.75)';

  useDotMatrixCanvas(canvasAnimation === 'dotmatrix' ? canvasRef : { current: null }, dotColor);
  useSineWaveCanvas(canvasAnimation === 'sinewave' ? canvasRef : { current: null }, dotColor);
  useRadialBurstCanvas(canvasAnimation === 'radial' ? canvasRef : { current: null }, dotColor);
  useHelixCanvas(canvasAnimation === 'helix' ? canvasRef : { current: null }, dotColor);

  const borderRadius = '20px 20px 20px 20px';

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="services-card"
      style={{
        flex: isMobile ? '1 1 100%' : `${flexValue} 1 0%`,
        transition: 'flex 0.35s ease',
        backgroundColor: bg,
        color: textColor,
        overflow: 'hidden',
        minHeight: isMobile ? '480px' : '580px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        marginLeft: (!isMobile && index > 0) ? '-14px' : '0',
        zIndex: isHovered ? 10 : index + 1,
        borderRadius,
      }}
    >
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', padding: index === 3 ? '2rem 64px 2rem 32px' : '2rem 32px 2rem 32px' }}>
        <style>{`
          @media (max-width: 1280px) {
            .services-card:nth-child(4) > div:first-child {
              padding-right: 56px !important;
            }
          }
          @media (max-width: 1024px) {
            .services-card:nth-child(4) > div:first-child {
              padding-right: 20px !important;
            }
          }
          @media (max-width: 640px) {
            .services-card:nth-child(4) > div:first-child {
              padding-right: 12px !important;
            }
          }
        `}</style>
        <h3
          className="font-display font-bold uppercase tracking-tight text-center"
          style={{ fontSize: 'clamp(1rem, 1.4vw, 1.5rem)', letterSpacing: '-0.02em', marginBottom: '1.5rem', color: textColor }}
        >
          {title.split(' and ').map((part, i, arr) => (
            <span key={i}>
              {i > 0 && <span style={{ fontSize: '0.75em', verticalAlign: 'middle', marginLeft: '0.15em', marginRight: '0.15em' }}>and</span>}
              {part}
            </span>
          ))}
        </h3>
        <p className="font-montserrat text-center" style={{ fontSize: 'clamp(0.65rem, 0.9vw, 0.8rem)', opacity: 0.7, color: textColor, marginBottom: '0.25rem', marginTop: '-1.25rem' }}>
          {subhead}
        </p>
        <div style={{ flex: 1, position: 'relative', minHeight: '220px', marginTop: index === 0 ? '1rem' : undefined }}>
          <canvas
            ref={canvasRef}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          />
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <p
            className="font-montserrat text-center"
            style={{ fontSize: 'clamp(12.5px, 1vw, 0.9rem)', lineHeight: 1.6, opacity: 0.75, color: textColor, letterSpacing: '0.02em' }}
          >
            {desc}
          </p>
          {(index === 0 || index === 1) && (
            <p className="font-montserrat text-center text-xs mt-3 opacity-50" style={{ color: textColor }}>
              [ Includes ongoing support plans. ]
            </p>
          )}
          <a href="#contact" className="font-montserrat text-center block mt-4 text-sm opacity-60 hover:opacity-100 transition-opacity" style={{ color: textColor }}>
            Learn more →
          </a>
        </div>
      </div>
    </div>
  );
}

function Services() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const getFlexValue = (i: number) => {
    if (hoveredIndex === null) return 1;
    if (hoveredIndex === i) return 1.3;
    return 0.85;
  };

  const services = [
    {
      num: '01', total: '04',
      title: 'Web Design & Development',
      subhead: 'Built for your business. Not borrowed from a template.',
      desc: 'Your website should work as hard as you do. We build custom sites that bring in leads, build trust, and run 24/7. Designed for your audience, built for speed, and made to grow with you.',
      bg: '#151419',
      textColor: 'white',
      canvasAnimation: 'dotmatrix' as const,
    },
    {
      num: '02', total: '04',
      title: 'Local & AI SEO',
      subhead: 'Your idea, engineered for your business.',
      desc: 'Need a portal, booking system, or custom dashboard? We build web applications around how your business actually works, not what off-the-shelf tools can almost do. Built from scratch and handed over, fully yours.',
      bg: '#3D7A7A',
      textColor: 'white',
      canvasAnimation: 'sinewave' as const,
    },
    {
      num: '03', total: '04',
      title: 'SaaS & Custom Web Applications',
      subhead: 'Get found by the people who are already looking for you.',
      desc: 'A great website means nothing if nobody sees it. We make sure your business shows up where your clients are searching, on Google, on maps, and in AI search. More visibility. More enquiries. Less guessing.',
      bg: '#F56E0F',
      textColor: '#151419',
      canvasAnimation: 'radial' as const,
    },
    {
      num: '04', total: '04',
      title: 'AI & Business Automation',
      subhead: 'Stop doing manually what a system can do for you.',
      desc: 'Follow-ups, data entry, scheduling, reporting. If your team repeats it daily, we automate it. We build systems that handle the busywork so your people can focus on what actually needs a human.',
      bg: '#F0EFED',
      textColor: '#151419',
      canvasAnimation: 'helix' as const,
    },
  ];

  return (
    <section id="services" className="brutalist-border-t brutalist-border-b relative overflow-hidden bg-[#1A1A1A]">
      <div className="px-6 md:px-16 lg:px-24 pt-20 pb-12">
        <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#6b6b6b] mb-4 block">
          WHAT WE DO
        </span>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter uppercase font-display text-snow mb-6 max-w-3xl">
          One studio. Every layer of your digital business.
        </h2>
        <p className="text-base md:text-[19px] text-snow/50 max-w-2xl font-montserrat leading-relaxed">
          Most agencies sell you a website and disappear. We build the website, the systems behind it, and the strategy that makes all of it work.
        </p>
      </div>
      <div className="services-cards-wrapper" style={{ marginLeft: 88, marginRight: 0, paddingLeft: 0, paddingRight: 0, width: 'calc(100% - 88px)', overflow: 'hidden' }}>
        <style>{`
          @media (max-width: 1280px) {
            .services-cards-wrapper {
              margin-left: 72px;
              width: calc(100% - 72px);
            }
          }
          @media (max-width: 1024px) {
            .services-cards-wrapper {
              margin-left: 24px;
              width: calc(100% - 24px);
            }
          }
          @media (max-width: 640px) {
            .services-cards-wrapper {
              margin-left: 16px;
              width: calc(100% - 16px);
            }
          }
        `}</style>
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            width: '100%',
            overflow: 'hidden',
          }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {services.map((s, i) => (
            <ServiceCard
              key={i}
              {...s}
              index={i}
              flexValue={getFlexValue(i)}
              isHovered={hoveredIndex === i}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              isMobile={isMobile}
            />
          ))}
        </div>
      </div>
    </section>
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

function HowItWorks() {
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
      body: "You tell us what\u2019s going on in your business. What\u2019s working, what isn\u2019t, and what you\u2019ve been putting off. We ask hard questions and give you an honest assessment \u2014 even if the answer is that you don\u2019t need us right now.",
      pills: ["Business Audit", "Market Analysis", "Goal Mapping", "Honest Assessment"],
      accentColor: "#f56e0f",
      canvasAnimation: 'orbit' as const,
      bg: '#100c0b',
      borderTop: '#f56e0f',
    },
    {
      num: "02",
      label: "Build",
      subtitle: "You see everything as it happens.",
      body: "We handle design and development in focused sprints. You get access to a private project portal with live previews, feedback threads, and milestone tracking \u2014 so you never have to wonder what\u2019s happening with your investment.",
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
      body: "Your project goes live with thorough testing and a smooth handoff. From there, we offer ongoing maintenance, SEO, and automation \u2014 because the businesses that win online are the ones that keep showing up after launch day.",
      pills: ["QA Testing", "Smooth Handoff", "SEO Setup", "Ongoing Support"],
      accentColor: "#f56e0f",
      canvasAnimation: 'launch' as const,
      bg: '#dddddd',
      borderTop: '#f56e0f',
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
            viewport={{ once: false, margin: "-100px" }}
            className="font-montserrat text-[#f56e0f] text-xs uppercase tracking-[0.2em] mb-4 block"
          >
            [ How It Works ]
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: false, margin: "-100px" }}
            className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight dark:text-snow text-dark-void"
          >
            From first conversation<br />
            to live product.
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 120 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: false, margin: "-100px" }}
            className="mt-6 h-1 bg-[#e05a15] rounded-full"
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
    const update = () => {
      if (wrapperRef.current) {
        setDy(12 - wrapperRef.current.offsetTop);
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.15 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: false, margin: "-80px" }}
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
              color: useDarkAccentText ? 'rgba(21,20,25,0.74)' : (index === 2 ? '#1a1a1a' : 'rgba(255,255,255,0.55)'),
              textTransform: isStackedLayout ? 'none' : 'uppercase',
              letterSpacing: isStackedLayout ? '0' : '0.04em',
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
                fontSize: '0.6rem',
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

function Founder() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section ref={ref} className="relative z-[7] py-24 w-full bg-snow dark:bg-[#1a1a1a] text-dark-void dark:text-snow">
      <div className="max-w-7xl mx-auto content-gutter grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <span className="font-mono text-liquid-lava text-sm uppercase tracking-widest mb-4 block">Leadership</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-8">
            &quot;Design isn&apos;t just how it looks. It&apos;s how it functions at scale.&quot;
          </h2>
          <p className="text-slate-grey dark:text-snow/60 mb-8 text-lg">
            With over a decade of experience bridging the gap between aesthetic design and robust technical architecture, our leadership ensures every project isn&apos;t just a visual success, but a measurable business asset.
          </p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-1 bg-liquid-lava"></div>
            <div>
              <p className="font-display font-bold uppercase tracking-tight">Alex Kreative</p>
              <p className="font-mono text-sm text-dusty-grey">Founder & Creative Director</p>
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2 relative aspect-[4/5] w-full max-w-md mx-auto lg:ml-auto brutalist-border p-2">
          <div className="w-full h-full relative bg-slate-grey overflow-hidden">
            <motion.div style={{ y, height: "130%", top: "-15%" }} className="absolute w-full left-0">
              <Image
                src="https://picsum.photos/seed/founder/800/1000"
                alt="Founder"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                sizes="(max-width: 1024px) 90vw, 38vw"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InsightCard({ post, index }: { post: { category: string; title: string; readTime: string; tags: string[]; seed: string }; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href="/insights" className="group block flex flex-col h-full">
        {/* Image */}
        <div className="aspect-[4/5] w-full relative overflow-hidden mb-0 rounded-sm">
          <Image
            src={`https://picsum.photos/seed/${post.seed}/600/450`}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 28vw"
          />
          {/* Subtle dark overlay on hover */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 pt-5">
          {/* Read time */}
          <div className="flex items-center gap-3 font-mono text-xs text-dusty-grey uppercase tracking-widest mb-3">
            <span>{post.category}</span>
            <span className="h-px w-6 bg-dusty-grey/40" />
            <span>{post.readTime}</span>
          </div>

          {/* Title */}
          <h3 className="font-display text-xl md:text-2xl font-bold uppercase tracking-tight leading-snug mb-4 group-hover:text-[#F25623] transition-colors duration-300">
            {post.title}
          </h3>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-black/10 dark:border-white/10">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 bg-black/5 dark:bg-white/10 text-dark-void/60 dark:text-snow/60 rounded-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function Insights() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  const posts = [
    {
      category: "Websites",
      title: "What A Website Should Do After It Looks Good",
      readTime: "4 min read",
      tags: ["Conversion", "UX"],
      seed: "insight0"
    },
    {
      category: "Dashboards",
      title: "Dashboards Are Not Data Dumps",
      readTime: "6 min read",
      tags: ["Systems", "Operations"],
      seed: "insight1"
    },
    {
      category: "Growth",
      title: "Local SEO Is Infrastructure, Not A Checklist",
      readTime: "5 min read",
      tags: ["Search", "Automation"],
      seed: "insight2"
    }
  ];

  return (
    <section id="insights" className="py-24 content-gutter max-w-[1304px] mx-auto">
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 24 }}
        animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
      >
        <div>
          <span className="font-mono text-liquid-lava text-sm uppercase tracking-widest mb-4 block">Insights</span>
          <h2 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tighter">
            Field Notes For Digital Systems.
          </h2>
          <p className="mt-5 max-w-xl font-montserrat text-base leading-7 text-dark-void/60 dark:text-snow/60">
            Practical thinking on websites, dashboards, automation, and the decisions that make a digital business easier to run.
          </p>
        </div>
        <AnimatedTextLink
          href="/insights"
          withArrow
          className="font-mono text-sm uppercase tracking-widest text-dark-void/70 dark:text-snow"
        >
          View All
        </AnimatedTextLink>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        {posts.map((post, i) => (
          <InsightCard key={i} post={post} index={i} />
        ))}
      </div>
    </section>
  );
}

class PixelParticle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  randomDriftX: number;
  randomDriftY: number;
  color: string;

  constructor(x: number, y: number, size: number, color: string = '#F56E0F') {
    this.x = x;
    this.y = y;
    this.baseX = x;
    this.baseY = y;
    this.vx = 0;
    this.vy = 0;
    this.size = size;
    this.randomDriftX = (Math.random() - 0.5) * 2;
    this.randomDriftY = (Math.random() - 0.5) * 2;
    this.color = color;
  }

  update(mouse: { x: number, y: number }) {
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 180;

    if (distance < maxDistance && mouse.x !== -1000) {
      // Repel strongly
      const force = (maxDistance - distance) / maxDistance;
      const angle = Math.atan2(dy, dx);

      // Add some chaos to the explosion
      const scatterX = Math.cos(angle) * force * 10 + this.randomDriftX * force * 5;
      const scatterY = Math.sin(angle) * force * 10 + this.randomDriftY * force * 5;

      this.vx -= scatterX;
      this.vy -= scatterY;
    }

    // Spring back to base position
    this.vx += (this.baseX - this.x) * 0.08;
    this.vy += (this.baseY - this.y) * 0.08;

    // Friction
    this.vx *= 0.82;
    this.vy *= 0.82;

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
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
];

function BusinessHeroSection() {
  return <FeaturedBuildsSection />;
}

function FeaturedBuildsSection() {
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
            <h2 className="mt-5 max-w-xl font-playfair text-4xl font-bold leading-[1.02] tracking-tight text-[#151419] dark:text-snow md:text-6xl lg:text-[4.8rem]">
              Recent builds with the system underneath.
            </h2>
            <p className="mt-6 max-w-md font-montserrat text-base leading-8 text-[#6b6b6b] dark:text-snow/60 md:text-lg">
              Two client projects shown as working digital infrastructure: one coaching platform built for trust and service conversion, one industrial site built for technical credibility and qualified enquiries.
            </p>
            <p className="hidden">
              For founders, professional practices, and engineering teams across South Africa — work built to be used, not just admired.
            </p>
            <div className="mt-10 grid max-w-md grid-cols-2 gap-3 font-montserrat">
              <div className="border border-[#151419]/10 bg-white/55 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#878787]">Projects</span>
                <span className="mt-2 block font-mono text-3xl text-[#151419] dark:text-white">02</span>
              </div>
              <div className="border border-[#151419]/10 bg-white/55 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#878787]">Scope</span>
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

          <div className="space-y-8 lg:space-y-12 lg:pb-[24vh]">
            {featuredBuilds.map((build, index) => (
              <FeaturedBuildCard key={build.id} build={build} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedBuildCard({ build, index }: { build: FeaturedBuild; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden border border-[#151419]/10 bg-[#F8F7F4] shadow-[0_28px_90px_rgba(21,20,25,0.14)] dark:border-white/10 dark:bg-[#151419] lg:sticky"
      style={{ top: `${96 + index * 18}px`, zIndex: 10 + index }}
    >
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: `linear-gradient(90deg, ${build.accent}, transparent)` }}
      />
      <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[0.82fr_1.18fr] lg:p-8 xl:p-10">
        <div className="flex min-h-full flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 font-montserrat">
              <span className="font-mono text-sm text-[#878787]">{build.id}</span>
              <span
                className="rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{ borderColor: `${build.accent}55`, color: build.accent }}
              >
                Featured build
              </span>
            </div>
            <p className="mt-8 font-montserrat text-xs font-semibold uppercase tracking-[0.24em] text-[#878787]">
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
                quality={88}
                priority={index === 0}
                className="w-full max-w-none origin-top object-top transition-transform duration-[6500ms] ease-linear group-hover:-translate-y-[62%] motion-reduce:transform-none"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#151419]/80 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

const testimonialItems = [
  {
    quote: 'A warm coaching brand became a guided service platform with diagnostics, paid pathways, booking, intake, and resources working together.',
    author: 'Coach Kagiso',
    role: 'Career coaching platform',
    company: 'Personal brand and service conversion',
  },
  {
    quote: 'A technical engineering business now has a sharper digital presence for safety-critical services, quote requests, and risk-assessment leads.',
    author: 'Touch Teq Engineering',
    role: 'Industrial website and lead flow',
    company: 'Engineering and B2B enquiries',
  },
  {
    quote: 'Both builds go beyond brochure pages: they connect public trust, lead capture, booking, and private operational workflows.',
    author: 'Kreative Reflow',
    role: 'Website plus workflow systems',
    company: 'Digital infrastructure',
  },
];

function Testimonial() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useSpring(mouseX, { damping: 25, stiffness: 200 });
  const y = useSpring(mouseY, { damping: 25, stiffness: 200 });
  const numberX = useTransform(x, [-200, 200], [-18, 18]);
  const numberY = useTransform(y, [-200, 200], [-10, 10]);

  const goNext = () => setActiveIndex((prev) => (prev + 1) % testimonialItems.length);
  const goPrev = () => setActiveIndex((prev) => (prev - 1 + testimonialItems.length) % testimonialItems.length);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    mouseX.set(event.clientX - (rect.left + rect.width / 2));
    mouseY.set(event.clientY - (rect.top + rect.height / 2));
  };

  const current = testimonialItems[activeIndex];

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
              className="font-montserrat text-[11px] uppercase tracking-[0.22em] text-[#878787] md:[writing-mode:vertical-rl]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.45 }}
            >
              Proof notes
            </motion.span>
            <div className="relative h-px flex-1 bg-[#151419]/14 dark:bg-white/14 md:h-36 md:w-px md:flex-none">
              <motion.div
                className="absolute left-0 top-0 h-full bg-[#FC6E20] md:w-full"
                animate={{
                  width: `${((activeIndex + 1) / testimonialItems.length) * 100}%`,
                  height: `${((activeIndex + 1) / testimonialItems.length) * 100}%`,
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
                <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#151419]/12 px-3 py-1 font-montserrat text-[11px] uppercase tracking-[0.16em] text-[#878787] dark:border-white/14">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FC6E20]" />
                  {current.company}
                </span>
              </motion.div>
            </AnimatePresence>

            <div className="relative mb-10 min-h-[150px] sm:min-h-[170px] lg:min-h-[200px]">
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={`quote-${activeIndex}`}
                  className="max-w-4xl font-playfair text-4xl font-semibold leading-[1.12] tracking-normal text-[#151419] dark:text-white sm:text-5xl lg:text-6xl"
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
                  transition={{ duration: prefersReducedMotion ? 0.18 : 0.38, ease: [0.22, 1, 0.36, 1] }}
                >
                  {current.quote}
                </motion.blockquote>
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
                    <p className="font-montserrat text-sm font-semibold text-[#151419] dark:text-white">{current.author}</p>
                    <p className="mt-1 font-montserrat text-sm text-[#878787]">{current.role}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center gap-3">
                <motion.button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous testimonial"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#151419]/15 text-[#151419] transition hover:border-[#FC6E20] hover:text-[#FC6E20] dark:border-white/15 dark:text-white"
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft className="h-4 w-4" />
                </motion.button>
                <motion.button
                  type="button"
                  onClick={goNext}
                  aria-label="Next testimonial"
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

function GeometricSpotlightContent() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 md:p-12 text-center relative">
      <div className="absolute top-12 content-gutter left-0 right-0 z-20 text-left">
        <span className="font-mono text-sm uppercase tracking-widest mb-2 block">Interactive Demo 02</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tighter">
          Geometric Spotlight
        </h2>
        <p className="mt-4 max-w-sm font-mono text-sm">
          Hover to reveal the hidden manifesto. Sharp contrast, brutalist reveal.
        </p>
      </div>

      <div className="max-w-6xl mx-auto mt-20 relative w-full">
        {/* Wireframe background graphic */}
        <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.2" />
          <line x1="100" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="0.2" />
          <rect x="10" y="10" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="0.2" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.2" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.2" strokeDasharray="2 2" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.2" strokeDasharray="2 2" />
        </svg>

        <h3 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] leading-[0.85] font-bold uppercase tracking-tighter relative z-10">
          We Forge <br />
          The Unseen <br />
          Architecture
        </h3>
        <p className="font-mono text-lg md:text-2xl mt-12 uppercase tracking-widest relative z-10 max-w-3xl mx-auto">
          Design is not just what it looks like. <br /> It is how it works at scale.
        </p>
      </div>
    </div>
  );
}

function GeometricSpotlightDemo() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const sectionRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -1000, y: -1000 });
  };

  const spotlightSize = 300; // 300x300 square spotlight
  const clipPath = `polygon(
    ${mousePos.x - spotlightSize / 2}px ${mousePos.y - spotlightSize / 2}px, 
    ${mousePos.x + spotlightSize / 2}px ${mousePos.y - spotlightSize / 2}px, 
    ${mousePos.x + spotlightSize / 2}px ${mousePos.y + spotlightSize / 2}px, 
    ${mousePos.x - spotlightSize / 2}px ${mousePos.y + spotlightSize / 2}px
  )`;

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-[80vh] bg-dark-void overflow-hidden cursor-crosshair brutalist-border-t"
    >
      {/* Base Layer (Dark, hidden text) */}
      <div className="absolute inset-0 w-full h-full bg-dark-void text-gluon-grey">
        <GeometricSpotlightContent />
      </div>

      {/* Spotlight Layer (Light, revealed text) */}
      <div
        className="absolute inset-0 w-full h-full bg-snow text-liquid-lava pointer-events-none"
        style={{
          clipPath: mousePos.x === -1000 ? 'polygon(0 0, 0 0, 0 0, 0 0)' : clipPath,
          WebkitClipPath: mousePos.x === -1000 ? 'polygon(0 0, 0 0, 0 0, 0 0)' : clipPath
        }}
      >
        <GeometricSpotlightContent />
      </div>
    </section>
  );
}

function DataStreamDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const mouseRef = useRef(mousePos);

  useEffect(() => {
    mouseRef.current = mousePos;
  }, [mousePos]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -1000, y: -1000 });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const fontSize = 16;
    let cols = 0;
    let rows = 0;
    let grid: { char: string; targetChar: string }[][] = [];

    const chars = '0123456789ABCDEF@#$%&*+=-/\\';
    const hiddenMessage = "[KREATIVE_REFLOW] // [AI_INTEGRATION] // [SYSTEM_ARCHITECTURE] // [DATA_PIPELINES] // [SCALE_INFINITE] // ";

    const init = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      // Use standard monospace as fallback, JetBrains Mono if loaded
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;
      ctx.textBaseline = 'top';

      cols = Math.floor(rect.width / fontSize) + 1;
      rows = Math.floor(rect.height / fontSize) + 1;

      grid = [];
      for (let i = 0; i < cols; i++) {
        grid[i] = [];
        for (let j = 0; j < rows; j++) {
          const charIndex = (j * cols + i) % hiddenMessage.length;
          grid[i][j] = {
            char: chars[Math.floor(Math.random() * chars.length)],
            targetChar: hiddenMessage[charIndex]
          };
        }
      }
    };

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const mouse = mouseRef.current;
      const decoderSize = 120; // 240x240 square decoder

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * fontSize;
          const y = j * fontSize;

          // Check if within the square decoder area
          const inDecoder = Math.abs(x + fontSize / 2 - mouse.x) < decoderSize &&
            Math.abs(y + fontSize / 2 - mouse.y) < decoderSize;

          if (inDecoder) {
            ctx.fillStyle = '#F56E0F'; // Liquid Lava
            ctx.globalAlpha = 1.0;
            ctx.fillText(grid[i][j].targetChar, x, y);
          } else {
            // Randomly mutate background characters
            if (Math.random() < 0.05) {
              grid[i][j].char = chars[Math.floor(Math.random() * chars.length)];
            }
            ctx.fillStyle = '#878787'; // Dusty Grey
            ctx.globalAlpha = 0.2; // Keep it very dim
            ctx.fillText(grid[i][j].char, x, y);
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    // Start animation immediately
    animate();

    window.addEventListener('resize', init);

    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="py-32 relative w-full min-h-[80vh] flex flex-col items-center justify-center bg-dark-void brutalist-border-t overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
      />
    </section>
  );
}

class NodeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 1.5 + 0.5;
  }

  update(width: number, height: number) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0) { this.x = 0; this.vx *= -1; }
    if (this.x > width) { this.x = width; this.vx *= -1; }
    if (this.y < 0) { this.y = 0; this.vy *= -1; }
    if (this.y > height) { this.y = height; this.vy *= -1; }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#878787'; // Dusty Grey
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function ConstellationDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const mouseRef = useRef(mousePos);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1.4]);

  useEffect(() => {
    mouseRef.current = mousePos;
  }, [mousePos]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -1000, y: -1000 });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: NodeParticle[] = [];

    const init = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      particles = [];
      // Responsive particle count based on screen size
      const numParticles = Math.floor((rect.width * rect.height) / 9000);
      for (let i = 0; i < numParticles; i++) {
        particles.push(new NodeParticle(rect.width, rect.height));
      }
    };

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const mouse = mouseRef.current;
      const hoverRadius = 250;
      const connectDist = 120;

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(rect.width, rect.height);
        particles[i].draw(ctx);

        const dxMouse = mouse.x - particles[i].x;
        const dyMouse = mouse.y - particles[i].y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        // Only draw connections if the particle is near the mouse
        if (distMouse < hoverRadius) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < connectDist) {
              // Opacity fades out based on distance to mouse AND distance between particles
              const opacity = Math.max(0, (1 - distMouse / hoverRadius) * (1 - dist / connectDist));
              ctx.beginPath();
              ctx.strokeStyle = `rgba(245, 110, 15, ${opacity})`; // Liquid Lava
              ctx.lineWidth = 1;
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    window.addEventListener('resize', init);

    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="py-32 relative w-full min-h-[80vh] flex flex-col items-center justify-center bg-gluon-grey brutalist-border-t overflow-hidden"
    >
      <div className="absolute top-12 content-gutter left-0 right-0 z-10 pointer-events-none">
        <div className="inline-block bg-gluon-grey/80 p-4 brutalist-border backdrop-blur-sm">
          <span className="font-mono text-liquid-lava text-sm uppercase tracking-widest mb-2 block">Interactive Demo 04</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tighter text-snow">
            The Constellation
          </h2>
          <p className="text-dusty-grey mt-4 max-w-sm font-mono text-sm">
            Scroll to zoom into the network. Hover to form neural connections between the floating nodes.
          </p>
        </div>
      </div>

      <motion.canvas
        ref={canvasRef}
        style={{
          scale,
          transformOrigin: mousePos.x !== -1000 ? `${mousePos.x}px ${mousePos.y}px` : '50% 50%'
        }}
        className="absolute inset-0 w-full h-full cursor-crosshair"
      />
    </section>
  );
}

function TorusKnotDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isHoveredRef = useRef(isHovered);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const init = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const scrollVal = scrollYProgress.get();

      if (!isHoveredRef.current) {
        time += 0.005; // Rotation speed
      }

      // Unwind effect based on scroll
      const R = 120 + scrollVal * 300; // Major radius expands
      const r = 50 + scrollVal * 150;  // Minor radius expands
      const p = 3 + scrollVal * 2;     // Complexity increases
      const q = 4 + scrollVal * 5;
      const maxTheta = Math.PI * 2 * (1 + scrollVal * 15); // Loop gets longer

      const numDots = Math.floor(1500 + scrollVal * 2000);

      const dots = [];

      for (let i = 0; i < numDots; i++) {
        const theta = (i / numDots) * maxTheta;

        // Torus knot parametric equations
        const x0 = (R + r * Math.cos(q * theta)) * Math.cos(p * theta);
        const y0 = (R + r * Math.cos(q * theta)) * Math.sin(p * theta);
        const z0 = r * Math.sin(q * theta);

        // 3D Rotation
        const cosT = Math.cos(time);
        const sinT = Math.sin(time);

        // Rotate around Y axis
        const x1 = x0 * cosT - z0 * sinT;
        const z1 = x0 * sinT + z0 * cosT;

        // Rotate around X axis
        const y2 = y0 * cosT - z1 * sinT;
        const z2 = y0 * sinT + z1 * cosT;

        const x2 = x1;

        // Perspective projection
        const perspective = 800 / (800 + z2);
        const xProj = centerX + x2 * perspective;
        const yProj = centerY + y2 * perspective;
        const size = Math.max(0.5, 2.5 * perspective);

        dots.push({ x: xProj, y: yProj, z: z2, size, theta });
      }

      // Sort by Z-index for pseudo-3D depth rendering
      dots.sort((a, b) => b.z - a.z);

      for (const dot of dots) {
        // Alternate colors along the knot
        const isLava = (dot.theta / (Math.PI / 2)) % 2 < 1;
        ctx.fillStyle = isLava ? '#F56E0F' : '#878787'; // Liquid Lava or Dusty Grey

        // Depth fading
        const alpha = Math.max(0.1, Math.min(1, (dot.z + 400) / 800));
        ctx.globalAlpha = alpha;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    window.addEventListener('resize', init);

    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrameId);
    };
  }, [scrollYProgress]);

  return (
    <section
      ref={sectionRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="py-32 relative w-full min-h-[120vh] flex flex-col items-center justify-center bg-dark-void brutalist-border-t overflow-hidden cursor-crosshair"
    >
      <div className="absolute top-12 content-gutter left-0 right-0 z-10 pointer-events-none">
        <div className="inline-block bg-dark-void/80 p-4 brutalist-border backdrop-blur-sm">
          <span className="font-mono text-liquid-lava text-sm uppercase tracking-widest mb-2 block">Interactive Demo 05</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tighter text-snow">
            The Torus Knot
          </h2>
          <p className="text-dusty-grey mt-4 max-w-sm font-mono text-sm">
            Scroll to unwind the knot into infinite complexity. Hover to freeze the mathematical flow in place.
          </p>
        </div>
      </div>

      <div className="sticky top-0 w-full h-screen">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </section>
  );
}

class MagneticParticle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.baseX = x;
    this.baseY = y;
    this.vx = 0;
    this.vy = 0;
    this.size = 1.5;
    this.color = color;
  }

  update(mouse: { x: number, y: number }, scrollVelocity: number, width: number, height: number) {
    // Constant vertical drift
    this.baseY -= 0.5;
    if (this.baseY < -20) {
      this.baseY = height + 20;
      this.y = this.baseY;
    }

    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = 200;

    if (distance < maxDistance && mouse.x !== -1000) {
      const force = (maxDistance - distance) / maxDistance;
      // Repulsion
      this.vx -= (dx / distance) * force * 4;
      this.vy -= (dy / distance) * force * 4;
    }

    // Spring back to base
    this.vx += (this.baseX - this.x) * 0.1;
    this.vy += (this.baseY - this.y) * 0.1;

    // Friction
    this.vx *= 0.8;
    this.vy *= 0.8;

    // Jitter based on scroll velocity
    const jitter = Math.min(Math.abs(scrollVelocity) * 0.15, 8);
    const jitterX = (Math.random() - 0.5) * jitter;
    const jitterY = (Math.random() - 0.5) * jitter;

    this.x += this.vx + jitterX;
    this.y += this.vy + jitterY;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function MagneticFieldDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const mouseRef = useRef(mousePos);

  useEffect(() => {
    mouseRef.current = mousePos;
  }, [mousePos]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -1000, y: -1000 });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: MagneticParticle[] = [];
    let lastScrollY = window.scrollY;
    let smoothedScrollVelocity = 0;

    const init = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      particles = [];
      const spacing = 25;
      const cols = Math.floor(rect.width / spacing) + 2;
      const rows = Math.floor(rect.height / spacing) + 2;

      for (let i = -1; i < cols; i++) {
        for (let j = -1; j < rows; j++) {
          const x = i * spacing;
          const y = j * spacing;
          // Mix of Dusty Grey and Liquid Lava
          const color = Math.random() > 0.95 ? '#F56E0F' : '#878787';
          particles.push(new MagneticParticle(x, y, color));
        }
      }
    };

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Calculate scroll velocity
      const currentScrollY = window.scrollY;
      const rawVelocity = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // Smooth the velocity
      smoothedScrollVelocity += (rawVelocity - smoothedScrollVelocity) * 0.1;

      const mouse = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(mouse, smoothedScrollVelocity, rect.width, rect.height);
        particles[i].draw(ctx);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    window.addEventListener('resize', init);

    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="py-32 relative w-full min-h-[80vh] flex flex-col items-center justify-center bg-gluon-grey brutalist-border-t overflow-hidden"
    >
      <div className="absolute top-12 content-gutter left-0 right-0 z-10 pointer-events-none">
        <div className="inline-block bg-gluon-grey/80 p-4 brutalist-border backdrop-blur-sm">
          <span className="font-mono text-liquid-lava text-sm uppercase tracking-widest mb-2 block">Interactive Demo 06</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tighter text-snow">
            Magnetic Field
          </h2>
          <p className="text-dusty-grey mt-4 max-w-sm font-mono text-sm">
            Scroll fast to agitate the high-frequency data grid. Hover to repel the digital fabric.
          </p>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
      />
    </section>
  );
}

function BusinessHeroSection2() {
  return (
    <section className="w-full bg-[#F0EFED] overflow-hidden relative">
      {/* Dark overlay on right side with clip path */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[#1a1a1a] hidden md:block" style={{ clipPath: 'polygon(55% 0, 95% 0, 95% 55%, 55% 55%)' }} />

      {/* Black lines - visible on light background */}
      <div className="absolute inset-0 pointer-events-none z-0 hidden md:block">
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

      {/* White lines - visible on dark background */}
      <div className="absolute inset-0 pointer-events-none z-0 hidden md:block" style={{ clipPath: 'polygon(55% 0, 95% 0, 95% 55%, 55% 55%)' }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 border-l"
            style={{
              left: `${(i / 7) * 100}%`,
              borderColor: "rgba(255, 255, 255, 0.1)",
            }}
          />
        ))}
      </div>
      <div className="w-full content-gutter relative z-10">
        <div className="px-[3%] flex flex-col md:flex-row items-start gap-8 md:gap-12">
          {/* Left: headline + subtitle */}
          <div className="flex-1 flex flex-col justify-center py-12 md:py-20 lg:py-28 pr-4 lg:pr-12" style={{ transform: 'translateY(5%)' }}>
            <span className="font-montserrat text-xs uppercase tracking-[0.2em] text-[#FC6E20] mb-4">
              [ WHAT WE&apos;VE BUILT ]
            </span>
            <h2 className="font-playfair text-4xl md:text-5xl lg:text-[4.2rem] font-bold text-[#1a1a1a] tracking-tight max-w-xl leading-[1.1]">
              Websites, SaaS, and automations that actually get used.
            </h2>
            <p className="mt-6 text-[#6b6b6b] text-base md:text-lg leading-relaxed max-w-md font-montserrat">
              For founders, professional practices, and engineering teams across South Africa — work built to be used, not just admired.
            </p>
          </div>

          {/* Right: text on dark background */}
          <div className="hidden md:flex flex-1 p-10 md:p-14 lg:p-20 justify-center mt-10" style={{ transform: 'translateY(10%)' }}>
            <p className="text-[#9a9a9a] text-base md:text-lg leading-relaxed font-montserrat max-w-sm">
              Every project starts with{" "}
              <strong className="text-white font-semibold">understanding your goals</strong>
              , then we build{" "}
              <strong className="text-white font-semibold">solutions tailored</strong>{" "}
              to help you{" "}
              <strong className="text-white font-semibold">succeed.</strong>
            </p>
          </div>

          {/* Mobile: full-width dark section below */}
          <div className="md:hidden w-full bg-[#1a1a1a] p-8">
            <p className="text-[#9a9a9a] text-base leading-relaxed font-sans">
              Every project starts with{" "}
              <strong className="text-white font-semibold">understanding your goals</strong>
              , then we build{" "}
              <strong className="text-white font-semibold">solutions tailored</strong>{" "}
              to help you{" "}
              <strong className="text-white font-semibold">succeed.</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
