import type { Metadata } from 'next';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowUpRight,
  BellRing,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileCheck2,
  FileText,
  FolderKanban,
  LayoutDashboard,
  MessageSquareText,
  ReceiptText,
  ShieldCheck,
  UploadCloud,
} from 'lucide-react';
import { SiteFooter } from '@/components/SiteFooter';
import { AnimatedLinkText } from '@/components/AnimatedTextLink';
import { PortalAccessState } from '@/components/portal/PortalAccessState';
import { PortalAssetLibrary } from '@/components/portal/PortalAssetLibrary';
import { PortalHeader, PortalPreviewNotice } from '@/components/portal/PortalChrome';
import { PortalApprovalsPanel } from '@/components/portal/PortalApprovalsPanel';
import { PortalComplianceNotice } from '@/components/portal/PortalComplianceNotice';
import { PortalFinancePanel, PortalHandoffPanel } from '@/components/portal/PortalFinanceHandoff';
import { PortalReadinessGatePanel } from '@/components/portal/PortalReadinessGate';
import { PortalRequestCenter } from '@/components/portal/PortalRequestCenter';
import type { ActivityItem, AssetBucket, MilestoneRecord, PortalStep } from '@/lib/dashboard-data';
import { getPortalAccess } from '@/lib/portal-access';
import { requirePortalAuth } from '@/lib/portal-auth';
import { getPortalProjectAssets } from '@/lib/portal-assets';
import { getPortalApprovalQueue, type PortalDeliverableApproval } from '@/lib/portal-approvals';
import { getPortalFinanceHandoffData, type PortalFinanceHandoffData } from '@/lib/portal-finance-handoff';
import { getAuthorizedPortalProjectData } from '@/lib/portal-projects';
import { getPortalReadinessGateData, type PortalReadinessGateData } from '@/lib/portal-readiness';
import { getPortalProjectRequests, type PortalRequestSummary } from '@/lib/portal-requests';

export const metadata: Metadata = {
  title: 'Client Portal Preview | Kreative Reflow',
  description: 'A protected client portal preview for onboarding, files, milestones, approvals, and handoff.',
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = 'force-dynamic';

type PortalSectionKey =
  | 'overview'
  | 'plan'
  | 'onboarding'
  | 'files'
  | 'reviews'
  | 'requests'
  | 'billing'
  | 'activity';

type PortalSearchParams = Promise<{
  section?: string | string[];
}>;

type PortalProject = NonNullable<Awaited<ReturnType<typeof getAuthorizedPortalProjectData>>>['project'];
type PortalProjectAsset = Awaited<ReturnType<typeof getPortalProjectAssets>>[number];

type PortalSectionDefinition = {
  key: PortalSectionKey;
  label: string;
  helper: string;
  icon: LucideIcon;
};

const portalSections: PortalSectionDefinition[] = [
  {
    key: 'overview',
    label: 'Overview',
    helper: 'Next action and project pulse',
    icon: LayoutDashboard,
  },
  {
    key: 'plan',
    label: 'Project Plan',
    helper: 'Milestones and phase movement',
    icon: FolderKanban,
  },
  {
    key: 'onboarding',
    label: 'Onboarding',
    helper: 'Client inputs and project setup',
    icon: CheckCircle2,
  },
  {
    key: 'files',
    label: 'Files',
    helper: 'Uploads, assets, and review state',
    icon: UploadCloud,
  },
  {
    key: 'reviews',
    label: 'Reviews',
    helper: 'Approvals and revision notes',
    icon: FileCheck2,
  },
  {
    key: 'requests',
    label: 'Requests',
    helper: 'Changes, meetings, and scope decisions',
    icon: MessageSquareText,
  },
  {
    key: 'billing',
    label: 'Billing & Launch',
    helper: 'Invoices, handoff, and support',
    icon: ReceiptText,
  },
  {
    key: 'activity',
    label: 'Activity',
    helper: 'Updates, privacy, and access notes',
    icon: BellRing,
  },
];

const sectionSet = new Set<PortalSectionKey>(portalSections.map((section) => section.key));

function getPortalSection(value: string | string[] | undefined): PortalSectionKey {
  const section = Array.isArray(value) ? value[0] : value;

  return sectionSet.has(section as PortalSectionKey) ? (section as PortalSectionKey) : 'overview';
}

function getPortalSectionHref(section: PortalSectionKey) {
  return section === 'overview' ? '/portal' : `/portal?section=${section}`;
}

function getStepByTitle(steps: PortalStep[], title: string) {
  return steps.find((step) => step.title.toLowerCase() === title.toLowerCase());
}

function getCurrentMilestone(milestones: MilestoneRecord[]) {
  return milestones.find((milestone) => milestone.state !== 'Done') ?? milestones.at(-1);
}

function getSectionBadge({
  approvals,
  assetBuckets,
  financeHandoff,
  portalActivity,
  portalProject,
  portalRequests,
  portalSteps,
  readinessGate,
  section,
}: {
  approvals: PortalDeliverableApproval[];
  assetBuckets: AssetBucket[];
  financeHandoff: PortalFinanceHandoffData;
  portalActivity: ActivityItem[];
  portalProject: PortalProject;
  portalRequests: PortalRequestSummary;
  portalSteps: PortalStep[];
  readinessGate: PortalReadinessGateData;
  section: PortalSectionKey;
}) {
  if (section === 'overview') return 'Now';
  if (section === 'plan') return `${portalProject.progress}%`;
  if (section === 'onboarding') {
    if (!readinessGate.items.length) {
      return getStepByTitle(portalSteps, 'Onboarding')?.status ?? 'Open';
    }

    return readinessGate.isReadyForActiveDelivery ? 'Ready' : `${readinessGate.blockingItems.length} blockers`;
  }
  if (section === 'files') return `${assetBuckets.reduce((total, bucket) => total + bucket.files, 0)} files`;
  if (section === 'reviews') {
    const waitingCount = approvals.filter((approval) => approval.status === 'waiting_review').length;
    return `${waitingCount} waiting`;
  }
  if (section === 'requests') {
    return portalRequests.waitingApprovalCount
      ? `${portalRequests.waitingApprovalCount} decisions`
      : `${portalRequests.openCount} open`;
  }
  if (section === 'billing') {
    const actionCount = financeHandoff.invoices.filter((invoice) => invoice.status === 'due' || invoice.status === 'overdue').length;
    return `${actionCount} action${actionCount === 1 ? '' : 's'}`;
  }

  return `${portalActivity.length} updates`;
}

export default async function PortalPage({
  searchParams,
}: {
  searchParams: PortalSearchParams;
}) {
  await requirePortalAuth('/portal');
  const params = await searchParams;
  const activeSection = getPortalSection(params.section);
  const access = await getPortalAccess();

  if (access.status !== 'authorized') {
    if (access.status === 'missing-config' || access.status === 'unauthenticated') {
      return null;
    }

    return (
      <>
        <main className="min-h-screen bg-[#111111] text-stone-100">
          <PortalHeader />
          <PortalAccessState state={access} />
        </main>
        <SiteFooter />
      </>
    );
  }

  const [portalData, portalAssets, portalApprovals, portalFinanceHandoff, portalRequests] = await Promise.all([
    getAuthorizedPortalProjectData(access.projectSlug),
    getPortalProjectAssets(access.projectSlug),
    getPortalApprovalQueue(access.projectSlug),
    getPortalFinanceHandoffData(access.projectSlug),
    getPortalProjectRequests(access.projectSlug),
  ]);
  const portalReadinessGate = await getPortalReadinessGateData(access.projectSlug, portalFinanceHandoff.invoices);

  if (!portalData) {
    return (
      <>
        <main className="min-h-screen bg-[#111111] text-stone-100">
          <PortalHeader />
          <PortalAccessState
            state={{
              status: 'empty',
              auth: access.auth,
              message: 'Your portal membership is valid, but no project record is available yet.',
            }}
          />
        </main>
        <SiteFooter />
      </>
    );
  }

  const {
    project: portalProject,
    steps: portalSteps,
    milestones,
    assetBuckets,
    activity: portalActivity,
  } = portalData;

  return (
    <>
      <main className="min-h-screen bg-[#111111] text-stone-100">
        <PortalHeader />
        <PortalPreviewNotice />

        <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <ProjectCommandBar
            activeSection={activeSection}
            currentMilestone={getCurrentMilestone(milestones)}
            portalProject={portalProject}
          />

          <div className="mt-6 grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start">
            <PortalSectionNavigation
              activeSection={activeSection}
              approvals={portalApprovals}
              assetBuckets={assetBuckets}
              financeHandoff={portalFinanceHandoff}
              portalActivity={portalActivity}
              portalProject={portalProject}
              portalRequests={portalRequests}
              portalSteps={portalSteps}
              readinessGate={portalReadinessGate}
            />

            <div className="min-w-0">
              <PortalSectionContent
                accessCanSubmit={access.canSubmitOnboarding}
                activeSection={activeSection}
                assetBuckets={assetBuckets}
                milestones={milestones}
                portalActivity={portalActivity}
                portalApprovals={portalApprovals}
                portalAssets={portalAssets}
                portalFinanceHandoff={portalFinanceHandoff}
                portalProject={portalProject}
                portalSteps={portalSteps}
                portalReadinessGate={portalReadinessGate}
                portalRequests={portalRequests}
              />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function ProjectCommandBar({
  activeSection,
  currentMilestone,
  portalProject,
}: {
  activeSection: PortalSectionKey;
  currentMilestone?: MilestoneRecord;
  portalProject: PortalProject;
}) {
  const activeDefinition = portalSections.find((section) => section.key === activeSection) ?? portalSections[0];

  return (
    <div className="rounded-lg border border-white/10 bg-[#181818] p-5 md:p-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
        <div className="min-w-0">
          <p className="font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#FC6E20]">
            Client workspace
          </p>
          <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <h1 className="font-playfair text-4xl font-bold tracking-tight text-white md:text-5xl">
                {portalProject.clientName}
              </h1>
              <p className="mt-2 font-montserrat text-sm leading-6 text-stone-400 md:text-base">
                {portalProject.projectName} is in {portalProject.phase.toLowerCase()}.
              </p>
            </div>
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FC6E20]/30 bg-[#FC6E20]/10 px-3 py-1.5 font-montserrat text-xs font-bold uppercase tracking-[0.14em] text-[#FC6E20]">
              <activeDefinition.icon className="h-4 w-4" />
              {activeDefinition.label}
            </p>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-4 font-montserrat text-xs uppercase tracking-[0.16em] text-stone-500">
              <span>{portalProject.status}</span>
              <span>{portalProject.progress}% complete</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-[#FC6E20]" style={{ width: `${portalProject.progress}%` }} />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/20 p-4">
          <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.18em] text-stone-500">
            Next action
          </p>
          <p className="mt-3 font-montserrat text-sm leading-6 text-white">{portalProject.nextAction}</p>
          {currentMilestone ? (
            <p className="mt-3 font-montserrat text-xs leading-5 text-stone-500">
              Current milestone: {currentMilestone.label} / {currentMilestone.date}
            </p>
          ) : null}
          <Link
            href="/portal/onboarding"
            className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full bg-[#FC6E20] px-4 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-stone-950 transition-colors hover:bg-[#e05a15] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FC6E20]"
          >
            <AnimatedLinkText hiddenClassName="text-stone-950">Open onboarding</AnimatedLinkText>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function PortalSectionNavigation({
  activeSection,
  approvals,
  assetBuckets,
  financeHandoff,
  portalActivity,
  portalProject,
  portalRequests,
  portalSteps,
  readinessGate,
}: {
  activeSection: PortalSectionKey;
  approvals: PortalDeliverableApproval[];
  assetBuckets: AssetBucket[];
  financeHandoff: PortalFinanceHandoffData;
  portalActivity: ActivityItem[];
  portalProject: PortalProject;
  portalRequests: PortalRequestSummary;
  portalSteps: PortalStep[];
  readinessGate: PortalReadinessGateData;
}) {
  return (
    <nav
      aria-label="Portal sections"
      className="sticky top-0 z-20 -mx-4 border-y border-white/10 bg-[#111111]/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:top-6 lg:mx-0 lg:rounded-lg lg:border lg:bg-[#181818] lg:p-3"
    >
      <div className="flex gap-2 overflow-x-auto pb-1 lg:grid lg:overflow-visible lg:pb-0">
        {portalSections.map((section) => {
          const Icon = section.icon;
          const active = activeSection === section.key;
          const badge = getSectionBadge({
            approvals,
            assetBuckets,
            financeHandoff,
            portalActivity,
            portalProject,
            portalRequests,
            portalSteps,
            readinessGate,
            section: section.key,
          });

          return (
            <Link
              key={section.key}
              href={getPortalSectionHref(section.key)}
              aria-current={active ? 'page' : undefined}
              className={`grid min-h-14 min-w-[11rem] shrink-0 grid-cols-[auto_1fr] gap-3 rounded-lg border px-3 py-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FC6E20] lg:min-w-0 ${
                active
                  ? 'border-[#FC6E20]/40 bg-[#FC6E20]/10 text-white'
                  : 'border-white/10 bg-black/20 text-stone-300 hover:border-[#FC6E20]/40 hover:text-white'
              }`}
            >
              <Icon className={`mt-0.5 h-4 w-4 ${active ? 'text-[#FC6E20]' : 'text-stone-500'}`} />
              <span className="min-w-0">
                <span className="flex items-center justify-between gap-2">
                  <span className="font-montserrat text-sm font-semibold">{section.label}</span>
                  <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] text-stone-400">
                    {badge}
                  </span>
                </span>
                <span className="mt-1 block font-montserrat text-xs leading-5 text-stone-500">
                  {section.helper}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function PortalSectionContent({
  accessCanSubmit,
  activeSection,
  assetBuckets,
  milestones,
  portalActivity,
  portalApprovals,
  portalAssets,
  portalFinanceHandoff,
  portalProject,
  portalReadinessGate,
  portalRequests,
  portalSteps,
}: {
  accessCanSubmit: boolean;
  activeSection: PortalSectionKey;
  assetBuckets: AssetBucket[];
  milestones: MilestoneRecord[];
  portalActivity: ActivityItem[];
  portalApprovals: PortalDeliverableApproval[];
  portalAssets: PortalProjectAsset[];
  portalFinanceHandoff: PortalFinanceHandoffData;
  portalProject: PortalProject;
  portalReadinessGate: PortalReadinessGateData;
  portalRequests: PortalRequestSummary;
  portalSteps: PortalStep[];
}) {
  if (activeSection === 'plan') {
    return (
      <SectionFrame
        eyebrow="Project plan"
        title="Track the work from kickoff to launch."
        body="Milestones are grouped around movement: what is complete, what is active, and what comes next."
      >
        <ProjectFlow steps={portalSteps} />
        <MilestonePanel milestones={milestones} />
      </SectionFrame>
    );
  }

  if (activeSection === 'onboarding') {
    return (
      <SectionFrame
        eyebrow="Onboarding"
        title="Keep setup inputs separate from project tracking."
        body="This section gives the client one obvious place to finish their intake, check what is complete, and continue the setup flow."
      >
        <OnboardingSection portalReadinessGate={portalReadinessGate} portalSteps={portalSteps} />
      </SectionFrame>
    );
  }

  if (activeSection === 'files') {
    return (
      <SectionFrame
        eyebrow="Files and assets"
        title="Upload, replace, and review project materials."
        body="Asset buckets stay together so clients do not have to hunt through the timeline for missing files."
      >
        <PortalAssetLibrary
          assetBuckets={assetBuckets}
          assets={portalAssets}
          canUpload={accessCanSubmit}
          projectSlug={portalProject.slug}
        />
      </SectionFrame>
    );
  }

  if (activeSection === 'reviews') {
    return (
      <SectionFrame
        eyebrow="Reviews and approvals"
        title="Make decisions without losing the project thread."
        body="Deliverables, notes, approval status, and revision requests live in one focused review workspace."
      >
        <PortalApprovalsPanel approvals={portalApprovals} canRespond={accessCanSubmit} />
      </SectionFrame>
    );
  }

  if (activeSection === 'requests') {
    return (
      <SectionFrame
        eyebrow="Request Center"
        title="Keep changes, support, and scope decisions in one place."
        body="Clients can submit a request, and anything outside the agreed scope waits for a recorded approve, decline, or park decision before work starts."
      >
        <PortalRequestCenter
          canSubmit={accessCanSubmit}
          projectSlug={portalProject.slug}
          requestSummary={portalRequests}
        />
      </SectionFrame>
    );
  }

  if (activeSection === 'billing') {
    return (
      <SectionFrame
        eyebrow="Billing and launch"
        title="Connect payments, handoff, and support."
        body="Finance and launch details are grouped together because they matter most near the end of the project."
      >
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <PortalFinancePanel invoices={portalFinanceHandoff.invoices} />
          <PortalHandoffPanel
            handoffItems={portalFinanceHandoff.handoffItems}
            supportNextSteps={portalFinanceHandoff.supportNextSteps}
          />
        </div>
      </SectionFrame>
    );
  }

  if (activeSection === 'activity') {
    return (
      <SectionFrame
        eyebrow="Activity and access"
        title="Review updates and portal boundaries."
        body="The full event stream and privacy guidance stay out of the day-to-day project view until someone needs them."
      >
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <ActivityPanel portalActivity={portalActivity} />
          <PortalComplianceNotice compact />
        </div>
      </SectionFrame>
    );
  }

  return (
    <SectionFrame
      eyebrow="Overview"
      title="Start with what needs attention now."
      body="The overview keeps the client oriented before they jump into files, approvals, billing, or the full activity log."
    >
      <OverviewSection
        assetBuckets={assetBuckets}
        milestones={milestones}
        portalActivity={portalActivity}
        portalApprovals={portalApprovals}
        portalFinanceHandoff={portalFinanceHandoff}
        portalReadinessGate={portalReadinessGate}
        portalRequests={portalRequests}
        portalSteps={portalSteps}
      />
    </SectionFrame>
  );
}

function SectionFrame({
  body,
  children,
  eyebrow,
  title,
}: {
  body: string;
  children: React.ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <section className="min-w-0">
      <div className="mb-5 rounded-lg border border-white/10 bg-[#181818] p-5 md:p-6">
        <p className="font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#FC6E20]">
          {eyebrow}
        </p>
        <h2 className="mt-3 font-playfair text-3xl font-bold text-white md:text-4xl">{title}</h2>
        <p className="mt-3 max-w-3xl font-montserrat text-sm leading-6 text-stone-400 md:text-base">
          {body}
        </p>
      </div>
      <div className="grid gap-6">{children}</div>
    </section>
  );
}

function OverviewSection({
  assetBuckets,
  milestones,
  portalActivity,
  portalApprovals,
  portalFinanceHandoff,
  portalReadinessGate,
  portalRequests,
  portalSteps,
}: {
  assetBuckets: AssetBucket[];
  milestones: MilestoneRecord[];
  portalActivity: ActivityItem[];
  portalApprovals: PortalDeliverableApproval[];
  portalFinanceHandoff: PortalFinanceHandoffData;
  portalReadinessGate: PortalReadinessGateData;
  portalRequests: PortalRequestSummary;
  portalSteps: PortalStep[];
}) {
  const currentMilestone = getCurrentMilestone(milestones);
  const waitingApprovals = portalApprovals.filter((approval) => approval.status === 'waiting_review').length;
  const missingAssetBuckets = assetBuckets.filter((bucket) => bucket.files === 0).length;
  const billingActions = portalFinanceHandoff.invoices.filter((invoice) => invoice.status === 'due' || invoice.status === 'overdue').length;
  const onboardingStep = getStepByTitle(portalSteps, 'Onboarding');

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <OverviewMetric
          href="/portal?section=plan"
          icon={FolderKanban}
          label="Current milestone"
          value={currentMilestone?.label ?? 'Project active'}
          detail={currentMilestone ? `${currentMilestone.state} / ${currentMilestone.date}` : 'Timeline is active'}
        />
        <OverviewMetric
          href="/portal?section=onboarding"
          icon={CheckCircle2}
          label="Onboarding"
          value={onboardingStep?.status ?? 'Open'}
          detail={onboardingStep?.detail ?? 'Project setup inputs are available'}
        />
        <OverviewMetric
          href="/portal?section=onboarding"
          icon={ShieldCheck}
          label="Contract / SOW"
          value={portalReadinessGate.isReadyForActiveDelivery ? 'Ready' : 'Blocked'}
          detail={`Agreement: ${portalReadinessGate.contractStatusLabel} / SOW: ${portalReadinessGate.sowStatusLabel} / Deposit: ${portalReadinessGate.depositStatusLabel}`}
        />
        <OverviewMetric
          href="/portal?section=files"
          icon={UploadCloud}
          label="Asset gaps"
          value={`${missingAssetBuckets}`}
          detail="Buckets still waiting for files"
        />
        <OverviewMetric
          href="/portal?section=reviews"
          icon={FileCheck2}
          label="Approvals"
          value={`${waitingApprovals}`}
          detail="Deliverables waiting for review"
        />
        <OverviewMetric
          href="/portal?section=requests"
          icon={MessageSquareText}
          label="Requests"
          value={portalRequests.waitingApprovalCount ? `${portalRequests.waitingApprovalCount}` : `${portalRequests.openCount}`}
          detail={
            portalRequests.waitingApprovalCount
              ? 'Scope decisions waiting for client approval'
              : 'Open changes, questions, or support requests'
          }
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ProjectFlow steps={portalSteps} compact />
        <div className="grid gap-4">
          <ActionPanel
            href="/portal?section=billing"
            icon={ReceiptText}
            label="Billing and launch"
            title={`${billingActions} payment action${billingActions === 1 ? '' : 's'} visible`}
            body="Invoice status, launch handoff, and after-launch support are grouped together."
          />
          <ActionPanel
            href="/portal?section=activity"
            icon={BellRing}
            label="Latest update"
            title={portalActivity[0]?.title ?? 'No recent activity yet'}
            body={portalActivity[0]?.meta ?? 'Project updates will appear as the studio records activity.'}
          />
        </div>
      </div>
    </>
  );
}

function OverviewMetric({
  detail,
  href,
  icon: Icon,
  label,
  value,
}: {
  detail: string;
  href: string;
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <Link
      href={href}
      className="group min-h-40 rounded-lg border border-white/10 bg-[#181818] p-5 transition-colors hover:border-[#FC6E20]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FC6E20]"
    >
      <div className="flex items-center justify-between gap-3">
        <Icon className="h-5 w-5 text-[#FC6E20]" />
        <ChevronRight className="h-4 w-4 text-stone-600 transition-transform group-hover:translate-x-1 group-hover:text-[#FC6E20]" />
      </div>
      <p className="mt-5 font-montserrat text-[11px] font-bold uppercase tracking-[0.18em] text-stone-500">
        {label}
      </p>
      <p className="mt-2 font-playfair text-3xl font-bold leading-tight text-white">{value}</p>
      <p className="mt-3 font-montserrat text-sm leading-6 text-stone-400">{detail}</p>
    </Link>
  );
}

function ActionPanel({
  body,
  href,
  icon: Icon,
  label,
  title,
}: {
  body: string;
  href: string;
  icon: LucideIcon;
  label: string;
  title: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-lg border border-white/10 bg-[#181818] p-5 transition-colors hover:border-[#FC6E20]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FC6E20]"
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-[#FC6E20]" />
        <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.18em] text-stone-500">
          {label}
        </p>
      </div>
      <h3 className="mt-4 font-playfair text-2xl font-bold text-white">{title}</h3>
      <p className="mt-3 font-montserrat text-sm leading-6 text-stone-400">{body}</p>
    </Link>
  );
}

function ProjectFlow({
  compact = false,
  steps,
}: {
  compact?: boolean;
  steps: PortalStep[];
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#181818] p-5 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-montserrat text-[11px] font-bold uppercase tracking-[0.18em] text-[#FC6E20]">
            Guided flow
          </p>
          <h3 className="mt-2 font-playfair text-3xl font-bold text-white">From setup to approval</h3>
        </div>
        <p className="font-montserrat text-xs leading-5 text-stone-500">
          {compact ? 'Open the Project Plan tab for the full timeline.' : 'Each stage has a clearer home in the portal.'}
        </p>
      </div>

      <div className={`mt-6 grid gap-3 ${compact ? 'md:grid-cols-2' : 'xl:grid-cols-4'}`}>
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <article key={step.title} className="rounded-lg border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-stone-500">{String(index + 1).padStart(2, '0')}</span>
                <Icon className="h-5 w-5 text-[#FC6E20]" />
              </div>
              <h4 className="mt-4 font-montserrat text-sm font-semibold text-white">{step.title}</h4>
              <p className="mt-2 font-montserrat text-xs font-bold uppercase tracking-[0.14em] text-stone-500">
                {step.status}
              </p>
              <p className="mt-3 font-montserrat text-sm leading-6 text-stone-400">{step.detail}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function MilestonePanel({ milestones }: { milestones: MilestoneRecord[] }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#181818] p-5 md:p-6">
      <div className="mb-6 flex items-center gap-3">
        <Clock3 className="h-5 w-5 text-[#FC6E20]" />
        <h3 className="font-playfair text-3xl font-bold text-white">Milestones</h3>
      </div>
      <div className="grid gap-3">
        {milestones.map((milestone, index) => (
          <article
            key={milestone.label}
            className="grid gap-4 rounded-lg border border-white/10 bg-black/20 p-4 md:grid-cols-[auto_1fr_auto] md:items-center"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 font-mono text-xs text-stone-400">
              {String(index + 1).padStart(2, '0')}
            </div>
            <div className="min-w-0">
              <p className="font-montserrat text-sm font-semibold text-white">{milestone.label}</p>
              {milestone.detail ? (
                <p className="mt-2 font-montserrat text-sm leading-6 text-stone-400">{milestone.detail}</p>
              ) : null}
              <p className="mt-2 font-montserrat text-xs text-stone-500">
                Owner: {milestone.owner ?? 'Kreative Reflow'}
                {milestone.ownerRole ? ` / ${milestone.ownerRole}` : ''}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:justify-end">
              <span className="rounded-full border border-white/10 px-3 py-1 font-montserrat text-[11px] uppercase tracking-[0.14em] text-stone-400">
                {milestone.state}
              </span>
              <span className="font-mono text-xs text-stone-400">{milestone.date}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function OnboardingSection({
  portalReadinessGate,
  portalSteps,
}: {
  portalReadinessGate: PortalReadinessGateData;
  portalSteps: PortalStep[];
}) {
  const onboarding = getStepByTitle(portalSteps, 'Onboarding');
  const assetStep = getStepByTitle(portalSteps, 'Assets');

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-lg border border-[#FC6E20]/30 bg-[#FC6E20]/10 p-6">
          <CheckCircle2 className="h-6 w-6 text-[#FC6E20]" />
          <h3 className="mt-5 font-playfair text-3xl font-bold text-white">
            {onboarding?.status === 'Complete' ? 'Onboarding is complete.' : 'Onboarding needs attention.'}
          </h3>
          <p className="mt-3 font-montserrat text-sm leading-6 text-stone-300">
            {onboarding?.detail ?? 'The project questionnaire is ready for the client to complete.'}
          </p>
          <Link
            href="/portal/onboarding"
            className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#FC6E20] px-5 font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-stone-950 transition-colors hover:bg-[#e05a15] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FC6E20]"
          >
            Open onboarding
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-lg border border-white/10 bg-[#181818] p-6">
          <div className="flex items-center gap-3">
            <UploadCloud className="h-5 w-5 text-[#FC6E20]" />
            <h3 className="font-playfair text-3xl font-bold text-white">Setup checklist</h3>
          </div>
          <div className="mt-6 grid gap-3">
            <ChecklistItem
              done={onboarding?.status === 'Complete'}
              label="Questionnaire"
              detail={onboarding?.detail ?? 'Questionnaire status will appear here.'}
            />
            <ChecklistItem
              done={assetStep?.status === 'Complete'}
              label="Assets"
              detail={assetStep?.detail ?? 'Asset readiness will appear here.'}
            />
            <ChecklistItem
              done={portalReadinessGate.isReadyForActiveDelivery}
              label="Commercial readiness"
              detail={portalReadinessGate.nextAction}
            />
          </div>
        </div>
      </div>

      <PortalReadinessGatePanel readinessGate={portalReadinessGate} />
    </>
  );
}

function ChecklistItem({
  detail,
  done,
  label,
}: {
  detail: string;
  done: boolean;
  label: string;
}) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-3 rounded-lg border border-white/10 bg-black/20 p-4">
      <CheckCircle2 className={`mt-0.5 h-5 w-5 ${done ? 'text-[#FC6E20]' : 'text-stone-600'}`} />
      <div>
        <p className="font-montserrat text-sm font-semibold text-white">{label}</p>
        <p className="mt-2 font-montserrat text-sm leading-6 text-stone-400">{detail}</p>
      </div>
    </div>
  );
}

function ActivityPanel({ portalActivity }: { portalActivity: ActivityItem[] }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#181818] p-6">
      <div className="mb-6 flex items-center gap-3">
        <FileText className="h-5 w-5 text-[#FC6E20]" />
        <h3 className="font-playfair text-3xl font-bold text-white">Activity</h3>
      </div>
      <div className="space-y-4">
        {portalActivity.length ? (
          portalActivity.map((activity) => (
            <div key={`${activity.time}-${activity.title}`} className="border-t border-white/10 pt-4 first:border-t-0 first:pt-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-montserrat text-sm font-semibold text-white">{activity.title}</p>
                  <p className="mt-2 font-montserrat text-sm text-stone-400">{activity.meta}</p>
                </div>
                <span className="font-mono text-xs text-stone-500">{activity.time}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-lg border border-dashed border-white/10 bg-black/20 p-4 font-montserrat text-sm leading-6 text-stone-400">
            Project activity will appear here once the studio records updates.
          </p>
        )}
      </div>
    </div>
  );
}
