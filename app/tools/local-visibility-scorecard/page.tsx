import { JsonLd } from '@/components/JsonLd';
import {
  absoluteUrl,
  breadcrumbJsonLd,
  pageMetadata,
  siteName,
} from '@/lib/seo';
import { LocalVisibilityScorecardClient } from './scorecard-client';

const title = 'Local Visibility Scorecard';
const description =
  'Score your Johannesburg local visibility across Google Business Profile, reviews, directories, local SEO structure, and AI search readiness.';
const path = '/tools/local-visibility-scorecard';

export const metadata = pageMetadata({
  title: `${title} | Kreative Reflow`,
  description,
  path,
});

export default function LocalVisibilityScorecardPage() {
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
      <LocalVisibilityScorecardClient />
    </>
  );
}
