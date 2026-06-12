import Link from 'next/link';
import { Clock3, FolderX, LockKeyhole } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { StudioAccess } from '@/lib/portal-access';

type StudioAccessStateProps = {
  state: Exclude<StudioAccess, { status: 'authorized' }>;
};

const stateCopy = {
  empty: {
    icon: FolderX,
    title: 'Studio workspace unavailable',
    action: 'Return to login',
  },
  expired: {
    icon: Clock3,
    title: 'Studio invite expired',
    action: 'Request fresh access',
  },
  unauthorized: {
    icon: LockKeyhole,
    title: 'Studio access not assigned',
    action: 'Return to login',
  },
} satisfies Record<Exclude<StudioAccess['status'], 'authorized'>, {
  icon: LucideIcon;
  title: string;
  action: string;
}>;

export function StudioAccessState({ state }: StudioAccessStateProps) {
  const copy = stateCopy[state.status];
  const Icon = copy.icon;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#151419] px-4 py-10 text-white sm:px-6 lg:px-8">
      <section className="w-full max-w-3xl rounded-lg border border-white/10 bg-[#1B1B1E] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.36)] md:p-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#FC6E20]/12 text-[#FC6E20]">
          <Icon className="h-5 w-5" />
        </div>
        <p className="mt-6 font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#FC6E20]">
          Studio access control
        </p>
        <h1 className="mt-3 font-playfair text-4xl font-bold leading-tight text-white">
          {copy.title}
        </h1>
        <p className="mt-4 font-montserrat text-sm leading-7 text-[#B8B4AE]">
          {state.message}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/portal/login?next=%2Fstudio"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#FC6E20] px-5 font-montserrat text-sm font-semibold text-[#151419] transition-colors hover:bg-[#DD6211]"
          >
            {copy.action}
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 px-5 font-montserrat text-sm font-semibold text-white transition-colors hover:border-[#FC6E20] hover:text-[#FC6E20]"
          >
            Contact admin
          </Link>
        </div>
      </section>
    </main>
  );
}
