'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle2, FileCheck2, Loader2, MessageSquareText } from 'lucide-react';
import type {
  PortalApprovalDecision,
  PortalApprovalEvent,
  PortalDeliverableApproval,
  PortalDeliverableStatus,
} from '@/lib/portal-approvals';

type PortalApprovalsPanelProps = {
  approvals: PortalDeliverableApproval[];
  canRespond: boolean;
};

type ApprovalResponse = {
  ok?: boolean;
  approvedAt?: string | null;
  decidedByEmail?: string;
  decision?: PortalApprovalDecision;
  error?: string;
  message?: string;
  status?: PortalDeliverableStatus;
};

const statusCopy: Record<PortalDeliverableStatus, string> = {
  approved: 'Approved',
  revision_requested: 'Revision requested',
  superseded: 'Superseded',
  waiting_review: 'Waiting review',
};

const statusClass: Record<PortalDeliverableStatus, string> = {
  approved: 'border-[#FC6E20]/30 bg-[#FC6E20]/10 text-[#FC6E20]',
  revision_requested: 'border-amber-300/30 bg-amber-300/10 text-amber-100',
  superseded: 'border-white/10 bg-white/5 text-stone-500',
  waiting_review: 'border-white/10 bg-white/5 text-stone-200',
};

function formatClientDecisionTime(value?: string | null) {
  if (!value) return 'Just now';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Just now';
  }

  return new Intl.DateTimeFormat('en-ZA', {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function buildEvent({
  decision,
  email,
  note,
  occurredAt,
}: {
  decision: PortalApprovalDecision;
  email: string;
  note: string;
  occurredAt?: string | null;
}): PortalApprovalEvent {
  return {
    id: `${decision}-${Date.now()}`,
    decision,
    note,
    decidedByEmail: email,
    decidedByRole: 'Portal member',
    decidedAt: formatClientDecisionTime(occurredAt),
  };
}

export function PortalApprovalsPanel({
  approvals,
  canRespond,
}: PortalApprovalsPanelProps) {
  const [items, setItems] = useState(approvals);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, { message: string; tone: 'error' | 'success' }>>({});

  async function submitDecision(deliverable: PortalDeliverableApproval, decision: PortalApprovalDecision) {
    const note = notes[deliverable.id]?.trim() ?? '';

    if (decision === 'revision_requested' && note.length < 8) {
      setFeedback((current) => ({
        ...current,
        [deliverable.id]: {
          message: 'Add a clear revision note before requesting changes.',
          tone: 'error',
        },
      }));
      return;
    }

    setPendingId(deliverable.id);
    setFeedback((current) => ({ ...current, [deliverable.id]: { message: '', tone: 'success' } }));

    try {
      const response = await fetch('/api/portal/approvals', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          decision,
          deliverableId: deliverable.id,
          note,
        }),
      });
      const payload = (await response.json()) as ApprovalResponse;

      if (!response.ok || !payload.ok || !payload.status || !payload.decision) {
        throw new Error(payload.error || 'Approval decision could not be saved.');
      }

      const savedDecision = payload.decision;
      const savedStatus = payload.status;

      setItems((current) =>
        current.map((item) =>
          item.id === deliverable.id
            ? {
                ...item,
                approvedAt:
                  savedDecision === 'approved'
                    ? formatClientDecisionTime(payload.approvedAt)
                    : 'Not approved',
                approvedByEmail: savedDecision === 'approved' ? payload.decidedByEmail ?? '' : '',
                latestEvent: buildEvent({
                  decision: savedDecision,
                  email: payload.decidedByEmail ?? '',
                  note,
                  occurredAt: payload.approvedAt,
                }),
                status: savedStatus,
              }
            : item,
        ),
      );
      setNotes((current) => ({ ...current, [deliverable.id]: '' }));
      setFeedback((current) => ({
        ...current,
        [deliverable.id]: {
          message: payload.message || 'Decision saved.',
          tone: 'success',
        },
      }));
    } catch (error) {
      setFeedback((current) => ({
        ...current,
        [deliverable.id]: {
          message: error instanceof Error ? error.message : 'Approval decision could not be saved.',
          tone: 'error',
        },
      }));
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="rounded-lg border border-white/10 bg-[#181818] p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <FileCheck2 className="h-5 w-5 text-[#FC6E20]" />
          <h2 className="font-playfair text-3xl font-bold text-white">Approvals</h2>
        </div>
        <span className="font-montserrat text-xs uppercase tracking-[0.18em] text-stone-500">
          {items.filter((item) => item.status === 'waiting_review').length} waiting
        </span>
      </div>

      <div className="space-y-4">
        {items.length ? (
          items.map((deliverable) => {
            const pending = pendingId === deliverable.id;
            const itemFeedback = feedback[deliverable.id];

            return (
              <article key={deliverable.id} className="border-t border-white/10 pt-4 first:border-t-0 first:pt-0">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-montserrat text-sm font-semibold text-white">{deliverable.title}</p>
                    <p className="mt-2 font-montserrat text-sm leading-6 text-stone-400">{deliverable.summary}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-3 py-1.5 font-montserrat text-[11px] uppercase tracking-[0.14em] ${statusClass[deliverable.status]}`}
                  >
                    {statusCopy[deliverable.status]}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <ApprovalFact label="Version" value={deliverable.versionLabel} />
                  <ApprovalFact label="Due" value={deliverable.dueDate} />
                  <ApprovalFact label="Published" value={deliverable.publishedAt} />
                </div>

                {deliverable.status === 'approved' ? (
                  <div className="mt-4 rounded-lg border border-[#FC6E20]/20 bg-[#FC6E20]/10 p-3">
                    <p className="flex items-center gap-2 font-montserrat text-sm font-semibold text-white">
                      <CheckCircle2 className="h-4 w-4 text-[#FC6E20]" />
                      Approved {deliverable.approvedAt}
                    </p>
                    <p className="mt-2 font-mono text-xs text-stone-400">{deliverable.approvedByEmail}</p>
                  </div>
                ) : null}

                {deliverable.latestEvent ? (
                  <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-3">
                    <p className="flex items-center gap-2 font-montserrat text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                      <MessageSquareText className="h-4 w-4 text-[#FC6E20]" />
                      Latest decision
                    </p>
                    <p className="mt-2 font-montserrat text-sm text-white">
                      {statusCopy[deliverable.latestEvent.decision]} by {deliverable.latestEvent.decidedByEmail}
                    </p>
                    {deliverable.latestEvent.note ? (
                      <p className="mt-2 font-montserrat text-sm leading-6 text-stone-400">{deliverable.latestEvent.note}</p>
                    ) : null}
                    <p className="mt-2 font-mono text-xs text-stone-500">{deliverable.latestEvent.decidedAt}</p>
                  </div>
                ) : null}

                {canRespond && deliverable.status !== 'approved' && deliverable.status !== 'superseded' ? (
                  <div className="mt-4 space-y-3">
                    <textarea
                      value={notes[deliverable.id] ?? ''}
                      onChange={(event) =>
                        setNotes((current) => ({
                          ...current,
                          [deliverable.id]: event.target.value,
                        }))
                      }
                      rows={3}
                      placeholder="Revision notes"
                      className="min-h-24 w-full resize-y rounded-lg border border-white/10 bg-black/25 px-3 py-3 font-montserrat text-sm leading-6 text-white outline-none transition placeholder:text-stone-600 focus:border-[#FC6E20]"
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => void submitDecision(deliverable, 'approved')}
                        disabled={pending}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#FC6E20] px-4 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-stone-950 transition-colors hover:bg-[#DD6211] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => void submitDecision(deliverable, 'revision_requested')}
                        disabled={pending}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/10 px-4 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-stone-100 transition-colors hover:border-[#FC6E20] hover:text-[#FC6E20] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquareText className="h-4 w-4" />}
                        Request revision
                      </button>
                    </div>
                  </div>
                ) : null}

                {!canRespond ? (
                  <p className="mt-4 rounded-lg border border-white/10 bg-black/20 p-3 font-montserrat text-sm leading-6 text-stone-400">
                    Your current portal role is read-only for approvals.
                  </p>
                ) : null}

                {itemFeedback?.message ? (
                  <p
                    className={`mt-4 flex items-start gap-2 rounded-lg border p-3 font-montserrat text-sm leading-6 ${
                      itemFeedback.tone === 'success'
                        ? 'border-[#FC6E20]/25 bg-[#FC6E20]/10 text-stone-100'
                        : 'border-red-400/25 bg-red-400/10 text-red-100'
                    }`}
                  >
                    {itemFeedback.tone === 'success' ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FC6E20]" />
                    ) : (
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    )}
                    {itemFeedback.message}
                  </p>
                ) : null}
              </article>
            );
          })
        ) : (
          <p className="rounded-lg border border-dashed border-white/10 bg-black/20 p-4 font-montserrat text-sm leading-6 text-stone-400">
            No deliverables are waiting for approval yet.
          </p>
        )}
      </div>
    </div>
  );
}

function ApprovalFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-3">
      <p className="font-montserrat text-[11px] uppercase tracking-[0.16em] text-stone-500">{label}</p>
      <p className="mt-2 font-montserrat text-sm text-white">{value}</p>
    </div>
  );
}
