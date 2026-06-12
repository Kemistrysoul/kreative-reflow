create table if not exists public.portal_operational_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.portal_projects(id) on delete set null,
  event_type text not null check (
    event_type in (
      'approval_failure',
      'asset_failure',
      'auth_failure',
      'monitoring_note',
      'onboarding_failure',
      'project_data_error',
      'upload_failure'
    )
  ),
  severity text not null default 'warning' check (
    severity in ('critical', 'error', 'info', 'warning')
  ),
  title text not null,
  detail text not null default '',
  source_route text not null default '',
  actor_email text not null default '',
  event_metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(event_metadata) = 'object'),
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.portal_operational_events enable row level security;

create index if not exists portal_operational_events_project_created_idx
on public.portal_operational_events (project_id, created_at desc);

create index if not exists portal_operational_events_unresolved_idx
on public.portal_operational_events (severity, created_at desc)
where resolved_at is null;

create index if not exists portal_operational_events_event_type_idx
on public.portal_operational_events (event_type, created_at desc);

revoke all
on table public.portal_operational_events
from anon, authenticated;

grant select, insert, update, delete
on table public.portal_operational_events
to service_role;

grant select
on table public.portal_operational_events
to authenticated;

drop policy if exists "portal studio admins can view operational events" on public.portal_operational_events;

create policy "portal studio admins can view operational events"
on public.portal_operational_events
for select
to authenticated
using (
  exists (
    select 1
    from public.portal_project_members as member
    where member.role = 'studio_admin'
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
      and (
        portal_operational_events.project_id is null
        or member.project_id = portal_operational_events.project_id
      )
  )
);

insert into public.portal_operational_events (
  event_type,
  severity,
  title,
  detail,
  source_route,
  actor_email,
  event_metadata
)
select
  'auth_failure',
  'warning',
  'Portal auth monitoring ready',
  'Authentication failures and missing Supabase Auth configuration are now recorded for launch review.',
  '/api/portal/login',
  'system',
  '{"launch_gate":"auth"}'::jsonb
where not exists (
  select 1
  from public.portal_operational_events
  where title = 'Portal auth monitoring ready'
    and source_route = '/api/portal/login'
);

insert into public.portal_operational_events (
  event_type,
  severity,
  title,
  detail,
  source_route,
  actor_email,
  event_metadata
)
select
  'upload_failure',
  'warning',
  'Asset upload monitoring ready',
  'Failed uploads, storage configuration gaps, and asset metadata errors are now recorded for studio follow-up.',
  '/api/portal/assets',
  'system',
  '{"launch_gate":"uploads"}'::jsonb
where not exists (
  select 1
  from public.portal_operational_events
  where title = 'Asset upload monitoring ready'
    and source_route = '/api/portal/assets'
);

insert into public.portal_operational_events (
  event_type,
  severity,
  title,
  detail,
  source_route,
  actor_email,
  event_metadata
)
select
  'project_data_error',
  'warning',
  'Project data monitoring ready',
  'Project data, onboarding, approval, finance, and handoff read failures are now visible in the studio readiness panel.',
  '/studio/projects',
  'system',
  '{"launch_gate":"project_data"}'::jsonb
where not exists (
  select 1
  from public.portal_operational_events
  where title = 'Project data monitoring ready'
    and source_route = '/studio/projects'
);
