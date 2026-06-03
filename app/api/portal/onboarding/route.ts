import { NextRequest, NextResponse } from 'next/server';
import { getPortalAccess } from '@/lib/portal-access';
import { getPortalAuthState } from '@/lib/portal-auth';
import { recordPortalOperationalEvent } from '@/lib/portal-monitoring';
import { validatePortalOnboardingPayload } from '@/lib/portal-onboarding';
import { getPortalSupabaseClient } from '@/lib/portal-supabase';

export const runtime = 'nodejs';

function hasSameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (!origin) return true;

  return origin === new URL(request.url).origin;
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
        submitted_by_user_id: access.auth.userId,
        submitted_by_email: access.auth.email,
        approval_role: payload.approvalRole,
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
