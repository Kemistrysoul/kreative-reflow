import { pageMetadata } from '@/lib/seo';
import { serviceDetails } from '../_data';
import { ServiceRoute } from '../_components/service-route';

export const metadata = pageMetadata({
  title: 'Tech Consulting Johannesburg | Kreative Reflow',
  description:
    'Business and technology consulting for founders who need a clear roadmap before investing in a website, dashboard, automation workflow, or custom system.',
  path: '/services/consulting',
});

export default function ConsultingPage() {
  return <ServiceRoute detail={serviceDetails.consulting} path="/services/consulting" />;
}
