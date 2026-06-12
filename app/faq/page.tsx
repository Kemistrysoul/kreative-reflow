import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { AnimatedLinkText } from '@/components/AnimatedTextLink';
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, siteName } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Website Project FAQ | Kreative Reflow',
  description:
    'Answers about Kreative Reflow website projects, custom dashboards, SEO, automation, pricing, timelines, ownership, support, and working process.',
  path: '/faq',
});

const groups = [
  {
    title: 'Starting',
    questions: [
      {
        q: 'How do I know which service is right for me?',
        a: 'Start with a discovery call. We will look at your business goals, current bottlenecks, and the fastest useful next step.',
      },
      {
        q: 'Do you only build websites?',
        a: 'No. Websites are often the visible layer, but we also build custom applications, SEO foundations, automations, and connected business systems.',
      },
    ],
  },
  {
    title: 'Delivery',
    questions: [
      {
        q: 'How long does a project take?',
        a: 'A focused website can take 4 to 6 weeks. Custom apps and automation projects depend on scope, integrations, and testing needs.',
      },
      {
        q: 'Will I see progress during the project?',
        a: 'Yes. We work in visible phases with clear checkpoints, shared decisions, and review moments before launch.',
      },
    ],
  },
  {
    title: 'Ownership',
    questions: [
      {
        q: 'Do I own the website or system?',
        a: 'Yes. The goal is to give you a digital asset, not trap you in a platform or mystery setup.',
      },
      {
        q: 'What happens after launch?',
        a: 'You can choose a support plan for maintenance, fixes, improvements, performance checks, and ongoing content changes.',
      },
    ],
  },
];

export default function FAQPage() {
  const faqQuestions = groups.flatMap((group) =>
    group.questions.map((item) => ({
      question: item.q,
      answer: item.a,
    })),
  );

  return (
    <main className="min-h-screen bg-[#F0EFED] dark:bg-[#1a1a1a] text-stone-900 dark:text-stone-100">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: siteName, path: '/' },
            { name: 'FAQ', path: '/faq' },
          ]),
          faqJsonLd(faqQuestions),
        ]}
      />
      <section className="content-gutter pt-28 pb-16 md:pt-36 md:pb-24">
        <p className="font-montserrat text-xs uppercase tracking-[0.3em] text-[#FC6E20] mb-6">
          [ Questions before we begin ]
        </p>
        <h1 className="font-playfair text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight leading-[0.98] max-w-5xl">
          No fog.
          <span className="sr-only"> </span>
          <br />
          Just useful answers<span className="text-[#FC6E20]">.</span>
        </h1>
      </section>

      <section className="content-gutter pb-24">
        <div className="grid gap-12 lg:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="font-montserrat text-sm uppercase tracking-[0.25em] text-[#FC6E20] mb-6">
                {group.title}
              </h2>
              <div className="space-y-6">
                {group.questions.map((item) => (
                  <article
                    key={item.q}
                    className="border-t border-stone-300 dark:border-stone-700 pt-6"
                  >
                    <h3 className="font-playfair text-2xl font-bold tracking-tight mb-3">
                      {item.q}
                    </h3>
                    <p className="font-montserrat text-stone-600 dark:text-stone-400 leading-relaxed">
                      {item.a}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="content-gutter pb-28">
        <div className="border-t border-stone-300 dark:border-stone-700 pt-10 max-w-3xl">
          <h2 className="font-playfair text-3xl md:text-5xl font-bold tracking-tight mb-6">
            Still deciding what you need?
          </h2>
          <p className="font-montserrat text-stone-600 dark:text-stone-400 leading-relaxed mb-8">
            Bring the messy version. We will help you turn it into a clear next
            step.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-[#FC6E20] px-7 py-3.5 font-montserrat font-medium text-stone-950 hover:bg-[#DD6211] transition-colors"
          >
            <AnimatedLinkText hiddenClassName="text-stone-950">Ask a question</AnimatedLinkText>
          </Link>
        </div>
      </section>
    </main>
  );
}
