'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import FloatingUI from '@/components/FloatingUI';
import SmoothScroll from '@/components/SmoothScroll';
import { SiteFooter } from '@/components/SiteFooter';

const appRoutePrefixes = ['/portal', '/studio', '/start'];

export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAppRoute = appRoutePrefixes.some((prefix) => pathname.startsWith(prefix));

  if (isAppRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <FloatingUI />
      <SmoothScroll>
        {children}
        <SiteFooter />
      </SmoothScroll>
    </>
  );
}
