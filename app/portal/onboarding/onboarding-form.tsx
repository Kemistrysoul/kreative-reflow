'use client';

import { FormEvent, useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, Save } from 'lucide-react';
import {
  approvalRoleOptions,
  audienceTypeOptions,
  brandAssetOptions,
  budgetRangeOptions,
  communicationChannelOptions,
  integrationOptions,
  onboardingServiceOptions,
  revisionRoundOptions,
  updateCadenceOptions,
  urgentChannelOptions,
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

const sectionDividerClass =
  'mt-8 border-t border-white/10 pt-6';

const sectionTitleClass =
  'font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-[#FC6E20]';

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
  const [contactPhone, setContactPhone] = useState('');
  const [approvalRole, setApprovalRole] = useState(approvalRoleOptions[0]);
  const [audienceType, setAudienceType] = useState(audienceTypeOptions[0]);
  const [currentWebsite, setCurrentWebsite] = useState('');
  const [projectGoals, setProjectGoals] = useState('');
  const [primaryAudience, setPrimaryAudience] = useState('');
  const [services, setServices] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState(budgetRangeOptions[0]);
  const [competitors, setCompetitors] = useState('');
  const [decisionProcess, setDecisionProcess] = useState('');
  const [specificFeatures, setSpecificFeatures] = useState('');
  const [toneStylePreferences, setToneStylePreferences] = useState('');
  const [socialPresence, setSocialPresence] = useState('');
  const [previousAgencyExperience, setPreviousAgencyExperience] = useState('');
  const [existingIntegrations, setExistingIntegrations] = useState<string[]>([]);
  const [missingContentOwner, setMissingContentOwner] = useState('');
  const [missingContentDueDate, setMissingContentDueDate] = useState('');
  const [missingAccessOwner, setMissingAccessOwner] = useState('');
  const [missingAccessDueDate, setMissingAccessDueDate] = useState('');
  const [updateCadence, setUpdateCadence] = useState(updateCadenceOptions[0]);
  const [preferredUpdateChannel, setPreferredUpdateChannel] = useState(communicationChannelOptions[0]);
  const [urgentChannel, setUrgentChannel] = useState(urgentChannelOptions[0]);
  const [meetingAvailability, setMeetingAvailability] = useState('');
  const [scopeInclusions, setScopeInclusions] = useState('');
  const [scopeExclusions, setScopeExclusions] = useState('');
  const [revisionRounds, setRevisionRounds] = useState(revisionRoundOptions[0]);
  const [changeRequestAuthority, setChangeRequestAuthority] = useState('');
  const [scopeBoundaryAccepted, setScopeBoundaryAccepted] = useState(false);
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

  function toggleIntegration(option: string) {
    setExistingIntegrations((current) => {
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
          contactPhone,
          approvalRole,
          audienceType,
          currentWebsite,
          projectGoals,
          primaryAudience,
          services,
          budgetRange,
          competitors,
          decisionProcess,
          specificFeatures,
          toneStylePreferences,
          socialPresence,
          previousAgencyExperience,
          existingIntegrations,
          missingContentOwner,
          missingContentDueDate,
          missingAccessOwner,
          missingAccessDueDate,
          updateCadence,
          preferredUpdateChannel,
          urgentChannel,
          meetingAvailability,
          scopeInclusions,
          scopeExclusions,
          revisionRounds,
          changeRequestAuthority,
          scopeBoundaryAccepted,
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
          Every required field helps us plan more accurately and avoid delays.
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

      {/* Contact and authority */}
      <div className={sectionDividerClass}>
        <p className={sectionTitleClass}>Contact and authority</p>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
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

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="flex items-center justify-between gap-3">
            <span className={labelClass}>Phone number</span>
            <span className={requiredLabelClass}>Required</span>
          </span>
          <input
            type="tel"
            value={contactPhone}
            onChange={(event) => setContactPhone(event.target.value)}
            autoComplete="tel"
            aria-required="true"
            disabled={!canSubmit}
            className={inputClass}
            placeholder="+27..."
          />
        </label>

        <label className="block">
          <span className="flex items-center justify-between gap-3">
            <span className={labelClass}>Approval role</span>
            <span className={requiredLabelClass}>Required</span>
          </span>
          <select
            value={approvalRole}
            onChange={(event) => setApprovalRole(event.target.value)}
            aria-required="true"
            disabled={!canSubmit}
            className={`${inputClass} appearance-none`}
          >
            {approvalRoleOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-5 block">
        <span className="flex items-center justify-between gap-3">
          <span className={labelClass}>Decision-making process</span>
          <span className={optionalLabelClass}>Optional</span>
        </span>
        <input
          value={decisionProcess}
          onChange={(event) => setDecisionProcess(event.target.value)}
          disabled={!canSubmit}
          className={inputClass}
          placeholder="Who else needs to approve decisions? Board, CEO, marketing committee?"
        />
      </label>

      {/* Project scope */}
      <div className={sectionDividerClass}>
        <p className={sectionTitleClass}>Project scope</p>
      </div>

      <label className="mt-5 block">
        <span className="flex items-center justify-between gap-3">
          <span className={labelClass}>Current website URL</span>
          <span className={requiredLabelClass}>Required</span>
        </span>
        <input
          type="text"
          inputMode="url"
          value={currentWebsite}
          onChange={(event) => setCurrentWebsite(event.target.value)}
          aria-required="true"
          disabled={!canSubmit}
          className={inputClass}
          placeholder="https://www.example.co.za - or write 'No existing website'"
        />
      </label>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="flex items-center justify-between gap-3">
            <span className={labelClass}>Budget range</span>
            <span className={requiredLabelClass}>Required</span>
          </span>
          <select
            value={budgetRange}
            onChange={(event) => setBudgetRange(event.target.value)}
            aria-required="true"
            disabled={!canSubmit}
            className={`${inputClass} appearance-none`}
          >
            {budgetRangeOptions.map((option) => (
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
          <p className="mt-2 font-montserrat text-xs leading-5 text-stone-500">
            Typical projects run 6-10 weeks. This helps us plan, not a hard promise.
          </p>
        </label>
      </div>

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

        <div className="block">
          <span className="flex items-center justify-between gap-3">
            <span className={labelClass}>Primary audience</span>
            <span className={requiredLabelClass}>Required</span>
          </span>
          <fieldset className="mt-3">
            <legend className="sr-only">Audience type</legend>
            <div className="flex flex-wrap gap-2">
              {audienceTypeOptions.map((option) => (
                <label
                  key={option}
                  className={`flex min-h-10 items-center gap-2 rounded-lg border px-4 font-montserrat text-sm transition-colors ${
                    audienceType === option
                      ? 'border-[#FC6E20]/40 bg-[#FC6E20]/10 text-white'
                      : 'border-white/10 bg-black/20 text-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="audienceType"
                    value={option}
                    checked={audienceType === option}
                    onChange={(event) => setAudienceType(event.target.value)}
                    disabled={!canSubmit}
                    className="h-4 w-4 accent-[#FC6E20]"
                  />
                  {option}
                </label>
              ))}
            </div>
          </fieldset>
          <textarea
            value={primaryAudience}
            onChange={(event) => setPrimaryAudience(event.target.value)}
            rows={5}
            aria-required="true"
            disabled={!canSubmit}
            className={textareaClass}
            placeholder="Who needs to use, trust, buy from, or approve this?"
          />
        </div>
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

      <label className="mt-5 block">
        <span className="flex items-center justify-between gap-3">
          <span className={labelClass}>Specific features and must-haves</span>
          <span className={optionalLabelClass}>Optional</span>
        </span>
        <textarea
          value={specificFeatures}
          onChange={(event) => setSpecificFeatures(event.target.value)}
          rows={4}
          disabled={!canSubmit}
          className={textareaClass}
          placeholder="Online booking with SMS reminders, client login area, document upload, quote calculator, multi-language support..."
        />
      </label>

      {/* Competitive context */}
      <div className={sectionDividerClass}>
        <p className={sectionTitleClass}>Competitive context</p>
      </div>

      <label className="mt-5 block">
        <span className="flex items-center justify-between gap-3">
          <span className={labelClass}>Competitors or reference websites</span>
          <span className={requiredLabelClass}>Required</span>
        </span>
        <textarea
          value={competitors}
          onChange={(event) => setCompetitors(event.target.value)}
          rows={4}
          aria-required="true"
          disabled={!canSubmit}
          className={textareaClass}
          placeholder="List competitor websites or examples you admire. What do you like or dislike about them?"
        />
      </label>

      <label className="mt-5 block">
        <span className="flex items-center justify-between gap-3">
          <span className={labelClass}>Tone and style preferences</span>
          <span className={optionalLabelClass}>Optional</span>
        </span>
        <input
          value={toneStylePreferences}
          onChange={(event) => setToneStylePreferences(event.target.value)}
          disabled={!canSubmit}
          className={inputClass}
          placeholder="Premium and minimal, bold and colourful, corporate and conservative, warm and approachable..."
        />
      </label>

      <label className="mt-5 block">
        <span className="flex items-center justify-between gap-3">
          <span className={labelClass}>Previous agency or developer experience</span>
          <span className={optionalLabelClass}>Optional</span>
        </span>
        <textarea
          value={previousAgencyExperience}
          onChange={(event) => setPreviousAgencyExperience(event.target.value)}
          rows={3}
          disabled={!canSubmit}
          className={textareaClass}
          placeholder="Have you worked with an agency or developer before? What went well? What would you change?"
        />
      </label>

      {/* Technical and access */}
      <div className={sectionDividerClass}>
        <p className={sectionTitleClass}>Technical and access</p>
      </div>

      <fieldset className="mt-5">
        <div className="flex items-center justify-between gap-3">
          <legend className={labelClass}>Existing integrations and tools</legend>
          <span className={optionalLabelClass}>Optional</span>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {integrationOptions.map((option) => (
            <label
              key={option}
              className="flex min-h-12 items-center gap-3 rounded-lg border border-white/10 bg-black/20 px-4 font-montserrat text-sm text-stone-300"
            >
              <input
                type="checkbox"
                checked={existingIntegrations.includes(option)}
                onChange={() => toggleIntegration(option)}
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
            <span className={labelClass}>Missing access owner</span>
            <span className={optionalLabelClass}>Optional</span>
          </span>
          <input
            value={missingAccessOwner}
            onChange={(event) => setMissingAccessOwner(event.target.value)}
            disabled={!canSubmit}
            className={inputClass}
            placeholder="Who can provide DNS, hosting, analytics, CRM, or payment access?"
          />
        </label>

        <label className="block">
          <span className="flex items-center justify-between gap-3">
            <span className={labelClass}>Missing access due date</span>
            <span className={optionalLabelClass}>Optional</span>
          </span>
          <input
            type="date"
            value={missingAccessDueDate}
            onChange={(event) => setMissingAccessDueDate(event.target.value)}
            disabled={!canSubmit}
            className={inputClass}
          />
        </label>
      </div>

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
            <span className={labelClass}>Social media and online presence</span>
            <span className={optionalLabelClass}>Optional</span>
          </span>
          <textarea
            value={socialPresence}
            onChange={(event) => setSocialPresence(event.target.value)}
            rows={3}
            disabled={!canSubmit}
            className={textareaClass}
            placeholder="Instagram, LinkedIn, Facebook, Google Business Profile, or other online profiles."
          />
        </label>
      </div>

      {/* Content and timeline */}
      <div className={sectionDividerClass}>
        <p className={sectionTitleClass}>Content and timeline</p>
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

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="flex items-center justify-between gap-3">
            <span className={labelClass}>Missing content owner</span>
            <span className={optionalLabelClass}>Optional</span>
          </span>
          <input
            value={missingContentOwner}
            onChange={(event) => setMissingContentOwner(event.target.value)}
            disabled={!canSubmit}
            className={inputClass}
            placeholder="Who is responsible for final copy, photos, bios, services, or proof?"
          />
        </label>

        <label className="block">
          <span className="flex items-center justify-between gap-3">
            <span className={labelClass}>Missing content due date</span>
            <span className={optionalLabelClass}>Optional</span>
          </span>
          <input
            type="date"
            value={missingContentDueDate}
            onChange={(event) => setMissingContentDueDate(event.target.value)}
            disabled={!canSubmit}
            className={inputClass}
          />
        </label>
      </div>

      {/* Communication rhythm */}
      <div className={sectionDividerClass}>
        <p className={sectionTitleClass}>Communication rhythm</p>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <label className="block">
          <span className="flex items-center justify-between gap-3">
            <span className={labelClass}>Update rhythm</span>
            <span className={requiredLabelClass}>Required</span>
          </span>
          <select
            value={updateCadence}
            onChange={(event) => setUpdateCadence(event.target.value)}
            aria-required="true"
            disabled={!canSubmit}
            className={`${inputClass} appearance-none`}
          >
            {updateCadenceOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="flex items-center justify-between gap-3">
            <span className={labelClass}>Main update channel</span>
            <span className={requiredLabelClass}>Required</span>
          </span>
          <select
            value={preferredUpdateChannel}
            onChange={(event) => setPreferredUpdateChannel(event.target.value)}
            aria-required="true"
            disabled={!canSubmit}
            className={`${inputClass} appearance-none`}
          >
            {communicationChannelOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="flex items-center justify-between gap-3">
            <span className={labelClass}>Urgent channel</span>
            <span className={requiredLabelClass}>Required</span>
          </span>
          <select
            value={urgentChannel}
            onChange={(event) => setUrgentChannel(event.target.value)}
            aria-required="true"
            disabled={!canSubmit}
            className={`${inputClass} appearance-none`}
          >
            {urgentChannelOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-5 block">
        <span className="flex items-center justify-between gap-3">
          <span className={labelClass}>Meeting availability</span>
          <span className={optionalLabelClass}>Optional</span>
        </span>
        <textarea
          value={meetingAvailability}
          onChange={(event) => setMeetingAvailability(event.target.value)}
          rows={3}
          disabled={!canSubmit}
          className={textareaClass}
          placeholder="Best days/times for kickoff, design reviews, technical access calls, or decision meetings."
        />
      </label>

      {/* Scope boundaries */}
      <div className={sectionDividerClass}>
        <p className={sectionTitleClass}>Scope boundaries</p>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="flex items-center justify-between gap-3">
            <span className={labelClass}>What is included</span>
            <span className={optionalLabelClass}>Optional</span>
          </span>
          <textarea
            value={scopeInclusions}
            onChange={(event) => setScopeInclusions(event.target.value)}
            rows={4}
            disabled={!canSubmit}
            className={textareaClass}
            placeholder="Pages, features, deliverables, integrations, launch tasks, or support items already agreed."
          />
        </label>

        <label className="block">
          <span className="flex items-center justify-between gap-3">
            <span className={labelClass}>What is not included</span>
            <span className={optionalLabelClass}>Optional</span>
          </span>
          <textarea
            value={scopeExclusions}
            onChange={(event) => setScopeExclusions(event.target.value)}
            rows={4}
            disabled={!canSubmit}
            className={textareaClass}
            placeholder="Anything that should be parked for Phase 2 or quoted separately."
          />
        </label>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="flex items-center justify-between gap-3">
            <span className={labelClass}>Included revision rounds</span>
            <span className={requiredLabelClass}>Required</span>
          </span>
          <select
            value={revisionRounds}
            onChange={(event) => setRevisionRounds(event.target.value)}
            aria-required="true"
            disabled={!canSubmit}
            className={`${inputClass} appearance-none`}
          >
            {revisionRoundOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="flex items-center justify-between gap-3">
            <span className={labelClass}>Who approves billable changes?</span>
            <span className={requiredLabelClass}>Required</span>
          </span>
          <input
            value={changeRequestAuthority}
            onChange={(event) => setChangeRequestAuthority(event.target.value)}
            aria-required="true"
            disabled={!canSubmit}
            className={inputClass}
            placeholder="Name or role allowed to approve extra cost/time."
          />
        </label>
      </div>

      <label className="mt-6 flex items-start gap-3 rounded-lg border border-[#FC6E20]/20 bg-[#FC6E20]/10 p-4 font-montserrat text-sm leading-6 text-stone-200">
        <input
          type="checkbox"
          checked={scopeBoundaryAccepted}
          onChange={(event) => setScopeBoundaryAccepted(event.target.checked)}
          disabled={!canSubmit}
          className="mt-1 h-4 w-4 accent-[#FC6E20] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FC6E20]"
        />
        <span>
          I understand that new pages, new features, major direction changes after approval, and extra revision
          rounds may need a change request before work continues.
        </span>
      </label>

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
        <div className="mt-5 space-y-4">
          <p className="flex items-start gap-3 rounded-lg border border-[#FC6E20]/25 bg-[#FC6E20]/10 p-4 font-montserrat text-sm leading-6 text-stone-100">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#FC6E20]" />
            {getMessage(result)}
          </p>
          {result.status === 'submitted' ? (
            <div className="rounded-lg border border-white/10 bg-black/20 p-5">
              <p className="font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-[#FC6E20]">
                What happens next
              </p>
              <ul className="mt-3 space-y-2 font-montserrat text-sm leading-6 text-stone-300">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FC6E20]" />
                  The studio reviews your answers against the project record.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FC6E20]" />
                  If anything needs clarification, we will reach out within one business day.
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FC6E20]" />
                  Once confirmed, the project plan and milestone timeline will be activated in your portal.
                </li>
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
