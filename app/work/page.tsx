import { WorkClient } from './work-client';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Work | Kreative Reflow',
  description:
    'Selected Kreative Reflow projects across websites, service platforms, dashboards, lead capture, SEO foundations, and automation-ready systems.',
  path: '/work',
});

export default function WorkPage() {
  return <WorkClient />;
}
