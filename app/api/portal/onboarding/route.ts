import { NextRequest, NextResponse } from 'next/server';
import { getPortalAccess } from '@/lib/portal-access';
import { getPortalAuthState } from '@/lib/portal-auth';
import { recordPortalOperationalEvent } from '@/lib/portal-monitoring';
import { validatePortalOnboardingPayload } from '@/lib/portal-onboarding';
import { getPortalSupabaseClient } from '@/lib/portal-supabase';

export const runtime = 'nodejs';

type OnboardingResponseRow = {
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
};

function hasSameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (!origin) return true;

  return origin === new URL(request.url).origin;
}

export async function GET(request: NextRequest) {
  const authState = await getPortalAuthState();

  if (authState.status === 'missing-config') {
    return NextResponse.json({ error: 'Supabase Auth is not configured.' }, { status: 503 });
  }

  if (authState.status === 'unauthenticated') {
    return NextResponse.json({ error: 'Portal authentication is required.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const projectSlug = searchParams.get('projectSlug')?.trim() || undefined;
  const access = await getPortalAccess(projectSlug);

  if (access.status === 'missing-config') {
    return NextResponse.json({ error: 'Supabase Auth is not configured.' }, { status: 503 });
  }

  if (access.status === 'unauthenticated') {
    return NextResponse.json({ error: 'Portal authentication is required.' }, { status: 401 });
  }

  if (access.status !== 'authorized') {
    return NextResponse.json({ error: access.message }, { status: access.status === 'expired' ? 410 : 403 });
  }

  const supabase = getPortalSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ ok: true, mode: 'demo', response: null });
  }

  const { data, error } = await supabase
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
        'submitted_at',
        'last_saved_at',
      ].join(','),
    )
    .eq('project_id', access.projectId)
    .order('last_saved_at', { ascending: false })
    .limit(1)
    .maybeSingle<OnboardingResponseRow>();

  if (error) {
    await recordPortalOperationalEvent({
      actorEmail: access.auth.email,
      detail: error.message || 'Onboarding fetch failed.',
      eventType: 'project_data_error',
      metadata: { projectSlug: access.projectSlug },
      projectId: access.projectId,
      severity: 'warning',
      sourceRoute: '/api/portal/onboarding',
      title: 'Onboarding fetch could not be completed',
    });

    return NextResponse.json({ error: 'Onboarding could not be loaded.' }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ ok: true, mode: 'supabase', response: null });
  }

  return NextResponse.json({
    ok: true,
    mode: 'supabase',
    response: {
      status: data.response_status,
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
      lastSavedAt: data.last_saved_at ?? null,
      submittedAt: data.submitted_at ?? null,
    },
  });
}

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: 'Invalid onboarding origin.' }, { status: 403 });
  }

  const authState = await getPortalAuthState();

  if (authState.status === 'missing-config') {
    await recordPortalOperationalEvent({
      detail: 'Supabase Auth configuration is missing before onboarding can be saved securely.',
      eventType: 'auth_failure',
      severity: 'error',
      sourceRoute: '/api/portal/onboarding',
      title: 'Onboarding save blocked by missing auth config',
    });

    return NextResponse.json({ error: 'Supabase Auth is not configured.' }, { status: 503 });
  }

  if (authState.status === 'unauthenticated') {
    return NextResponse.json({ error: 'Portal authentication is required.' }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid onboarding payload.' }, { status: 400 });
  }

  const validation = validatePortalOnboardingPayload(body);

  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  if (validation.honeypotTriggered) {
    return NextResponse.json({
      ok: true,
      mode: 'filtered',
      status: validation.payload.status,
    });
  }

  const { payload } = validation;
  const access = await getPortalAccess(payload.projectSlug);

  if (access.status === 'missing-config') {
    await recordPortalOperationalEvent({
      detail: 'Portal access could not be checked because Supabase Auth is not configured.',
      eventType: 'auth_failure',
      metadata: { projectSlug: payload.projectSlug },
      severity: 'error',
      sourceRoute: '/api/portal/onboarding',
      title: 'Onboarding access check blocked by missing auth config',
    });

    return NextResponse.json({ error: 'Supabase Auth is not configured.' }, { status: 503 });
  }

  if (access.status === 'unauthenticated') {
    return NextResponse.json({ error: 'Portal authentication is required.' }, { status: 401 });
  }

  if (access.status !== 'authorized') {
    return NextResponse.json({ error: access.message }, { status: access.status === 'expired' ? 410 : 403 });
  }

  if (!access.canSubmitOnboarding) {
    return NextResponse.json({ error: 'Your portal role has read-only access for this project.' }, { status: 403 });
  }

  const supabase = getPortalSupabaseClient();

  if (!supabase) {
    await recordPortalOperationalEvent({
      actorEmail: access.auth.email,
      detail: 'Onboarding was accepted in demo mode because Supabase project data is not configured.',
      eventType: 'onboarding_failure',
      metadata: { projectSlug: payload.projectSlug, status: payload.status },
      projectId: access.projectId,
      severity: 'warning',
      sourceRoute: '/api/portal/onboarding',
      title: 'Onboarding persistence running in demo mode',
    });

    return NextResponse.json({
      ok: true,
      mode: 'demo',
      status: validation.payload.status,
    });
  }

  const savedAt = new Date().toISOString();
  const { error: responseError } = await supabase
    .from('portal_onboarding_responses')
    .upsert(
      {
        project_id: access.projectId,
        response_status: payload.status,
        contact_name: payload.contactName,
        contact_email: payload.contactEmail,
        contact_phone: payload.contactPhone,
        submitted_by_user_id: access.auth.userId,
        submitted_by_email: access.auth.email,
        approval_role: payload.approvalRole,
        audience_type: payload.audienceType,
        project_goals: payload.projectGoals,
        primary_audience: payload.primaryAudience,
        services: payload.services,
        access_needs: payload.accessNeeds,
        brand_assets_status: payload.brandAssetsStatus,
        technical_accounts: payload.technicalAccounts,
        preferred_deadline: payload.preferredDeadline || null,
        launch_constraints: payload.launchConstraints,
        content_notes: payload.contentNotes,
        consent_to_terms: payload.consentToTerms,
        current_website: payload.currentWebsite,
        budget_range: payload.budgetRange || null,
        competitors: payload.competitors,
        decision_process: payload.decisionProcess,
        specific_features: payload.specificFeatures,
        social_presence: payload.socialPresence,
        tone_style_preferences: payload.toneStylePreferences,
        previous_agency_experience: payload.previousAgencyExperience,
        existing_integrations: payload.existingIntegrations,
        missing_content_owner: payload.missingContentOwner,
        missing_content_due_date: payload.missingContentDueDate || null,
        missing_access_owner: payload.missingAccessOwner,
        missing_access_due_date: payload.missingAccessDueDate || null,
        update_cadence: payload.updateCadence,
        preferred_update_channel: payload.preferredUpdateChannel,
        urgent_channel: payload.urgentChannel,
        meeting_availability: payload.meetingAvailability,
        scope_inclusions: payload.scopeInclusions,
        scope_exclusions: payload.scopeExclusions,
        revision_rounds: payload.revisionRounds,
        change_request_authority: payload.changeRequestAuthority,
        scope_boundary_accepted: payload.scopeBoundaryAccepted,
        last_saved_at: savedAt,
        ...(payload.status === 'submitted' ? { submitted_at: savedAt } : {}),
      },
      { onConflict: 'project_id,contact_email' },
    );

  if (responseError) {
    await recordPortalOperationalEvent({
      actorEmail: access.auth.email,
      detail: responseError.message || 'Supabase rejected the onboarding upsert.',
      eventType: 'onboarding_failure',
      metadata: { projectSlug: payload.projectSlug, status: payload.status },
      projectId: access.projectId,
      severity: 'error',
      sourceRoute: '/api/portal/onboarding',
      title: 'Onboarding response could not be saved',
    });

    return NextResponse.json({ error: 'Onboarding could not be saved.' }, { status: 500 });
  }

  if (payload.status === 'submitted') {
    const { error: activityError } = await supabase.from('portal_project_activity').insert({
      project_id: access.projectId,
      occurred_at: savedAt,
      display_time: 'Just now',
      title: 'Onboarding questionnaire submitted',
      meta: `${payload.contactName} completed the project onboarding questionnaire`,
      sort_order: 0,
    });

    if (activityError) {
      await recordPortalOperationalEvent({
        actorEmail: access.auth.email,
        detail: activityError.message || 'Onboarding saved, but project activity could not be written.',
        eventType: 'project_data_error',
        metadata: { projectSlug: payload.projectSlug, status: payload.status },
        projectId: access.projectId,
        severity: 'warning',
        sourceRoute: '/api/portal/onboarding',
        title: 'Onboarding activity entry could not be written',
      });
    }
  }

  return NextResponse.json({
    ok: true,
    mode: 'supabase',
    status: payload.status,
  });
}
