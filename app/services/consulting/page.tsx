import { pageMetadata } from '@/lib/seo';
import { serviceDetails } from '../_data';
import { ServiceRoute } from '../_components/service-route';

export const metadata = pageMetadata({
  title: 'Business & Tech Consulting | Kreative Reflow',
  description:
    'Systems audits, offer mapping, roadmaps, and practical technology guidance before a website, dashboard, or automation build.',
  path: '/services/consulting',
});

export default function ConsultingPage() {
  return <ServiceRoute detail={serviceDetails.consulting} path="/services/consulting" />;
}
