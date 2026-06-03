import 'server-only';
import { defaultPortalProjectSlug, getPortalSupabaseClient } from '@/lib/portal-supabase';
import type { PortalInvoiceStatus, PortalProjectInvoice } from '@/lib/portal-finance-handoff';

export type PortalReadinessStatus = 'blocked' | 'done' | 'in_progress' | 'not_started' | 'waiting_client';

export type PortalReadinessCategory =
  | 'assets'
  | 'commercial'
  | 'communication'
  | 'decision'
  | 'kickoff'
  | 'scope'
  | 'technical';

export type PortalReadinessItem = {
  id: string;
  projectSlug: string;
  projectName: string;
  clientName: string;
  category: PortalReadinessCategory;
  itemKey: string;
  label: string;
  detail: string;
  status: PortalReadinessStatus;
  requiredForActiveDelivery: boolean;
  blocksActiveDelivery: boolean;
  ownerName: string;
  ownerRole: string;
  dueOn: string;
  dueDate: string;
  completedAt: string;
  clientNote: string;
  internalNote: string;
  linkedInvoiceNumber: string;
  linkedInvoiceStatus: PortalInvoiceStatus | '';
  clientVisible: boolean;
  sortOrder: number;
  source: 'demo' | 'supabase';
};

export type PortalReadinessGateData = {
  items: PortalReadinessItem[];
  requiredCount: number;
  completeRequiredCount: number;
  blockingItems: PortalReadinessItem[];
  clientActionItems: PortalReadinessItem[];
  isReadyForActiveDelivery: boolean;
  contractStatusLabel: string;
  sowStatusLabel: string;
  depositStatusLabel: string;
  summary: string;
  nextAction: string;
  source: 'demo' | 'supabase';
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

type PortalReadinessRow = ProjectScopedRow & {
  id: string;
  category: PortalReadinessCategory;
  item_key: string;
  label: string;
  detail: string;
  status: PortalReadinessStatus;
  required_for_active_delivery: boolean;
  blocks_active_delivery: boolean;
  owner_name: string;
  owner_role: string;
  due_on: string | null;
  completed_at: string | null;
  client_note: string;
  internal_note?: string;
  linked_invoice_number: string;
  client_visible: boolean;
  sort_order: number;
};

const demoProject = {
  clientName: 'ABC Engineering',
  projectName: 'Website Redesign',
  projectSlug: defaultPortalProjectSlug,
} as const;

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

function mapReadinessRow(row: PortalReadinessRow, source: 'demo' | 'supabase'): PortalReadinessItem {
  return {
    id: row.id,
    ...getProjectScope(row),
    category: row.category,
    itemKey: row.item_key,
    label: row.label,
    detail: row.detail,
    status: row.status,
    requiredForActiveDelivery: row.required_for_active_delivery,
    blocksActiveDelivery: row.blocks_active_delivery,
    ownerName: row.owner_name,
    ownerRole: row.owner_role,
    dueOn: row.due_on ?? '',
    dueDate: formatDate(row.due_on),
    completedAt: formatDateTime(row.completed_at),
    clientNote: row.client_note,
    internalNote: row.internal_note ?? '',
    linkedInvoiceNumber: row.linked_invoice_number,
    linkedInvoiceStatus: '',
    clientVisible: row.client_visible,
    sortOrder: row.sort_order,
    source,
  };
}

function makeDemoItem(
  input: Omit<
    PortalReadinessItem,
    | 'clientName'
    | 'completedAt'
    | 'dueDate'
    | 'linkedInvoiceStatus'
    | 'projectName'
    | 'projectSlug'
    | 'source'
  > & {
    completedAt?: string;
  },
): PortalReadinessItem {
  return {
    ...demoProject,
    ...input,
    completedAt: input.completedAt ?? 'Not completed',
    dueDate: input.dueOn ? formatDate(input.dueOn) : 'Not set',
    linkedInvoiceStatus: '',
    source: 'demo',
  };
}

const demoReadinessItems: PortalReadinessItem[] = [
  makeDemoItem({
    id: 'demo-readiness-agreement',
    category: 'commercial',
    itemKey: 'agreement_signed',
    label: 'Agreement signed',
    detail: 'The client agreement or master service agreement is accepted before delivery work begins.',
    status: 'done',
    requiredForActiveDelivery: true,
    blocksActiveDelivery: true,
    ownerName: 'Kreative Reflow',
    ownerRole: 'Studio',
    dueOn: '2026-05-15',
    completedAt: '15 May 2026, 15:00',
    clientNote: 'Agreement is signed and stored by the studio.',
    internalNote: 'Confirm final signed copy is in the private commercial folder.',
    linkedInvoiceNumber: '',
    clientVisible: true,
    sortOrder: 10,
  }),
  makeDemoItem({
    id: 'demo-readiness-sow',
    category: 'scope',
    itemKey: 'sow_approved',
    label: 'Scope of work approved',
    detail: 'The SOW confirms services, exclusions, revision rules, and approval responsibilities.',
    status: 'done',
    requiredForActiveDelivery: true,
    blocksActiveDelivery: true,
    ownerName: 'Kreative Reflow',
    ownerRole: 'Studio',
    dueOn: '2026-05-15',
    completedAt: '15 May 2026, 15:30',
    clientNote: 'Scope of work is approved. New requests may need a change request.',
    internalNote: 'SOW includes revision boundary and out-of-scope handling.',
    linkedInvoiceNumber: '',
    clientVisible: true,
    sortOrder: 20,
  }),
  makeDemoItem({
    id: 'demo-readiness-deposit',
    category: 'commercial',
    itemKey: 'deposit_paid',
    label: 'Project deposit paid',
    detail: 'The project deposit must be paid before active delivery opens.',
    status: 'done',
    requiredForActiveDelivery: true,
    blocksActiveDelivery: true,
    ownerName: 'ABC Engineering',
    ownerRole: 'Client owner',
    dueOn: '2026-05-18',
    completedAt: '16 May 2026, 10:30',
    clientNote: 'Deposit is paid and linked to the project deposit invoice.',
    internalNote: 'Linked to INV-007. Do not expose bank statement details.',
    linkedInvoiceNumber: 'INV-007',
    clientVisible: true,
    sortOrder: 30,
  }),
  makeDemoItem({
    id: 'demo-readiness-assets',
    category: 'assets',
    itemKey: 'brand_content_assets_ready',
    label: 'Brand, content, and assets ready',
    detail: 'Brand files, priority page copy, logo assets, and key photos must be available.',
    status: 'waiting_client',
    requiredForActiveDelivery: true,
    blocksActiveDelivery: true,
    ownerName: 'ABC Engineering',
    ownerRole: 'Client owner',
    dueOn: '2026-06-06',
    clientNote: 'Please upload missing brand and content files or confirm what the studio should draft.',
    internalNote: 'Client still owes several content inputs before build can move without risk.',
    linkedInvoiceNumber: '',
    clientVisible: true,
    sortOrder: 70,
  }),
  makeDemoItem({
    id: 'demo-readiness-access',
    category: 'technical',
    itemKey: 'technical_access_ready',
    label: 'Technical access ready',
    detail: 'Hosting, DNS, analytics, email, and related account access must be invited or confirmed.',
    status: 'waiting_client',
    requiredForActiveDelivery: true,
    blocksActiveDelivery: true,
    ownerName: 'ABC Engineering',
    ownerRole: 'Client owner',
    dueOn: '2026-06-10',
    clientNote: 'Please invite the studio to the required accounts. Do not paste passwords into the portal.',
    internalNote: 'Access cannot be stored as raw credentials in portal notes.',
    linkedInvoiceNumber: '',
    clientVisible: true,
    sortOrder: 80,
  }),
];

function getItemStatusLabel(item: PortalReadinessItem) {
  if (item.status === 'done') return 'Complete';
  if (item.status === 'waiting_client') return 'Waiting on client';
  if (item.status === 'blocked') return 'Blocked';
  if (item.status === 'in_progress') return 'In progress';
  return 'Not started';
}

function findDepositInvoice(item: PortalReadinessItem, invoices: PortalProjectInvoice[]) {
  if (item.linkedInvoiceNumber) {
    const linkedInvoice = invoices.find((invoice) => invoice.invoiceNumber === item.linkedInvoiceNumber);

    if (linkedInvoice) {
      return linkedInvoice;
    }
  }

  if (item.itemKey !== 'deposit_paid') {
    return null;
  }

  return invoices.find((invoice) => /deposit/i.test(invoice.label)) ?? null;
}

function connectInvoiceSignals(items: PortalReadinessItem[], invoices: PortalProjectInvoice[]) {
  if (!invoices.length) {
    return items;
  }

  return items.map((item) => {
    const depositInvoice = findDepositInvoice(item, invoices);

    if (!depositInvoice) {
      return item;
    }

    const invoiceDrivenStatus: PortalReadinessStatus =
      depositInvoice.status === 'paid'
        ? 'done'
        : depositInvoice.status === 'due' || depositInvoice.status === 'overdue'
          ? 'waiting_client'
          : item.status;

    return {
      ...item,
      linkedInvoiceNumber: depositInvoice.invoiceNumber,
      linkedInvoiceStatus: depositInvoice.status,
      status: invoiceDrivenStatus,
      completedAt: depositInvoice.status === 'paid' ? depositInvoice.paidDate : item.completedAt,
    };
  });
}

function buildReadinessGateData(
  items: PortalReadinessItem[],
  source: 'demo' | 'supabase',
  invoices: PortalProjectInvoice[] = [],
): PortalReadinessGateData {
  const connectedItems = connectInvoiceSignals(items, invoices);
  const requiredItems = connectedItems.filter((item) => item.requiredForActiveDelivery);
  const blockingItems = requiredItems.filter((item) =>
    item.blocksActiveDelivery && item.status !== 'done'
  );
  const clientActionItems = blockingItems.filter((item) =>
    item.status === 'waiting_client' || /client/i.test(`${item.ownerName} ${item.ownerRole}`)
  );
  const completeRequiredCount = requiredItems.filter((item) => item.status === 'done').length;
  const isReadyForActiveDelivery = requiredItems.length > 0 && blockingItems.length === 0;
  const contractItem = connectedItems.find((item) => item.itemKey === 'agreement_signed');
  const sowItem = connectedItems.find((item) => item.itemKey === 'sow_approved');
  const depositItem = connectedItems.find((item) => item.itemKey === 'deposit_paid');
  const firstClientAction = clientActionItems[0] ?? blockingItems[0];
  const hasRequiredItems = requiredItems.length > 0;

  return {
    items: connectedItems,
    requiredCount: requiredItems.length,
    completeRequiredCount,
    blockingItems,
    clientActionItems,
    isReadyForActiveDelivery,
    contractStatusLabel: contractItem ? getItemStatusLabel(contractItem) : 'Not tracked',
    sowStatusLabel: sowItem ? getItemStatusLabel(sowItem) : 'Not tracked',
    depositStatusLabel: depositItem ? getItemStatusLabel(depositItem) : 'Not tracked',
    summary: !hasRequiredItems
      ? 'No readiness gate records are available yet'
      : isReadyForActiveDelivery
        ? 'Ready for active delivery'
        : `${blockingItems.length} gate item${blockingItems.length === 1 ? '' : 's'} still blocking active delivery`,
    nextAction: !hasRequiredItems
      ? 'The studio still needs to add readiness records before active delivery can be confirmed.'
      : firstClientAction
        ? `${firstClientAction.label}: ${firstClientAction.clientNote || firstClientAction.detail}`
        : 'No client action is blocking active delivery.',
    source,
  };
}

async function loadReadinessGateData({
  fallback,
  includeInternalNotes,
  invoices = [],
  projectSlug,
}: {
  fallback: PortalReadinessGateData;
  includeInternalNotes: boolean;
  invoices?: PortalProjectInvoice[];
  projectSlug: string;
}): Promise<PortalReadinessGateData> {
  const supabase = getPortalSupabaseClient();

  if (!supabase) {
    return buildReadinessGateData(fallback.items, 'demo', invoices);
  }

  const projectSelect = 'portal_projects!inner(slug,project_name,portal_clients!inner(name))';
  const columns = [
    'id',
    'category',
    'item_key',
    'label',
    'detail',
    'status',
    'required_for_active_delivery',
    'blocks_active_delivery',
    'owner_name',
    'owner_role',
    'due_on',
    'completed_at',
    'client_note',
    includeInternalNotes ? 'internal_note' : '',
    'linked_invoice_number',
    'client_visible',
    'sort_order',
    projectSelect,
  ].filter(Boolean);

  const { data, error } = await supabase
    .from('portal_project_readiness_items')
    .select(columns.join(','))
    .eq('portal_projects.slug', projectSlug)
    .eq('client_visible', true)
    .order('sort_order', { ascending: true });

  if (error || !data) {
    return buildReadinessGateData(fallback.items, 'demo', invoices);
  }

  return buildReadinessGateData(
    (data as unknown as PortalReadinessRow[]).map((row) => mapReadinessRow(row, 'supabase')),
    'supabase',
    invoices,
  );
}

const demoReadinessGateData = buildReadinessGateData(demoReadinessItems, 'demo');

export async function getPortalReadinessGateData(
  projectSlug = defaultPortalProjectSlug,
  invoices: PortalProjectInvoice[] = [],
) {
  return loadReadinessGateData({
    fallback: buildReadinessGateData([], 'demo'),
    includeInternalNotes: false,
    invoices,
    projectSlug,
  });
}

export async function getStudioReadinessGateData(
  projectSlug = defaultPortalProjectSlug,
  invoices: PortalProjectInvoice[] = [],
) {
  return loadReadinessGateData({
    fallback: demoReadinessGateData,
    includeInternalNotes: true,
    invoices,
    projectSlug,
  });
}
