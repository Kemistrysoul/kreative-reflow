import { InsightsClient } from './insights-client';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Insights | Kreative Reflow',
  description:
    'Practical studio notes on websites, SEO, dashboards, automation, and digital infrastructure for growing businesses.',
  path: '/insights',
});

export default function InsightsPage() {
  return <InsightsClient />;
}
