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

const title = 'What AI SEO Actually Means for Small Business';
const metaTitle = 'AI SEO for Small Business | Kreative Reflow';
const description =
  'An AI SEO guide for small businesses in South Africa, covering AI Overviews, ChatGPT, Perplexity, FAQs, brand mentions, robots.txt, and local visibility.';
const path = '/insights/what-ai-seo-actually-means-for-small-business';
const publishedDate = '2026-05-10';

export const metadata: Metadata = pageMetadata({
  title: metaTitle,
  description,
  path,
});

const faqItems = [
  {
    question: 'Does traditional SEO still matter or is AI search replacing it?',
    answer:
      'Traditional SEO still matters. Google drives 345 times more traffic than all AI platforms combined. But AI traffic is growing 1% month over month. That compounds fast. You need both. The foundations overlap: good content, technical health, mobile optimization, local citations. AI adds a layer: answer-first structure, FAQ schema, brand mentions, presence in editorial sources.',
  },
  {
    question: 'How do I know if my business is showing up in AI search results?',
    answer:
      'Manually test it. Ask ChatGPT, Perplexity, and Gemini questions your customers would ask. "Who is the best accountant in Johannesburg for small businesses?" "Where can I find a reliable plumber in Sandton?" "What dentist in Rosebank accepts Discovery medical aid?" If you\'re not in the answer, you\'re not visible. Check monthly and track changes.',
  },
  {
    question: 'What is FAQ schema and do I need it?',
    answer:
      'FAQ schema is structured data that tells search engines and AI tools "this content is a question and answer." It helps Google show rich snippets in search results and helps AI tools extract and cite your answers. Most WordPress SEO plugins (Yoast, Rank Math) add it automatically when you format content as FAQs. Yes, you need it. It is one of the best technical additions for AI visibility.',
  },
  {
    question: 'Should I focus on ChatGPT, Perplexity, or Google AI Overviews?',
    answer:
      "Google AI Overviews first if you already rank well in Google. ChatGPT and Perplexity second. Google AI Overviews have 76% overlap with traditional Google rankings. If you rank page one, retrofitting your content with FAQ structure and schema can get you into AI Overviews fast. ChatGPT and Perplexity require different tactics: editorial presence, brand mentions, Reddit/forum participation, but reach fewer people currently.",
  },
  {
    question: 'How much should I spend on AI SEO tools?',
    answer:
      "Nothing for the first six months. Use free tools. Google Search Console. Manual querying of AI platforms. Schema validators. Google Business Profile. When you're ready to scale and need competitive intelligence, budget R2,000 to R5,000 per month for tools like Semrush or Ahrefs with AI tracking features. Most small businesses don't need paid tools yet.",
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

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto border border-[#151419]/12 bg-[#151419] p-5 font-mono text-xs leading-6 text-[#FBFBFB] dark:border-[#FBFBFB]/12 dark:bg-[#1B1B1E]">
      <code>{children}</code>
    </pre>
  );
}

export default function AiSeoSmallBusinessArticlePage() {
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
      <DynamicIslandTOC selector="#ai-seo-article [data-toc]" />

      <ArticleHero
        eyebrow="AI SEO"
        title="What AI SEO Actually Means for Small Business"
        updatedAt="May 10, 2026"
        image="/images/insights/ai-seo-small-business-search-visibility.webp"
        imageAlt="AI search visibility dashboard with answer, citation, review, and search growth signals."
        signalLabel="The shift"
        signalValue="1%"
        signalBody="AI referral traffic is growing month over month. Early movers build the citation layer now."
        signalNote="Search is becoming answer-first"
      >
        <p>ChatGPT, Perplexity, Google AI Overviews, Gemini. Everyone&apos;s talking about AI search. Most of it is hype. Some of it matters.</p>
        <p>For small businesses in South Africa, the practical change is simpler than the hype.</p>
      </ArticleHero>

      <ArticleBody
        id="ai-seo-article"
        nextArticle={{
          eyebrow: 'Pricing',
          title: 'How Much Does a Website Cost in South Africa in 2026',
          href: '/insights/website-cost-south-africa-2026',
          image: '/images/insights/website-cost-planning.webp',
          imageAlt: 'Business owner comparing website quotes and pricing breakdowns at a desk.',
        }}
      >
          <ArticleSection id="google-is-not-dead-but-it-is-not-alone" title="Google is not dead, but it is not alone">
            <p>Google still drives 345 times more website visits than ChatGPT, Perplexity, and Gemini combined. If you&apos;re ignoring traditional SEO because &quot;AI is the future,&quot; you&apos;re making a expensive mistake.</p>
            <p>But AI referral traffic is growing at 1% month over month. That compounds. Traffic doubles roughly every quarter. In two years, AI search goes from 1% of your traffic to 15% to 20%. Early movers win.</p>
            <p>The smart play is not choosing between Google and AI. It&apos;s building for both.</p>
          </ArticleSection>

          <ArticleSection id="how-ai-search-is-different" title="How AI search is different">
            <p>When someone Googles &quot;best accountant in Johannesburg,&quot; they get ten blue links to click through. When someone asks ChatGPT the same question, they get a paragraph naming two or three firms. The rest don&apos;t exist.</p>
            <p>There&apos;s no &quot;page two&quot; in AI search. You&apos;re either in the answer or you&apos;re not. That&apos;s the binary reality.</p>
            <p>
              <strong>Where AI tools get their information:</strong>
            </p>
            <p>
              <strong>ChatGPT</strong>{' '}pulls from Wikipedia (47.9% of citations), Reddit (11.3%), Forbes, Business Insider. It rarely cites top-ranking Google results. Only 12% of ChatGPT citations come from Google&apos;s first page. Strong Google rankings do not predict ChatGPT visibility. They&apos;re two separate games.
            </p>
            <p>
              <strong>Perplexity</strong>{' '}cites YouTube (13.9%), Wikipedia, Reddit (46.7%), editorial roundup sites. It credits sources with live links. Very SEO-visible compared to other AI tools.
            </p>
            <p>
              <strong>Google AI Overviews</strong>{' '}pulls mainly from sites already ranking in Google&apos;s top ten (76.1% overlap). If you rank well in Google, you have a strong chance of appearing in Google&apos;s AI answers. This is the exception. For Google&apos;s own AI tool, traditional SEO still matters most.
            </p>
            <p>
              <strong>Gemini</strong>{' '}uses Google&apos;s index plus Knowledge Graph. Strong Google Business Profile and traditional SEO feed it.
            </p>
            <p>
              <strong>Microsoft Copilot</strong>{' '}uses Bing&apos;s index. Submit your site via IndexNow for instant visibility.
            </p>
            <p>The awkward part: optimizing for one AI platform doesn&apos;t optimize for another. Domain overlap between ChatGPT and Perplexity is only 11%. You need different tactics for different tools.</p>
          </ArticleSection>

          <ArticleSection id="what-this-means-for-your-business" title="What this means for your business">
            <p>
              <strong>The zero-click problem is real.</strong>{' '}58.5% of Google searches now end without a click. Google AI Overviews answer questions directly above the search results. If you rank number one for &quot;plumber Sandton&quot; but Google&apos;s AI Overview answers the question without anyone clicking your link, your traffic drops 58%.
            </p>
            <p>The solution is not abandoning Google SEO. The solution is making sure that when Google answers the question in its AI Overview, your business is the one being cited.</p>
            <p>
              <strong>Brand mentions matter more than backlinks.</strong>{' '}Traditional SEO built authority through backlinks. AI search builds visibility through brand mentions: in reviews, articles, forum discussions, publications, social platforms.
            </p>
            <p>When ChatGPT recommends a business, it&apos;s drawing from indexed content across the web. Your website matters. But so do mentions of your brand on Hellopeter, BusinessTech, Daily Maverick, Reddit, LinkedIn, YouTube.</p>
            <p>
              <strong>FAQ content gives you a strong return.</strong>{' '}One study found that adding FAQ sections boosted AI visibility by up to 40%. This works because it mirrors exactly how people ask AI tools questions.
            </p>
            <p>Someone asks ChatGPT &quot;how much does company registration cost in South Africa.&quot; AI tools look for content that directly answers that exact question. A service page that buries the answer in paragraph seven loses. A page with a clear FAQ that states &quot;Q: How much does company registration cost in South Africa? A: [clear answer]&quot; wins.</p>
            <p>
              <strong>Mobile speed matters.</strong>{' '}Over 90% of South African internet users access the web via mobile. A slow mobile site is invisible to both Google and AI crawlers. Core Web Vitals aren&apos;t just a Google ranking factor. They&apos;re a trust signal for AI indexing.
            </p>
          </ArticleSection>

          <ArticleSection id="the-quick-wins" title="The quick wins">
            <p>These are the tactics that deliver results in weeks, not months.</p>
            <p>
              <strong>Add FAQ sections to your main pages.</strong>{' '}Use question-format headings. &quot;How long does it take to...?&quot; &quot;What is the cost of...?&quot; Answer in the first sentence. Keep answers to two to four sentences for the core response. Add FAQ schema markup.
            </p>
            <p>Example for a Johannesburg accountant:</p>
            <CodeBlock>{`Q: How much does monthly bookkeeping cost for a small business in South Africa?
A: Monthly bookkeeping for a small business in South Africa typically costs R1,500 to R4,500 depending on transaction volume and complexity. Most accountants charge based on the number of transactions processed per month.`}</CodeBlock>
            <p>Direct. Clear. Citable.</p>
            <p>
              <strong>Claim and complete your Google Business Profile.</strong>{' '}It feeds Google AI Overviews, Google Maps, Gemini. No other single action has higher ROI per hour invested for local businesses. Fill everything. Services list. Photos. Hours. Service areas. Posts. Reviews.
            </p>
            <p>
              <strong>Fix your robots.txt file.</strong>{' '}Many South African sites updated their robots.txt to block AI during the 2023 to 2024 training data debates. They accidentally blocked AI search crawlers too. Check your robots.txt. Make sure these lines exist:
            </p>
            <CodeBlock>{`User-agent: OAI-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: GPTBot
Allow: /`}</CodeBlock>
            <p>If you&apos;re blocking AI crawlers, you can&apos;t be cited. Simple fix. Massive impact.</p>
            <p>
              <strong>Ensure NAP consistency.</strong>{' '}Name, Address, Phone must be identical on your website, Google Business Profile, Hellopeter, Facebook, every directory listing. AI systems cross-reference these signals. Inconsistency reduces citation confidence.
            </p>
            <p>
              <strong>Get listed in editorial roundups.</strong>{' '}Nearly three-quarters of AI citations trace back to listicle-style content. &quot;Best accountants in Johannesburg.&quot; &quot;Top plumbers in Sandton.&quot; One mention in a trusted roundup article on BusinessTech or a local publication does more for your AI visibility than 5,000 Google reviews.
            </p>
            <p>Identify the three to five editorial sites AI tools cite most in your industry. For South African service businesses: Hellopeter, BusinessTech, Daily Maverick, regional news sites, industry association directories. Then actively pursue inclusion. Ask happy clients to review you on platforms that matter. Reach out to publishers of relevant roundup articles. Contribute expert quotes to journalists.</p>
          </ArticleSection>

          <ArticleSection id="what-does-not-work" title="What does not work">
            <p>These are the tactics businesses waste money on.</p>
            <p>
              <strong>Paying for AI visibility tools immediately.</strong>{' '}Most small businesses don&apos;t need Semrush or Ahrefs for AI tracking yet. Free tools and manual monitoring work for the first six to twelve months. Ask ChatGPT and Perplexity your main queries once a month. Check Google Search Console for AI Overview impressions. That&apos;s enough.
            </p>
            <p>
              <strong>Schema markup alone.</strong>{' '}Schema helps. But schema without strong content underneath does nothing. LLM systems prioritize relevance, topical authority, and clarity over whether content has structured data. Add schema to good content. Don&apos;t add schema to weak content and expect it to rank.
            </p>
            <p>
              <strong>Optimizing for one AI platform and assuming it transfers.</strong>{' '}ChatGPT requires different tactics than Perplexity. Success on one doesn&apos;t predict success on another. Build for multiple platforms or accept you&apos;ll only show up in some.
            </p>
            <p>
              <strong>Keyword stuffing.</strong>{' '}It never worked well. It definitely doesn&apos;t work for AI. Create specific content that AI can parse and trust. Answer questions directly. Use natural language. Be specific.
            </p>
            <p>
              <strong>Blocking AI crawlers while trying to get cited.</strong>{' '}Several businesses discovered they had old robots.txt rules blocking GPTBot or OAI-SearchBot. They wondered why ChatGPT never cited them. The crawler couldn&apos;t read their site. Check your robots.txt today.
            </p>
          </ArticleSection>

          <ArticleSection id="the-south-african-reality" title="The South African reality">
            <p>South Africa ranks in the top ten globally for ChatGPT usage. 83% market share among local AI chatbots. South African users are adopting AI search faster than most countries.</p>
            <p>That creates risk if you don&apos;t adapt. And opportunity if you move early.</p>
            <p>
              <strong>Mobile-first is mandatory.</strong>{' '}92% of South African households have at least one mobile device. 90% of internet access is mobile. If your site loads slowly on mobile data, you&apos;re invisible. Optimize for 3G connections. Compress images. Remove unnecessary scripts. Test on a real phone using mobile data, not WiFi.
            </p>
            <p>
              <strong>Voice search is growing.</strong>{' '}South Africa&apos;s median age is 27. Young demographic. Voice search through Siri, Google Assistant, Alexa is rising fast. Voice queries are conversational. &quot;Where can I find a good dentist near me?&quot; not &quot;dentist Sandton.&quot; Your content needs to answer conversational questions naturally.
            </p>
            <p>
              <strong>WhatsApp matters.</strong>{' '}AI search is growing but WhatsApp is still how most South Africans discover and share businesses. Make sure your Google Business Profile has a WhatsApp button. Make sure your website has click-to-WhatsApp. AI visibility and WhatsApp accessibility work together.
            </p>
          </ArticleSection>

          <ArticleSection id="what-to-do-first" title="What to do first">
            <p>
              <strong>Week 1: Audit and fix the basics</strong>
            </p>
            <BulletList
              items={[
                'Check robots.txt. Allow AI crawlers.',
                'Verify Google Business Profile is claimed and complete.',
                'Check NAP consistency across website, GBP, directories.',
                'Test mobile site speed on 3G. Aim for under three seconds.',
              ]}
            />
            <p>
              <strong>Week 2 to 4: Add FAQ content</strong>
            </p>
            <BulletList
              items={[
                'Identify your five most important service pages.',
                'Add a FAQ section to each with three to five questions.',
                'Use question-format headings. Answer in the first sentence.',
                'Add FAQ schema markup (most SEO plugins do this automatically).',
              ]}
            />
            <p>
              <strong>Month 2: Build presence on third-party platforms</strong>
            </p>
            <BulletList
              items={[
                'Claim listings on Hellopeter, BusinessTech directories.',
                'Get active on LinkedIn. Share insights. Answer questions.',
                'Participate in relevant Facebook groups or forums where your audience asks questions.',
                'Create helpful YouTube videos if relevant to your industry.',
              ]}
            />
            <p>
              <strong>Month 3 to 6: Monitor and iterate</strong>
            </p>
            <BulletList
              items={[
                'Check Google Search Console for AI Overview impressions.',
                'Manually query ChatGPT and Perplexity with your main search terms once a month.',
                'Track referrers in Google Analytics. Look for chatgpt.com, gemini.google.com, bing.com/chat.',
                "Double down on what works. Cut what doesn't.",
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
              Related resources
            </h2>
            <p className="mt-8 font-montserrat text-base leading-8 text-[#151419]/70 dark:text-[#FBFBFB]/68">
              Want help optimizing your website for AI search?{' '}
              <Link href="/services/seo" className="underline decoration-[#FC6E20] underline-offset-4">
                See the Local and AI SEO service
              </Link>{' '}
              for the foundations that make a business easier to find and cite.
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
