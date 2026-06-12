alter table public.portal_project_notification_rules
  drop constraint if exists portal_project_notification_rules_event_type_check;

alter table public.portal_project_notification_rules
  add constraint portal_project_notification_rules_event_type_check
  check (
    event_type in (
      'milestone_completed',
      'deliverable_published',
      'approval_submitted',
      'revision_requested',
      'asset_uploaded',
      'asset_reviewed',
      'invoice_status_changed',
      'handoff_updated',
      'support_next_step_added'
    )
  );

create table if not exists public.portal_project_invoices (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.portal_projects(id) on delete cascade,
  invoice_number text not null,
  label text not null,
  status text not null default 'waiting' check (
    status in ('cancelled', 'draft', 'due', 'overdue', 'paid', 'waiting')
  ),
  amount_label text not null default '',
  issued_on date,
  due_on date,
  paid_on date,
  payment_reference text not null default '',
  payment_link_label text not null default '',
  payment_url text,
  client_note text not null default '',
  internal_note text not null default '',
  client_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, invoice_number)
);

create table if not exists public.portal_project_handoff_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.portal_projects(id) on delete cascade,
  category text not null check (
    category in ('credentials', 'final_assets', 'launch', 'support')
  ),
  title text not null,
  detail text not null default '',
  status text not null default 'not_started' check (
    status in ('blocked', 'done', 'in_progress', 'not_started', 'waiting_client')
  ),
  owner_name text not null default 'Kreative Reflow',
  owner_role text not null default 'Studio',
  due_on date,
  completed_at timestamptz,
  client_note text not null default '',
  internal_note text not null default '',
  client_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, category, title)
);

create table if not exists public.portal_project_support_next_steps (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.portal_projects(id) on delete cascade,
  title text not null,
  description text not null default '',
  status text not null default 'recommended' check (
    status in ('active', 'available', 'declined', 'recommended', 'scheduled')
  ),
  starts_on date,
  cadence text not null default '',
  owner_name text not null default 'Kreative Reflow',
  client_note text not null default '',
  internal_note text not null default '',
  client_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, title)
);

alter table public.portal_project_invoices enable row level security;
alter table public.portal_project_handoff_items enable row level security;
alter table public.portal_project_support_next_steps enable row level security;

create index if not exists portal_project_invoices_project_status_idx
on public.portal_project_invoices (project_id, status, due_on);

create index if not exists portal_project_handoff_project_status_idx
on public.portal_project_handoff_items (project_id, status, due_on);

create index if not exists portal_project_support_project_status_idx
on public.portal_project_support_next_steps (project_id, status, starts_on);

revoke all
on table
  public.portal_project_invoices,
  public.portal_project_handoff_items,
  public.portal_project_support_next_steps
from anon, authenticated;

grant select, insert, update, delete
on table
  public.portal_project_invoices,
  public.portal_project_handoff_items,
  public.portal_project_support_next_steps
to service_role;

grant insert, update, delete
on table
  public.portal_project_invoices,
  public.portal_project_handoff_items,
  public.portal_project_support_next_steps
to authenticated;

grant select (
  id,
  project_id,
  invoice_number,
  label,
  status,
  amount_label,
  issued_on,
  due_on,
  paid_on,
  payment_reference,
  payment_link_label,
  payment_url,
  client_note,
  client_visible,
  sort_order,
  created_at,
  updated_at
)
on public.portal_project_invoices
to authenticated;

grant select (
  id,
  project_id,
  category,
  title,
  detail,
  status,
  owner_name,
  owner_role,
  due_on,
  completed_at,
  client_note,
  client_visible,
  sort_order,
  created_at,
  updated_at
)
on public.portal_project_handoff_items
to authenticated;

grant select (
  id,
  project_id,
  title,
  description,
  status,
  starts_on,
  cadence,
  owner_name,
  client_note,
  client_visible,
  sort_order,
  created_at,
  updated_at
)
on public.portal_project_support_next_steps
to authenticated;

drop policy if exists "portal members can view project invoices" on public.portal_project_invoices;
drop policy if exists "portal members can view handoff items" on public.portal_project_handoff_items;
drop policy if exists "portal members can view support next steps" on public.portal_project_support_next_steps;
drop policy if exists "portal studio admins can manage project invoices" on public.portal_project_invoices;
drop policy if exists "portal studio admins can manage handoff items" on public.portal_project_handoff_items;
drop policy if exists "portal studio admins can manage support next steps" on public.portal_project_support_next_steps;

create policy "portal members can view project invoices"
on public.portal_project_invoices
for select
to authenticated
using (
  client_visible is true
  and exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_invoices.project_id
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal members can view handoff items"
on public.portal_project_handoff_items
for select
to authenticated
using (
  client_visible is true
  and exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_handoff_items.project_id
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal members can view support next steps"
on public.portal_project_support_next_steps
for select
to authenticated
using (
  client_visible is true
  and exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_support_next_steps.project_id
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal studio admins can manage project invoices"
on public.portal_project_invoices
for all
to authenticated
using (
  exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_invoices.project_id
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
    where member.project_id = portal_project_invoices.project_id
      and member.role = 'studio_admin'
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal studio admins can manage handoff items"
on public.portal_project_handoff_items
for all
to authenticated
using (
  exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_handoff_items.project_id
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
    where member.project_id = portal_project_handoff_items.project_id
      and member.role = 'studio_admin'
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal studio admins can manage support next steps"
on public.portal_project_support_next_steps
for all
to authenticated
using (
  exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_support_next_steps.project_id
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
    where member.project_id = portal_project_support_next_steps.project_id
      and member.role = 'studio_admin'
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
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
    ('invoice_status_changed', 'Invoice status changes appear in client activity', 'portal_activity', true, true),
    ('handoff_updated', 'Launch and handoff movement appears in client activity', 'portal_activity', true, true),
    ('support_next_step_added', 'After-launch support next steps appear in client activity', 'portal_activity', true, true)
) as seed(event_type, label, surface, client_visible, enabled)
where project.slug = 'abc-engineering-website-redesign'
on conflict (project_id, event_type, surface) do update
set label = excluded.label,
    client_visible = excluded.client_visible,
    enabled = excluded.enabled,
    updated_at = now();

insert into public.portal_project_steps (
  project_id,
  title,
  status,
  detail,
  icon_name,
  sort_order
)
select
  project.id,
  seed.title,
  seed.status,
  seed.detail,
  seed.icon_name,
  seed.sort_order
from public.portal_projects as project
cross join (
  values
    ('Finance', 'Visible', 'Client-safe invoice status and payment references are available without internal finance notes.', 'finance', 50),
    ('Handoff', 'Preparing', 'Launch checklist, final assets, credential handoff notes, and support next steps are tracked.', 'handoff', 60)
) as seed(title, status, detail, icon_name, sort_order)
where project.slug = 'abc-engineering-website-redesign'
on conflict (project_id, title) do update
set status = excluded.status,
    detail = excluded.detail,
    icon_name = excluded.icon_name,
    sort_order = excluded.sort_order,
    updated_at = now();

insert into public.portal_project_invoices (
  project_id,
  invoice_number,
  label,
  status,
  amount_label,
  issued_on,
  due_on,
  paid_on,
  payment_reference,
  payment_link_label,
  payment_url,
  client_note,
  internal_note,
  client_visible,
  sort_order
)
select
  project.id,
  seed.invoice_number,
  seed.label,
  seed.status,
  seed.amount_label,
  seed.issued_on,
  seed.due_on,
  seed.paid_on,
  seed.payment_reference,
  seed.payment_link_label,
  seed.payment_url,
  seed.client_note,
  seed.internal_note,
  seed.client_visible,
  seed.sort_order
from public.portal_projects as project
cross join (
  values
    ('INV-007', 'Project deposit', 'paid', 'R18,000', date '2026-05-15', date '2026-05-18', date '2026-05-16', 'ABC-DEP-007', 'Reference used on proof of payment', null, 'Deposit received. No further client action is needed for this invoice.', 'Confirmed against bank statement. Do not expose bank detail in portal.', true, 10),
    ('INV-008', 'Design milestone', 'due', 'R12,000', date '2026-05-30', date '2026-06-03', null, 'ABC-DES-008', 'Use this EFT reference when paying', null, 'Due after homepage concept approval. Upload proof of payment through the agreed channel.', 'Watch before development sprint opens.', true, 20),
    ('INV-009', 'Launch balance', 'waiting', 'R10,000', null, date '2026-07-08', null, 'Pending final invoice', 'Issued after testing sign-off', null, 'This balance is not due yet. It will be issued once testing is signed off.', 'Draft only until QA milestone is approved.', true, 30)
) as seed(invoice_number, label, status, amount_label, issued_on, due_on, paid_on, payment_reference, payment_link_label, payment_url, client_note, internal_note, client_visible, sort_order)
where project.slug = 'abc-engineering-website-redesign'
on conflict (project_id, invoice_number) do update
set label = excluded.label,
    status = excluded.status,
    amount_label = excluded.amount_label,
    issued_on = excluded.issued_on,
    due_on = excluded.due_on,
    paid_on = excluded.paid_on,
    payment_reference = excluded.payment_reference,
    payment_link_label = excluded.payment_link_label,
    payment_url = excluded.payment_url,
    client_note = excluded.client_note,
    internal_note = excluded.internal_note,
    client_visible = excluded.client_visible,
    sort_order = excluded.sort_order,
    updated_at = now();

insert into public.portal_project_handoff_items (
  project_id,
  category,
  title,
  detail,
  status,
  owner_name,
  owner_role,
  due_on,
  completed_at,
  client_note,
  internal_note,
  client_visible,
  sort_order
)
select
  project.id,
  seed.category,
  seed.title,
  seed.detail,
  seed.status,
  seed.owner_name,
  seed.owner_role,
  seed.due_on,
  seed.completed_at::timestamptz,
  seed.client_note,
  seed.internal_note,
  seed.client_visible,
  seed.sort_order
from public.portal_projects as project
cross join (
  values
    ('launch', 'Launch QA checklist', 'Responsive checks, form tests, analytics checks, redirects, and content proofing before launch.', 'in_progress', 'Kreative Reflow', 'Studio', date '2026-06-28', null, 'The studio is preparing launch QA before the final handoff.', 'Track browser/device coverage internally.', true, 10),
    ('credentials', 'DNS and hosting access confirmed', 'Confirm account ownership, invite the studio where needed, and avoid sharing passwords in the portal.', 'waiting_client', 'ABC Engineering', 'Client owner', date '2026-06-10', null, 'Invite access where needed. Do not paste passwords into portal notes.', 'Need analytics and hosting access before QA.', true, 20),
    ('final_assets', 'Final site files and launch package', 'Final exports, sitemap, launch notes, and approved brand assets prepared for handoff.', 'not_started', 'Kreative Reflow', 'Studio', date '2026-07-05', null, 'Final files appear after testing is signed off.', 'Attach final zip or shared folder after QA.', true, 30),
    ('credentials', 'Credential handoff notes', 'Record account owners, reset instructions, and access responsibilities without storing passwords.', 'not_started', 'Kreative Reflow', 'Studio', date '2026-07-08', null, 'This handoff records who owns each account and what needs to be retained. Passwords stay outside the portal.', 'Never store raw credentials.', true, 40),
    ('support', 'Client training and support handoff', 'Practical training notes, maintenance options, and the first after-launch support window.', 'not_started', 'Kreative Reflow', 'Studio', date '2026-07-10', null, 'Training and support notes open once launch timing is confirmed.', 'Confirm support scope before launch day.', true, 50)
) as seed(category, title, detail, status, owner_name, owner_role, due_on, completed_at, client_note, internal_note, client_visible, sort_order)
where project.slug = 'abc-engineering-website-redesign'
on conflict (project_id, category, title) do update
set detail = excluded.detail,
    status = excluded.status,
    owner_name = excluded.owner_name,
    owner_role = excluded.owner_role,
    due_on = excluded.due_on,
    completed_at = excluded.completed_at,
    client_note = excluded.client_note,
    internal_note = excluded.internal_note,
    client_visible = excluded.client_visible,
    sort_order = excluded.sort_order,
    updated_at = now();

insert into public.portal_project_support_next_steps (
  project_id,
  title,
  description,
  status,
  starts_on,
  cadence,
  owner_name,
  client_note,
  internal_note,
  client_visible,
  sort_order
)
select
  project.id,
  seed.title,
  seed.description,
  seed.status,
  seed.starts_on,
  seed.cadence,
  seed.owner_name,
  seed.client_note,
  seed.internal_note,
  seed.client_visible,
  seed.sort_order
from public.portal_projects as project
cross join (
  values
    ('30-day post-launch support window', 'Bug fixes, small launch snags, and handoff questions after the site goes live.', 'scheduled', date '2026-07-10', '30 days', 'Kreative Reflow', 'Included support window starts after launch.', 'Scope: launch snags only.', true, 10),
    ('Maintenance plan decision', 'Optional monthly care for updates, backups, performance checks, and small content changes.', 'available', date '2026-08-10', 'Monthly', 'Kreative Reflow', 'Choose a maintenance plan after the initial support window if ongoing care is needed.', 'Prepare retainer options.', true, 20),
    ('First analytics review', 'Review early traffic, forms, and local visibility signals after launch.', 'recommended', date '2026-07-24', 'Once-off', 'Kreative Reflow', 'Recommended two weeks after launch so improvements are based on real usage.', 'Depends on analytics access.', true, 30)
) as seed(title, description, status, starts_on, cadence, owner_name, client_note, internal_note, client_visible, sort_order)
where project.slug = 'abc-engineering-website-redesign'
on conflict (project_id, title) do update
set description = excluded.description,
    status = excluded.status,
    starts_on = excluded.starts_on,
    cadence = excluded.cadence,
    owner_name = excluded.owner_name,
    client_note = excluded.client_note,
    internal_note = excluded.internal_note,
    client_visible = excluded.client_visible,
    sort_order = excluded.sort_order,
    updated_at = now();

delete from public.portal_project_activity as activity
using public.portal_projects as project
where activity.project_id = project.id
  and project.slug = 'abc-engineering-website-redesign'
  and activity.source_table is null
  and activity.title = 'Deposit invoice marked paid';

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
  invoice.project_id,
  timestamptz '2026-05-16 10:30:00+02',
  'May 16',
  'Finance status updated: Deposit invoice paid',
  'INV-007 is marked paid. Payment reference ABC-DEP-007 is recorded.',
  35,
  'invoice_status_changed',
  'portal_project_invoices',
  invoice.id,
  '',
  true,
  rule.id
from public.portal_project_invoices as invoice
join public.portal_projects as project
  on project.id = invoice.project_id
left join public.portal_project_notification_rules as rule
  on rule.project_id = invoice.project_id
  and rule.event_type = 'invoice_status_changed'
  and rule.surface = 'portal_activity'
where project.slug = 'abc-engineering-website-redesign'
  and invoice.invoice_number = 'INV-007'
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
  handoff.project_id,
  timestamptz '2026-05-30 12:00:00+02',
  'Today 12:00',
  'Handoff opened: Launch QA checklist',
  'Launch QA is in progress and the credential handoff is waiting on client access.',
  5,
  'handoff_updated',
  'portal_project_handoff_items',
  handoff.id,
  '',
  true,
  rule.id
from public.portal_project_handoff_items as handoff
join public.portal_projects as project
  on project.id = handoff.project_id
left join public.portal_project_notification_rules as rule
  on rule.project_id = handoff.project_id
  and rule.event_type = 'handoff_updated'
  and rule.surface = 'portal_activity'
where project.slug = 'abc-engineering-website-redesign'
  and handoff.title = 'Launch QA checklist'
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
  support.project_id,
  timestamptz '2026-05-30 12:05:00+02',
  'Today 12:05',
  'Support next step added: 30-day post-launch support',
  'After-launch support window is scheduled to start when the site goes live.',
  4,
  'support_next_step_added',
  'portal_project_support_next_steps',
  support.id,
  '',
  true,
  rule.id
from public.portal_project_support_next_steps as support
join public.portal_projects as project
  on project.id = support.project_id
left join public.portal_project_notification_rules as rule
  on rule.project_id = support.project_id
  and rule.event_type = 'support_next_step_added'
  and rule.surface = 'portal_activity'
where project.slug = 'abc-engineering-website-redesign'
  and support.title = '30-day post-launch support window'
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
