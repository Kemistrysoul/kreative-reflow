import 'server-only';
import { defaultPortalProjectSlug, getPortalSupabaseClient } from '@/lib/portal-supabase';
import type { StudioOnboardingResponse } from '@/lib/portal-onboarding-types';

type PortalOnboardingResponseRow = {
  id: string;
  response_status: 'draft' | 'submitted';
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  approval_role: string;
  audience_type: string;
  project_goals: string;
  primary_audience: string;
  services: string[] | null;
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
  existing_integrations: string[] | null;
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
  submitted_at: string | null;
  last_saved_at: string | null;
  portal_projects:
    | {
        slug: string;
        project_name: string;
        portal_clients:
          | {
              name: string;
            }
          | {
              name: string;
            }[]
          | null;
      }
    | {
        slug: string;
        project_name: string;
        portal_clients:
          | {
              name: string;
            }
          | {
              name: string;
            }[]
          | null;
      }[]
    | null;
};

const demoStudioOnboardingResponses: StudioOnboardingResponse[] = [
  {
    id: 'demo-abc-engineering-onboarding',
    projectSlug: defaultPortalProjectSlug,
    projectName: 'Website Redesign',
    clientName: 'ABC Engineering',
    status: 'submitted',
    contactName: 'Demo Approver',
    contactEmail: 'approver@abc-engineering.example',
    contactPhone: '+27 11 000 0000',
    approvalRole: 'Operations Manager',
    audienceType: 'B2B (Business to business)',
    projectGoals:
      'Clarify the service offer, make quote requests easier, and give the team one reliable place to track design, content, and launch handoff.',
    primaryAudience:
      'Procurement teams, plant managers, and safety-conscious buyers comparing engineering suppliers before requesting a quote.',
    services: ['New website / redesign', 'Custom client portal'],
    accessNeeds: 'Domain, analytics, and current hosting access still need owner confirmation.',
    brandAssetsStatus: 'Partly ready',
    technicalAccounts: 'Hosting is owned by the client. Analytics access needs to be invited before launch QA.',
    preferredDeadline: 'July 10, 2026',
    launchConstraints: 'Avoid end-of-month shutdown period and keep approvals with the operations lead.',
    contentNotes: 'Services copy exists but needs final technical review before build lock.',
    consentToTerms: true,
    currentWebsite: 'https://www.abc-engineering.co.za',
    budgetRange: 'R30,000 - R50,000',
    competitors: 'SteelFab SA, ProEng Solutions, and MetalWorks Industrial. Their sites are clean but lack quote request flows.',
    decisionProcess: 'Operations lead approves. CEO reviews final design before development starts.',
    specificFeatures: 'Quote request form with project type selection, document upload for RFQs, and certification display section.',
    socialPresence: 'LinkedIn company page with 200 followers. No Instagram or Facebook presence.',
    toneStylePreferences: 'Professional, industrial, and trustworthy. Not overly corporate.',
    previousAgencyExperience: 'Previous developer built the current site 5 years ago. Slow response times were the main complaint.',
    existingIntegrations: ['Analytics (Google Analytics, GTM, Hotjar)'],
    missingContentOwner: 'ABC Engineering marketing lead',
    missingContentDueDate: 'June 12, 2026',
    missingAccessOwner: 'ABC Engineering IT manager',
    missingAccessDueDate: 'June 7, 2026',
    updateCadence: 'Weekly',
    preferredUpdateChannel: 'Portal',
    urgentChannel: 'WhatsApp',
    meetingAvailability: 'Tuesdays or Thursdays after 10:00, with the operations lead and CEO for design sign-off.',
    scopeInclusions: 'Homepage, services overview, RFQ form, certifications section, launch handoff, and one client portal project record.',
    scopeExclusions: 'E-commerce, full CRM replacement, and ERP integration are Phase 2 unless approved as a change request.',
    revisionRounds: '2 included rounds',
    changeRequestAuthority: 'Operations lead can request changes; CEO approves billable scope changes.',
    scopeBoundaryAccepted: true,
    submittedAt: 'May 30, 2026, 10:45',
    lastSavedAt: 'May 30, 2026, 10:45',
    source: 'demo',
  },
];

function formatDate(value: string | null, fallback = 'Not set') {
  if (!value) return fallback;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return new Intl.DateTimeFormat('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function formatDateTime(value: string | null, fallback = 'Not saved') {
  if (!value) return fallback;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return new Intl.DateTimeFormat('en-ZA', {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function getProject(row: PortalOnboardingResponseRow) {
  if (Array.isArray(row.portal_projects)) {
    return row.portal_projects[0] ?? null;
  }

  return row.portal_projects;
}

function getClientName(row: PortalOnboardingResponseRow) {
  const project = getProject(row);

  if (Array.isArray(project?.portal_clients)) {
    return project.portal_clients[0]?.name || 'Unknown client';
  }

  return project?.portal_clients?.name || 'Unknown client';
}

function mapOnboardingResponse(row: PortalOnboardingResponseRow): StudioOnboardingResponse {
  const project = getProject(row);

  return {
    id: row.id,
    projectSlug: project?.slug || defaultPortalProjectSlug,
    projectName: project?.project_name || 'Unknown project',
    clientName: getClientName(row),
    status: row.response_status,
    contactName: row.contact_name,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    approvalRole: row.approval_role,
    audienceType: row.audience_type,
    projectGoals: row.project_goals,
    primaryAudience: row.primary_audience,
    services: row.services ?? [],
    accessNeeds: row.access_needs,
    brandAssetsStatus: row.brand_assets_status,
    technicalAccounts: row.technical_accounts,
    preferredDeadline: formatDate(row.preferred_deadline),
    launchConstraints: row.launch_constraints,
    contentNotes: row.content_notes,
    consentToTerms: row.consent_to_terms,
    currentWebsite: row.current_website,
    budgetRange: row.budget_range ?? '',
    competitors: row.competitors,
    decisionProcess: row.decision_process,
    specificFeatures: row.specific_features,
    socialPresence: row.social_presence,
    toneStylePreferences: row.tone_style_preferences,
    previousAgencyExperience: row.previous_agency_experience,
    existingIntegrations: row.existing_integrations ?? [],
    missingContentOwner: row.missing_content_owner,
    missingContentDueDate: formatDate(row.missing_content_due_date, 'Not set'),
    missingAccessOwner: row.missing_access_owner,
    missingAccessDueDate: formatDate(row.missing_access_due_date, 'Not set'),
    updateCadence: row.update_cadence,
    preferredUpdateChannel: row.preferred_update_channel,
    urgentChannel: row.urgent_channel,
    meetingAvailability: row.meeting_availability,
    scopeInclusions: row.scope_inclusions,
    scopeExclusions: row.scope_exclusions,
    revisionRounds: row.revision_rounds,
    changeRequestAuthority: row.change_request_authority,
    scopeBoundaryAccepted: row.scope_boundary_accepted,
    submittedAt: formatDateTime(row.submitted_at, 'Not submitted'),
    lastSavedAt: formatDateTime(row.last_saved_at),
    source: 'supabase',
  };
}

export async function getStudioOnboardingResponses(): Promise<StudioOnboardingResponse[]> {
  const supabase = getPortalSupabaseClient();

  if (!supabase) {
    return demoStudioOnboardingResponses;
  }

  const { data, error } = await supabase
    .from('portal_onboarding_responses')
    .select(
      [
        'id',
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
        'submitted_at',
        'last_saved_at',
        'portal_projects!inner(slug,project_name,portal_clients!inner(name))',
      ].join(','),
    )
    .order('last_saved_at', { ascending: false })
    .limit(8);

  if (error || !data) {
    return demoStudioOnboardingResponses;
  }

  return (data as unknown as PortalOnboardingResponseRow[]).map(mapOnboardingResponse);
}
