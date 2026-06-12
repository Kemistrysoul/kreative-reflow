import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  FileCheck2,
  KeyRound,
  ReceiptText,
  ShieldCheck,
  UploadCloud,
} from 'lucide-react';
import type {
  PortalReadinessCategory,
  PortalReadinessGateData,
  PortalReadinessStatus,
} from '@/lib/portal-readiness';

type PortalReadinessGatePanelProps = {
  readinessGate: PortalReadinessGateData;
};

const statusCopy: Record<PortalReadinessStatus, string> = {
  blocked: 'Blocked',
  done: 'Done',
  in_progress: 'In progress',
  not_started: 'Not started',
  waiting_client: 'Waiting client',
};

const statusClass: Record<PortalReadinessStatus, string> = {
  blocked: 'border-red-400/25 bg-red-400/10 text-red-100',
  done: 'border-[#FC6E20]/30 bg-[#FC6E20]/10 text-[#FC6E20]',
  in_progress: 'border-white/10 bg-white/5 text-stone-200',
  not_started: 'border-white/10 bg-black/20 text-stone-500',
  waiting_client: 'border-amber-300/30 bg-amber-300/10 text-amber-100',
};

const categoryIcons: Record<PortalReadinessCategory, typeof CheckCircle2> = {
  assets: UploadCloud,
  commercial: ReceiptText,
  communication: Clock3,
  decision: FileCheck2,
  kickoff: CheckCircle2,
  scope: ShieldCheck,
  technical: KeyRound,
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

export function PortalReadinessGatePanel({ readinessGate }: PortalReadinessGatePanelProps) {
  const hasItems = readinessGate.items.length > 0;
  const Icon = readinessGate.isReadyForActiveDelivery ? CheckCircle2 : AlertCircle;

  return (
    <div className="rounded-lg border border-white/10 bg-[#181818] p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-[#FC6E20]" />
            <h2 className="font-playfair text-3xl font-bold text-white">Active delivery gate</h2>
          </div>
          <p className="mt-3 font-montserrat text-sm leading-6 text-stone-400">
            {hasItems
              ? readinessGate.summary
              : 'Readiness checks will appear once the studio adds contract, scope, deposit, access, and kickoff records.'}
          </p>
        </div>
        <Pill
          className={
            readinessGate.isReadyForActiveDelivery
              ? 'border-[#FC6E20]/30 bg-[#FC6E20]/10 text-[#FC6E20]'
              : 'border-amber-300/30 bg-amber-300/10 text-amber-100'
          }
          label={readinessGate.isReadyForActiveDelivery ? 'Ready for active delivery' : 'Not ready yet'}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Detail label="Agreement" value={readinessGate.contractStatusLabel} />
        <Detail label="SOW" value={readinessGate.sowStatusLabel} />
        <Detail label="Deposit" value={readinessGate.depositStatusLabel} />
      </div>

      {hasItems ? (
        <>
          {!readinessGate.isReadyForActiveDelivery ? (
            <p className="mt-5 rounded-lg border border-amber-300/30 bg-amber-300/10 p-4 font-montserrat text-sm leading-6 text-amber-100">
              {readinessGate.nextAction}
            </p>
          ) : null}

          <div className="mt-5 grid gap-3">
            {readinessGate.items.map((item) => {
              const ItemIcon = categoryIcons[item.category];

              return (
                <article key={item.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 font-montserrat text-sm font-semibold text-white">
                        <ItemIcon className="h-4 w-4 shrink-0 text-[#FC6E20]" />
                        {item.label}
                      </p>
                      <p className="mt-2 font-montserrat text-sm leading-6 text-stone-400">{item.detail}</p>
                    </div>
                    <Pill className={statusClass[item.status]} label={statusCopy[item.status]} />
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <Detail label="Owner" value={`${item.ownerName} / ${item.ownerRole}`} />
                    <Detail label="Due" value={item.dueDate} />
                    <Detail label="Completed" value={item.completedAt} />
                  </div>

                  {item.clientNote ? (
                    <p className="mt-4 font-montserrat text-sm leading-6 text-stone-400">{item.clientNote}</p>
                  ) : null}

                  {item.linkedInvoiceNumber ? (
                    <p className="mt-3 font-montserrat text-xs uppercase tracking-[0.16em] text-stone-500">
                      Linked invoice: {item.linkedInvoiceNumber}
                      {item.linkedInvoiceStatus ? ` / ${item.linkedInvoiceStatus}` : ''}
                    </p>
                  ) : null}
                </article>
              );
            })}
          </div>
        </>
      ) : (
        <p className="mt-5 rounded-lg border border-dashed border-white/10 bg-black/20 p-4 font-montserrat text-sm leading-6 text-stone-400">
          No readiness gate records are available yet.
        </p>
      )}
    </div>
  );
}
