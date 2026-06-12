'use client';

import type React from 'react';

type ExpandingCtaBackgroundProps = {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

function joinClasses(...classes: Array<string | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function ExpandingCtaBackground({
  children,
  className,
  contentClassName,
}: ExpandingCtaBackgroundProps) {
  return (
    <div
      data-expanding-cta-background
      className={joinClasses('relative overflow-visible text-[#151419]', className)}
    >
      <div className={joinClasses('relative z-10 p-7 md:p-10 lg:p-14', contentClassName)}>
        {children}
      </div>
    </div>
  );
}
