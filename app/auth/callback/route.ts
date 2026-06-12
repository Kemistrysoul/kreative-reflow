import { NextRequest, NextResponse } from 'next/server';
import type { EmailOtpType } from '@supabase/supabase-js';
import { buildPortalLoginPath, getPortalAuthConfig, sanitizePortalNextPath } from '@/lib/portal-auth-config';
import { createPortalAuthServerClient } from '@/lib/portal-auth';
import { recordPortalOperationalEvent } from '@/lib/portal-monitoring';

function getEmailOtpType(value: string | null): EmailOtpType {
  const allowedTypes = new Set<EmailOtpType>([
    'signup',
    'invite',
    'magiclink',
    'recovery',
    'email_change',
    'email',
  ]);

  return value && allowedTypes.has(value as EmailOtpType)
    ? (value as EmailOtpType)
    : 'email';
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const tokenHash = requestUrl.searchParams.get('token_hash');
  const otpType = getEmailOtpType(requestUrl.searchParams.get('type'));
  const nextPath = sanitizePortalNextPath(requestUrl.searchParams.get('next'));

  if (!getPortalAuthConfig()) {
    await recordPortalOperationalEvent({
      detail: 'Auth callback was reached, but Supabase Auth is not configured.',
      eventType: 'auth_failure',
      metadata: { nextPath },
      severity: 'error',
      sourceRoute: '/auth/callback',
      title: 'Auth callback blocked by missing config',
    });

    return NextResponse.redirect(new URL(buildPortalLoginPath(nextPath, 'setup'), request.url));
  }

  if (!code && !tokenHash) {
    await recordPortalOperationalEvent({
      detail: 'Auth callback was reached without a Supabase exchange code or token hash.',
      eventType: 'auth_failure',
      metadata: { nextPath },
      severity: 'warning',
      sourceRoute: '/auth/callback',
      title: 'Auth callback missing exchange code',
    });

    return NextResponse.redirect(new URL(buildPortalLoginPath(nextPath), request.url));
  }

  const supabase = await createPortalAuthServerClient();
  const { error } = supabase
    ? tokenHash
      ? await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: otpType,
        })
      : await supabase.auth.exchangeCodeForSession(code as string)
    : { error: new Error('Supabase Auth is not configured.') };

  if (error) {
    await recordPortalOperationalEvent({
      detail: error.message || 'Supabase Auth could not verify the callback credentials for a session.',
      eventType: 'auth_failure',
      metadata: { nextPath },
      severity: 'warning',
      sourceRoute: '/auth/callback',
      title: 'Auth callback session exchange failed',
    });

    return NextResponse.redirect(new URL(buildPortalLoginPath(nextPath), request.url));
  }

  return NextResponse.redirect(new URL(nextPath, request.url));
}
