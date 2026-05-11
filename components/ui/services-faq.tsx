'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { CrystallineCube } from '@/components/ui/crystalline-cube';

const FAQ_CATEGORIES = [
  {
    category: 'GETTING STARTED',
    items: [
      {
        id: '1',
        title: 'How do I know which service is right for me?',
        content:
          "Start with a free 30-minute discovery call. We'll talk through your business, your goals, and what's been holding you back — and you'll get an honest recommendation, even if the answer isn't one of our services.",
      },
      {
        id: '2',
        title: 'What does the process look like from first contact to launch?',
        content:
          "It starts with a conversation, then a clear proposal with fixed scope and pricing. Once you're in, we move through design, development, and testing — all tracked through a private client portal so you can see progress in real time. We launch when it's ready, not when it's rushed.",
      },
    ],
  },
  {
    category: 'WORKING TOGETHER',
    items: [
      {
        id: '3',
        title: 'Who will I actually be working with?',
        content:
          "The founder. Kreative Reflow is a boutique, founder-led studio — you'll have direct contact from day one. The person you speak to in the first call is the person designing, building, and delivering your project.",
      },
      {
        id: '4',
        title: 'How do you keep me updated on progress?',
        content:
          "We use a shared project dashboard where you can see the roadmap, completed tasks, and upcoming milestones. You'll also have a direct line for quick updates, and we hold regular check-ins to ensure everything is aligned with your vision.",
      },
      {
        id: '5',
        title: 'Where are you based, and do you work with clients outside Johannesburg?',
        content:
          "We are based in Johannesburg, South Africa, but we work with clients globally. Our processes are designed for seamless remote collaboration, using the best tools for communication and project management regardless of time zones.",
      },
    ],
  },
  {
    category: 'PRICING & TIMELINES',
    items: [
      {
        id: '6',
        title: 'How much should I budget?',
        content:
          "Most custom websites start from £2,500 depending on scope and complexity. You'll receive a clear, fixed-price proposal before we start — no hidden fees, no scope creep, no surprise invoices.",
      },
      {
        id: '7',
        title: 'How long does a project take?',
        content:
          "A custom website typically takes 4–6 weeks from kickoff to launch. SaaS applications and automation systems take longer depending on complexity. You'll get a realistic timeline upfront.",
      },
    ],
  },
  {
    category: 'AFTER LAUNCH',
    items: [
      {
        id: '8',
        title: 'What happens after my site goes live?',
        content:
          "We don't disappear. Monthly maintenance and support plans keep your site secure, fast, and up to date. That includes security patches, performance monitoring, and content updates whenever you need them.",
      },
      {
        id: '9',
        title: 'Do I own my website and all the assets?',
        content:
          "Yes — 100%. Everything built for you is yours. The code, the design files, the content. No licensing fees, no platform lock-in, no strings attached.",
      },
    ],
  },
];

export function ServicesFaq() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: -9999, y: -9999, active: false });
  const [sectionSize, setSectionSize] = useState({ width: 0, height: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setSectionSize((current) => {
      if (current.width === rect.width && current.height === rect.height) {
        return current;
      }

      return { width: rect.width, height: rect.height };
    });
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -9999, y: -9999, active: false });
  };

  return (
    <section 
      ref={sectionRef}
      className="bg-[#1A1A1A] overflow-hidden relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Desktop Absolute Cube ── */}
      <div className="hidden lg:flex absolute inset-0 pointer-events-none items-center justify-center z-0">
        <div className="opacity-[0.08] translate-x-[-22%]">
          <CrystallineCube 
            size={700} 
            mouseX={mousePos.x - (sectionSize.width / 2 - 350 - 700 * 0.22)} 
            mouseY={mousePos.y - (sectionSize.height / 2 - 350)} 
            mouseActive={mousePos.active}
          />
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-screen pointer-events-none">
        {/* ── Left: Copy ── */}
        <div className="relative flex flex-col justify-center content-gutter py-20 md:py-28 lg:py-32 pointer-events-auto">
          <div className="relative z-10 max-w-md mr-auto ml-0 lg:ml-0 text-left">
            <span className="font-montserrat text-[0.75rem] font-normal uppercase tracking-[0.35em] text-[#FC6E20] leading-4 block mb-6">
              [ Before we begin ]
            </span>

            <h2
              className="font-playfair font-bold text-white tracking-tight leading-[1.05] mb-6"
              style={{ fontSize: 'clamp(2.5rem, 4.5vw, 3.75rem)' }}
            >
              No fine print.<br />
              No gatekeeping.<br />
              Just clarity.
            </h2>

            <p className="font-montserrat text-stone-400 text-sm md:text-base leading-relaxed mb-4">
              Skip the noise and build with a launch-ready team. Direct access,
              transparent pricing, and immediate accountability from day one.
            </p>

            <p className="font-montserrat text-stone-500 text-xs md:text-sm leading-relaxed mb-10">
              Every question you&apos;re about to read came from a real conversation
              with a real business owner. We kept the answers just as honest.
            </p>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full font-montserrat font-medium text-sm text-stone-950 bg-[#FC6E20] hover:bg-[#e05a15] transition-colors duration-300"
            >
              Book a discovery call
            </Link>
          </div>

          {/* ── Mobile Cube ── */}
          <div className="flex lg:hidden items-center justify-center mt-16 opacity-[0.12]">
            <CrystallineCube size={350} />
          </div>
        </div>

        {/* ── Right: FAQ Accordion ── */}
        <div className="relative flex flex-col justify-center border-t lg:border-t-0 border-white/[0.06] py-12 md:py-20 lg:py-28 pointer-events-auto">
          <div className="w-full max-w-3xl px-4 md:px-10 lg:px-14">
            <Accordion type="single" defaultValue="1" collapsible className="w-full space-y-12">
              {FAQ_CATEGORIES.map((cat, catIdx) => (
                <div key={catIdx} className="space-y-4">
                  <h4 className="font-montserrat text-[0.75rem] font-normal uppercase tracking-[0.35em] text-[#FC6E20] leading-4 opacity-80 pl-2 md:pl-6">
                    [ {cat.category} ]
                  </h4>
                  <div className="border-t border-white/[0.08]">
                    {cat.items.map((item) => (
                      <AccordionItem
                        value={item.id}
                        key={item.id}
                        className="border-b border-white/[0.08] group/item"
                      >
                        <AccordionTrigger
                          className="text-left pl-2 md:pl-6 pr-2 duration-300 hover:no-underline cursor-pointer text-white/30 hover:text-white/50 data-[state=open]:text-white [&>svg]:hidden py-0"
                        >
                          <div className="h-auto transition-all duration-300 py-1.5 md:py-2">
                            <div className="flex flex-1 items-start gap-2 md:gap-3">
                              <p className="font-mono text-[9px] md:text-[11px] mt-0.5 md:mt-1 shrink-0 opacity-50">
                                {item.id}
                              </p>
                              <h3 className="uppercase font-montserrat font-black tracking-tight text-lg sm:text-xl md:text-[1.5rem] lg:text-[1.65rem] md:leading-[1.1]">
                                {item.title}
                              </h3>
                            </div>
                          </div>
                        </AccordionTrigger>

                        <AccordionContent className="text-stone-400 font-montserrat text-xs md:text-sm leading-relaxed pb-5 md:pb-6 pl-2 md:pl-6 pr-2 md:pr-12">
                          {item.content}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </div>
                </div>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
