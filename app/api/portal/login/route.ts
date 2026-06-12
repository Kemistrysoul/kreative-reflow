import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { recordPortalOperationalEvent } from '@/lib/portal-monitoring';
import { getPortalAuthConfig, sanitizePortalNextPath } from '@/lib/portal-auth-config';

export const runtime = 'nodejs';

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

function getAuthErrorDetail(error: unknown) {
  if (!isRecord(error)) {
    return {
      code: '',
      message: 'Supabase Auth rejected the OTP request.',
      status: 0,
    };
  }

  return {
    code: asString(error.code),
    message: asString(error.message) || 'Supabase Auth rejected the OTP request.',
    status: typeof error.status === 'number' ? error.status : 0,
  };
}

function isRateLimitError(error: ReturnType<typeof getAuthErrorDetail>) {
  const haystack = `${error.code} ${error.message}`.toLowerCase();

  return (
    error.status === 429 ||
    haystack.includes('rate limit') ||
    haystack.includes('too many') ||
    haystack.includes('only request this after')
  );
}

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) {
    await recordPortalOperationalEvent({
      detail: 'Portal sign-in was attempted from a different origin.',
      eventType: 'auth_failure',
      metadata: { route: '/api/portal/login' },
      severity: 'warning',
      sourceRoute: '/api/portal/login',
      title: 'Portal sign-in origin rejected',
    });

    return NextResponse.json({ error: 'Invalid portal sign-in origin.' }, { status: 403 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid portal sign-in payload.' }, { status: 400 });
  }

  if (!isRecord(body)) {
    return NextResponse.json({ error: 'Invalid portal sign-in payload.' }, { status: 400 });
  }

  if (asString(body.website)) {
    return NextResponse.json({ ok: true });
  }

  const email = asString(body.email).toLowerCase();

  if (!isEmail(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }

  const nextPath = sanitizePortalNextPath(asString(body.nextPath));
  const config = getPortalAuthConfig();

  if (!config) {
    await recordPortalOperationalEvent({
      actorEmail: email,
      detail: 'Supabase Auth environment variables are missing, so the portal cannot start a secure sign-in link.',
      eventType: 'auth_failure',
      metadata: { nextPath },
      severity: 'error',
      sourceRoute: '/api/portal/login',
      title: 'Portal sign-in blocked by missing Supabase Auth config',
    });

    return NextResponse.json({ error: 'Supabase Auth is not configured.' }, { status: 503 });
  }

  const redirectTo = new URL('/auth/callback', request.url);
  redirectTo.searchParams.set('next', nextPath);

  const supabase = createClient(config.supabaseUrl, config.publishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo.toString(),
      shouldCreateUser: false,
    },
  });

  if (error) {
    const authError = getAuthErrorDetail(error);
    const rateLimited = isRateLimitError(authError);

    await recordPortalOperationalEvent({
      actorEmail: email,
      detail: authError.message,
      eventType: 'auth_failure',
      metadata: {
        authCode: authError.code,
        authStatus: authError.status,
        nextPath,
        rateLimited,
      },
      severity: 'warning',
      sourceRoute: '/api/portal/login',
      title: 'Portal sign-in link could not be sent',
    });

    if (rateLimited) {
      return NextResponse.json(
        {
          error:
            'Email sign-in is temporarily rate-limited for this Supabase project. Wait before requesting another link, or configure custom SMTP before launch.',
        },
        { status: 429 },
      );
    }

    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json(
        { error: `Supabase Auth rejected the sign-in email: ${authError.message}` },
        { status: authError.status >= 400 && authError.status < 500 ? authError.status : 400 },
      );
    }

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}
