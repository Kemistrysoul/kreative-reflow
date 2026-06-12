import { ContactClient } from './contact-client';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Start a Website or Automation Project | Kreative Reflow',
  description:
    'Contact Kreative Reflow to plan a website, dashboard, SaaS product, local SEO foundation, automation workflow, or support retainer in South Africa.',
  path: '/contact',
});

export default function ContactPage() {
  return <ContactClient />;
}
