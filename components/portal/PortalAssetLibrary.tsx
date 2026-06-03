'use client';

import { ChangeEvent, KeyboardEvent, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Download, FileText, Loader2, UploadCloud } from 'lucide-react';
import type { AssetBucket } from '@/lib/dashboard-data';
import {
  formatPortalFileSize,
  getPortalAssetAccept,
  getPortalAssetCategoryByTitle,
  PORTAL_ASSET_MAX_BYTES,
  validatePortalAssetFileInput,
} from '@/lib/portal-asset-config';
import type { PortalProjectAsset } from '@/lib/portal-assets';

type PortalAssetLibraryProps = {
  assetBuckets: AssetBucket[];
  assets: PortalProjectAsset[];
  canUpload: boolean;
  projectSlug: string;
};

type UploadState = {
  categoryTitle: string;
  message: string;
  status: 'error' | 'success';
};

type UploadResponse = {
  ok?: boolean;
  error?: string;
  asset?: {
    categoryTitle: string;
    fileName: string;
    reviewStatus: PortalProjectAsset['reviewStatus'];
    sizeLabel: string;
    uploadStatus: PortalProjectAsset['uploadStatus'];
  };
};

function openFileInputFromKey(event: KeyboardEvent<HTMLLabelElement>, inputId: string, enabled: boolean) {
  if (!enabled || (event.key !== 'Enter' && event.key !== ' ')) {
    return;
  }

  event.preventDefault();
  document.getElementById(inputId)?.click();
}

const statusLabel = {
  accepted: 'Accepted',
  needs_replacement: 'Needs replacement',
  quarantined: 'Quarantined',
  received: 'Received',
};

const reviewLabel = {
  approved: 'Approved',
  pending_review: 'Pending review',
  rejected: 'Rejected',
};

export function PortalAssetLibrary({
  assetBuckets,
  assets,
  canUpload,
  projectSlug,
}: PortalAssetLibraryProps) {
  const [uploadingCategory, setUploadingCategory] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<UploadState | null>(null);
  const recentAssets = useMemo(() => assets.slice(0, 4), [assets]);

  async function uploadAsset(event: ChangeEvent<HTMLInputElement>, categoryTitle: string) {
    const file = event.target.files?.[0] ?? null;
    event.target.value = '';

    if (!file) return;

    const category = getPortalAssetCategoryByTitle(categoryTitle);
    const validation = validatePortalAssetFileInput({
      categoryId: category.id,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

    if (!validation.ok) {
      setUploadState({
        categoryTitle,
        message: validation.error,
        status: 'error',
      });
      return;
    }

    const formData = new FormData();
    formData.set('projectSlug', projectSlug);
    formData.set('category', category.id);
    formData.set('file', file);

    setUploadingCategory(category.id);
    setUploadState(null);

    try {
      const response = await fetch('/api/portal/assets', {
        method: 'POST',
        credentials: 'same-origin',
        body: formData,
      });
      const payload = (await response.json()) as UploadResponse;

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || 'Asset could not be uploaded.');
      }

      setUploadState({
        categoryTitle,
        message: `${payload.asset?.fileName ?? file.name} uploaded for studio review.`,
        status: 'success',
      });
    } catch (uploadError) {
      setUploadState({
        categoryTitle,
        message: uploadError instanceof Error ? uploadError.message : 'Asset could not be uploaded.',
        status: 'error',
      });
    } finally {
      setUploadingCategory(null);
    }
  }

  return (
    <div className="rounded-lg border border-white/10 bg-[#181818] p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <UploadCloud className="h-5 w-5 text-[#FC6E20]" />
          <h2 className="font-playfair text-3xl font-bold text-white">Asset Library</h2>
        </div>
        <span className="font-montserrat text-xs uppercase tracking-[0.18em] text-stone-500">
          {formatPortalFileSize(PORTAL_ASSET_MAX_BYTES)} file cap
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {assetBuckets.map((bucket) => {
          const category = getPortalAssetCategoryByTitle(bucket.title);
          const uploading = uploadingCategory === category.id;
          const inputId = `portal-asset-${category.id}`;

          return (
            <article key={bucket.title} className="rounded-lg border border-white/10 bg-black/20 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-montserrat text-sm font-semibold text-white">{bucket.title}</h3>
                  <p className="mt-1 font-montserrat text-xs leading-5 text-stone-500">{bucket.detail}</p>
                </div>
                <span className="font-mono text-sm text-[#FC6E20]">{bucket.files}</span>
              </div>
              <p className="mt-3 min-h-10 font-montserrat text-xs leading-5 text-stone-500">
                {category.helper}
              </p>
              <div className="mt-4">
                <input
                  id={inputId}
                  type="file"
                  accept={getPortalAssetAccept(category.id)}
                  disabled={!canUpload || uploading}
                  onChange={(event) => void uploadAsset(event, bucket.title)}
                  className="hidden"
                />
                <label
                  htmlFor={inputId}
                  aria-disabled={!canUpload || uploading}
                  tabIndex={canUpload && !uploading ? 0 : -1}
                  onKeyDown={(event) => openFileInputFromKey(event, inputId, canUpload && !uploading)}
                  className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-white/10 px-4 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-stone-100 transition-colors hover:border-[#FC6E20] hover:text-[#FC6E20] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FC6E20] aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                  Upload
                </label>
              </div>
            </article>
          );
        })}
      </div>

      {!canUpload ? (
        <p className="mt-5 rounded-lg border border-white/10 bg-black/20 p-4 font-montserrat text-sm leading-6 text-stone-400">
          Your current portal role is read-only for asset uploads.
        </p>
      ) : null}

      {uploadState ? (
        <p
          className={`mt-5 flex items-start gap-3 rounded-lg border p-4 font-montserrat text-sm leading-6 ${
            uploadState.status === 'success'
              ? 'border-[#FC6E20]/25 bg-[#FC6E20]/10 text-stone-100'
              : 'border-red-400/25 bg-red-400/10 text-red-100'
          }`}
        >
          {uploadState.status === 'success' ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#FC6E20]" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          )}
          <span>
            <strong className="font-semibold">{uploadState.categoryTitle}:</strong> {uploadState.message}
          </span>
        </p>
      ) : null}

      {recentAssets.length ? (
        <div className="mt-6 border-t border-white/10 pt-5">
          <div className="mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#FC6E20]" />
            <p className="font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
              Recent uploads
            </p>
          </div>
          <div className="grid gap-3">
            {recentAssets.map((asset) => (
              <div
                key={asset.id}
                className="grid gap-3 rounded-lg border border-white/10 bg-black/20 p-3 sm:grid-cols-[1fr_auto]"
              >
                <div className="min-w-0">
                  <p className="truncate font-montserrat text-sm font-semibold text-white">{asset.fileName}</p>
                  <p className="mt-1 font-montserrat text-xs text-stone-500">
                    {asset.categoryTitle} - {asset.sizeLabel} - {asset.uploadedAt}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <a
                    href={`/api/portal/assets/${asset.id}`}
                    className="inline-flex min-h-8 items-center justify-center gap-1 rounded-full border border-white/10 px-3 font-montserrat text-[10px] font-bold uppercase tracking-[0.12em] text-stone-100 transition-colors hover:border-[#FC6E20] hover:text-[#FC6E20] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FC6E20]"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </a>
                  <span className="rounded-full border border-white/10 px-3 py-1 font-montserrat text-[10px] uppercase tracking-[0.12em] text-stone-400">
                    {statusLabel[asset.uploadStatus]}
                  </span>
                  <span className="rounded-full border border-[#FC6E20]/30 bg-[#FC6E20]/10 px-3 py-1 font-montserrat text-[10px] uppercase tracking-[0.12em] text-[#FC6E20]">
                    {reviewLabel[asset.reviewStatus]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
