import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import {
  buildPortalLoginPath,
  getPortalAuthConfig,
  sanitizePortalNextPath,
} from '@/lib/portal-auth-config';

function isProtectedWorkspacePath(pathname: string) {
  if (pathname === '/studio' || pathname.startsWith('/studio/')) {
    return true;
  }

  return pathname === '/portal' || (pathname.startsWith('/portal/') && !pathname.startsWith('/portal/login'));
}

export async function updatePortalSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const config = getPortalAuthConfig();
  const protectedWorkspacePath = isProtectedWorkspacePath(request.nextUrl.pathname);

  if (!config) {
    if (protectedWorkspacePath) {
      return NextResponse.redirect(
        new URL(
          buildPortalLoginPath(
            sanitizePortalNextPath(`${request.nextUrl.pathname}${request.nextUrl.search}`),
            'setup',
          ),
          request.url,
        ),
      );
    }

    return response;
  }

  const supabase = createServerClient(config.supabaseUrl, config.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });

        Object.entries(headers).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
      },
    },
  });

  const { data, error } = await supabase.auth.getClaims();

  if (protectedWorkspacePath && (error || !data?.claims?.sub)) {
    return NextResponse.redirect(
      new URL(
        buildPortalLoginPath(
          sanitizePortalNextPath(`${request.nextUrl.pathname}${request.nextUrl.search}`),
        ),
        request.url,
      ),
    );
  }

  return response;
}
