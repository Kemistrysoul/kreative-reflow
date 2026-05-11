import { AboutClient } from './about-client';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'About | Kreative Reflow',
  description:
    'Meet Kreative Reflow, a founder-led Johannesburg studio building websites, systems, SEO foundations, and automation for growing businesses.',
  path: '/about',
});

export default function AboutPage() {
  return <AboutClient />;
}
