import { JsonLd } from '@/components/JsonLd';
import {
  absoluteUrl,
  breadcrumbJsonLd,
  pageMetadata,
  siteName,
} from '@/lib/seo';
import { ScorecardClient } from './scorecard-client';

const title = 'Website Lead Leak Scorecard';
const description =
  'An interactive website conversion scorecard for South African service businesses to diagnose speed, mobile, trust, clarity, and CTA leaks.';
const path = '/tools/website-lead-leak-scorecard';

export const metadata = pageMetadata({
  title: `${title} | Kreative Reflow`,
  description,
  path,
});

export default function WebsiteLeadLeakScorecardPage() {
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
      <ScorecardClient />
    </>
  );
}
