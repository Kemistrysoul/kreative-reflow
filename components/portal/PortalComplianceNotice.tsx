import Link from 'next/link';
import { Database, FileMinus2, KeyRound, LockKeyhole, ShieldCheck } from 'lucide-react';

const complianceItems = [
  {
    title: 'Data use',
    body: 'Project details, onboarding answers, assets, approvals, invoice status, and handoff notes are used to deliver and support the active project.',
    icon: Database,
  },
  {
    title: 'Access',
    body: 'Only invited project members can enter the workspace. Roles control who can view, upload, approve, or manage project information.',
    icon: KeyRound,
  },
  {
    title: 'Retention',
    body: 'Portal records are kept while needed for delivery, support, accounting, legal obligations, or dispute protection, then reviewed for deletion or restriction.',
    icon: FileMinus2,
  },
  {
    title: 'Credentials',
    body: 'Do not paste account passwords or private recovery keys into onboarding answers, comments, or upload names. Use a secure handoff path instead.',
    icon: LockKeyhole,
  },
];

export function PortalComplianceNotice({ compact = false }: { compact?: boolean }) {
  const content = (
    <div className="rounded-lg border border-white/10 bg-[#181818] p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-[#FC6E20]" />
            <p className="font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-[#FC6E20]">
              POPIA-aware portal boundary
            </p>
          </div>
          <h2 className="mt-4 font-playfair text-3xl font-bold text-white">
            Client data stays scoped to the project.
          </h2>
          <p className="mt-3 font-montserrat text-sm leading-6 text-stone-400">
            The portal is designed around minimum useful collection, role-scoped access,
            and a visible path for correction, deletion, or restriction requests.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/privacy"
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 font-montserrat text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:border-[#FC6E20] hover:text-[#FC6E20] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FC6E20]"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 font-montserrat text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:border-[#FC6E20] hover:text-[#FC6E20] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FC6E20]"
          >
            Terms
          </Link>
        </div>
      </div>

      <div className={`mt-6 grid gap-3 ${compact ? '' : 'md:grid-cols-2 xl:grid-cols-4'}`}>
        {complianceItems.map((item) => {
          const Icon = item.icon;

          return (
            <article key={item.title} className="rounded-lg border border-white/10 bg-black/20 p-4">
              <Icon className="h-4 w-4 text-[#FC6E20]" />
              <h3 className="mt-4 font-montserrat text-sm font-semibold text-white">{item.title}</h3>
              <p className="mt-2 font-montserrat text-sm leading-6 text-stone-400">{item.body}</p>
            </article>
          );
        })}
      </div>
    </div>
  );

  if (compact) {
    return content;
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      {content}
    </section>
  );
}
