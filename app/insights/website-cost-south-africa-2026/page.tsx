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

const title = 'How Much Does a Website Cost in South Africa in 2026';
const metaTitle = 'Website Cost South Africa 2026 | Kreative Reflow';
const description =
  'Website pricing in South Africa for 2026, including small business sites, e-commerce, dashboards, SaaS builds, monthly costs, pricing models, and red flags.';
const path = '/insights/website-cost-south-africa-2026';
const publishedDate = '2026-05-10';

export const metadata: Metadata = pageMetadata({
  title: metaTitle,
  description,
  path,
});

const websiteTypes = [
  {
    title: 'Basic business website: R15,000 to R30,000',
    paragraphs: [
      'Five to ten pages. Custom design. Mobile works. SEO set up. Contact forms don\'t break. Loads fast. This is entry price for businesses serious about leads or trust.',
      'Budget agencies quote R5,000 to R10,000 for similar page counts. Those are template builds with minimal customization. You get what the template allows, not what your business needs.',
    ],
  },
  {
    title: 'E-commerce store: R25,000 to R80,000',
    paragraphs: [
      "Product catalogue. Cart. Payment gateway (PayFast, Yoco, Peach Payments). Shipping calculator. Order management. Price depends on how many products and what systems you're connecting.",
      'Basic WooCommerce with 10 to 20 products starts at R15,000. Functional e-commerce with real payment and shipping runs R30,000 to R60,000. Enterprise stores with hundreds of products, filtering, custom integrations go R80,000 to R150,000.',
    ],
  },
  {
    title: 'Custom web application or dashboard: R50,000 to R200,000',
    paragraphs: [
      'Client portals. Booking systems. Internal dashboards. CRM tools. Anything needing user logins, secure data, custom functionality moves into web app territory. Starts at R50,000 for simple tools. Complex systems exceed R200,000.',
      'Medical practices needing patient portals, engineering firms needing project tracking, service businesses needing booking and payment all fall here.',
    ],
  },
  {
    title: 'SaaS product or MVP: R80,000 to R250,000',
    paragraphs: [
      'Building software from scratch. Something users subscribe to. Something that solves a problem at scale. Minimum viable product to test an idea starts around R80,000. Production-ready SaaS costs R200,000 to R500,000. Complex multi-tenant systems exceed R1 million.',
    ],
  },
];

const featureCosts = [
  'Payment processing: R1,500 to R8,000',
  'Booking system with calendar sync: R3,000 to R10,000',
  'Member login and portal: R5,000 to R15,000',
  'Custom dashboard: R8,000 to R25,000',
  'CRM integration: R3,000 to R10,000',
  'Multi-language support: R3,000 to R10,000',
];

const faqItems = [
  {
    question: 'How much does a basic business website cost in South Africa?',
    answer:
      'Professional custom business website costs R15,000 to R30,000. Budget template-based sites cost R5,000 to R10,000 but usually need rebuilding within a year.',
  },
  {
    question: "What's the difference between a R15,000 website and a R45,000 website?",
    answer:
      'R15,000 site is clean, functional custom build with basic features. R45,000 site includes advanced features (booking systems, custom dashboards, integrations), strategic positioning, comprehensive SEO, higher-quality content.',
  },
  {
    question: 'Should I pay hourly or per project?',
    answer:
      'Pay per project for standard websites where scope is clear. Pay hourly for custom development or ongoing work where requirements evolve. Hourly rates range R200 (junior freelancers) to R1,200 (senior agency developers).',
  },
  {
    question: 'What ongoing costs should I budget for after launch?',
    answer:
      'Hosting: R80 to R500 per month. Maintenance: R500 to R1,500 per month for basic updates and monitoring. SEO and marketing: R2,000 to R10,000 per month if you want traffic. Total: R1,500 to R3,000 for small business site.',
  },
  {
    question: 'Which South African city has the cheapest web development?',
    answer:
      'Durban and Pretoria typically 10% to 15% cheaper than Johannesburg. Cape Town most expensive, agencies charging 10% to 30% more than Johannesburg for comparable work. Most agencies now work remotely. Location matters less than before.',
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

function TypeCard({ item, index }: { item: (typeof websiteTypes)[number]; index: number }) {
  return (
    <article className="border border-[#151419]/12 bg-[#FBFBFB] p-5 dark:border-[#FBFBFB]/12 dark:bg-[#1B1B1E]">
      <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-[#FC6E20]">
        {String(index + 1).padStart(2, '0')}
      </p>
      <h3 className="mt-5 font-playfair text-3xl font-bold leading-tight tracking-tight">
        {item.title}
      </h3>
      <div className="mt-6 space-y-5 font-montserrat text-sm leading-7 text-[#151419]/66 dark:text-[#FBFBFB]/62">
        {item.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}

export default function WebsiteCostArticlePage() {
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
      <DynamicIslandTOC selector="#website-cost-article [data-toc]" />

      <ArticleHero
        eyebrow="Pricing guide"
        title="How Much Does a Website Cost in South Africa in 2026"
        updatedAt="May 10, 2026"
        image="/images/insights/website-cost-planning.webp"
        imageAlt="Business owner comparing website quotes and pricing breakdowns at a desk."
        signalLabel="The short answer"
        signalValue="R15k - R30k"
        signalBody="A professional small business website in South Africa costs between R15,000 and R30,000 in 2026."
        signalNote="Built to convert"
      >
        <p>You want a website built. First question: how much?</p>
        <p>
          The answer you&apos;ll hear most is &quot;it depends.&quot; <em>True, but not helpful.</em>{' '}Here&apos;s what it actually depends on.
        </p>
      </ArticleHero>

      <ArticleBody
        id="website-cost-article"
        nextArticle={{
          eyebrow: 'Conversion',
          title: "Why Your Website Looks Good But Doesn't Convert",
          href: '/insights/why-your-website-looks-good-but-doesnt-convert',
          image: '/images/insights/website-conversion-diagnostics.webp',
          imageAlt: 'Business owner reviewing website analytics, heatmap activity, and conversion data.',
        }}
      >
          <ArticleSection id="the-short-answer" title="The short answer">
            <p>
              A professional small business website in South Africa costs between R15,000 and R30,000 in 2026. That&apos;s for custom design, five to ten pages, mobile responsive, SEO basics, contact forms. <em>Built for conversion rather than decoration.</em>
            </p>
            <p>
              You&apos;ll find cheaper. Some agencies advertise R3,000 sites, even R800. You&apos;ll find more expensive too. Cape Town premium agencies charge R50,000 to R80,000 for similar scope. The difference isn&apos;t design quality alone. It&apos;s what happens after someone lands on your site.
            </p>
            <p>
              A website that looks good but brings zero enquiries over six months costs you more than an ugly one ever would. That R3,000 template saved you money upfront. It didn&apos;t save your business anything.
            </p>
          </ArticleSection>

          <ArticleSection
            id="what-different-types-of-websites-actually-cost"
            title="What different types of websites actually cost"
          >
            <p>Not all websites are websites. Here&apos;s what you pay based on 2026 South African market rates.</p>
            <div className="grid gap-4 md:grid-cols-2">
              {websiteTypes.map((item, index) => (
                <TypeCard key={item.title} item={item} index={index} />
              ))}
            </div>
          </ArticleSection>

          <ArticleSection id="what-changes-the-price" title="What changes the price">
            <p>Two websites can look identical but cost R10,000 versus R40,000. Here&apos;s the gap.</p>

            <h3 className="font-playfair text-3xl font-bold tracking-tight text-[#151419] dark:text-[#FBFBFB]">
              Design complexity
            </h3>
            <p>
              Template with your logo and colours: R5,000 to R10,000. Custom design from scratch (wireframes, unique layouts, brand-specific elements): R15,000 to R30,000. Animations, interactive elements, completely unique visual identity add R10,000 to R20,000.
            </p>

            <h3 className="font-playfair text-3xl font-bold tracking-tight text-[#151419] dark:text-[#FBFBFB]">
              Number of pages
            </h3>
            <p>
              Most quotes assume five to ten pages. Every page beyond that costs R500 to R1,500 depending on agency. Twenty pages with individual service pages, team bios, detailed case studies cost more than five-page brochure sites.
            </p>

            <h3 className="font-playfair text-3xl font-bold tracking-tight text-[#151419] dark:text-[#FBFBFB]">
              Features and functionality
            </h3>
            <p>Every feature takes time to design, build, test. Common features on top of base website:</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {featureCosts.map((item) => (
                <div
                  key={item}
                  className="border border-[#151419]/12 bg-[#FBFBFB]/70 p-4 font-montserrat text-sm leading-7 dark:border-[#FBFBFB]/12 dark:bg-[#1B1B1E]"
                >
                  {item}
                </div>
              ))}
            </div>

            <h3 className="font-playfair text-3xl font-bold tracking-tight text-[#151419] dark:text-[#FBFBFB]">
              Content creation
            </h3>
            <p>
              Most quotes assume you provide content: words, images, structure. Need someone to write your website copy? Add R3,000 to R8,000 for five pages. Professional photography adds R3,000 to R15,000. Video production adds R10,000 to R50,000.
            </p>

            <h3 className="font-playfair text-3xl font-bold tracking-tight text-[#151419] dark:text-[#FBFBFB]">
              SEO setup
            </h3>
            <p>
              Basic SEO (meta tags, clean URLs, sitemap) usually included. Comprehensive SEO (keyword research, competitor analysis, technical optimization, content strategy) costs R5,000 to R15,000 separate.
            </p>
          </ArticleSection>

          <ArticleSection id="how-agencies-price-projects" title="How agencies price projects">
            <p>Most South African developers use one of three models.</p>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: 'Fixed project price',
                  body: 'Most common. Agree on scope, agency quotes total, you pay in stages. Typically 50% deposit and 50% completion, or 30% deposit, 30% design approval, 40% launch. Works for standard websites and e-commerce where scope is clear upfront.',
                },
                {
                  title: 'Hourly rates',
                  body: "Used for custom development where full scope isn't known. Freelancers charge R200 to R500 per hour. Mid-level developers R400 to R700. Senior developers and agencies R700 to R1,200. Hourly billing gives flexibility to change things. Final cost is unpredictable.",
                },
                {
                  title: 'Monthly subscription',
                  body: 'Some agencies offer monthly packages. Pay R500 to R1,500 per month, site stays on their platform. Lowers upfront cost but you never own the code. Stop paying, site goes offline. Works for very small businesses with limited budgets. Expensive over time. Locks you to one provider.',
                },
              ].map((item) => (
                <article
                  key={item.title}
                  className="border border-[#151419]/12 bg-[#FBFBFB]/70 p-5 dark:border-[#FBFBFB]/12 dark:bg-[#1B1B1E]"
                >
                  <h3 className="font-playfair text-2xl font-bold tracking-tight">{item.title}</h3>
                  <p className="mt-4 font-montserrat text-sm leading-7 text-[#151419]/64 dark:text-[#FBFBFB]/62">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </ArticleSection>

          <ArticleSection id="what-youll-pay-after-launch" title="What you'll pay after launch">
            <p>Build cost is the beginning. Every website has ongoing costs.</p>
            <h3 className="font-playfair text-3xl font-bold tracking-tight text-[#151419] dark:text-[#FBFBFB]">
              Hosting
            </h3>
            <p>
              Shared hosting: R80 to R300 per month. Cloud hosting for higher-traffic sites: R500 to R2,500 per month. Most agencies include hosting in maintenance packages.
            </p>
            <h3 className="font-playfair text-3xl font-bold tracking-tight text-[#151419] dark:text-[#FBFBFB]">
              Maintenance and updates
            </h3>
            <p>
              Security patches. Plugin updates. Performance monitoring. Backup management. Basic maintenance: R500 to R1,500 per month. E-commerce sites with payment processing and customer data need more active management: R1,500 to R5,000 per month.
            </p>
            <h3 className="font-playfair text-3xl font-bold tracking-tight text-[#151419] dark:text-[#FBFBFB]">
              Domain and SSL
            </h3>
            <p>
              Domain name renewal: R80 to R150 per year. SSL certificate (padlock in browser): R0 to R1,000 per year. Many hosting providers include it free.
            </p>
            <h3 className="font-playfair text-3xl font-bold tracking-tight text-[#151419] dark:text-[#FBFBFB]">
              SEO and marketing
            </h3>
            <p>
              Website with no traffic is a digital business card nobody sees. Budget R2,000 to R10,000 per month for ongoing SEO, Google Ads, or content marketing.
            </p>
          </ArticleSection>

          <ArticleSection id="the-real-cost-of-going-cheap" title="The real cost of going cheap">
            <p>Websites for R800, R1,500, R3,000 exist. Almost always bad deals. Here&apos;s what you compromise.</p>
            <p>
              Template that looks like a hundred other sites. Slow loading because code is bloated and images aren&apos;t optimized. Poor SEO because nobody spent time on technical foundation. No ongoing support. Something breaks, you&apos;re alone.
            </p>
            <div className="border-l-2 border-[#FC6E20] bg-[#151419] p-6 text-[#FBFBFB] dark:bg-[#1B1B1E] md:p-8">
              <p className="font-montserrat text-base leading-8 text-white/76">
                Most cheap websites get completely rebuilt within 12 months. A dental practice in Sandton paid R8,500 for a budget website early 2025. Looked fine. Loaded in 4.9 seconds on mobile. Converted 0.6% of visitors. Generated four enquiries in six months. They rebuilt with a proper agency for R42,000. New site loads in 1.7 seconds, converts 2.7%, brought in 32 enquiries first six months. Enough revenue to pay for itself month two.
              </p>
            </div>
            <p>
              Cheap option: R8,500 upfront plus R18,000 hidden costs and wasted time over 12 months. Premium option: R42,000, generated R612,000 attributed revenue. <em>Cheap is expensive.</em>
            </p>
          </ArticleSection>

          <ArticleSection id="what-to-watch-out-for" title="What to watch out for">
            <h3 className="font-playfair text-3xl font-bold tracking-tight text-[#151419] dark:text-[#FBFBFB]">
              Hidden costs
            </h3>
            <p>
              Some agencies quote R10,000 for build, don&apos;t mention hosting costs R300 per month, premium plugins cost R2,000 per year, content updates after handoff cost R500 per hour. Always ask for itemized quotes breaking down design, development, content, SEO, hosting, ongoing maintenance separately.
            </p>
            <h3 className="font-playfair text-3xl font-bold tracking-tight text-[#151419] dark:text-[#FBFBFB]">
              Platform lock-in
            </h3>
            <p>
              Agencies building your site on proprietary platforms or offering monthly subscriptions often don&apos;t give code ownership. Stop paying or want to move providers, you lose the site entirely. Insist on open-source platforms like WordPress unless there&apos;s compelling reason otherwise.
            </p>
            <h3 className="font-playfair text-3xl font-bold tracking-tight text-[#151419] dark:text-[#FBFBFB]">
              No discovery process
            </h3>
            <p>
              Agencies quoting price in first email without asking about your business, audience, goals are selling templates, not solutions. Proper agencies start with discovery call or detailed brief before quoting. Not asking questions means not building custom.
            </p>
            <h3 className="font-playfair text-3xl font-bold tracking-tight text-[#151419] dark:text-[#FBFBFB]">
              Vague timelines
            </h3>
            <p>
              &quot;Four to six weeks&quot; sounds reasonable until six becomes twelve. Ask for clear timeline with milestones. Standard five-page website should take two to four weeks from kickoff to launch if content and feedback provided on time.
            </p>
          </ArticleSection>

          <ArticleSection
            id="which-agencies-are-transparent-about-pricing"
            title="Which agencies are transparent about pricing"
          >
            <p>Some publish pricing publicly. Others require quotes for everything. What we found across South African agencies in 2026.</p>
            <h3 className="font-playfair text-3xl font-bold tracking-tight text-[#151419] dark:text-[#FBFBFB]">
              Highly transparent
            </h3>
            <p>
              New Perspective Design publishes full package pricing: R5,590 for five-page business site, R8,590 for lead generation, R16,900 for enterprise. Growth Pulse Media publishes detailed guides: R15,000 to R50,000 for custom WordPress, R25,000 to R80,000 for e-commerce.
            </p>
            <h3 className="font-playfair text-3xl font-bold tracking-tight text-[#151419] dark:text-[#FBFBFB]">
              Moderately transparent
            </h3>
            <p>
              Gridweb in Cape Town publishes ranges: R55,000 to R80,000 for professional business sites, R90,000 to R120,000 for e-commerce. Custom Coding lists R8,000 to R25,000 for brochure sites, R30,000 to R100,000 for e-commerce.
            </p>
            <h3 className="font-playfair text-3xl font-bold tracking-tight text-[#151419] dark:text-[#FBFBFB]">
              Less transparent
            </h3>
            <p>
              Most premium and enterprise-focused agencies don&apos;t publish pricing. Require discovery call and custom quote. <em>Not necessarily a red flag.</em>{' '}Complex projects genuinely need scoping. But you can&apos;t compare prices without contacting multiple agencies.
            </p>
          </ArticleSection>

          <ArticleSection id="what-you-should-budget" title="What you should budget">
            <p>Small business, medical practice, service provider, professional services firm wanting a website that works for your business. What to budget in 2026.</p>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ['Website build: R15,000 to R30,000', 'for proper custom site.'],
                ['Ongoing costs: R1,500 to R3,000 per month', 'for hosting, maintenance, basic SEO.'],
                ['First-year total: R33,000 to R66,000', 'including build and 12 months operation.'],
              ].map(([heading, body]) => (
                <article
                  key={heading}
                  className="border border-[#151419]/12 bg-[#151419] p-5 text-[#FBFBFB] dark:border-[#FBFBFB]/12 dark:bg-[#1B1B1E]"
                >
                  <p className="font-playfair text-2xl font-bold leading-tight">{heading}</p>
                  <p className="mt-5 font-montserrat text-sm leading-7 text-white/64">{body}</p>
                </article>
              ))}
            </div>
            <p>
              Budget smaller than R15,000? Be honest upfront. Some agencies offer scaled-down packages. Don&apos;t expect R5,000 template to compete with businesses spending R30,000 on strategy-driven custom builds. <em>Not buying the same thing.</em>
            </p>
            <p>
              Budget larger (R50,000 to R100,000)? You&apos;re in premium territory. Expect detailed discovery, custom design, advanced features, agency treating your website as business tool, not design project.
            </p>
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
              Related resources
            </h2>
            <p className="mt-8 font-montserrat text-base leading-8 text-[#151419]/70 dark:text-[#FBFBFB]/68">
              <Link href="/tools/website-rebuild-vs-refresh-quiz" className="underline decoration-[#FC6E20] underline-offset-4">
                Use the Website Rebuild vs Refresh Quiz
              </Link>{' '}
              - a quick way to decide whether the current site needs a rebuild, refresh, or focused optimization.
            </p>
          </section>

          <section className="border-t border-[#151419]/12 py-12 dark:border-[#FBFBFB]/12">
            <h2 className="font-playfair text-[clamp(2.35rem,5vw,4.9rem)] font-bold leading-[0.95] tracking-tight text-[#151419] dark:text-[#FBFBFB]">
              About the author
            </h2>
            <p className="mt-8 font-montserrat text-base leading-8 text-[#151419]/70 dark:text-[#FBFBFB]/68">
              Delite is the founder of Kreative Reflow, a Johannesburg-based technology studio specializing in web development, SaaS products, and business automation. With seven years of experience in medical sales and neurology, Delite works with medical practices, engineering firms, and service businesses across South Africa and internationally.{' '}
              <a
                href="https://www.linkedin.com/company/kreativereflow"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-[#FC6E20] underline-offset-4"
              >
                LinkedIn
              </a>
            </p>
          </section>

      </ArticleBody>
    </main>
  );
}
