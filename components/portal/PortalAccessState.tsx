import Link from 'next/link';
import { Clock3, FolderX, LockKeyhole } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { PortalAccess } from '@/lib/portal-access';

type PortalAccessStateProps = {
  state: Exclude<PortalAccess, { status: 'authorized' }>;
};

const stateCopy = {
  empty: {
    icon: FolderX,
    title: 'No project available yet',
    action: 'Return to login',
  },
  expired: {
    icon: Clock3,
    title: 'Portal invite expired',
    action: 'Request fresh access',
  },
  unauthorized: {
    icon: LockKeyhole,
    title: 'Project access not assigned',
    action: 'Return to login',
  },
} satisfies Record<Exclude<PortalAccess['status'], 'authorized'>, {
  icon: LucideIcon;
  title: string;
  action: string;
}>;

export function PortalAccessState({ state }: PortalAccessStateProps) {
  const copy = stateCopy[state.status];
  const Icon = copy.icon;

  return (
    <section className="mx-auto flex min-h-[58vh] w-full max-w-3xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full rounded-lg border border-white/10 bg-[#181818] p-6 text-stone-100 shadow-[0_24px_80px_rgba(0,0,0,0.2)] md:p-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#FC6E20]/12 text-[#FC6E20]">
          <Icon className="h-5 w-5" />
        </div>
        <p className="mt-6 font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#FC6E20]">
          Access control
        </p>
        <h1 className="mt-3 font-playfair text-4xl font-bold leading-tight text-white">
          {copy.title}
        </h1>
        <p className="mt-4 font-montserrat text-sm leading-7 text-stone-400">
          {state.message}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/portal/login"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#FC6E20] px-5 font-montserrat text-sm font-semibold text-stone-950 transition-colors hover:bg-[#e05a15]"
          >
            {copy.action}
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 px-5 font-montserrat text-sm font-semibold text-stone-100 transition-colors hover:border-[#FC6E20] hover:text-[#FC6E20]"
          >
            Contact studio
          </Link>
        </div>
      </div>
    </section>
  );
}
