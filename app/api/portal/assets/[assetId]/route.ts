import { NextRequest, NextResponse } from 'next/server';
import { getPortalAccess, getStudioAccess } from '@/lib/portal-access';
import { recordPortalOperationalEvent } from '@/lib/portal-monitoring';
import { getPortalSupabaseClient, type PortalSupabaseClient } from '@/lib/portal-supabase';

type AssetRouteContext = {
  params: Promise<{
    assetId?: string;
  }>;
};

type PortalAssetAccessRow = {
  id: string;
  project_id: string;
  bucket_id: string;
  storage_path: string;
  asset_bucket_title: string;
  original_filename: string;
  portal_projects:
    | {
        slug: string;
      }
    | {
        slug: string;
      }[]
    | null;
};

function hasSameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (!origin) return true;

  return origin === new URL(request.url).origin;
}

function getProject(row: PortalAssetAccessRow) {
  if (Array.isArray(row.portal_projects)) {
    return row.portal_projects[0] ?? null;
  }

  return row.portal_projects;
}

async function getAssetForAccess(supabase: PortalSupabaseClient, assetId: string) {
  const { data, error } = await supabase
    .from('portal_project_assets')
    .select('id,project_id,bucket_id,storage_path,asset_bucket_title,original_filename,portal_projects!inner(slug)')
    .eq('id', assetId)
    .maybeSingle<PortalAssetAccessRow>();

  if (error || !data) {
    return null;
  }

  return data;
}

async function logAssetActivity({
  meta,
  projectId,
  supabase,
  title,
}: {
  meta: string;
  projectId: string;
  supabase: PortalSupabaseClient;
  title: string;
}) {
  await supabase.from('portal_project_activity').insert({
    project_id: projectId,
    occurred_at: new Date().toISOString(),
    display_time: 'Just now',
    title,
    meta,
    sort_order: 0,
  });
}

function encodeDispositionFileName(fileName: string) {
  return fileName.replace(/[^\w .()-]/g, '-').trim() || 'client-asset';
}

export async function GET(_request: NextRequest, context: AssetRouteContext) {
  const { assetId = '' } = await context.params;

  if (!assetId) {
    return NextResponse.json({ error: 'Asset id is required.' }, { status: 400 });
  }

  const supabase = getPortalSupabaseClient();

  if (!supabase) {
    await recordPortalOperationalEvent({
      detail: 'Client asset download reached the API, but Supabase Storage is not configured.',
      eventType: 'asset_failure',
      metadata: { assetId },
      severity: 'error',
      sourceRoute: '/api/portal/assets/[assetId]',
      title: 'Asset download blocked by missing storage config',
    });

    return NextResponse.json({ error: 'Supabase Storage is not configured.' }, { status: 503 });
  }

  const asset = await getAssetForAccess(supabase, assetId);
  const project = asset ? getProject(asset) : null;

  if (!asset || !project?.slug) {
    return NextResponse.json({ error: 'Asset could not be found.' }, { status: 404 });
  }

  const access = await getPortalAccess(project.slug);

  if (access.status === 'missing-config') {
    await recordPortalOperationalEvent({
      detail: 'Client asset download could not check portal access because Supabase Auth is not configured.',
      eventType: 'auth_failure',
      metadata: { assetId, projectSlug: project.slug },
      projectId: asset.project_id,
      severity: 'error',
      sourceRoute: '/api/portal/assets/[assetId]',
      title: 'Asset download blocked by missing auth config',
    });

    return NextResponse.json({ error: 'Supabase Auth is not configured.' }, { status: 503 });
  }

  if (access.status === 'unauthenticated') {
    return NextResponse.json({ error: 'Portal authentication is required.' }, { status: 401 });
  }

  if (access.status !== 'authorized') {
    return NextResponse.json({ error: access.message }, { status: access.status === 'expired' ? 410 : 403 });
  }

  const { data, error } = await supabase.storage
    .from(asset.bucket_id)
    .createSignedUrl(asset.storage_path, 60, {
      download: encodeDispositionFileName(asset.original_filename),
    });

  if (error || !data?.signedUrl) {
    await recordPortalOperationalEvent({
      actorEmail: access.auth.email,
      detail: error?.message || 'Supabase Storage did not return a signed asset download URL.',
      eventType: 'asset_failure',
      metadata: { assetId, bucketId: asset.bucket_id, projectSlug: project.slug },
      projectId: asset.project_id,
      severity: 'error',
      sourceRoute: '/api/portal/assets/[assetId]',
      title: 'Asset download signed URL failed',
    });

    return NextResponse.json({ error: 'Asset download could not be prepared.' }, { status: 500 });
  }

  await logAssetActivity({
    supabase,
    projectId: asset.project_id,
    title: `Asset downloaded: ${asset.original_filename}`,
    meta: `${asset.asset_bucket_title} opened by ${access.auth.email}`,
  });

  return NextResponse.redirect(data.signedUrl);
}

export async function DELETE(request: NextRequest, context: AssetRouteContext) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: 'Invalid asset delete origin.' }, { status: 403 });
  }

  const { assetId = '' } = await context.params;

  if (!assetId) {
    return NextResponse.json({ error: 'Asset id is required.' }, { status: 400 });
  }

  const studioAccess = await getStudioAccess();

  if (studioAccess.status === 'missing-config') {
    await recordPortalOperationalEvent({
      detail: 'Studio asset delete could not check access because Supabase Auth is not configured.',
      eventType: 'auth_failure',
      metadata: { assetId },
      severity: 'error',
      sourceRoute: '/api/portal/assets/[assetId]',
      title: 'Asset delete blocked by missing auth config',
    });

    return NextResponse.json({ error: 'Supabase Auth is not configured.' }, { status: 503 });
  }

  if (studioAccess.status === 'unauthenticated') {
    return NextResponse.json({ error: 'Studio authentication is required.' }, { status: 401 });
  }

  if (studioAccess.status !== 'authorized') {
    return NextResponse.json(
      { error: studioAccess.message },
      { status: studioAccess.status === 'expired' ? 410 : 403 },
    );
  }

  const supabase = getPortalSupabaseClient();

  if (!supabase) {
    await recordPortalOperationalEvent({
      actorEmail: studioAccess.auth.email,
      detail: 'Studio asset delete reached the API, but Supabase Storage/project data is not configured.',
      eventType: 'asset_failure',
      metadata: { assetId },
      severity: 'error',
      sourceRoute: '/api/portal/assets/[assetId]',
      title: 'Asset delete blocked by missing storage config',
    });

    return NextResponse.json({ error: 'Supabase Storage is not configured.' }, { status: 503 });
  }

  const asset = await getAssetForAccess(supabase, assetId);

  if (!asset) {
    return NextResponse.json({ error: 'Asset could not be found.' }, { status: 404 });
  }

  if (!studioAccess.projectIds.includes(asset.project_id)) {
    return NextResponse.json({ error: 'This studio account cannot delete that project asset.' }, { status: 403 });
  }

  const { error: removeError } = await supabase.storage.from(asset.bucket_id).remove([asset.storage_path]);

  if (removeError) {
    await recordPortalOperationalEvent({
      actorEmail: studioAccess.auth.email,
      detail: removeError.message || 'Supabase Storage failed to remove the client asset.',
      eventType: 'asset_failure',
      metadata: { assetId, bucketId: asset.bucket_id },
      projectId: asset.project_id,
      severity: 'error',
      sourceRoute: '/api/portal/assets/[assetId]',
      title: 'Asset file could not be deleted',
    });

    return NextResponse.json({ error: 'Asset file could not be deleted.' }, { status: 500 });
  }

  const { error: deleteError } = await supabase
    .from('portal_project_assets')
    .delete()
    .eq('id', asset.id);

  if (deleteError) {
    await recordPortalOperationalEvent({
      actorEmail: studioAccess.auth.email,
      detail: deleteError.message || 'Asset metadata delete failed after file removal.',
      eventType: 'asset_failure',
      metadata: { assetId, bucketId: asset.bucket_id },
      projectId: asset.project_id,
      severity: 'error',
      sourceRoute: '/api/portal/assets/[assetId]',
      title: 'Asset metadata could not be deleted',
    });

    return NextResponse.json({ error: 'Asset metadata could not be deleted.' }, { status: 500 });
  }

  const { data: bucketRow } = await supabase
    .from('portal_project_asset_buckets')
    .select('id,file_count')
    .eq('project_id', asset.project_id)
    .eq('title', asset.asset_bucket_title)
    .maybeSingle<{ id: string; file_count: number | null }>();

  if (bucketRow) {
    await supabase
      .from('portal_project_asset_buckets')
      .update({
        file_count: Math.max((bucketRow.file_count ?? 1) - 1, 0),
        updated_at: new Date().toISOString(),
      })
      .eq('id', bucketRow.id);
  }

  await logAssetActivity({
    supabase,
    projectId: asset.project_id,
    title: `Asset deleted: ${asset.original_filename}`,
    meta: `${asset.asset_bucket_title} removed by studio`,
  });

  return NextResponse.json({ ok: true });
}
