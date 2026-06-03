'use client';

import { PortalRouteError } from '@/components/portal/PortalRouteError';

export default function PortalOnboardingError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <PortalRouteError
      reset={reset}
      title="Onboarding could not load"
      detail="The onboarding route hit an error before the project form could render. Retry, then review portal monitoring if it repeats."
    />
  );
}
