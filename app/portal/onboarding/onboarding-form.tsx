'use client';

import { FormEvent, useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, Save } from 'lucide-react';
import {
  brandAssetOptions,
  onboardingServiceOptions,
  type PortalOnboardingStatus,
} from '@/lib/portal-onboarding';

type OnboardingFormProps = {
  canSubmit: boolean;
  projectSlug: string;
  role: string;
};

type SubmitMode = 'demo' | 'filtered' | 'supabase';

type ApiResult = {
  ok?: boolean;
  mode?: SubmitMode;
  status?: PortalOnboardingStatus;
  error?: string;
};

const inputClass =
  'mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-black/25 px-4 font-montserrat text-sm text-stone-100 outline-none transition-colors placeholder:text-stone-600 focus:border-[#FC6E20] focus:ring-2 focus:ring-[#FC6E20]/20';

const textareaClass =
  'mt-2 w-full resize-none rounded-lg border border-white/10 bg-black/25 px-4 py-4 font-montserrat text-sm leading-6 text-stone-100 outline-none transition-colors placeholder:text-stone-600 focus:border-[#FC6E20] focus:ring-2 focus:ring-[#FC6E20]/20';

const labelClass =
  'font-montserrat text-[11px] font-bold uppercase tracking-[0.18em] text-stone-500';

const requiredLabelClass =
  'rounded-full border border-[#FC6E20]/30 px-2 py-1 font-montserrat text-[10px] uppercase tracking-[0.14em] text-[#FC6E20]';

const optionalLabelClass =
  'rounded-full border border-white/10 px-2 py-1 font-montserrat text-[10px] uppercase tracking-[0.14em] text-stone-500';

function getMessage(result: ApiResult) {
  if (result.mode === 'demo') {
    return result.status === 'submitted'
      ? 'Onboarding checked and confirmed in preview mode. Supabase env vars are not configured, so no live database write happened.'
      : 'Draft checked and held in preview mode. Supabase env vars are not configured, so no live database write happened.';
  }

  if (result.mode === 'filtered') {
    return 'Onboarding received.';
  }

  return result.status === 'submitted'
    ? 'Onboarding submitted. The studio can now review this against the project record.'
    : 'Draft saved. You can come back and complete the missing details before kickoff.';
}

export function OnboardingForm({ canSubmit, projectSlug, role }: OnboardingFormProps) {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [approvalRole, setApprovalRole] = useState('');
  const [projectGoals, setProjectGoals] = useState('');
  const [primaryAudience, setPrimaryAudience] = useState('');
  const [services, setServices] = useState<string[]>(['New website / redesign']);
  const [accessNeeds, setAccessNeeds] = useState('');
  const [brandAssetsStatus, setBrandAssetsStatus] = useState(brandAssetOptions[0]);
  const [technicalAccounts, setTechnicalAccounts] = useState('');
  const [preferredDeadline, setPreferredDeadline] = useState('');
  const [launchConstraints, setLaunchConstraints] = useState('');
  const [contentNotes, setContentNotes] = useState('');
  const [consentToTerms, setConsentToTerms] = useState(false);
  const [website, setWebsite] = useState('');
  const [sendingStatus, setSendingStatus] = useState<PortalOnboardingStatus | null>(null);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState('');

  const isSending = sendingStatus !== null;

  function toggleService(option: string) {
    setServices((current) => {
      if (current.includes(option)) {
        return current.filter((item) => item !== option);
      }

      return [...current, option];
    });
  }

  async function submitOnboarding(status: PortalOnboardingStatus) {
    if (!canSubmit) {
      setError('Your portal role has read-only access for this project.');
      return;
    }

    setSendingStatus(status);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/portal/onboarding', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectSlug,
          status,
          contactName,
          contactEmail,
          approvalRole,
          projectGoals,
          primaryAudience,
          services,
          accessNeeds,
          brandAssetsStatus,
          technicalAccounts,
          preferredDeadline,
          launchConstraints,
          contentNotes,
          consentToTerms,
          website,
        }),
      });

      const payload = (await response.json()) as ApiResult;

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || 'Onboarding could not be saved.');
      }

      setResult(payload);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Onboarding could not be saved.');
    } finally {
      setSendingStatus(null);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitOnboarding('submitted');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-white/10 bg-[#181818] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.2)] md:p-7"
    >
      <input
        type="text"
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="border-b border-white/10 pb-6">
        <p className="font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#FC6E20]">
          Client onboarding
        </p>
        <h2 className="mt-3 font-playfair text-4xl font-bold leading-tight text-white md:text-5xl">
          Project questionnaire
        </h2>
        <p className="mt-4 max-w-2xl font-montserrat text-sm leading-6 text-stone-400">
          Capture the delivery basics before files, approvals, and launch planning start moving.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/10 px-3 py-1.5 font-montserrat text-[11px] uppercase tracking-[0.14em] text-stone-400">
            Role: {role.replace('_', ' ')}
          </span>
          {!canSubmit ? (
            <span className="rounded-full border border-[#FC6E20]/30 bg-[#FC6E20]/10 px-3 py-1.5 font-montserrat text-[11px] uppercase tracking-[0.14em] text-[#FC6E20]">
              Read only
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="flex items-center justify-between gap-3">
            <span className={labelClass}>Approval contact</span>
            <span className={requiredLabelClass}>Required</span>
          </span>
          <input
            value={contactName}
            onChange={(event) => setContactName(event.target.value)}
            autoComplete="name"
            aria-required="true"
            disabled={!canSubmit}
            className={inputClass}
            placeholder="Name and surname"
          />
        </label>

        <label className="block">
          <span className="flex items-center justify-between gap-3">
            <span className={labelClass}>Email</span>
            <span className={requiredLabelClass}>Required</span>
          </span>
          <input
            type="email"
            value={contactEmail}
            onChange={(event) => setContactEmail(event.target.value)}
            autoComplete="email"
            aria-required="true"
            disabled={!canSubmit}
            className={inputClass}
            placeholder="approver@example.com"
          />
        </label>
      </div>

      <label className="mt-5 block">
        <span className="flex items-center justify-between gap-3">
          <span className={labelClass}>Approval role</span>
          <span className={requiredLabelClass}>Required</span>
        </span>
        <input
          value={approvalRole}
          onChange={(event) => setApprovalRole(event.target.value)}
          aria-required="true"
          disabled={!canSubmit}
          className={inputClass}
          placeholder="Founder, marketing lead, operations manager"
        />
      </label>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="flex items-center justify-between gap-3">
            <span className={labelClass}>Project goals</span>
            <span className={requiredLabelClass}>Required</span>
          </span>
          <textarea
            value={projectGoals}
            onChange={(event) => setProjectGoals(event.target.value)}
            rows={6}
            aria-required="true"
            disabled={!canSubmit}
            className={textareaClass}
            placeholder="What should this project make clearer, faster, safer, or easier?"
          />
        </label>

        <label className="block">
          <span className="flex items-center justify-between gap-3">
            <span className={labelClass}>Primary audience</span>
            <span className={requiredLabelClass}>Required</span>
          </span>
          <textarea
            value={primaryAudience}
            onChange={(event) => setPrimaryAudience(event.target.value)}
            rows={6}
            aria-required="true"
            disabled={!canSubmit}
            className={textareaClass}
            placeholder="Who needs to use, trust, buy from, or approve this?"
          />
        </label>
      </div>

      <fieldset className="mt-5">
        <div className="flex items-center justify-between gap-3">
          <legend className={labelClass}>Services needed</legend>
          <span className={requiredLabelClass}>Required</span>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {onboardingServiceOptions.map((option) => (
            <label
              key={option}
              className="flex min-h-12 items-center gap-3 rounded-lg border border-white/10 bg-black/20 px-4 font-montserrat text-sm text-stone-300"
            >
              <input
                type="checkbox"
                checked={services.includes(option)}
                onChange={() => toggleService(option)}
                disabled={!canSubmit}
                className="h-4 w-4 accent-[#FC6E20]"
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="flex items-center justify-between gap-3">
            <span className={labelClass}>Brand assets</span>
            <span className={optionalLabelClass}>Optional</span>
          </span>
          <select
            value={brandAssetsStatus}
            onChange={(event) => setBrandAssetsStatus(event.target.value)}
            disabled={!canSubmit}
            className={`${inputClass} appearance-none`}
          >
            {brandAssetOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="flex items-center justify-between gap-3">
            <span className={labelClass}>Preferred deadline</span>
            <span className={requiredLabelClass}>Required</span>
          </span>
          <input
            type="date"
            value={preferredDeadline}
            onChange={(event) => setPreferredDeadline(event.target.value)}
            aria-required="true"
            disabled={!canSubmit}
            className={inputClass}
          />
        </label>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="flex items-center justify-between gap-3">
            <span className={labelClass}>Access needs</span>
            <span className={optionalLabelClass}>Optional</span>
          </span>
          <textarea
            value={accessNeeds}
            onChange={(event) => setAccessNeeds(event.target.value)}
            rows={5}
            disabled={!canSubmit}
            className={textareaClass}
            placeholder="Domains, hosting, CMS, analytics, booking tools, payment tools."
          />
        </label>

        <label className="block">
          <span className="flex items-center justify-between gap-3">
            <span className={labelClass}>Technical accounts</span>
            <span className={optionalLabelClass}>Optional</span>
          </span>
          <textarea
            value={technicalAccounts}
            onChange={(event) => setTechnicalAccounts(event.target.value)}
            rows={5}
            disabled={!canSubmit}
            className={textareaClass}
            placeholder="Who owns each login? Do any accounts need new users or handoff?"
          />
        </label>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="flex items-center justify-between gap-3">
            <span className={labelClass}>Deadline constraints</span>
            <span className={optionalLabelClass}>Optional</span>
          </span>
          <textarea
            value={launchConstraints}
            onChange={(event) => setLaunchConstraints(event.target.value)}
            rows={4}
            disabled={!canSubmit}
            className={textareaClass}
            placeholder="Events, campaigns, compliance dates, staff availability, shutdown periods."
          />
        </label>

        <label className="block">
          <span className="flex items-center justify-between gap-3">
            <span className={labelClass}>Content notes</span>
            <span className={optionalLabelClass}>Optional</span>
          </span>
          <textarea
            value={contentNotes}
            onChange={(event) => setContentNotes(event.target.value)}
            rows={4}
            disabled={!canSubmit}
            className={textareaClass}
            placeholder="Pages, services, FAQs, bios, case studies, proof, documents, or gaps."
          />
        </label>
      </div>

      <label className="mt-6 flex items-start gap-3 rounded-lg border border-white/10 bg-black/20 p-4 font-montserrat text-sm leading-6 text-stone-300">
        <input
          type="checkbox"
          checked={consentToTerms}
          onChange={(event) => setConsentToTerms(event.target.checked)}
          disabled={!canSubmit}
          className="mt-1 h-4 w-4 accent-[#FC6E20] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FC6E20]"
        />
        <span>
          I understand these answers are used to plan and deliver this project.
          I have read the{' '}
          <a
            className="text-[#FC6E20] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FC6E20]"
            href="/privacy"
          >
            privacy policy
          </a>{' '}
          and{' '}
          <a
            className="text-[#FC6E20] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FC6E20]"
            href="/terms"
          >
            terms
          </a>
          .
        </span>
      </label>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          disabled={isSending || !canSubmit}
          onClick={() => void submitOnboarding('draft')}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/15 px-5 font-montserrat text-xs font-bold uppercase tracking-[0.14em] text-stone-100 transition-colors hover:border-[#FC6E20] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FC6E20] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sendingStatus === 'draft' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save draft
        </button>

        <button
          type="submit"
          disabled={isSending || !canSubmit}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#FC6E20] px-5 font-montserrat text-xs font-bold uppercase tracking-[0.14em] text-stone-950 transition-colors hover:bg-[#e05a15] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FC6E20] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sendingStatus === 'submitted' ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          Submit onboarding
        </button>
      </div>

      {error ? (
        <p className="mt-5 flex items-start gap-3 rounded-lg border border-red-400/25 bg-red-400/10 p-4 font-montserrat text-sm leading-6 text-red-100">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          {error}
        </p>
      ) : null}

      {result ? (
        <p className="mt-5 flex items-start gap-3 rounded-lg border border-[#FC6E20]/25 bg-[#FC6E20]/10 p-4 font-montserrat text-sm leading-6 text-stone-100">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#FC6E20]" />
          {getMessage(result)}
        </p>
      ) : null}
    </form>
  );
}
