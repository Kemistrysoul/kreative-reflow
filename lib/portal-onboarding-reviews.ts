import 'server-only';
import { defaultPortalProjectSlug, getPortalSupabaseClient } from '@/lib/portal-supabase';
import type { StudioOnboardingResponse } from '@/lib/portal-onboarding-types';

type PortalOnboardingResponseRow = {
  id: string;
  response_status: 'draft' | 'submitted';
  contact_name: string;
  contact_email: string;
  approval_role: string;
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
    approvalRole: 'Operations lead',
    projectGoals:
      'Clarify the service offer, make quote requests easier, and give the team one reliable place to track design, content, and launch handoff.',
    primaryAudience:
      'Procurement teams, plant managers, and safety-conscious buyers comparing engineering suppliers before requesting a quote.',
    services: ['Website redesign', 'Custom client portal'],
    accessNeeds: 'Domain, analytics, and current hosting access still need owner confirmation.',
    brandAssetsStatus: 'Partly ready',
    technicalAccounts: 'Hosting is owned by the client. Analytics access needs to be invited before launch QA.',
    preferredDeadline: 'July 10, 2026',
    launchConstraints: 'Avoid end-of-month shutdown period and keep approvals with the operations lead.',
    contentNotes: 'Services copy exists but needs final technical review before build lock.',
    consentToTerms: true,
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
    approvalRole: row.approval_role,
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
        'approval_role',
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
