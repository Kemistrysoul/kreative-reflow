'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Clock3, Loader2, Save, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
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
  initialData?: Record<string, unknown> | null;
};

type SubmitMode = 'demo' | 'filtered' | 'supabase';
type ApiResult = {
  ok?: boolean;
  mode?: SubmitMode;
  status?: PortalOnboardingStatus;
  error?: string;
};

const STEPS = [
  { id: 'contact', label: 'Contact', title: 'Who can approve?', helper: 'Decision owner + contact' },
  { id: 'scope', label: 'Scope', title: 'What needs building?', helper: 'Goals, audience, services' },
  { id: 'context', label: 'Context', title: 'What shapes the build?', helper: 'Brand, tech, content' },
  { id: 'handoff', label: 'Handoff', title: 'How we work together?', helper: 'Timeline, comms, scope' },
] as const;

function isPlaceholder(value: string, placeholder: string) {
  return !value || value === placeholder;
}

function getMessage(result: ApiResult) {
  if (result.mode === 'demo') {
    return result.status === 'submitted'
      ? 'Onboarding checked in preview mode. Supabase not configured — no live write.'
      : 'Draft held in preview mode. Supabase not configured — no live write.';
  }
  if (result.mode === 'filtered') return 'Onboarding received.';
  return result.status === 'submitted'
    ? 'Onboarding submitted. The studio will review and activate your timeline within one business day.'
    : 'Draft saved. Resume anytime — we restored your last answers automatically.';
}

export function OnboardingForm({ canSubmit, projectSlug, role, initialData }: OnboardingFormProps) {
  // helpers to read initialData safely
  const iv = (key: string, fallback = '') => {
    const v = initialData?.[key];
    return typeof v === 'string' ? v : fallback;
  };
  const ivArr = (key: string): string[] => {
    const v = initialData?.[key];
    return Array.isArray(v) ? (v.filter((x) => typeof x === 'string') as string[]) : [];
  };
  const ivBool = (key: string, fallback = false) => {
    const v = initialData?.[key];
    return typeof v === 'boolean' ? v : fallback;
  };

  const [step, setStep] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const [hydrated, setHydrated] = useState(Boolean(initialData));
  const [localSavedAt, setLocalSavedAt] = useState<string | null>(null);

  const [contactName, setContactName] = useState(() => iv('contactName'));
  const [contactEmail, setContactEmail] = useState(() => iv('contactEmail'));
  const [contactPhone, setContactPhone] = useState(() => iv('contactPhone'));
  const [approvalRole, setApprovalRole] = useState(() => iv('approvalRole', approvalRoleOptions[0]));
  const [audienceType, setAudienceType] = useState(() => iv('audienceType', audienceTypeOptions[0]));
  const [currentWebsite, setCurrentWebsite] = useState(() => iv('currentWebsite'));
  const [projectGoals, setProjectGoals] = useState(() => iv('projectGoals'));
  const [primaryAudience, setPrimaryAudience] = useState(() => iv('primaryAudience'));
  const [services, setServices] = useState<string[]>(() => ivArr('services'));
  const [budgetRange, setBudgetRange] = useState(() => iv('budgetRange', budgetRangeOptions[0]));
  const [competitors, setCompetitors] = useState(() => iv('competitors'));
  const [decisionProcess, setDecisionProcess] = useState(() => iv('decisionProcess'));
  const [specificFeatures, setSpecificFeatures] = useState(() => iv('specificFeatures'));
  const [toneStylePreferences, setToneStylePreferences] = useState(() => iv('toneStylePreferences'));
  const [socialPresence, setSocialPresence] = useState(() => iv('socialPresence'));
  const [previousAgencyExperience, setPreviousAgencyExperience] = useState(() => iv('previousAgencyExperience'));
  const [existingIntegrations, setExistingIntegrations] = useState<string[]>(() => ivArr('existingIntegrations'));
  const [missingContentOwner, setMissingContentOwner] = useState(() => iv('missingContentOwner'));
  const [missingContentDueDate, setMissingContentDueDate] = useState(() => iv('missingContentDueDate'));
  const [missingAccessOwner, setMissingAccessOwner] = useState(() => iv('missingAccessOwner'));
  const [missingAccessDueDate, setMissingAccessDueDate] = useState(() => iv('missingAccessDueDate'));
  const [updateCadence, setUpdateCadence] = useState(() => iv('updateCadence', updateCadenceOptions[0]));
  const [preferredUpdateChannel, setPreferredUpdateChannel] = useState(() => iv('preferredUpdateChannel', communicationChannelOptions[0]));
  const [urgentChannel, setUrgentChannel] = useState(() => iv('urgentChannel', urgentChannelOptions[0]));
  const [meetingAvailability, setMeetingAvailability] = useState(() => iv('meetingAvailability'));
  const [scopeInclusions, setScopeInclusions] = useState(() => iv('scopeInclusions'));
  const [scopeExclusions, setScopeExclusions] = useState(() => iv('scopeExclusions'));
  const [revisionRounds, setRevisionRounds] = useState(() => iv('revisionRounds', revisionRoundOptions[0]));
  const [changeRequestAuthority, setChangeRequestAuthority] = useState(() => iv('changeRequestAuthority'));
  const [scopeBoundaryAccepted, setScopeBoundaryAccepted] = useState(() => ivBool('scopeBoundaryAccepted'));
  const [accessNeeds, setAccessNeeds] = useState(() => iv('accessNeeds'));
  const [brandAssetsStatus, setBrandAssetsStatus] = useState(() => iv('brandAssetsStatus', brandAssetOptions[0]));
  const [technicalAccounts, setTechnicalAccounts] = useState(() => iv('technicalAccounts'));
  const [preferredDeadline, setPreferredDeadline] = useState(() => iv('preferredDeadline'));
  const [launchConstraints, setLaunchConstraints] = useState(() => iv('launchConstraints'));
  const [contentNotes, setContentNotes] = useState(() => iv('contentNotes'));
  const [consentToTerms, setConsentToTerms] = useState(() => ivBool('consentToTerms'));
  const [website, setWebsite] = useState('');
  const [sendingStatus, setSendingStatus] = useState<PortalOnboardingStatus | null>(null);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showStepErrors, setShowStepErrors] = useState(false);

  const isSending = sendingStatus !== null;
  const storageKey = `kr-onboarding-${projectSlug}`;

  // hydrate from API if server had no data, plus localStorage fallback
  useEffect(() => {
    if (initialData) {
      setHydrated(true);
      return;
    }
    let cancelled = false;
    async function hydrate() {
      try {
        const res = await fetch(`/api/portal/onboarding?projectSlug=${encodeURIComponent(projectSlug)}`, { credentials: 'same-origin' });
        const payload = (await res.json()) as { ok?: boolean; response?: Record<string, unknown> | null };
        if (!cancelled && payload.ok && payload.response) {
          const r = payload.response;
          const s = (k: string) => (typeof r[k] === 'string' ? (r[k] as string) : '');
          const sa = (k: string) => (Array.isArray(r[k]) ? (r[k] as string[]) : []);
          const sb = (k: string) => Boolean(r[k]);
          setContactName(s('contactName'));
          setContactEmail(s('contactEmail'));
          setContactPhone(s('contactPhone'));
          if (s('approvalRole')) setApprovalRole(s('approvalRole'));
          if (s('audienceType')) setAudienceType(s('audienceType'));
          setCurrentWebsite(s('currentWebsite'));
          setProjectGoals(s('projectGoals'));
          setPrimaryAudience(s('primaryAudience'));
          if (sa('services').length) setServices(sa('services'));
          if (s('budgetRange')) setBudgetRange(s('budgetRange'));
          setCompetitors(s('competitors'));
          setDecisionProcess(s('decisionProcess'));
          setSpecificFeatures(s('specificFeatures'));
          setToneStylePreferences(s('toneStylePreferences'));
          setSocialPresence(s('socialPresence'));
          setPreviousAgencyExperience(s('previousAgencyExperience'));
          if (sa('existingIntegrations').length) setExistingIntegrations(sa('existingIntegrations'));
          setMissingContentOwner(s('missingContentOwner'));
          setMissingContentDueDate(s('missingContentDueDate'));
          setMissingAccessOwner(s('missingAccessOwner'));
          setMissingAccessDueDate(s('missingAccessDueDate'));
          if (s('updateCadence')) setUpdateCadence(s('updateCadence'));
          if (s('preferredUpdateChannel')) setPreferredUpdateChannel(s('preferredUpdateChannel'));
          if (s('urgentChannel')) setUrgentChannel(s('urgentChannel'));
          setMeetingAvailability(s('meetingAvailability'));
          setScopeInclusions(s('scopeInclusions'));
          setScopeExclusions(s('scopeExclusions'));
          if (s('revisionRounds')) setRevisionRounds(s('revisionRounds'));
          setChangeRequestAuthority(s('changeRequestAuthority'));
          setScopeBoundaryAccepted(sb('scopeBoundaryAccepted'));
          setAccessNeeds(s('accessNeeds'));
          if (s('brandAssetsStatus')) setBrandAssetsStatus(s('brandAssetsStatus'));
          setTechnicalAccounts(s('technicalAccounts'));
          setPreferredDeadline(s('preferredDeadline'));
          setLaunchConstraints(s('launchConstraints'));
          setContentNotes(s('contentNotes'));
          setConsentToTerms(sb('consentToTerms'));
          setHydrated(true);
          return;
        }
      } catch {}
      // fallback: localStorage
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw && !cancelled) {
          const ls = JSON.parse(raw);
          if (ls && typeof ls === 'object') {
            const s = (k: string) => (typeof ls[k] === 'string' ? ls[k] as string : '');
            if (s('contactName')) setContactName(s('contactName'));
            if (s('contactEmail')) setContactEmail(s('contactEmail'));
            if (s('contactPhone')) setContactPhone(s('contactPhone'));
            if (s('approvalRole')) setApprovalRole(s('approvalRole'));
            if (s('audienceType')) setAudienceType(s('audienceType'));
            if (s('currentWebsite')) setCurrentWebsite(s('currentWebsite'));
            if (s('projectGoals')) setProjectGoals(s('projectGoals'));
            if (s('primaryAudience')) setPrimaryAudience(s('primaryAudience'));
            if (Array.isArray(ls.services)) setServices(ls.services);
            if (s('budgetRange')) setBudgetRange(s('budgetRange'));
            if (s('competitors')) setCompetitors(s('competitors'));
            if (s('preferredDeadline')) setPreferredDeadline(s('preferredDeadline'));
            if (s('updateCadence')) setUpdateCadence(s('updateCadence'));
            if (s('preferredUpdateChannel')) setPreferredUpdateChannel(s('preferredUpdateChannel'));
            if (s('urgentChannel')) setUrgentChannel(s('urgentChannel'));
            if (s('revisionRounds')) setRevisionRounds(s('revisionRounds'));
            if (typeof ls.scopeBoundaryAccepted === 'boolean') setScopeBoundaryAccepted(ls.scopeBoundaryAccepted);
            if (typeof ls.consentToTerms === 'boolean') setConsentToTerms(ls.consentToTerms);
          }
        }
      } catch {}
      if (!cancelled) setHydrated(true);
    }
    void hydrate();
    return () => { cancelled = true; };
  }, [initialData, projectSlug, storageKey]);

  // autosave to localStorage every change (debounced 1s)
  useEffect(() => {
    if (!hydrated) return;
    const id = window.setTimeout(() => {
      try {
        const payload: Record<string, unknown> = {
          contactName, contactEmail, contactPhone, approvalRole, audienceType, currentWebsite, projectGoals, primaryAudience, services, budgetRange, competitors, decisionProcess, specificFeatures, toneStylePreferences, socialPresence, previousAgencyExperience, existingIntegrations, missingContentOwner, missingContentDueDate, missingAccessOwner, missingAccessDueDate, updateCadence, preferredUpdateChannel, urgentChannel, meetingAvailability, scopeInclusions, scopeExclusions, revisionRounds, changeRequestAuthority, scopeBoundaryAccepted, accessNeeds, brandAssetsStatus, technicalAccounts, preferredDeadline, launchConstraints, contentNotes, consentToTerms,
        };
        localStorage.setItem(storageKey, JSON.stringify(payload));
        setLocalSavedAt(new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }));
      } catch {}
    }, 800);
    return () => window.clearTimeout(id);
  }, [hydrated, storageKey, contactName, contactEmail, contactPhone, approvalRole, audienceType, currentWebsite, projectGoals, primaryAudience, services, budgetRange, competitors, decisionProcess, specificFeatures, toneStylePreferences, socialPresence, previousAgencyExperience, existingIntegrations, missingContentOwner, missingContentDueDate, missingAccessOwner, missingAccessDueDate, updateCadence, preferredUpdateChannel, urgentChannel, meetingAvailability, scopeInclusions, scopeExclusions, revisionRounds, changeRequestAuthority, scopeBoundaryAccepted, accessNeeds, brandAssetsStatus, technicalAccounts, preferredDeadline, launchConstraints, contentNotes, consentToTerms]);

  const requiredTotal = 17;
  const requiredDone = useMemo(() => {
    let c = 0;
    if (contactName.trim()) c++;
    if (contactPhone.trim()) c++;
    if (!isPlaceholder(approvalRole, approvalRoleOptions[0])) c++;
    if (!isPlaceholder(audienceType, audienceTypeOptions[0])) c++;
    if (projectGoals.trim()) c++;
    if (primaryAudience.trim()) c++;
    if (services.length) c++;
    if (currentWebsite.trim()) c++;
    if (!isPlaceholder(budgetRange, budgetRangeOptions[0])) c++;
    if (competitors.trim()) c++;
    if (preferredDeadline) c++;
    if (!isPlaceholder(updateCadence, updateCadenceOptions[0])) c++;
    if (!isPlaceholder(preferredUpdateChannel, communicationChannelOptions[0])) c++;
    if (!isPlaceholder(urgentChannel, urgentChannelOptions[0])) c++;
    if (!isPlaceholder(revisionRounds, revisionRoundOptions[0])) c++;
    if (changeRequestAuthority.trim()) c++;
    if (scopeBoundaryAccepted) c++;
    // consent is extra but counted separately
    return c;
  }, [contactName, contactPhone, approvalRole, audienceType, projectGoals, primaryAudience, services, currentWebsite, budgetRange, competitors, preferredDeadline, updateCadence, preferredUpdateChannel, urgentChannel, revisionRounds, changeRequestAuthority, scopeBoundaryAccepted]);

  const progressPct = Math.round((requiredDone / requiredTotal) * 100);
  const todayStr = new Date().toISOString().slice(0, 10);

  function fieldError(name: string): string | null {
    if (!showStepErrors && !touched[name]) return null;
    switch (name) {
      case 'contactName': return !contactName.trim() ? 'Add the approval contact name.' : null;
      case 'contactEmail': return !contactEmail.trim() ? 'Email is required.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail) ? 'Enter a valid email.' : null;
      case 'contactPhone': return !contactPhone.trim() ? 'Phone is required.' : null;
      case 'approvalRole': return isPlaceholder(approvalRole, approvalRoleOptions[0]) ? 'Choose a role.' : null;
      case 'currentWebsite': return !currentWebsite.trim() ? 'Add current website or write “No existing website”.' : null;
      case 'budgetRange': return isPlaceholder(budgetRange, budgetRangeOptions[0]) ? 'Choose a budget range.' : null;
      case 'preferredDeadline': return !preferredDeadline ? 'Pick a preferred deadline.' : null;
      case 'projectGoals': return !projectGoals.trim() ? 'Describe the project goals.' : null;
      case 'primaryAudience': return !primaryAudience.trim() ? 'Describe the primary audience.' : null;
      case 'audienceType': return isPlaceholder(audienceType, audienceTypeOptions[0]) ? 'Choose audience type.' : null;
      case 'services': return services.length === 0 ? 'Pick at least one service.' : null;
      case 'competitors': return !competitors.trim() ? 'Add 1–2 reference sites or competitors.' : null;
      case 'updateCadence': return isPlaceholder(updateCadence, updateCadenceOptions[0]) ? 'Choose update rhythm.' : null;
      case 'preferredUpdateChannel': return isPlaceholder(preferredUpdateChannel, communicationChannelOptions[0]) ? 'Choose main channel.' : null;
      case 'urgentChannel': return isPlaceholder(urgentChannel, urgentChannelOptions[0]) ? 'Choose urgent channel.' : null;
      case 'revisionRounds': return isPlaceholder(revisionRounds, revisionRoundOptions[0]) ? 'Choose included rounds.' : null;
      case 'changeRequestAuthority': return !changeRequestAuthority.trim() ? 'Who can approve billable changes?' : null;
      case 'scopeBoundaryAccepted': return !scopeBoundaryAccepted ? 'Acknowledge scope boundary before submitting.' : null;
      case 'consentToTerms': return !consentToTerms ? 'Acknowledge privacy + terms to submit.' : null;
      default: return null;
    }
  }

  function stepHasErrors(s: number): boolean {
    const checks: Record<number, string[]> = {
      0: ['contactName','contactEmail','contactPhone','approvalRole'],
      1: ['currentWebsite','budgetRange','preferredDeadline','projectGoals','primaryAudience','audienceType','services'],
      2: ['competitors'],
      3: ['updateCadence','preferredUpdateChannel','urgentChannel','revisionRounds','changeRequestAuthority','scopeBoundaryAccepted','consentToTerms'],
    };
    return (checks[s] ?? []).some((k) => fieldError(k));
  }

  function goNext() {
    setShowStepErrors(true);
    const checks: Record<number, string[]> = {
      0: ['contactName','contactEmail','contactPhone','approvalRole'],
      1: ['currentWebsite','budgetRange','preferredDeadline','projectGoals','primaryAudience','audienceType','services'],
      2: ['competitors'],
      3: ['updateCadence','preferredUpdateChannel','urgentChannel','revisionRounds','changeRequestAuthority','scopeBoundaryAccepted','consentToTerms'],
    };
    const needed = checks[step] ?? [];
    const hasErr = needed.some((k) => fieldError(k));
    // allow advancing even with errors for draft continuity, but block final submit — here only block if step 0-2 and hasErr and user hasn't yet saved draft? We warn but allow.
    // For UX, block next if required missing in step 0,1,3
    if (hasErr) {
      // mark touched for those fields so errors show
      const nextTouched: Record<string, boolean> = {};
      needed.forEach((k) => (nextTouched[k] = true));
      setTouched((prev) => ({ ...prev, ...nextTouched }));
      if (step !== 2) return; // step 2 only has one required, still allow? keep block for all except 2?
      return;
    }
    setShowStepErrors(false);
    setStep((s) => Math.min(3, s + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goBack() {
    setShowStepErrors(false);
    setStep((s) => Math.max(0, s - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleService(option: string) {
    setServices((current) => (current.includes(option) ? current.filter((i) => i !== option) : [...current, option]));
  }
  function toggleIntegration(option: string) {
    setExistingIntegrations((current) => (current.includes(option) ? current.filter((i) => i !== option) : [...current, option]));
  }

  async function submitOnboarding(status: PortalOnboardingStatus) {
    if (!canSubmit) { setError('Your portal role is read-only.'); return; }
    // final validation only for submitted
    if (status === 'submitted') {
      const allRequired = ['contactName','contactEmail','contactPhone','approvalRole','currentWebsite','budgetRange','preferredDeadline','projectGoals','primaryAudience','audienceType','services','competitors','updateCadence','preferredUpdateChannel','urgentChannel','revisionRounds','changeRequestAuthority','scopeBoundaryAccepted','consentToTerms'];
      const missing = allRequired.filter((k) => fieldError(k));
      if (missing.length) {
        setShowStepErrors(true);
        const nt: Record<string, boolean> = {};
        allRequired.forEach((k) => (nt[k] = true));
        setTouched((p) => ({ ...p, ...nt }));
        // jump to first step containing error
        if (['contactName','contactEmail','contactPhone','approvalRole'].some((k) => fieldError(k))) setStep(0);
        else if (['currentWebsite','budgetRange','preferredDeadline','projectGoals','primaryAudience','audienceType','services'].some((k) => fieldError(k))) setStep(1);
        else if (fieldError('competitors')) setStep(2);
        else setStep(3);
        setError('Complete the highlighted required fields before submitting.');
        return;
      }
    }
    setSendingStatus(status);
    setError('');
    setResult(null);
    try {
      const response = await fetch('/api/portal/onboarding', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectSlug, status, contactName, contactEmail, contactPhone, approvalRole, audienceType, currentWebsite, projectGoals, primaryAudience, services, budgetRange, competitors, decisionProcess, specificFeatures, toneStylePreferences, socialPresence, previousAgencyExperience, existingIntegrations, missingContentOwner, missingContentDueDate, missingAccessOwner, missingAccessDueDate, updateCadence, preferredUpdateChannel, urgentChannel, meetingAvailability, scopeInclusions, scopeExclusions, revisionRounds, changeRequestAuthority, scopeBoundaryAccepted, accessNeeds, brandAssetsStatus, technicalAccounts, preferredDeadline, launchConstraints, contentNotes, consentToTerms, website,
        }),
      });
      const payload = (await response.json()) as ApiResult;
      if (!response.ok || !payload.ok) throw new Error(payload.error || 'Could not save.');
      setResult(payload);
      try { localStorage.removeItem(storageKey); } catch {}
      if (payload.status === 'submitted') {
        // success - scroll to result
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save.');
    } finally {
      setSendingStatus(null);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitOnboarding('submitted');
  }

  const inputClass = 'mt-2 min-h-12 w-full rounded-xl border bg-black/20 px-4 font-montserrat text-sm text-stone-100 outline-none transition placeholder:text-stone-500 focus:ring-2 focus:ring-[#FC6E20]/20';
  const inputBase = 'border-white/10 focus:border-[#FC6E20]';
  const inputError = 'border-red-400/40 focus:border-red-400 focus:ring-red-400/20';
  const textareaClass = 'mt-2 w-full resize-none rounded-xl border bg-black/20 px-4 py-3 font-montserrat text-sm leading-6 text-stone-100 outline-none transition placeholder:text-stone-500 focus:ring-2 focus:ring-[#FC6E20]/20';
  const labelClass = 'font-montserrat text-[11px] font-bold uppercase tracking-[0.18em] text-stone-400';
  const errText = 'mt-2 font-montserrat text-xs leading-5 text-red-300';

  if (!hydrated) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#181818] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-3 font-montserrat text-sm text-stone-400"><Loader2 className="h-4 w-4 animate-spin" /> Restoring your last answers…</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <form ref={formRef} onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-[#181818] shadow-[0_24px_80px_rgba(0,0,0,0.2)]">
        <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

        {/* header + progress */}
        <div className="border-b border-white/10 p-5 md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#FC6E20]">Client onboarding</p>
              <h2 className="mt-2 font-playfair text-3xl font-bold leading-tight text-white md:text-4xl">Project questionnaire</h2>
              <p className="mt-3 max-w-2xl font-montserrat text-sm leading-6 text-stone-400">8 minutes · 4 steps · save &amp; continue anytime. Required fields are marked <span className="text-[#FC6E20]">•</span>.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-white/10 px-3 py-1.5 font-montserrat text-[11px] uppercase tracking-[0.14em] text-stone-400">Role: {role.replace('_',' ')}</span>
              {!canSubmit ? <span className="rounded-full border border-[#FC6E20]/30 bg-[#FC6E20]/10 px-3 py-1.5 font-montserrat text-[11px] uppercase tracking-[0.14em] text-[#FC6E20]">Read only</span> : null}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between font-montserrat text-xs">
              <span className="uppercase tracking-[0.16em] text-stone-500">{requiredDone}/{requiredTotal} required · {progressPct}%</span>
              <span className="text-stone-500 flex items-center gap-2"><Clock3 className="h-3.5 w-3.5" /> ~8 min {localSavedAt ? `· saved ${localSavedAt}` : ''}</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-[#FC6E20] transition-all duration-500" style={{ width: `${Math.max(6, progressPct)}%` }} />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {STEPS.map((s, i) => (
                <button key={s.id} type="button" onClick={() => setStep(i)} className={`rounded-xl border px-3 py-3 text-left transition ${i === step ? 'border-[#FC6E20]/40 bg-[#FC6E20]/10' : i < step ? 'border-white/10 bg-white/[0.04] hover:border-white/20' : 'border-white/10 bg-black/20 hover:border-white/20'}`}>
                  <p className={`font-montserrat text-[11px] font-bold uppercase tracking-[0.16em] ${i === step ? 'text-[#FC6E20]' : 'text-stone-500'}`}>Step {i+1} · {s.label} {i < step && !stepHasErrors(i) ? '✓' : ''}</p>
                  <p className={`mt-1 font-montserrat text-xs font-semibold leading-4 ${i === step ? 'text-white' : 'text-stone-300'}`}>{s.title}</p>
                  <p className="mt-1 hidden font-montserrat text-[11px] leading-4 text-stone-500 md:block">{s.helper}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 md:p-7">
          {step === 0 ? (
            <div className="space-y-6">
              <div>
                <p className="font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-[#FC6E20]">Step 1 — Contact &amp; authority</p>
                <h3 className="mt-2 font-playfair text-2xl font-bold text-white">Who can approve decisions?</h3>
                <p className="mt-2 font-montserrat text-sm leading-6 text-stone-400">We need one clear owner so approvals don’t stall mid-sprint.</p>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Approval contact <span className="text-[#FC6E20]">•</span></span>
                  <input value={contactName} onChange={(e) => setContactName(e.target.value)} onBlur={() => setTouched((p) => ({ ...p, contactName: true }))} autoComplete="name" disabled={!canSubmit} className={`${inputClass} ${fieldError('contactName') ? inputError : inputBase}`} placeholder="Name and surname" />
                  {fieldError('contactName') ? <p className={errText}>{fieldError('contactName')}</p> : null}
                </label>
                <label className="block">
                  <span className={labelClass}>Email <span className="text-[#FC6E20]">•</span></span>
                  <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} onBlur={() => setTouched((p) => ({ ...p, contactEmail: true }))} autoComplete="email" disabled={!canSubmit} className={`${inputClass} ${fieldError('contactEmail') ? inputError : inputBase}`} placeholder="approver@example.com" />
                  {fieldError('contactEmail') ? <p className={errText}>{fieldError('contactEmail')}</p> : null}
                </label>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Phone <span className="text-[#FC6E20]">•</span></span>
                  <input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} onBlur={() => setTouched((p) => ({ ...p, contactPhone: true }))} autoComplete="tel" disabled={!canSubmit} className={`${inputClass} ${fieldError('contactPhone') ? inputError : inputBase}`} placeholder="+27..." />
                  {fieldError('contactPhone') ? <p className={errText}>{fieldError('contactPhone')}</p> : null}
                </label>
                <label className="block">
                  <span className={labelClass}>Approval role <span className="text-[#FC6E20]">•</span></span>
                  <select value={approvalRole} onChange={(e) => setApprovalRole(e.target.value)} onBlur={() => setTouched((p) => ({ ...p, approvalRole: true }))} disabled={!canSubmit} className={`${inputClass} appearance-none ${fieldError('approvalRole') ? inputError : inputBase}`}>
                    {approvalRoleOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                  {fieldError('approvalRole') ? <p className={errText}>{fieldError('approvalRole')}</p> : null}
                </label>
              </div>
              <label className="block">
                <span className={labelClass}>Decision-making process <span className="text-stone-500 text-[10px]">Optional</span></span>
                <input value={decisionProcess} onChange={(e) => setDecisionProcess(e.target.value)} disabled={!canSubmit} className={`${inputClass} ${inputBase}`} placeholder="Who else needs to approve? Board, CEO, marketing committee?" />
              </label>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <p className="font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-[#FC6E20]">Step 2 — Project scope</p>
                <h3 className="mt-2 font-playfair text-2xl font-bold text-white">What should this project do?</h3>
                <p className="mt-2 font-montserrat text-sm leading-6 text-stone-400">Clear goals and services help us quote accurately and avoid mid-project drift.</p>
              </div>
              <label className="block">
                <span className={labelClass}>Current website URL <span className="text-[#FC6E20]">•</span></span>
                <input value={currentWebsite} onChange={(e) => setCurrentWebsite(e.target.value)} onBlur={() => setTouched((p) => ({ ...p, currentWebsite: true }))} disabled={!canSubmit} className={`${inputClass} ${fieldError('currentWebsite') ? inputError : inputBase}`} placeholder="https://www.example.co.za — or write 'No existing website'" />
                {fieldError('currentWebsite') ? <p className={errText}>{fieldError('currentWebsite')}</p> : null}
              </label>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Budget range <span className="text-[#FC6E20]">•</span></span>
                  <select value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)} onBlur={() => setTouched((p) => ({ ...p, budgetRange: true }))} disabled={!canSubmit} className={`${inputClass} appearance-none ${fieldError('budgetRange') ? inputError : inputBase}`}>
                    {budgetRangeOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                  {fieldError('budgetRange') ? <p className={errText}>{fieldError('budgetRange')}</p> : null}
                </label>
                <label className="block">
                  <span className={labelClass}>Preferred deadline <span className="text-[#FC6E20]">•</span></span>
                  <input type="date" value={preferredDeadline} min={todayStr} onChange={(e) => setPreferredDeadline(e.target.value)} onBlur={() => setTouched((p) => ({ ...p, preferredDeadline: true }))} disabled={!canSubmit} className={`${inputClass} ${fieldError('preferredDeadline') ? inputError : inputBase}`} />
                  <p className="mt-2 font-montserrat text-xs leading-5 text-stone-500">Typical 6–10 weeks. Helps us plan, not a hard promise.</p>
                  {fieldError('preferredDeadline') ? <p className={errText}>{fieldError('preferredDeadline')}</p> : null}
                </label>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Project goals <span className="text-[#FC6E20]">•</span></span>
                  <textarea value={projectGoals} onChange={(e) => setProjectGoals(e.target.value)} onBlur={() => setTouched((p) => ({ ...p, projectGoals: true }))} rows={5} disabled={!canSubmit} className={`${textareaClass} ${fieldError('projectGoals') ? inputError : inputBase}`} placeholder="What should this project make clearer, faster, safer, or easier?" />
                  {fieldError('projectGoals') ? <p className={errText}>{fieldError('projectGoals')}</p> : null}
                </label>
                <div className="block">
                  <span className={labelClass}>Primary audience <span className="text-[#FC6E20]">•</span></span>
                  <fieldset className="mt-2">
                    <legend className="sr-only">Audience type</legend>
                    <div className="flex flex-wrap gap-2">
                      {audienceTypeOptions.map((option) => (
                        <label key={option} className={`flex min-h-10 items-center gap-2 rounded-xl border px-3 font-montserrat text-sm transition ${audienceType === option ? 'border-[#FC6E20]/40 bg-[#FC6E20]/10 text-white' : 'border-white/10 bg-black/20 text-stone-300'}`}>
                          <input type="radio" name="audienceType" value={option} checked={audienceType === option} onChange={(e) => setAudienceType(e.target.value)} disabled={!canSubmit} className="h-4 w-4 accent-[#FC6E20]" />{option}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  {fieldError('audienceType') ? <p className={errText}>{fieldError('audienceType')}</p> : null}
                  <textarea value={primaryAudience} onChange={(e) => setPrimaryAudience(e.target.value)} onBlur={() => setTouched((p) => ({ ...p, primaryAudience: true }))} rows={4} disabled={!canSubmit} className={`${textareaClass} mt-3 ${fieldError('primaryAudience') ? inputError : inputBase}`} placeholder="Who needs to trust, buy from, or approve this?" />
                  {fieldError('primaryAudience') ? <p className={errText}>{fieldError('primaryAudience')}</p> : null}
                </div>
              </div>
              <fieldset>
                <div className="flex items-center justify-between gap-3">
                  <legend className={labelClass}>Services needed <span className="text-[#FC6E20]">•</span></legend>
                  <span className="font-montserrat text-xs text-stone-500">{services.length} selected</span>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {onboardingServiceOptions.map((option) => (
                    <label key={option} className={`flex min-h-12 items-center gap-3 rounded-xl border px-4 font-montserrat text-sm ${services.includes(option) ? 'border-[#FC6E20]/30 bg-[#FC6E20]/10 text-white' : 'border-white/10 bg-black/20 text-stone-300'}`}>
                      <input type="checkbox" checked={services.includes(option)} onChange={() => toggleService(option)} disabled={!canSubmit} className="h-4 w-4 accent-[#FC6E20]" />{option}
                    </label>
                  ))}
                </div>
                {fieldError('services') ? <p className={errText}>{fieldError('services')}</p> : null}
              </fieldset>
              <label className="block">
                <span className={labelClass}>Must-have features <span className="text-stone-500 text-[10px]">Optional</span></span>
                <textarea value={specificFeatures} onChange={(e) => setSpecificFeatures(e.target.value)} rows={3} disabled={!canSubmit} className={`${textareaClass} ${inputBase}`} placeholder="Booking with SMS, client login, document upload, calculator, multi-language..." />
              </label>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-6">
              <div>
                <p className="font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-[#FC6E20]">Step 3 — Context &amp; access</p>
                <h3 className="mt-2 font-playfair text-2xl font-bold text-white">What shapes the build?</h3>
                <p className="mt-2 font-montserrat text-sm leading-6 text-stone-400">Context prevents rework. Access unlocks build without password sharing.</p>
              </div>
              <label className="block">
                <span className={labelClass}>Competitors / reference sites <span className="text-[#FC6E20]">•</span></span>
                <textarea value={competitors} onChange={(e) => setCompetitors(e.target.value)} onBlur={() => setTouched((p) => ({ ...p, competitors: true }))} rows={3} disabled={!canSubmit} className={`${textareaClass} ${fieldError('competitors') ? inputError : inputBase}`} placeholder="List 2–3 sites you like or compete with. What do you like/dislike?" />
                {fieldError('competitors') ? <p className={errText}>{fieldError('competitors')}</p> : null}
              </label>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Tone &amp; style <span className="text-stone-500 text-[10px]">Optional</span></span>
                  <input value={toneStylePreferences} onChange={(e) => setToneStylePreferences(e.target.value)} disabled={!canSubmit} className={`${inputClass} ${inputBase}`} placeholder="Premium minimal, bold, corporate, warm..." />
                </label>
                <label className="block">
                  <span className={labelClass}>Previous agency experience <span className="text-stone-500 text-[10px]">Optional</span></span>
                  <input value={previousAgencyExperience} onChange={(e) => setPreviousAgencyExperience(e.target.value)} disabled={!canSubmit} className={`${inputClass} ${inputBase}`} placeholder="What worked? What would you change?" />
                </label>
              </div>
              <fieldset>
                <legend className={labelClass}>Existing tools <span className="text-stone-500 text-[10px]">Optional</span></legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {integrationOptions.map((option) => (
                    <label key={option} className={`flex min-h-12 items-center gap-3 rounded-xl border px-4 font-montserrat text-sm ${existingIntegrations.includes(option) ? 'border-[#FC6E20]/30 bg-[#FC6E20]/10 text-white' : 'border-white/10 bg-black/20 text-stone-300'}`}>
                      <input type="checkbox" checked={existingIntegrations.includes(option)} onChange={() => toggleIntegration(option)} disabled={!canSubmit} className="h-4 w-4 accent-[#FC6E20]" />{option}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Access needs <span className="text-stone-500 text-[10px]">Optional</span></span>
                  <textarea value={accessNeeds} onChange={(e) => setAccessNeeds(e.target.value)} rows={4} disabled={!canSubmit} className={`${textareaClass} ${inputBase}`} placeholder="Domains, hosting, CMS, analytics, payment tools." />
                </label>
                <label className="block">
                  <span className={labelClass}>Technical accounts <span className="text-stone-500 text-[10px]">Optional</span></span>
                  <textarea value={technicalAccounts} onChange={(e) => setTechnicalAccounts(e.target.value)} rows={4} disabled={!canSubmit} className={`${textareaClass} ${inputBase}`} placeholder="Who owns each login? Any invites needed?" />
                  <p className="mt-2 font-montserrat text-xs leading-5 text-amber-200/70">Never paste passwords here. We’ll invite accounts securely.</p>
                </label>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Missing access owner <span className="text-stone-500 text-[10px]">Optional</span></span>
                  <input value={missingAccessOwner} onChange={(e) => setMissingAccessOwner(e.target.value)} disabled={!canSubmit} className={`${inputClass} ${inputBase}`} placeholder="Who can provide DNS/hosting/CRM access?" />
                </label>
                <label className="block">
                  <span className={labelClass}>Missing access due <span className="text-stone-500 text-[10px]">Optional</span></span>
                  <input type="date" value={missingAccessDueDate} min={todayStr} onChange={(e) => setMissingAccessDueDate(e.target.value)} disabled={!canSubmit} className={`${inputClass} ${inputBase}`} />
                </label>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Brand assets <span className="text-stone-500 text-[10px]">Optional</span></span>
                  <select value={brandAssetsStatus} onChange={(e) => setBrandAssetsStatus(e.target.value)} disabled={!canSubmit} className={`${inputClass} appearance-none ${inputBase}`}>
                    {brandAssetOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className={labelClass}>Social &amp; online presence <span className="text-stone-500 text-[10px]">Optional</span></span>
                  <input value={socialPresence} onChange={(e) => setSocialPresence(e.target.value)} disabled={!canSubmit} className={`${inputClass} ${inputBase}`} placeholder="Instagram, LinkedIn, GBP, Facebook..." />
                </label>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Deadline constraints <span className="text-stone-500 text-[10px]">Optional</span></span>
                  <textarea value={launchConstraints} onChange={(e) => setLaunchConstraints(e.target.value)} rows={3} disabled={!canSubmit} className={`${textareaClass} ${inputBase}`} placeholder="Events, campaigns, shutdown periods..." />
                </label>
                <label className="block">
                  <span className={labelClass}>Content notes <span className="text-stone-500 text-[10px]">Optional</span></span>
                  <textarea value={contentNotes} onChange={(e) => setContentNotes(e.target.value)} rows={3} disabled={!canSubmit} className={`${textareaClass} ${inputBase}`} placeholder="Pages, FAQs, bios, proof, gaps..." />
                </label>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Missing content owner <span className="text-stone-500 text-[10px]">Optional</span></span>
                  <input value={missingContentOwner} onChange={(e) => setMissingContentOwner(e.target.value)} disabled={!canSubmit} className={`${inputClass} ${inputBase}`} placeholder="Who owns final copy/photos/proof?" />
                </label>
                <label className="block">
                  <span className={labelClass}>Missing content due <span className="text-stone-500 text-[10px]">Optional</span></span>
                  <input type="date" value={missingContentDueDate} min={todayStr} onChange={(e) => setMissingContentDueDate(e.target.value)} disabled={!canSubmit} className={`${inputClass} ${inputBase}`} />
                </label>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-6">
              <div>
                <p className="font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-[#FC6E20]">Step 4 — Timeline, comms &amp; scope</p>
                <h3 className="mt-2 font-playfair text-2xl font-bold text-white">How we stay aligned</h3>
                <p className="mt-2 font-montserrat text-sm leading-6 text-stone-400">Set rhythm and boundaries now — prevents overruns later.</p>
              </div>
              <div className="grid gap-5 md:grid-cols-3">
                <label className="block">
                  <span className={labelClass}>Update rhythm <span className="text-[#FC6E20]">•</span></span>
                  <select value={updateCadence} onChange={(e) => setUpdateCadence(e.target.value)} onBlur={() => setTouched((p) => ({ ...p, updateCadence: true }))} disabled={!canSubmit} className={`${inputClass} appearance-none ${fieldError('updateCadence') ? inputError : inputBase}`}>
                    {updateCadenceOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                  {fieldError('updateCadence') ? <p className={errText}>{fieldError('updateCadence')}</p> : null}
                </label>
                <label className="block">
                  <span className={labelClass}>Main channel <span className="text-[#FC6E20]">•</span></span>
                  <select value={preferredUpdateChannel} onChange={(e) => setPreferredUpdateChannel(e.target.value)} onBlur={() => setTouched((p) => ({ ...p, preferredUpdateChannel: true }))} disabled={!canSubmit} className={`${inputClass} appearance-none ${fieldError('preferredUpdateChannel') ? inputError : inputBase}`}>
                    {communicationChannelOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                  {fieldError('preferredUpdateChannel') ? <p className={errText}>{fieldError('preferredUpdateChannel')}</p> : null}
                </label>
                <label className="block">
                  <span className={labelClass}>Urgent channel <span className="text-[#FC6E20]">•</span></span>
                  <select value={urgentChannel} onChange={(e) => setUrgentChannel(e.target.value)} onBlur={() => setTouched((p) => ({ ...p, urgentChannel: true }))} disabled={!canSubmit} className={`${inputClass} appearance-none ${fieldError('urgentChannel') ? inputError : inputBase}`}>
                    {urgentChannelOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                  {fieldError('urgentChannel') ? <p className={errText}>{fieldError('urgentChannel')}</p> : null}
                </label>
              </div>
              <label className="block">
                <span className={labelClass}>Meeting availability <span className="text-stone-500 text-[10px]">Optional</span></span>
                <textarea value={meetingAvailability} onChange={(e) => setMeetingAvailability(e.target.value)} rows={2} disabled={!canSubmit} className={`${textareaClass} ${inputBase}`} placeholder="Best days/times for kickoff, reviews, decision meetings..." />
              </label>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>What is included <span className="text-stone-500 text-[10px]">Optional</span></span>
                  <textarea value={scopeInclusions} onChange={(e) => setScopeInclusions(e.target.value)} rows={3} disabled={!canSubmit} className={`${textareaClass} ${inputBase}`} placeholder="Pages, features, integrations, launch tasks already agreed..." />
                </label>
                <label className="block">
                  <span className={labelClass}>What is not included <span className="text-stone-500 text-[10px]">Optional</span></span>
                  <textarea value={scopeExclusions} onChange={(e) => setScopeExclusions(e.target.value)} rows={3} disabled={!canSubmit} className={`${textareaClass} ${inputBase}`} placeholder="Phase 2 or separately quoted items..." />
                </label>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className={labelClass}>Included revision rounds <span className="text-[#FC6E20]">•</span></span>
                  <select value={revisionRounds} onChange={(e) => setRevisionRounds(e.target.value)} onBlur={() => setTouched((p) => ({ ...p, revisionRounds: true }))} disabled={!canSubmit} className={`${inputClass} appearance-none ${fieldError('revisionRounds') ? inputError : inputBase}`}>
                    {revisionRoundOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                  {fieldError('revisionRounds') ? <p className={errText}>{fieldError('revisionRounds')}</p> : null}
                </label>
                <label className="block">
                  <span className={labelClass}>Who approves billable changes? <span className="text-[#FC6E20]">•</span></span>
                  <input value={changeRequestAuthority} onChange={(e) => setChangeRequestAuthority(e.target.value)} onBlur={() => setTouched((p) => ({ ...p, changeRequestAuthority: true }))} disabled={!canSubmit} className={`${inputClass} ${fieldError('changeRequestAuthority') ? inputError : inputBase}`} placeholder="Name or role allowed to approve extra cost/time" />
                  {fieldError('changeRequestAuthority') ? <p className={errText}>{fieldError('changeRequestAuthority')}</p> : null}
                </label>
              </div>
              <label className={`flex items-start gap-3 rounded-xl border p-4 font-montserrat text-sm leading-6 ${fieldError('scopeBoundaryAccepted') ? 'border-red-400/30 bg-red-400/10 text-red-100' : 'border-[#FC6E20]/20 bg-[#FC6E20]/10 text-stone-200'}`}>
                <input type="checkbox" checked={scopeBoundaryAccepted} onChange={(e) => setScopeBoundaryAccepted(e.target.checked)} onBlur={() => setTouched((p) => ({ ...p, scopeBoundaryAccepted: true }))} disabled={!canSubmit} className="mt-1 h-4 w-4 accent-[#FC6E20]" />
                <span>I understand new pages, features, major direction changes after approval, and extra revision rounds may need a change request before work continues. <span className="text-[#FC6E20]">•</span></span>
              </label>
              {fieldError('scopeBoundaryAccepted') ? <p className={errText}>{fieldError('scopeBoundaryAccepted')}</p> : null}
              <label className={`flex items-start gap-3 rounded-xl border p-4 font-montserrat text-sm leading-6 ${fieldError('consentToTerms') ? 'border-red-400/30 bg-red-400/10 text-red-100' : 'border-white/10 bg-black/20 text-stone-300'}`}>
                <input type="checkbox" checked={consentToTerms} onChange={(e) => setConsentToTerms(e.target.checked)} onBlur={() => setTouched((p) => ({ ...p, consentToTerms: true }))} disabled={!canSubmit} className="mt-1 h-4 w-4 accent-[#FC6E20]" />
                <span>I understand these answers are used to plan this project. I have read the <Link href="/privacy" className="text-[#FC6E20] underline">privacy policy</Link> and <Link href="/terms" className="text-[#FC6E20] underline">terms</Link>. <span className="text-[#FC6E20]">•</span></span>
              </label>
              {fieldError('consentToTerms') ? <p className={errText}>{fieldError('consentToTerms')}</p> : null}
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="flex items-center gap-2 font-montserrat text-xs font-bold uppercase tracking-[0.16em] text-stone-400"><ShieldCheck className="h-4 w-4 text-[#FC6E20]" /> Before you submit</p>
                <ul className="mt-3 space-y-2 font-montserrat text-sm leading-6 text-stone-300">
                  <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FC6E20]" /> You can save as draft and return — nothing is lost.</li>
                  <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FC6E20]" /> Submitting notifies the studio to review and lock the timeline.</li>
                  <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FC6E20]" /> Progress {requiredDone}/{requiredTotal} required complete.</li>
                </ul>
              </div>
            </div>
          ) : null}
        </div>

        {/* sticky action bar */}
        <div className="sticky bottom-0 z-10 border-t border-white/10 bg-[#181818]/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-[#181818]/80 md:p-5">
          {error ? <p className="mb-4 flex items-start gap-3 rounded-xl border border-red-400/25 bg-red-400/10 p-3 font-montserrat text-sm leading-6 text-red-100"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</p> : null}
          {result ? (
            <div className="mb-4 space-y-3">
              <p className="flex items-start gap-3 rounded-xl border border-[#FC6E20]/25 bg-[#FC6E20]/10 p-3 font-montserrat text-sm leading-6 text-stone-100"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#FC6E20]" />{getMessage(result)}</p>
              {result.status === 'submitted' ? (
                <div className="flex flex-wrap gap-2">
                  <Link href="/portal" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-stone-900">Back to portal <ArrowRight className="h-4 w-4" /></Link>
                  <Link href="/portal?section=files" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 px-5 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-white">Upload assets</Link>
                </div>
              ) : null}
            </div>
          ) : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              {step > 0 ? (
                <button type="button" onClick={goBack} disabled={isSending} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 px-5 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-white hover:border-[#FC6E20] disabled:opacity-50"><ArrowLeft className="h-4 w-4" /> Back</button>
              ) : <span className="hidden sm:inline-flex font-montserrat text-xs text-stone-500">Step {step + 1} of 4</span>}
              <span className="font-montserrat text-xs text-stone-500 sm:hidden">Step {step + 1} / 4</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" disabled={isSending || !canSubmit} onClick={() => void submitOnboarding('draft')} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 px-5 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-white hover:border-[#FC6E20] disabled:opacity-50">
                {sendingStatus === 'draft' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save draft
              </button>
              {step < 3 ? (
                <button type="button" onClick={goNext} disabled={isSending || !canSubmit} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-stone-900 hover:bg-stone-100 disabled:opacity-50">Continue <ArrowRight className="h-4 w-4" /></button>
              ) : (
                <button type="submit" disabled={isSending || !canSubmit} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#FC6E20] px-6 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-stone-950 hover:bg-[#e05a15] disabled:opacity-50">
                  {sendingStatus === 'submitted' ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}Submit onboarding
                </button>
              )}
            </div>
          </div>
        </div>
      </form>

      <div className="rounded-2xl border border-white/10 bg-[#181818] p-5">
        <p className="font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-stone-500">What happens after submit?</p>
        <ul className="mt-3 space-y-2 font-montserrat text-sm leading-6 text-stone-400">
          <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FC6E20]" /> Studio reviews against project record within one business day.</li>
          <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FC6E20]" /> If clarification needed, we reach out via your chosen channel.</li>
          <li className="flex gap-2"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FC6E20]" /> Once confirmed, milestones and file requests activate in your portal.</li>
        </ul>
      </div>
    </div>
  );
}
