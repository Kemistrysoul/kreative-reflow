import type { Metadata } from 'next';
import { StudioProjectsWorkspace } from '@/components/studio/projects-workspace';
import { getPortalNotificationRules, getStudioApprovalQueue } from '@/lib/portal-approvals';
import { getStudioAssetReviews } from '@/lib/portal-assets';
import { getStudioFinanceHandoffData } from '@/lib/portal-finance-handoff';
import { getStudioOperationalEvents } from '@/lib/portal-monitoring';
import { getStudioOnboardingResponses } from '@/lib/portal-onboarding-reviews';

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
  ] = await Promise.all([
    getStudioOnboardingResponses(),
    getStudioAssetReviews(),
    getStudioApprovalQueue(),
    getPortalNotificationRules(),
    getStudioFinanceHandoffData(),
    getStudioOperationalEvents(),
  ]);

  return (
    <StudioProjectsWorkspace
      approvalQueue={approvalQueue}
      assetReviews={assetReviews}
      financeHandoff={financeHandoff}
      notificationRules={notificationRules}
      onboardingResponses={onboardingResponses}
      operationalEvents={operationalEvents}
    />
  );
}
