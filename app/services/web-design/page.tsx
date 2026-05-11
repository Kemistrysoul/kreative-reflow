import { pageMetadata } from '@/lib/seo';
import { serviceDetails } from '../_data';
import { ServiceRoute } from '../_components/service-route';

export const metadata = pageMetadata({
  title: 'Web Design & Development | Kreative Reflow',
  description:
    'Custom websites built for trust, conversion, speed, and clear buyer journeys.',
  path: '/services/web-design',
});

export default function WebDesignPage() {
  return <ServiceRoute detail={serviceDetails.webDesign} path="/services/web-design" />;
}
