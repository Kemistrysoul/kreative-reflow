import type { Metadata } from 'next';
import type React from 'react';
import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { DynamicIslandTOC } from '@/components/ui/dynamic-island-toc';
import { ArticleBody } from '../_components/article-body';
import { ArticleHero } from '../_components/article-hero';
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
  siteName,
} from '@/lib/seo';

const title = 'Local SEO for Johannesburg Service Businesses';
const description =
  'A practical local SEO guide for Johannesburg service businesses covering Google Business Profile, location pages, reviews, citations, AI search, and first steps.';
const path = '/insights/local-seo-johannesburg-service-businesses';
const publishedDate = '2026-05-10';

export const metadata: Metadata = pageMetadata({
  title: `${title} | Kreative Reflow`,
  description,
  path,
});

const faqItems = [
  {
    question: 'How long does it take to rank in the Local Pack?',
    answer:
      "If your GBP is optimized, your NAP is consistent, and you're getting fresh reviews, you can see movement in 4 to 8 weeks. Competitive keywords in high-traffic suburbs like Sandton take 3 to 6 months. Less competitive areas can rank faster.",
  },
  {
    question: 'Do I need a physical office in Johannesburg to rank locally?',
    answer:
      'Not anymore. Service Area Businesses (plumbers, electricians, mobile services) can rank without a physical storefront. Set your service areas in GBP and make sure your location pages target the suburbs you serve. You do need a real local phone number and address on file with Google, but you can hide the address from public view.',
  },
  {
    question: 'Should I pay for Google Ads or focus on local SEO?',
    answer:
      'Both. Google Local Services Ads and Google Ads give you immediate visibility while your SEO builds. But ads stop working when you stop paying. Local SEO compounds. Start with a small ad budget to get leads now while you build your organic rankings.',
  },
  {
    question: 'How many reviews do I need?',
    answer:
      'More than your competitors. Check the top three businesses in the Local Pack for your main keyword. If they have 40, 60, and 80 reviews, you need at least 50 to compete. But recency matters more than count. 30 fresh reviews in the past three months beats 100 old reviews from two years ago.',
  },
  {
    question: 'What if I serve all of Johannesburg, not just one suburb?',
    answer:
      'Create location pages for the highest-value suburbs. Sandton, Rosebank, Fourways, Randburg, Braamfontein. You can\'t rank for "plumber Johannesburg" — that\'s too broad and competitive. But you can rank for "plumber Sandton" and "plumber Fourways" and capture those specific high-intent searches.',
  },
];

function ArticleSection({
  id,
  title: sectionTitle,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      data-toc
      data-toc-depth="2"
      data-toc-title={sectionTitle}
      className="scroll-mt-28 border-t border-[#151419]/12 py-12 dark:border-[#FBFBFB]/12 md:py-16"
    >
      <h2 className="max-w-4xl font-playfair text-[clamp(2.35rem,5vw,4.9rem)] font-bold leading-[0.95] tracking-tight text-[#151419] dark:text-[#FBFBFB]">
        {sectionTitle}
      </h2>
      <div className="mt-8 space-y-6 font-montserrat text-base leading-8 text-[#151419]/70 dark:text-[#FBFBFB]/68">
        {children}
      </div>
    </section>
  );
}

function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="grid gap-3 pl-0">
      {items.map((item, index) => (
        <li key={index} className="grid grid-cols-[0.75rem_1fr] gap-3">
          <span className="mt-3 h-1.5 w-1.5 bg-[#FC6E20]" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function LocalSeoJohannesburgArticlePage() {
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished: publishedDate,
    dateModified: publishedDate,
    author: {
      '@type': 'Person',
      name: 'Delite',
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: absoluteUrl('/'),
    },
    mainEntityOfPage: absoluteUrl(path),
  };

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#F0EFED] text-[#151419] selection:bg-[#FC6E20] selection:text-[#151419] [--left-gutter:4.5rem] [--right-gutter:1rem] dark:bg-[#151419] dark:text-[#FBFBFB] sm:[--left-gutter:4.75rem] sm:[--right-gutter:1.5rem] lg:[--left-gutter:5.5rem] lg:[--right-gutter:3.5rem] xl:[--right-gutter:75px]">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: siteName, path: '/' },
            { name: 'Insights', path: '/insights' },
            { name: title, path },
          ]),
          articleJsonLd,
          faqJsonLd(faqItems),
        ]}
      />
      <DynamicIslandTOC selector="#local-seo-article [data-toc]" />

      <ArticleHero
        eyebrow="Local SEO"
        title="Local SEO for Johannesburg Service Businesses"
        updatedAt="May 10, 2026"
        image="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85"
        imageAlt="Local street and building detail representing local search visibility."
        signalLabel="The local fight"
        signalValue="Local Pack"
        signalBody="The fight isn't for page one anymore. It's for the three map results that get seen first."
        signalNote="Search has a local front door"
      >
        <p>A beautiful website means nothing if nobody can find it.</p>
        <p>
          You&apos;re a service business in Johannesburg. Plumber, electrician, lawyer, dentist, accountant, engineer. You have a website. It looks professional. You&apos;re not showing up when people search for what you do.
        </p>
        <p>
          Your competitor three blocks away with a worse website gets the call. Not because their service is better. Because they show up when someone searches &quot;plumber Sandton&quot; or &quot;dentist near me.&quot;
        </p>
        <p>That&apos;s local SEO.</p>
      </ArticleHero>

      <ArticleBody
        id="local-seo-article"
        nextArticle={{
          eyebrow: 'Dashboards',
          title: 'When Does a Business Need a Custom Dashboard or Client Portal',
          href: '/insights/when-does-a-business-need-a-custom-dashboard-or-client-portal',
          image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=85',
          imageAlt: 'Team reviewing a dashboard and workflow system.',
        }}
      >
          <ArticleSection id="why-local-seo-matters-in-johannesburg" title="Why Local SEO Matters in Johannesburg">
            <p>
              Johannesburg is South Africa&apos;s economic center. Sandton alone generates more economic activity than most African countries. The competition is brutal.
            </p>
            <p>
              76% of people who search for a local service on their phone visit a business within 24 hours. 46% of all Google searches have local intent. If you&apos;re not showing up in the top three results when someone in your area searches for your service, you don&apos;t exist.
            </p>
            <p>
              The fight isn&apos;t for page one anymore. It&apos;s for the Local Pack — those three businesses that show up in the map at the top of search results with their Google Business Profile, address, phone number, reviews, and hours.
            </p>
            <p>
              Get into that pack and you win half the calls in your area. Miss it and you&apos;re competing with everyone on page two, which gets 5% of clicks.
            </p>
          </ArticleSection>

          <ArticleSection id="google-business-profile-is-everything" title="Google Business Profile Is Everything">
            <p>Your Google Business Profile is the single most important factor in local search. Not your website. Your GBP.</p>
            <p>If you haven&apos;t claimed and verified your Google Business Profile, do it today. Right now. Before you finish reading this article.</p>
            <p>Google uses three main factors to decide which businesses show up in the Local Pack: relevance, distance, and prominence. Your GBP controls all three.</p>
            <p>
              <strong>Relevance</strong>{' '}means how well your business matches what someone searched for. If someone searches &quot;emergency plumber Fourways&quot; and your GBP says you&apos;re a plumber serving Fourways with 24/7 emergency service, you&apos;re relevant.
            </p>
            <p>
              <strong>Distance</strong>{' '}is how close you are to the person searching. You can&apos;t change your location, but you can set your service areas correctly so Google knows where you operate.
            </p>
            <p>
              <strong>Prominence</strong>{' '}is how well-known and trusted your business is. Google measures this through reviews, citations, website authority, and how often people interact with your GBP.
            </p>
            <p>
              <strong>What you need on your Google Business Profile:</strong>
            </p>
            <BulletList
              items={[
                'Verified account (required since November 2024 for Local Services Ads)',
                'Correct primary category (be specific: "Divorce Lawyer" not "Lawyer," "Emergency Plumber" not "Plumber")',
                'Full list of services with descriptions',
                'Accurate business hours including holidays',
                'High-quality photos (minimum 1080×1080 pixels, at least 10 photos)',
                'Service areas clearly listed (Sandton, Rosebank, Fourways — whatever suburbs you serve)',
                'Booking link or contact button',
                'Regular posts (weekly if possible)',
              ]}
            />
            <p>
              <strong>Common mistakes that kill your rankings:</strong>
            </p>
            <p>
              Keyword-stuffed business name. Don&apos;t call yourself &quot;Joe&apos;s Plumbing | Emergency Plumber Sandton Fourways Randburg 24/7.&quot; Google penalizes that. Your business name is your business name.
            </p>
            <p>
              Inconsistent business hours. If your GBP says you&apos;re open and someone calls at that time and you&apos;re closed, Google notices. Update your hours for public holidays.
            </p>
            <p>No photos. Businesses with photos get 42% more requests for directions and 35% more clicks to their website.</p>
            <p>No response to reviews. Respond to every review within 48 hours. Good or bad. It signals you&apos;re active and care.</p>
          </ArticleSection>

          <ArticleSection id="your-website-needs-local-pages" title="Your Website Needs Local Pages">
            <p>Your homepage shouldn&apos;t be your only page targeting local search. You need dedicated pages for each major suburb you serve.</p>
            <p>If you&apos;re a plumber serving Sandton, Rosebank, Fourways, and Randburg, you need four separate location pages. Not one page listing all four. Four pages.</p>
            <p>
              <strong>What each location page needs:</strong>
            </p>
            <BulletList
              items={[
                'Unique headline with the service and suburb: "Emergency Plumber in Sandton — 24/7 Response"',
                'Your full service list specific to that area',
                'Local landmarks and references: "Serving Sandton City, Melrose Arch, and Nelson Mandela Square"',
                'Testimonials from clients in that suburb if you have them',
                'Embedded Google Map showing your service area',
                'Click-to-call phone number',
                'WhatsApp button',
                'Schema markup (LocalBusiness structured data with your exact NAP — Name, Address, Phone — matching your GBP)',
              ]}
            />
            <p>
              <strong>What location pages should NOT be:</strong>
            </p>
            <p>
              Template pages with just the suburb name swapped out. Google sees through that. Write unique content for each area. Talk about the specific problems people in that suburb face. A plumber in Sandton deals with different issues than a plumber in Alexandra.
            </p>
            <p>
              Don&apos;t stuff keywords. &quot;Plumber Sandton&quot; doesn&apos;t need to appear 47 times on the page. Write naturally. Use it in the H1, a few times in the body, and in the meta description. That&apos;s enough.
            </p>
          </ArticleSection>

          <ArticleSection id="reviews-are-not-optional" title="Reviews Are Not Optional">
            <p>Reviews are the most visible trust signal for local businesses. 4.2 stars is the minimum acceptable rating in 2026. Below that and people scroll past you.</p>
            <p>
              But the star rating isn&apos;t the only thing that matters. Review velocity — how often you get new reviews — matters more than total count. 100 reviews from 2022 are worth less than 20 reviews from the past three months.
            </p>
            <p>Google looks at review recency. Reviews older than six months carry 40% less weight. You need fresh reviews constantly.</p>
            <p>
              <strong>How to get reviews without being annoying:</strong>
            </p>
            <p>
              Ask immediately after you finish the job. Not a week later. Right then. &quot;I&apos;d really appreciate it if you could leave a review on Google. Here&apos;s the link.&quot; Send the direct review link via SMS or WhatsApp.
            </p>
            <p>Make it easy. Most people don&apos;t leave reviews because it&apos;s friction. The easier you make it, the more you get. A QR code that goes straight to your review page works.</p>
            <p>Respond to every review. Thank people for good reviews. Address bad reviews professionally and offer to fix the problem. Potential customers read your responses as much as the reviews themselves.</p>
            <p>Don&apos;t buy fake reviews. Google catches it. You&apos;ll get suspended and lose all your rankings overnight.</p>
            <p>
              <strong>What good reviews should say:</strong>
            </p>
            <p>Reviews that mention specific services and locations are worth more. &quot;Joe fixed my burst pipe in Sandton within an hour&quot; is better than &quot;Great service, highly recommend.&quot;</p>
            <p>Encourage customers to be specific. &quot;It really helps me if you can mention what I fixed and where you&apos;re based in your review.&quot;</p>
          </ArticleSection>

          <ArticleSection id="citations-and-directories-that-actually-matter" title="Citations and Directories That Actually Matter">
            <p>Citations are mentions of your business name, address, and phone number on other websites. The more consistent citations you have across trusted directories, the more Google trusts that you&apos;re a real, established business.</p>
            <p>
              <strong>South African directories that matter:</strong>
            </p>
            <BulletList items={['HelloPeter', 'SA Yellow Pages', 'Brabys', 'Hotfrog', 'Cylex South Africa']} />
            <p>Start there. Get listed on all five with exact NAP (Name, Address, Phone) matching your Google Business Profile and website. Inconsistencies hurt you.</p>
            <p>
              <strong>Other platforms to claim:</strong>
            </p>
            <BulletList items={['Bing Places (yes, people use Bing)', 'Apple Business Connect (iPhone users search through Apple Maps)', 'Facebook Business Page', 'LinkedIn Company Page']} />
            <p>
              <strong>Industry-specific directories:</strong>
            </p>
            <p>If you&apos;re a medical practice, get on RateMDs and HealthPages. If you&apos;re a lawyer, get on LawyersDirectory and LegalWise. If you&apos;re an engineer or contractor, get on Snupit and Bark.</p>
            <p>Don&apos;t spam 200 low-quality directories. Focus on 15 to 20 high-quality, relevant listings. Quality beats quantity.</p>
          </ArticleSection>

          <ArticleSection id="the-ai-search-problem" title="The AI Search Problem">
            <p>ChatGPT, Perplexity, Google Gemini — people are using AI tools to search for local businesses now. These tools don&apos;t work like Google.</p>
            <p>When someone asks ChatGPT &quot;who&apos;s the best dentist in Rosebank,&quot; it pulls from Bing&apos;s index, Yelp, Foursquare, structured data on websites, and other sources. If your business isn&apos;t in those systems with clean, structured information, the AI won&apos;t recommend you.</p>
            <p>
              <strong>How to show up in AI search results:</strong>
            </p>
            <p>Make sure your website has proper schema markup. LocalBusiness schema tells AI tools exactly what you do, where you are, and how to contact you.</p>
            <p>Write FAQ sections on your website answering common questions in natural language. &quot;Who is the best electrician near Melrose?&quot; Your FAQ should answer that like a human would.</p>
            <p>Keep your information consistent everywhere. Same business name, same address, same phone number on your website, GBP, Bing, citations, everywhere. AI tools cross-reference this data. Inconsistencies make you look unreliable.</p>
            <p>Publish local content regularly. Blog posts about local events, news, case studies with suburb names and dates. AI tools pull from recent, relevant content.</p>
          </ArticleSection>

          <ArticleSection id="what-to-do-first" title="What to Do First">
            <p>You don&apos;t need to do everything at once. Here&apos;s the priority order.</p>
            <p>
              <strong>Week 1: Claim and optimize your Google Business Profile</strong>
            </p>
            <BulletList
              items={[
                'Verify your GBP',
                'Add all services',
                'Upload 10+ high-quality photos',
                'Set accurate hours and service areas',
                'Add booking link or contact button',
              ]}
            />
            <p>
              <strong>Week 2-4: Get your first 10 reviews</strong>
            </p>
            <BulletList
              items={[
                'Ask your last five happy clients',
                'Set up a review request workflow for every job you complete going forward',
                'Respond to every review you get',
              ]}
            />
            <p>
              <strong>Month 2: Build location pages</strong>
            </p>
            <BulletList
              items={[
                'Create one page per major suburb you serve',
                'Write unique content for each',
                'Add LocalBusiness schema markup',
                'Make sure NAP is exact everywhere',
              ]}
            />
            <p>
              <strong>Month 3: Citations and directories</strong>
            </p>
            <BulletList
              items={[
                'Get listed on HelloPeter, SA Yellow Pages, Brabys, Hotfrog, Cylex',
                'Claim Bing Places and Apple Business Connect',
                'Add industry-specific directories relevant to your business',
              ]}
            />
            <p>
              <strong>Ongoing: Fresh content and reviews</strong>
            </p>
            <BulletList
              items={[
                'Publish one local blog post per month minimum',
                'Keep getting reviews every week',
                'Update GBP with posts, photos, offers',
              ]}
            />
          </ArticleSection>

          <ArticleSection id="faq" title="FAQ">
            <div className="grid gap-4">
              {faqItems.map((item) => (
                <article key={item.question} className="border-t border-[#151419]/12 pt-6 dark:border-[#FBFBFB]/12">
                  <h3 className="font-playfair text-2xl font-bold leading-tight tracking-tight">
                    {item.question}
                  </h3>
                  <p className="mt-4 font-montserrat text-sm leading-7 text-[#151419]/66 dark:text-[#FBFBFB]/62">
                    {item.answer}
                  </p>
                </article>
              ))}
            </div>
          </ArticleSection>

          <section className="border-t border-[#151419]/12 py-12 dark:border-[#FBFBFB]/12">
            <h2 className="font-playfair text-[clamp(2.35rem,5vw,4.9rem)] font-bold leading-[0.95] tracking-tight text-[#151419] dark:text-[#FBFBFB]">
              Related Resources
            </h2>
            <p className="mt-8 font-montserrat text-base leading-8 text-[#151419]/70 dark:text-[#FBFBFB]/68">
              <Link href="#" className="underline decoration-[#FC6E20] underline-offset-4">
                Download: Local SEO Checklist for Johannesburg Businesses
              </Link>{' '}
              — A step-by-step checklist to get your local SEO set up in 90 days.
            </p>
          </section>

          <section className="border-t border-[#151419]/12 py-12 dark:border-[#FBFBFB]/12">
            <h2 className="font-playfair text-[clamp(2.35rem,5vw,4.9rem)] font-bold leading-[0.95] tracking-tight text-[#151419] dark:text-[#FBFBFB]">
              About the Author
            </h2>
            <p className="mt-8 font-montserrat text-base leading-8 text-[#151419]/70 dark:text-[#FBFBFB]/68">
              Delite is the founder of Kreative Reflow, a Johannesburg-based technology studio specializing in web development, SaaS products, and business automation. With seven years of experience in medical sales and neurology, Delite works with medical practices, engineering firms, and service businesses across South Africa and internationally.{' '}
              <Link href="#" className="underline decoration-[#FC6E20] underline-offset-4">
                LinkedIn
              </Link>
            </p>
          </section>
      </ArticleBody>
    </main>
  );
}
