import {
  ArrowUpRight,
  Globe2,
  Mail,
  MapPin,
  PanelsTopLeft,
  Phone,
  SearchCheck,
  ShieldCheck,
  Workflow,
} from 'lucide-react';
import { InteractiveGridShell } from './interactive-grid-shell';
import { StartForm } from './start-form';
import { StartGlowTracker } from './start-glow-tracker';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Project Enquiries | Kreative Reflow',
  description:
    'Send a project enquiry for a website, custom web app, local SEO foundation, automation workflow, or support plan with Kreative Reflow.',
  path: '/start',
  robots: {
    index: false,
    follow: true,
  },
});

const services = [
  {
    title: 'Websites',
    body: 'Clear, responsive websites built to explain the business, build trust, and turn visitors into enquiries.',
    icon: PanelsTopLeft,
  },
  {
    title: 'Web apps',
    body: 'Dashboards, client portals, booking flows, internal tools, and systems shaped around real workflows.',
    icon: Workflow,
  },
  {
    title: 'Visibility',
    body: 'Local SEO, AI-search readiness, content structure, and technical foundations that help people find you.',
    icon: SearchCheck,
  },
  {
    title: 'Automation',
    body: 'Lead response, admin, reporting, follow-up, and support workflows that reduce manual repetition.',
    icon: ShieldCheck,
  },
];

const serviceCardStyles = [
  {
    rest:
      '-rotate-[3deg] border-[#FC6E20] bg-[#FC6E20] text-[#060808] shadow-[0_22px_54px_rgba(252,110,32,0.24)]',
    hover:
      'hover:translate-y-0 hover:rotate-0 hover:border-[#151419]/12 hover:bg-[#FBFBFB] hover:text-[#151419] hover:shadow-[0_18px_48px_rgba(21,20,25,0.08)]',
    icon: 'text-[#060808] group-hover:text-[#FC6E20]',
  },
  {
    rest: '',
    hover:
      'hover:-translate-y-3 hover:rotate-2 hover:border-[#5F9FAA] hover:bg-[#5F9FAA] hover:text-[#060808] hover:shadow-[0_28px_70px_rgba(95,159,170,0.34)]',
    icon: 'group-hover:text-[#060808]',
  },
  {
    rest: '',
    hover:
      'hover:-translate-y-3 hover:-rotate-2 hover:border-[#FAE18F] hover:bg-[#FAE18F] hover:text-[#060808] hover:shadow-[0_28px_70px_rgba(250,225,143,0.38)]',
    icon: 'group-hover:text-[#060808]',
  },
  {
    rest: '',
    hover:
      'hover:-translate-y-3 hover:rotate-2 hover:border-[#B92717] hover:bg-[#B92717] hover:text-[#FFF6E9] hover:shadow-[0_28px_70px_rgba(185,39,23,0.3)]',
    icon: 'group-hover:text-[#FFF6E9]',
  },
];

const facts = [
  'Johannesburg based, remote friendly',
  'Best for service businesses and founder-led teams',
  'Useful for websites, systems, SEO, automation, and support',
];

const contactLinks = [
  {
    label: 'Email',
    value: 'hello@kreativereflow.com',
    href: 'mailto:hello@kreativereflow.com',
    icon: Mail,
  },
  {
    label: 'Phone',
    value: '+27 65 575 0713',
    href: 'tel:+27655750713',
    icon: Phone,
  },
  {
    label: 'Location',
    value: 'Johannesburg, South Africa',
    href: 'https://www.google.com/maps/place/Johannesburg,+South+Africa',
    icon: MapPin,
  },
];

export default function StartPage() {
  return (
    <main className="min-h-screen bg-[#F0EFED] text-[#151419]">
      <StartGlowTracker />
      <InteractiveGridShell>
        <div className="relative mx-auto flex w-[calc(100vw_-_32px)] max-w-[1360px] flex-col gap-10 pb-16 pt-8 md:pb-20 md:pt-10">
          <header className="flex flex-col items-start gap-3 pb-5 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
            <div className="font-montserrat text-xl font-black uppercase tracking-tight text-[#151419]">
              Kreative<span className="text-[#FC6E20]">Reflow</span>
            </div>
            <p className="max-w-[14rem] font-montserrat text-[10px] font-bold uppercase leading-5 tracking-[0.18em] text-[#151419]/52 sm:text-right">
              Full website in development
            </p>
          </header>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_28rem] lg:items-start xl:grid-cols-[minmax(0,1fr)_30rem]">
            <div className="pt-4 md:pt-10">
              <p className="font-montserrat text-xs font-bold uppercase tracking-[0.28em] text-[#FC6E20]">
                [ Coming soon ]
              </p>
              <h1 className="mt-5 max-w-full break-words font-playfair text-[clamp(2.35rem,10.5vw,2.95rem)] font-bold leading-[0.93] tracking-normal text-[#151419] sm:max-w-5xl sm:break-normal sm:text-[clamp(3.4rem,7.4vw,7.25rem)]">
                Kreative Reflow is in development
                <span className="text-[#FC6E20]">.</span> Project enquiries are
                open
                <span className="text-[#FC6E20]">.</span>
              </h1>
              <p className="mt-7 max-w-2xl font-montserrat text-base leading-8 text-[#151419]/68 md:text-lg">
                The full website is still being built, but the studio is
                already taking conversations. If you clicked from a client
                footer, this page is here so you can see what Kreative Reflow
                does and send a project enquiry without landing on an unfinished
                site.
              </p>

              <div className="mt-9 grid gap-3">
                {facts.map((fact) => (
                  <div
                    key={fact}
                    className="flex items-start gap-3 border-l border-[#FC6E20] pl-4 font-montserrat text-sm leading-7 text-[#151419]/72"
                  >
                    <Globe2
                      aria-hidden="true"
                      className="mt-1 h-4 w-4 shrink-0 text-[#FC6E20]"
                    />
                    <span>{fact}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {services.map((service, index) => {
                  const Icon = service.icon;
                  const style = serviceCardStyles[index % serviceCardStyles.length];
                  const isAnomaly = index === 0;

                  return (
                    <article
                      key={service.title}
                      className={`start-glow-card group relative min-h-[13rem] transform-gpu rounded-2xl border p-5 transition-all duration-300 ease-out will-change-transform hover:z-10 ${isAnomaly ? '' : 'border-[#151419]/12 bg-[#FBFBFB] text-[#151419]'} ${style.rest} ${style.hover}`}
                    >
                      <Icon
                        aria-hidden="true"
                        className={`h-5 w-5 transition-colors duration-300 ${isAnomaly ? style.icon : `text-[#FC6E20] ${style.icon}`}`}
                        strokeWidth={1.7}
                      />
                      <h2 className="mt-7 font-montserrat text-sm font-bold uppercase tracking-[0.14em] text-current">
                        {service.title}
                      </h2>
                      <p className="mt-4 font-montserrat text-sm leading-7 text-[#151419]/62 transition-colors duration-300 group-hover:text-current group-hover:opacity-75">
                        {service.body}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="lg:sticky lg:top-8">
              <StartForm />
            </div>
          </div>

          <footer className="rounded-2xl border border-[#151419]/12 bg-[#FBFBFB]/35 p-3">
            <div className="grid gap-3 md:grid-cols-3">
              {contactLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    className="start-glow-card start-glow-card--dark group flex min-h-24 items-center justify-between gap-5 rounded-2xl border border-[#151419]/12 bg-[#151419] p-4 text-[#FBFBFB] transition-colors hover:border-[#FC6E20]"
                    target={link.label === 'Location' ? '_blank' : undefined}
                    rel={link.label === 'Location' ? 'noreferrer' : undefined}
                  >
                    <span className="flex items-center gap-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#FC6E20] text-[#151419]">
                        <Icon aria-hidden="true" className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block font-montserrat text-[10px] font-bold uppercase tracking-[0.18em] text-[#878787]">
                          {link.label}
                        </span>
                        <span className="mt-1 block font-montserrat text-sm font-semibold [overflow-wrap:anywhere]">
                          {link.value}
                        </span>
                      </span>
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-[#878787] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#FC6E20]"
                    />
                  </a>
                );
              })}
            </div>
          </footer>
        </div>
      </InteractiveGridShell>
    </main>
  );
}
