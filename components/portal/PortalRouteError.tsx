'use client';

import Link from 'next/link';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { SiteFooter } from '@/components/SiteFooter';

export function PortalRouteError({
  detail = 'Something interrupted the protected workspace. Retry the route, then check the studio monitoring panel if it repeats.',
  reset,
  title = 'Portal route could not load',
}: {
  detail?: string;
  reset: () => void;
  title?: string;
}) {
  return (
    <>
      <main className="min-h-screen bg-[#111111] text-stone-100">
        <header className="border-b border-white/10 bg-[#111111]/95 px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <Link href="/" className="font-display text-xl font-bold tracking-tight text-white">
              kreative Reflow
            </Link>
            <Link
              href="/portal/login"
              className="font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-stone-400 transition hover:text-[#FC6E20] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FC6E20]"
            >
              Login
            </Link>
          </div>
        </header>

        <section className="mx-auto flex w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="w-full rounded-lg border border-[#FC6E20]/35 bg-[#181818] p-6 md:p-8">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#FC6E20]/15 text-[#FC6E20]">
                <AlertCircle className="h-5 w-5" />
              </span>
              <p className="font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-[#FC6E20]">
                Route error
              </p>
            </div>
            <h1 className="mt-6 font-playfair text-4xl font-bold tracking-tight text-white md:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl font-montserrat text-sm leading-6 text-stone-400">
              {detail}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={reset}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#FC6E20] px-5 font-montserrat text-sm font-semibold text-stone-950 transition hover:bg-[#DD6211] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FC6E20]"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </button>
              <Link
                href="/portal/login"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 font-montserrat text-sm font-semibold text-white transition hover:border-[#FC6E20] hover:text-[#FC6E20] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FC6E20]"
              >
                Return to login
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
