'use client';

import { PortalRouteError } from '@/components/portal/PortalRouteError';

export default function PortalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <PortalRouteError reset={reset} />;
}
