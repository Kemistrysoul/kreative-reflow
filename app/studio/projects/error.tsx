'use client';

import { StudioRouteError } from '@/components/studio/StudioRouteError';

export default function StudioProjectsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <StudioRouteError
      reset={reset}
      title="Project operations could not load"
      detail="The studio project route failed before queues and launch readiness could render. Retry, then check recent operational events."
    />
  );
}
