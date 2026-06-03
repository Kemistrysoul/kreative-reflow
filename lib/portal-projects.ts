import 'server-only';
import {
  assetBuckets as demoAssetBuckets,
  milestones as demoMilestones,
  portalActivity as demoPortalActivity,
  portalProject as demoPortalProject,
  portalSteps as demoPortalSteps,
  type ActivityItem,
  type AssetBucket,
  type MilestoneRecord,
  type PortalStep,
} from '@/lib/dashboard-data';
import {
  defaultPortalProjectSlug,
  getPortalSupabaseClient,
  type PortalSupabaseClient,
} from '@/lib/portal-supabase';
import { recordPortalOperationalEvent } from '@/lib/portal-monitoring';
import { CheckCircle2, FileCheck2, FolderKanban, PackageCheck, ReceiptText, UploadCloud, type LucideIcon } from 'lucide-react';

export type PortalProjectSummary = typeof demoPortalProject & {
  slug: string;
  source: 'supabase' | 'demo';
};

export type PortalProjectData = {
  project: PortalProjectSummary;
  steps: PortalStep[];
  milestones: MilestoneRecord[];
  assetBuckets: AssetBucket[];
  activity: ActivityItem[];
};

type PortalProjectRow = {
  id: string;
  slug: string;
  project_name: string;
  phase: string;
  status: string;
  progress: number;
  started_on: string | null;
  target_launch_on: string | null;
  next_action: string;
  portal_clients:
    | {
        name: string;
      }
    | {
        name: string;
      }[]
    | null;
};

type PortalStepRow = {
  title: string;
  status: string;
  detail: string;
  icon_name: string | null;
};

type PortalMilestoneRow = {
  label: string;
  state: string;
  due_on: string | null;
  owner_name: string | null;
  owner_role: string | null;
  detail: string | null;
};

type PortalAssetBucketRow = {
  title: string;
  detail: string;
  file_count: number | null;
};

type PortalActivityRow = {
  display_time: string;
  title: string;
  meta: string;
};

const portalStepIcons: Record<string, LucideIcon> = {
  approval: FileCheck2,
  check: CheckCircle2,
  finance: ReceiptText,
  handoff: PackageCheck,
  milestones: FolderKanban,
  upload: UploadCloud,
};

function getDemoPortalProject(): PortalProjectSummary {
  return {
    ...demoPortalProject,
    slug: defaultPortalProjectSlug,
    source: 'demo',
  };
}

function getDemoPortalProjectData(): PortalProjectData {
  return {
    project: getDemoPortalProject(),
    steps: demoPortalSteps,
    milestones: demoMilestones,
    assetBuckets: demoAssetBuckets,
    activity: demoPortalActivity,
  };
}

async function getPortalProjectRow(
  supabase: PortalSupabaseClient,
  slug: string,
): Promise<PortalProjectRow | null> {
  const { data, error } = await supabase
    .from('portal_projects')
    .select(
      [
        'id',
        'slug',
        'project_name',
        'phase',
        'status',
        'progress',
        'started_on',
        'target_launch_on',
        'next_action',
        'portal_clients!inner(name)',
      ].join(','),
    )
    .eq('slug', slug)
    .maybeSingle<PortalProjectRow>();

  if (error || !data) {
    return null;
  }

  return data;
}

function formatFullDate(value: string | null, fallback: string) {
  if (!value) return fallback;

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return new Intl.DateTimeFormat('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function formatShortDate(value: string | null, fallback: string) {
  if (!value) return fallback;

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
  }).format(date);
}

function getClientName(row: PortalProjectRow) {
  if (Array.isArray(row.portal_clients)) {
    return row.portal_clients[0]?.name || demoPortalProject.clientName;
  }

  return row.portal_clients?.name || demoPortalProject.clientName;
}

function mapPortalProject(row: PortalProjectRow): PortalProjectSummary {
  return {
    slug: row.slug,
    source: 'supabase',
    clientName: getClientName(row),
    projectName: row.project_name,
    phase: row.phase,
    status: row.status,
    progress: row.progress,
    started: formatFullDate(row.started_on, demoPortalProject.started),
    targetLaunch: formatFullDate(row.target_launch_on, demoPortalProject.targetLaunch),
    nextAction: row.next_action,
  };
}

function mapPortalStep(row: PortalStepRow): PortalStep {
  return {
    title: row.title,
    status: row.status,
    detail: row.detail,
    icon: portalStepIcons[row.icon_name || 'check'] ?? CheckCircle2,
  };
}

function mapMilestone(row: PortalMilestoneRow, index: number): MilestoneRecord {
  return {
    label: row.label,
    state: row.state,
    date: formatShortDate(row.due_on, demoMilestones[index]?.date ?? ''),
    detail: row.detail || demoMilestones[index]?.detail,
    owner: row.owner_name || demoMilestones[index]?.owner,
    ownerRole: row.owner_role || demoMilestones[index]?.ownerRole,
  };
}

function mapAssetBucket(row: PortalAssetBucketRow): AssetBucket {
  return {
    title: row.title,
    detail: row.detail,
    files: row.file_count ?? 0,
  };
}

function mapActivity(row: PortalActivityRow): ActivityItem {
  return {
    time: row.display_time,
    title: row.title,
    meta: row.meta,
  };
}

export async function getPortalProjectSummary(
  slug = defaultPortalProjectSlug,
): Promise<PortalProjectSummary> {
  const supabase = getPortalSupabaseClient();

  if (!supabase) {
    return getDemoPortalProject();
  }

  const data = await getPortalProjectRow(supabase, slug);

  if (!data) {
    return getDemoPortalProject();
  }

  return mapPortalProject(data);
}

export async function getPortalProjectData(
  slug = defaultPortalProjectSlug,
): Promise<PortalProjectData> {
  return (await getPortalProjectDataFromSupabase(slug)) ?? getDemoPortalProjectData();
}

export async function getAuthorizedPortalProjectData(
  slug = defaultPortalProjectSlug,
): Promise<PortalProjectData | null> {
  return getPortalProjectDataFromSupabase(slug);
}

async function getPortalProjectDataFromSupabase(
  slug = defaultPortalProjectSlug,
): Promise<PortalProjectData | null> {
  const supabase = getPortalSupabaseClient();

  if (!supabase) {
    return null;
  }

  const projectRow = await getPortalProjectRow(supabase, slug);

  if (!projectRow) {
    await recordPortalOperationalEvent({
      detail: 'An authorized portal membership exists, but the matching project record could not be loaded.',
      eventType: 'project_data_error',
      metadata: { projectSlug: slug },
      severity: 'error',
      sourceRoute: '/portal',
      title: 'Authorized portal project record missing',
    });

    return null;
  }

  const [stepsResult, milestonesResult, assetBucketsResult, activityResult] = await Promise.all([
    supabase
      .from('portal_project_steps')
      .select('title,status,detail,icon_name')
      .eq('project_id', projectRow.id)
      .order('sort_order', { ascending: true }),
    supabase
      .from('portal_project_milestones')
      .select('label,state,due_on,owner_name,owner_role,detail')
      .eq('project_id', projectRow.id)
      .order('sort_order', { ascending: true }),
    supabase
      .from('portal_project_asset_buckets')
      .select('title,detail,file_count')
      .eq('project_id', projectRow.id)
      .order('sort_order', { ascending: true }),
    supabase
      .from('portal_project_activity')
      .select('display_time,title,meta')
      .eq('project_id', projectRow.id)
      .eq('client_visible', true)
      .order('occurred_at', { ascending: false, nullsFirst: false })
      .order('sort_order', { ascending: true }),
  ]);

  if (
    stepsResult.error ||
    milestonesResult.error ||
    assetBucketsResult.error ||
    activityResult.error ||
    !stepsResult.data ||
    !milestonesResult.data ||
    !assetBucketsResult.data ||
    !activityResult.data
  ) {
    const error =
      stepsResult.error ||
      milestonesResult.error ||
      assetBucketsResult.error ||
      activityResult.error;

    await recordPortalOperationalEvent({
      detail: error?.message || 'One or more portal project data queries returned no data.',
      eventType: 'project_data_error',
      metadata: {
        activityLoaded: Boolean(activityResult.data),
        assetBucketsLoaded: Boolean(assetBucketsResult.data),
        milestonesLoaded: Boolean(milestonesResult.data),
        projectSlug: slug,
        stepsLoaded: Boolean(stepsResult.data),
      },
      projectId: projectRow.id,
      severity: 'error',
      sourceRoute: '/portal',
      title: 'Portal project data load failed',
    });

    return null;
  }

  return {
    project: mapPortalProject(projectRow),
    steps: (stepsResult.data as PortalStepRow[]).map(mapPortalStep),
    milestones: (milestonesResult.data as PortalMilestoneRow[]).map(mapMilestone),
    assetBuckets: (assetBucketsResult.data as PortalAssetBucketRow[]).map(mapAssetBucket),
    activity: (activityResult.data as PortalActivityRow[]).map(mapActivity),
  };
}
