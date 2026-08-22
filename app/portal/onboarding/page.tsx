import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ClipboardCheck, Clock3 } from 'lucide-react';
import { SiteFooter } from '@/components/SiteFooter';
import { PortalAccessState } from '@/components/portal/PortalAccessState';
import { PortalComplianceNotice } from '@/components/portal/PortalComplianceNotice';
import { PortalHeader, PortalPreviewNotice } from '@/components/portal/PortalChrome';
import { getPortalAccess } from '@/lib/portal-access';
import { requirePortalAuth } from '@/lib/portal-auth';
import { getAuthorizedPortalProjectData } from '@/lib/portal-projects';
import { getPortalSupabaseClient } from '@/lib/portal-supabase';
import { onboardingRequirementGroups } from '@/lib/portal-onboarding';
import { OnboardingForm } from './onboarding-form';

type OnboardingResponseRow = {
  response_status: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  approval_role: string;
  audience_type: string;
  project_goals: string;
  primary_audience: string;
  services: unknown;
  access_needs: string;
  brand_assets_status: string;
  technical_accounts: string;
  preferred_deadline: string | null;
  launch_constraints: string;
  content_notes: string;
  consent_to_terms: boolean;
  current_website: string;
  budget_range: string | null;
  competitors: string;
  decision_process: string;
  specific_features: string;
  social_presence: string;
  tone_style_preferences: string;
  previous_agency_experience: string;
  existing_integrations: unknown;
  missing_content_owner: string;
  missing_content_due_date: string | null;
  missing_access_owner: string;
  missing_access_due_date: string | null;
  update_cadence: string;
  preferred_update_channel: string;
  urgent_channel: string;
  meeting_availability: string;
  scope_inclusions: string;
  scope_exclusions: string;
  revision_rounds: string;
  change_request_authority: string;
  scope_boundary_accepted: boolean;
  last_saved_at: string | null;
};

export const metadata: Metadata = {
  title: 'Client Onboarding | Kreative Reflow',
  description: 'Client portal onboarding questionnaire for project kickoff details.',
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = 'force-dynamic';

export default async function PortalOnboardingPage() {
  await requirePortalAuth('/portal/onboarding');
  const access = await getPortalAccess();

  if (access.status !== 'authorized') {
    if (access.status === 'missing-config' || access.status === 'unauthenticated') {
      return null;
    }

    return (
      <>
        <main className="min-h-screen bg-[#111111] text-stone-100">
          <PortalHeader />
          <PortalAccessState state={access} />
        </main>
        <SiteFooter />
      </>
    );
  }

  const portalData = await getAuthorizedPortalProjectData(access.projectSlug);

  if (!portalData) {
    return (
      <>
        <main className="min-h-screen bg-[#111111] text-stone-100">
          <PortalHeader />
          <PortalAccessState
            state={{
              status: 'empty',
              auth: access.auth,
              message: 'Your portal membership is valid, but no onboarding project record is available yet.',
            }}
          />
        </main>
        <SiteFooter />
      </>
    );
  }

  const { project } = portalData;

  const supabase = getPortalSupabaseClient();
  let initialData: Record<string, unknown> | null = null;
  let lastSavedLabel: string | null = null;
  if (supabase) {
    const { data, error: fetchError } = await supabase
      .from('portal_onboarding_responses')
      .select(
        [
          'response_status',
          'contact_name',
          'contact_email',
          'contact_phone',
          'approval_role',
          'audience_type',
          'project_goals',
          'primary_audience',
          'services',
          'access_needs',
          'brand_assets_status',
          'technical_accounts',
          'preferred_deadline',
          'launch_constraints',
          'content_notes',
          'consent_to_terms',
          'current_website',
          'budget_range',
          'competitors',
          'decision_process',
          'specific_features',
          'social_presence',
          'tone_style_preferences',
          'previous_agency_experience',
          'existing_integrations',
          'missing_content_owner',
          'missing_content_due_date',
          'missing_access_owner',
          'missing_access_due_date',
          'update_cadence',
          'preferred_update_channel',
          'urgent_channel',
          'meeting_availability',
          'scope_inclusions',
          'scope_exclusions',
          'revision_rounds',
          'change_request_authority',
          'scope_boundary_accepted',
          'last_saved_at',
        ].join(','),
      )
      .eq('project_id', access.projectId)
      .order('last_saved_at', { ascending: false })
      .limit(1)
      .maybeSingle<OnboardingResponseRow>();

    if (data && !fetchError) {
      initialData = {
        status: data.response_status ?? '',
        contactName: data.contact_name ?? '',
        contactEmail: data.contact_email ?? '',
        contactPhone: data.contact_phone ?? '',
        approvalRole: data.approval_role ?? '',
        audienceType: data.audience_type ?? '',
        projectGoals: data.project_goals ?? '',
        primaryAudience: data.primary_audience ?? '',
        services: Array.isArray(data.services) ? data.services : [],
        accessNeeds: data.access_needs ?? '',
        brandAssetsStatus: data.brand_assets_status ?? '',
        technicalAccounts: data.technical_accounts ?? '',
        preferredDeadline: data.preferred_deadline ?? '',
        launchConstraints: data.launch_constraints ?? '',
        contentNotes: data.content_notes ?? '',
        consentToTerms: Boolean(data.consent_to_terms),
        currentWebsite: data.current_website ?? '',
        budgetRange: data.budget_range ?? '',
        competitors: data.competitors ?? '',
        decisionProcess: data.decision_process ?? '',
        specificFeatures: data.specific_features ?? '',
        socialPresence: data.social_presence ?? '',
        toneStylePreferences: data.tone_style_preferences ?? '',
        previousAgencyExperience: data.previous_agency_experience ?? '',
        existingIntegrations: Array.isArray(data.existing_integrations) ? data.existing_integrations : [],
        missingContentOwner: data.missing_content_owner ?? '',
        missingContentDueDate: data.missing_content_due_date ?? '',
        missingAccessOwner: data.missing_access_owner ?? '',
        missingAccessDueDate: data.missing_access_due_date ?? '',
        updateCadence: data.update_cadence ?? '',
        preferredUpdateChannel: data.preferred_update_channel ?? '',
        urgentChannel: data.urgent_channel ?? '',
        meetingAvailability: data.meeting_availability ?? '',
        scopeInclusions: data.scope_inclusions ?? '',
        scopeExclusions: data.scope_exclusions ?? '',
        revisionRounds: data.revision_rounds ?? '',
        changeRequestAuthority: data.change_request_authority ?? '',
        scopeBoundaryAccepted: Boolean(data.scope_boundary_accepted),
      };
      const rawSaved = data.last_saved_at;
      if (rawSaved) {
        try {
          lastSavedLabel = new Intl.DateTimeFormat('en-ZA', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          }).format(new Date(rawSaved));
        } catch {
          lastSavedLabel = rawSaved;
        }
      }
    }
  }

  return (
    <>
      <main className="min-h-screen bg-[#111111] text-stone-100">
        <PortalHeader />
        <PortalPreviewNotice />

        <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-lg border border-white/10 bg-[#181818] p-6">
              <Link
                href="/portal"
                className="inline-flex items-center gap-2 font-montserrat text-xs font-bold uppercase tracking-[0.16em] text-stone-500 transition-colors hover:text-[#FC6E20] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FC6E20]"
              >
                <ArrowLeft className="h-4 w-4" />
                Portal
              </Link>
              <p className="mt-8 font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#FC6E20]">
                {project.clientName}
              </p>
              <h1 className="mt-3 font-playfair text-4xl font-bold leading-tight text-white">
                {project.projectName}
              </h1>
              <p className="mt-4 font-montserrat text-sm leading-6 text-stone-400">
                This questionnaire captures the first project-specific client action
                before assets, approvals, and launch handoff are opened.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 font-montserrat text-[11px] uppercase tracking-[0.14em] text-stone-400">
                  ~8 min
                </span>
                <span className="rounded-full border border-[#FC6E20]/20 bg-[#FC6E20]/10 px-3 py-1.5 font-montserrat text-[11px] uppercase tracking-[0.14em] text-[#FC6E20]">
                  Save and continue
                </span>
                {initialData ? (
                  <span className="rounded-full border border-white/10 px-3 py-1.5 font-montserrat text-[11px] uppercase tracking-[0.14em] text-stone-500">
                    Resumed {lastSavedLabel ? `· ${lastSavedLabel}` : ''}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-[#181818] p-6">
              <div className="mb-5 flex items-center gap-3">
                <ClipboardCheck className="h-5 w-5 text-[#FC6E20]" />
                <h2 className="font-playfair text-2xl font-bold text-white">Kickoff checks</h2>
              </div>
              <div className="space-y-5">
                {onboardingRequirementGroups.map((group) => (
                  <div key={group.title} className="border-t border-white/10 pt-4">
                    <p className="font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
                      {group.title}
                    </p>
                    <ul className="mt-3 space-y-2 font-montserrat text-sm leading-6 text-stone-300">
                      {group.items.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#FC6E20]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <PortalComplianceNotice compact />

            <div className="rounded-lg border border-white/10 bg-black/20 p-5">
              <div className="flex items-center gap-3">
                <Clock3 className="h-5 w-5 text-[#FC6E20]" />
                <p className="font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
                  Status
                </p>
              </div>
              <p className="mt-3 font-montserrat text-sm leading-6 text-stone-400">
                Draft saves are supported. Final submission requires the required
                fields and privacy acknowledgement. Your answers are restored
                automatically if you leave and return.
              </p>
            </div>
          </aside>

          <OnboardingForm
            canSubmit={access.canSubmitOnboarding}
            projectSlug={project.slug}
            role={access.role}
            initialData={initialData}
          />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
