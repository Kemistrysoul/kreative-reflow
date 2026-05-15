import type { MetadataRoute } from 'next';
import { publicSitemapRoutes, sitemapEntry } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  return publicSitemapRoutes.map((route) =>
    sitemapEntry(
      route,
      route === '/'
        ? 1
        : route === '/services' || route === '/work' || route === '/contact' || route === '/tools' || route === '/start'
          ? 0.9
          : route.startsWith('/tools/')
            ? 0.84
          : route.startsWith('/services/')
            ? 0.82
            : 0.72,
      route === '/' || route === '/insights' || route === '/tools' ? 'weekly' : 'monthly',
    ),
  );
}
