'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';

export function StudioRouteError({
  detail = 'The studio route hit an error before the workspace could render. Retry the route, then check the portal operations panel if it repeats.',
  reset,
  title = 'Studio route could not load',
}: {
  detail?: string;
  reset: () => void;
  title?: string;
}) {
  return (
    <section className="rounded-[30px] border border-[#FC6E20]/35 bg-[#1B1B1E]/92 p-5 shadow-[0_28px_80px_rgba(0,0,0,0.34)] backdrop-blur lg:p-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FC6E20]/15 text-[#FC6E20]">
          <AlertCircle className="h-5 w-5" />
        </span>
        <p className="font-montserrat text-[11px] uppercase tracking-[0.22em] text-[#FC6E20]">Studio error</p>
      </div>
      <h1 className="mt-5 font-playfair text-4xl font-semibold text-white lg:text-5xl">{title}</h1>
      <p className="mt-3 max-w-3xl font-montserrat text-sm leading-7 text-[#595959] lg:text-base">{detail}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/8 bg-white/5 px-4 font-montserrat text-sm font-semibold text-white transition hover:border-[#FC6E20] hover:text-[#FC6E20] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FC6E20]"
      >
        <RefreshCw className="h-4 w-4" />
        Retry
      </button>
    </section>
  );
}
