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
      'readiness_gate_updated',
      'request_submitted',
      'request_classified',
      'request_decision_submitted',
      'meeting_requested',
      'meeting_scheduled',
      'message_posted',
      'decision_logged'
    )
  );

create table if not exists public.portal_project_meeting_requests (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.portal_projects(id) on delete cascade,
  meeting_number text not null,
  topic_type text not null default 'project' check (
    topic_type in ('handoff', 'kickoff', 'project', 'review', 'scope', 'strategy', 'support', 'other')
  ),
  title text not null,
  reason text not null default '',
  preferred_slots text not null default '',
  attendees text not null default '',
  agenda text not null default '',
  related_item_type text not null default 'project' check (
    related_item_type in ('approval', 'deliverable', 'handoff', 'invoice', 'meeting', 'milestone', 'project', 'request', 'support', 'other')
  ),
  related_record_id uuid,
  related_item_label text not null default '',
  source_channel text not null default 'portal' check (
    source_channel in ('email', 'meeting', 'phone', 'portal', 'studio_logged', 'whatsapp')
  ),
  status text not null default 'requested' check (
    status in ('cancelled', 'completed', 'declined', 'requested', 'scheduled')
  ),
  scheduled_for timestamptz,
  meeting_link text not null default '',
  owner_name text not null default 'Kreative Reflow',
  owner_role text not null default 'Studio',
  next_action text not null default 'The studio will confirm whether a meeting is needed and propose a slot.',
  requested_by_user_id uuid references auth.users(id) on delete set null,
  requested_by_email text not null default '',
  requested_by_role text not null default '',
  requested_at timestamptz not null default now(),
  studio_note text not null default '',
  client_visible boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, meeting_number)
);

create table if not exists public.portal_project_message_threads (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.portal_projects(id) on delete cascade,
  thread_key text not null,
  subject text not null,
  summary text not null default '',
  context_type text not null default 'project' check (
    context_type in ('approval', 'deliverable', 'handoff', 'invoice', 'meeting', 'milestone', 'project', 'request', 'support', 'other')
  ),
  context_record_id uuid,
  context_label text not null default '',
  status text not null default 'open' check (
    status in ('archived', 'open', 'resolved', 'waiting_client', 'waiting_studio')
  ),
  owner_name text not null default 'Kreative Reflow',
  owner_role text not null default 'Studio',
  last_message_at timestamptz,
  created_by_email text not null default '',
  client_visible boolean not null default true,
  internal_note text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, thread_key)
);

create table if not exists public.portal_project_messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.portal_projects(id) on delete cascade,
  thread_id uuid not null references public.portal_project_message_threads(id) on delete cascade,
  message_body text not null,
  source_channel text not null default 'portal' check (
    source_channel in ('email', 'meeting', 'phone', 'portal', 'studio_logged', 'whatsapp')
  ),
  author_email text not null default '',
  author_role text not null default '',
  visibility text not null default 'client_visible' check (visibility in ('client_visible', 'studio_internal')),
  action_required boolean not null default false,
  action_owner text not null default '',
  action_due_on date,
  sent_at timestamptz not null default now(),
  client_visible boolean not null default true,
  internal_note text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.portal_project_decisions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.portal_projects(id) on delete cascade,
  decision_number text not null,
  decision_type text not null default 'project_decision' check (
    decision_type in (
      'approval',
      'kickoff_outcome',
      'meeting_outcome',
      'phone_call',
      'project_decision',
      'scope_decision',
      'support',
      'whatsapp_summary'
    )
  ),
  title text not null,
  decision_summary text not null default '',
  rationale text not null default '',
  outcome text not null default '',
  action_items text not null default '',
  owner_name text not null default 'Kreative Reflow',
  owner_role text not null default 'Studio',
  due_on date,
  source_channel text not null default 'portal' check (
    source_channel in ('approval', 'email', 'meeting', 'phone', 'portal', 'studio_logged', 'whatsapp')
  ),
  related_item_type text not null default 'project' check (
    related_item_type in ('approval', 'deliverable', 'handoff', 'invoice', 'meeting', 'milestone', 'project', 'request', 'support', 'other')
  ),
  related_record_id uuid,
  related_item_label text not null default '',
  status text not null default 'active' check (status in ('active', 'completed', 'reversed', 'superseded')),
  decided_by_email text not null default '',
  decided_by_role text not null default '',
  decided_at timestamptz not null default now(),
  client_visible boolean not null default true,
  internal_note text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, decision_number)
);

alter table public.portal_project_meeting_requests enable row level security;
alter table public.portal_project_message_threads enable row level security;
alter table public.portal_project_messages enable row level security;
alter table public.portal_project_decisions enable row level security;

create index if not exists portal_project_meeting_requests_project_status_idx
on public.portal_project_meeting_requests (project_id, status, requested_at desc);

create index if not exists portal_project_message_threads_project_status_idx
on public.portal_project_message_threads (project_id, status, last_message_at desc);

create index if not exists portal_project_messages_thread_sent_idx
on public.portal_project_messages (thread_id, sent_at desc);

create index if not exists portal_project_decisions_project_type_idx
on public.portal_project_decisions (project_id, decision_type, decided_at desc);

revoke all
on table
  public.portal_project_meeting_requests,
  public.portal_project_message_threads,
  public.portal_project_messages,
  public.portal_project_decisions
from anon, authenticated;

grant select, insert, update, delete
on table
  public.portal_project_meeting_requests,
  public.portal_project_message_threads,
  public.portal_project_messages,
  public.portal_project_decisions
to service_role;

grant select (
  id,
  project_id,
  meeting_number,
  topic_type,
  title,
  reason,
  preferred_slots,
  attendees,
  agenda,
  related_item_type,
  related_record_id,
  related_item_label,
  source_channel,
  status,
  scheduled_for,
  meeting_link,
  owner_name,
  owner_role,
  next_action,
  requested_by_email,
  requested_by_role,
  requested_at,
  client_visible,
  sort_order,
  created_at,
  updated_at
)
on public.portal_project_meeting_requests
to authenticated;

grant select (
  id,
  project_id,
  thread_key,
  subject,
  summary,
  context_type,
  context_record_id,
  context_label,
  status,
  owner_name,
  owner_role,
  last_message_at,
  created_by_email,
  client_visible,
  sort_order,
  created_at,
  updated_at
)
on public.portal_project_message_threads
to authenticated;

grant select (
  id,
  project_id,
  thread_id,
  message_body,
  source_channel,
  author_email,
  author_role,
  visibility,
  action_required,
  action_owner,
  action_due_on,
  sent_at,
  client_visible,
  created_at
)
on public.portal_project_messages
to authenticated;

grant select (
  id,
  project_id,
  decision_number,
  decision_type,
  title,
  decision_summary,
  rationale,
  outcome,
  action_items,
  owner_name,
  owner_role,
  due_on,
  source_channel,
  related_item_type,
  related_record_id,
  related_item_label,
  status,
  decided_by_email,
  decided_by_role,
  decided_at,
  client_visible,
  sort_order,
  created_at,
  updated_at
)
on public.portal_project_decisions
to authenticated;

drop policy if exists "portal members can view meeting requests" on public.portal_project_meeting_requests;
drop policy if exists "portal studio admins can manage meeting requests" on public.portal_project_meeting_requests;
drop policy if exists "portal members can view message threads" on public.portal_project_message_threads;
drop policy if exists "portal studio admins can manage message threads" on public.portal_project_message_threads;
drop policy if exists "portal members can view project messages" on public.portal_project_messages;
drop policy if exists "portal studio admins can manage project messages" on public.portal_project_messages;
drop policy if exists "portal members can view project decisions" on public.portal_project_decisions;
drop policy if exists "portal studio admins can manage project decisions" on public.portal_project_decisions;

create policy "portal members can view meeting requests"
on public.portal_project_meeting_requests
for select
to authenticated
using (
  client_visible is true
  and exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_meeting_requests.project_id
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal studio admins can manage meeting requests"
on public.portal_project_meeting_requests
for all
to authenticated
using (
  exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_meeting_requests.project_id
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
    where member.project_id = portal_project_meeting_requests.project_id
      and member.role = 'studio_admin'
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal members can view message threads"
on public.portal_project_message_threads
for select
to authenticated
using (
  client_visible is true
  and exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_message_threads.project_id
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal studio admins can manage message threads"
on public.portal_project_message_threads
for all
to authenticated
using (
  exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_message_threads.project_id
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
    where member.project_id = portal_project_message_threads.project_id
      and member.role = 'studio_admin'
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal members can view project messages"
on public.portal_project_messages
for select
to authenticated
using (
  client_visible is true
  and visibility = 'client_visible'
  and exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_messages.project_id
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal studio admins can manage project messages"
on public.portal_project_messages
for all
to authenticated
using (
  exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_messages.project_id
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
    where member.project_id = portal_project_messages.project_id
      and member.role = 'studio_admin'
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal members can view project decisions"
on public.portal_project_decisions
for select
to authenticated
using (
  client_visible is true
  and exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_decisions.project_id
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal studio admins can manage project decisions"
on public.portal_project_decisions
for all
to authenticated
using (
  exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_decisions.project_id
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
    where member.project_id = portal_project_decisions.project_id
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
  'portal_activity',
  true,
  true
from public.portal_projects as project
cross join (
  values
    ('meeting_requested', 'Client meeting requests are logged in portal activity'),
    ('meeting_scheduled', 'Scheduled meeting updates stay visible'),
    ('message_posted', 'Portal messages are reflected in activity'),
    ('decision_logged', 'Official decisions are recorded in activity')
) as seed(event_type, label)
where project.slug = 'abc-engineering-website-redesign'
on conflict (project_id, event_type, surface) do update
set label = excluded.label,
    client_visible = excluded.client_visible,
    enabled = excluded.enabled,
    updated_at = now();

insert into public.portal_project_meeting_requests (
  project_id,
  meeting_number,
  topic_type,
  title,
  reason,
  preferred_slots,
  attendees,
  agenda,
  related_item_type,
  related_item_label,
  source_channel,
  status,
  scheduled_for,
  meeting_link,
  owner_name,
  owner_role,
  next_action,
  requested_by_email,
  requested_by_role,
  requested_at,
  studio_note,
  client_visible,
  sort_order
)
select
  project.id,
  'MTG-001',
  'review',
  'Homepage review alignment call',
  'Client wants to confirm CTA wording and content priority before the next design pass.',
  '5 June morning or 6 June afternoon',
  'Operations lead, CEO, Kreative Reflow',
  'Review homepage CTA wording, services order, and launch-sensitive content decisions.',
  'request',
  'REQ-001 - Adjust homepage services CTA',
  'portal',
  'scheduled',
  timestamptz '2026-06-05 10:00:00+02',
  'https://meet.example.com/abc-homepage-review',
  'Kreative Reflow',
  'Studio',
  'Attend the scheduled review and confirm final CTA wording.',
  'operations@abc-engineering.example',
  'client_owner',
  timestamptz '2026-06-03 11:30:00+02',
  'Seeded meeting request for Phase 12 communication flow.',
  true,
  10
from public.portal_projects as project
where project.slug = 'abc-engineering-website-redesign'
on conflict (project_id, meeting_number) do update
set topic_type = excluded.topic_type,
    title = excluded.title,
    reason = excluded.reason,
    preferred_slots = excluded.preferred_slots,
    attendees = excluded.attendees,
    agenda = excluded.agenda,
    related_item_type = excluded.related_item_type,
    related_item_label = excluded.related_item_label,
    source_channel = excluded.source_channel,
    status = excluded.status,
    scheduled_for = excluded.scheduled_for,
    meeting_link = excluded.meeting_link,
    owner_name = excluded.owner_name,
    owner_role = excluded.owner_role,
    next_action = excluded.next_action,
    requested_by_email = excluded.requested_by_email,
    requested_by_role = excluded.requested_by_role,
    requested_at = excluded.requested_at,
    studio_note = excluded.studio_note,
    client_visible = excluded.client_visible,
    sort_order = excluded.sort_order,
    updated_at = now();

insert into public.portal_project_message_threads (
  project_id,
  thread_key,
  subject,
  summary,
  context_type,
  context_label,
  status,
  owner_name,
  owner_role,
  last_message_at,
  created_by_email,
  client_visible,
  internal_note,
  sort_order
)
select
  project.id,
  'homepage-review-thread',
  'Homepage review questions',
  'Official discussion thread for CTA wording, homepage service priority, and content confirmation.',
  'request',
  'REQ-001 - Homepage services CTA',
  'waiting_client',
  'ABC Engineering',
  'Client owner',
  timestamptz '2026-06-03 12:00:00+02',
  'delite@kreativereflow.com',
  true,
  'Seeded message thread for Phase 12 portal messages.',
  10
from public.portal_projects as project
where project.slug = 'abc-engineering-website-redesign'
on conflict (project_id, thread_key) do update
set subject = excluded.subject,
    summary = excluded.summary,
    context_type = excluded.context_type,
    context_label = excluded.context_label,
    status = excluded.status,
    owner_name = excluded.owner_name,
    owner_role = excluded.owner_role,
    last_message_at = excluded.last_message_at,
    created_by_email = excluded.created_by_email,
    client_visible = excluded.client_visible,
    internal_note = excluded.internal_note,
    sort_order = excluded.sort_order,
    updated_at = now();

insert into public.portal_project_messages (
  project_id,
  thread_id,
  message_body,
  source_channel,
  author_email,
  author_role,
  visibility,
  action_required,
  action_owner,
  action_due_on,
  sent_at,
  client_visible,
  internal_note
)
select
  thread.project_id,
  thread.id,
  seed.message_body,
  seed.source_channel,
  seed.author_email,
  seed.author_role,
  'client_visible',
  seed.action_required,
  seed.action_owner,
  seed.action_due_on,
  seed.sent_at,
  true,
  seed.internal_note
from public.portal_project_message_threads as thread
join public.portal_projects as project
  on project.id = thread.project_id
cross join (
  values
    (
      'The homepage CTA can change to Request a quote if everyone is happy with that wording before build lock.',
      'portal',
      'delite@kreativereflow.com',
      'studio_admin',
      true,
      'Client owner',
      date '2026-06-05',
      timestamptz '2026-06-03 11:45:00+02',
      'Seeded studio message.'
    ),
    (
      'Please keep the services order as engineering, maintenance, automation. We will confirm CTA wording in the meeting.',
      'portal',
      'operations@abc-engineering.example',
      'client_owner',
      false,
      '',
      null,
      timestamptz '2026-06-03 12:00:00+02',
      'Seeded client reply.'
    )
) as seed(
  message_body,
  source_channel,
  author_email,
  author_role,
  action_required,
  action_owner,
  action_due_on,
  sent_at,
  internal_note
)
where project.slug = 'abc-engineering-website-redesign'
  and thread.thread_key = 'homepage-review-thread'
  and not exists (
    select 1
    from public.portal_project_messages as existing
    where existing.thread_id = thread.id
      and existing.message_body = seed.message_body
      and existing.sent_at = seed.sent_at
  );

insert into public.portal_project_decisions (
  project_id,
  decision_number,
  decision_type,
  title,
  decision_summary,
  rationale,
  outcome,
  action_items,
  owner_name,
  owner_role,
  due_on,
  source_channel,
  related_item_type,
  related_item_label,
  status,
  decided_by_email,
  decided_by_role,
  decided_at,
  client_visible,
  internal_note,
  sort_order
)
select
  project.id,
  seed.decision_number,
  seed.decision_type,
  seed.title,
  seed.decision_summary,
  seed.rationale,
  seed.outcome,
  seed.action_items,
  seed.owner_name,
  seed.owner_role,
  seed.due_on,
  seed.source_channel,
  seed.related_item_type,
  seed.related_item_label,
  seed.status,
  seed.decided_by_email,
  seed.decided_by_role,
  seed.decided_at,
  true,
  seed.internal_note,
  seed.sort_order
from public.portal_projects as project
cross join (
  values
    (
      'DEC-001',
      'kickoff_outcome',
      'Kickoff confirmed active delivery gate',
      'The project can move through structured delivery once agreement, SOW, deposit, approval owner, content, and technical access are complete.',
      'This matches the commercial readiness gate and keeps work from starting with missing client inputs.',
      'Use the readiness checklist as the official start-control source.',
      'Studio to keep the readiness gate updated; client to resolve blockers shown in the portal.',
      'Kreative Reflow',
      'Studio',
      date '2026-06-04',
      'meeting',
      'milestone',
      'Kickoff completed',
      'active',
      'delite@kreativereflow.com',
      'studio_admin',
      timestamptz '2026-05-20 11:00:00+02',
      'Seeded kickoff outcome.',
      10
    ),
    (
      'DEC-002',
      'whatsapp_summary',
      'WhatsApp CTA wording request logged',
      'The client asked on WhatsApp to make the homepage CTA feel more quote-led for industrial buyers.',
      'Outside-channel requests should not stay invisible in WhatsApp only.',
      'Treat the wording change as an included revision unless it expands the page structure.',
      'Studio to update the CTA wording in the next homepage pass.',
      'Kreative Reflow',
      'Studio',
      date '2026-06-05',
      'whatsapp',
      'request',
      'REQ-001 - Adjust homepage services CTA',
      'active',
      'delite@kreativereflow.com',
      'studio_admin',
      timestamptz '2026-06-02 12:15:00+02',
      'Seeded WhatsApp decision summary.',
      20
    )
) as seed(
  decision_number,
  decision_type,
  title,
  decision_summary,
  rationale,
  outcome,
  action_items,
  owner_name,
  owner_role,
  due_on,
  source_channel,
  related_item_type,
  related_item_label,
  status,
  decided_by_email,
  decided_by_role,
  decided_at,
  internal_note,
  sort_order
)
where project.slug = 'abc-engineering-website-redesign'
on conflict (project_id, decision_number) do update
set decision_type = excluded.decision_type,
    title = excluded.title,
    decision_summary = excluded.decision_summary,
    rationale = excluded.rationale,
    outcome = excluded.outcome,
    action_items = excluded.action_items,
    owner_name = excluded.owner_name,
    owner_role = excluded.owner_role,
    due_on = excluded.due_on,
    source_channel = excluded.source_channel,
    related_item_type = excluded.related_item_type,
    related_item_label = excluded.related_item_label,
    status = excluded.status,
    decided_by_email = excluded.decided_by_email,
    decided_by_role = excluded.decided_by_role,
    decided_at = excluded.decided_at,
    client_visible = excluded.client_visible,
    internal_note = excluded.internal_note,
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
  meeting.project_id,
  meeting.requested_at,
  'Jun 3',
  'Meeting requested: Homepage review alignment call',
  'A review meeting is scheduled to confirm homepage CTA wording and content priority.',
  2,
  'meeting_requested',
  'portal_project_meeting_requests',
  meeting.id,
  meeting.requested_by_email,
  true,
  rule.id
from public.portal_project_meeting_requests as meeting
join public.portal_projects as project
  on project.id = meeting.project_id
left join public.portal_project_notification_rules as rule
  on rule.project_id = meeting.project_id
  and rule.event_type = 'meeting_requested'
  and rule.surface = 'portal_activity'
where project.slug = 'abc-engineering-website-redesign'
  and meeting.meeting_number = 'MTG-001'
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
  decision.project_id,
  decision.decided_at,
  'Jun 2',
  'Decision logged: WhatsApp CTA wording request',
  'The WhatsApp request is recorded as an included revision unless it expands page structure.',
  4,
  'decision_logged',
  'portal_project_decisions',
  decision.id,
  decision.decided_by_email,
  true,
  rule.id
from public.portal_project_decisions as decision
join public.portal_projects as project
  on project.id = decision.project_id
left join public.portal_project_notification_rules as rule
  on rule.project_id = decision.project_id
  and rule.event_type = 'decision_logged'
  and rule.surface = 'portal_activity'
where project.slug = 'abc-engineering-website-redesign'
  and decision.decision_number = 'DEC-002'
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

select pg_notify('pgrst', 'reload schema');
