import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, FileText } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import {
  absoluteUrl,
  breadcrumbJsonLd,
  pageMetadata,
  siteName,
  siteUrl,
} from '@/lib/seo';

const lastUpdated = '30 May 2026';

export const metadata: Metadata = pageMetadata({
  title: 'Terms of Service | Kreative Reflow',
  description:
    'The terms that apply when you use the Kreative Reflow website, diagnostic tools, project enquiry forms, and digital infrastructure services.',
  path: '/terms',
});

const termSections = [
  {
    title: '1. Using this website',
    body: [
      'These Terms of Service apply when you visit kreativereflow.com, use our tools, submit an enquiry, request a resource, or engage Kreative Reflow for services.',
      'By using the website, you agree to use it lawfully, honestly, and in a way that does not damage the website, interfere with other users, or attempt to access systems or data without permission.',
    ],
  },
  {
    title: '2. Website content and diagnostic tools',
    body: [
      'The website, insights, tools, calculators, scorecards, and resources are provided for general business information. They are designed to help you think clearly about websites, visibility, lead response, automation, and digital systems.',
      'Tool outputs are not a guarantee of performance, revenue, ranking, compliance, or project results. Final recommendations depend on the information you provide, the technical state of your website or systems, and the scope agreed in writing.',
    ],
  },
  {
    title: '3. Project enquiries and proposals',
    body: [
      'Submitting a form or booking a conversation does not create a client relationship by itself. A project starts only when the scope, fees, timeline, responsibilities, and acceptance process are agreed in writing.',
      'If a proposal, statement of work, quote, invoice, or signed agreement includes terms that differ from this page, the project-specific document will apply to that project.',
    ],
  },
  {
    title: '4. Services',
    body: [
      'Kreative Reflow may provide website design and development, SaaS and custom web application work, local and AI SEO foundations, automation, consulting, maintenance, and related digital infrastructure services.',
      'The exact deliverables, revisions, support level, integrations, deployment approach, and handover requirements will be defined in the accepted project scope.',
    ],
  },
  {
    title: '5. Client responsibilities',
    body: [
      'To keep a project moving, clients need to provide accurate information, required access, content, approvals, feedback, brand assets, account permissions, and decision-makers within agreed timelines.',
      'Delays in feedback, access, content, payment, or approvals may affect delivery dates and may require the timeline or scope to be revised.',
    ],
    list: [
      'Provide rights to use supplied copy, images, logos, data, and assets.',
      'Check all factual, legal, regulatory, pricing, claims, and industry-specific content before launch.',
      'Keep login credentials, admin accounts, and internal systems secure.',
      'Tell us promptly about technical issues, business changes, or new requirements that affect the work.',
    ],
  },
  {
    title: '6. Fees, payments, and third-party costs',
    body: [
      'Fees, payment milestones, due dates, and cancellation terms are set out in the relevant proposal, invoice, or written agreement.',
      'Unless clearly included in writing, third-party costs such as domains, hosting, paid plugins, email tools, SaaS subscriptions, advertising spend, payment processor fees, fonts, stock assets, or external licences remain the client responsibility.',
    ],
  },
  {
    title: '7. Ownership and intellectual property',
    body: [
      'Once the agreed fees for a project are paid, the client receives ownership of the final approved deliverables specifically created for that project, subject to any third-party licences and any separate written agreement.',
      'Kreative Reflow retains ownership of pre-existing tools, methods, know-how, templates, reusable code patterns, internal processes, and non-client-specific materials used to deliver the work.',
    ],
  },
  {
    title: '8. Launch, support, and maintenance',
    body: [
      'A launch or handover does not automatically include ongoing maintenance, monitoring, content updates, emergency support, feature development, or third-party service management unless those items are included in the project scope or support plan.',
      'Websites and systems rely on browsers, hosting, APIs, plugins, platforms, search engines, and third-party services that may change over time. Maintenance and support help manage those changes, but no website or system can be guaranteed to run forever without updates.',
    ],
  },
  {
    title: '9. Acceptable use',
    body: [
      'You may not use this website, our tools, or any project systems to upload malicious code, scrape unlawfully, send spam, infringe intellectual property, violate privacy rights, misrepresent your identity, or run activity that is unlawful or harmful.',
    ],
  },
  {
    title: '10. Liability',
    body: [
      'The website and tools are provided on an as-is basis. We work carefully, but we do not promise uninterrupted access, error-free content, guaranteed search rankings, guaranteed conversion results, or compatibility with every future third-party change.',
      'To the maximum extent allowed by law, Kreative Reflow will not be liable for indirect, incidental, special, consequential, or loss-of-profit damages arising from use of the website, tools, or services. Any project-specific liability terms should be handled in the written project agreement.',
    ],
  },
  {
    title: '11. Privacy',
    body: [
      'Personal information submitted through the website, tools, forms, and project communication is handled according to our Privacy Policy.',
    ],
  },
  {
    title: '12. Changes to these terms',
    body: [
      'We may update these terms when our website, services, tools, or legal requirements change. The date at the top of the page shows the latest version.',
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#F0EFED] text-[#151419]">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: siteName, path: '/' },
            { name: 'Terms of Service', path: '/terms' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            '@id': `${absoluteUrl('/terms')}#webpage`,
            name: 'Terms of Service',
            url: absoluteUrl('/terms'),
            dateModified: '2026-05-30',
            isPartOf: {
              '@id': `${siteUrl}/#website`,
            },
            publisher: {
              '@id': `${siteUrl}/#organization`,
            },
          },
        ]}
      />

      <section className="content-gutter pt-32 pb-14 md:pt-40 md:pb-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.55fr)] lg:items-end">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.32em] text-[#FC6E20]">
              [ Terms of service ]
            </p>
            <h1 className="mt-7 max-w-5xl font-playfair text-5xl font-bold leading-[0.96] tracking-tight md:text-7xl lg:text-[6.4rem]">
              The working rules.{' '}
              <br />
              Plain and useful<span className="text-[#FC6E20]">.</span>
            </h1>
          </div>

          <aside className="rounded-[1.35rem] border border-[#151419]/10 bg-[#FBFBFB] p-6 shadow-[0_24px_60px_rgba(21,20,25,0.08)] md:p-8">
            <div className="grid h-12 w-12 place-items-center rounded-[1rem] bg-[#FC6E20] text-[#151419]">
              <FileText className="h-5 w-5" />
            </div>
            <p className="mt-6 font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#151419]/50">
              Last updated
            </p>
            <p className="mt-2 font-playfair text-3xl font-bold">{lastUpdated}</p>
            <p className="mt-5 font-montserrat text-sm leading-7 text-[#151419]/68">
              These terms cover website use, diagnostic tools, enquiries, and
              the basic commercial frame before a project-specific agreement.
            </p>
          </aside>
        </div>
      </section>

      <section className="content-gutter pb-24 md:pb-32">
        <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="hidden lg:block">
            <div className="sticky top-28 rounded-[1.35rem] border border-[#151419]/10 bg-[#151419] p-6 text-[#FBFBFB]">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-[#FC6E20]">
                Useful note
              </p>
              <p className="mt-4 font-montserrat text-sm leading-7 text-white/70">
                Project scopes, proposals, invoices, and signed agreements can
                include more specific terms for the work being delivered.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {termSections.map((section) => (
              <article
                key={section.title}
                className="rounded-[1.35rem] border border-[#151419]/10 bg-[#FBFBFB] p-6 md:p-9"
              >
                <h2 className="font-playfair text-3xl font-bold tracking-tight md:text-4xl">
                  {section.title}
                </h2>
                <div className="mt-5 space-y-4 font-montserrat text-base leading-8 text-[#151419]/70">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>
                      {section.title === '11. Privacy' ? (
                        <>
                          Personal information submitted through the website,
                          tools, forms, and project communication is handled
                          according to our{' '}
                          <Link
                            href="/privacy"
                            className="font-semibold text-[#151419] underline decoration-[#FC6E20] underline-offset-4"
                          >
                            Privacy Policy
                          </Link>
                          .
                        </>
                      ) : (
                        paragraph
                      )}
                    </p>
                  ))}
                </div>
                {section.list ? (
                  <ul className="mt-5 grid gap-3 font-montserrat text-sm leading-7 text-[#151419]/72 md:grid-cols-2">
                    {section.list.map((item) => (
                      <li key={item} className="rounded-[1rem] bg-[#F0EFED] px-4 py-3">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}

            <div className="rounded-[1.35rem] bg-[#151419] p-6 text-[#FBFBFB] md:p-9">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-[#FC6E20]">
                [ Need a project-specific agreement? ]
              </p>
              <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <p className="max-w-2xl font-playfair text-3xl font-bold leading-tight md:text-5xl">
                  Bring the scope. We will make the terms match the work.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex h-12 shrink-0 items-center justify-center gap-3 rounded-full bg-[#FC6E20] px-6 font-montserrat text-sm font-bold uppercase text-[#151419] transition hover:bg-[#FBFBFB]"
                >
                  Start a project
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
