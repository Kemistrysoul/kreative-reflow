import 'server-only';
import { defaultPortalProjectSlug, getPortalSupabaseClient } from '@/lib/portal-supabase';
import {
  formatPortalFileSize,
  type PortalAssetCategoryId,
} from '@/lib/portal-asset-config';

export type PortalProjectAsset = {
  id: string;
  projectSlug: string;
  projectName: string;
  clientName: string;
  category: PortalAssetCategoryId;
  categoryTitle: string;
  fileName: string;
  contentType: string;
  sizeLabel: string;
  uploadStatus: 'received' | 'accepted' | 'needs_replacement' | 'quarantined';
  reviewStatus: 'pending_review' | 'approved' | 'rejected';
  uploadedByEmail: string;
  uploadedAt: string;
  reviewNote: string;
  source: 'supabase' | 'demo';
};

type PortalProjectAssetRow = {
  id: string;
  asset_category: PortalAssetCategoryId;
  asset_bucket_title: string;
  original_filename: string;
  content_type: string;
  file_size_bytes: number;
  upload_status: PortalProjectAsset['uploadStatus'];
  review_status: PortalProjectAsset['reviewStatus'];
  uploaded_by_email: string;
  review_note: string;
  created_at: string | null;
  portal_projects:
    | {
        slug: string;
        project_name: string;
        portal_clients:
          | {
              name: string;
            }
          | {
              name: string;
            }[]
          | null;
      }
    | {
        slug: string;
        project_name: string;
        portal_clients:
          | {
              name: string;
            }
          | {
              name: string;
            }[]
          | null;
      }[]
    | null;
};

const demoPortalAssets: PortalProjectAsset[] = [
  {
    id: 'demo-logo-pack',
    projectSlug: defaultPortalProjectSlug,
    projectName: 'Website Redesign',
    clientName: 'ABC Engineering',
    category: 'logo-files',
    categoryTitle: 'Logo Files',
    fileName: 'abc-engineering-logo-pack.zip',
    contentType: 'application/zip',
    sizeLabel: '2.4 MB',
    uploadStatus: 'received',
    reviewStatus: 'pending_review',
    uploadedByEmail: 'approver@abc-engineering.example',
    uploadedAt: '30 May 2026, 08:30',
    reviewNote: 'Demo asset for local preview only.',
    source: 'demo',
  },
];

export function getPortalAssetStorageBucket() {
  return process.env.SUPABASE_STORAGE_BUCKET_CLIENT_ASSETS || 'client-assets';
}

function formatAssetDateTime(value: string | null) {
  if (!value) return 'Not saved';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Not saved';
  }

  return new Intl.DateTimeFormat('en-ZA', {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function getProject(row: PortalProjectAssetRow) {
  if (Array.isArray(row.portal_projects)) {
    return row.portal_projects[0] ?? null;
  }

  return row.portal_projects;
}

function getClientName(row: PortalProjectAssetRow) {
  const project = getProject(row);

  if (Array.isArray(project?.portal_clients)) {
    return project.portal_clients[0]?.name || 'Unknown client';
  }

  return project?.portal_clients?.name || 'Unknown client';
}

function mapAsset(row: PortalProjectAssetRow): PortalProjectAsset {
  const project = getProject(row);

  return {
    id: row.id,
    projectSlug: project?.slug || defaultPortalProjectSlug,
    projectName: project?.project_name || 'Unknown project',
    clientName: getClientName(row),
    category: row.asset_category,
    categoryTitle: row.asset_bucket_title,
    fileName: row.original_filename,
    contentType: row.content_type,
    sizeLabel: formatPortalFileSize(row.file_size_bytes),
    uploadStatus: row.upload_status,
    reviewStatus: row.review_status,
    uploadedByEmail: row.uploaded_by_email,
    uploadedAt: formatAssetDateTime(row.created_at),
    reviewNote: row.review_note,
    source: 'supabase',
  };
}

export async function getPortalProjectAssets(
  projectSlug = defaultPortalProjectSlug,
): Promise<PortalProjectAsset[]> {
  const supabase = getPortalSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('portal_project_assets')
    .select(
      [
        'id',
        'asset_category',
        'asset_bucket_title',
        'original_filename',
        'content_type',
        'file_size_bytes',
        'upload_status',
        'review_status',
        'uploaded_by_email',
        'review_note',
        'created_at',
        'portal_projects!inner(slug,project_name,portal_clients!inner(name))',
      ].join(','),
    )
    .eq('portal_projects.slug', projectSlug)
    .order('created_at', { ascending: false })
    .limit(12);

  if (error || !data) {
    return [];
  }

  return (data as unknown as PortalProjectAssetRow[]).map(mapAsset);
}

export async function getStudioAssetReviews(): Promise<PortalProjectAsset[]> {
  const supabase = getPortalSupabaseClient();

  if (!supabase) {
    return demoPortalAssets;
  }

  const { data, error } = await supabase
    .from('portal_project_assets')
    .select(
      [
        'id',
        'asset_category',
        'asset_bucket_title',
        'original_filename',
        'content_type',
        'file_size_bytes',
        'upload_status',
        'review_status',
        'uploaded_by_email',
        'review_note',
        'created_at',
        'portal_projects!inner(slug,project_name,portal_clients!inner(name))',
      ].join(','),
    )
    .order('created_at', { ascending: false })
    .limit(12);

  if (error || !data) {
    return demoPortalAssets;
  }

  return (data as unknown as PortalProjectAssetRow[]).map(mapAsset);
}
