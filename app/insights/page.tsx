import { InsightsClient } from './insights-client';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Website, SEO & Automation Insights | Kreative Reflow',
  description:
    'Read practical website, SEO, dashboard, automation, and digital infrastructure insights for South African businesses planning stronger digital systems.',
  path: '/insights',
});

export default function InsightsPage() {
  return <InsightsClient />;
}
