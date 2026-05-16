'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';

export type NextArticle = {
  eyebrow: string;
  title: string;
  href: string;
  image: string;
  imageAlt: string;
};

type StickyNextArticleCardProps = {
  article: NextArticle;
};

export function StickyNextArticleCard({ article }: StickyNextArticleCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: -18 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-18% 0px -18% 0px' }}
      transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-[calc(100svh-24rem)] w-[18rem]"
    >
      <Link
        href={article.href}
        className="group block overflow-hidden rounded-[1.2rem] border border-[#151419]/12 bg-[#FBFBFB]/78 p-4 shadow-[0_18px_60px_rgba(21,20,25,0.08)] backdrop-blur-md transition duration-300 ease-out hover:-translate-y-1 hover:bg-[#FC6E20] dark:border-[#FBFBFB]/12 dark:bg-[#1B1B1E]/82 dark:hover:bg-[#FC6E20]"
      >
        <div className="relative h-32 overflow-hidden rounded-[0.85rem] bg-[#151419]/8">
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            sizes="18rem"
            className="object-cover transition duration-500 ease-out group-hover:scale-105"
          />
        </div>
        <p className="mt-5 font-mono text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#FC6E20] transition-colors group-hover:text-[#151419]/72">
          Next article
        </p>
        <p className="mt-2 font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#151419]/45 transition-colors group-hover:text-[#151419]/60 dark:text-[#FBFBFB]/45">
          {article.eyebrow}
        </p>
        <h3 className="mt-3 font-playfair text-2xl font-bold leading-[0.98] tracking-tight text-[#151419] dark:text-[#FBFBFB] dark:group-hover:text-[#151419]">
          {article.title}
        </h3>
        <div className="mt-6 flex items-center justify-between border-t border-[#151419]/12 pt-4 font-mono text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#151419] dark:border-[#FBFBFB]/12 dark:text-[#FBFBFB] dark:group-hover:border-[#151419]/14 dark:group-hover:text-[#151419]">
          <span>Read next</span>
          <span aria-hidden="true">-&gt;</span>
        </div>
      </Link>
    </motion.div>
  );
}
