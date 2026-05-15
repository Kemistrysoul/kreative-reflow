import type { Metadata, MetadataRoute } from 'next';

export const siteName = 'Kreative Reflow';

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://kreativereflow.com'
).replace(/\/$/, '');

export const defaultSeoTitle =
  'Kreative Reflow | Websites, Dashboards & Automation';

export const defaultSeoDescription =
  'Johannesburg creative-tech studio building websites, dashboards, SaaS products, SEO foundations, and business automation systems.';

export const defaultOgImage = '/images/work/touch-teq-showcase.jpg';

export const publicSitemapRoutes = [
  '/',
  '/about',
  '/start',
  '/contact',
  '/faq',
  '/insights',
  '/insights/website-cost-south-africa-2026',
  '/insights/why-your-website-looks-good-but-doesnt-convert',
  '/insights/local-seo-johannesburg-service-businesses',
  '/insights/when-does-a-business-need-a-custom-dashboard-or-client-portal',
  '/insights/what-ai-seo-actually-means-for-small-business',
  '/work',
  '/tools',
  '/tools/website-lead-leak-scorecard',
  '/tools/local-visibility-scorecard',
  '/tools/lead-response-leak-calculator',
  '/tools/website-rebuild-vs-refresh-quiz',
  '/services',
  '/services/web-design',
  '/services/saas-development',
  '/services/seo',
  '/services/automation',
  '/services/consulting',
  '/services/maintenance',
] as const;

export function absoluteUrl(path = '/') {
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

export function pageMetadata({
  title,
  description,
  path,
  image = defaultOgImage,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName,
      locale: 'en_ZA',
      type: 'website',
      images: [
        {
          url: image,
          alt: `${title} - ${siteName}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export function sitemapEntry(
  path: (typeof publicSitemapRoutes)[number],
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly',
) {
  return {
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function serviceJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: absoluteUrl(path),
    provider: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
    },
    areaServed: [
      {
        '@type': 'Country',
        name: 'South Africa',
      },
      {
        '@type': 'Place',
        name: 'International',
      },
    ],
  };
}

export function faqJsonLd(
  questions: Array<{ question: string; answer: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness'],
  name: siteName,
  url: siteUrl,
  image: absoluteUrl(defaultOgImage),
  logo: absoluteUrl('/icon.svg'),
  email: 'hello@kreativereflow.com',
  telephone: '+27655750713',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Johannesburg',
    addressCountry: 'ZA',
  },
  areaServed: [
    {
      '@type': 'Country',
      name: 'South Africa',
    },
    {
      '@type': 'Place',
      name: 'International',
    },
  ],
};
