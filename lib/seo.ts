import type { Metadata, MetadataRoute } from 'next';

export const siteName = 'Kreative Reflow';

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://kreativereflow.com'
).replace(/\/$/, '');

export const defaultSeoTitle =
  'Web Design & Business Systems Johannesburg | Kreative Reflow';

export const defaultSeoDescription =
  'Johannesburg studio building websites that bring in work and systems that keep them running: custom builds, dashboards, local SEO, and automation.';

export const defaultOgImage = '/images/work/touch-teq-showcase.jpg';

export const publicSitemapRoutes = [
  '/',
  '/about',
  '/contact',
  '/faq',
  '/privacy',
  '/terms',
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
  robots,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  robots?: Metadata['robots'];
}): Metadata {
  return {
    title,
    description,
    robots,
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
      '@id': `${siteUrl}/#organization`,
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
  '@type': ['Organization', 'LocalBusiness', 'ProfessionalService'],
  '@id': `${siteUrl}/#organization`,
  name: siteName,
  url: siteUrl,
  description: defaultSeoDescription,
  image: absoluteUrl(defaultOgImage),
  logo: {
    '@type': 'ImageObject',
    url: absoluteUrl('/icon.svg'),
  },
  email: 'hello@kreativereflow.com',
  telephone: '+27655750713',
  priceRange: 'R15,000 – R100,000+',
  currenciesAccepted: 'ZAR',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Johannesburg',
    addressRegion: 'Gauteng',
    addressCountry: 'ZA',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -26.2041,
    longitude: 28.0473,
  },
  areaServed: [
    { '@type': 'City', name: 'Johannesburg', sameAs: 'https://www.wikidata.org/wiki/Q34647' },
    { '@type': 'City', name: 'Pretoria', sameAs: 'https://www.wikidata.org/wiki/Q3926' },
    { '@type': 'City', name: 'Cape Town', sameAs: 'https://www.wikidata.org/wiki/Q5465' },
    { '@type': 'Country', name: 'South Africa', sameAs: 'https://www.wikidata.org/wiki/Q258' },
  ],
  sameAs: [
    // Add your Google Business Profile URL here once claimed:
    // 'https://maps.google.com/?cid=YOUR_CID',
    // Add social profiles as you create them:
    // 'https://www.linkedin.com/company/kreative-reflow',
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'hello@kreativereflow.com',
      telephone: '+27655750713',
      areaServed: ['ZA'],
      availableLanguage: ['en'],
    },
  ],
  knowsAbout: [
    'Web design Johannesburg',
    'Custom website development',
    'Local SEO',
    'AI search optimization',
    'Business automation',
    'SaaS development',
    'Custom dashboards',
    'Client portals',
  ],
  makesOffer: [
    'Web design and development',
    'Local and AI SEO',
    'SaaS and custom web applications',
    'AI and business automation',
    'Business and technology consulting',
    'Website maintenance and support',
  ].map((name) => ({
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name,
    },
  })),
};

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  name: siteName,
  alternateName: ['KreativeReflow', 'Kreative Reflow Studio'],
  url: siteUrl,
  inLanguage: 'en-ZA',
  publisher: {
    '@id': `${siteUrl}/#organization`,
  },
};
