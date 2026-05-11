import { JsonLd } from '@/components/JsonLd';
import {
  absoluteUrl,
  breadcrumbJsonLd,
  pageMetadata,
  siteName,
} from '@/lib/seo';
import { WebsiteRebuildRefreshQuizClient } from './quiz-client';

const title = 'Website Rebuild vs Refresh Quiz';
const description =
  'A decision quiz for business owners to decide whether their website needs a rebuild, refresh, or optimization roadmap.';
const path = '/tools/website-rebuild-vs-refresh-quiz';

export const metadata = pageMetadata({
  title: `${title} | Kreative Reflow`,
  description,
  path,
});

export default function WebsiteRebuildRefreshQuizPage() {
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
      <WebsiteRebuildRefreshQuizClient />
    </>
  );
}
