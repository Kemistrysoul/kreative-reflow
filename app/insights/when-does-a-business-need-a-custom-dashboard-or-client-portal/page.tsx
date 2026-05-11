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

const title = 'When Does a Business Need a Custom Dashboard or Client Portal';
const description =
  'A practical guide to knowing when a business has outgrown spreadsheets, SaaS tools, and manual workarounds and needs a custom dashboard or client portal.';
const path = '/insights/when-does-a-business-need-a-custom-dashboard-or-client-portal';
const publishedDate = '2026-05-10';

export const metadata: Metadata = pageMetadata({
  title: `${title} | Kreative Reflow`,
  description,
  path,
});

const toc = [
  ["What We're Actually Talking About", '#what-were-actually-talking-about'],
  ["The Signs You've Outgrown Off-the-Shelf Tools", '#the-signs-youve-outgrown-off-the-shelf-tools'],
  ['When Custom Makes Sense', '#when-custom-makes-sense'],
  ['What It Actually Costs', '#what-it-actually-costs'],
  ['Industry-Specific Examples', '#industry-specific-examples'],
  ['The South African Reality', '#the-south-african-reality'],
  ['What to Do First', '#what-to-do-first'],
  ['FAQ', '#faq'],
] as const;

const faqItems = [
  {
    question: "How do I know if I've outgrown Notion or Airtable?",
    answer:
      "If your team is building complex workflows with dozens of linked tables, multiple automations, and you're hitting limits on records or API calls, you've outgrown it. If you're paying for three seats but need ten people to access data and the cost is becoming a problem, you've outgrown it. If you need client-facing access and Airtable's sharing doesn't give you the control you need, you've outgrown it.",
  },
  {
    question: "What's the difference between a low-code build and a fully custom build?",
    answer:
      "Low-code platforms (Bubble, OutSystems, Retool) let you build faster and cheaper (R50,000 to R200,000) but you're still somewhat limited by the platform. Fully custom (Laravel, Node.js, React) costs more (R200,000 to R800,000) but you have complete control. For most South African SMEs, low-code is enough for a first version.",
  },
  {
    question: 'How long does it take to build a custom portal or dashboard?',
    answer:
      'Three to six months for most SME projects. Simple booking system: two to three months. Complex multi-role portal with integrations: four to six months. Plan for at least one month of discovery and scoping before development starts.',
  },
  {
    question: 'Can I start with SaaS and migrate to custom later?',
    answer:
      "Yes, but plan for it. Export your data regularly. Don't build complex automations in tools like Zapier that will be hard to replicate. Document your workflows. When you're ready to build custom, you'll have clean requirements.",
  },
  {
    question: 'What if my custom system breaks and the developer disappears?',
    answer:
      "Insist on owning the code from day one. Host it on your own AWS or Hetzner account, not the developer's. Get documentation. Get access to the codebase repository (GitHub, GitLab). Any competent developer can pick up someone else's Laravel or Node.js code. You're not locked in.",
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

export default function CustomDashboardClientPortalArticlePage() {
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
      <DynamicIslandTOC selector="#dashboard-portal-article [data-toc]" />

      <section className="content-gutter grid min-h-screen gap-12 pb-16 pt-28 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.75fr)] lg:items-center lg:gap-16 lg:pb-24 lg:pt-32">
        <div>
          <SectionLabel>Dashboards and portals</SectionLabel>
          <h1 className="mt-7 max-w-5xl font-playfair text-[clamp(3rem,7.4vw,7.6rem)] font-bold leading-[0.92] tracking-tight">
            When Does a Business Need a Custom Dashboard or Client Portal
          </h1>
          <p className="mt-8 font-montserrat text-base font-bold leading-8 text-[#151419]/70 dark:text-[#FBFBFB]/68">
            Last updated: May 10, 2026
          </p>
          <div className="mt-10 max-w-2xl space-y-5 font-montserrat text-base leading-8 text-[#151419]/70 dark:text-[#FBFBFB]/68 md:text-lg">
            <p>Most businesses don&apos;t need custom dashboards or client portals. They need to stop using spreadsheets and start using proper tools.</p>
            <p>But some businesses hit a point where Notion, Asana, Power BI, and every other off-the-shelf tool stops working. Not because the tools are bad. Because the business has outgrown what generic software can do.</p>
            <p>This article is about recognizing that point before you waste another year forcing your team to work around tools that don&apos;t fit.</p>
          </div>
        </div>

        <aside className="border border-[#151419]/12 bg-[#151419] p-6 text-[#FBFBFB] dark:border-[#FBFBFB]/12 dark:bg-[#1B1B1E] md:p-8">
          <p className="font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#FC6E20]">
            The signal
          </p>
          <p className="mt-8 font-playfair text-5xl font-bold leading-none tracking-tight md:text-7xl">
            500 hrs
          </p>
          <p className="mt-5 font-montserrat text-sm leading-7 text-white/68">
            One person copying data for two hours a day becomes 500 hours a year.
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

        <article id="dashboard-portal-article" className="min-w-0">
          <ArticleSection id="what-were-actually-talking-about" title="What We're Actually Talking About">
            <p>Let&apos;s define terms because the market confuses these constantly.</p>
            <p>
              <strong>A custom dashboard</strong>{' '}is a reporting interface built specifically for your business. It pulls data from your systems — your ERP, your CRM, your accounting software, your field management tool — and shows you the exact KPIs you need to run the business. Not the 47 metrics Power BI thinks you need. The five you actually check every morning.
            </p>
            <p>
              <strong>A SaaS analytics tool</strong>{' '}like Power BI or Tableau is a general-purpose platform. You configure it. You don&apos;t control it. It connects to standard data sources and gives you pre-built charts. If your data fits their model, it works. If it doesn&apos;t, you spend weeks building workarounds.
            </p>
            <p>
              <strong>A client portal</strong>{' '}is a secure, branded login area where your clients see their information. Appointments. Invoices. Project status. Documents. Service history. They can book, pay, upload files, and check progress without calling you.
            </p>
            <p>
              <strong>A project management tool</strong>{' '}like Asana or Monday is for your internal team. Tasks, deadlines, collaboration. It&apos;s not built for clients to log in and see their project status.
            </p>
            <p>
              <strong>A web application</strong>{' '}is functional software accessed through a browser. It processes data, triggers workflows, calculates things, syncs systems. A website with a login just gates content. A web application does work.
            </p>
            <p>If your &quot;client portal&quot; is a password-protected page where you uploaded three PDFs, you don&apos;t have a portal. You have a filing cabinet with a lock.</p>
          </ArticleSection>

          <ArticleSection id="the-signs-youve-outgrown-off-the-shelf-tools" title="The Signs You've Outgrown Off-the-Shelf Tools">
            <p>Most businesses know they have a problem. They don&apos;t know the problem is their tools.</p>
            <p>
              <strong>You&apos;re living in spreadsheets.</strong>
            </p>
            <p>One sheet for jobs. One for invoices. One for client contacts. One for stock. One for schedules. Every Monday your office manager spends two hours reconciling them all manually. If any of that sounds familiar, you&apos;ve outgrown spreadsheets.</p>
            <p>Off-the-shelf tools like Notion or Airtable can organize this better. But if your data sources are WhatsApp logs, handwritten job cards, and EFTs with no payment references, no SaaS tool will fix it. You need a system that captures data at the source.</p>
            <p>
              <strong>Clients keep asking where things are.</strong>
            </p>
            <p>&quot;Where&apos;s my invoice?&quot; &quot;When is my appointment?&quot; &quot;What&apos;s the status of my project?&quot; If your team spends half the day answering questions that could be answered by a system, you need a client portal.</p>
            <p>But only if it&apos;s connected to your actual data. A static FAQ page doesn&apos;t help. The portal needs to pull live information from your job management system, your accounting software, your booking calendar.</p>
            <p>
              <strong>You can&apos;t answer &quot;how are we doing&quot; in under ten minutes.</strong>
            </p>
            <p>Someone asks for monthly revenue, outstanding invoices, or job pipeline. It takes you a day to compile the answer because the data lives in five places and none of them talk to each other.</p>
            <p>Off-the-shelf dashboards assume clean data. South African SMEs have messy data. Cash jobs. EFTs with no references. Client names entered three different ways. A generic dashboard won&apos;t fix that. You need a custom system that knows how your business actually works.</p>
            <p>
              <strong>Staff spend hours copying data between systems.</strong>
            </p>
            <p>Your process: WhatsApp quote, job card, material list, on-site photo, invoice, follow-up SMS. No single tool handles that end-to-end. So your team copies data from WhatsApp to Excel to your accounting system to email. Every. Single. Job.</p>
            <p>If one person does this for two hours a day, that&apos;s 500 hours a year. At R200 per hour, that&apos;s R100,000 in wasted labor. A custom system that automates the whole flow costs R150,000 to R300,000 to build and pays for itself in 18 months.</p>
            <p>
              <strong>You&apos;re in a regulated industry and generic tools don&apos;t cut it.</strong>
            </p>
            <p>Medical practices need POPIA-compliant audit logs showing who accessed which patient record when. Legal firms need SARS audit trails. Engineering firms need specific reporting formats for municipal contracts.</p>
            <p>Generic tools don&apos;t build this in. You either build workarounds (expensive, fragile) or you build custom (expensive, permanent).</p>
          </ArticleSection>

          <ArticleSection id="when-custom-makes-sense" title="When Custom Makes Sense">
            <p>Custom makes sense when the software runs a workflow that&apos;s core to how you make money.</p>
            <p>
              <strong>You serve clients in a unique way that&apos;s your competitive advantage.</strong>{' '}A Johannesburg law firm that handles Afrikaans, English, and isiXhosa clients needs a portal that adapts to language and cultural context. Off-the-shelf tools don&apos;t do that. Custom can.
            </p>
            <p>
              <strong>Your competitors don&apos;t have portals and clients are starting to ask for them.</strong>{' '}In Sandton professional services, clients now expect to log in and see project status in real time. If you&apos;re still emailing PDF updates and your competitor offers a live portal, you lose the client.
            </p>
            <p>
              <strong>You&apos;re scaling past 20 people and tribal knowledge is breaking.</strong>{' '}WhatsApp plus Excel works for five people. It collapses at 20. When the person who knows how to reconcile jobs with invoices leaves, the whole system falls apart. You need software that captures the process, not a person who remembers it.
            </p>
            <p>
              <strong>You need to integrate with South African-specific systems.</strong>{' '}SARS eFiling. Medical aid APIs (Discovery, Medihelp). Payment gateways (Yoco, PayFast, Ozow). Banking APIs. Off-the-shelf international tools rarely connect to these natively. Custom can.
            </p>
            <p>
              <strong>The total cost of your SaaS stack is getting ridiculous.</strong>{' '}You&apos;re paying R15,000 to R30,000 per month across Notion, Asana, Xero, a CRM, a booking tool, and three integration subscriptions. They still don&apos;t talk to each other properly. And every time you add a user, the bill goes up.
            </p>
            <p>A custom system costs R300,000 to R600,000 to build. At R20,000 per month SaaS spend, that&apos;s 15 to 30 months to break even. After that, you only pay R3,000 to R6,000 per month for hosting and maintenance. No per-user fees. No forced upgrades. You own it.</p>
          </ArticleSection>

          <ArticleSection id="what-it-actually-costs" title="What It Actually Costs">
            <p>Don&apos;t compare a R0 spreadsheet or R200 per user SaaS against a custom quote. Compare total cost over three years.</p>
            <p>
              <strong>SaaS costs to include:</strong>
            </p>
            <BulletList
              items={[
                'User licenses (R150 to R500 per user per month)',
                'Add-ons and automations (R2,000 to R10,000 per month)',
                'Integration subscriptions (Zapier, Make: R1,500 to R8,000 per month)',
                'Time spent maintaining workarounds (10 to 20 hours per month at R200 to R500 per hour)',
                'Data export and migration friction when you eventually leave',
              ]}
            />
            <p>For a 15-person team using Notion, Asana, Power BI, and two integration tools, that&apos;s easily R18,000 to R35,000 per month. Over three years: R648,000 to R1.26 million.</p>
            <p>
              <strong>Custom costs:</strong>
            </p>
            <BulletList
              items={[
                'Build: R150,000 to R600,000 depending on complexity',
                'Hosting: R500 to R3,000 per month',
                'Maintenance: 15% to 25% of build cost annually',
              ]}
            />
            <p>A R300,000 custom build costs R300,000 upfront, then R45,000 to R75,000 per year ongoing. Over three years: R435,000 to R525,000.</p>
            <p>Custom becomes cheaper after two to three years. And you own it. No vendor lock-in. No price increases. No per-user fees when you hire your 21st employee.</p>
          </ArticleSection>

          <ArticleSection id="industry-specific-examples" title="Industry-Specific Examples">
            <p>
              <strong>Medical Practices</strong>
            </p>
            <p>Patients want to book online, view test results, check appointment times, and see what their medical aid covered. Practice management software like Medtech has basic portals but they&apos;re clunky, not mobile-first, and don&apos;t integrate cleanly with Discovery or Momentum APIs.</p>
            <p>A custom patient portal can auto-submit claims via medical aid API, show real-time appointment availability synced to your practice system, send WhatsApp reminders (70% of South African patients prefer WhatsApp), and log every data access for POPIA compliance.</p>
            <p>Cost: R200,000 to R600,000. Pays for itself in reduced admin time and fewer missed appointments within 18 to 24 months.</p>
            <p>
              <strong>Engineering Firms</strong>
            </p>
            <p>Clients want to see project milestones, drawing revisions, RFI status, payment schedules, site photos, and progress reports. Asana can track internal tasks but it doesn&apos;t handle engineering-specific workflows like SACPCMP documentation, snag lists, or version-controlled drawings.</p>
            <p>A custom project portal lets clients log in and see everything in one place. Auto-generated monthly reports pull photos from site, costs from time entries, delays from milestone tracking. No more spending two days per month compiling PDF reports.</p>
            <p>Cost: R250,000 to R800,000 depending on document management complexity.</p>
            <p>
              <strong>Service Businesses</strong>
            </p>
            <p>Plumbers, electricians, cleaners, solar installers. Clients want to book online, track their technician in real time, see service history, and get invoices automatically.</p>
            <p>Calendly handles appointments but not field service. It doesn&apos;t account for travel time, multi-person dispatch, or job duration estimates. A custom booking system can handle: client books online, system auto-assigns nearest available tech, sends WhatsApp confirmation with tech name and ETA, tracks job in real time, auto-generates invoice on completion.</p>
            <p>Cost: R100,000 to R350,000.</p>
            <p>
              <strong>Professional Services</strong>
            </p>
            <p>Law firms, accountants, consultants. Clients want case status, document access, billing transparency, secure messaging, and deadline tracking.</p>
            <p>Generic practice management tools are expensive and don&apos;t give clients a good experience. A custom client portal shows: matter status, uploaded documents, invoices, next steps, secure messaging. Like tracking a parcel, but for legal work.</p>
            <p>Cost: R300,000 to R700,000.</p>
          </ArticleSection>

          <ArticleSection id="the-south-african-reality" title="The South African Reality">
            <p>
              <strong>POPIA Compliance</strong>
            </p>
            <p>If you handle medical records, financial data, or employee information, POPIA isn&apos;t optional. You need audit logs showing who accessed what personal data and when. You need consent management. You need data stored in South Africa ideally. You need breach notification within 72 hours.</p>
            <p>Most international SaaS tools store data in the US or EU. Their terms of service don&apos;t align with POPIA. If they&apos;re breached, you might not know for weeks. But you&apos;re legally required to report within 72 hours.</p>
            <p>A custom portal hosted on AWS Cape Town or Hetzner South Africa gives you full control. You choose where data lives. You log every access. You delete data immediately when a client requests it. You can prove compliance.</p>
            <p>
              <strong>Load Shedding and Connectivity</strong>
            </p>
            <p>Your portal must work offline. Not &quot;mostly work.&quot; Actually work. Progressive Web App architecture with service workers means data syncs when the connection returns.</p>
            <p>92% of South African internet users are mobile. 40% are on 3G or worse. Your portal must load in under three seconds on a slow connection. No 4MB JavaScript bundles. Compressed images. Lazy loading.</p>
            <p>Off-the-shelf tools hosted on US servers add 300 to 800ms latency before the app even renders. That&apos;s why WhatsApp feels fast and your Monday.com board feels slow. Host in South Africa.</p>
            <p>
              <strong>WhatsApp Integration</strong>
            </p>
            <p>WhatsApp is the internet for many South Africans. Your portal should integrate with WhatsApp, not replace it. Send portal links via WhatsApp. Let clients check status via WhatsApp when the portal is too much. Auto-confirm bookings via WhatsApp.</p>
            <p>Any portal that ignores WhatsApp is dead on arrival in the South African market.</p>
          </ArticleSection>

          <ArticleSection id="what-to-do-first" title="What to Do First">
            <p>
              <strong>If you&apos;re solo or under five people:</strong>{' '}Don&apos;t build custom. Use Notion, Xero, Calendly. R2,000 to R5,000 per month total. Revisit when you hit ten people or R500,000 per month revenue.
            </p>
            <p>
              <strong>If you&apos;re 5 to 15 people, R500,000 to R2 million per month revenue:</strong>{' '}This is the sweet spot for custom. Keep Xero for accounting. Build a custom portal and dashboard. Cost: R150,000 to R300,000. Break even in 18 months.
            </p>
            <p>
              <strong>If you&apos;re 15 to 50 people, R2 million to R10 million per month revenue:</strong>{' '}Custom is now cheaper than SaaS at this scale. Your SaaS bill is R15,000 to R50,000 per month and rising. Build your core systems custom. Cost: R300,000 to R800,000.
            </p>
            <p>
              <strong>If you&apos;re 50+ people, R10 million+ per month revenue:</strong>{' '}Full custom is essential. Invest R500,000 to R2 million in a proper system. Host in South Africa. POPIA-compliant. Mobile-first. Offline-capable.
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
              Related Resources
            </h2>
            <p className="mt-8 font-montserrat text-base leading-8 text-[#151419]/70 dark:text-[#FBFBFB]/68">
              <Link href="#" className="underline decoration-[#FC6E20] underline-offset-4">
                Download: Dashboard Requirements Template
              </Link>{' '}
              — A worksheet to help you think through what you actually need in a custom dashboard before you talk to a developer.
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
