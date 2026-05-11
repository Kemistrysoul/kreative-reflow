import { pageMetadata } from '@/lib/seo';
import { serviceDetails } from '../_data';
import { ServiceRoute } from '../_components/service-route';

export const metadata = pageMetadata({
  title: 'SaaS & Custom Web Applications | Kreative Reflow',
  description:
    'Custom portals, dashboards, booking systems, and internal tools built around real business workflows.',
  path: '/services/saas-development',
});

export default function SaaSDevelopmentPage() {
  return <ServiceRoute detail={serviceDetails.saasDevelopment} path="/services/saas-development" />;
}
