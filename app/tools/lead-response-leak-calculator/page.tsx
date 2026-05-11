import { JsonLd } from '@/components/JsonLd';
import {
  absoluteUrl,
  breadcrumbJsonLd,
  pageMetadata,
  siteName,
} from '@/lib/seo';
import { LeadResponseLeakCalculatorClient } from './calculator-client';

const title = 'Lead Response Leak Calculator';
const description =
  'A revenue leak calculator for service businesses to estimate how much slow lead response costs per month, per year, and over three years.';
const path = '/tools/lead-response-leak-calculator';

export const metadata = pageMetadata({
  title: `${title} | Kreative Reflow`,
  description,
  path,
});

export default function LeadResponseLeakCalculatorPage() {
  const toolJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: title,
    description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    url: absoluteUrl(path),
    provider: {
      '@type': 'Organization',
      name: siteName,
      url: absoluteUrl('/'),
    },
  };

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: siteName, path: '/' },
            { name: 'Tools', path: '/tools' },
            { name: title, path },
          ]),
          toolJsonLd,
        ]}
      />
      <LeadResponseLeakCalculatorClient />
    </>
  );
}
