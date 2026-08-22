import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { getStudioAccess } from '@/lib/portal-access';
import { getPortalAuthConfig } from '@/lib/portal-auth-config';
import { recordPortalOperationalEvent } from '@/lib/portal-monitoring';
import { getPortalSupabaseClient } from '@/lib/portal-supabase';

export const runtime = 'nodejs';

const allowedRoles = new Set(['studio_admin', 'client_owner', 'client_collaborator', 'viewer']);

function hasSameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  return origin === new URL(request.url).origin;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: 'Invalid portal members origin.' }, { status: 403 });
  }

  const studioAccess = await getStudioAccess();

  if (studioAccess.status !== 'authorized') {
    return NextResponse.json({ error: 'Studio access is required to invite members.' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid invite payload.' }, { status: 400 });
  }

  if (!isRecord(body)) {
    return NextResponse.json({ error: 'Invalid invite payload.' }, { status: 400 });
  }

  if (asString(body.website)) {
    return NextResponse.json({ ok: true });
  }

  const email = asString(body.email).toLowerCase();
  const projectSlug = asString(body.projectSlug);
  const role = asString(body.role);

  if (!isEmail(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }

  if (!projectSlug) {
    return NextResponse.json({ error: 'Select a project.' }, { status: 400 });
  }

  if (!allowedRoles.has(role)) {
    return NextResponse.json({ error: 'Select a valid role.' }, { status: 400 });
  }

  const supabase = getPortalSupabaseClient();

  if (!supabase) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 });
  }

  const { data: project, error: projectError } = await supabase
    .from('portal_projects')
    .select('id,slug')
    .eq('slug', projectSlug)
    .maybeSingle();

  if (projectError || !project) {
    return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
  }

  let userId: string | null = null;

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
  });

  if (createError) {
    const msg = (createError.message || '').toLowerCase();
    const alreadyExists = msg.includes('already') || msg.includes('exists') || msg.includes('registered') || (createError as unknown as { status?: number }).status === 422;
    if (alreadyExists) {
      const { data: list } = await supabase.auth.admin.listUsers();
      const found = list.users.find((u) => (u.email || '').toLowerCase() === email);
      if (found) {
        userId = found.id;
      } else {
        // Fallback: try to get by email via list with pagination? Already did.
        // Keep userId null and proceed with email-only membership.
        userId = null;
      }
    } else {
      await recordPortalOperationalEvent({
        actorEmail: studioAccess.auth.email,
        detail: createError.message || 'Supabase could not create the auth user.',
        eventType: 'auth_failure',
        metadata: { email, projectSlug, role, authCode: (createError as unknown as { code?: string }).code || '' },
        projectId: project.id,
        severity: 'error',
        sourceRoute: '/api/portal/members',
        title: 'Portal invite user creation failed',
      });
      return NextResponse.json({ error: 'Invite could not create the user.' }, { status: 500 });
    }
  } else if (created?.user) {
    userId = created.user.id;
  }

  const inviteExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const memberPayload: Record<string, unknown> = {
    project_id: project.id,
    email,
    role,
    invite_expires_at: inviteExpiresAt,
    revoked_at: null,
    accepted_at: null,
  };

  if (userId) {
    memberPayload.user_id = userId;
  }

  const { error: memberError } = await supabase
    .from('portal_project_members')
    .upsert(memberPayload, { onConflict: 'project_id,email' });

  if (memberError) {
    // Fallback: try insert then update if upsert not supported on this constraint
    const lowerMsg = (memberError.message || '').toLowerCase();
    if (lowerMsg.includes('duplicate') || lowerMsg.includes('unique') || lowerMsg.includes('conflict')) {
      const { error: updateError } = await supabase
        .from('portal_project_members')
        .update({ role, invite_expires_at: inviteExpiresAt, revoked_at: null, ...(userId ? { user_id: userId } : {}) })
        .eq('project_id', project.id)
        .eq('email', email);
      if (updateError) {
        await recordPortalOperationalEvent({
          actorEmail: studioAccess.auth.email,
          detail: updateError.message || 'Membership upsert failed.',
          eventType: 'auth_failure',
          metadata: { email, projectSlug, role },
          projectId: project.id,
          severity: 'error',
          sourceRoute: '/api/portal/members',
          title: 'Portal invite membership failed',
        });
        return NextResponse.json({ error: 'Invite could not save membership.' }, { status: 500 });
      }
    } else {
      await recordPortalOperationalEvent({
        actorEmail: studioAccess.auth.email,
        detail: memberError.message || 'Membership upsert failed.',
        eventType: 'auth_failure',
        metadata: { email, projectSlug, role },
        projectId: project.id,
        severity: 'error',
        sourceRoute: '/api/portal/members',
        title: 'Portal invite membership failed',
      });
      return NextResponse.json({ error: 'Invite could not save membership.' }, { status: 500 });
    }
  }

  const config = getPortalAuthConfig();
  if (config) {
    const anon = createClient(config.supabaseUrl, config.publishableKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const redirectTo = new URL('/auth/callback', request.url);
    redirectTo.searchParams.set('next', '/portal');
    const { error: otpError } = await anon.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo.toString(),
        shouldCreateUser: false,
      },
    });
    if (otpError) {
      await recordPortalOperationalEvent({
        actorEmail: studioAccess.auth.email,
        detail: otpError.message || 'Magic link could not be sent after invite.',
        eventType: 'auth_failure',
        metadata: { email, projectSlug, role, inviteSent: false },
        projectId: project.id,
        severity: 'warning',
        sourceRoute: '/api/portal/members',
        title: 'Portal invite magic link failed',
      });
      // Do not fail the invite — membership is saved, link can be resent.
    }
  }

  await recordPortalOperationalEvent({
    actorEmail: studioAccess.auth.email,
    detail: `Invited ${email} as ${role} to ${projectSlug}.`,
    eventType: 'monitoring_note',
    metadata: { email, projectSlug, role, inviteExpiresAt },
    projectId: project.id,
    severity: 'info',
    sourceRoute: '/api/portal/members',
    title: 'Portal member invited',
  });

  return NextResponse.json({ ok: true, email, projectSlug, role });
}
