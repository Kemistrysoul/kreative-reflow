import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils"; 

const items = [
  {
    id: "01",
    title: "Who am I?",
    content:
      "I'm Ali Imam - a designer and creative developer focused on building digital experiences that are minimal, meaningful, and timeless.",
  },
  {
    id: "02",
    title: "What do I design?",
    content:
      "I create clean, functional interfaces, brand systems, and digital products. My work blends simplicity with clarity and usability.",
  },
  {
    id: "03",
    title: "My design approach",
    content:
      "For me, design isn't just visuals - it's how something feels and works. I focus on clarity, detail, and storytelling in every project.",
  },
  {
    id: "04",
    title: "Beyond design",
    content:
      "I bridge design and development, turning ideas into interactive experiences with modern tools and technology.",
  },
  {
    id: "05",
    title: "What inspires me",
    content:
      "Minimalism, architecture, and everyday details. I believe great design is found in the small things we often overlook.",
  },
  {
    id: "06",
    title: "Who I work with",
    content:
      "I collaborate with startups, brands, and individuals who value thoughtful design and want to create lasting impact.",
  },
  {
    id: "07",
    title: "My toolkit",
    content:
      "Figma, Next.js, and modern frameworks are part of my process - but for me, tools always serve the idea, not the other way around.",
  },
  {
    id: "08",
    title: "Let's connect",
    content:
      "You can reach me through contact@aliimam.in or on social platforms. I'm always open to new projects, collaborations, and conversations.",
  },
];

export function Accordion05() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-0">
      <Accordion type="single" defaultValue="05" collapsible className="w-full">
        {items.map((item) => (
          <AccordionItem value={item.id} key={item.id} className="last:border-b">
            <AccordionTrigger className="text-left pl-4 sm:pl-6 md:pl-14 overflow-hidden text-foreground/20 duration-200 hover:no-underline cursor-pointer -space-y-6 data-[state=open]:space-y-0 data-[state=open]:text-primary [&>svg]:hidden min-h-[44px] py-4">
              <div className="flex flex-1 items-start gap-4">
                <p className="text-xs pt-1 sm:pt-2 font-mono">{item.id}</p>
                <h1
                  className={`uppercase relative text-left text-2xl sm:text-3xl md:text-5xl leading-tight w-full pr-4`}
                >
                  {item.title}
                </h1>
              </div>
            </AccordionTrigger>

            <AccordionContent className="text-muted-foreground pb-6 pl-[2.25rem] sm:pl-14 md:pl-24 pr-4 md:pr-20 text-sm sm:text-base leading-relaxed">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
