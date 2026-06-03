import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
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
  title: 'Privacy Policy | Kreative Reflow',
  description:
    'How Kreative Reflow collects, uses, stores, and protects personal information when you use the website, tools, scorecards, and project enquiry forms.',
  path: '/privacy',
});

const privacySections = [
  {
    title: '1. Who this policy applies to',
    body: [
      'This Privacy Policy applies when you visit kreativereflow.com, use one of our diagnostic tools, download or request a resource, send an enquiry, or work with Kreative Reflow on a project.',
      'Kreative Reflow is the responsible party for personal information collected through this website and through direct project enquiries.',
    ],
  },
  {
    title: '2. Personal information we may collect',
    body: [
      'We only ask for information that helps us respond properly, assess a project, provide a tool result, or manage an active client relationship.',
    ],
    list: [
      'Name, business name, role, email address, phone number, and location.',
      'Project details, website URLs, goals, budget ranges, timelines, and operational context you choose to share.',
      'Responses submitted through scorecards, calculators, forms, downloads, or project intake flows.',
      'Technical and usage data such as device type, browser, pages visited, referral source, and basic analytics signals.',
      'Messages, meeting notes, support requests, invoices, proposals, approvals, and project correspondence.',
    ],
  },
  {
    title: '3. Why we use this information',
    body: [
      'We process personal information for clear business purposes connected to the website, our services, and your relationship with us.',
    ],
    list: [
      'To reply to enquiries and decide whether a project is a good fit.',
      'To generate scorecard or calculator results and send requested resources.',
      'To prepare proposals, deliver websites, dashboards, automation, SEO work, consulting, and support.',
      'To improve the website, tools, content, security, and user experience.',
      'To manage billing, record keeping, legal obligations, dispute handling, and service administration.',
    ],
  },
  {
    title: '4. Lawful processing and POPIA',
    body: [
      'Where South African privacy law applies, we aim to process personal information in line with POPIA principles, including accountability, processing limitation, purpose specification, further processing limitation, information quality, openness, security safeguards, and data subject participation.',
      'Depending on the context, we may process information because you consented, because it is needed to respond to a request or perform a contract, because we have a legitimate business need, or because we must comply with a legal obligation.',
    ],
  },
  {
    title: '5. Sharing and service providers',
    body: [
      'We do not sell personal information. We may share it only where it helps us run the website, deliver the service, or meet a legal obligation.',
    ],
    list: [
      'Hosting, analytics, email, form, CRM, automation, security, payment, accounting, document, and project-management providers.',
      'Specialist contractors or collaborators who help deliver an approved project and only need access to relevant project information.',
      'Authorities, regulators, professional advisers, or legal parties where required by law or to protect legitimate rights.',
    ],
  },
  {
    title: '6. Storage, security, and retention',
    body: [
      'We use reasonable technical and organisational safeguards to protect personal information against loss, misuse, unauthorised access, alteration, or disclosure.',
      'We keep personal information only for as long as needed for the purpose collected, for active client support, for business records, or where the law requires retention. When information is no longer needed, we delete it, de-identify it, or archive it securely where appropriate.',
    ],
  },
  {
    title: '7. Cross-border tools',
    body: [
      'Some service providers may store or process information outside South Africa. Where this happens, we use providers and safeguards that are appropriate for the nature of the information and the service being supplied.',
    ],
  },
  {
    title: '8. Your choices and rights',
    body: [
      'You may ask us to confirm whether we hold your personal information, request access to it, ask for a correction, ask for deletion where legally available, object to certain processing, or withdraw consent where consent is the basis for processing.',
      'You may also complain to the Information Regulator in South Africa if you believe your personal information has not been handled correctly.',
    ],
  },
  {
    title: '9. Cookies and analytics',
    body: [
      'The website may use cookies, analytics, and similar technologies to understand page performance, traffic sources, and user behaviour. You can control many cookie settings through your browser.',
    ],
  },
  {
    title: '10. Updates to this policy',
    body: [
      'We may update this page when our services, tools, providers, or legal requirements change. The date at the top of the page shows the latest version.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F0EFED] text-[#151419]">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: siteName, path: '/' },
            { name: 'Privacy Policy', path: '/privacy' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            '@id': `${absoluteUrl('/privacy')}#webpage`,
            name: 'Privacy Policy',
            url: absoluteUrl('/privacy'),
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
              [ Privacy policy ]
            </p>
            <h1 className="mt-7 max-w-5xl font-playfair text-5xl font-bold leading-[0.96] tracking-tight md:text-7xl lg:text-[6.4rem]">
              Clear data.{' '}
              <br />
              Clear boundaries<span className="text-[#FC6E20]">.</span>
            </h1>
          </div>

          <aside className="rounded-[1.35rem] border border-[#151419]/10 bg-[#FBFBFB] p-6 shadow-[0_24px_60px_rgba(21,20,25,0.08)] md:p-8">
            <div className="grid h-12 w-12 place-items-center rounded-[1rem] bg-[#151419] text-[#FBFBFB]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <p className="mt-6 font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#151419]/50">
              Last updated
            </p>
            <p className="mt-2 font-playfair text-3xl font-bold">{lastUpdated}</p>
            <p className="mt-5 font-montserrat text-sm leading-7 text-[#151419]/68">
              This is a practical privacy notice for the website, tools,
              enquiries, and project communication handled by Kreative Reflow.
            </p>
          </aside>
        </div>
      </section>

      <section className="content-gutter pb-24 md:pb-32">
        <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="hidden lg:block">
            <div className="sticky top-28 rounded-[1.35rem] border border-[#151419]/10 bg-[#151419] p-6 text-[#FBFBFB]">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-[#FC6E20]">
                Contact
              </p>
              <p className="mt-4 font-montserrat text-sm leading-7 text-white/70">
                For privacy questions or requests, email{' '}
                <a className="text-white underline decoration-[#FC6E20]" href="mailto:hello@kreativereflow.com">
                  hello@kreativereflow.com
                </a>
                .
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {privacySections.map((section) => (
              <article
                key={section.title}
                className="rounded-[1.35rem] border border-[#151419]/10 bg-[#FBFBFB] p-6 md:p-9"
              >
                <h2 className="font-playfair text-3xl font-bold tracking-tight md:text-4xl">
                  {section.title}
                </h2>
                <div className="mt-5 space-y-4 font-montserrat text-base leading-8 text-[#151419]/70">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
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

            <div className="rounded-[1.35rem] bg-[#FC6E20] p-6 text-[#151419] md:p-9">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.24em]">
                [ Need to update your details? ]
              </p>
              <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <p className="max-w-2xl font-playfair text-3xl font-bold leading-tight md:text-5xl">
                  Send the request and we will handle it with the right care.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex h-12 shrink-0 items-center justify-center gap-3 rounded-full bg-[#151419] px-6 font-montserrat text-sm font-bold uppercase text-[#FBFBFB] transition hover:bg-[#FBFBFB] hover:text-[#151419]"
                >
                  Contact us
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
