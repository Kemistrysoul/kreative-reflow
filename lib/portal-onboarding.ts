export const onboardingServiceOptions = [
  'New website / redesign',
  'Custom client portal',
  'Internal dashboard',
  'Booking or payment flow',
  'SEO and visibility',
  'Automation or integrations',
  'Maintenance and support',
];

export const approvalRoleOptions = [
  'Select role...',
  'Owner / Founder',
  'CEO / Managing Director',
  'Marketing Manager',
  'Marketing Lead',
  'Operations Manager',
  'Operations Lead',
  'Project Manager',
  'IT Manager',
  'Finance / Admin',
  'Other',
];

export const audienceTypeOptions = [
  'Select type...',
  'B2B (Business to business)',
  'B2C (Business to consumer)',
  'Both B2B and B2C',
  'Internal / Not applicable',
];

export const brandAssetOptions = [
  'Select status...',
  'Ready to upload',
  'Partly ready',
  'Needs cleanup',
  'Needs to be created',
  'Not sure yet',
];

export const budgetRangeOptions = [
  'Select budget range...',
  'Under R15,000',
  'R15,000 - R30,000',
  'R30,000 - R50,000',
  'R50,000 - R100,000',
  'R100,000+',
  'Not sure yet',
];

export const updateCadenceOptions = [
  'Select update rhythm...',
  'Weekly',
  'Twice weekly',
  'Milestone-only',
  'Only when action is needed',
];

export const communicationChannelOptions = [
  'Select channel...',
  'Portal',
  'Email',
  'WhatsApp',
  'Phone',
  'Video call',
];

export const urgentChannelOptions = [
  'Select urgent channel...',
  'Portal',
  'Email',
  'WhatsApp',
  'Phone',
  'Video call',
];

export const revisionRoundOptions = [
  'Select included rounds...',
  '1 included round',
  '2 included rounds',
  '3 included rounds',
  'Not agreed yet',
];

export const integrationOptions = [
  'CRM (HubSpot, Salesforce, Pipedrive)',
  'Email marketing (Mailchimp, Brevo, Campaign Monitor)',
  'Payment gateway (PayFast, Yoco, Stripe)',
  'Booking system (Calendly, Setmore, Acuity)',
  'Analytics (Google Analytics, GTM, Hotjar)',
  'Accounting (Xero, QuickBooks, Sage)',
  'Storage and docs (Google Drive, Dropbox, OneDrive)',
  'Other',
];

export const onboardingRequirementGroups = [
  {
    title: 'Required before kickoff',
    items: [
      'Project goals',
      'Audience',
      'Services needed',
      'Approval contact',
      'Phone number',
      'Current website',
      'Budget range',
      'Competitors or reference websites',
      'Update rhythm',
      'Scope boundary acknowledgement',
    ],
  },
  {
    title: 'Helpful if available',
    items: [
      'Brand assets',
      'Technical access',
      'Deadline context',
      'Content notes',
      'Decision process',
      'Features and must-haves',
      'Social presence',
      'Tone and style',
      'Previous agency experience',
      'Existing integrations',
      'Missing content owner',
      'Missing access owner',
      'Meeting availability',
    ],
  },
];

export type PortalOnboardingStatus = 'draft' | 'submitted';

export type ParsedPortalOnboardingPayload = {
  projectSlug: string;
  status: PortalOnboardingStatus;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  approvalRole: string;
  audienceType: string;
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
  currentWebsite: string;
  budgetRange: string;
  competitors: string;
  decisionProcess: string;
  specificFeatures: string;
  socialPresence: string;
  toneStylePreferences: string;
  previousAgencyExperience: string;
  existingIntegrations: string[];
  missingContentOwner: string;
  missingContentDueDate: string;
  missingAccessOwner: string;
  missingAccessDueDate: string;
  updateCadence: string;
  preferredUpdateChannel: string;
  urgentChannel: string;
  meetingAvailability: string;
  scopeInclusions: string;
  scopeExclusions: string;
  revisionRounds: string;
  changeRequestAuthority: string;
  scopeBoundaryAccepted: boolean;
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
const budgetRangeOptionSet = new Set(budgetRangeOptions);
const integrationOptionSet = new Set(integrationOptions);
const approvalRoleOptionSet = new Set(approvalRoleOptions);
const audienceTypeOptionSet = new Set(audienceTypeOptions);
const updateCadenceOptionSet = new Set(updateCadenceOptions);
const communicationChannelOptionSet = new Set(communicationChannelOptions);
const urgentChannelOptionSet = new Set(urgentChannelOptions);
const revisionRoundOptionSet = new Set(revisionRoundOptions);

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

function parseIntegrations(value: unknown) {
  if (!Array.isArray(value)) return [];

  return Array.from(
    new Set(
      value
        .map((item) => asLimitedString(item, 120))
        .filter((item) => integrationOptionSet.has(item)),
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

function normalizeOptionalDate(value: unknown) {
  return normalizeDeadline(value);
}

export function validatePortalOnboardingPayload(body: unknown): PortalOnboardingValidationResult {
  if (!isRecord(body)) {
    return { ok: false, error: 'Invalid onboarding payload.' };
  }

  const status = parseStatus(body.status);
  const projectSlug = asLimitedString(body.projectSlug, 120);
  const contactEmail = asLimitedString(body.contactEmail, 180).toLowerCase();
  const brandAssetsStatus = asLimitedString(body.brandAssetsStatus, 80);
  const budgetRange = asLimitedString(body.budgetRange, 80);
  const approvalRole = asLimitedString(body.approvalRole, 120);
  const audienceType = asLimitedString(body.audienceType, 80);
  const updateCadence = asLimitedString(body.updateCadence, 80);
  const preferredUpdateChannel = asLimitedString(body.preferredUpdateChannel, 80);
  const urgentChannel = asLimitedString(body.urgentChannel, 80);
  const revisionRounds = asLimitedString(body.revisionRounds, 80);
  const payload: ParsedPortalOnboardingPayload = {
    projectSlug,
    status,
    contactName: asLimitedString(body.contactName, 120),
    contactEmail,
    contactPhone: asLimitedString(body.contactPhone, 40),
    approvalRole: approvalRoleOptionSet.has(approvalRole) && approvalRole !== approvalRoleOptions[0]
      ? approvalRole
      : '',
    audienceType: audienceTypeOptionSet.has(audienceType) && audienceType !== audienceTypeOptions[0]
      ? audienceType
      : '',
    projectGoals: asLimitedString(body.projectGoals, 2500),
    primaryAudience: asLimitedString(body.primaryAudience, 1500),
    services: parseServices(body.services),
    accessNeeds: asLimitedString(body.accessNeeds, 1800),
    brandAssetsStatus: brandAssetOptionSet.has(brandAssetsStatus) && brandAssetsStatus !== brandAssetOptions[0]
      ? brandAssetsStatus
      : brandAssetOptions[brandAssetOptions.length - 1],
    technicalAccounts: asLimitedString(body.technicalAccounts, 1800),
    preferredDeadline: normalizeDeadline(body.preferredDeadline),
    launchConstraints: asLimitedString(body.launchConstraints, 1500),
    contentNotes: asLimitedString(body.contentNotes, 1800),
    consentToTerms: asBoolean(body.consentToTerms),
    currentWebsite: asLimitedString(body.currentWebsite, 500),
    budgetRange: budgetRangeOptionSet.has(budgetRange) && budgetRange !== budgetRangeOptions[0]
      ? budgetRange
      : '',
    competitors: asLimitedString(body.competitors, 2500),
    decisionProcess: asLimitedString(body.decisionProcess, 1200),
    specificFeatures: asLimitedString(body.specificFeatures, 2500),
    socialPresence: asLimitedString(body.socialPresence, 1500),
    toneStylePreferences: asLimitedString(body.toneStylePreferences, 1200),
    previousAgencyExperience: asLimitedString(body.previousAgencyExperience, 1500),
    existingIntegrations: parseIntegrations(body.existingIntegrations),
    missingContentOwner: asLimitedString(body.missingContentOwner, 180),
    missingContentDueDate: normalizeOptionalDate(body.missingContentDueDate),
    missingAccessOwner: asLimitedString(body.missingAccessOwner, 180),
    missingAccessDueDate: normalizeOptionalDate(body.missingAccessDueDate),
    updateCadence: updateCadenceOptionSet.has(updateCadence) && updateCadence !== updateCadenceOptions[0]
      ? updateCadence
      : '',
    preferredUpdateChannel:
      communicationChannelOptionSet.has(preferredUpdateChannel) && preferredUpdateChannel !== communicationChannelOptions[0]
        ? preferredUpdateChannel
        : '',
    urgentChannel: urgentChannelOptionSet.has(urgentChannel) && urgentChannel !== urgentChannelOptions[0]
      ? urgentChannel
      : '',
    meetingAvailability: asLimitedString(body.meetingAvailability, 1200),
    scopeInclusions: asLimitedString(body.scopeInclusions, 1800),
    scopeExclusions: asLimitedString(body.scopeExclusions, 1800),
    revisionRounds: revisionRoundOptionSet.has(revisionRounds) && revisionRounds !== revisionRoundOptions[0]
      ? revisionRounds
      : '',
    changeRequestAuthority: asLimitedString(body.changeRequestAuthority, 500),
    scopeBoundaryAccepted: asBoolean(body.scopeBoundaryAccepted),
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
      !payload.contactPhone ||
      !payload.approvalRole ||
      !payload.audienceType ||
      !payload.projectGoals ||
      !payload.primaryAudience ||
      !payload.preferredDeadline ||
      !payload.services.length ||
      !payload.consentToTerms ||
      !payload.currentWebsite ||
      !payload.budgetRange ||
      !payload.competitors ||
      !payload.updateCadence ||
      !payload.preferredUpdateChannel ||
      !payload.urgentChannel ||
      !payload.revisionRounds ||
      !payload.changeRequestAuthority ||
      !payload.scopeBoundaryAccepted
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
