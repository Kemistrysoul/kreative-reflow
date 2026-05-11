import { pageMetadata } from '@/lib/seo';
import { serviceDetails } from '../_data';
import { ServiceRoute } from '../_components/service-route';

export const metadata = pageMetadata({
  title: 'Local & AI SEO | Kreative Reflow',
  description:
    'Search visibility, local structure, service pages, FAQs, and AI-search readiness for qualified enquiries.',
  path: '/services/seo',
});

export default function SEOPage() {
  return <ServiceRoute detail={serviceDetails.seo} path="/services/seo" />;
}
