import { pageMetadata } from '@/lib/seo';
import { serviceDetails } from '../_data';
import { ServiceRoute } from '../_components/service-route';

export const metadata = pageMetadata({
  title: 'Business Automation Johannesburg | Kreative Reflow',
  description:
    'Practical AI and workflow automation for South African teams that need faster lead response, cleaner intake, reporting, reminders, and less repeated admin.',
  path: '/services/automation',
});

export default function AutomationPage() {
  return <ServiceRoute detail={serviceDetails.automation} path="/services/automation" />;
}
