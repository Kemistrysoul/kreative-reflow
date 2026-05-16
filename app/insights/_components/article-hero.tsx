import Image from 'next/image';
import type React from 'react';
import { ParallaxSignalCard } from './parallax-signal-card';

type ArticleHeroProps = {
  eyebrow: string;
  title: string;
  updatedAt: string;
  image: string;
  imageAlt: string;
  signalLabel: string;
  signalValue: string;
  signalBody: string;
  signalNote?: string;
  children: React.ReactNode;
};

export function ArticleHero({
  eyebrow,
  title,
  updatedAt,
  image,
  imageAlt,
  signalLabel,
  signalValue,
  signalBody,
  signalNote,
  children,
}: ArticleHeroProps) {
  return (
    <section data-article-hero className="relative min-h-[100svh] overflow-hidden bg-[#F0EFED] text-[#151419] dark:bg-[#151419] dark:text-[#FBFBFB]">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(240,239,237,0.96)_0%,rgba(240,239,237,0.9)_34%,rgba(240,239,237,0.58)_58%,rgba(240,239,237,0.14)_100%)] dark:bg-[linear-gradient(90deg,rgba(21,20,25,0.96)_0%,rgba(21,20,25,0.86)_36%,rgba(21,20,25,0.52)_62%,rgba(21,20,25,0.16)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(0deg,rgba(240,239,237,0.88)_0%,rgba(240,239,237,0.1)_42%,rgba(240,239,237,0.42)_100%)] dark:bg-[linear-gradient(0deg,rgba(21,20,25,0.9)_0%,rgba(21,20,25,0.12)_42%,rgba(21,20,25,0.48)_100%)]"
        aria-hidden="true"
      />

      <div className="content-gutter relative z-10 grid min-h-[100svh] items-end pb-12 pt-28 md:pb-16 lg:items-center lg:pt-32">
        <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(18rem,0.42fr)] lg:items-end">
          <div className="max-w-5xl">
            <p className="font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#FC6E20]">
              [ {eyebrow} ]
            </p>
            <h1 className="mt-7 max-w-5xl font-playfair text-[clamp(3.15rem,6.55vw,7rem)] font-bold leading-[0.92] tracking-tight">
              {title}
            </h1>
            <p className="mt-7 font-montserrat text-sm font-bold uppercase tracking-[0.14em] text-[#151419]/64 dark:text-[#FBFBFB]/62">
              Last updated: {updatedAt}
            </p>
            <div className="mt-7 max-w-2xl space-y-4 font-montserrat text-base leading-8 text-[#151419]/72 dark:text-[#FBFBFB]/70 md:text-[1.05rem]">
              {children}
            </div>
          </div>

          <ParallaxSignalCard
            signalLabel={signalLabel}
            signalValue={signalValue}
            signalBody={signalBody}
            signalNote={signalNote}
          />
        </div>
      </div>
    </section>
  );
}
