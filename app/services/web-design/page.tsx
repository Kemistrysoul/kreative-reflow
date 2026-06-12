import { pageMetadata } from '@/lib/seo';
import { serviceDetails } from '../_data';
import { ServiceRoute } from '../_components/service-route';

export const metadata = pageMetadata({
  title: 'Web Design Johannesburg | Kreative Reflow',
  description:
    'Custom website design and development in Johannesburg for service businesses that need faster pages, clearer offers, stronger trust, and qualified enquiries.',
  path: '/services/web-design',
});

export default function WebDesignPage() {
  return <ServiceRoute detail={serviceDetails.webDesign} path="/services/web-design" />;
}
