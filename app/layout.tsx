import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter, JetBrains_Mono, Playfair_Display, Montserrat } from 'next/font/google';
import './globals.css'; // Global styles
import { Providers } from './providers';
import { AppChrome } from '@/components/AppChrome';
import CustomCursor from '@/components/CustomCursor';
import {
  defaultOgImage,
  defaultSeoDescription,
  defaultSeoTitle,
  organizationJsonLd,
  siteName,
  siteUrl,
  websiteJsonLd,
} from '@/lib/seo';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: defaultSeoTitle,
  description: defaultSeoDescription,
  applicationName: siteName,
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION && {
    verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION },
  }),
  keywords: [
    'web design Johannesburg',
    'custom website development South Africa',
    'dashboard development',
    'SaaS development South Africa',
    'business automation',
    'local SEO Johannesburg',
    'AI SEO services',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: defaultSeoTitle,
    description: defaultSeoDescription,
    url: '/',
    siteName,
    locale: 'en_ZA',
    type: 'website',
    images: [
      {
        url: defaultOgImage,
        alt: 'Kreative Reflow selected website build showcase',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultSeoTitle,
    description: defaultSeoDescription,
    images: [defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = JSON.stringify([organizationJsonLd, websiteJsonLd]).replace(/</g, '\\u003c');
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${playfair.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <head>
        <Script
          id="jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: jsonLd }}
        />
      </head>
      <body className="cursor-none bg-[#F0EFED] text-dark-void font-sans antialiased selection:bg-liquid-lava selection:text-snow dark:bg-[#1a1a1a] dark:text-snow" suppressHydrationWarning>
        <Providers>
          <CustomCursor />
          <AppChrome>
            {children}
          </AppChrome>
        </Providers>
      </body>
    </html>
  );
}
