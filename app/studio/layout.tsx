import type { Metadata } from 'next';
import { StudioShell } from '@/components/studio/shell';
import { StudioWorkflowProvider } from '@/components/studio/studio-workflow-state';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudioLayout({ children }: LayoutProps<'/studio'>) {
  return (
    <StudioWorkflowProvider>
      <StudioShell>{children}</StudioShell>
    </StudioWorkflowProvider>
  );
}
