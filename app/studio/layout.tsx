import type { Metadata } from 'next';
import { StudioAccessState } from '@/components/studio/studio-access-state';
import { StudioShell } from '@/components/studio/shell';
import { StudioWorkflowProvider } from '@/components/studio/studio-workflow-state';
import { getStudioAccess } from '@/lib/portal-access';
import { requirePortalAuth } from '@/lib/portal-auth';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function StudioLayout({ children }: LayoutProps<'/studio'>) {
  await requirePortalAuth('/studio');
  const access = await getStudioAccess();

  if (access.status === 'missing-config' || access.status === 'unauthenticated') {
    return null;
  }

  if (access.status !== 'authorized') {
    return <StudioAccessState state={access} />;
  }

  return (
    <StudioWorkflowProvider>
      <StudioShell>{children}</StudioShell>
    </StudioWorkflowProvider>
  );
}
