export const PORTAL_ASSET_MAX_BYTES = 10 * 1024 * 1024;

export type PortalAssetCategoryId =
  | 'logo-files'
  | 'brand-assets'
  | 'photos-images'
  | 'written-content'
  | 'legal-documents'
  | 'other';

export type PortalAssetCategory = {
  id: PortalAssetCategoryId;
  title: string;
  helper: string;
  allowedMimeTypes: string[];
  allowedExtensions: string[];
};

export const portalAssetCategories = [
  {
    id: 'logo-files',
    title: 'Logo Files',
    helper: 'SVG, PNG, JPG, WebP, AI, EPS, or PDF logo files.',
    allowedMimeTypes: [
      'application/illustrator',
      'application/pdf',
      'application/postscript',
      'image/jpeg',
      'image/png',
      'image/svg+xml',
      'image/webp',
    ],
    allowedExtensions: ['.ai', '.eps', '.jpg', '.jpeg', '.pdf', '.png', '.svg', '.webp'],
  },
  {
    id: 'brand-assets',
    title: 'Brand Assets',
    helper: 'Brand guides, palettes, font references, and packaged brand files.',
    allowedMimeTypes: [
      'application/pdf',
      'application/postscript',
      'application/zip',
      'image/jpeg',
      'image/png',
      'image/svg+xml',
      'image/webp',
    ],
    allowedExtensions: ['.ai', '.eps', '.jpg', '.jpeg', '.pdf', '.png', '.svg', '.webp', '.zip'],
  },
  {
    id: 'photos-images',
    title: 'Photos & Images',
    helper: 'Team, office, product, proof, and case-study images.',
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
  },
  {
    id: 'written-content',
    title: 'Written Content',
    helper: 'Copy, bios, FAQs, service notes, spreadsheets, and planning docs.',
    allowedMimeTypes: [
      'application/msword',
      'application/pdf',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/csv',
      'text/plain',
    ],
    allowedExtensions: ['.csv', '.doc', '.docx', '.pdf', '.txt', '.xls', '.xlsx'],
  },
  {
    id: 'legal-documents',
    title: 'Legal Documents',
    helper: 'Licences, policies, compliance notes, and approval documents.',
    allowedMimeTypes: [
      'application/msword',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ],
    allowedExtensions: ['.doc', '.docx', '.pdf', '.txt'],
  },
  {
    id: 'other',
    title: 'Other',
    helper: 'Miscellaneous project files that do not fit another bucket.',
    allowedMimeTypes: [
      'application/msword',
      'application/pdf',
      'application/vnd.ms-excel',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip',
      'image/jpeg',
      'image/png',
      'image/svg+xml',
      'image/webp',
      'text/csv',
      'text/plain',
    ],
    allowedExtensions: [
      '.csv',
      '.doc',
      '.docx',
      '.jpg',
      '.jpeg',
      '.pdf',
      '.png',
      '.ppt',
      '.pptx',
      '.svg',
      '.txt',
      '.webp',
      '.xls',
      '.xlsx',
      '.zip',
    ],
  },
] satisfies PortalAssetCategory[];

export function getPortalAssetCategory(value: string | null | undefined) {
  return portalAssetCategories.find((category) => category.id === value) ?? null;
}

export function getPortalAssetCategoryByTitle(title: string) {
  return (
    portalAssetCategories.find((category) => category.title.toLowerCase() === title.toLowerCase()) ??
    portalAssetCategories.find((category) => category.id === 'other') ??
    portalAssetCategories[0]
  );
}

export function getPortalAssetAccept(categoryId: PortalAssetCategoryId) {
  const category = getPortalAssetCategory(categoryId);

  if (!category) {
    return '';
  }

  return [...category.allowedMimeTypes, ...category.allowedExtensions].join(',');
}

export function formatPortalFileSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 KB';
  }

  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function getPortalFileExtension(fileName: string) {
  const match = fileName.toLowerCase().match(/\.[a-z0-9]+$/);

  return match?.[0] ?? '';
}

export function validatePortalAssetFileInput({
  categoryId,
  fileName,
  fileSize,
  fileType,
}: {
  categoryId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}) {
  const category = getPortalAssetCategory(categoryId);

  if (!category) {
    return { ok: false as const, error: 'Choose a valid asset bucket.' };
  }

  if (!fileName.trim()) {
    return { ok: false as const, error: 'Choose a file before uploading.' };
  }

  if (!fileSize || fileSize <= 0) {
    return { ok: false as const, error: 'This file is empty.' };
  }

  if (fileSize > PORTAL_ASSET_MAX_BYTES) {
    return {
      ok: false as const,
      error: `Files must be ${formatPortalFileSize(PORTAL_ASSET_MAX_BYTES)} or smaller.`,
    };
  }

  const extension = getPortalFileExtension(fileName);
  const normalizedType = fileType.toLowerCase();
  const mimeAllowed = normalizedType ? category.allowedMimeTypes.includes(normalizedType) : false;
  const extensionAllowed = extension ? category.allowedExtensions.includes(extension) : false;

  if (!mimeAllowed && !extensionAllowed) {
    return {
      ok: false as const,
      error: `${category.title} accepts: ${category.allowedExtensions.join(', ')}.`,
    };
  }

  return { ok: true as const, category };
}
