import type { Metadata } from 'next';
import { StudioCrmWorkspace } from '@/components/studio/crm-workspace';

export const metadata: Metadata = {
  title: 'Studio CRM | Kreative Reflow',
  description: 'CRM dashboard for pipeline stages, lead records, and follow-up work.',
};

export default async function StudioCrmPage({
  searchParams,
}: {
  searchParams: Promise<{ compose?: string | string[] }>;
}) {
  const params = await searchParams;
  const compose = Array.isArray(params.compose) ? params.compose[0] : params.compose;

  return <StudioCrmWorkspace openIntake={compose === 'intake'} />;
}
