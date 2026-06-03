'use client';

import { useState } from 'react';
import {
  AlertCircle,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Loader2,
  MessagesSquare,
} from 'lucide-react';
import type {
  PortalCommunicationContextType,
  PortalCommunicationSummary,
  PortalMeetingRequest,
  PortalMeetingStatus,
  PortalMeetingTopicType,
  PortalMessageThread,
  PortalProjectDecision,
} from '@/lib/portal-communications';

type PortalCommunicationCenterProps = {
  canSubmit: boolean;
  communicationSummary: PortalCommunicationSummary;
  projectSlug: string;
};

type CommunicationResponse = {
  decision?: {
    decidedAt: string;
    decisionNumber: string;
    id: string;
  };
  error?: string;
  meeting?: {
    id: string;
    meetingNumber: string;
    requestedAt: string;
    status: PortalMeetingStatus;
  };
  message?: {
    id: string;
    sentAt: string;
    threadId: string;
  };
  ok?: boolean;
};

type MeetingDraft = {
  agenda: string;
  attendees: string;
  preferredSlots: string;
  reason: string;
  relatedItemLabel: string;
  relatedItemType: PortalCommunicationContextType;
  title: string;
  topicType: PortalMeetingTopicType;
};

type MessageDraft = {
  actionDueOn: string;
  actionOwner: string;
  actionRequired: boolean;
  contextLabel: string;
  contextType: PortalCommunicationContextType;
  messageBody: string;
  subject: string;
  threadId: string;
};

const emptyMeetingDraft: MeetingDraft = {
  agenda: '',
  attendees: '',
  preferredSlots: '',
  reason: '',
  relatedItemLabel: '',
  relatedItemType: 'project',
  title: '',
  topicType: 'project',
};

const emptyMessageDraft: MessageDraft = {
  actionDueOn: '',
  actionOwner: '',
  actionRequired: false,
  contextLabel: '',
  contextType: 'project',
  messageBody: '',
  subject: '',
  threadId: '',
};

const topicCopy: Record<PortalMeetingTopicType, string> = {
  handoff: 'Handoff',
  kickoff: 'Kickoff',
  other: 'Other',
  project: 'Project',
  review: 'Review',
  scope: 'Scope',
  strategy: 'Strategy',
  support: 'Support',
};

const contextCopy: Record<PortalCommunicationContextType, string> = {
  approval: 'Approval',
  deliverable: 'Deliverable',
  handoff: 'Handoff',
  invoice: 'Invoice',
  meeting: 'Meeting',
  milestone: 'Milestone',
  other: 'Other',
  project: 'Project',
  request: 'Request',
  support: 'Support',
};

const meetingStatusCopy: Record<PortalMeetingStatus, string> = {
  cancelled: 'Cancelled',
  completed: 'Completed',
  declined: 'Declined',
  requested: 'Requested',
  scheduled: 'Scheduled',
};

function Pill({ label, tone = 'muted' }: { label: string; tone?: 'accent' | 'muted' | 'neutral' }) {
  const className =
    tone === 'accent'
      ? 'border-[#FC6E20]/30 bg-[#FC6E20]/10 text-[#FC6E20]'
      : tone === 'neutral'
        ? 'border-white/10 bg-white/5 text-stone-100'
        : 'border-white/10 bg-white/5 text-stone-400';

  return (
    <span className={`rounded-full border px-3 py-1.5 font-montserrat text-[11px] uppercase tracking-[0.14em] ${className}`}>
      {label}
    </span>
  );
}

function Field({
  label,
  onChange,
  placeholder,
  type = 'text',
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  value: string;
}) {
  return (
    <label>
      <span className="block font-montserrat text-[11px] uppercase tracking-[0.18em] text-stone-500">{label}</span>
      <input
        type={type}
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

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-3">
      <p className="font-montserrat text-[11px] uppercase tracking-[0.16em] text-stone-500">{label}</p>
      <p className="mt-2 font-montserrat text-sm text-white">{value || 'Not provided'}</p>
    </div>
  );
}

export function PortalCommunicationCenter({
  canSubmit,
  communicationSummary,
  projectSlug,
}: PortalCommunicationCenterProps) {
  const [meetings, setMeetings] = useState(communicationSummary.meetings);
  const [threads, setThreads] = useState(communicationSummary.threads);
  const [decisions] = useState(communicationSummary.decisions);
  const [meetingDraft, setMeetingDraft] = useState<MeetingDraft>(emptyMeetingDraft);
  const [messageDraft, setMessageDraft] = useState<MessageDraft>(emptyMessageDraft);
  const [savingMeeting, setSavingMeeting] = useState(false);
  const [savingMessage, setSavingMessage] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; tone: 'error' | 'success' } | null>(null);

  function updateMeetingDraft(patch: Partial<MeetingDraft>) {
    setMeetingDraft((current) => ({ ...current, ...patch }));
  }

  function updateMessageDraft(patch: Partial<MessageDraft>) {
    setMessageDraft((current) => ({ ...current, ...patch }));
  }

  function formatNow(value: string) {
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

  async function submitMeeting() {
    setSavingMeeting(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/portal/communications', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'meeting_request',
          ...meetingDraft,
          projectSlug,
          sourceChannel: 'portal',
        }),
      });
      const payload = (await response.json()) as CommunicationResponse;

      if (!response.ok || !payload.ok || !payload.meeting) {
        throw new Error(payload.error || 'Meeting request could not be submitted.');
      }

      const requestedAt = formatNow(payload.meeting.requestedAt);
      const newMeeting: PortalMeetingRequest = {
        agenda: meetingDraft.agenda,
        attendees: meetingDraft.attendees,
        clientName: communicationSummary.latestMeeting?.clientName ?? communicationSummary.latestDecision?.clientName ?? '',
        id: payload.meeting.id,
        meetingLink: '',
        meetingNumber: payload.meeting.meetingNumber,
        nextAction: 'The studio will confirm whether a meeting is needed and propose a slot.',
        ownerName: 'Kreative Reflow',
        ownerRole: 'Studio',
        preferredSlots: meetingDraft.preferredSlots,
        projectName: communicationSummary.latestMeeting?.projectName ?? communicationSummary.latestDecision?.projectName ?? '',
        projectSlug,
        reason: meetingDraft.reason,
        relatedItemLabel: meetingDraft.relatedItemLabel,
        relatedItemType: meetingDraft.relatedItemType,
        requestedAt,
        requestedByEmail: '',
        requestedByRole: '',
        scheduledFor: 'Not scheduled',
        source: 'supabase',
        status: payload.meeting.status,
        studioNote: '',
        title: meetingDraft.title,
        topicType: meetingDraft.topicType,
      };

      setMeetings((current) => [newMeeting, ...current]);
      setMeetingDraft(emptyMeetingDraft);
      setFeedback({ message: 'Meeting request submitted.', tone: 'success' });
    } catch (error) {
      setFeedback({
        message: error instanceof Error ? error.message : 'Meeting request could not be submitted.',
        tone: 'error',
      });
    } finally {
      setSavingMeeting(false);
    }
  }

  async function submitMessage() {
    setSavingMessage(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/portal/communications', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'message',
          ...messageDraft,
          projectSlug,
          sourceChannel: 'portal',
        }),
      });
      const payload = (await response.json()) as CommunicationResponse;

      if (!response.ok || !payload.ok || !payload.message) {
        throw new Error(payload.error || 'Message could not be posted.');
      }

      const sentAt = formatNow(payload.message.sentAt);
      const newMessage = {
        actionDueOn: messageDraft.actionDueOn || 'Not set',
        actionOwner: messageDraft.actionOwner,
        actionRequired: messageDraft.actionRequired,
        authorEmail: '',
        authorRole: 'client',
        id: payload.message.id,
        messageBody: messageDraft.messageBody,
        sentAt,
        source: 'supabase' as const,
        sourceChannel: 'portal' as const,
        threadId: payload.message.threadId,
        visibility: 'client_visible' as const,
      };

      setThreads((current) => {
        const existingThread = current.find((thread) => thread.id === payload.message?.threadId);

        if (existingThread) {
          return current.map((thread) =>
            thread.id === payload.message?.threadId
              ? {
                  ...thread,
                  lastMessageAt: sentAt,
                  messages: [...thread.messages, newMessage],
                  ownerName: 'Kreative Reflow',
                  ownerRole: 'Studio',
                  status: 'waiting_studio',
                }
              : thread
          );
        }

        const newThread: PortalMessageThread = {
          clientName: communicationSummary.latestMeeting?.clientName ?? communicationSummary.latestDecision?.clientName ?? '',
          contextLabel: messageDraft.contextLabel,
          contextType: messageDraft.contextType,
          createdByEmail: '',
          id: payload.message?.threadId ?? `local-thread-${Date.now()}`,
          internalNote: '',
          lastMessageAt: sentAt,
          messages: [newMessage],
          ownerName: 'Kreative Reflow',
          ownerRole: 'Studio',
          projectName: communicationSummary.latestMeeting?.projectName ?? communicationSummary.latestDecision?.projectName ?? '',
          projectSlug,
          source: 'supabase',
          status: 'waiting_studio',
          subject: messageDraft.subject,
          summary: `Message thread for ${messageDraft.contextLabel || contextCopy[messageDraft.contextType]}.`,
          threadKey: 'New thread',
        };

        return [newThread, ...current];
      });
      setMessageDraft(emptyMessageDraft);
      setFeedback({ message: 'Message posted.', tone: 'success' });
    } catch (error) {
      setFeedback({
        message: error instanceof Error ? error.message : 'Message could not be posted.',
        tone: 'error',
      });
    } finally {
      setSavingMessage(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="grid gap-6">
        <div className="rounded-lg border border-white/10 bg-[#181818] p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.18em] text-[#FC6E20]">
                Meeting request
              </p>
              <h3 className="mt-2 font-playfair text-3xl font-bold text-white">Ask for a focused meeting.</h3>
            </div>
            <CalendarClock className="h-6 w-6 text-[#FC6E20]" />
          </div>

          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className="block font-montserrat text-[11px] uppercase tracking-[0.18em] text-stone-500">
                  Topic
                </span>
                <select
                  value={meetingDraft.topicType}
                  onChange={(event) => updateMeetingDraft({ topicType: event.target.value as PortalMeetingTopicType })}
                  className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-black/20 px-4 font-montserrat text-sm text-white outline-none transition focus:border-[#FC6E20]"
                >
                  {(Object.keys(topicCopy) as PortalMeetingTopicType[]).map((topic) => (
                    <option key={topic} value={topic}>
                      {topicCopy[topic]}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="block font-montserrat text-[11px] uppercase tracking-[0.18em] text-stone-500">
                  Related to
                </span>
                <select
                  value={meetingDraft.relatedItemType}
                  onChange={(event) => updateMeetingDraft({ relatedItemType: event.target.value as PortalCommunicationContextType })}
                  className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-black/20 px-4 font-montserrat text-sm text-white outline-none transition focus:border-[#FC6E20]"
                >
                  {(Object.keys(contextCopy) as PortalCommunicationContextType[]).map((context) => (
                    <option key={context} value={context}>
                      {contextCopy[context]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <Field label="Title" value={meetingDraft.title} onChange={(value) => updateMeetingDraft({ title: value })} />
            <TextAreaField label="Reason" value={meetingDraft.reason} onChange={(value) => updateMeetingDraft({ reason: value })} />
            <TextAreaField
              label="Preferred slots"
              value={meetingDraft.preferredSlots}
              onChange={(value) => updateMeetingDraft({ preferredSlots: value })}
              placeholder="Example: Tuesday morning, Wednesday after 14:00"
            />
            <Field label="Attendees" value={meetingDraft.attendees} onChange={(value) => updateMeetingDraft({ attendees: value })} />
            <TextAreaField label="Agenda" value={meetingDraft.agenda} onChange={(value) => updateMeetingDraft({ agenda: value })} />
            <Field
              label="Related item label"
              value={meetingDraft.relatedItemLabel}
              onChange={(value) => updateMeetingDraft({ relatedItemLabel: value })}
              placeholder="Example: Homepage concept v1"
            />
            <button
              type="button"
              onClick={() => void submitMeeting()}
              disabled={!canSubmit || savingMeeting}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#FC6E20] px-5 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-stone-950 transition-colors hover:bg-[#e05a15] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingMeeting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUpRight className="h-4 w-4" />}
              Request meeting
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-[#181818] p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.18em] text-[#FC6E20]">
                Message thread
              </p>
              <h3 className="mt-2 font-playfair text-3xl font-bold text-white">Post a project message.</h3>
            </div>
            <MessagesSquare className="h-6 w-6 text-[#FC6E20]" />
          </div>

          <div className="grid gap-4">
            <label>
              <span className="block font-montserrat text-[11px] uppercase tracking-[0.18em] text-stone-500">
                Thread
              </span>
              <select
                value={messageDraft.threadId}
                onChange={(event) => updateMessageDraft({ threadId: event.target.value })}
                className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-black/20 px-4 font-montserrat text-sm text-white outline-none transition focus:border-[#FC6E20]"
              >
                <option value="">New thread</option>
                {threads.map((thread) => (
                  <option key={thread.id} value={thread.id}>
                    {thread.subject}
                  </option>
                ))}
              </select>
            </label>
            {!messageDraft.threadId ? (
              <>
                <Field label="Subject" value={messageDraft.subject} onChange={(value) => updateMessageDraft({ subject: value })} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <label>
                    <span className="block font-montserrat text-[11px] uppercase tracking-[0.18em] text-stone-500">
                      Context
                    </span>
                    <select
                      value={messageDraft.contextType}
                      onChange={(event) => updateMessageDraft({ contextType: event.target.value as PortalCommunicationContextType })}
                      className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-black/20 px-4 font-montserrat text-sm text-white outline-none transition focus:border-[#FC6E20]"
                    >
                      {(Object.keys(contextCopy) as PortalCommunicationContextType[]).map((context) => (
                        <option key={context} value={context}>
                          {contextCopy[context]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <Field
                    label="Context label"
                    value={messageDraft.contextLabel}
                    onChange={(value) => updateMessageDraft({ contextLabel: value })}
                  />
                </div>
              </>
            ) : null}
            <TextAreaField label="Message" value={messageDraft.messageBody} onChange={(value) => updateMessageDraft({ messageBody: value })} />
            <label className="flex min-h-11 items-center gap-3 rounded-lg border border-white/10 bg-black/20 px-4 py-3">
              <input
                type="checkbox"
                checked={messageDraft.actionRequired}
                onChange={(event) => updateMessageDraft({ actionRequired: event.target.checked })}
                className="h-4 w-4 accent-[#FC6E20]"
              />
              <span className="font-montserrat text-xs font-semibold text-white">Action required</span>
            </label>
            {messageDraft.actionRequired ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Action owner" value={messageDraft.actionOwner} onChange={(value) => updateMessageDraft({ actionOwner: value })} />
                <Field
                  label="Action due"
                  type="date"
                  value={messageDraft.actionDueOn}
                  onChange={(value) => updateMessageDraft({ actionDueOn: value })}
                />
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => void submitMessage()}
              disabled={!canSubmit || savingMessage}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#FC6E20] px-5 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-stone-950 transition-colors hover:bg-[#e05a15] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingMessage ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUpRight className="h-4 w-4" />}
              Post message
            </button>
          </div>
        </div>

        {feedback ? (
          <p
            className={`flex items-start gap-2 rounded-lg border p-3 font-montserrat text-sm leading-6 ${
              feedback.tone === 'success'
                ? 'border-[#FC6E20]/30 bg-[#FC6E20]/10 text-[#FC6E20]'
                : 'border-red-400/25 bg-red-400/10 text-red-100'
            }`}
          >
            {feedback.tone === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            {feedback.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-6">
        <div className="rounded-lg border border-white/10 bg-[#181818] p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h3 className="font-playfair text-3xl font-bold text-white">Meetings</h3>
            <Pill label={`${meetings.length} total`} />
          </div>
          <div className="grid gap-3">
            {meetings.length ? (
              meetings.map((meeting) => (
                <article key={meeting.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-montserrat text-sm font-semibold text-white">
                        {meeting.meetingNumber} - {meeting.title}
                      </p>
                      <p className="mt-2 font-montserrat text-sm leading-6 text-stone-400">{meeting.reason}</p>
                    </div>
                    <Pill label={meetingStatusCopy[meeting.status]} tone={meeting.status === 'scheduled' ? 'accent' : 'muted'} />
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <Detail label="Preferred" value={meeting.preferredSlots} />
                    <Detail label="Scheduled" value={meeting.scheduledFor} />
                    <Detail label="Owner" value={`${meeting.ownerName} / ${meeting.ownerRole}`} />
                  </div>
                  <p className="mt-4 font-montserrat text-sm leading-6 text-stone-400">{meeting.nextAction}</p>
                </article>
              ))
            ) : (
              <p className="rounded-lg border border-dashed border-white/10 bg-black/20 p-4 font-montserrat text-sm leading-6 text-stone-400">
                No meeting requests are logged yet.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-[#181818] p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h3 className="font-playfair text-3xl font-bold text-white">Messages</h3>
            <Pill label={`${threads.length} threads`} />
          </div>
          <div className="grid gap-3">
            {threads.length ? (
              threads.map((thread) => (
                <article key={thread.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-montserrat text-sm font-semibold text-white">{thread.subject}</p>
                      <p className="mt-2 font-montserrat text-sm leading-6 text-stone-400">{thread.summary}</p>
                    </div>
                    <Pill label={thread.status.replace(/_/g, ' ')} tone={thread.status === 'waiting_studio' ? 'accent' : 'muted'} />
                  </div>
                  <div className="mt-4 grid gap-3">
                    {thread.messages.map((message) => (
                      <div key={message.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                        <p className="font-montserrat text-sm leading-6 text-white">{message.messageBody}</p>
                        <p className="mt-2 font-mono text-xs text-stone-500">{message.sentAt}</p>
                        {message.actionRequired ? (
                          <p className="mt-2 font-montserrat text-xs uppercase tracking-[0.14em] text-[#FC6E20]">
                            Action: {message.actionOwner || 'Owner needed'} / due {message.actionDueOn}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </article>
              ))
            ) : (
              <p className="rounded-lg border border-dashed border-white/10 bg-black/20 p-4 font-montserrat text-sm leading-6 text-stone-400">
                No message threads are logged yet.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-[#181818] p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <ClipboardCheck className="h-5 w-5 text-[#FC6E20]" />
              <h3 className="font-playfair text-3xl font-bold text-white">Decision log</h3>
            </div>
            <Pill label={`${decisions.length} decisions`} />
          </div>
          <div className="grid gap-3">
            {decisions.length ? (
              decisions.map((decision) => (
                <article key={decision.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-montserrat text-sm font-semibold text-white">
                        {decision.decisionNumber} - {decision.title}
                      </p>
                      <p className="mt-2 font-montserrat text-sm leading-6 text-stone-400">{decision.decisionSummary}</p>
                    </div>
                    <Pill label={decision.decisionType.replace(/_/g, ' ')} tone="neutral" />
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <Detail label="Outcome" value={decision.outcome} />
                    <Detail label="Action items" value={decision.actionItems} />
                    <Detail label="Owner" value={`${decision.ownerName} / ${decision.ownerRole}`} />
                    <Detail label="Due" value={decision.dueOn} />
                  </div>
                </article>
              ))
            ) : (
              <p className="rounded-lg border border-dashed border-white/10 bg-black/20 p-4 font-montserrat text-sm leading-6 text-stone-400">
                No official decisions are logged yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
