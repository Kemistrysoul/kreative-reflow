"use client";

import { useRef, useState } from "react";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionValueEvent } from "motion/react";
import { AnimatePresence } from "motion/react";

const ITEMS = [
  { 
    name: "SERVICE BUSINESSES", 
    desc: "If your business runs on relationships and reputation, your website should do the same. We build lead-generating, trust-building digital presences for professional service firms." 
  },
  { 
    name: "ENGINEERING FIRMS", 
    desc: "Technical credibility deserves a technical presence. We build project portfolios, tender-ready sites, and client dashboards for engineering businesses." 
  },
  { 
    name: "MEDICAL PRACTICES", 
    desc: "From specialist surgeries to dental clinics — we build patient-facing websites and practice management systems that reflect the precision of your work." 
  },
  { 
    name: "SAAS FOUNDERS", 
    desc: "From MVP to market. We design and build SaaS products, marketing sites, and onboarding flows that turn signups into paying users." 
  },
  { 
    name: "RETAIL & E-COMMERCE", 
    desc: "Product-first design that converts browsers into buyers. We build fast, beautiful online stores and product experiences that sell." 
  },
  { 
    name: "LEGAL & PROFESSIONAL", 
    desc: "Authority and trust are your competitive advantage. We build digital presences that communicate both, instantly." 
  },
];

export default function DottedSection() {
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 35,
    restDelta: 0.001
  });

  // Hold list while heading enters, release so item 0 rises in as heading fades out
  const listY = useTransform(smoothProgress, [0, 0.13, 0.22, 0.9, 1], ["50vh", "50vh", "-12vh", "-350vh", "-400vh"]);

  // Header: enters from below after background settles, then exits upward
  const headerY = useTransform(smoothProgress, [0, 0.08, 0.22], ["30vh", "0vh", "-80vh"]);
  const headerOpacity = useTransform(smoothProgress, [0, 0.06, 0.13, 0.22], [0, 1, 1, 0]);

  return (
    <section 
      ref={sectionRef} 
      className="relative z-[5] w-full bg-[#F0EFED] dark:bg-[#1a1a1a]"
      style={{ height: '450vh', marginBottom: '-220vh' }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <DottedSurface className="inset-0" sectionRef={sectionRef} />

        {/* Header content */}
        <motion.div 
          style={{ y: headerY, opacity: headerOpacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="w-full max-w-4xl px-6 text-center">
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#6b6b6b] dark:text-snow/50 mb-4 block">
              OUR FOCUS
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter uppercase font-display text-dark-void dark:text-snow mb-6">
              WE BUILD FOR INDUSTRIES<br className="hidden md:block" /> THAT DEMAND PRECISION.
            </h2>
            <p className="text-base md:text-lg text-[#6b6b6b] dark:text-snow/60 max-w-2xl mx-auto font-sans leading-relaxed">
              From medical practices to engineering firms, from SaaS founders to service businesses — we build digital infrastructure that matches the complexity of the work you do.
            </p>
          </div>
        </motion.div>

        {/* List Container */}
        <motion.div 
          style={{ y: listY }}
          className="absolute inset-x-0 top-0 flex flex-col items-center gap-18 md:gap-18"
        >
          <div className="h-[60vh]" /> 
          
          {ITEMS.map((item, index) => (
            <Item 
              key={index} 
              item={item} 
              sectionProgress={smoothProgress} 
            />
          ))}
          <div className="h-[20vh]" />
        </motion.div>
      </div>
    </section>
  );
}

function Item({ item, sectionProgress }: { item: typeof ITEMS[0], sectionProgress: any }) {
  const [isHovered, setIsHovered] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const opacity = useMotionValue(0.05);

  // Restore the real-time distance-based focal lens logic
  useMotionValueEvent(sectionProgress, "change", () => {
    if (!itemRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const itemCenter = rect.top + rect.height / 2;
    const viewportCenter = window.innerHeight / 2;
    const distance = itemCenter - viewportCenter;

    let newOpacity: number;
    if (distance > 0) {
      // Below center
      const fadeInRange = window.innerHeight * 0.35;
      newOpacity = Math.max(0.1, 1 - distance / fadeInRange);
    } else {
      // Above center
      const fadeOutRange = window.innerHeight * 0.6;
      newOpacity = Math.max(0.1, 1 - Math.abs(distance) / fadeOutRange);
    }
    opacity.set(newOpacity);
  });

  return (
    <motion.div
      ref={itemRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        opacity,
      }}
      className="relative flex flex-col items-center justify-center text-center cursor-pointer group"
    >
      {/* Focal Brackets */}
      <div className={`absolute -inset-x-12 -inset-y-4 transition-all duration-500 opacity-0 group-hover:opacity-100`}>
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#b99b69]" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#b99b69]" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#b99b69]" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#b99b69]" />
      </div>

      <h3 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter uppercase font-display text-dark-void dark:text-snow selection:bg-none transition-colors duration-300">
        {item.name}
      </h3>

      {/* Description revealed on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: 10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: 10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="mt-6 text-base md:text-lg text-[#6b6b6b] dark:text-snow/60 max-w-md font-sans leading-relaxed">
              {item.desc}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
