'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode, useState } from 'react';
import { Bell, Menu, Search, X } from 'lucide-react';
import { studioNavigation, studioPortalLink, studioQuickActions, studioWorkspace } from '@/lib/dashboard-data';

export function StudioShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const currentNav =
    studioNavigation.find((item) => item.href === pathname || pathname.startsWith(`${item.href}/`)) ??
    studioNavigation[0];

  return (
    <div className="min-h-screen bg-[#151419] text-[#FBFBFB]">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(252,110,32,0.16),transparent_28%),linear-gradient(180deg,rgba(27,27,30,0.98)_0%,rgba(21,20,25,1)_48%,rgba(17,16,20,1)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:112px_112px] opacity-20" />

        <div className="relative grid min-h-screen w-full grid-cols-1 gap-5 p-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:p-6">
          <aside className="hidden lg:block">
            <DesktopSidebar pathname={pathname} />
          </aside>

          <div className="min-w-0 space-y-5">
            <StudioTopBar
              currentLabel={currentNav.label}
              currentDescription={currentNav.description}
              onOpenMenu={() => setMenuOpen(true)}
            />
            {children}
          </div>
        </div>

        {menuOpen ? (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden">
            <div className="h-full w-[88vw] max-w-sm border-r border-white/10 bg-[#1B1B1E] p-4 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <SidebarBrand />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <PrimaryNav pathname={pathname} onNavigate={() => setMenuOpen(false)} />
              <PortalCard />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StudioTopBar({
  currentLabel,
  currentDescription,
  onOpenMenu,
}: {
  currentLabel: string;
  currentDescription: string;
  onOpenMenu: () => void;
}) {
  return (
    <header className="min-w-0 rounded-[30px] border border-white/8 bg-[#1B1B1E]/92 p-4 shadow-[0_28px_80px_rgba(0,0,0,0.36)] backdrop-blur">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onOpenMenu}
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <p className="font-montserrat text-[11px] uppercase tracking-[0.22em] text-[#878787]">Studio OS</p>
            <h1 className="mt-1 font-playfair text-3xl font-semibold text-white">{currentLabel}</h1>
            <p className="mt-1 max-w-2xl font-montserrat text-sm text-[#878787]">{currentDescription}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 xl:items-end">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex min-w-[260px] flex-1 items-center gap-3 rounded-2xl border border-white/8 bg-[#151419] px-4 py-3 xl:min-w-[360px]">
              <Search className="h-4 w-4 text-[#878787]" />
              <input
                aria-label="Search studio"
                placeholder="Search projects, leads, invoices, tasks"
                className="w-full bg-transparent font-montserrat text-sm text-white outline-none placeholder:text-[#878787]"
              />
            </div>

            <button
              type="button"
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/8 bg-white/5 text-white transition hover:border-[#FC6E20] hover:text-[#FC6E20]"
            >
              <Bell className="h-4 w-4" />
            </button>

            {studioQuickActions.map((action, index) => (
              <Link
                key={action.href}
                href={action.href}
                className={`inline-flex min-h-12 items-center justify-center rounded-2xl px-4 font-montserrat text-sm font-semibold transition ${
                  index === 0
                    ? 'bg-[#FC6E20] text-[#151419] hover:bg-[#e95f14]'
                    : 'border border-white/8 bg-white/5 text-white hover:border-[#FC6E20] hover:text-[#FC6E20]'
                }`}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

function DesktopSidebar({ pathname }: { pathname: string }) {
  return (
    <div className="sticky top-4 flex h-[calc(100vh-2rem)] flex-col rounded-[32px] border border-white/8 bg-[#1B1B1E]/92 p-4 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur">
      <SidebarBrand />
      <PrimaryNav pathname={pathname} />
      <PortalCard />
      <div className="mt-auto rounded-[26px] border border-white/8 bg-[#151419] p-4">
        <p className="font-playfair text-2xl text-white">{studioWorkspace.name}</p>
        <p className="mt-2 font-montserrat text-xs uppercase tracking-[0.18em] text-[#878787]">
          {studioWorkspace.role}
        </p>
        <p className="mt-3 font-montserrat text-sm leading-6 text-[#878787]">{studioWorkspace.blurb}</p>
      </div>
    </div>
  );
}

function SidebarBrand() {
  return (
    <div className="mb-6 rounded-[24px] border border-white/8 bg-white/5 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FC6E20] font-montserrat text-sm font-bold text-[#151419]">
          KR
        </div>
        <div>
          <p className="font-montserrat text-[11px] uppercase tracking-[0.22em] text-[#FC6E20]">Workspace</p>
          <p className="font-playfair text-2xl font-semibold text-white">Studio</p>
        </div>
      </div>
    </div>
  );
}

function PrimaryNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="space-y-2">
      {studioNavigation.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-start gap-3 rounded-[22px] px-4 py-3 transition ${
              active
                ? 'bg-[#FC6E20] text-[#151419]'
                : 'bg-transparent text-white hover:bg-white/5'
            }`}
          >
            <span className={`mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl ${active ? 'bg-black/10' : 'bg-white/5'}`}>
              <Icon className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block font-montserrat text-sm font-semibold">{item.label}</span>
              <span className={`mt-1 block font-montserrat text-xs leading-5 ${active ? 'text-[#151419]/70' : 'text-[#878787]'}`}>
                {item.description}
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function PortalCard() {
  const Icon = studioPortalLink.icon;

  return (
    <div className="my-6 rounded-[26px] border border-[#FC6E20]/30 bg-[linear-gradient(180deg,rgba(252,110,32,0.18),rgba(252,110,32,0.06))] p-4">
      <div className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FC6E20] text-[#151419]">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="font-montserrat text-xs uppercase tracking-[0.18em] text-[#FC6E20]">Portal Link</p>
          <p className="font-playfair text-2xl text-white">{studioPortalLink.label}</p>
        </div>
      </div>
      <p className="mt-3 font-montserrat text-sm leading-6 text-[#F0EFED]/80">{studioPortalLink.description}</p>
      <Link
        href={studioPortalLink.href}
        className="mt-4 inline-flex min-h-11 items-center justify-center rounded-2xl bg-[#F0EFED] px-4 font-montserrat text-sm font-semibold text-[#151419] transition hover:bg-white"
      >
        Open portal
      </Link>
    </div>
  );
}
