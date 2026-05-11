import { JsonLd } from '@/components/JsonLd';
import {
  absoluteUrl,
  breadcrumbJsonLd,
  pageMetadata,
  serviceJsonLd,
  siteName,
} from '@/lib/seo';
import { serviceDetails } from './_data';
import ServicesPageClient from './services-client';

const serviceIndex = [
  {
    name: serviceDetails.webDesign.title,
    description: serviceDetails.webDesign.intro,
    path: '/services/web-design',
  },
  {
    name: serviceDetails.saasDevelopment.title,
    description: serviceDetails.saasDevelopment.intro,
    path: '/services/saas-development',
  },
  {
    name: serviceDetails.seo.title,
    description: serviceDetails.seo.intro,
    path: '/services/seo',
  },
  {
    name: serviceDetails.automation.title,
    description: serviceDetails.automation.intro,
    path: '/services/automation',
  },
  {
    name: serviceDetails.consulting.title,
    description: serviceDetails.consulting.intro,
    path: '/services/consulting',
  },
  {
    name: serviceDetails.maintenance.title,
    description: serviceDetails.maintenance.intro,
    path: '/services/maintenance',
  },
];

export const metadata = pageMetadata({
  title: 'Services | Kreative Reflow',
  description:
    'Websites, dashboards, SaaS products, SEO foundations, automation, consulting, and support for businesses that need stronger digital systems.',
  path: '/services',
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: siteName, path: '/' },
            { name: 'Services', path: '/services' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Kreative Reflow services',
            url: absoluteUrl('/services'),
            itemListElement: serviceIndex.map((service, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: serviceJsonLd(service),
            })),
          },
        ]}
      />
      <ServicesPageClient />
    </>
  );
}
