import { pageMetadata } from '@/lib/seo';
import { serviceDetails } from '../_data';
import { ServiceRoute } from '../_components/service-route';

export const metadata = pageMetadata({
  title: 'Maintenance & Support | Kreative Reflow',
  description:
    'Website care, technical updates, content changes, performance checks, and ongoing improvement after launch.',
  path: '/services/maintenance',
});

export default function MaintenancePage() {
  return <ServiceRoute detail={serviceDetails.maintenance} path="/services/maintenance" />;
}
