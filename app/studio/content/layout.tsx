import type { ReactNode } from 'react';
import { StudioContentProvider } from '@/components/studio/content-state';
import { StudioContentShell } from '@/components/studio/content-shell';

export default function StudioContentLayout({ children }: { children: ReactNode }) {
  return (
    <StudioContentProvider>
      <StudioContentShell>{children}</StudioContentShell>
    </StudioContentProvider>
  );
}
