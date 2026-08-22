import 'server-only';
import { getPortalAuthState, type PortalAuthState } from '@/lib/portal-auth';
import {
  defaultPortalProjectSlug,
  getPortalSupabaseClient,
  type PortalSupabaseClient,
} from '@/lib/portal-supabase';

export type PortalMemberRole = 'studio_admin' | 'client_owner' | 'client_collaborator' | 'viewer';

type AuthenticatedPortalAuthState = Extract<PortalAuthState, { status: 'authenticated' }>;
type PortalAuthGateState = Exclude<PortalAuthState, { status: 'authenticated' }>;

type AccessFailure = {
  status: 'empty' | 'unauthorized' | 'expired';
  auth: AuthenticatedPortalAuthState;
  message: string;
};

export type PortalAccess =
  | {
      status: 'authorized';
      auth: AuthenticatedPortalAuthState;
      projectId: string;
      projectSlug: string;
      role: PortalMemberRole;
      canManageProject: boolean;
      canSubmitOnboarding: boolean;
      isReadOnly: boolean;
    }
  | AccessFailure;

export type StudioAccess =
  | {
      status: 'authorized';
      auth: AuthenticatedPortalAuthState;
      role: 'studio_admin';
      projectIds: string[];
    }
  | AccessFailure;

type PortalMembershipRow = {
  id: string;
  project_id: string;
  role: PortalMemberRole;
  accepted_at: string | null;
  invite_expires_at: string | null;
  revoked_at: string | null;
  portal_projects:
    | {
        slug: string;
        visibility: string;
      }
    | {
        slug: string;
        visibility: string;
      }[]
    | null;
};

type MembershipQueryOptions = {
  projectSlug?: string;
  role?: PortalMemberRole;
};

const membershipSelect =
  'id,project_id,role,accepted_at,invite_expires_at,revoked_at,portal_projects!inner(slug,visibility)';

function getMembershipProject(row: PortalMembershipRow) {
  if (Array.isArray(row.portal_projects)) {
    return row.portal_projects[0] ?? null;
  }

  return row.portal_projects;
}

function isExpired(value: string | null) {
  if (!value) return false;

  const date = new Date(value);

  return !Number.isNaN(date.getTime()) && date.getTime() < Date.now();
}

function isActiveMembership(row: PortalMembershipRow) {
  return !row.revoked_at && !isExpired(row.invite_expires_at);
}

function isAvailableProject(row: PortalMembershipRow) {
  const project = getMembershipProject(row);

  return Boolean(project && project.visibility !== 'archived');
}

async function getMembershipRows(
  supabase: PortalSupabaseClient,
  auth: AuthenticatedPortalAuthState,
  options: MembershipQueryOptions = {},
) {
  const email = auth.email.trim().toLowerCase();
  const buildQuery = () => {
    let query = supabase
      .from('portal_project_members')
      .select(membershipSelect);

    if (options.projectSlug) {
      query = query.eq('portal_projects.slug', options.projectSlug);
    }

    if (options.role) {
      query = query.eq('role', options.role);
    }

    return query;
  };

  const requests = [buildQuery().eq('user_id', auth.userId)];

  if (email) {
    requests.push(buildQuery().ilike('email', email));
  }

  const results = await Promise.all(requests);
  const error = results.find((result) => result.error)?.error;

  if (error) {
    return { rows: null, error };
  }

  const rowMap = new Map<string, PortalMembershipRow>();

  results.forEach((result) => {
    ((result.data ?? []) as unknown as PortalMembershipRow[]).forEach((row) => {
      rowMap.set(row.id, row);
    });
  });

  return {
    rows: Array.from(rowMap.values()),
    error: null,
  };
}

function mapAuthorizedAccess(
  row: PortalMembershipRow,
  auth: AuthenticatedPortalAuthState,
): Extract<PortalAccess, { status: 'authorized' }> {
  const role = row.role;

  return {
    status: 'authorized',
    auth,
    projectId: row.project_id,
    projectSlug: getMembershipProject(row)?.slug || defaultPortalProjectSlug,
    role,
    canManageProject: role === 'studio_admin',
    canSubmitOnboarding: role === 'studio_admin' || role === 'client_owner' || role === 'client_collaborator',
    isReadOnly: role === 'viewer',
  };
}

export async function getPortalAccess(
  projectSlug?: string,
): Promise<PortalAccess | PortalAuthGateState> {
  const auth = await getPortalAuthState();

  if (auth.status !== 'authenticated') {
    return auth;
  }

  const supabase = getPortalSupabaseClient();

  if (!supabase) {
    return {
      status: 'empty',
      auth,
      message: 'Portal project access is not configured yet.',
    };
  }

  // Explicit slug: preserve existing scoped behaviour for API routes.
  if (projectSlug) {
    const { rows, error } = await getMembershipRows(supabase, auth, { projectSlug });

    if (error || !rows) {
      return {
        status: 'empty',
        auth,
        message: 'Portal project access could not be checked.',
      };
    }

    if (!rows.length) {
      return {
        status: 'unauthorized',
        auth,
        message: 'You are signed in, but this project is not assigned to your portal account.',
      };
    }

    const activeRow = rows.find(isActiveMembership);

    if (!activeRow) {
      return {
        status: 'expired',
        auth,
        message: 'Your portal invite has expired or was revoked. Ask the studio for a fresh invite.',
      };
    }

    if (!isAvailableProject(activeRow)) {
      return {
        status: 'empty',
        auth,
        message: 'This portal project is not available yet.',
      };
    }

    return mapAuthorizedAccess(activeRow, auth);
  }

  // No slug: resolve caller's own membership. This is the portal's project
  // resolution path. Do not default to defaultPortalProjectSlug.
  const { rows, error } = await getMembershipRows(supabase, auth, {});

  if (error || !rows) {
    return {
      status: 'empty',
      auth,
      message: 'Portal project access could not be checked.',
    };
  }

  if (!rows.length) {
    return {
      status: 'unauthorized',
      auth,
      message: 'You are signed in, but this project is not assigned to your portal account.',
    };
  }

  const activeRows = rows.filter(isActiveMembership);

  if (!activeRows.length) {
    return {
      status: 'expired',
      auth,
      message: 'Your portal invite has expired or was revoked. Ask the studio for a fresh invite.',
    };
  }

  const availableRows = activeRows.filter(isAvailableProject);

  if (!availableRows.length) {
    return {
      status: 'empty',
      auth,
      message: 'This portal project is not available yet.',
    };
  }

  // Single membership: use it. Multiple: pick deterministically by most
  // recently accepted (project picker is the eventual answer).
  if (availableRows.length === 1) {
    return mapAuthorizedAccess(availableRows[0], auth);
  }

  const sorted = [...availableRows].sort((a, b) => {
    const aTime = a.accepted_at ? new Date(a.accepted_at).getTime() : 0;
    const bTime = b.accepted_at ? new Date(b.accepted_at).getTime() : 0;
    return bTime - aTime;
  });

  return mapAuthorizedAccess(sorted[0], auth);
}

export async function getStudioAccess(): Promise<StudioAccess | PortalAuthGateState> {
  const auth = await getPortalAuthState();

  if (auth.status !== 'authenticated') {
    return auth;
  }

  const supabase = getPortalSupabaseClient();

  if (!supabase) {
    return {
      status: 'empty',
      auth,
      message: 'Studio access is not configured yet.',
    };
  }

  const { rows, error } = await getMembershipRows(supabase, auth, { role: 'studio_admin' });

  if (error || !rows) {
    return {
      status: 'empty',
      auth,
      message: 'Studio access could not be checked.',
    };
  }

  if (!rows.length) {
    return {
      status: 'unauthorized',
      auth,
      message: 'You are signed in, but this account does not have studio admin access.',
    };
  }

  const activeRows = rows.filter(isActiveMembership);

  if (!activeRows.length) {
    return {
      status: 'expired',
      auth,
      message: 'Your studio invite has expired or was revoked. Ask an administrator for fresh access.',
    };
  }

  const availableRows = activeRows.filter(isAvailableProject);

  if (!availableRows.length) {
    return {
      status: 'empty',
      auth,
      message: 'No active studio projects are available for this account yet.',
    };
  }

  return {
    status: 'authorized',
    auth,
    role: 'studio_admin',
    projectIds: availableRows.map((row) => row.project_id),
  };
}

export async function requirePortalProjectAccess(projectSlug = defaultPortalProjectSlug) {
  const access = await getPortalAccess(projectSlug);

  if (access.status === 'missing-config' || access.status === 'unauthenticated') {
    return access;
  }

  return access;
}
