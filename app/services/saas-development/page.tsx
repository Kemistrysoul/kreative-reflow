import { pageMetadata } from '@/lib/seo';
import { serviceDetails } from '../_data';
import { ServiceRoute } from '../_components/service-route';

export const metadata = pageMetadata({
  title: 'Custom Web Apps & Dashboards | Kreative Reflow',
  description:
    'Build custom dashboards, client portals, booking systems, SaaS MVPs, and internal tools around the workflows your South African business actually uses.',
  path: '/services/saas-development',
});

export default function SaaSDevelopmentPage() {
  return <ServiceRoute detail={serviceDetails.saasDevelopment} path="/services/saas-development" />;
}
