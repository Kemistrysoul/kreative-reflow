export type PortalAuthConfig = {
  supabaseUrl: string;
  publishableKey: string;
};

export function getPortalAuthConfig(): PortalAuthConfig | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !publishableKey) {
    return null;
  }

  return {
    supabaseUrl,
    publishableKey,
  };
}

const protectedWorkspaceRoots = ['/portal', '/studio'];

function isAllowedWorkspacePath(path: string, root: string) {
  return path === root || path.startsWith(`${root}/`) || path.startsWith(`${root}?`);
}

export function sanitizePortalNextPath(value: string | string[] | null | undefined) {
  const nextPath = Array.isArray(value) ? value[0] : value;

  if (!nextPath || !protectedWorkspaceRoots.some((root) => isAllowedWorkspacePath(nextPath, root))) {
    return '/portal';
  }

  if (nextPath.startsWith('/portal/login')) {
    return '/portal';
  }

  return nextPath;
}

export function buildPortalLoginPath(nextPath: string, reason?: 'setup') {
  const params = new URLSearchParams({ next: sanitizePortalNextPath(nextPath) });

  if (reason) {
    params.set('reason', reason);
  }

  return `/portal/login?${params.toString()}`;
}
