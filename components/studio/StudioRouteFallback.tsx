import { Loader2, ShieldCheck } from 'lucide-react';

export function StudioRouteFallback({
  detail = 'Loading the studio workspace, project queues, and operational signals.',
  title = 'Loading studio',
}: {
  detail?: string;
  title?: string;
}) {
  return (
    <section className="rounded-[30px] border border-white/8 bg-[#1B1B1E]/92 p-5 shadow-[0_28px_80px_rgba(0,0,0,0.34)] backdrop-blur lg:p-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-[#FC6E20]">
          <Loader2 className="h-5 w-5 animate-spin" />
        </span>
        <p className="font-montserrat text-[11px] uppercase tracking-[0.22em] text-[#FC6E20]">Studio route</p>
      </div>
      <h1 className="mt-5 font-playfair text-4xl font-semibold text-white lg:text-5xl">{title}</h1>
      <p className="mt-3 max-w-3xl font-montserrat text-sm leading-7 text-[#878787] lg:text-base">{detail}</p>
      <div className="mt-6 flex items-center gap-3 rounded-[22px] border border-white/8 bg-[#151419] p-4">
        <ShieldCheck className="h-5 w-5 text-[#FC6E20]" />
        <p className="font-montserrat text-sm leading-6 text-[#FBFBFB]">
          Studio routes stay behind the same authenticated admin boundary while data loads.
        </p>
      </div>
    </section>
  );
}
