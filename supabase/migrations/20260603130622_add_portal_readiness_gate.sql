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
      'support_next_step_added',
      'readiness_gate_updated'
    )
  );

create table if not exists public.portal_project_readiness_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.portal_projects(id) on delete cascade,
  category text not null default 'scope' check (
    category in ('commercial', 'decision', 'scope', 'assets', 'technical', 'communication', 'kickoff')
  ),
  item_key text not null,
  label text not null,
  detail text not null default '',
  status text not null default 'not_started' check (
    status in ('blocked', 'done', 'in_progress', 'not_started', 'waiting_client')
  ),
  required_for_active_delivery boolean not null default true,
  blocks_active_delivery boolean not null default true,
  owner_name text not null default 'Kreative Reflow',
  owner_role text not null default 'Studio',
  due_on date,
  completed_at timestamptz,
  client_note text not null default '',
  internal_note text not null default '',
  linked_invoice_number text not null default '',
  client_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, item_key)
);

alter table public.portal_project_readiness_items enable row level security;

create index if not exists portal_project_readiness_project_status_idx
on public.portal_project_readiness_items (project_id, status, sort_order);

create index if not exists portal_project_readiness_gate_idx
on public.portal_project_readiness_items (
  project_id,
  required_for_active_delivery,
  blocks_active_delivery,
  status
);

revoke all
on table public.portal_project_readiness_items
from anon, authenticated;

grant select, insert, update, delete
on table public.portal_project_readiness_items
to service_role;

grant insert, update, delete
on table public.portal_project_readiness_items
to authenticated;

grant select (
  id,
  project_id,
  category,
  item_key,
  label,
  detail,
  status,
  required_for_active_delivery,
  blocks_active_delivery,
  owner_name,
  owner_role,
  due_on,
  completed_at,
  client_note,
  linked_invoice_number,
  client_visible,
  sort_order,
  created_at,
  updated_at
)
on public.portal_project_readiness_items
to authenticated;

drop policy if exists "portal members can view readiness items" on public.portal_project_readiness_items;
drop policy if exists "portal studio admins can manage readiness items" on public.portal_project_readiness_items;

create policy "portal members can view readiness items"
on public.portal_project_readiness_items
for select
to authenticated
using (
  client_visible is true
  and exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_readiness_items.project_id
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal studio admins can manage readiness items"
on public.portal_project_readiness_items
for all
to authenticated
using (
  exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_readiness_items.project_id
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
    where member.project_id = portal_project_readiness_items.project_id
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
  'readiness_gate_updated',
  'Readiness gate updated',
  'portal_activity',
  true,
  true
from public.portal_projects as project
where project.slug = 'abc-engineering-website-redesign'
on conflict (project_id, event_type, surface) do update
set label = excluded.label,
    client_visible = excluded.client_visible,
    enabled = excluded.enabled,
    updated_at = now();

insert into public.portal_project_readiness_items (
  project_id,
  category,
  item_key,
  label,
  detail,
  status,
  required_for_active_delivery,
  blocks_active_delivery,
  owner_name,
  owner_role,
  due_on,
  completed_at,
  client_note,
  internal_note,
  linked_invoice_number,
  client_visible,
  sort_order
)
select
  project.id,
  seed.category,
  seed.item_key,
  seed.label,
  seed.detail,
  seed.status,
  seed.required_for_active_delivery,
  seed.blocks_active_delivery,
  seed.owner_name,
  seed.owner_role,
  seed.due_on,
  seed.completed_at,
  seed.client_note,
  seed.internal_note,
  seed.linked_invoice_number,
  seed.client_visible,
  seed.sort_order
from public.portal_projects as project
cross join (
  values
    ('commercial', 'agreement_signed', 'Agreement signed', 'The client agreement or master service agreement is accepted before any active delivery work begins.', 'done', true, true, 'Kreative Reflow', 'Studio', date '2026-05-15', timestamptz '2026-05-15 15:00:00+02', 'Agreement is signed and stored by the studio.', 'Confirm final signed copy is in the private commercial folder.', '', true, 10),
    ('scope', 'sow_approved', 'Scope of work approved', 'The SOW confirms included services, exclusions, timeline assumptions, revision rules, and approval responsibilities.', 'done', true, true, 'Kreative Reflow', 'Studio', date '2026-05-15', timestamptz '2026-05-15 15:30:00+02', 'Scope of work is approved. Any new requests after this point may need a change request.', 'SOW includes revision boundary and out-of-scope handling.', '', true, 20),
    ('commercial', 'deposit_paid', 'Project deposit paid', 'The project deposit must be paid before active delivery opens.', 'done', true, true, 'ABC Engineering', 'Client owner', date '2026-05-18', timestamptz '2026-05-16 10:30:00+02', 'Deposit is paid and linked to the project deposit invoice.', 'Linked to INV-007. Do not expose bank statement details.', 'INV-007', true, 30),
    ('commercial', 'billing_contact_confirmed', 'Billing contact confirmed', 'The person responsible for invoices and payment references is known before finance reminders begin.', 'done', true, false, 'ABC Engineering', 'Client owner', date '2026-05-17', timestamptz '2026-05-17 09:00:00+02', 'Billing contact is confirmed for this project.', 'Use billing contact only for commercial communication.', '', true, 40),
    ('kickoff', 'kickoff_completed', 'Kickoff completed', 'Kickoff outcomes, priorities, communication rhythm, and immediate next actions are confirmed.', 'done', true, true, 'Kreative Reflow', 'Studio', date '2026-05-20', timestamptz '2026-05-20 11:00:00+02', 'Kickoff is complete and the next delivery steps are recorded.', 'Kickoff notes should be mirrored into the future decision log.', '', true, 50),
    ('decision', 'approval_owner_confirmed', 'Approval owner confirmed', 'The person who can approve designs, revisions, launch decisions, and change requests is confirmed.', 'done', true, true, 'ABC Engineering', 'Client owner', date '2026-05-20', timestamptz '2026-05-20 11:15:00+02', 'Approval owner is confirmed. This keeps decisions from spreading across too many channels.', 'Keep this aligned with onboarding approval role.', '', true, 60),
    ('assets', 'brand_content_assets_ready', 'Brand, content, and assets ready', 'Brand files, priority page copy, logo assets, and key photos must be available before design and build work can move cleanly.', 'waiting_client', true, true, 'ABC Engineering', 'Client owner', date '2026-06-06', null::timestamptz, 'Please upload the missing brand and content files or confirm which content the studio should draft.', 'Client still owes several content inputs before build can move without risk.', '', true, 70),
    ('technical', 'technical_access_ready', 'Technical access ready', 'Hosting, DNS, analytics, email, and related account access must be invited or confirmed through secure channels.', 'waiting_client', true, true, 'ABC Engineering', 'Client owner', date '2026-06-10', null::timestamptz, 'Please invite the studio to the required technical accounts. Do not paste passwords into the portal.', 'Access cannot be stored as raw credentials in portal notes.', '', true, 80),
    ('scope', 'timeline_constraints_confirmed', 'Timeline constraints confirmed', 'Launch targets, review windows, blackout dates, and dependency risks are recorded before production scheduling.', 'done', true, true, 'Kreative Reflow', 'Studio', date '2026-05-22', timestamptz '2026-05-22 14:00:00+02', 'Timeline constraints are recorded for scheduling.', 'Watch any client blackout dates before booking launch QA.', '', true, 90),
    ('communication', 'communication_rules_confirmed', 'Communication rules confirmed', 'Update cadence, urgent channel, meeting expectations, and official approval path are agreed before delivery starts.', 'done', true, false, 'Kreative Reflow', 'Studio', date '2026-05-22', timestamptz '2026-05-22 14:30:00+02', 'Communication rhythm is confirmed. The portal remains the official project record.', 'WhatsApp and calls need summary notes when decisions are made outside the portal.', '', true, 100)
) as seed(category, item_key, label, detail, status, required_for_active_delivery, blocks_active_delivery, owner_name, owner_role, due_on, completed_at, client_note, internal_note, linked_invoice_number, client_visible, sort_order)
where project.slug = 'abc-engineering-website-redesign'
on conflict (project_id, item_key) do update
set category = excluded.category,
    label = excluded.label,
    detail = excluded.detail,
    status = excluded.status,
    required_for_active_delivery = excluded.required_for_active_delivery,
    blocks_active_delivery = excluded.blocks_active_delivery,
    owner_name = excluded.owner_name,
    owner_role = excluded.owner_role,
    due_on = excluded.due_on,
    completed_at = excluded.completed_at,
    client_note = excluded.client_note,
    internal_note = excluded.internal_note,
    linked_invoice_number = excluded.linked_invoice_number,
    client_visible = excluded.client_visible,
    sort_order = excluded.sort_order,
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
  item.project_id,
  timestamptz '2026-06-03 13:00:00+02',
  'Today 13:00',
  'Readiness gate needs client action',
  'Contract, SOW, deposit, kickoff, and approval owner are ready. Brand/content assets and technical access still need client action.',
  4,
  'readiness_gate_updated',
  'portal_project_readiness_items',
  item.id,
  '',
  true,
  rule.id
from public.portal_project_readiness_items as item
join public.portal_projects as project
  on project.id = item.project_id
left join public.portal_project_notification_rules as rule
  on rule.project_id = item.project_id
  and rule.event_type = 'readiness_gate_updated'
  and rule.surface = 'portal_activity'
where project.slug = 'abc-engineering-website-redesign'
  and item.item_key = 'brand_content_assets_ready'
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

select pg_notify('pgrst', 'reload schema');
