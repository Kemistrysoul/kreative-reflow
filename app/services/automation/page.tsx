import { pageMetadata } from '@/lib/seo';
import { serviceDetails } from '../_data';
import { ServiceRoute } from '../_components/service-route';

export const metadata = pageMetadata({
  title: 'AI & Business Automation | Kreative Reflow',
  description:
    'Practical AI and workflow automation for repeated admin, follow-ups, reporting, intake, and connected operations.',
  path: '/services/automation',
});

export default function AutomationPage() {
  return <ServiceRoute detail={serviceDetails.automation} path="/services/automation" />;
}
