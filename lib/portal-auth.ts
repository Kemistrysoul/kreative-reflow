import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  buildPortalLoginPath,
  getPortalAuthConfig,
  sanitizePortalNextPath,
} from '@/lib/portal-auth-config';

export type PortalAuthState =
  | {
      status: 'authenticated';
      email: string;
      userId: string;
    }
  | {
      status: 'unauthenticated';
    }
  | {
      status: 'missing-config';
    };

export async function createPortalAuthServerClient() {
  const config = getPortalAuthConfig();

  if (!config) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(config.supabaseUrl, config.publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot always write cookies; the proxy handles refresh writes.
        }
      },
    },
  });
}

export async function getPortalAuthState(): Promise<PortalAuthState> {
  const supabase = await createPortalAuthServerClient();

  if (!supabase) {
    return { status: 'missing-config' };
  }

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return { status: 'unauthenticated' };
  }

  const claims = data.claims as Record<string, unknown>;

  return {
    status: 'authenticated',
    email: typeof claims.email === 'string' ? claims.email.toLowerCase() : '',
    userId: String(claims.sub),
  };
}

export async function requirePortalAuth(nextPath: string) {
  const authState = await getPortalAuthState();
  const safeNextPath = sanitizePortalNextPath(nextPath);

  if (authState.status === 'missing-config') {
    redirect(buildPortalLoginPath(safeNextPath, 'setup'));
  }

  if (authState.status === 'unauthenticated') {
    redirect(buildPortalLoginPath(safeNextPath));
  }

  return authState;
}
