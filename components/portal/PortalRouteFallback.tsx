import { Loader2, ShieldCheck } from 'lucide-react';
import { SiteFooter } from '@/components/SiteFooter';
import { PortalHeader } from '@/components/portal/PortalChrome';

export function PortalRouteFallback({
  detail = 'Preparing the protected workspace and checking project access.',
  title = 'Loading client portal',
}: {
  detail?: string;
  title?: string;
}) {
  return (
    <>
      <main className="min-h-screen bg-[#111111] text-stone-100">
        <PortalHeader />
        <section className="mx-auto flex w-full max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="w-full rounded-lg border border-white/10 bg-[#181818] p-6 md:p-8">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#FC6E20]/15 text-[#FC6E20]">
                <Loader2 className="h-5 w-5 animate-spin" />
              </span>
              <p className="font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-[#FC6E20]">
                Secure route
              </p>
            </div>
            <h1 className="mt-6 font-playfair text-4xl font-bold tracking-tight text-white md:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl font-montserrat text-sm leading-6 text-stone-400">
              {detail}
            </p>
            <div className="mt-8 flex items-center gap-3 rounded-lg border border-white/10 bg-black/20 p-4">
              <ShieldCheck className="h-5 w-5 text-[#FC6E20]" />
              <p className="font-montserrat text-sm leading-6 text-stone-300">
                Client data remains behind authenticated, role-scoped access while this route loads.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
