import type { Metadata } from 'next';
import { StudioProjectsWorkspace } from '@/components/studio/projects-workspace';

export const metadata: Metadata = {
  title: 'Studio Projects | Kreative Reflow',
  description: 'Project delivery dashboard for active work, blockers, client movement, and asset readiness.',
};

export default function StudioProjectsPage() {
  return <StudioProjectsWorkspace />;
}
