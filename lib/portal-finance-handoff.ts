import 'server-only';
import { defaultPortalProjectSlug, getPortalSupabaseClient } from '@/lib/portal-supabase';

export type PortalInvoiceStatus = 'cancelled' | 'draft' | 'due' | 'overdue' | 'paid' | 'waiting';
export type PortalHandoffCategory = 'credentials' | 'final_assets' | 'launch' | 'support';
export type PortalHandoffStatus = 'blocked' | 'done' | 'in_progress' | 'not_started' | 'waiting_client';
export type PortalSupportStatus = 'active' | 'available' | 'declined' | 'recommended' | 'scheduled';

export type PortalProjectInvoice = {
  id: string;
  projectSlug: string;
  projectName: string;
  clientName: string;
  invoiceNumber: string;
  label: string;
  status: PortalInvoiceStatus;
  amountLabel: string;
  issuedDate: string;
  dueDate: string;
  paidDate: string;
  paymentReference: string;
  paymentLinkLabel: string;
  paymentUrl: string;
  clientNote: string;
  internalNote: string;
  source: 'demo' | 'supabase';
};

export type PortalProjectHandoffItem = {
  id: string;
  projectSlug: string;
  projectName: string;
  clientName: string;
  category: PortalHandoffCategory;
  title: string;
  detail: string;
  status: PortalHandoffStatus;
  ownerName: string;
  ownerRole: string;
  dueDate: string;
  completedAt: string;
  clientNote: string;
  internalNote: string;
  source: 'demo' | 'supabase';
};

export type PortalProjectSupportNextStep = {
  id: string;
  projectSlug: string;
  projectName: string;
  clientName: string;
  title: string;
  description: string;
  status: PortalSupportStatus;
  startsOn: string;
  cadence: string;
  ownerName: string;
  clientNote: string;
  internalNote: string;
  source: 'demo' | 'supabase';
};

export type PortalFinanceHandoffData = {
  handoffItems: PortalProjectHandoffItem[];
  invoices: PortalProjectInvoice[];
  supportNextSteps: PortalProjectSupportNextStep[];
};

type ProjectRelation = {
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
};

type ProjectScopedRow = {
  portal_projects: ProjectRelation | ProjectRelation[] | null;
};

type PortalInvoiceRow = ProjectScopedRow & {
  id: string;
  invoice_number: string;
  label: string;
  status: PortalInvoiceStatus;
  amount_label: string;
  issued_on: string | null;
  due_on: string | null;
  paid_on: string | null;
  payment_reference: string;
  payment_link_label: string;
  payment_url: string | null;
  client_note: string;
  internal_note?: string;
};

type PortalHandoffRow = ProjectScopedRow & {
  id: string;
  category: PortalHandoffCategory;
  title: string;
  detail: string;
  status: PortalHandoffStatus;
  owner_name: string;
  owner_role: string;
  due_on: string | null;
  completed_at: string | null;
  client_note: string;
  internal_note?: string;
};

type PortalSupportRow = ProjectScopedRow & {
  id: string;
  title: string;
  description: string;
  status: PortalSupportStatus;
  starts_on: string | null;
  cadence: string;
  owner_name: string;
  client_note: string;
  internal_note?: string;
};

const demoProject = {
  clientName: 'ABC Engineering',
  projectName: 'Website Redesign',
  projectSlug: defaultPortalProjectSlug,
} as const;

const emptyFinanceHandoffData: PortalFinanceHandoffData = {
  handoffItems: [],
  invoices: [],
  supportNextSteps: [],
};

const demoFinanceHandoffData: PortalFinanceHandoffData = {
  invoices: [
    {
      id: 'demo-invoice-deposit',
      ...demoProject,
      invoiceNumber: 'INV-007',
      label: 'Project deposit',
      status: 'paid',
      amountLabel: 'R18,000',
      issuedDate: '15 May 2026',
      dueDate: '18 May 2026',
      paidDate: '16 May 2026',
      paymentReference: 'ABC-DEP-007',
      paymentLinkLabel: 'Reference used on proof of payment',
      paymentUrl: '',
      clientNote: 'Deposit received. No further client action is needed for this invoice.',
      internalNote: 'Confirmed against bank statement. Do not expose bank detail in portal.',
      source: 'demo',
    },
    {
      id: 'demo-invoice-design',
      ...demoProject,
      invoiceNumber: 'INV-008',
      label: 'Design milestone',
      status: 'due',
      amountLabel: 'R12,000',
      issuedDate: '30 May 2026',
      dueDate: '3 June 2026',
      paidDate: 'Not paid',
      paymentReference: 'ABC-DES-008',
      paymentLinkLabel: 'Use this EFT reference when paying',
      paymentUrl: '',
      clientNote: 'Due after homepage concept approval. Upload proof of payment through the agreed channel.',
      internalNote: 'Watch before development sprint opens.',
      source: 'demo',
    },
  ],
  handoffItems: [
    {
      id: 'demo-handoff-qa',
      ...demoProject,
      category: 'launch',
      title: 'Launch QA checklist',
      detail: 'Responsive checks, form tests, analytics checks, redirects, and content proofing before launch.',
      status: 'in_progress',
      ownerName: 'Kreative Reflow',
      ownerRole: 'Studio',
      dueDate: '28 June 2026',
      completedAt: 'Not completed',
      clientNote: 'The studio is preparing launch QA before the final handoff.',
      internalNote: 'Track browser/device coverage internally.',
      source: 'demo',
    },
    {
      id: 'demo-handoff-access',
      ...demoProject,
      category: 'credentials',
      title: 'DNS and hosting access confirmed',
      detail: 'Confirm account ownership, invite the studio where needed, and avoid sharing passwords in the portal.',
      status: 'waiting_client',
      ownerName: 'ABC Engineering',
      ownerRole: 'Client owner',
      dueDate: '10 June 2026',
      completedAt: 'Not completed',
      clientNote: 'Invite access where needed. Do not paste passwords into portal notes.',
      internalNote: 'Need analytics and hosting access before QA.',
      source: 'demo',
    },
  ],
  supportNextSteps: [
    {
      id: 'demo-support-window',
      ...demoProject,
      title: '30-day post-launch support window',
      description: 'Bug fixes, small launch snags, and handoff questions after the site goes live.',
      status: 'scheduled',
      startsOn: '10 July 2026',
      cadence: '30 days',
      ownerName: 'Kreative Reflow',
      clientNote: 'Included support window starts after launch.',
      internalNote: 'Scope: launch snags only.',
      source: 'demo',
    },
  ],
};

function formatDate(value: string | null, fallback = 'Not set') {
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

function formatDateTime(value: string | null, fallback = 'Not completed') {
  if (!value) return fallback;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return new Intl.DateTimeFormat('en-ZA', {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function getProject(row: ProjectScopedRow) {
  if (Array.isArray(row.portal_projects)) {
    return row.portal_projects[0] ?? null;
  }

  return row.portal_projects;
}

function getClientName(row: ProjectScopedRow) {
  const project = getProject(row);

  if (Array.isArray(project?.portal_clients)) {
    return project.portal_clients[0]?.name || 'Unknown client';
  }

  return project?.portal_clients?.name || 'Unknown client';
}

function getProjectScope(row: ProjectScopedRow) {
  const project = getProject(row);

  return {
    clientName: getClientName(row),
    projectName: project?.project_name || 'Unknown project',
    projectSlug: project?.slug || defaultPortalProjectSlug,
  };
}

function mapInvoice(row: PortalInvoiceRow): PortalProjectInvoice {
  return {
    id: row.id,
    ...getProjectScope(row),
    invoiceNumber: row.invoice_number,
    label: row.label,
    status: row.status,
    amountLabel: row.amount_label,
    issuedDate: formatDate(row.issued_on),
    dueDate: formatDate(row.due_on),
    paidDate: formatDate(row.paid_on, 'Not paid'),
    paymentReference: row.payment_reference,
    paymentLinkLabel: row.payment_link_label,
    paymentUrl: row.payment_url ?? '',
    clientNote: row.client_note,
    internalNote: row.internal_note ?? '',
    source: 'supabase',
  };
}

function mapHandoffItem(row: PortalHandoffRow): PortalProjectHandoffItem {
  return {
    id: row.id,
    ...getProjectScope(row),
    category: row.category,
    title: row.title,
    detail: row.detail,
    status: row.status,
    ownerName: row.owner_name,
    ownerRole: row.owner_role,
    dueDate: formatDate(row.due_on),
    completedAt: formatDateTime(row.completed_at),
    clientNote: row.client_note,
    internalNote: row.internal_note ?? '',
    source: 'supabase',
  };
}

function mapSupportNextStep(row: PortalSupportRow): PortalProjectSupportNextStep {
  return {
    id: row.id,
    ...getProjectScope(row),
    title: row.title,
    description: row.description,
    status: row.status,
    startsOn: formatDate(row.starts_on),
    cadence: row.cadence,
    ownerName: row.owner_name,
    clientNote: row.client_note,
    internalNote: row.internal_note ?? '',
    source: 'supabase',
  };
}

async function loadFinanceHandoffData({
  fallback,
  includeInternalNotes,
  projectSlug,
}: {
  fallback: PortalFinanceHandoffData;
  includeInternalNotes: boolean;
  projectSlug: string;
}): Promise<PortalFinanceHandoffData> {
  const supabase = getPortalSupabaseClient();

  if (!supabase) {
    return fallback;
  }

  const projectSelect = 'portal_projects!inner(slug,project_name,portal_clients!inner(name))';
  const invoiceColumns = [
    'id',
    'invoice_number',
    'label',
    'status',
    'amount_label',
    'issued_on',
    'due_on',
    'paid_on',
    'payment_reference',
    'payment_link_label',
    'payment_url',
    'client_note',
    includeInternalNotes ? 'internal_note' : '',
    projectSelect,
  ].filter(Boolean);
  const handoffColumns = [
    'id',
    'category',
    'title',
    'detail',
    'status',
    'owner_name',
    'owner_role',
    'due_on',
    'completed_at',
    'client_note',
    includeInternalNotes ? 'internal_note' : '',
    projectSelect,
  ].filter(Boolean);
  const supportColumns = [
    'id',
    'title',
    'description',
    'status',
    'starts_on',
    'cadence',
    'owner_name',
    'client_note',
    includeInternalNotes ? 'internal_note' : '',
    projectSelect,
  ].filter(Boolean);

  const [invoiceResult, handoffResult, supportResult] = await Promise.all([
    supabase
      .from('portal_project_invoices')
      .select(invoiceColumns.join(','))
      .eq('portal_projects.slug', projectSlug)
      .eq('client_visible', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('portal_project_handoff_items')
      .select(handoffColumns.join(','))
      .eq('portal_projects.slug', projectSlug)
      .eq('client_visible', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('portal_project_support_next_steps')
      .select(supportColumns.join(','))
      .eq('portal_projects.slug', projectSlug)
      .eq('client_visible', true)
      .order('sort_order', { ascending: true }),
  ]);

  if (
    invoiceResult.error ||
    handoffResult.error ||
    supportResult.error ||
    !invoiceResult.data ||
    !handoffResult.data ||
    !supportResult.data
  ) {
    return fallback;
  }

  return {
    invoices: (invoiceResult.data as unknown as PortalInvoiceRow[]).map(mapInvoice),
    handoffItems: (handoffResult.data as unknown as PortalHandoffRow[]).map(mapHandoffItem),
    supportNextSteps: (supportResult.data as unknown as PortalSupportRow[]).map(mapSupportNextStep),
  };
}

export async function getPortalFinanceHandoffData(
  projectSlug = defaultPortalProjectSlug,
): Promise<PortalFinanceHandoffData> {
  return loadFinanceHandoffData({
    fallback: emptyFinanceHandoffData,
    includeInternalNotes: false,
    projectSlug,
  });
}

export async function getStudioFinanceHandoffData(
  projectSlug = defaultPortalProjectSlug,
): Promise<PortalFinanceHandoffData> {
  return loadFinanceHandoffData({
    fallback: demoFinanceHandoffData,
    includeInternalNotes: true,
    projectSlug,
  });
}
