create table if not exists public.portal_onboarding_responses (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.portal_projects(id) on delete cascade,
  response_status text not null default 'draft' check (response_status in ('draft', 'submitted')),
  contact_name text not null default '',
  contact_email text not null,
  approval_role text not null default '',
  project_goals text not null default '',
  primary_audience text not null default '',
  services text[] not null default '{}',
  access_needs text not null default '',
  brand_assets_status text not null default 'Not sure yet',
  technical_accounts text not null default '',
  preferred_deadline date,
  launch_constraints text not null default '',
  content_notes text not null default '',
  consent_to_terms boolean not null default false,
  submitted_at timestamptz,
  last_saved_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, contact_email)
);

create index if not exists portal_onboarding_responses_project_status_idx
on public.portal_onboarding_responses (project_id, response_status);

alter table public.portal_onboarding_responses enable row level security;

grant select, insert, update, delete
on table public.portal_onboarding_responses
to service_role;

insert into public.portal_onboarding_responses (
  project_id,
  response_status,
  contact_name,
  contact_email,
  approval_role,
  project_goals,
  primary_audience,
  services,
  access_needs,
  brand_assets_status,
  technical_accounts,
  preferred_deadline,
  launch_constraints,
  content_notes,
  consent_to_terms,
  submitted_at,
  last_saved_at
)
select
  project.id,
  'submitted',
  'Demo Approver',
  'approver@abc-engineering.example',
  'Operations lead',
  'Clarify the service offer, make quote requests easier, and give the team one reliable place to track design, content, and launch handoff.',
  'Procurement teams, plant managers, and safety-conscious buyers comparing engineering suppliers before requesting a quote.',
  array['Website redesign', 'Custom client portal'],
  'Domain, analytics, and current hosting access still need owner confirmation.',
  'Partly ready',
  'Hosting is owned by the client. Analytics access needs to be invited before launch QA.',
  date '2026-07-10',
  'Avoid end-of-month shutdown period and keep approvals with the operations lead.',
  'Services copy exists but needs final technical review before build lock.',
  true,
  timestamptz '2026-05-30 10:45:00+02',
  timestamptz '2026-05-30 10:45:00+02'
from public.portal_projects as project
where project.slug = 'abc-engineering-website-redesign'
on conflict (project_id, contact_email) do update
set response_status = excluded.response_status,
    contact_name = excluded.contact_name,
    approval_role = excluded.approval_role,
    project_goals = excluded.project_goals,
    primary_audience = excluded.primary_audience,
    services = excluded.services,
    access_needs = excluded.access_needs,
    brand_assets_status = excluded.brand_assets_status,
    technical_accounts = excluded.technical_accounts,
    preferred_deadline = excluded.preferred_deadline,
    launch_constraints = excluded.launch_constraints,
    content_notes = excluded.content_notes,
    consent_to_terms = excluded.consent_to_terms,
    submitted_at = excluded.submitted_at,
    last_saved_at = excluded.last_saved_at,
    updated_at = now();
