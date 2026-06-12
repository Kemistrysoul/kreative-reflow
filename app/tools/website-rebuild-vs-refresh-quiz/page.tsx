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
  'Use this website decision quiz to choose a rebuild, focused refresh, or optimization roadmap before spending the next design and development budget.';
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
