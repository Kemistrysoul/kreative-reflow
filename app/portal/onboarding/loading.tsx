import { PortalRouteFallback } from '@/components/portal/PortalRouteFallback';

export default function PortalOnboardingLoading() {
  return (
    <PortalRouteFallback
      title="Loading onboarding"
      detail="Preparing the questionnaire, project access, and privacy acknowledgement state."
    />
  );
}
