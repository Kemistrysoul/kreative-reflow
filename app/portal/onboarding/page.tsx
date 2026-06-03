import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ClipboardCheck, Clock3 } from 'lucide-react';
import { SiteFooter } from '@/components/SiteFooter';
import { PortalAccessState } from '@/components/portal/PortalAccessState';
import { PortalComplianceNotice } from '@/components/portal/PortalComplianceNotice';
import { PortalHeader, PortalPreviewNotice } from '@/components/portal/PortalChrome';
import { getPortalAccess } from '@/lib/portal-access';
import { requirePortalAuth } from '@/lib/portal-auth';
import { getAuthorizedPortalProjectData } from '@/lib/portal-projects';
import { onboardingRequirementGroups } from '@/lib/portal-onboarding';
import { OnboardingForm } from './onboarding-form';

export const metadata: Metadata = {
  title: 'Client Onboarding | Kreative Reflow',
  description: 'Client portal onboarding questionnaire for project kickoff details.',
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = 'force-dynamic';

export default async function PortalOnboardingPage() {
  await requirePortalAuth('/portal/onboarding');
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

  const portalData = await getAuthorizedPortalProjectData(access.projectSlug);

  if (!portalData) {
    return (
      <>
        <main className="min-h-screen bg-[#111111] text-stone-100">
          <PortalHeader />
          <PortalAccessState
            state={{
              status: 'empty',
              auth: access.auth,
              message: 'Your portal membership is valid, but no onboarding project record is available yet.',
            }}
          />
        </main>
        <SiteFooter />
      </>
    );
  }

  const { project } = portalData;

  return (
    <>
      <main className="min-h-screen bg-[#111111] text-stone-100">
        <PortalHeader />
        <PortalPreviewNotice />

        <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
          <aside className="space-y-6">
            <div className="rounded-lg border border-white/10 bg-[#181818] p-6">
              <Link
                href="/portal"
                className="inline-flex items-center gap-2 font-montserrat text-xs font-bold uppercase tracking-[0.16em] text-stone-500 transition-colors hover:text-[#FC6E20] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FC6E20]"
              >
                <ArrowLeft className="h-4 w-4" />
                Portal
              </Link>
              <p className="mt-8 font-montserrat text-xs font-bold uppercase tracking-[0.22em] text-[#FC6E20]">
                {project.clientName}
              </p>
              <h1 className="mt-3 font-playfair text-4xl font-bold leading-tight text-white">
                {project.projectName}
              </h1>
              <p className="mt-4 font-montserrat text-sm leading-6 text-stone-400">
                This questionnaire captures the first project-specific client action
                before assets, approvals, and launch handoff are opened.
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-[#181818] p-6">
              <div className="mb-5 flex items-center gap-3">
                <ClipboardCheck className="h-5 w-5 text-[#FC6E20]" />
                <h2 className="font-playfair text-2xl font-bold text-white">Kickoff checks</h2>
              </div>
              <div className="space-y-5">
                {onboardingRequirementGroups.map((group) => (
                  <div key={group.title} className="border-t border-white/10 pt-4">
                    <p className="font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
                      {group.title}
                    </p>
                    <ul className="mt-3 space-y-2 font-montserrat text-sm leading-6 text-stone-300">
                      {group.items.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#FC6E20]" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <PortalComplianceNotice compact />

            <div className="rounded-lg border border-white/10 bg-black/20 p-5">
              <div className="flex items-center gap-3">
                <Clock3 className="h-5 w-5 text-[#FC6E20]" />
                <p className="font-montserrat text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
                  Status
                </p>
              </div>
              <p className="mt-3 font-montserrat text-sm leading-6 text-stone-400">
                Draft saves are supported. Final submission requires the required
                fields and privacy acknowledgement.
              </p>
            </div>
          </aside>

          <OnboardingForm
            canSubmit={access.canSubmitOnboarding}
            projectSlug={project.slug}
            role={access.role}
          />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
