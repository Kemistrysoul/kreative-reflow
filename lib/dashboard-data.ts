import type { LucideIcon } from 'lucide-react';
import {
  BellRing,
  BriefcaseBusiness,
  CalendarRange,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileCheck2,
  FileSpreadsheet,
  FileText,
  FolderKanban,
  Inbox,
  LayoutGrid,
  MessageSquareText,
  ReceiptText,
  Route,
  SearchCheck,
  Send,
  Settings2,
  ShieldCheck,
  Target,
  UploadCloud,
  Users2,
  WalletCards,
} from 'lucide-react';

export type PortalStep = {
  title: string;
  status: string;
  detail: string;
  icon: LucideIcon;
};

export type MilestoneRecord = {
  label: string;
  state: string;
  date: string;
  detail?: string;
  owner?: string;
  ownerRole?: string;
};

export type AssetBucket = {
  title: string;
  detail: string;
  files: number;
};

export type StudioNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
};

export type LocalNavItem = {
  label: string;
  hint?: string;
  href?: string;
};

export type StudioMetric = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: 'accent' | 'neutral' | 'muted';
  spark?: number[];
};

export type ActivityItem = {
  time: string;
  title: string;
  meta: string;
  tone?: 'accent' | 'neutral';
};

export type LeadRecord = {
  id?: string;
  name: string;
  business: string;
  stage: string;
  source: string;
  budget: string;
  nextAction: string;
  owner: string;
  email?: string;
  requestedService?: string;
  lastTouch?: string;
  notes?: string;
};

export type CrmHandoffRecord = {
  id?: string;
  type: 'Project' | 'Content';
  sourceLeadId?: string;
  client: string;
  business: string;
  owner: string;
  stage: string;
  summary: string;
  email?: string;
  budget?: string;
  requestedService?: string;
  notes?: string;
  createdAt?: string;
};

export type PipelineStage = {
  label: string;
  count: number;
  items: {
    name: string;
    business: string;
    value: string;
  }[];
};

export type ProjectRecord = {
  project: string;
  client: string;
  phase: string;
  deadline: string;
  value: string;
  health: string;
};

export type BoardColumn = {
  label: string;
  items: string[];
};

export type InvoiceRecord = {
  invoice: string;
  client: string;
  amount: string;
  status: string;
  issued: string;
  due: string;
  paid: string;
};

export type ExpenseRecord = {
  date: string;
  category: string;
  description: string;
  amount: string;
};

export type ContentRecord = {
  id?: string;
  title: string;
  workspace: string;
  client: string;
  project: string;
  contentType: string;
  channel: string;
  owner: string;
  priority: string;
  status: string;
  category: string;
  dueDate: string;
  publishDate: string;
};

export type IdeaRecord = {
  id?: string;
  title: string;
  workspace: string;
  client: string;
  project: string;
  contentType: string;
  channel: string;
  owner: string;
  goal: string;
  audience: string;
  cta: string;
  priority: string;
  status: string;
};

export type ResearchRecord = {
  id?: string;
  topic: string;
  workspace: string;
  client: string;
  project: string;
  contentType: string;
  channel: string;
  owner: string;
  source: string;
  focus: string;
  nextAction: string;
};

export type PipelineCard = {
  id?: string;
  title: string;
  workspace: string;
  client: string;
  project: string;
  contentType: string;
  channel: string;
  priority: string;
  due: string;
};

export type PipelineStageBoard = {
  label: string;
  items: PipelineCard[];
};

export type ContentCalendarEntry = {
  id?: string;
  day: string;
  date: string;
  title: string;
  workspace: string;
  client: string;
  project: string;
  contentType: string;
  channel: string;
  priority: string;
  status: string;
};

export type ContentFilterState = {
  workspace: string;
  client: string;
  project: string;
  contentType: string;
  status: string;
  channel: string;
};

export type ContentDetailItem = {
  id: string;
  entityType: 'record' | 'idea' | 'research' | 'calendar' | 'pipeline' | 'library';
  editable?: boolean;
  title: string;
  kind: string;
  workspace: string;
  client: string;
  project: string;
  contentType: string;
  channel: string;
  status: string;
  priority?: string;
  owner?: string;
  dueDate?: string;
  publishDate?: string;
  calendarDay?: string;
  calendarDate?: string;
  goal?: string;
  audience?: string;
  cta?: string;
  source?: string;
  focus?: string;
  nextAction?: string;
  summary?: string;
  notes?: string[];
};

export type ContentTypeTemplate = {
  title: string;
  description: string;
  channels: string;
  defaultCta: string;
};

export type TemplateRecord = {
  title: string;
  description: string;
};

export type PreferenceRecord = {
  label: string;
  value: string;
};

export const portalProject = {
  clientName: 'ABC Engineering',
  projectName: 'Website Redesign',
  phase: 'Design Phase',
  status: 'In progress',
  progress: 42,
  started: 'May 15, 2026',
  targetLaunch: 'July 10, 2026',
  nextAction: 'Review homepage concept and upload final team photos.',
};

export const portalSteps: PortalStep[] = [
  {
    title: 'Onboarding',
    status: 'Complete',
    detail: 'Questionnaire submitted and discovery notes captured.',
    icon: CheckCircle2,
  },
  {
    title: 'Assets',
    status: 'Needs files',
    detail: 'Logo received. Photos, service copy, and certifications still missing.',
    icon: UploadCloud,
  },
  {
    title: 'Milestones',
    status: 'Active',
    detail: 'Sitemap approved. Homepage design is ready for client review.',
    icon: FolderKanban,
  },
  {
    title: 'Approvals',
    status: 'Waiting',
    detail: 'No active approval yet. Timestamped approvals unlock in phase two.',
    icon: FileCheck2,
  },
];

export const milestones: MilestoneRecord[] = [
  {
    label: 'Onboarding complete',
    state: 'Done',
    date: 'May 15',
    detail: 'Kickoff questionnaire and discovery inputs are captured.',
    owner: 'ABC Engineering',
    ownerRole: 'Client owner',
  },
  {
    label: 'Sitemap and wireframes',
    state: 'Done',
    date: 'May 22',
    detail: 'Structure and wireframes are approved for design.',
    owner: 'Kreative Reflow',
    ownerRole: 'Studio',
  },
  {
    label: 'Homepage design concept',
    state: 'Review',
    date: 'May 30',
    detail: 'Homepage concept v1 is waiting for client approval or revision notes.',
    owner: 'Kreative Reflow',
    ownerRole: 'Studio',
  },
  {
    label: 'Development sprint',
    state: 'Upcoming',
    date: 'Jun 10',
    detail: 'Development begins after homepage direction is approved.',
    owner: 'Kreative Reflow',
    ownerRole: 'Studio',
  },
  {
    label: 'Testing and revisions',
    state: 'Upcoming',
    date: 'Jun 28',
    detail: 'QA and revision checks before launch handoff.',
    owner: 'Kreative Reflow',
    ownerRole: 'Studio + client',
  },
  {
    label: 'Launch and handoff',
    state: 'Upcoming',
    date: 'Jul 10',
    detail: 'Final launch, training notes, and support handoff.',
    owner: 'Kreative Reflow',
    ownerRole: 'Studio',
  },
];

export const assetBuckets: AssetBucket[] = [
  { title: 'Logo Files', detail: 'SVG, PNG, AI, EPS', files: 3 },
  { title: 'Brand Assets', detail: 'Guides, palettes, font files', files: 1 },
  { title: 'Photos & Images', detail: 'Team, office, products, proof', files: 0 },
  { title: 'Written Content', detail: 'About, services, FAQs, bios', files: 2 },
  { title: 'Legal Documents', detail: 'Licenses, policies, compliance', files: 0 },
  { title: 'Other', detail: 'Anything that does not fit above', files: 0 },
];

export const portalActivity: ActivityItem[] = [
  { time: 'Today 09:15', title: 'Homepage design v1 uploaded for review', meta: 'Deliverable added to review queue' },
  { time: 'Today 08:30', title: 'Client uploaded two service description documents', meta: 'Written content bucket updated' },
  { time: 'Yesterday', title: 'Milestone completed: Sitemap and wireframes', meta: 'Project tracker updated' },
  { time: 'Yesterday', title: 'Deposit invoice marked paid', meta: 'Finance status synced to portal' },
];

export const studioNavigation: StudioNavItem[] = [
  {
    label: 'Overview',
    href: '/studio',
    icon: LayoutGrid,
    description: 'Command center for priorities, risk, and studio pulse.',
  },
  {
    label: 'CRM',
    href: '/studio/crm',
    icon: Users2,
    description: 'Lead pipeline, enquiries, and follow-through.',
  },
  {
    label: 'Projects',
    href: '/studio/projects',
    icon: FolderKanban,
    description: 'Delivery status, blockers, and client motion.',
  },
  {
    label: 'Finance',
    href: '/studio/finance',
    icon: CircleDollarSign,
    description: 'Revenue, invoices, expenses, and cash view.',
  },
  {
    label: 'Content',
    href: '/studio/content',
    icon: FileText,
    description: 'Insights planning, drafts, and publishing cadence.',
  },
  {
    label: 'Settings',
    href: '/studio/settings',
    icon: Settings2,
    description: 'Templates, preferences, and workspace controls.',
  },
];

export const studioPortalLink: StudioNavItem = {
  label: 'Portal',
  href: '/portal',
  icon: Route,
  description: 'Jump to the client-facing portal experience.',
};

export const studioOverviewTabs: LocalNavItem[] = [
  { label: 'Today', hint: 'Command center' },
  { label: 'This week', hint: 'Near-term focus' },
  { label: 'Watchlist', hint: 'Risk and waiting items' },
];

export const studioCrmTabs: LocalNavItem[] = [
  { label: 'Pipeline', hint: 'Stage view' },
  { label: 'Leads', hint: 'All records' },
  { label: 'Follow-ups', hint: 'Next actions' },
];

export const studioProjectTabs: LocalNavItem[] = [
  { label: 'Active', hint: 'Current delivery' },
  { label: 'Timeline', hint: 'Milestones' },
  { label: 'Assets', hint: 'Readiness' },
];

export const studioFinanceTabs: LocalNavItem[] = [
  { label: 'Overview', hint: 'Revenue pulse' },
  { label: 'Invoices', hint: 'Collection' },
  { label: 'Expenses', hint: 'Costs' },
];

export const studioContentTabs: LocalNavItem[] = [
  { label: 'Overview', hint: 'Command center', href: '/studio/content' },
  { label: 'Research', hint: 'Inputs', href: '/studio/content/research' },
  { label: 'Ideas', hint: 'Briefs', href: '/studio/content/ideas' },
  { label: 'Pipeline', hint: 'Production', href: '/studio/content/pipeline' },
  { label: 'Calendar', hint: 'Schedule', href: '/studio/content/calendar' },
  { label: 'Library', hint: 'Types', href: '/studio/content/library' },
];

export const studioSettingsTabs: LocalNavItem[] = [
  { label: 'Templates', hint: 'Reusable docs' },
  { label: 'Preferences', hint: 'Studio defaults' },
  { label: 'Workspace', hint: 'Links and controls' },
];

export const overviewMetrics: StudioMetric[] = [
  {
    label: 'Active Projects',
    value: '12',
    detail: '3 at risk this week',
    icon: FolderKanban,
    tone: 'accent',
    spark: [40, 45, 44, 48, 50, 52, 54],
  },
  {
    label: 'Pipeline Value',
    value: 'R412k',
    detail: '4 proposals currently out',
    icon: Target,
    tone: 'neutral',
    spark: [32, 38, 41, 44, 47, 49, 52],
  },
  {
    label: 'Revenue This Month',
    value: 'R189k',
    detail: '83% of target collected',
    icon: WalletCards,
    tone: 'neutral',
    spark: [24, 28, 32, 37, 44, 47, 51],
  },
  {
    label: 'Tasks Due Today',
    value: '7',
    detail: '2 waiting on client input',
    icon: Clock3,
    tone: 'muted',
    spark: [58, 52, 48, 44, 39, 35, 32],
  },
];

export const overviewPriorities: ActivityItem[] = [
  { time: 'Today', title: 'Upload homepage design for ABC Engineering review', meta: 'Client delivery - due today', tone: 'accent' },
  { time: 'Today', title: 'Follow up with Wellness Clinic proposal', meta: 'Discovery call tomorrow', tone: 'neutral' },
  { time: 'Today', title: 'Publish draft: Why your site should feel like software', meta: 'Content ops - due today', tone: 'neutral' },
  { time: 'Friday', title: 'Review hosting renewal for Dr. Mokoena site', meta: 'Maintenance and support', tone: 'neutral' },
];

export const overviewActivity: ActivityItem[] = [
  { time: '09:15', title: 'ABC Engineering approved services page direction', meta: 'Projects', tone: 'accent' },
  { time: '08:30', title: 'New lead submitted contact form: Dr. Nkosi', meta: 'CRM', tone: 'neutral' },
  { time: 'Yesterday', title: 'Wellness Clinic proposal sent', meta: 'CRM', tone: 'neutral' },
  { time: 'Yesterday', title: 'Invoice INV-009 marked paid', meta: 'Finance', tone: 'accent' },
];

export const overviewAtRiskProjects: ProjectRecord[] = [
  {
    project: 'Medical Practice Site',
    client: 'Dr. Mokoena',
    phase: 'Design',
    deadline: 'Aug 01',
    value: 'R28k',
    health: 'Waiting on assets',
  },
  {
    project: 'Automation Sprint',
    client: 'Oakline Labs',
    phase: 'Discovery',
    deadline: 'Jul 11',
    value: 'R46k',
    health: 'Needs scope sign-off',
  },
  {
    project: 'Maintenance Rollout',
    client: 'ABC Engineering',
    phase: 'Support',
    deadline: 'Jul 06',
    value: 'Retainer',
    health: 'Pending approval',
  },
];

export const overviewCrmSnapshot = [
  { label: 'New leads', value: '8' },
  { label: 'Discovery calls', value: '5' },
  { label: 'Proposals sent', value: '4' },
  { label: 'Won this month', value: '3' },
];

export const overviewFinanceSnapshot = [
  { label: 'Outstanding invoices', value: 'R67k' },
  { label: 'Due this week', value: 'R29k' },
  { label: 'Average project', value: 'R31k' },
];

export const crmMetrics: StudioMetric[] = [
  {
    label: 'Leads This Week',
    value: '11',
    detail: 'Up from 7 last week',
    icon: Inbox,
    tone: 'accent',
    spark: [28, 30, 26, 34, 37, 41, 46],
  },
  {
    label: 'Discovery Calls',
    value: '5',
    detail: '2 happening tomorrow',
    icon: CalendarRange,
    tone: 'neutral',
    spark: [12, 16, 19, 18, 22, 25, 28],
  },
  {
    label: 'Open Proposals',
    value: '4',
    detail: 'R102k combined value',
    icon: Send,
    tone: 'neutral',
    spark: [9, 11, 14, 12, 13, 15, 17],
  },
];

export const crmPipeline: PipelineStage[] = [
  {
    label: 'New',
    count: 8,
    items: [
      { name: 'Dr. Nkosi', business: 'Nkosi Dental Practice', value: 'R25k' },
      { name: 'Apex Legal', business: 'Corporate legal site', value: 'R19k' },
      { name: 'Sage Property', business: 'Lead-gen website', value: 'R22k' },
    ],
  },
  {
    label: 'Discovery',
    count: 5,
    items: [
      { name: 'TechStart Inc.', business: 'SaaS founder', value: 'R52k' },
      { name: 'Studio Nova', business: 'Brand refresh and site', value: 'R31k' },
      { name: 'Oakline Labs', business: 'Automation sprint', value: 'R46k' },
    ],
  },
  {
    label: 'Proposal',
    count: 4,
    items: [
      { name: 'Wellness Clinic', business: 'Private healthcare', value: 'R22k' },
      { name: 'Blue Peak', business: 'SEO retainer', value: 'R18k' },
    ],
  },
  {
    label: 'Won',
    count: 3,
    items: [
      { name: 'ABC Engineering', business: 'Website redesign', value: 'R35k' },
      { name: 'Dr. Mokoena', business: 'Medical practice site', value: 'R28k' },
    ],
  },
];

export const crmLeads: LeadRecord[] = [
  {
    id: 'lead-dr-nkosi',
    name: 'Dr. Nkosi',
    business: 'Nkosi Dental Practice',
    stage: 'New',
    source: 'Google',
    budget: 'R25k',
    nextAction: 'Send portfolio link',
    owner: 'Delite',
    email: 'hello@nkosidental.co.za',
    requestedService: 'Website redesign',
    lastTouch: 'Today',
    notes: 'Wants a quieter, trust-led site with easier appointment conversion.',
  },
  {
    id: 'lead-sarah-rosebank',
    name: 'Sarah M.',
    business: 'Rosebank Salon',
    stage: 'Contacted',
    source: 'Referral',
    budget: 'R18k',
    nextAction: 'Book discovery call',
    owner: 'Delite',
    email: 'sarah@rosebanksalon.co.za',
    requestedService: 'Brand refresh and service site',
    lastTouch: 'Yesterday',
    notes: 'Referral came through an existing maintenance client.',
  },
  {
    id: 'lead-techstart',
    name: 'TechStart Inc.',
    business: 'SaaS founder',
    stage: 'Discovery call',
    source: 'LinkedIn',
    budget: 'R52k',
    nextAction: 'Draft scope summary',
    owner: 'Delite',
    email: 'ops@techstart.io',
    requestedService: 'Portal or dashboard MVP',
    lastTouch: 'Today',
    notes: 'Strong fit for dashboard and client portal work.',
  },
  {
    id: 'lead-wellness-clinic',
    name: 'Wellness Clinic',
    business: 'Private healthcare',
    stage: 'Proposal sent',
    source: 'Website',
    budget: 'R22k',
    nextAction: 'Follow up tomorrow',
    owner: 'Delite',
    email: 'marketing@wellnessclinic.co.za',
    requestedService: 'Retention campaign and nurture emails',
    lastTouch: 'Yesterday',
    notes: 'Could quickly become a client content workflow once approved.',
  },
];

export const crmProjectHandoffs: CrmHandoffRecord[] = [
  {
    id: 'handoff-project-abc',
    type: 'Project',
    sourceLeadId: 'lead-abc-engineering',
    client: 'ABC Engineering',
    business: 'Website redesign',
    owner: 'Delite',
    stage: 'Ready for delivery',
    summary: 'Won lead has moved into active project scoping and kickoff preparation.',
    email: 'projects@abcengineering.co.za',
    budget: 'R35k',
    requestedService: 'Website redesign',
    notes: 'Discovery is complete and the client is ready for kickoff planning.',
    createdAt: 'Yesterday',
  },
];

export const crmContentHandoffs: CrmHandoffRecord[] = [
  {
    id: 'handoff-content-wellness',
    type: 'Content',
    sourceLeadId: 'lead-wellness-clinic',
    client: 'Wellness Clinic',
    business: 'Retention campaign',
    owner: 'Delite',
    stage: 'Needs content intake',
    summary: 'Warm prospect already needs email and nurture planning if the proposal is accepted.',
    email: 'marketing@wellnessclinic.co.za',
    budget: 'R22k',
    requestedService: 'Retention campaign and nurture emails',
    notes: 'A good candidate for email, landing-page support, and case-study proof once the deal is active.',
    createdAt: 'Yesterday',
  },
];

export const crmSources = [
  { label: 'Google', value: '37%' },
  { label: 'Referral', value: '29%' },
  { label: 'Website', value: '19%' },
  { label: 'LinkedIn', value: '15%' },
];

export const crmFollowUps: ActivityItem[] = [
  { time: 'Today', title: 'Send intro email to Dr. Nkosi', meta: 'Google lead - dentistry' },
  { time: 'Tomorrow', title: 'Discovery call with TechStart Inc.', meta: 'SaaS app scope review' },
  { time: 'Tomorrow', title: 'Proposal follow-up with Wellness Clinic', meta: 'Waiting for decision' },
];

export const projectMetrics: StudioMetric[] = [
  {
    label: 'Active Workstreams',
    value: '12',
    detail: '7 websites, 3 retainers, 2 internal',
    icon: FolderKanban,
    tone: 'accent',
    spark: [36, 38, 39, 42, 45, 47, 49],
  },
  {
    label: 'Waiting on Client',
    value: '3',
    detail: 'Assets or approvals missing',
    icon: SearchCheck,
    tone: 'muted',
    spark: [22, 19, 16, 17, 18, 20, 23],
  },
  {
    label: 'Launches This Month',
    value: '2',
    detail: '1 more in final QA',
    icon: Route,
    tone: 'neutral',
    spark: [8, 9, 10, 12, 13, 14, 16],
  },
];

export const projectRows: ProjectRecord[] = [
  {
    project: 'Website Redesign',
    client: 'ABC Engineering',
    phase: 'Development',
    deadline: 'Jul 15',
    value: 'R35k',
    health: 'On track',
  },
  {
    project: 'Medical Practice Site',
    client: 'Dr. Mokoena',
    phase: 'Design',
    deadline: 'Aug 01',
    value: 'R28k',
    health: 'Waiting on assets',
  },
  {
    project: 'Automation Sprint',
    client: 'Oakline Labs',
    phase: 'Discovery',
    deadline: 'Jul 11',
    value: 'R46k',
    health: 'Needs scope sign-off',
  },
  {
    project: 'Studio Dashboard MVP',
    client: 'Internal',
    phase: 'Planning',
    deadline: 'Ongoing',
    value: '-',
    health: 'In progress',
  },
];

export const projectBoard: BoardColumn[] = [
  {
    label: 'To Do',
    items: [
      'Prepare Mokoena homepage wireframe',
      'Write ABC Engineering meta descriptions',
      'Package Oakline requirements summary',
    ],
  },
  {
    label: 'In Progress',
    items: [
      'Code ABC Engineering services page',
      'Refine studio dashboard route structure',
      'Review local SEO content outline',
    ],
  },
  {
    label: 'Waiting on Client',
    items: [
      'Mokoena photo uploads',
      'Oakline budget confirmation',
      'Wellness Clinic proposal sign-off',
    ],
  },
  {
    label: 'Done',
    items: [
      'ABC onboarding complete',
      'Sitemap approved',
      'Invoice INV-008 paid',
    ],
  },
];

export const projectBlockers: ActivityItem[] = [
  { time: 'Blocker', title: 'Mokoena team photos not received', meta: 'Slows final layout direction' },
  { time: 'Blocker', title: 'Oakline scope sign-off missing', meta: 'Prevents sprint estimate' },
  { time: 'Watch', title: 'ABC launch date depends on analytics setup', meta: 'Needs clean handoff checklist' },
];

export const projectClientActivity: ActivityItem[] = [
  { time: 'Today', title: 'ABC Engineering approved content hierarchy', meta: 'Projects' },
  { time: 'Yesterday', title: 'Dr. Mokoena uploaded updated service notes', meta: 'Assets' },
  { time: 'Yesterday', title: 'Oakline requested integration clarification', meta: 'Discovery' },
];

export const financeMetrics: StudioMetric[] = [
  {
    label: 'Collected Revenue',
    value: 'R189k',
    detail: 'Month to date',
    icon: CircleDollarSign,
    tone: 'accent',
    spark: [18, 24, 29, 35, 41, 47, 52],
  },
  {
    label: 'Outstanding',
    value: 'R67k',
    detail: '2 invoices due this week',
    icon: ReceiptText,
    tone: 'neutral',
    spark: [42, 40, 39, 37, 36, 35, 33],
  },
  {
    label: 'Expenses',
    value: 'R24k',
    detail: 'Software, ads, contractors',
    icon: FileSpreadsheet,
    tone: 'muted',
    spark: [11, 15, 14, 18, 20, 19, 22],
  },
];

export const financeSummary = [
  { label: 'Collected', value: 'R189k' },
  { label: 'Outstanding', value: 'R67k' },
  { label: 'Net after costs', value: 'R165k' },
  { label: 'Average project', value: 'R31k' },
];

export const invoiceRows: InvoiceRecord[] = [
  {
    invoice: 'INV-007',
    client: 'ABC Engineering',
    amount: 'R17,500',
    status: 'Paid',
    issued: 'Jun 01',
    due: 'Jun 07',
    paid: 'Jun 05',
  },
  {
    invoice: 'INV-008',
    client: 'Dr. Mokoena',
    amount: 'R14,000',
    status: 'Paid',
    issued: 'Jun 10',
    due: 'Jun 17',
    paid: 'Jun 15',
  },
  {
    invoice: 'INV-009',
    client: 'ABC Engineering',
    amount: 'R17,500',
    status: 'Due',
    issued: 'Jun 20',
    due: 'Jul 05',
    paid: '-',
  },
  {
    invoice: 'INV-010',
    client: 'Wellness Clinic',
    amount: 'R11,000',
    status: 'Draft',
    issued: '-',
    due: '-',
    paid: '-',
  },
];

export const expenseRows: ExpenseRecord[] = [
  { date: 'Jun 15', category: 'Software', description: 'Vercel Pro subscription', amount: 'R850' },
  { date: 'Jun 15', category: 'Software', description: 'Figma subscription', amount: 'R600' },
  { date: 'Jun 10', category: 'Domain', description: 'clientdomain.co.za renewal', amount: 'R180' },
  { date: 'Jun 01', category: 'Marketing', description: 'Google Ads', amount: 'R2,500' },
];

export const financeAlerts: ActivityItem[] = [
  { time: 'Due', title: 'INV-009 is due this week', meta: 'ABC Engineering - R17,500', tone: 'accent' },
  { time: 'Draft', title: 'Wellness Clinic invoice still in draft', meta: 'Needs proposal approval', tone: 'neutral' },
];

export const contentMetrics: StudioMetric[] = [
  {
    label: 'Items In Motion',
    value: '18',
    detail: 'Across studio and client work',
    icon: FileText,
    tone: 'accent',
    spark: [14, 17, 18, 21, 24, 26, 29],
  },
  {
    label: 'Scheduled 30 Days',
    value: '9',
    detail: '5 studio, 4 client deliverables',
    icon: CalendarRange,
    tone: 'neutral',
    spark: [5, 6, 8, 8, 9, 9, 10],
  },
  {
    label: 'Blocked Items',
    value: '3',
    detail: 'Waiting on input or approval',
    icon: BellRing,
    tone: 'muted',
    spark: [6, 5, 4, 4, 3, 3, 3],
  },
  {
    label: 'Content Assisted Leads',
    value: '31%',
    detail: 'Touches active opportunities',
    icon: CheckCircle2,
    tone: 'neutral',
    spark: [18, 19, 22, 24, 26, 28, 31],
  },
];

export const contentRecords: ContentRecord[] = [
  {
    title: 'Why your medical practice needs more than a template',
    workspace: 'Kreative Reflow',
    client: '-',
    project: 'Insights',
    contentType: 'Insight',
    channel: 'Blog',
    owner: 'Delite',
    priority: 'High',
    status: 'Draft',
    category: 'Medical',
    dueDate: 'Jun 30',
    publishDate: 'Jul 01',
  },
  {
    title: 'ABC Engineering case study draft',
    workspace: 'Client Content',
    client: 'ABC Engineering',
    project: 'Website Redesign',
    contentType: 'Case Study',
    channel: 'Website',
    owner: 'Delite',
    priority: 'Medium',
    status: 'Brief',
    category: 'Case Study',
    dueDate: 'Jul 03',
    publishDate: 'Jul 10',
  },
  {
    title: '5 signs your website is costing you clients',
    workspace: 'Kreative Reflow',
    client: '-',
    project: 'Insights',
    contentType: 'SEO Article',
    channel: 'Blog',
    owner: 'Delite',
    priority: 'High',
    status: 'Ready',
    category: 'General',
    dueDate: 'Jul 05',
    publishDate: 'Jul 08',
  },
  {
    title: 'Wellness Clinic July email nurture',
    workspace: 'Client Content',
    client: 'Wellness Clinic',
    project: 'Retention Campaign',
    contentType: 'Email',
    channel: 'Email',
    owner: 'Delite',
    priority: 'Medium',
    status: 'Edit',
    category: 'Email',
    dueDate: 'Jul 04',
    publishDate: 'Jul 09',
  },
  {
    title: 'Local SEO for Johannesburg businesses',
    workspace: 'Kreative Reflow',
    client: '-',
    project: 'Insights',
    contentType: 'SEO Article',
    channel: 'Blog',
    owner: 'Delite',
    priority: 'Medium',
    status: 'Idea',
    category: 'SEO',
    dueDate: 'Jul 10',
    publishDate: 'Jul 22',
  },
  {
    title: 'Mokoena appointment booking social post set',
    workspace: 'Client Content',
    client: 'Dr. Mokoena',
    project: 'Medical Practice Site',
    contentType: 'Social',
    channel: 'Instagram',
    owner: 'Delite',
    priority: 'High',
    status: 'Scheduled',
    category: 'Social',
    dueDate: 'Jul 02',
    publishDate: 'Jul 06',
  },
];

export const contentPriorities: ActivityItem[] = [
  { time: 'Urgent', title: 'Finish Wellness Clinic email edits', meta: 'Needs scheduling before campaign opens' },
  { time: 'Blocked', title: 'ABC case study waiting on final metrics', meta: 'Client Content - Website Redesign' },
  { time: 'Opportunity', title: 'Push medical template article ahead of dentistry discovery calls', meta: 'Supports active healthcare leads' },
];

export const contentFilters = {
  workspaces: ['All', 'Kreative Reflow', 'Client Content'],
  clients: ['All clients', 'ABC Engineering', 'Dr. Mokoena', 'Wellness Clinic', 'Oakline Labs'],
  projects: ['All projects', 'Insights', 'Website Redesign', 'Medical Practice Site', 'Retention Campaign'],
  contentTypes: ['All types', 'Insight', 'SEO Article', 'Service Page', 'Case Study', 'Email', 'Social', 'Video Script', 'Lead Magnet'],
  statuses: ['All statuses', 'Idea', 'Research', 'Brief', 'Draft', 'Edit', 'Ready', 'Scheduled', 'Published', 'Repurpose'],
  channels: ['All channels', 'Blog', 'Website', 'Email', 'LinkedIn', 'Instagram'],
};

export const contentOverviewAttention: ActivityItem[] = [
  { time: 'Blocked', title: 'ABC case study waiting on final before-and-after metrics', meta: 'Client content - case study' },
  { time: 'Due today', title: 'Wellness Clinic email nurture needs final edit pass', meta: 'Email - retention campaign' },
  { time: 'Overdue', title: 'Local SEO article still sitting at idea stage', meta: 'Kreative Reflow - SEO content' },
];

export const contentOverviewPublished: ActivityItem[] = [
  { time: 'Jun 26', title: 'Booking flow explainer published for Dr. Mokoena', meta: 'Client Content - Website' },
  { time: 'Jun 24', title: 'Three ways service sites lose trust published', meta: 'Kreative Reflow - Blog' },
  { time: 'Jun 21', title: 'ABC Engineering launch update social thread published', meta: 'Client Content - LinkedIn' },
];

export const contentOverviewWorkspaceSplit = [
  { label: 'Kreative Reflow', value: '10 active' },
  { label: 'Client Content', value: '8 active' },
];

export const contentResearchMetrics: StudioMetric[] = [
  {
    label: 'Research Notes',
    value: '14',
    detail: 'Across offers and client campaigns',
    icon: SearchCheck,
    tone: 'accent',
    spark: [6, 8, 9, 11, 12, 13, 14],
  },
  {
    label: 'Open Gaps',
    value: '5',
    detail: 'Worth turning into briefs',
    icon: Target,
    tone: 'neutral',
    spark: [2, 3, 3, 4, 4, 5, 5],
  },
  {
    label: 'AI Search Questions',
    value: '11',
    detail: 'Useful for educational content',
    icon: BellRing,
    tone: 'muted',
    spark: [4, 5, 6, 7, 8, 10, 11],
  },
];

export const contentResearchRecords: ResearchRecord[] = [
  {
    topic: 'Local SEO pain points for service businesses',
    workspace: 'Kreative Reflow',
    client: '-',
    project: 'Insights',
    contentType: 'SEO Article',
    channel: 'Blog',
    owner: 'Delite',
    source: 'SERP notes',
    focus: 'Questions small businesses ask before hiring SEO help',
    nextAction: 'Convert to article brief',
  },
  {
    topic: 'ABC Engineering case study inputs',
    workspace: 'Client Content',
    client: 'ABC Engineering',
    project: 'Website Redesign',
    contentType: 'Case Study',
    channel: 'Website',
    owner: 'Delite',
    source: 'Client interview',
    focus: 'Before-and-after credibility gains and project turnaround',
    nextAction: 'Collect final metrics',
  },
  {
    topic: 'Appointment-booking objections',
    workspace: 'Client Content',
    client: 'Dr. Mokoena',
    project: 'Medical Practice Site',
    contentType: 'Email',
    channel: 'Email',
    owner: 'Delite',
    source: 'Discovery notes',
    focus: 'Patient trust, friction, and mobile preference',
    nextAction: 'Use in social and email sequence',
  },
];

export const contentResearchQuestions: ActivityItem[] = [
  { time: 'Question', title: 'What do clients fear most before paying for a website rebuild?', meta: 'Supports sales and trust content' },
  { time: 'Question', title: 'Which healthcare site pages reduce appointment hesitation fastest?', meta: 'Supports Dr. Mokoena content plan' },
  { time: 'Gap', title: 'No strong article yet on why client portals improve delivery trust', meta: 'Supports SaaS and custom application offer' },
];

export const contentIdeaMetrics: StudioMetric[] = [
  {
    label: 'Idea Inbox',
    value: '16',
    detail: 'Raw opportunities waiting for triage',
    icon: Inbox,
    tone: 'accent',
    spark: [9, 10, 11, 12, 13, 15, 16],
  },
  {
    label: 'Approved Briefs',
    value: '6',
    detail: 'Ready to enter pipeline',
    icon: FileCheck2,
    tone: 'neutral',
    spark: [3, 3, 4, 4, 5, 5, 6],
  },
  {
    label: 'Case Study Candidates',
    value: '4',
    detail: 'Good proof assets already exist',
    icon: FileText,
    tone: 'muted',
    spark: [1, 2, 2, 3, 3, 4, 4],
  },
];

export const contentIdeas: IdeaRecord[] = [
  {
    title: 'Why service businesses should treat content like infrastructure',
    workspace: 'Kreative Reflow',
    client: '-',
    project: 'Insights',
    contentType: 'Insight',
    channel: 'Blog',
    owner: 'Delite',
    goal: 'Differentiate service positioning',
    audience: 'Founders comparing agencies',
    cta: 'Book discovery call',
    priority: 'High',
    status: 'Approved',
  },
  {
    title: 'ABC Engineering launch recap',
    workspace: 'Client Content',
    client: 'ABC Engineering',
    project: 'Website Redesign',
    contentType: 'Case Study',
    channel: 'Website',
    owner: 'Delite',
    goal: 'Show commercial proof',
    audience: 'Future industrial clients',
    cta: 'View case study',
    priority: 'Medium',
    status: 'Brief',
  },
  {
    title: 'Mokoena patient trust email sequence',
    workspace: 'Client Content',
    client: 'Dr. Mokoena',
    project: 'Retention Campaign',
    contentType: 'Email',
    channel: 'Email',
    owner: 'Delite',
    goal: 'Improve rebooking confidence',
    audience: 'Existing patients',
    cta: 'Book appointment',
    priority: 'High',
    status: 'Draft',
  },
];

export const contentPipelineMetrics: StudioMetric[] = [
  {
    label: 'In Production',
    value: '9',
    detail: 'Draft through scheduled',
    icon: FileText,
    tone: 'accent',
    spark: [5, 6, 6, 7, 8, 9, 9],
  },
  {
    label: 'Waiting On Client',
    value: '3',
    detail: 'Approval or source material pending',
    icon: UploadCloud,
    tone: 'muted',
    spark: [4, 4, 4, 4, 3, 3, 3],
  },
  {
    label: 'Repurpose Opportunities',
    value: '5',
    detail: 'Articles that can become email or social',
    icon: Route,
    tone: 'neutral',
    spark: [1, 2, 2, 3, 4, 4, 5],
  },
];

export const contentPipelineBoard: PipelineStageBoard[] = [
  {
    label: 'Research',
    items: [
      { title: 'Local SEO article', workspace: 'Kreative Reflow', client: '-', project: 'Insights', contentType: 'SEO Article', channel: 'Blog', priority: 'Medium', due: 'Jul 10' },
      { title: 'Oakline automation explainer research', workspace: 'Client Content', client: 'Oakline Labs', project: 'Automation Sprint', contentType: 'Case Study', channel: 'Website', priority: 'Medium', due: 'Jul 11' },
    ],
  },
  {
    label: 'Brief',
    items: [
      { title: 'ABC case study draft', workspace: 'Client Content', client: 'ABC Engineering', project: 'Website Redesign', contentType: 'Case Study', channel: 'Website', priority: 'Medium', due: 'Jul 03' },
      { title: 'Client portal trust article', workspace: 'Kreative Reflow', client: '-', project: 'Insights', contentType: 'Insight', channel: 'LinkedIn', priority: 'High', due: 'Jul 09' },
    ],
  },
  {
    label: 'Draft',
    items: [
      { title: 'Medical template article', workspace: 'Kreative Reflow', client: '-', project: 'Insights', contentType: 'Insight', channel: 'Blog', priority: 'High', due: 'Jun 30' },
      { title: 'Mokoena booking social captions', workspace: 'Client Content', client: 'Dr. Mokoena', project: 'Medical Practice Site', contentType: 'Social', channel: 'Instagram', priority: 'High', due: 'Jul 02' },
    ],
  },
  {
    label: 'Edit',
    items: [
      { title: 'Wellness Clinic nurture email', workspace: 'Client Content', client: 'Wellness Clinic', project: 'Retention Campaign', contentType: 'Email', channel: 'Email', priority: 'Medium', due: 'Jul 04' },
      { title: 'Launch-proof CTA refresh', workspace: 'Kreative Reflow', client: '-', project: 'Website Copy Refresh', contentType: 'Service Page', channel: 'Website', priority: 'Medium', due: 'Jul 05' },
    ],
  },
  {
    label: 'Scheduled',
    items: [
      { title: 'Mokoena booking social set', workspace: 'Client Content', client: 'Dr. Mokoena', project: 'Medical Practice Site', contentType: 'Social', channel: 'Instagram', priority: 'High', due: 'Jul 06' },
      { title: '5 signs article', workspace: 'Kreative Reflow', client: '-', project: 'Insights', contentType: 'SEO Article', channel: 'Blog', priority: 'High', due: 'Jul 08' },
    ],
  },
];

export const contentCalendarEntries: ContentCalendarEntry[] = [
  { day: 'Mon', date: 'Jul 01', title: 'Medical template article', workspace: 'Kreative Reflow', client: '-', project: 'Insights', contentType: 'Insight', channel: 'Blog', priority: 'High', status: 'Draft' },
  { day: 'Tue', date: 'Jul 02', title: 'Mokoena booking social captions', workspace: 'Client Content', client: 'Dr. Mokoena', project: 'Medical Practice Site', contentType: 'Social', channel: 'Instagram', priority: 'High', status: 'Draft' },
  { day: 'Wed', date: 'Jul 03', title: 'ABC case study review', workspace: 'Client Content', client: 'ABC Engineering', project: 'Website Redesign', contentType: 'Case Study', channel: 'Website', priority: 'Medium', status: 'Brief' },
  { day: 'Thu', date: 'Jul 04', title: 'Wellness Clinic nurture email', workspace: 'Client Content', client: 'Wellness Clinic', project: 'Retention Campaign', contentType: 'Email', channel: 'Email', priority: 'Medium', status: 'Edit' },
  { day: 'Sat', date: 'Jul 06', title: 'Mokoena booking social set', workspace: 'Client Content', client: 'Dr. Mokoena', project: 'Medical Practice Site', contentType: 'Social', channel: 'Instagram', priority: 'High', status: 'Scheduled' },
  { day: 'Sun', date: 'Jul 07', title: 'Service page CTA refresh', workspace: 'Kreative Reflow', client: '-', project: 'Website Copy Refresh', contentType: 'Service Page', channel: 'Website', priority: 'Medium', status: 'Ready' },
  { day: 'Mon', date: 'Jul 08', title: '5 signs article', workspace: 'Kreative Reflow', client: '-', project: 'Insights', contentType: 'SEO Article', channel: 'Blog', priority: 'High', status: 'Ready' },
  { day: 'Wed', date: 'Jul 10', title: 'ABC case study publish window', workspace: 'Client Content', client: 'ABC Engineering', project: 'Website Redesign', contentType: 'Case Study', channel: 'Website', priority: 'Medium', status: 'Scheduled' },
  { day: 'Fri', date: 'Jul 12', title: 'Client portal trust article', workspace: 'Kreative Reflow', client: '-', project: 'Insights', contentType: 'Insight', channel: 'LinkedIn', priority: 'High', status: 'Brief' },
];

export const contentUnscheduled: ActivityItem[] = [
  { time: 'Unscheduled', title: 'Client portal trust article', meta: 'Insight - waiting on brief refinement' },
  { time: 'Unscheduled', title: 'Oakline automation explainer', meta: 'Case study angle not chosen yet' },
];

export const contentLibraryTypes: ContentTypeTemplate[] = [
  {
    title: 'Insights and educational articles',
    description: 'Thoughtful, trust-building pieces for the site and blog.',
    channels: 'Website, Blog, LinkedIn',
    defaultCta: 'Book discovery call',
  },
  {
    title: 'SEO pages and service pages',
    description: 'Search-oriented pages designed to capture intent and convert.',
    channels: 'Website',
    defaultCta: 'Start a project conversation',
  },
  {
    title: 'Case studies',
    description: 'Commercial proof content using transformation, results, and process.',
    channels: 'Website, PDF, Email',
    defaultCta: 'View project or request similar work',
  },
  {
    title: 'Email and nurture sequences',
    description: 'Lifecycle and conversion content for leads, clients, or audiences.',
    channels: 'Email',
    defaultCta: 'Reply, book, or click through',
  },
  {
    title: 'Social and short-form distribution',
    description: 'Repurposed snippets and campaign support for visibility.',
    channels: 'LinkedIn, Instagram',
    defaultCta: 'Engage or visit landing page',
  },
  {
    title: 'Lead magnets and downloadable assets',
    description: 'Higher-commitment assets tied to lead capture or authority building.',
    channels: 'Website, Email',
    defaultCta: 'Download resource',
  },
];

export const settingsTemplates: TemplateRecord[] = [
  {
    title: 'New lead response',
    description: 'Reply template for first-touch enquiries and fit qualification.',
  },
  {
    title: 'Discovery call confirmation',
    description: 'Calendar, expectations, and next-step email.',
  },
  {
    title: 'Proposal follow-up',
    description: 'Short, direct follow-up for sent proposals.',
  },
  {
    title: 'Onboarding welcome',
    description: 'Portal access, process summary, and next actions.',
  },
];

export const settingsProposalTemplates: TemplateRecord[] = [
  {
    title: 'Website project proposal',
    description: 'Structure for brochure, service, and lead-gen website work.',
  },
  {
    title: 'SaaS development proposal',
    description: 'Scope and roadmap template for portals and web apps.',
  },
  {
    title: 'SEO retainer proposal',
    description: 'Monthly growth, reporting, and optimization offer.',
  },
  {
    title: 'Maintenance plan agreement',
    description: 'Post-launch support and improvement retainer structure.',
  },
];

export const settingsPreferences: PreferenceRecord[] = [
  { label: 'Dashboard default view', value: 'Overview' },
  { label: 'Reminder cadence', value: 'Daily at 08:00' },
  { label: 'Project health rule', value: 'Flag any item waiting on client for 3+ days' },
  { label: 'Portal link visibility', value: 'Pinned in sidebar and top actions' },
];

export const settingsWorkspaceLinks: TemplateRecord[] = [
  {
    title: 'Portal access rules',
    description: 'Review who can enter the client portal and what they can see.',
  },
  {
    title: 'Brand token reference',
    description: 'Color, type, and UI style notes for studio surfaces.',
  },
  {
    title: 'Notification rules',
    description: 'Define which finance, CRM, and project events surface in overview.',
  },
];

export const studioWorkspace = {
  name: 'Kreative Reflow Studio',
  role: 'Founder workspace',
  blurb: 'Internal operations across CRM, delivery, finance, content, and portal oversight.',
};

export const studioQuickActions = [
  { label: 'New intake', href: '/studio/crm?compose=intake' },
  { label: 'Open portal', href: '/portal' },
];

export const studioFocusNote = {
  title: 'The client portal stays calmer than the studio.',
  body: 'Studio surfaces can be dense and tactical. Client surfaces need reassurance, clean next actions, and less operational noise.',
  icon: ShieldCheck,
};
