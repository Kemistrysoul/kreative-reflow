import { WorkClient } from './work-client';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Web Design & Systems Portfolio | Kreative Reflow',
  description:
    'View selected Kreative Reflow website, dashboard, lead capture, SEO foundation, and automation-ready projects built for South African service businesses.',
  path: '/work',
});

export default function WorkPage() {
  return <WorkClient />;
}
