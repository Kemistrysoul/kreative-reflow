import type { Metadata } from 'next';
import { FileCheck2, Settings2, ShieldCheck } from 'lucide-react';
import {
  settingsPreferences,
  settingsProposalTemplates,
  settingsTemplates,
  settingsWorkspaceLinks,
  studioFocusNote,
  studioSettingsTabs,
} from '@/lib/dashboard-data';
import {
  StudioLinkRow,
  StudioPageHeader,
  StudioPanel,
} from '@/components/studio/primitives';

export const metadata: Metadata = {
  title: 'Studio Settings | Kreative Reflow',
  description: 'Settings dashboard for templates, workspace preferences, and portal-related controls.',
};

export default function StudioSettingsPage() {
  return (
    <div className="space-y-5">
      <StudioPageHeader
        eyebrow="Settings"
        title="Templates, preferences, and workspace controls"
        description="Keep the operational defaults here: repeatable emails, proposal structures, studio preferences, and links to workspace-level controls that support the rest of the app."
        tabs={studioSettingsTabs}
        activeTab="Templates"
      />

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <StudioPanel title="Email templates" eyebrow="Reusable messages" icon={FileCheck2}>
          <div className="space-y-3">
            {settingsTemplates.map((item) => (
              <StudioLinkRow key={item.title} title={item.title} description={item.description} />
            ))}
          </div>
        </StudioPanel>

        <StudioPanel title="Proposal and agreement templates" eyebrow="Commercial documents" icon={ShieldCheck}>
          <div className="space-y-3">
            {settingsProposalTemplates.map((item) => (
              <StudioLinkRow key={item.title} title={item.title} description={item.description} />
            ))}
          </div>
        </StudioPanel>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <StudioPanel title="Studio preferences" eyebrow="Internal defaults" icon={Settings2}>
          <div className="space-y-3">
            {settingsPreferences.map((item) => (
              <div key={item.label} className="rounded-[22px] border border-white/8 bg-[#151419] p-4">
                <p className="font-montserrat text-xs uppercase tracking-[0.16em] text-[#878787]">{item.label}</p>
                <p className="mt-2 font-montserrat text-sm font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </StudioPanel>

        <div className="space-y-5">
          <StudioPanel title="Workspace links" eyebrow="Operational controls">
            <div className="space-y-3">
              {settingsWorkspaceLinks.map((item) => (
                <StudioLinkRow key={item.title} title={item.title} description={item.description} />
              ))}
            </div>
          </StudioPanel>

          <StudioPanel title={studioFocusNote.title} eyebrow="Design rule" icon={studioFocusNote.icon}>
            <p className="font-montserrat text-sm leading-7 text-[#878787]">{studioFocusNote.body}</p>
          </StudioPanel>
        </div>
      </section>
    </div>
  );
}
