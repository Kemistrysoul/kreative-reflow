export const onboardingServiceOptions = [
  'New website / redesign',
  'Custom client portal',
  'Internal dashboard',
  'Booking or payment flow',
  'SEO and visibility',
  'Automation or integrations',
  'Maintenance and support',
];

export const brandAssetOptions = [
  'Ready to upload',
  'Partly ready',
  'Needs cleanup',
  'Needs to be created',
  'Not sure yet',
];

export const onboardingRequirementGroups = [
  {
    title: 'Required before kickoff',
    items: ['Project goals', 'Audience', 'Services needed', 'Approval contact'],
  },
  {
    title: 'Helpful if available',
    items: ['Brand assets', 'Technical access', 'Deadline context', 'Content notes'],
  },
];

export type PortalOnboardingStatus = 'draft' | 'submitted';

export type ParsedPortalOnboardingPayload = {
  projectSlug: string;
  status: PortalOnboardingStatus;
  contactName: string;
  contactEmail: string;
  approvalRole: string;
  projectGoals: string;
  primaryAudience: string;
  services: string[];
  accessNeeds: string;
  brandAssetsStatus: string;
  technicalAccounts: string;
  preferredDeadline: string;
  launchConstraints: string;
  contentNotes: string;
  consentToTerms: boolean;
};

type PortalOnboardingValidationResult =
  | {
      ok: true;
      payload: ParsedPortalOnboardingPayload;
      honeypotTriggered: boolean;
    }
  | {
      ok: false;
      error: string;
    };

const serviceOptionSet = new Set(onboardingServiceOptions);
const brandAssetOptionSet = new Set(brandAssetOptions);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asLimitedString(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

function asBoolean(value: unknown) {
  return value === true;
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function parseServices(value: unknown) {
  if (!Array.isArray(value)) return [];

  return Array.from(
    new Set(
      value
        .map((item) => asLimitedString(item, 80))
        .filter((item) => serviceOptionSet.has(item)),
    ),
  );
}

function parseStatus(value: unknown): PortalOnboardingStatus {
  return value === 'submitted' ? 'submitted' : 'draft';
}

function normalizeDeadline(value: unknown) {
  const deadline = asLimitedString(value, 10);
  if (!deadline) return '';

  return /^\d{4}-\d{2}-\d{2}$/.test(deadline) ? deadline : '';
}

export function validatePortalOnboardingPayload(body: unknown): PortalOnboardingValidationResult {
  if (!isRecord(body)) {
    return { ok: false, error: 'Invalid onboarding payload.' };
  }

  const status = parseStatus(body.status);
  const projectSlug = asLimitedString(body.projectSlug, 120);
  const contactEmail = asLimitedString(body.contactEmail, 180).toLowerCase();
  const brandAssetsStatus = asLimitedString(body.brandAssetsStatus, 80);
  const payload: ParsedPortalOnboardingPayload = {
    projectSlug,
    status,
    contactName: asLimitedString(body.contactName, 120),
    contactEmail,
    approvalRole: asLimitedString(body.approvalRole, 120),
    projectGoals: asLimitedString(body.projectGoals, 2500),
    primaryAudience: asLimitedString(body.primaryAudience, 1500),
    services: parseServices(body.services),
    accessNeeds: asLimitedString(body.accessNeeds, 1800),
    brandAssetsStatus: brandAssetOptionSet.has(brandAssetsStatus)
      ? brandAssetsStatus
      : brandAssetOptions[brandAssetOptions.length - 1],
    technicalAccounts: asLimitedString(body.technicalAccounts, 1800),
    preferredDeadline: normalizeDeadline(body.preferredDeadline),
    launchConstraints: asLimitedString(body.launchConstraints, 1500),
    contentNotes: asLimitedString(body.contentNotes, 1800),
    consentToTerms: asBoolean(body.consentToTerms),
  };

  if (!payload.projectSlug) {
    return { ok: false, error: 'Missing project reference.' };
  }

  if (!isEmail(payload.contactEmail)) {
    return { ok: false, error: 'Enter a valid approval contact email.' };
  }

  if (status === 'submitted') {
    if (
      !payload.contactName ||
      !payload.approvalRole ||
      !payload.projectGoals ||
      !payload.primaryAudience ||
      !payload.preferredDeadline ||
      !payload.services.length ||
      !payload.consentToTerms
    ) {
      return {
        ok: false,
        error: 'Complete the required onboarding fields before submitting.',
      };
    }
  }

  return {
    ok: true,
    payload,
    honeypotTriggered: asLimitedString(body.website, 200).length > 0,
  };
}
