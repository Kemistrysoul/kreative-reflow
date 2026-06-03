import { pageMetadata } from '@/lib/seo';
import { serviceDetails } from '../_data';
import { ServiceRoute } from '../_components/service-route';

export const metadata = pageMetadata({
  title: 'Local SEO Johannesburg | Kreative Reflow',
  description:
    'Local SEO and AI-search readiness for Johannesburg service businesses, with stronger service pages, FAQs, Google Business Profile signals, and trust structure.',
  path: '/services/seo',
});

export default function SEOPage() {
  return <ServiceRoute detail={serviceDetails.seo} path="/services/seo" />;
}
