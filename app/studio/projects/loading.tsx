import { StudioRouteFallback } from '@/components/studio/StudioRouteFallback';

export default function StudioProjectsLoading() {
  return (
    <StudioRouteFallback
      title="Loading project operations"
      detail="Preparing the project register, portal queues, launch handoff, and monitoring events."
    />
  );
}
