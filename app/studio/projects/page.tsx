import type { Metadata } from 'next';
import { StudioProjectsWorkspace } from '@/components/studio/projects-workspace';
import { getPortalNotificationRules, getStudioApprovalQueue } from '@/lib/portal-approvals';
import { getStudioAssetReviews } from '@/lib/portal-assets';
import { getStudioPortalCommunications } from '@/lib/portal-communications';
import { getStudioFinanceHandoffData } from '@/lib/portal-finance-handoff';
import { getStudioOperationalEvents } from '@/lib/portal-monitoring';
import { getStudioOnboardingResponses } from '@/lib/portal-onboarding-reviews';
import { getStudioReadinessGateData } from '@/lib/portal-readiness';
import { getStudioProjectRequests } from '@/lib/portal-requests';

export const metadata: Metadata = {
  title: 'Studio Projects | Kreative Reflow',
  description: 'Project delivery dashboard for active work, blockers, client movement, and asset readiness.',
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = 'force-dynamic';

export default async function StudioProjectsPage() {
  const [
    onboardingResponses,
    assetReviews,
    approvalQueue,
    notificationRules,
    financeHandoff,
    operationalEvents,
    projectRequests,
    portalCommunications,
  ] = await Promise.all([
    getStudioOnboardingResponses(),
    getStudioAssetReviews(),
    getStudioApprovalQueue(),
    getPortalNotificationRules(),
    getStudioFinanceHandoffData(),
    getStudioOperationalEvents(),
    getStudioProjectRequests(),
    getStudioPortalCommunications(),
  ]);
  const readinessGate = await getStudioReadinessGateData(undefined, financeHandoff.invoices);

  return (
    <StudioProjectsWorkspace
      approvalQueue={approvalQueue}
      assetReviews={assetReviews}
      financeHandoff={financeHandoff}
      notificationRules={notificationRules}
      onboardingResponses={onboardingResponses}
      operationalEvents={operationalEvents}
      portalCommunications={portalCommunications}
      projectRequests={projectRequests}
      readinessGate={readinessGate}
    />
  );
}
