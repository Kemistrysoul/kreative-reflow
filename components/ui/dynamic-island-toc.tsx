'use client';

import { AnimatePresence, motion, type Transition } from 'motion/react';
import { X } from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type HeadingData = {
  id: string;
  text: string;
  level: number;
  element: HTMLElement;
};

const islandTransition: Transition = {
  type: 'tween',
  ease: [0.22, 1, 0.36, 1],
  duration: 0.5,
};

function CircleProgress({ percentage }: { percentage: number }) {
  const size = 24;
  const strokeWidth = 2.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90 shrink-0" aria-hidden="true">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        className="stroke-[#151419]/15 dark:stroke-[#FBFBFB]/18"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        strokeLinecap="round"
        className="stroke-[#FC6E20]"
      />
    </svg>
  );
}

type DynamicIslandTOCProps = {
  children?: ReactNode;
  selector?: string;
};

export function DynamicIslandTOC({
  children,
  selector = 'article h1, article h2, article h3, article h4, .prose h1, .prose h2, .prose h3, .prose h4, [data-toc]',
}: DynamicIslandTOCProps) {
  const [headings, setHeadings] = useState<HeadingData[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const getHeadings = () => {
      const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[];

      const validHeadings = elements
        .filter((el) => !el.hasAttribute('data-toc-ignore'))
        .map((el, index) => {
          if (!el.id) {
            const generatedId =
              el.textContent
                ?.toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w-]/g, '') || `toc-heading-${index}`;
            el.id = generatedId;
          }

          const depthAttr = el.getAttribute('data-toc-depth');
          let level = 2;

          if (depthAttr) {
            level = Number.parseInt(depthAttr, 10);
          } else {
            const tagName = el.tagName.toUpperCase();
            if (tagName.startsWith('H') && tagName.length === 2) {
              level = Number.parseInt(tagName[1], 10);
            }
          }

          const text = el.getAttribute('data-toc-title') || el.textContent || 'Section';

          return { id: el.id, text, level, element: el };
        });

      validHeadings.sort((a, b) =>
        a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
      );

      setHeadings(validHeadings);
    };

    const timer = window.setTimeout(getHeadings, 100);
    return () => window.clearTimeout(timer);
  }, [selector]);

  useEffect(() => {
    const handleScroll = () => {
      let currentActiveId: string | null = null;

      for (const heading of headings) {
        const top = heading.element.getBoundingClientRect().top;
        if (top <= 120) {
          currentActiveId = heading.id;
        } else {
          break;
        }
      }

      if (!currentActiveId && headings.length > 0) {
        currentActiveId = headings[0].id;
      }

      setActiveId(currentActiveId);

      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(100, Math.max(0, (window.scrollY / total) * 100)) : 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const activeHeading = headings.find((h) => h.id === activeId);

  const minLevel = useMemo(() => {
    if (headings.length === 0) return 1;
    return Math.min(...headings.map((h) => h.level));
  }, [headings]);

  if (headings.length === 0) {
    return <>{children}</>;
  }

  return (
    <>
      {children}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={islandTransition}
            className="fixed inset-0 z-[9998] bg-[#151419]/25 backdrop-blur-[4px]"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ x: '-50%', y: 50, opacity: 0 }}
        animate={{ x: '-50%', y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="fixed bottom-6 left-1/2 z-[9999] flex max-w-[calc(100vw-2rem)] flex-col items-center sm:bottom-[30px]"
      >
        <motion.div
          data-testid="dynamic-island-toc"
          onClick={() => {
            if (!isExpanded) setIsExpanded(true);
          }}
          initial={false}
          animate={{
            width: isExpanded ? 340 : 280,
            height: isExpanded ? 400 : 52,
            borderRadius: isExpanded ? 24 : 26,
          }}
          transition={islandTransition}
          style={{ cursor: isExpanded ? 'default' : 'pointer' }}
          className="relative max-w-[calc(100vw-2rem)] overflow-hidden border border-[#151419]/10 bg-[#F0EFED] text-[#151419] shadow-2xl shadow-[#151419]/18 dark:border-[#FBFBFB]/10 dark:bg-[#151419] dark:text-[#FBFBFB]"
        >
          <motion.div
            initial={false}
            animate={{
              opacity: isExpanded ? 0 : 1,
              scale: isExpanded ? 0.95 : 1,
              filter: isExpanded ? 'blur(4px)' : 'blur(0px)',
            }}
            transition={{ ...islandTransition, delay: isExpanded ? 0 : 0.1 }}
            className={cn('absolute inset-0 flex items-center gap-4 px-4 sm:px-5', isExpanded && 'pointer-events-none')}
          >
            <div className="h-2 w-2 shrink-0 rounded-full bg-[#FC6E20]" />

            <div className="relative flex h-full flex-1 items-center overflow-hidden text-left">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={activeId || 'empty'}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="block w-full overflow-hidden text-ellipsis whitespace-nowrap font-montserrat text-sm font-semibold text-[#151419] dark:text-[#FBFBFB]"
                >
                  {activeHeading?.text || 'Contents'}
                </motion.span>
              </AnimatePresence>
            </div>

            <CircleProgress percentage={progress} />
          </motion.div>

          <motion.div
            initial={false}
            animate={{
              opacity: isExpanded ? 1 : 0,
              scale: isExpanded ? 1 : 1.05,
            }}
            transition={{ ...islandTransition, delay: isExpanded ? 0.1 : 0 }}
            className={cn('absolute inset-0 flex flex-col', !isExpanded && 'pointer-events-none')}
          >
            <div className="flex shrink-0 items-center justify-between px-6 pb-3 pt-5">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#878787]">
                Table of contents
              </span>
              <button
                type="button"
                aria-label="Close table of contents"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                className="text-[#878787] transition-colors hover:text-[#FC6E20]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-3 pb-4" data-lenis-prevent="true">
              <div className="flex flex-col gap-0.5">
                {headings.map((h) => {
                  const isActive = activeId === h.id;
                  const isHovered = hoveredId === h.id;
                  const indentLevel = Math.max(0, h.level - minLevel);
                  const paddingLeft = indentLevel * 14 + 12;

                  return (
                    <button
                      type="button"
                      key={h.id}
                      onMouseEnter={() => setHoveredId(h.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        const yOffset = -80;
                        const y = h.element.getBoundingClientRect().top + window.scrollY + yOffset;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                        setIsExpanded(false);
                      }}
                      style={{ paddingLeft: `${paddingLeft}px` }}
                      className={cn(
                        'group flex w-full shrink-0 cursor-pointer items-center rounded-lg border-none py-2 pr-3 text-left font-montserrat text-sm transition-all duration-300 ease-out',
                        isActive && 'bg-[#FC6E20]/13 font-semibold text-[#151419] dark:text-[#FBFBFB]',
                        !isActive && isHovered && 'bg-[#151419]/5 text-[#151419]/85 dark:bg-[#FBFBFB]/7 dark:text-[#FBFBFB]/85',
                        !isActive && !isHovered && 'bg-transparent text-[#151419]/45 dark:text-[#FBFBFB]/45',
                      )}
                    >
                      <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap transition-transform duration-300 group-hover:translate-x-1">
                        {h.text}
                      </span>

                      <motion.div
                        initial={false}
                        animate={{ scale: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="ml-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FC6E20]"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}
