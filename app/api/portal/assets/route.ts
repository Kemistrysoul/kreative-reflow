import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import {
  getPortalAssetStorageBucket,
  type PortalProjectAsset,
} from '@/lib/portal-assets';
import { logPortalProjectActivity } from '@/lib/portal-activity';
import {
  formatPortalFileSize,
  getPortalFileExtension,
  validatePortalAssetFileInput,
} from '@/lib/portal-asset-config';
import { getPortalAccess, getStudioAccess } from '@/lib/portal-access';
import { recordPortalOperationalEvent } from '@/lib/portal-monitoring';
import { getPortalSupabaseClient } from '@/lib/portal-supabase';

export const runtime = 'nodejs';

function hasSameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (!origin) return true;

  return origin === new URL(request.url).origin;
}

function asString(value: FormDataEntryValue | null) {
  return typeof value === 'string' ? value.trim() : '';
}

function asBodyString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function sanitizeFileName(value: string) {
  const fallback = 'client-asset';
  const cleaned = value
    .replace(/[/\\?%*:|"<>]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

  return cleaned || fallback;
}

const reviewActions = {
  accept: {
    activityTitle: 'Asset accepted',
    reviewStatus: 'approved',
    uploadStatus: 'accepted',
  },
  quarantine: {
    activityTitle: 'Asset held for review',
    reviewStatus: 'rejected',
    uploadStatus: 'quarantined',
  },
  replacement: {
    activityTitle: 'Asset replacement requested',
    reviewStatus: 'rejected',
    uploadStatus: 'needs_replacement',
  },
  reset: {
    activityTitle: 'Asset review reset',
    reviewStatus: 'pending_review',
    uploadStatus: 'received',
  },
} as const;

type ReviewAction = keyof typeof reviewActions;

function isReviewAction(value: string): value is ReviewAction {
  return value in reviewActions;
}

function buildStoragePath(projectId: string, categoryId: string, fileName: string) {
  const extension = getPortalFileExtension(fileName);
  const baseName = sanitizeFileName(fileName.replace(/\.[^.]+$/, ''));
  const storedName = `${baseName}-${randomUUID()}${extension}`;

  return {
    storedName,
    path: `projects/${projectId}/${categoryId}/${storedName}`,
  };
}

function mapUploadResponse({
  assetId,
  categoryTitle,
  contentType,
  file,
}: {
  assetId: string;
  categoryTitle: string;
  contentType: string;
  file: File;
}): Pick<
  PortalProjectAsset,
  'id' | 'categoryTitle' | 'contentType' | 'fileName' | 'reviewStatus' | 'sizeLabel' | 'uploadStatus'
> {
  return {
    id: assetId,
    categoryTitle,
    contentType,
    fileName: file.name,
    reviewStatus: 'pending_review',
    sizeLabel: formatPortalFileSize(file.size),
    uploadStatus: 'received',
  };
}

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: 'Invalid asset upload origin.' }, { status: 403 });
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid asset upload payload.' }, { status: 400 });
  }

  const file = formData.get('file');
  const projectSlug = asString(formData.get('projectSlug'));
  const categoryId = asString(formData.get('category'));

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Choose a file before uploading.' }, { status: 400 });
  }

  const validation = validatePortalAssetFileInput({
    categoryId,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
  });

  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const access = await getPortalAccess(projectSlug);

  if (access.status === 'missing-config') {
    await recordPortalOperationalEvent({
      detail: 'Client upload could not check portal access because Supabase Auth is not configured.',
      eventType: 'auth_failure',
      metadata: { categoryId, projectSlug },
      severity: 'error',
      sourceRoute: '/api/portal/assets',
      title: 'Asset upload blocked by missing auth config',
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
      detail: 'Client upload reached the API, but Supabase Storage is not configured.',
      eventType: 'upload_failure',
      metadata: { categoryId: validation.category.id, projectSlug },
      projectId: access.projectId,
      severity: 'error',
      sourceRoute: '/api/portal/assets',
      title: 'Asset upload blocked by missing storage config',
    });

    return NextResponse.json({ error: 'Supabase Storage is not configured.' }, { status: 503 });
  }

  const bucketName = getPortalAssetStorageBucket();
  const { path, storedName } = buildStoragePath(access.projectId, validation.category.id, file.name);
  const uploadOptions: {
    cacheControl: string;
    contentType?: string;
    upsert: boolean;
  } = {
    cacheControl: '3600',
    upsert: false,
  };

  if (file.type) {
    uploadOptions.contentType = file.type;
  }

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(path, await file.arrayBuffer(), uploadOptions);

  if (uploadError) {
    await recordPortalOperationalEvent({
      actorEmail: access.auth.email,
      detail: uploadError.message || 'Supabase Storage rejected the client asset upload.',
      eventType: 'upload_failure',
      metadata: {
        bucketName,
        categoryId: validation.category.id,
        contentType: file.type || 'application/octet-stream',
        fileSize: file.size,
        projectSlug,
      },
      projectId: access.projectId,
      severity: 'error',
      sourceRoute: '/api/portal/assets',
      title: 'Client asset upload failed in storage',
    });

    return NextResponse.json({ error: 'Asset could not be uploaded.' }, { status: 500 });
  }

  const contentType = file.type || 'application/octet-stream';
  const { data: assetData, error: assetError } = await supabase
    .from('portal_project_assets')
    .insert({
      project_id: access.projectId,
      bucket_id: bucketName,
      storage_path: path,
      asset_category: validation.category.id,
      asset_bucket_title: validation.category.title,
      original_filename: file.name,
      stored_filename: storedName,
      content_type: contentType,
      file_size_bytes: file.size,
      upload_status: 'received',
      review_status: 'pending_review',
      uploaded_by_user_id: access.auth.userId,
      uploaded_by_email: access.auth.email,
    })
    .select('id')
    .single<{ id: string }>();

  if (assetError || !assetData) {
    await supabase.storage.from(bucketName).remove([path]);
    await recordPortalOperationalEvent({
      actorEmail: access.auth.email,
      detail: assetError?.message || 'Asset metadata insert returned no id after file upload.',
      eventType: 'asset_failure',
      metadata: {
        bucketName,
        categoryId: validation.category.id,
        contentType,
        fileSize: file.size,
        projectSlug,
      },
      projectId: access.projectId,
      severity: 'error',
      sourceRoute: '/api/portal/assets',
      title: 'Asset metadata could not be saved after upload',
    });

    return NextResponse.json({ error: 'Asset metadata could not be saved.' }, { status: 500 });
  }

  const { data: bucketRow } = await supabase
    .from('portal_project_asset_buckets')
    .select('id,file_count')
    .eq('project_id', access.projectId)
    .eq('title', validation.category.title)
    .maybeSingle<{ id: string; file_count: number | null }>();

  if (bucketRow) {
    await supabase
      .from('portal_project_asset_buckets')
      .update({
        file_count: (bucketRow.file_count ?? 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', bucketRow.id);
  }

  await logPortalProjectActivity({
    actorEmail: access.auth.email,
    eventType: 'asset_uploaded',
    meta: `${validation.category.title} received and queued for studio review`,
    projectId: access.projectId,
    sourceRecordId: assetData.id,
    sourceTable: 'portal_project_assets',
    supabase,
    title: `Asset uploaded: ${file.name}`,
  });

  return NextResponse.json({
    ok: true,
    asset: mapUploadResponse({
      assetId: assetData.id,
      categoryTitle: validation.category.title,
      contentType,
      file,
    }),
  });
}

export async function PATCH(request: NextRequest) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: 'Invalid asset review origin.' }, { status: 403 });
  }

  const access = await getStudioAccess();

  if (access.status === 'missing-config') {
    await recordPortalOperationalEvent({
      detail: 'Studio asset review could not check access because Supabase Auth is not configured.',
      eventType: 'auth_failure',
      severity: 'error',
      sourceRoute: '/api/portal/assets',
      title: 'Asset review blocked by missing auth config',
    });

    return NextResponse.json({ error: 'Supabase Auth is not configured.' }, { status: 503 });
  }

  if (access.status === 'unauthenticated') {
    return NextResponse.json({ error: 'Studio authentication is required.' }, { status: 401 });
  }

  if (access.status !== 'authorized') {
    return NextResponse.json({ error: access.message }, { status: access.status === 'expired' ? 410 : 403 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid asset review payload.' }, { status: 400 });
  }

  if (!isRecord(body)) {
    return NextResponse.json({ error: 'Invalid asset review payload.' }, { status: 400 });
  }

  const assetId = asBodyString(body.assetId);
  const action = asBodyString(body.action);
  const reviewNote = asBodyString(body.reviewNote);

  if (!assetId || !isReviewAction(action)) {
    return NextResponse.json({ error: 'Choose a valid asset review action.' }, { status: 400 });
  }

  const supabase = getPortalSupabaseClient();

  if (!supabase) {
    await recordPortalOperationalEvent({
      actorEmail: access.auth.email,
      detail: 'Studio asset review reached the API, but Supabase Storage/project data is not configured.',
      eventType: 'asset_failure',
      metadata: { action, assetId },
      severity: 'error',
      sourceRoute: '/api/portal/assets',
      title: 'Asset review blocked by missing storage config',
    });

    return NextResponse.json({ error: 'Supabase Storage is not configured.' }, { status: 503 });
  }

  const { data: asset, error: assetError } = await supabase
    .from('portal_project_assets')
    .select('id,project_id,original_filename,asset_bucket_title')
    .eq('id', assetId)
    .maybeSingle<{
      id: string;
      project_id: string;
      original_filename: string;
      asset_bucket_title: string;
    }>();

  if (assetError || !asset) {
    if (assetError) {
      await recordPortalOperationalEvent({
        actorEmail: access.auth.email,
        detail: assetError.message || 'Asset lookup failed before studio review.',
        eventType: 'asset_failure',
        metadata: { action, assetId },
        severity: 'error',
        sourceRoute: '/api/portal/assets',
        title: 'Asset review lookup failed',
      });
    }

    return NextResponse.json({ error: 'Asset could not be found.' }, { status: 404 });
  }

  if (!access.projectIds.includes(asset.project_id)) {
    return NextResponse.json({ error: 'This studio account cannot review that project asset.' }, { status: 403 });
  }

  const nextState = reviewActions[action];
  const reviewedAt = new Date().toISOString();
  const { error: updateError } = await supabase
    .from('portal_project_assets')
    .update({
      review_note: reviewNote,
      review_status: nextState.reviewStatus,
      reviewed_at: reviewedAt,
      updated_at: reviewedAt,
      upload_status: nextState.uploadStatus,
    })
    .eq('id', asset.id);

  if (updateError) {
    await recordPortalOperationalEvent({
      actorEmail: access.auth.email,
      detail: updateError.message || 'Asset review update failed.',
      eventType: 'asset_failure',
      metadata: { action, assetId },
      projectId: asset.project_id,
      severity: 'error',
      sourceRoute: '/api/portal/assets',
      title: 'Asset review could not be saved',
    });

    return NextResponse.json({ error: 'Asset review could not be saved.' }, { status: 500 });
  }

  await logPortalProjectActivity({
    actorEmail: access.auth.email,
    eventType: 'asset_reviewed',
    meta: `${asset.asset_bucket_title} review updated by studio`,
    projectId: asset.project_id,
    sourceRecordId: asset.id,
    sourceTable: 'portal_project_assets',
    supabase,
    title: `${nextState.activityTitle}: ${asset.original_filename}`,
  });

  return NextResponse.json({
    ok: true,
    reviewStatus: nextState.reviewStatus,
    uploadStatus: nextState.uploadStatus,
  });
}
