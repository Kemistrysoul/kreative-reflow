import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { SiteFooter } from '@/components/SiteFooter';
import { PortalComplianceNotice } from '@/components/portal/PortalComplianceNotice';
import { PortalHeader } from '@/components/portal/PortalChrome';
import { getPortalAuthConfig, sanitizePortalNextPath } from '@/lib/portal-auth-config';
import { getPortalAuthState } from '@/lib/portal-auth';
import { PortalLoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Secure Workspace Login | Kreative Reflow',
  description: 'Secure client portal and studio access for Kreative Reflow projects.',
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = 'force-dynamic';

export default async function PortalLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[]; reason?: string | string[] }>;
}) {
  const params = await searchParams;
  const nextPath = sanitizePortalNextPath(params.next);
  const authConfigured = Boolean(getPortalAuthConfig());
  const authState = await getPortalAuthState();

  if (authState.status === 'authenticated') {
    redirect(nextPath);
  }

  return (
    <>
      <main className="min-h-screen bg-[#111111] text-stone-100">
        <PortalHeader />
        <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <aside className="space-y-6">
            <div className="rounded-lg border border-white/10 bg-[#181818] p-6">
              <LockKeyhole className="h-6 w-6 text-[#FC6E20]" />
              <h2 className="mt-5 font-playfair text-3xl font-bold text-white">Protected workspace</h2>
              <p className="mt-3 font-montserrat text-sm leading-6 text-stone-400">
                Client project details, onboarding answers, assets, approvals, studio dashboards, and handoff notes stay behind authenticated access.
              </p>
            </div>
            <div className="rounded-lg border border-[#FC6E20]/35 bg-[#FC6E20] p-6 text-stone-950">
              <ShieldCheck className="h-6 w-6" />
              <h2 className="mt-4 font-playfair text-2xl font-bold">Access boundary</h2>
              <p className="mt-3 font-montserrat text-sm leading-6">
                The public website can explain the service. The portal is for invited project members only.
              </p>
            </div>
            <PortalComplianceNotice compact />
          </aside>

          <PortalLoginForm authConfigured={authConfigured} nextPath={nextPath} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
