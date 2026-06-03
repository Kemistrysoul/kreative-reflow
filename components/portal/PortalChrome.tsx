import Link from 'next/link';
import { AnimatedTextLink } from '@/components/AnimatedTextLink';

export function PortalHeader() {
  return (
    <header className="border-b border-white/10 bg-[#111111]/95 px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link href="/" className="font-display text-xl font-bold tracking-tight text-white">
          kreative Reflow
        </Link>
        <nav className="flex items-center gap-4 font-montserrat text-xs uppercase tracking-[0.18em] text-stone-400">
          <AnimatedTextLink href="/services/saas-development" underline={false}>
            Web apps
          </AnimatedTextLink>
        </nav>
      </div>
    </header>
  );
}

export function PortalPreviewNotice() {
  return (
    <section className="border-b border-[#FC6E20]/20 bg-[#FC6E20]/10 px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 font-montserrat text-xs leading-5 text-stone-200 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-bold uppercase tracking-[0.2em] text-[#FC6E20]">
          Internal preview
        </p>
        <p className="max-w-3xl text-stone-300">
          Authenticated preview. Uploads, approvals, storage, and role-scoped
          project access are still being tightened before this becomes a live client portal.
        </p>
      </div>
    </section>
  );
}
