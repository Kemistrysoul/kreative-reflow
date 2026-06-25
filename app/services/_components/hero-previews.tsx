import type React from 'react';

// Coded, light-themed product mockups for the service heroes. Each renders
// natively (no images) so it stays crisp at any size, blends with the hero
// background, and tracks the site's light/dark theme.

export type HeroPreviewKind =
  | 'web-design'
  | 'saas-dashboard'
  | 'seo'
  | 'automation'
  | 'consulting'
  | 'maintenance';

const surface =
  'border border-[#151419]/10 bg-[#FBFBFB] dark:border-white/10 dark:bg-white/[0.03]';

function PreviewFrame({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="flex aspect-[16/11] w-full flex-col overflow-hidden rounded-[1.4rem] border border-[#151419]/10 bg-[#F0EFED] shadow-[0_28px_70px_rgba(21,20,25,0.12)] dark:border-white/12 dark:bg-[#1B1B1E]">
      <div className="flex shrink-0 items-center gap-1.5 border-b border-[#151419]/10 bg-[#151419]/[0.03] px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">
        <span className="h-2 w-2 rounded-full bg-[#FC6E20]" />
        <span className="h-2 w-2 rounded-full bg-[#151419]/20 dark:bg-white/25" />
        <span className="h-2 w-2 rounded-full bg-[#151419]/20 dark:bg-white/25" />
        <span className="ml-2 flex-1 truncate font-mono text-[0.52rem] uppercase tracking-[0.2em] text-[#151419]/40 dark:text-white/35">
          {url}
        </span>
        <span className="font-mono text-[0.52rem] uppercase tracking-[0.16em] text-[#FC6E20]">Live</span>
      </div>
      <div className="flex min-h-0 flex-1">{children}</div>
    </div>
  );
}

function SaasDashboard() {
  const navItems: Array<[string, boolean]> = [
    ['Overview', true],
    ['Clients', false],
    ['Quotes', false],
    ['Approvals', false],
    ['Reports', false],
  ];
  const kpis: Array<[string, string, string]> = [
    ['Clients', '24', '+3'],
    ['Open quotes', 'R148k', '+12%'],
    ['Approvals', '7', '+2'],
  ];
  const bars = [40, 56, 38, 64, 48, 72, 90];
  const rows: Array<[string, string, string]> = [
    ['Quote #1042', 'Approved', 'bg-[#5F9FAA]'],
    ['Onboarding · Touch Teq', 'In review', 'bg-[#E0A93B]'],
    ['Asset library', 'Updated', 'bg-[#FC6E20]'],
  ];

  return (
    <PreviewFrame url="app.kreativereflow.com / overview">
      <aside className="hidden w-[30%] shrink-0 flex-col gap-1 border-r border-[#151419]/10 bg-[#FBFBFB] p-3 dark:border-white/10 dark:bg-white/[0.02] sm:flex">
        <div className="mb-2 flex items-center gap-2">
          <span className="grid h-5 w-5 place-items-center rounded-[0.4rem] bg-[#FC6E20] font-mono text-[0.5rem] font-bold text-[#151419]">
            KR
          </span>
          <span className="font-montserrat text-[0.58rem] font-bold tracking-wide text-[#151419]/70 dark:text-white/70">Studio</span>
        </div>
        {navItems.map(([label, active]) => (
          <span
            key={label}
            className={`flex items-center gap-2 rounded-[0.45rem] px-2 py-1.5 font-montserrat text-[0.58rem] ${
              active ? 'bg-[#FC6E20]/15 text-[#FC6E20]' : 'text-[#151419]/55 dark:text-white/45'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-[#FC6E20]' : 'bg-[#151419]/25 dark:bg-white/25'}`} />
            {label}
          </span>
        ))}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-2 p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-montserrat text-[0.62rem] font-bold text-[#151419]/85 dark:text-white/80">Overview</p>
            <p className="font-mono text-[0.48rem] uppercase tracking-[0.16em] text-[#151419]/40 dark:text-white/35">This month</p>
          </div>
          <span className="h-5 w-5 rounded-full border border-[#151419]/15 bg-[#151419]/10 dark:border-white/15 dark:bg-white/10" />
        </div>

        <div className="grid grid-cols-3 gap-2">
          {kpis.map(([label, value, delta]) => (
            <div key={label} className={`rounded-[0.5rem] p-2 ${surface}`}>
              <p className="truncate font-mono text-[0.44rem] uppercase tracking-[0.1em] text-[#151419]/40 dark:text-white/35">{label}</p>
              <p className="mt-1 font-playfair text-[0.95rem] font-bold leading-none text-[#151419] dark:text-white">{value}</p>
              <p className="mt-1 font-mono text-[0.44rem] text-[#3D7A7A] dark:text-[#5F9FAA]">{delta}</p>
            </div>
          ))}
        </div>

        <div className={`flex flex-1 flex-col rounded-[0.5rem] p-2.5 ${surface}`}>
          <div className="flex items-center justify-between">
            <p className="font-mono text-[0.48rem] uppercase tracking-[0.14em] text-[#151419]/45 dark:text-white/40">Revenue</p>
            <p className="font-mono text-[0.48rem] text-[#FC6E20]">+18%</p>
          </div>
          <div className="mt-2 flex flex-1 items-end gap-1.5">
            {bars.map((h, index) => (
              <span
                key={index}
                className={`flex-1 rounded-t-[2px] ${index === bars.length - 1 ? 'bg-[#FC6E20]' : 'bg-[#151419]/15 dark:bg-white/20'}`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        <div className="grid gap-1">
          {rows.map(([title, status, dot]) => (
            <div key={title} className={`flex items-center justify-between rounded-[0.45rem] px-2 py-1.5 ${surface}`}>
              <span className="truncate font-montserrat text-[0.54rem] text-[#151419]/70 dark:text-white/65">{title}</span>
              <span className="flex shrink-0 items-center gap-1.5 font-mono text-[0.48rem] text-[#151419]/50 dark:text-white/45">
                <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PreviewFrame>
  );
}

function WebDesignPreview() {
  const features: Array<[string, string]> = [
    ['Strategy', 'Map the goal'],
    ['Design', 'Clear and fast'],
    ['Build', 'Mobile first'],
  ];

  return (
    <PreviewFrame url="kreativereflow.com">
      <div className="flex min-w-0 flex-1 flex-col bg-[#FBFBFB] dark:bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-[#151419]/8 px-3 py-2 dark:border-white/8">
          <div className="flex items-center gap-1.5">
            <span className="h-3.5 w-3.5 rounded-[0.3rem] bg-[#FC6E20]" />
            <span className="font-montserrat text-[0.5rem] font-bold uppercase tracking-[0.12em] text-[#151419]/70 dark:text-white/70">Reflow</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[0.46rem] text-[#151419]/45 dark:text-white/40">Work</span>
            <span className="font-mono text-[0.46rem] text-[#151419]/45 dark:text-white/40">About</span>
            <span className="rounded-full bg-[#FC6E20] px-2 py-0.5 font-mono text-[0.46rem] font-bold text-[#151419]">Start</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-1.5 px-4 py-3">
          <span className="font-mono text-[0.46rem] uppercase tracking-[0.2em] text-[#FC6E20]">Design that converts</span>
          <p className="font-playfair text-[1.15rem] font-bold leading-[0.95] text-[#151419] dark:text-white">
            Websites built
            <br />
            to convert<span className="text-[#FC6E20]">.</span>
          </p>
          <p className="max-w-[85%] font-montserrat text-[0.5rem] leading-[1.5] text-[#151419]/55 dark:text-white/50">
            Fast, clear, mobile-first sites that turn visitors into enquiries.
          </p>
          <div className="mt-1 flex gap-2">
            <span className="rounded-full bg-[#151419] px-2.5 py-1 font-mono text-[0.46rem] font-bold uppercase text-white dark:bg-white dark:text-[#151419]">Get started</span>
            <span className="rounded-full border border-[#151419]/20 px-2.5 py-1 font-mono text-[0.46rem] uppercase text-[#151419]/60 dark:border-white/20 dark:text-white/55">See work</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1.5 px-3 pb-3">
          {features.map(([title, sub]) => (
            <div key={title} className={`rounded-[0.45rem] p-2 ${surface}`}>
              <p className="font-montserrat text-[0.5rem] font-bold text-[#151419]/80 dark:text-white/75">{title}</p>
              <p className="mt-1 font-mono text-[0.44rem] text-[#151419]/45 dark:text-white/40">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </PreviewFrame>
  );
}

function SeoPreview() {
  const kpis: Array<[string, string, string]> = [
    ['Keywords', '142', '+18'],
    ['Top 3', '28', '+6'],
    ['Clicks', '3.4k', '+24%'],
  ];
  const ranks: Array<[string, string]> = [
    ['plumber johannesburg', '#2'],
    ['emergency electrician', '#1'],
    ['geyser repair sandton', '#4'],
  ];

  return (
    <PreviewFrame url="app.kreativereflow.com / rankings">
      <div className="flex min-w-0 flex-1 flex-col gap-2 bg-[#FBFBFB] p-3 dark:bg-white/[0.02]">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-montserrat text-[0.62rem] font-bold text-[#151419]/85 dark:text-white/80">Search visibility</p>
            <p className="font-mono text-[0.48rem] uppercase tracking-[0.16em] text-[#151419]/40 dark:text-white/35">Last 90 days</p>
          </div>
          <span className="rounded-full bg-[#FC6E20]/15 px-2 py-0.5 font-mono text-[0.46rem] uppercase tracking-[0.12em] text-[#FC6E20]">Rising</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {kpis.map(([label, value, delta]) => (
            <div key={label} className={`rounded-[0.5rem] p-2 ${surface}`}>
              <p className="truncate font-mono text-[0.44rem] uppercase tracking-[0.1em] text-[#151419]/40 dark:text-white/35">{label}</p>
              <p className="mt-1 font-playfair text-[0.95rem] font-bold leading-none text-[#151419] dark:text-white">{value}</p>
              <p className="mt-1 font-mono text-[0.44rem] text-[#3D7A7A] dark:text-[#5F9FAA]">{delta}</p>
            </div>
          ))}
        </div>

        <div className={`flex flex-1 flex-col rounded-[0.5rem] p-2.5 ${surface}`}>
          <p className="font-mono text-[0.48rem] uppercase tracking-[0.14em] text-[#151419]/45 dark:text-white/40">Impressions</p>
          <div className="mt-1 flex-1">
            <svg viewBox="0 0 100 34" preserveAspectRatio="none" className="h-full w-full">
              <path d="M0,28 L14,24 L28,26 L42,18 L56,20 L70,12 L84,11 L100,4 L100,34 L0,34 Z" fill="#FC6E20" fillOpacity="0.12" />
              <polyline points="0,28 14,24 28,26 42,18 56,20 70,12 84,11 100,4" fill="none" stroke="#FC6E20" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
        </div>

        <div className="grid gap-1">
          {ranks.map(([term, pos]) => (
            <div key={term} className={`flex items-center justify-between rounded-[0.45rem] px-2 py-1.5 ${surface}`}>
              <span className="truncate font-montserrat text-[0.54rem] text-[#151419]/70 dark:text-white/65">{term}</span>
              <span className="flex shrink-0 items-center gap-1.5 font-mono text-[0.48rem] text-[#151419]/55 dark:text-white/45">
                <span className="text-[#3D7A7A] dark:text-[#5F9FAA]">▲</span>
                {pos}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PreviewFrame>
  );
}

function AutomationPreview() {
  const steps: Array<[string, string]> = [
    ['New lead', 'Form, call, WhatsApp'],
    ['Auto-reply', 'Within 30 seconds'],
    ['Route to CRM', 'Assign and tag'],
    ['Reminder', 'If no response'],
  ];

  return (
    <PreviewFrame url="app.kreativereflow.com / workflows">
      <div className="flex min-w-0 flex-1 flex-col gap-2 bg-[#FBFBFB] p-3 dark:bg-white/[0.02]">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-montserrat text-[0.62rem] font-bold text-[#151419]/85 dark:text-white/80">Lead workflow</p>
            <p className="font-mono text-[0.48rem] uppercase tracking-[0.16em] text-[#151419]/40 dark:text-white/35">Auto-routing</p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-[#4E9E6A]/15 px-2 py-0.5 font-mono text-[0.46rem] uppercase tracking-[0.12em] text-[#3F875A] dark:text-[#6FBE8C]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4E9E6A]" />
            Active
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {steps.map(([title, sub], index) => (
            <div key={title} className="flex items-stretch gap-2">
              <div className="flex flex-col items-center">
                <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#FC6E20] font-mono text-[0.42rem] font-bold text-[#151419]">
                  {index + 1}
                </span>
                {index < steps.length - 1 ? (
                  <span className="mt-0.5 w-px flex-1 bg-[#151419]/15 dark:bg-white/15" />
                ) : null}
              </div>
              <div className={`flex flex-1 items-center justify-between rounded-[0.45rem] px-2 py-1.5 ${surface}`}>
                <span className="font-montserrat text-[0.54rem] font-bold text-[#151419]/75 dark:text-white/70">{title}</span>
                <span className="truncate pl-2 font-mono text-[0.44rem] text-[#151419]/45 dark:text-white/40">{sub}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-[#151419]/10 pt-2 font-mono text-[0.46rem] uppercase tracking-[0.12em] text-[#151419]/45 dark:border-white/10 dark:text-white/40">
          <span>128 runs this week</span>
          <span className="text-[#FC6E20]">0 missed</span>
        </div>
      </div>
    </PreviewFrame>
  );
}

function ConsultingPreview() {
  const columns: Array<[string, string, string[]]> = [
    ['Now', 'text-[#FC6E20]', ['Map the bottleneck', 'Fix lead intake']],
    ['Next', 'text-[#3D7A7A] dark:text-[#5F9FAA]', ['Client portal', 'Automate quotes']],
    ['Later', 'text-[#151419]/45 dark:text-white/40', ['Reporting layer']],
  ];

  return (
    <PreviewFrame url="app.kreativereflow.com / roadmap">
      <div className="flex min-w-0 flex-1 flex-col gap-2 bg-[#FBFBFB] p-3 dark:bg-white/[0.02]">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-montserrat text-[0.62rem] font-bold text-[#151419]/85 dark:text-white/80">Roadmap</p>
            <p className="font-mono text-[0.48rem] uppercase tracking-[0.16em] text-[#151419]/40 dark:text-white/35">Priority map</p>
          </div>
          <span className="rounded-full bg-[#FC6E20]/15 px-2 py-0.5 font-mono text-[0.46rem] uppercase tracking-[0.12em] text-[#FC6E20]">Phase 1</span>
        </div>

        <div className="grid flex-1 grid-cols-3 gap-2">
          {columns.map(([heading, headingColor, chips]) => (
            <div key={heading} className={`flex flex-col gap-1.5 rounded-[0.5rem] p-2 ${surface}`}>
              <p className={`font-mono text-[0.46rem] font-bold uppercase tracking-[0.14em] ${headingColor}`}>{heading}</p>
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-[0.35rem] border border-[#151419]/10 bg-[#F0EFED] px-1.5 py-1 font-montserrat text-[0.46rem] leading-tight text-[#151419]/70 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/65"
                >
                  {chip}
                </span>
              ))}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-[#151419]/10 pt-2 font-mono text-[0.46rem] uppercase tracking-[0.12em] text-[#151419]/45 dark:border-white/10 dark:text-white/40">
          <span>Decision map</span>
          <span className="text-[#FC6E20]">Next step ready</span>
        </div>
      </div>
    </PreviewFrame>
  );
}

function MaintenancePreview() {
  const stats: Array<[string, string]> = [
    ['Uptime', '99.9%'],
    ['Response', '220ms'],
    ['Open issues', '0'],
  ];
  const bars = [1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  const updates: Array<[string, string]> = [
    ['Security patch applied', '2d'],
    ['Daily backup verified', '6h'],
    ['Plugin updates', '1d'],
  ];

  return (
    <PreviewFrame url="app.kreativereflow.com / status">
      <div className="flex min-w-0 flex-1 flex-col gap-2 bg-[#FBFBFB] p-3 dark:bg-white/[0.02]">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-montserrat text-[0.62rem] font-bold text-[#151419]/85 dark:text-white/80">System status</p>
            <p className="font-mono text-[0.48rem] uppercase tracking-[0.16em] text-[#151419]/40 dark:text-white/35">Last 30 days</p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-[#4E9E6A]/15 px-2 py-0.5 font-mono text-[0.46rem] uppercase tracking-[0.12em] text-[#3F875A] dark:text-[#6FBE8C]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4E9E6A]" />
            Operational
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {stats.map(([label, value]) => (
            <div key={label} className={`rounded-[0.5rem] p-2 ${surface}`}>
              <p className="truncate font-mono text-[0.44rem] uppercase tracking-[0.1em] text-[#151419]/40 dark:text-white/35">{label}</p>
              <p className="mt-1 font-playfair text-[0.95rem] font-bold leading-none text-[#151419] dark:text-white">{value}</p>
            </div>
          ))}
        </div>

        <div className={`flex flex-1 flex-col justify-center rounded-[0.5rem] p-2.5 ${surface}`}>
          <p className="font-mono text-[0.48rem] uppercase tracking-[0.14em] text-[#151419]/45 dark:text-white/40">Uptime history</p>
          <div className="mt-2 flex items-end gap-[2px]">
            {bars.map((state, index) => (
              <span
                key={index}
                className={`h-5 flex-1 rounded-[1px] ${state === 2 ? 'bg-[#E0A93B]' : 'bg-[#4E9E6A]'}`}
              />
            ))}
          </div>
        </div>

        <div className="grid gap-1">
          {updates.map(([title, time]) => (
            <div key={title} className={`flex items-center justify-between rounded-[0.45rem] px-2 py-1.5 ${surface}`}>
              <span className="flex min-w-0 items-center gap-1.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#4E9E6A]" />
                <span className="truncate font-montserrat text-[0.54rem] text-[#151419]/70 dark:text-white/65">{title}</span>
              </span>
              <span className="shrink-0 pl-2 font-mono text-[0.46rem] text-[#151419]/45 dark:text-white/40">{time}</span>
            </div>
          ))}
        </div>
      </div>
    </PreviewFrame>
  );
}

export function ServiceHeroPreview({ kind }: { kind: HeroPreviewKind }) {
  switch (kind) {
    case 'web-design':
      return <WebDesignPreview />;
    case 'saas-dashboard':
      return <SaasDashboard />;
    case 'seo':
      return <SeoPreview />;
    case 'automation':
      return <AutomationPreview />;
    case 'consulting':
      return <ConsultingPreview />;
    case 'maintenance':
      return <MaintenancePreview />;
    default:
      return null;
  }
}
