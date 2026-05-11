'use client';

import Link from 'next/link';
import type { LinkProps } from 'next/link';
import { ArrowRight } from 'lucide-react';
import type React from 'react';
import {
  TextStaggerHover,
  TextStaggerHoverActive,
  TextStaggerHoverHidden,
  type AnimationT,
  type StaggerDirection,
} from '@/lib/animations';
import { cn } from '@/lib/utils';

type AnimatedLinkTextProps = {
  children: string;
  activeClassName?: string;
  hiddenClassName?: string;
  animation?: AnimationT;
  staggerDirection?: StaggerDirection;
  transitionDuration?: number;
};

export function AnimatedLinkText({
  children,
  activeClassName,
  hiddenClassName = 'text-liquid-lava',
  animation = 'top',
  staggerDirection = 'start',
  transitionDuration = 0.26,
}: AnimatedLinkTextProps) {
  return (
    <TextStaggerHover className="leading-none">
      <TextStaggerHoverActive
        animation={animation}
        staggerDirection={staggerDirection}
        className={activeClassName}
        transition={{ duration: transitionDuration }}
      >
        {children}
      </TextStaggerHoverActive>
      <TextStaggerHoverHidden
        animation={animation === 'top' ? 'bottom' : animation}
        staggerDirection={staggerDirection}
        className={hiddenClassName}
        transition={{ duration: transitionDuration }}
      >
        {children}
      </TextStaggerHoverHidden>
    </TextStaggerHover>
  );
}

type AnimatedTextLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'href' | 'children'
> & {
  href: LinkProps['href'];
  children: string;
  withArrow?: boolean;
  underline?: boolean;
  hiddenClassName?: string;
  arrowClassName?: string;
};

export function AnimatedTextLink({
  href,
  children,
  className,
  withArrow = false,
  underline = true,
  hiddenClassName,
  arrowClassName,
  ...props
}: AnimatedTextLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group/link relative inline-flex items-center gap-2 overflow-hidden pb-1 transition-colors',
        className,
      )}
      {...props}
    >
      <AnimatedLinkText hiddenClassName={hiddenClassName}>{children}</AnimatedLinkText>
      {withArrow ? (
        <ArrowRight
          aria-hidden="true"
          className={cn(
            'h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1',
            arrowClassName,
          )}
        />
      ) : null}
      {underline ? (
        <span className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-liquid-lava transition-transform duration-300 group-hover/link:scale-x-100" />
      ) : null}
    </Link>
  );
}
