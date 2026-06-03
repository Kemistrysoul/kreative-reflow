import {
  CheckCircle2,
  Clock3,
  CreditCard,
  ExternalLink,
  KeyRound,
  LifeBuoy,
  PackageCheck,
  ReceiptText,
  ShieldCheck,
} from 'lucide-react';
import type {
  PortalHandoffCategory,
  PortalHandoffStatus,
  PortalInvoiceStatus,
  PortalProjectHandoffItem,
  PortalProjectInvoice,
  PortalProjectSupportNextStep,
  PortalSupportStatus,
} from '@/lib/portal-finance-handoff';

type PortalFinancePanelProps = {
  invoices: PortalProjectInvoice[];
};

type PortalHandoffPanelProps = {
  handoffItems: PortalProjectHandoffItem[];
  supportNextSteps: PortalProjectSupportNextStep[];
};

const invoiceStatusCopy: Record<PortalInvoiceStatus, string> = {
  cancelled: 'Cancelled',
  draft: 'Draft',
  due: 'Due',
  overdue: 'Overdue',
  paid: 'Paid',
  waiting: 'Waiting',
};

const invoiceStatusClass: Record<PortalInvoiceStatus, string> = {
  cancelled: 'border-white/10 bg-white/5 text-stone-500',
  draft: 'border-white/10 bg-white/5 text-stone-500',
  due: 'border-amber-300/30 bg-amber-300/10 text-amber-100',
  overdue: 'border-red-400/25 bg-red-400/10 text-red-100',
  paid: 'border-[#FC6E20]/30 bg-[#FC6E20]/10 text-[#FC6E20]',
  waiting: 'border-white/10 bg-white/5 text-stone-200',
};

const handoffStatusCopy: Record<PortalHandoffStatus, string> = {
  blocked: 'Blocked',
  done: 'Done',
  in_progress: 'In progress',
  not_started: 'Not started',
  waiting_client: 'Waiting client',
};

const handoffStatusClass: Record<PortalHandoffStatus, string> = {
  blocked: 'border-red-400/25 bg-red-400/10 text-red-100',
  done: 'border-[#FC6E20]/30 bg-[#FC6E20]/10 text-[#FC6E20]',
  in_progress: 'border-white/10 bg-white/5 text-stone-200',
  not_started: 'border-white/10 bg-black/20 text-stone-500',
  waiting_client: 'border-amber-300/30 bg-amber-300/10 text-amber-100',
};

const supportStatusCopy: Record<PortalSupportStatus, string> = {
  active: 'Active',
  available: 'Available',
  declined: 'Declined',
  recommended: 'Recommended',
  scheduled: 'Scheduled',
};

const categoryIcons: Record<PortalHandoffCategory, typeof CheckCircle2> = {
  credentials: KeyRound,
  final_assets: PackageCheck,
  launch: ShieldCheck,
  support: LifeBuoy,
};

function Pill({ className, label }: { className: string; label: string }) {
  return (
    <span className={`rounded-full border px-3 py-1.5 font-montserrat text-[11px] uppercase tracking-[0.14em] ${className}`}>
      {label}
    </span>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-3">
      <p className="font-montserrat text-[11px] uppercase tracking-[0.16em] text-stone-500">{label}</p>
      <p className="mt-2 font-montserrat text-sm text-white">{value}</p>
    </div>
  );
}

export function PortalFinancePanel({ invoices }: PortalFinancePanelProps) {
  const actionCount = invoices.filter((invoice) => invoice.status === 'due' || invoice.status === 'overdue').length;

  return (
    <div className="rounded-lg border border-white/10 bg-[#181818] p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <ReceiptText className="h-5 w-5 text-[#FC6E20]" />
          <h2 className="font-playfair text-3xl font-bold text-white">Finance</h2>
        </div>
        <span className="font-montserrat text-xs uppercase tracking-[0.18em] text-stone-500">
          {actionCount} action{actionCount === 1 ? '' : 's'}
        </span>
      </div>

      <div className="space-y-4">
        {invoices.length ? (
          invoices.map((invoice) => (
            <article key={invoice.id} className="border-t border-white/10 pt-4 first:border-t-0 first:pt-0">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="font-montserrat text-sm font-semibold text-white">
                    {invoice.invoiceNumber} - {invoice.label}
                  </p>
                  <p className="mt-2 font-playfair text-3xl font-bold text-white">{invoice.amountLabel}</p>
                </div>
                <Pill className={invoiceStatusClass[invoice.status]} label={invoiceStatusCopy[invoice.status]} />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <Detail label="Issued" value={invoice.issuedDate} />
                <Detail label="Due" value={invoice.dueDate} />
                <Detail label="Paid" value={invoice.paidDate} />
              </div>

              <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-3">
                <p className="flex items-center gap-2 font-montserrat text-[11px] uppercase tracking-[0.16em] text-stone-500">
                  <CreditCard className="h-4 w-4 text-[#FC6E20]" />
                  Payment reference
                </p>
                <p className="mt-2 font-mono text-sm text-white">{invoice.paymentReference || 'Not issued'}</p>
                <p className="mt-2 font-montserrat text-sm leading-6 text-stone-400">{invoice.paymentLinkLabel}</p>
                {invoice.paymentUrl ? (
                  <a
                    href={invoice.paymentUrl}
                    className="mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-white/10 px-3 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-stone-100 transition-colors hover:border-[#FC6E20] hover:text-[#FC6E20]"
                  >
                    Open payment
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </div>

              {invoice.clientNote ? (
                <p className="mt-4 rounded-lg border border-white/10 bg-black/20 p-3 font-montserrat text-sm leading-6 text-stone-400">
                  {invoice.clientNote}
                </p>
              ) : null}
            </article>
          ))
        ) : (
          <p className="rounded-lg border border-dashed border-white/10 bg-black/20 p-4 font-montserrat text-sm leading-6 text-stone-400">
            No client-visible invoices are available yet.
          </p>
        )}
      </div>
    </div>
  );
}

export function PortalHandoffPanel({
  handoffItems,
  supportNextSteps,
}: PortalHandoffPanelProps) {
  const completedCount = handoffItems.filter((item) => item.status === 'done').length;

  return (
    <div className="rounded-lg border border-white/10 bg-[#181818] p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <PackageCheck className="h-5 w-5 text-[#FC6E20]" />
          <h2 className="font-playfair text-3xl font-bold text-white">Launch Handoff</h2>
        </div>
        <span className="font-montserrat text-xs uppercase tracking-[0.18em] text-stone-500">
          {completedCount}/{handoffItems.length} done
        </span>
      </div>

      <div className="grid gap-3">
        {handoffItems.length ? (
          handoffItems.map((item) => {
            const Icon = categoryIcons[item.category];

            return (
              <article key={item.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-montserrat text-sm font-semibold text-white">
                      <Icon className="h-4 w-4 shrink-0 text-[#FC6E20]" />
                      {item.title}
                    </p>
                    <p className="mt-2 font-montserrat text-sm leading-6 text-stone-400">{item.detail}</p>
                  </div>
                  <Pill className={handoffStatusClass[item.status]} label={handoffStatusCopy[item.status]} />
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <Detail label="Owner" value={`${item.ownerName} / ${item.ownerRole}`} />
                  <Detail label="Due" value={item.dueDate} />
                  <Detail label="Completed" value={item.completedAt} />
                </div>

                {item.clientNote ? (
                  <p className="mt-4 font-montserrat text-sm leading-6 text-stone-400">{item.clientNote}</p>
                ) : null}
              </article>
            );
          })
        ) : (
          <p className="rounded-lg border border-dashed border-white/10 bg-black/20 p-4 font-montserrat text-sm leading-6 text-stone-400">
            Launch handoff items will appear after the project reaches testing.
          </p>
        )}
      </div>

      <div className="mt-6 border-t border-white/10 pt-5">
        <div className="mb-4 flex items-center gap-2">
          <LifeBuoy className="h-4 w-4 text-[#FC6E20]" />
          <p className="font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
            After-launch support
          </p>
        </div>
        <div className="grid gap-3">
          {supportNextSteps.length ? (
            supportNextSteps.map((step) => (
              <article key={step.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-montserrat text-sm font-semibold text-white">{step.title}</p>
                    <p className="mt-2 font-montserrat text-sm leading-6 text-stone-400">{step.description}</p>
                  </div>
                  <Pill className="border-white/10 bg-white/5 text-stone-200" label={supportStatusCopy[step.status]} />
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <Detail label="Starts" value={step.startsOn} />
                  <Detail label="Cadence" value={step.cadence} />
                  <Detail label="Owner" value={step.ownerName} />
                </div>
                {step.clientNote ? (
                  <p className="mt-4 flex items-start gap-2 font-montserrat text-sm leading-6 text-stone-400">
                    <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#FC6E20]" />
                    {step.clientNote}
                  </p>
                ) : null}
              </article>
            ))
          ) : (
            <p className="rounded-lg border border-dashed border-white/10 bg-black/20 p-4 font-montserrat text-sm leading-6 text-stone-400">
              Support next steps will appear once launch timing is confirmed.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
