import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Clock3,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { ContactForm } from './contact-form';
import { AnimatedLinkText } from '@/components/AnimatedTextLink';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Contact | Kreative Reflow',
  description:
    'Start a project with Kreative Reflow for a website, dashboard, SaaS product, SEO system, automation, or support retainer.',
  path: '/contact',
});

const intakeSignals = [
  {
    label: 'Best first step',
    value: 'Messy brief welcome',
  },
  {
    label: 'Reply rhythm',
    value: 'Within 1-2 business days',
  },
  {
    label: 'Where we work',
    value: 'Johannesburg + remote',
  },
];

const projectTypes = [
  {
    icon: Sparkles,
    title: 'Website rebuild',
    body: 'For brands that need a stronger public face, sharper conversion path, and cleaner content architecture.',
  },
  {
    icon: Workflow,
    title: 'Dashboard or system',
    body: 'For operational tools, CRM workflows, client portals, internal boards, and custom SaaS-style products.',
  },
  {
    icon: ShieldCheck,
    title: 'Automation support',
    body: 'For handoffs, lead capture, reporting, reminders, content workflows, and repetitive admin that should not stay manual.',
  },
];

const contactMethods: Array<{
  label: string;
  value: string;
  href: string;
  helper: string;
  icon: LucideIcon;
}> = [
  {
    label: 'Email',
    value: 'hello@kreativereflow.com',
    href: 'mailto:hello@kreativereflow.com',
    helper: 'Best for project notes, screenshots, and longer context.',
    icon: Mail,
  },
  {
    label: 'Phone',
    value: '+27 65 575 0713',
    href: 'tel:+27655750713',
    helper: 'Best once there is enough context to talk through the next step.',
    icon: Phone,
  },
  {
    label: 'Location',
    value: 'Johannesburg, South Africa',
    href: 'https://www.google.com/maps/place/Johannesburg,+South+Africa',
    helper: 'Building locally, working with clients across South Africa and beyond.',
    icon: MapPin,
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F0EFED] text-[#151419]">
      <section className="relative isolate overflow-hidden bg-[#151419] text-[#FBFBFB]">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(251,251,251,0.055)_1px,transparent_1px),linear-gradient(180deg,rgba(251,251,251,0.04)_1px,transparent_1px)] bg-[size:clamp(72px,10vw,156px)_clamp(72px,10vw,156px)]" />
        <div className="absolute left-[var(--left-gutter)] right-[var(--right-gutter)] top-24 -z-10 h-px bg-white/10" />
        <div className="absolute bottom-0 left-[var(--left-gutter)] right-[var(--right-gutter)] -z-10 h-px bg-white/10" />

        <div className="content-gutter grid gap-12 pb-16 pt-28 md:pb-20 md:pt-36 lg:min-h-screen lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
          <div className="max-w-3xl">
            <p className="font-montserrat text-xs font-bold uppercase tracking-[0.3em] text-[#FC6E20]">
              [ Project intake ]
            </p>
            <h1 className="mt-6 max-w-4xl font-playfair text-[clamp(3.2rem,9vw,7.8rem)] font-bold leading-[0.94] tracking-normal text-[#FBFBFB]">
              Tell us what needs to move.
            </h1>
            <p className="mt-7 max-w-2xl font-montserrat text-base leading-8 text-[#F0EFED]/78 md:text-lg">
              Bring the unfinished version: the goal, the friction, the
              screenshots, the rough idea, or the workflow that keeps stealing
              time. We will shape it into a clear first move.
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {intakeSignals.map((signal) => (
                <div
                  key={signal.label}
                  className="border border-white/10 bg-white/[0.035] p-4"
                >
                  <p className="font-montserrat text-[10px] font-bold uppercase tracking-[0.2em] text-[#878787]">
                    {signal.label}
                  </p>
                  <p className="mt-3 font-mono text-sm text-[#FBFBFB]">
                    {signal.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-3 border-l border-[#FC6E20] pl-5 font-montserrat text-sm leading-7 text-[#F0EFED]/72 sm:max-w-xl">
              <p>
                You do not need a perfect brief. A clear sentence about what is
                not working is enough to start.
              </p>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>

      <section className="content-gutter py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <p className="font-montserrat text-xs font-bold uppercase tracking-[0.3em] text-[#FC6E20]">
              [ What belongs here ]
            </p>
            <h2 className="mt-5 max-w-xl font-playfair text-4xl font-bold leading-[1.02] tracking-normal text-[#151419] md:text-6xl">
              Start with the thing that feels hard to explain.
            </h2>
            <p className="mt-6 max-w-xl font-montserrat text-base leading-8 text-[#5d5d5d]">
              The form is built for early context, not a perfect specification.
              Send enough signal for us to understand the work, the pressure,
              and the outcome you want.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {projectTypes.map((type) => {
              const Icon = type.icon;

              return (
                <article
                  key={type.title}
                  className="border border-[#151419]/12 bg-[#FBFBFB] p-5 transition-colors hover:border-[#FC6E20]"
                >
                  <Icon
                    aria-hidden="true"
                    className="h-5 w-5 text-[#FC6E20]"
                    strokeWidth={1.7}
                  />
                  <h3 className="mt-8 font-montserrat text-sm font-bold uppercase tracking-[0.12em] text-[#151419]">
                    {type.title}
                  </h3>
                  <p className="mt-4 font-montserrat text-sm leading-7 text-[#696969]">
                    {type.body}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="content-gutter pb-24 md:pb-32">
        <div className="border-t border-[#151419]/12 pt-10">
          <div className="grid gap-5 md:grid-cols-3">
            {contactMethods.map((method) => {
              const Icon = method.icon;

              return (
                <a
                  key={method.label}
                  href={method.href}
                  className="group flex min-h-[230px] flex-col justify-between border border-[#151419]/12 bg-[#151419] p-6 text-[#FBFBFB] transition-colors hover:border-[#FC6E20]"
                  target={method.label === 'Location' ? '_blank' : undefined}
                  rel={method.label === 'Location' ? 'noreferrer' : undefined}
                >
                  <span className="flex items-center justify-between">
                    <Icon
                      aria-hidden="true"
                      className="h-5 w-5 text-[#FC6E20]"
                      strokeWidth={1.7}
                    />
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-5 w-5 text-[#878787] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#FC6E20]"
                      strokeWidth={1.7}
                    />
                  </span>
                  <span>
                    <span className="font-montserrat text-[10px] font-bold uppercase tracking-[0.22em] text-[#878787]">
                      {method.label}
                    </span>
                    <span className="mt-3 block font-montserrat text-2xl font-semibold leading-snug tracking-tight [overflow-wrap:anywhere] md:text-[1.65rem]">
                      {method.value}
                    </span>
                    <span className="mt-4 block font-montserrat text-sm leading-7 text-[#F0EFED]/68">
                      {method.helper}
                    </span>
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-between gap-5 border border-[#151419]/12 bg-[#FBFBFB] p-6 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FC6E20] text-[#151419]">
              <Clock3 aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <p className="font-montserrat text-sm font-bold uppercase tracking-[0.16em] text-[#151419]">
                Not sure what to ask for?
              </p>
              <p className="mt-2 max-w-2xl font-montserrat text-sm leading-7 text-[#696969]">
                View the services first, then come back with the closest match.
                The real shape of the work can still be figured out together.
              </p>
            </div>
          </div>
          <Link
            href="/services"
            className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full border border-[#151419]/16 px-5 font-montserrat text-xs font-bold uppercase tracking-[0.16em] text-[#151419] transition-colors hover:border-[#FC6E20] hover:text-[#FC6E20]"
          >
            <AnimatedLinkText>View services</AnimatedLinkText>
          </Link>
        </div>
      </section>
    </main>
  );
}
