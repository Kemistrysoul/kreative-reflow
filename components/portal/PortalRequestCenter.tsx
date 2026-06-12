'use client';

import { useState } from 'react';
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Loader2,
  MessageSquareText,
  Paperclip,
  PauseCircle,
  XCircle,
} from 'lucide-react';
import type {
  PortalProjectRequest,
  PortalRequestClientDecision,
  PortalRequestClassification,
  PortalRequestStatus,
  PortalRequestSummary,
  PortalRequestType,
  PortalRequestUrgency,
} from '@/lib/portal-requests';

type PortalRequestCenterProps = {
  canSubmit: boolean;
  projectSlug: string;
  requestSummary: PortalRequestSummary;
};

type RequestResponse = {
  clientDecision?: PortalRequestClientDecision;
  decidedAt?: string;
  error?: string;
  nextAction?: string;
  ok?: boolean;
  request?: {
    id: string;
    requestNumber: string;
    status: PortalRequestStatus;
    submittedAt: string;
  };
  status?: PortalRequestStatus;
};

type RequestDraft = {
  affectedArea: string;
  attachmentLabel: string;
  attachmentUrl: string;
  desiredDeadline: string;
  reason: string;
  relatedItemLabel: string;
  requestDetail: string;
  requestType: PortalRequestType;
  title: string;
  urgency: PortalRequestUrgency;
};

const emptyDraft: RequestDraft = {
  affectedArea: '',
  attachmentLabel: '',
  attachmentUrl: '',
  desiredDeadline: '',
  reason: '',
  relatedItemLabel: '',
  requestDetail: '',
  requestType: 'small_change',
  title: '',
  urgency: 'normal',
};

const requestTypeCopy: Record<PortalRequestType, string> = {
  bug_fix: 'Bug / fix',
  maintenance_request: 'Maintenance request',
  meeting_request: 'Meeting request',
  question: 'Question',
  scope_change: 'Scope change',
  small_change: 'Small change',
  support_request: 'Support request',
};

const requestStatusCopy: Record<PortalRequestStatus, string> = {
  approved: 'Approved',
  closed: 'Closed',
  declined: 'Declined',
  in_progress: 'In progress',
  parked: 'Parked',
  resolved: 'Resolved',
  submitted: 'Submitted',
  triage: 'In triage',
  waiting_approval: 'Waiting approval',
  waiting_client: 'Waiting client',
};

const classificationCopy: Record<PortalRequestClassification, string> = {
  change_request: 'Change request',
  fix: 'Fix',
  included_revision: 'Included revision',
  maintenance: 'Maintenance',
  out_of_scope: 'Out of scope',
  unclassified: 'Unclassified',
};

const urgencyCopy: Record<PortalRequestUrgency, string> = {
  high: 'High',
  low: 'Low',
  normal: 'Normal',
  urgent: 'Urgent',
};

const statusClass: Record<PortalRequestStatus, string> = {
  approved: 'border-[#FC6E20]/30 bg-[#FC6E20]/10 text-[#FC6E20]',
  closed: 'border-white/10 bg-white/5 text-stone-500',
  declined: 'border-red-400/25 bg-red-400/10 text-red-100',
  in_progress: 'border-white/10 bg-white/5 text-stone-100',
  parked: 'border-white/10 bg-white/5 text-stone-300',
  resolved: 'border-[#FC6E20]/30 bg-[#FC6E20]/10 text-[#FC6E20]',
  submitted: 'border-white/10 bg-white/5 text-stone-200',
  triage: 'border-amber-300/30 bg-amber-300/10 text-amber-100',
  waiting_approval: 'border-amber-300/30 bg-amber-300/10 text-amber-100',
  waiting_client: 'border-amber-300/30 bg-amber-300/10 text-amber-100',
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
      <p className="mt-2 font-montserrat text-sm text-white">{value || 'Not provided'}</p>
    </div>
  );
}

function Field({
  label,
  onChange,
  placeholder,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}) {
  return (
    <label>
      <span className="block font-montserrat text-[11px] uppercase tracking-[0.18em] text-stone-500">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-black/20 px-4 font-montserrat text-sm text-white outline-none transition placeholder:text-stone-600 focus:border-[#FC6E20]"
      />
    </label>
  );
}

function TextAreaField({
  label,
  onChange,
  placeholder,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}) {
  return (
    <label>
      <span className="block font-montserrat text-[11px] uppercase tracking-[0.18em] text-stone-500">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 font-montserrat text-sm leading-6 text-white outline-none transition placeholder:text-stone-600 focus:border-[#FC6E20]"
      />
    </label>
  );
}

export function PortalRequestCenter({
  canSubmit,
  projectSlug,
  requestSummary,
}: PortalRequestCenterProps) {
  const [requests, setRequests] = useState(requestSummary.requests);
  const [draft, setDraft] = useState<RequestDraft>(emptyDraft);
  const [submitting, setSubmitting] = useState(false);
  const [decisionId, setDecisionId] = useState('');
  const [decisionNote, setDecisionNote] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function updateDraft(patch: Partial<RequestDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  async function submitRequest() {
    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/portal/requests', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...draft,
          projectSlug,
          sourceChannel: 'portal',
        }),
      });
      const payload = (await response.json()) as RequestResponse;

      if (!response.ok || !payload.ok || !payload.request) {
        throw new Error(payload.error || 'Request could not be submitted.');
      }

      const submittedAt = new Intl.DateTimeFormat('en-ZA', {
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(new Date(payload.request.submittedAt));

      setRequests((current) => [
        {
          id: payload.request?.id ?? `local-${Date.now()}`,
          projectSlug,
          projectName: requestSummary.latestRequest?.projectName ?? '',
          clientName: requestSummary.latestRequest?.clientName ?? '',
          requestNumber: payload.request?.requestNumber ?? 'New request',
          requestType: draft.requestType,
          title: draft.title,
          affectedArea: draft.affectedArea,
          requestDetail: draft.requestDetail,
          reason: draft.reason,
          urgency: draft.urgency,
          desiredDeadline: draft.desiredDeadline || 'Not set',
          desiredDeadlineRaw: draft.desiredDeadline,
          relatedItemLabel: draft.relatedItemLabel,
          attachmentLabel: draft.attachmentLabel,
          attachmentUrl: draft.attachmentUrl,
          sourceChannel: 'portal',
          status: payload.request?.status ?? 'submitted',
          classification: 'unclassified',
          impactCostLabel: '',
          impactTimeLabel: '',
          launchImpact: '',
          studioAssessment: '',
          phase2Option: false,
          clientDecision: 'not_required',
          clientDecisionNote: '',
          clientDecisionAt: 'Not decided',
          ownerName: 'Kreative Reflow',
          ownerRole: 'Studio',
          nextAction: 'The studio will triage this request and confirm the next step.',
          submittedByEmail: '',
          submittedByRole: '',
          submittedAt,
          classifiedByEmail: '',
          classifiedAt: 'Not classified',
          clientVisible: true,
          internalNote: '',
          source: 'supabase',
        },
        ...current,
      ]);
      setDraft(emptyDraft);
      setMessage('Request submitted. The studio will triage it before work starts.');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Request could not be submitted.');
    } finally {
      setSubmitting(false);
    }
  }

  async function submitDecision(requestItem: PortalProjectRequest, clientDecision: PortalRequestClientDecision) {
    setDecisionId(requestItem.id);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/portal/requests', {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'client_decision',
          clientDecision,
          clientDecisionNote: decisionNote,
          requestId: requestItem.id,
        }),
      });
      const payload = (await response.json()) as RequestResponse;

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || 'Request decision could not be saved.');
      }

      setRequests((current) =>
        current.map((item) =>
          item.id === requestItem.id
            ? {
                ...item,
                clientDecision,
                clientDecisionAt: 'Updated just now',
                clientDecisionNote: decisionNote,
                nextAction: payload.nextAction ?? item.nextAction,
                status: payload.status ?? item.status,
              }
            : item
        )
      );
      setDecisionNote('');
      setMessage('Request decision saved.');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Request decision could not be saved.');
    } finally {
      setDecisionId('');
    }
  }

  const waitingApproval = requests.filter((requestItem) => requestItem.clientDecision === 'pending');

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-lg border border-white/10 bg-[#181818] p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.18em] text-[#FC6E20]">
              Request Center
            </p>
            <h3 className="mt-2 font-playfair text-3xl font-bold text-white">Send one clear project request<span className="text-[#FC6E20]">.</span></h3>
          </div>
          <MessageSquareText className="h-6 w-6 text-[#FC6E20]" />
        </div>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="block font-montserrat text-[11px] uppercase tracking-[0.18em] text-stone-500">
                Request type
              </span>
              <select
                value={draft.requestType}
                onChange={(event) => updateDraft({ requestType: event.target.value as PortalRequestType })}
                className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-black/20 px-4 font-montserrat text-sm text-white outline-none transition focus:border-[#FC6E20]"
              >
                {(Object.keys(requestTypeCopy) as PortalRequestType[]).map((requestType) => (
                  <option key={requestType} value={requestType}>
                    {requestTypeCopy[requestType]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="block font-montserrat text-[11px] uppercase tracking-[0.18em] text-stone-500">
                Urgency
              </span>
              <select
                value={draft.urgency}
                onChange={(event) => updateDraft({ urgency: event.target.value as PortalRequestUrgency })}
                className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-black/20 px-4 font-montserrat text-sm text-white outline-none transition focus:border-[#FC6E20]"
              >
                {(Object.keys(urgencyCopy) as PortalRequestUrgency[]).map((urgency) => (
                  <option key={urgency} value={urgency}>
                    {urgencyCopy[urgency]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <Field
            label="Title"
            value={draft.title}
            onChange={(value) => updateDraft({ title: value })}
            placeholder="Example: Change homepage CTA wording"
          />
          <Field
            label="Affected page or feature"
            value={draft.affectedArea}
            onChange={(value) => updateDraft({ affectedArea: value })}
            placeholder="Example: Homepage hero, checkout, contact form"
          />
          <TextAreaField
            label="Requested change"
            value={draft.requestDetail}
            onChange={(value) => updateDraft({ requestDetail: value })}
            placeholder="Explain exactly what should change."
          />
          <TextAreaField
            label="Reason"
            value={draft.reason}
            onChange={(value) => updateDraft({ reason: value })}
            placeholder="Why is this needed, and what outcome are you expecting?"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Desired deadline"
              value={draft.desiredDeadline}
              onChange={(value) => updateDraft({ desiredDeadline: value })}
              placeholder="YYYY-MM-DD"
            />
            <Field
              label="Related milestone or deliverable"
              value={draft.relatedItemLabel}
              onChange={(value) => updateDraft({ relatedItemLabel: value })}
              placeholder="Example: Homepage concept v1"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Screenshot / file note"
              value={draft.attachmentLabel}
              onChange={(value) => updateDraft({ attachmentLabel: value })}
              placeholder="Example: Uploaded in files, WhatsApp screenshot"
            />
            <Field
              label="Attachment link"
              value={draft.attachmentUrl}
              onChange={(value) => updateDraft({ attachmentUrl: value })}
              placeholder="https://..."
            />
          </div>

          <button
            type="button"
            onClick={() => void submitRequest()}
            disabled={!canSubmit || submitting}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#FC6E20] px-5 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-stone-950 transition-colors hover:bg-[#DD6211] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUpRight className="h-4 w-4" />}
            Submit request
          </button>
        </div>

        {message ? (
          <p className="mt-4 flex items-start gap-2 rounded-lg border border-[#FC6E20]/30 bg-[#FC6E20]/10 p-3 font-montserrat text-sm leading-6 text-[#FC6E20]">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="mt-4 flex items-start gap-2 rounded-lg border border-red-400/25 bg-red-400/10 p-3 font-montserrat text-sm leading-6 text-red-100">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </p>
        ) : null}
      </div>

      <div className="grid gap-6">
        <div className="rounded-lg border border-white/10 bg-[#181818] p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.18em] text-[#FC6E20]">
                Scope decisions
              </p>
              <h3 className="mt-2 font-playfair text-3xl font-bold text-white">Approve only what should move<span className="text-[#FC6E20]">.</span></h3>
            </div>
            <Pill
              className={
                waitingApproval.length
                  ? 'border-amber-300/30 bg-amber-300/10 text-amber-100'
                  : 'border-white/10 bg-white/5 text-stone-300'
              }
              label={`${waitingApproval.length} waiting`}
            />
          </div>

          {waitingApproval.length ? (
            <div className="mt-5 grid gap-4">
              {waitingApproval.map((requestItem) => (
                <article key={`decision-${requestItem.id}`} className="rounded-lg border border-amber-300/25 bg-amber-300/10 p-4">
                  <p className="font-montserrat text-sm font-semibold text-white">{requestItem.title}</p>
                  <p className="mt-2 font-montserrat text-sm leading-6 text-amber-100">{requestItem.studioAssessment}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <Detail label="Cost impact" value={requestItem.impactCostLabel} />
                    <Detail label="Time impact" value={requestItem.impactTimeLabel} />
                    <Detail label="Launch impact" value={requestItem.launchImpact} />
                  </div>
                  {requestItem.phase2Option ? (
                    <p className="mt-4 flex items-start gap-2 font-montserrat text-sm leading-6 text-amber-100">
                      <PauseCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      This can be parked for Phase 2 instead of changing the current delivery plan.
                    </p>
                  ) : null}
                  <TextAreaField
                    label="Decision note"
                    value={decisionNote}
                    onChange={setDecisionNote}
                    placeholder="Optional note for the studio."
                  />
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => void submitDecision(requestItem, 'approved')}
                      disabled={Boolean(decisionId)}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#FC6E20] px-4 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-stone-950 transition hover:bg-[#DD6211] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {decisionId === requestItem.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => void submitDecision(requestItem, 'parked')}
                      disabled={Boolean(decisionId)}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-white/10 px-4 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:border-[#FC6E20] hover:text-[#FC6E20] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <PauseCircle className="h-4 w-4" />
                      Park
                    </button>
                    <button
                      type="button"
                      onClick={() => void submitDecision(requestItem, 'declined')}
                      disabled={Boolean(decisionId)}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-red-400/25 bg-red-400/10 px-4 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-red-100 transition hover:border-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4" />
                      Decline
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-5 rounded-lg border border-dashed border-white/10 bg-black/20 p-4 font-montserrat text-sm leading-6 text-stone-400">
              No requests are waiting for a scope decision.
            </p>
          )}
        </div>

        <div className="rounded-lg border border-white/10 bg-[#181818] p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Clock3 className="h-5 w-5 text-[#FC6E20]" />
              <h3 className="font-playfair text-3xl font-bold text-white">Request log</h3>
            </div>
            <Pill className="border-white/10 bg-white/5 text-stone-300" label={`${requests.length} total`} />
          </div>

          <div className="grid gap-3">
            {requests.length ? (
              requests.map((requestItem) => (
                <article key={requestItem.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-montserrat text-sm font-semibold text-white">
                        {requestItem.requestNumber} - {requestItem.title}
                      </p>
                      <p className="mt-2 font-montserrat text-sm leading-6 text-stone-400">
                        {requestItem.requestDetail}
                      </p>
                    </div>
                    <Pill className={statusClass[requestItem.status]} label={requestStatusCopy[requestItem.status]} />
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <Detail label="Type" value={requestTypeCopy[requestItem.requestType]} />
                    <Detail label="Classification" value={classificationCopy[requestItem.classification]} />
                    <Detail label="Owner" value={`${requestItem.ownerName} / ${requestItem.ownerRole}`} />
                  </div>
                  <p className="mt-4 font-montserrat text-sm leading-6 text-stone-400">{requestItem.nextAction}</p>
                  {requestItem.attachmentLabel || requestItem.attachmentUrl ? (
                    <p className="mt-3 flex items-start gap-2 font-montserrat text-xs uppercase tracking-[0.16em] text-stone-500">
                      <Paperclip className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#FC6E20]" />
                      {requestItem.attachmentUrl ? (
                        <a href={requestItem.attachmentUrl} className="hover:text-[#FC6E20]">
                          {requestItem.attachmentLabel || 'Attachment'}
                        </a>
                      ) : (
                        requestItem.attachmentLabel
                      )}
                    </p>
                  ) : null}
                </article>
              ))
            ) : (
              <p className="rounded-lg border border-dashed border-white/10 bg-black/20 p-4 font-montserrat text-sm leading-6 text-stone-400">
                No project requests are logged yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
