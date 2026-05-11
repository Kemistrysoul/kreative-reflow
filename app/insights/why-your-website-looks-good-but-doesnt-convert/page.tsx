import type { Metadata } from 'next';
import type React from 'react';
import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { DynamicIslandTOC } from '@/components/ui/dynamic-island-toc';
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
  siteName,
} from '@/lib/seo';

const title = "Why Your Website Looks Good But Doesn't Convert";
const description =
  "Why good-looking websites fail to convert, and how South African service businesses can diagnose speed, messaging, mobile, trust, and CTA problems.";
const path = '/insights/why-your-website-looks-good-but-doesnt-convert';
const publishedDate = '2026-05-10';

export const metadata: Metadata = pageMetadata({
  title: `${title} | Kreative Reflow`,
  description,
  path,
});

const toc = [
  ["The Problem Most Business Owners Don't See", '#the-problem-most-business-owners-dont-see'],
  ["Your Website Isn't a Portfolio Piece", '#your-website-isnt-a-portfolio-piece'],
  ['What Actually Kills Conversions', '#what-actually-kills-conversions'],
  ['The Mobile Problem Nobody Talks About', '#the-mobile-problem-nobody-talks-about'],
  ['Why Beautiful Websites Fail', '#why-beautiful-websites-fail'],
  ['Trust Is Everything in South Africa', '#trust-is-everything-in-south-africa'],
  ['How to Diagnose Your Conversion Problem', '#how-to-diagnose-your-conversion-problem'],
  ['FAQ', '#faq'],
] as const;

const faqItems = [
  {
    question: "What's a good conversion rate for a South African business website?",
    answer:
      "Service businesses should aim for 4% to 10%. E-commerce sites should hit 2% to 4%. Medical practices should see 3% to 7%. B2B sites targeting qualified leads should convert at 3% to 8%. If you're below 2% across the board, you have significant conversion issues.",
  },
  {
    question: 'How do I know if I have a traffic problem or a conversion problem?',
    answer:
      "Check your analytics. If you're getting fewer than 500 visitors per month, you have a traffic problem. If you're getting 2,000+ visitors per month but fewer than 40 leads, you have a conversion problem. Fixing conversion is cheaper and faster than buying more traffic.",
  },
  {
    question: "What's the fastest way to improve my website's conversion rate?",
    answer:
      "Three changes give the biggest immediate lift: (1) Speed up your mobile load time to under three seconds. (2) Rewrite your homepage headline to state exactly what you do and who it's for. (3) Reduce your contact form to three fields maximum. These three changes can double your conversion rate in two weeks.",
  },
  {
    question: 'Why do people leave my site without calling or filling out the form?',
    answer:
      "Most likely: your site is slow, your value proposition is unclear, you're not building trust fast enough, your call-to-action isn't obvious, or your form asks for too much information too early. Check your mobile speed first. That's the most common killer.",
  },
  {
    question: 'Should I redesign my website or just fix conversion issues?',
    answer:
      "If your site loads fast, works on mobile, and looks professional, don't redesign. Fix the conversion issues: clarify your messaging, add trust signals, simplify your forms, add click-to-call and WhatsApp. A full redesign costs R30,000 to R80,000. Conversion fixes cost R5,000 to R15,000 and often deliver better results.",
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.28em] text-[#FC6E20]">
      [ {children} ]
    </p>
  );
}

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

function NumberedList({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="grid gap-3 pl-0">
      {items.map((item, index) => (
        <li key={index} className="grid grid-cols-[2rem_1fr] gap-3">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#FC6E20]">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

export default function WebsiteConversionArticlePage() {
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
    <main className="relative min-h-screen overflow-x-clip bg-[#F0EFED] text-[#151419] selection:bg-[#FC6E20] selection:text-[#151419] [--left-gutter:4.5rem] [--right-gutter:1rem] dark:bg-[#151419] dark:text-[#FBFBFB] sm:[--left-gutter:4.75rem] sm:[--right-gutter:1.5rem] lg:[--left-gutter:5.5rem] lg:[--right-gutter:3.5rem] xl:[--right-gutter:4rem]">
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
      <DynamicIslandTOC selector="#conversion-article [data-toc]" />

      <section className="content-gutter grid min-h-screen gap-12 pb-16 pt-28 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.75fr)] lg:items-center lg:gap-16 lg:pb-24 lg:pt-32">
        <div>
          <SectionLabel>Conversion</SectionLabel>
          <h1 className="mt-7 max-w-5xl font-playfair text-[clamp(3rem,7.4vw,7.6rem)] font-bold leading-[0.92] tracking-tight">
            Why Your Website Looks Good But Doesn&apos;t Convert
          </h1>
          <p className="mt-8 font-montserrat text-base font-bold leading-8 text-[#151419]/70 dark:text-[#FBFBFB]/68">
            Last updated: May 10, 2026
          </p>
          <div className="mt-10 max-w-2xl space-y-5 font-montserrat text-base leading-8 text-[#151419]/70 dark:text-[#FBFBFB]/68 md:text-lg">
            <p>Most business owners think their website problem is traffic. Wrong. You don&apos;t need more visitors if the ones you have aren&apos;t converting.</p>
          </div>
        </div>

        <aside className="border border-[#151419]/12 bg-[#151419] p-6 text-[#FBFBFB] dark:border-[#FBFBFB]/12 dark:bg-[#1B1B1E] md:p-8">
          <p className="font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#FC6E20]">
            The leak
          </p>
          <p className="mt-8 font-playfair text-5xl font-bold leading-none tracking-tight md:text-7xl">
            0.2%
          </p>
          <p className="mt-5 font-montserrat text-sm leading-7 text-white/68">
            A good-looking website can still leave customers on the table if the buyer cannot decide and act.
          </p>
        </aside>
      </section>

      <div className="content-gutter grid gap-12 pb-24 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
        <aside className="hidden lg:block">
          <nav className="sticky top-28 border border-[#151419]/12 bg-[#FBFBFB]/70 p-5 dark:border-[#FBFBFB]/12 dark:bg-[#1B1B1E]">
            <p className="font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#878787]">
              Table of Contents
            </p>
            <div className="mt-5 grid gap-3">
              {toc.map(([item, href]) => (
                <a
                  key={href}
                  href={href}
                  className="font-montserrat text-sm text-[#151419]/62 transition-colors hover:text-[#FC6E20] dark:text-[#FBFBFB]/58"
                >
                  {item}
                </a>
              ))}
            </div>
          </nav>
        </aside>

        <article id="conversion-article" className="min-w-0">
          <ArticleSection id="the-problem-most-business-owners-dont-see" title="The Problem Most Business Owners Don't See">
            <p>You spent R30,000 on a website. It looks professional. Clean design. Nice photos. Your logo looks sharp. You launched it six months ago.</p>
            <p>You&apos;ve had 4,000 visitors. You got eight enquiries. That&apos;s a 0.2% conversion rate.</p>
            <p>The problem isn&apos;t that people can&apos;t find your site. The problem is what happens after they land on it.</p>
            <p>A professional service business should convert at 4% to 10%. An e-commerce store should hit 2% to 4%. Medical practices should see 3% to 7%. If you&apos;re below those numbers, your website is costing you money every day.</p>
            <p>
              <strong>At 0.2% conversion, you&apos;re leaving 150 to 390 potential customers on the table every month.</strong>{' '}For a service business charging R5,000 per client, that&apos;s R750,000 to R1.95 million in lost annual revenue. From a website that &quot;looks good.&quot;
            </p>
          </ArticleSection>

          <ArticleSection id="your-website-isnt-a-portfolio-piece" title="Your Website Isn't a Portfolio Piece">
            <p>Most agencies build websites that win design awards but fail commercially. They create portfolio pieces, not business tools.</p>
            <p>A portfolio piece shows what the designer can do. A business tool helps a buyer decide and act.</p>
            <p>Here&apos;s the difference:</p>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="border border-[#151419]/12 bg-[#FBFBFB]/70 p-5 dark:border-[#FBFBFB]/12 dark:bg-[#1B1B1E]">
                <h3 className="font-playfair text-2xl font-bold tracking-tight">Portfolio Piece (Design-Focused)</h3>
                <div className="mt-5">
                  <BulletList
                    items={[
                      'Opens with a video background and animated text',
                      'Multiple CTAs competing for attention',
                      'Navigation with 12 options',
                      'Stock photos of people in suits shaking hands',
                      'Tagline: "Empowering your digital future"',
                      'No testimonials above the fold',
                      'Designed on a 27-inch monitor',
                    ]}
                  />
                </div>
              </article>
              <article className="border border-[#151419]/12 bg-[#151419] p-5 text-[#FBFBFB] dark:border-[#FBFBFB]/12 dark:bg-[#1B1B1E]">
                <h3 className="font-playfair text-2xl font-bold tracking-tight">Business Tool (Conversion-Focused)</h3>
                <div className="mt-5 text-white/76">
                  <BulletList
                    items={[
                      'Opens with a clear headline stating exactly what you do',
                      'One obvious next step',
                      'Navigation with 5 items maximum',
                      'Real photos of your actual team or work',
                      'Headline: "Accounting for Johannesburg SMEs — fixed monthly fee, no surprises"',
                      'Client logos and testimonials immediately visible',
                      'Designed and tested on a phone first',
                    ]}
                  />
                </div>
              </article>
            </div>
            <p>The first one impresses other designers. The second one brings in leads.</p>
          </ArticleSection>

          <ArticleSection id="what-actually-kills-conversions" title="What Actually Kills Conversions">
            <p>Speed kills conversions faster than anything else. A site that takes five seconds to load on mobile converts at half the rate of a site that loads in two seconds.</p>
            <p>In South Africa, where 80% of web traffic is mobile and most people are on prepaid data, speed isn&apos;t a nice-to-have. It&apos;s the difference between someone seeing your site and someone hitting back before it loads.</p>
            <p>Your website loads a 4MB video background, three tracking scripts, a chatbot that opens automatically, and twelve unoptimized images before showing the visitor what you actually do. They&apos;re gone before they see it.</p>
            <p>
              <strong>Unclear value proposition is the second killer.</strong>{' '}Visitor lands on your homepage. Five seconds later, can they answer these three questions?
            </p>
            <NumberedList items={['What does this business do?', 'Is it for me?', 'What should I do next?']} />
            <p>If the answer to any of those is no, they leave.</p>
            <p>Most South African business websites open with vague statements. &quot;Leading provider of innovative solutions.&quot; &quot;Empowering businesses for tomorrow.&quot; &quot;Your trusted partner in excellence.&quot;</p>
            <p>None of that tells me what you do or why I should care.</p>
            <p>Compare that to: &quot;We install solar systems that save Cape Town homes R3,200 per month on average. Book your free site assessment.&quot;</p>
            <p>One is clear. One converts.</p>
            <p>
              <strong>Weak calls to action are the third killer.</strong>{' '}Your website has four buttons competing for attention: &quot;Learn More,&quot; &quot;Contact Us,&quot; &quot;Our Services,&quot; &quot;Get Started.&quot; Which one should I click?
            </p>
            <p>When everything is important, nothing is important. One clear call to action per page. That&apos;s it.</p>
            <p>
              <strong>Forms with too many fields kill conversions.</strong>{' '}Every field you add to a contact form drops your conversion rate by 11%. A form with nine fields converts at half the rate of a form with three fields.
            </p>
            <p>You&apos;re asking for name, email, phone, company, industry, budget, project timeline, preferred contact method, and &quot;tell us about your project.&quot; That&apos;s</p>
            <p>eight fields before someone who doesn&apos;t know you yet is willing to hand over their information.</p>
            <p>Cut it to three: name, email or phone, and a one-line message. You can get the rest on the call.</p>
          </ArticleSection>

          <ArticleSection id="the-mobile-problem-nobody-talks-about" title="The Mobile Problem Nobody Talks About">
            <p>Your website was designed on a desktop. It looks perfect on your laptop. On a phone, it&apos;s broken.</p>
            <p>Text too small to read without zooming. Buttons too close together to tap accurately. Menu doesn&apos;t work. Forms require horizontal scrolling. Phone number isn&apos;t clickable.</p>
            <p>In South Africa, mobile isn&apos;t optional. DataReportal&apos;s 2026 report shows 127 million mobile connections for 51.7 million internet users. People are browsing on phones, not desktops.</p>
            <p>If your mobile experience is bad, 80% of your potential customers are seeing a bad experience.</p>
            <p>The specific mobile killers in South Africa:</p>
            <p>
              <strong>No click-to-call button.</strong>{' '}Someone searches &quot;plumber Sandton&quot; on their phone at 9pm because a pipe just burst. They land on your site. Your phone number is listed as plain text. They have to copy it, open the dialer, paste it, and call. Or they hit back and call the next result who has a big green &quot;Call Now&quot; button.
            </p>
            <p>
              <strong>No WhatsApp integration.</strong>{' '}WhatsApp has 45 million users in South Africa. For many people, it&apos;s easier to send a WhatsApp than fill a form. Sites without a WhatsApp button are leaving 30% to 50% of potential conversions on the table.
            </p>
            <p>
              <strong>Slow loading on mobile data.</strong>{' '}Average mobile download speed in South Africa is 22.64 Mbps. That&apos;s not fast. If your site is 4MB of images and scripts, it takes eight seconds to load on a decent 4G connection. Most people are gone by second three.
            </p>
          </ArticleSection>

          <ArticleSection id="why-beautiful-websites-fail" title="Why Beautiful Websites Fail">
            <p>Design matters. But design without strategy is decoration.</p>
            <p>The slider at the top of your homepage looks great. Five slides with beautiful imagery cycling through your services. Conversion research shows sliders kill engagement. People ignore them because they look like ads. The messaging changes before anyone reads it. And on mobile, they&apos;re actively distracting.</p>
            <p>The parallax scrolling effect where images move at different speeds looks impressive. It also adds three seconds to your load time and makes people dizzy on small screens.</p>
            <p>The video background on your homepage is stunning. It&apos;s also 8MB and pushes your call-to-action below the fold on every device smaller than a laptop.</p>
            <p>All of these choices prioritize aesthetics over results. A plain site with clear messaging, fast loading, and an obvious next step will outperform a beautiful site with vague copy and slow speed every single time.</p>
          </ArticleSection>

          <ArticleSection id="trust-is-everything-in-south-africa" title="Trust Is Everything in South Africa">
            <p>South Africans have been burned. Scam websites. Fake online stores. Businesses that take payment and disappear. The default position is skepticism.</p>
            <p>Your website has to overcome that in seconds, or they leave.</p>
            <p>
              <strong>Trust signals that matter:</strong>
            </p>
            <p>Real testimonials with names and photos. Not &quot;Great service! - John.&quot; Real testimonials: &quot;Delite built our practice website and patient bookings went up 34% in three months. Best decision we made this year. - Dr. Sarah Mbatha, Sandton Family Practice.&quot;</p>
            <p>Client logos. If you&apos;ve worked with recognizable companies, show them. If you haven&apos;t, show local businesses people might know.</p>
            <p>Physical address and local phone number. A Gmail address and a contact form with no other details is a red flag. Show where you&apos;re based. Show a phone number with a Johannesburg or Cape Town area code.</p>
            <p>Accepted payment methods. For e-commerce, show PayFast, Yoco, SnapScan. These are local, trusted payment systems. A site showing only Visa and Mastercard feels foreign.</p>
            <p>Google reviews. Link to your Google Business Profile. If you have 4.8 stars and 47 reviews, that&apos;s worth more than anything you can say about yourself.</p>
            <p>Medical aid logos for healthcare. Dentists and doctors: if you accept Discovery, Momentum, Medshield, show those logos. Patients check this before they call.</p>
            <p>Security badges. SSL certificate (the padlock in the browser) is non-negotiable. POPIA compliance notice shows you take data privacy seriously.</p>
          </ArticleSection>

          <ArticleSection id="how-to-diagnose-your-conversion-problem" title="How to Diagnose Your Conversion Problem">
            <p>Most business owners guess. Don&apos;t guess. Look at the data.</p>
            <p>
              <strong>Google Analytics</strong>{' '}shows exactly where people leave. If 80% of visitors leave your homepage without clicking anything, your value proposition or speed is broken. If they reach your contact page and 70% leave without submitting, your form is the problem.
            </p>
            <p>
              <strong>Heatmaps</strong>{' '}show where people click and how far they scroll. Use Microsoft Clarity or Hotjar. You might discover people are clicking an image thinking it&apos;s a link. Or that nobody scrolls past your hero section because the headline didn&apos;t hook them.
            </p>
            <p>
              <strong>Speed test</strong>{' '}your site on mobile. Use Google PageSpeed Insights or GTmetrix. If your mobile score is below 70 and your load time is above three seconds, that&apos;s your first fix.
            </p>
            <p>
              <strong>Test your own site on your phone using mobile data.</strong>{' '}Not WiFi. Mobile data. Can you read the text without zooming? Can you tap buttons accurately? Can you call or WhatsApp in one tap? Can you fill out the contact form without horizontal scrolling?
            </p>
            <p>If you can&apos;t, your customers can&apos;t either.</p>
            <p>
              <strong>Questions to ask yourself:</strong>
            </p>
            <BulletList
              items={[
                'Can a first-time visitor figure out what I do in five seconds?',
                'Is my primary call-to-action visible without scrolling on mobile?',
                'Do I show proof (testimonials, reviews, client logos) before asking for contact details?',
                'Is my phone number clickable on mobile?',
                'Do I have a WhatsApp button?',
                'Does my site load in under three seconds on 4G?',
                'Do I have Google Analytics set up to track conversions?',
                'Can someone in my target market look at this site and think "this is for me"?',
              ]}
            />
            <p>If you answered no to more than two of those, you have conversion problems worth fixing.</p>
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
              Want to improve your website&apos;s conversion rate?{' '}
              <Link href="#" className="underline decoration-[#FC6E20] underline-offset-4">
                Book a free conversion audit
              </Link>{' '}
              and we&apos;ll show you exactly what&apos;s holding your site back.
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
        </article>
      </div>
    </main>
  );
}
