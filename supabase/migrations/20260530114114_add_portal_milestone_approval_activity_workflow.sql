alter table public.portal_project_milestones
  add column if not exists owner_name text not null default 'Kreative Reflow',
  add column if not exists owner_role text not null default 'Studio',
  add column if not exists detail text not null default '',
  add column if not exists completed_at timestamptz;

create table if not exists public.portal_project_notification_rules (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.portal_projects(id) on delete cascade,
  event_type text not null check (
    event_type in (
      'milestone_completed',
      'deliverable_published',
      'approval_submitted',
      'revision_requested',
      'asset_uploaded',
      'asset_reviewed'
    )
  ),
  label text not null,
  surface text not null default 'portal_activity' check (surface in ('portal_activity', 'studio_queue')),
  client_visible boolean not null default true,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, event_type, surface)
);

create table if not exists public.portal_project_deliverables (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.portal_projects(id) on delete cascade,
  milestone_id uuid references public.portal_project_milestones(id) on delete set null,
  title text not null,
  version_label text not null,
  summary text not null default '',
  status text not null default 'waiting_review' check (
    status in ('waiting_review', 'approved', 'revision_requested', 'superseded')
  ),
  due_on date,
  client_visible boolean not null default true,
  published_at timestamptz,
  approved_at timestamptz,
  approved_by_user_id uuid references auth.users(id) on delete set null,
  approved_by_email text not null default '',
  revision_requested_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, title, version_label)
);

create table if not exists public.portal_project_approval_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.portal_projects(id) on delete cascade,
  deliverable_id uuid not null references public.portal_project_deliverables(id) on delete cascade,
  decision text not null check (decision in ('approved', 'revision_requested')),
  note text not null default '',
  decided_by_user_id uuid references auth.users(id) on delete set null,
  decided_by_email text not null,
  decided_by_role text not null default '',
  decided_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.portal_project_notification_rules enable row level security;
alter table public.portal_project_deliverables enable row level security;
alter table public.portal_project_approval_events enable row level security;

alter table public.portal_project_activity
  add column if not exists activity_type text not null default 'project_update',
  add column if not exists source_table text,
  add column if not exists source_record_id uuid,
  add column if not exists actor_email text not null default '',
  add column if not exists client_visible boolean not null default true,
  add column if not exists notification_rule_id uuid references public.portal_project_notification_rules(id) on delete set null;

create index if not exists portal_project_milestones_project_state_idx
on public.portal_project_milestones (project_id, state, due_on);

create index if not exists portal_project_deliverables_project_status_idx
on public.portal_project_deliverables (project_id, status, due_on);

create index if not exists portal_project_approval_events_project_idx
on public.portal_project_approval_events (project_id, decided_at desc);

create index if not exists portal_project_activity_visible_idx
on public.portal_project_activity (project_id, client_visible, occurred_at desc);

grant select, insert, update, delete
on table
  public.portal_project_notification_rules,
  public.portal_project_deliverables,
  public.portal_project_approval_events
to service_role;

grant select
on table
  public.portal_project_notification_rules,
  public.portal_project_deliverables,
  public.portal_project_approval_events
to authenticated;

grant insert
on table public.portal_project_approval_events
to authenticated;

drop policy if exists "portal members can view notification rules" on public.portal_project_notification_rules;
drop policy if exists "portal members can view project deliverables" on public.portal_project_deliverables;
drop policy if exists "portal members can view approval events" on public.portal_project_approval_events;
drop policy if exists "portal contributors can insert approval events" on public.portal_project_approval_events;
drop policy if exists "portal studio admins can manage notification rules" on public.portal_project_notification_rules;
drop policy if exists "portal studio admins can manage deliverables" on public.portal_project_deliverables;
drop policy if exists "portal members can view project activity" on public.portal_project_activity;

create policy "portal members can view notification rules"
on public.portal_project_notification_rules
for select
to authenticated
using (
  enabled is true
  and exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_notification_rules.project_id
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal members can view project deliverables"
on public.portal_project_deliverables
for select
to authenticated
using (
  client_visible is true
  and exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_deliverables.project_id
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal members can view approval events"
on public.portal_project_approval_events
for select
to authenticated
using (
  exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_approval_events.project_id
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal contributors can insert approval events"
on public.portal_project_approval_events
for insert
to authenticated
with check (
  exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_approval_events.project_id
      and member.role in ('studio_admin', 'client_owner', 'client_collaborator')
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal studio admins can manage notification rules"
on public.portal_project_notification_rules
for all
to authenticated
using (
  exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_notification_rules.project_id
      and member.role = 'studio_admin'
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
)
with check (
  exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_notification_rules.project_id
      and member.role = 'studio_admin'
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal studio admins can manage deliverables"
on public.portal_project_deliverables
for all
to authenticated
using (
  exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_deliverables.project_id
      and member.role = 'studio_admin'
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
)
with check (
  exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_deliverables.project_id
      and member.role = 'studio_admin'
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal members can view project activity"
on public.portal_project_activity
for select
to authenticated
using (
  exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_activity.project_id
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
      and (
        portal_project_activity.client_visible is true
        or member.role = 'studio_admin'
      )
  )
);

insert into public.portal_project_notification_rules (
  project_id,
  event_type,
  label,
  surface,
  client_visible,
  enabled
)
select
  project.id,
  seed.event_type,
  seed.label,
  seed.surface,
  seed.client_visible,
  seed.enabled
from public.portal_projects as project
cross join (
  values
    ('milestone_completed', 'Milestone changes appear in client activity', 'portal_activity', true, true),
    ('deliverable_published', 'New deliverables appear for approval', 'portal_activity', true, true),
    ('approval_submitted', 'Client approvals notify the studio and portal', 'portal_activity', true, true),
    ('revision_requested', 'Revision requests stay visible until resolved', 'portal_activity', true, true),
    ('asset_uploaded', 'Client uploads are logged in activity', 'portal_activity', true, true),
    ('asset_reviewed', 'Studio asset review decisions are logged', 'portal_activity', true, true)
) as seed(event_type, label, surface, client_visible, enabled)
where project.slug = 'abc-engineering-website-redesign'
on conflict (project_id, event_type, surface) do update
set label = excluded.label,
    client_visible = excluded.client_visible,
    enabled = excluded.enabled,
    updated_at = now();

insert into public.portal_project_milestones (
  project_id,
  label,
  state,
  due_on,
  owner_name,
  owner_role,
  detail,
  completed_at,
  sort_order
)
select
  project.id,
  seed.label,
  seed.state,
  seed.due_on,
  seed.owner_name,
  seed.owner_role,
  seed.detail,
  seed.completed_at,
  seed.sort_order
from public.portal_projects as project
cross join (
  values
    ('Onboarding complete', 'Done', date '2026-05-15', 'ABC Engineering', 'Client owner', 'Kickoff questionnaire and discovery inputs are captured.', timestamptz '2026-05-15 16:00:00+02', 10),
    ('Sitemap and wireframes', 'Done', date '2026-05-22', 'Kreative Reflow', 'Studio', 'Structure and wireframes are approved for design.', timestamptz '2026-05-22 15:00:00+02', 20),
    ('Homepage design concept', 'Review', date '2026-05-30', 'Kreative Reflow', 'Studio', 'Homepage concept v1 is waiting for client approval or revision notes.', null, 30),
    ('Development sprint', 'Upcoming', date '2026-06-10', 'Kreative Reflow', 'Studio', 'Development begins after homepage direction is approved.', null, 40),
    ('Testing and revisions', 'Upcoming', date '2026-06-28', 'Kreative Reflow', 'Studio + client', 'QA and revision checks before launch handoff.', null, 50),
    ('Launch and handoff', 'Upcoming', date '2026-07-10', 'Kreative Reflow', 'Studio', 'Final launch, training notes, and support handoff.', null, 60)
) as seed(label, state, due_on, owner_name, owner_role, detail, completed_at, sort_order)
where project.slug = 'abc-engineering-website-redesign'
on conflict (project_id, label) do update
set state = excluded.state,
    due_on = excluded.due_on,
    owner_name = excluded.owner_name,
    owner_role = excluded.owner_role,
    detail = excluded.detail,
    completed_at = excluded.completed_at,
    sort_order = excluded.sort_order,
    updated_at = now();

insert into public.portal_project_deliverables (
  project_id,
  milestone_id,
  title,
  version_label,
  summary,
  status,
  due_on,
  client_visible,
  published_at,
  approved_at,
  approved_by_email,
  sort_order
)
select
  project.id,
  milestone.id,
  seed.title,
  seed.version_label,
  seed.summary,
  seed.status,
  seed.due_on,
  true,
  seed.published_at,
  seed.approved_at,
  seed.approved_by_email,
  seed.sort_order
from public.portal_projects as project
join public.portal_project_milestones as milestone
  on milestone.project_id = project.id
cross join (
  values
    ('Sitemap and wireframes', 'Sitemap and wireframes', 'v1', 'Approved sitemap and wireframe direction for the website structure.', 'approved', date '2026-05-22', timestamptz '2026-05-22 11:30:00+02', timestamptz '2026-05-22 15:00:00+02', 'approver@abc-engineering.example', 10),
    ('Homepage design concept', 'Homepage design concept', 'v1', 'Homepage concept ready for client review before the development sprint opens.', 'waiting_review', date '2026-05-30', timestamptz '2026-05-30 09:15:00+02', null, '', 20)
) as seed(milestone_label, title, version_label, summary, status, due_on, published_at, approved_at, approved_by_email, sort_order)
where project.slug = 'abc-engineering-website-redesign'
  and milestone.label = seed.milestone_label
on conflict (project_id, title, version_label) do update
set milestone_id = excluded.milestone_id,
    summary = excluded.summary,
    status = excluded.status,
    due_on = excluded.due_on,
    client_visible = excluded.client_visible,
    published_at = excluded.published_at,
    approved_at = excluded.approved_at,
    approved_by_email = excluded.approved_by_email,
    sort_order = excluded.sort_order,
    updated_at = now();

insert into public.portal_project_approval_events (
  project_id,
  deliverable_id,
  decision,
  note,
  decided_by_email,
  decided_by_role,
  decided_at
)
select
  deliverable.project_id,
  deliverable.id,
  'approved',
  'Sitemap and wireframe direction approved for design.',
  'approver@abc-engineering.example',
  'Client owner',
  timestamptz '2026-05-22 15:00:00+02'
from public.portal_project_deliverables as deliverable
join public.portal_projects as project
  on project.id = deliverable.project_id
where project.slug = 'abc-engineering-website-redesign'
  and deliverable.title = 'Sitemap and wireframes'
  and deliverable.version_label = 'v1'
  and not exists (
    select 1
    from public.portal_project_approval_events as existing
    where existing.deliverable_id = deliverable.id
      and existing.decision = 'approved'
      and existing.decided_by_email = 'approver@abc-engineering.example'
  );

delete from public.portal_project_activity as activity
using public.portal_projects as project
where activity.project_id = project.id
  and project.slug = 'abc-engineering-website-redesign'
  and activity.source_table is null
  and activity.title in (
    'Homepage design v1 uploaded for review',
    'Client uploaded two service description documents',
    'Milestone completed: Sitemap and wireframes',
    'Deposit invoice marked paid'
  );

insert into public.portal_project_activity (
  project_id,
  occurred_at,
  display_time,
  title,
  meta,
  sort_order,
  activity_type,
  source_table,
  source_record_id,
  actor_email,
  client_visible,
  notification_rule_id
)
select
  milestone.project_id,
  milestone.completed_at,
  'May 22',
  'Milestone completed: Sitemap and wireframes',
  'Structure and wireframes approved for design.',
  20,
  'milestone_completed',
  'portal_project_milestones',
  milestone.id,
  '',
  true,
  rule.id
from public.portal_project_milestones as milestone
join public.portal_projects as project
  on project.id = milestone.project_id
left join public.portal_project_notification_rules as rule
  on rule.project_id = milestone.project_id
  and rule.event_type = 'milestone_completed'
  and rule.surface = 'portal_activity'
where project.slug = 'abc-engineering-website-redesign'
  and milestone.label = 'Sitemap and wireframes'
on conflict (project_id, title, display_time) do update
set occurred_at = excluded.occurred_at,
    meta = excluded.meta,
    sort_order = excluded.sort_order,
    activity_type = excluded.activity_type,
    source_table = excluded.source_table,
    source_record_id = excluded.source_record_id,
    client_visible = excluded.client_visible,
    notification_rule_id = excluded.notification_rule_id,
    updated_at = now();

insert into public.portal_project_activity (
  project_id,
  occurred_at,
  display_time,
  title,
  meta,
  sort_order,
  activity_type,
  source_table,
  source_record_id,
  actor_email,
  client_visible,
  notification_rule_id
)
select
  event.project_id,
  event.decided_at,
  'May 22',
  'Deliverable approved: Sitemap and wireframes v1',
  'Approved by approver@abc-engineering.example.',
  10,
  'approval_submitted',
  'portal_project_approval_events',
  event.id,
  event.decided_by_email,
  true,
  rule.id
from public.portal_project_approval_events as event
join public.portal_project_deliverables as deliverable
  on deliverable.id = event.deliverable_id
join public.portal_projects as project
  on project.id = event.project_id
left join public.portal_project_notification_rules as rule
  on rule.project_id = event.project_id
  and rule.event_type = 'approval_submitted'
  and rule.surface = 'portal_activity'
where project.slug = 'abc-engineering-website-redesign'
  and deliverable.title = 'Sitemap and wireframes'
  and deliverable.version_label = 'v1'
  and event.decision = 'approved'
on conflict (project_id, title, display_time) do update
set occurred_at = excluded.occurred_at,
    meta = excluded.meta,
    sort_order = excluded.sort_order,
    activity_type = excluded.activity_type,
    source_table = excluded.source_table,
    source_record_id = excluded.source_record_id,
    actor_email = excluded.actor_email,
    client_visible = excluded.client_visible,
    notification_rule_id = excluded.notification_rule_id,
    updated_at = now();

insert into public.portal_project_activity (
  project_id,
  occurred_at,
  display_time,
  title,
  meta,
  sort_order,
  activity_type,
  source_table,
  source_record_id,
  actor_email,
  client_visible,
  notification_rule_id
)
select
  deliverable.project_id,
  deliverable.published_at,
  'Today 09:15',
  'Deliverable ready: Homepage design concept v1',
  'Client approval or revision notes are needed before development starts.',
  0,
  'deliverable_published',
  'portal_project_deliverables',
  deliverable.id,
  '',
  true,
  rule.id
from public.portal_project_deliverables as deliverable
join public.portal_projects as project
  on project.id = deliverable.project_id
left join public.portal_project_notification_rules as rule
  on rule.project_id = deliverable.project_id
  and rule.event_type = 'deliverable_published'
  and rule.surface = 'portal_activity'
where project.slug = 'abc-engineering-website-redesign'
  and deliverable.title = 'Homepage design concept'
  and deliverable.version_label = 'v1'
on conflict (project_id, title, display_time) do update
set occurred_at = excluded.occurred_at,
    meta = excluded.meta,
    sort_order = excluded.sort_order,
    activity_type = excluded.activity_type,
    source_table = excluded.source_table,
    source_record_id = excluded.source_record_id,
    client_visible = excluded.client_visible,
    notification_rule_id = excluded.notification_rule_id,
    updated_at = now();
