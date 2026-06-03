import { pageMetadata } from '@/lib/seo';
import { serviceDetails } from '../_data';
import { ServiceRoute } from '../_components/service-route';

export const metadata = pageMetadata({
  title: 'Website Maintenance & Support | Kreative Reflow',
  description:
    'Website maintenance, technical updates, performance checks, content changes, SEO improvements, and support for digital systems after launch.',
  path: '/services/maintenance',
});

export default function MaintenancePage() {
  return <ServiceRoute detail={serviceDetails.maintenance} path="/services/maintenance" />;
}
