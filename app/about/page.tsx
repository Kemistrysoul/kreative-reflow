import { AboutClient } from './about-client';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Founder-Led Web Studio Johannesburg | Kreative Reflow',
  description:
    'Meet the founder-led Johannesburg studio building custom websites, dashboards, SEO foundations, automation, and support systems for growing businesses.',
  path: '/about',
});

export default function AboutPage() {
  return <AboutClient />;
}
