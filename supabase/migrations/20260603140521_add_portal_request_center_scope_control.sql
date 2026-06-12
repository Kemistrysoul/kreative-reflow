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
      'request_decision_submitted'
    )
  );

create table if not exists public.portal_project_requests (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.portal_projects(id) on delete cascade,
  request_number text not null,
  request_type text not null default 'question' check (
    request_type in (
      'bug_fix',
      'maintenance_request',
      'meeting_request',
      'question',
      'scope_change',
      'small_change',
      'support_request'
    )
  ),
  title text not null,
  affected_area text not null default '',
  request_detail text not null default '',
  reason text not null default '',
  urgency text not null default 'normal' check (urgency in ('low', 'normal', 'high', 'urgent')),
  desired_deadline date,
  related_milestone_id uuid references public.portal_project_milestones(id) on delete set null,
  related_deliverable_id uuid references public.portal_project_deliverables(id) on delete set null,
  related_item_label text not null default '',
  attachment_label text not null default '',
  attachment_url text not null default '',
  source_channel text not null default 'portal' check (
    source_channel in ('email', 'meeting', 'phone', 'portal', 'studio_logged', 'whatsapp')
  ),
  status text not null default 'submitted' check (
    status in (
      'approved',
      'closed',
      'declined',
      'in_progress',
      'parked',
      'resolved',
      'submitted',
      'triage',
      'waiting_approval',
      'waiting_client'
    )
  ),
  classification text not null default 'unclassified' check (
    classification in (
      'change_request',
      'fix',
      'included_revision',
      'maintenance',
      'out_of_scope',
      'unclassified'
    )
  ),
  impact_cost_label text not null default '',
  impact_time_label text not null default '',
  launch_impact text not null default '',
  studio_assessment text not null default '',
  phase2_option boolean not null default false,
  client_decision text not null default 'not_required' check (
    client_decision in ('approved', 'declined', 'not_required', 'parked', 'pending')
  ),
  client_decision_note text not null default '',
  client_decision_at timestamptz,
  owner_name text not null default 'Kreative Reflow',
  owner_role text not null default 'Studio',
  next_action text not null default 'The studio will triage this request and confirm the next step.',
  submitted_by_user_id uuid references auth.users(id) on delete set null,
  submitted_by_email text not null default '',
  submitted_by_role text not null default '',
  submitted_at timestamptz not null default now(),
  classified_by_email text not null default '',
  classified_at timestamptz,
  client_visible boolean not null default true,
  internal_note text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, request_number),
  check (
    classification not in ('change_request', 'out_of_scope')
    or status not in ('approved', 'in_progress', 'resolved', 'closed')
    or client_decision = 'approved'
  )
);

alter table public.portal_project_requests enable row level security;

create index if not exists portal_project_requests_project_status_idx
on public.portal_project_requests (project_id, status, urgency, submitted_at desc);

create index if not exists portal_project_requests_classification_idx
on public.portal_project_requests (project_id, classification, client_decision, updated_at desc);

revoke all
on table public.portal_project_requests
from anon, authenticated;

grant select, insert, update, delete
on table public.portal_project_requests
to service_role;

revoke insert, update, delete
on table public.portal_project_requests
from authenticated;

grant select (
  id,
  project_id,
  request_number,
  request_type,
  title,
  affected_area,
  request_detail,
  reason,
  urgency,
  desired_deadline,
  related_milestone_id,
  related_deliverable_id,
  related_item_label,
  attachment_label,
  attachment_url,
  source_channel,
  status,
  classification,
  impact_cost_label,
  impact_time_label,
  launch_impact,
  studio_assessment,
  phase2_option,
  client_decision,
  client_decision_note,
  client_decision_at,
  owner_name,
  owner_role,
  next_action,
  submitted_by_email,
  submitted_by_role,
  submitted_at,
  client_visible,
  sort_order,
  created_at,
  updated_at
)
on public.portal_project_requests
to authenticated;

drop policy if exists "portal members can view project requests" on public.portal_project_requests;
drop policy if exists "portal members can create project requests" on public.portal_project_requests;
drop policy if exists "portal members can update request decisions" on public.portal_project_requests;
drop policy if exists "portal studio admins can manage project requests" on public.portal_project_requests;

create policy "portal members can view project requests"
on public.portal_project_requests
for select
to authenticated
using (
  client_visible is true
  and exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_requests.project_id
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal members can create project requests"
on public.portal_project_requests
for insert
to authenticated
with check (
  client_visible is true
  and source_channel = 'portal'
  and exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_requests.project_id
      and member.role in ('studio_admin', 'client_owner', 'client_collaborator')
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal members can update request decisions"
on public.portal_project_requests
for update
to authenticated
using (
  client_visible is true
  and exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_requests.project_id
      and member.role in ('studio_admin', 'client_owner', 'client_collaborator')
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
)
with check (
  client_visible is true
  and exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_requests.project_id
      and member.role in ('studio_admin', 'client_owner', 'client_collaborator')
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal studio admins can manage project requests"
on public.portal_project_requests
for all
to authenticated
using (
  exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_requests.project_id
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
    where member.project_id = portal_project_requests.project_id
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
    ('request_submitted', 'New client requests appear in portal activity'),
    ('request_classified', 'Request classification updates stay visible'),
    ('request_decision_submitted', 'Client scope decisions are recorded')
) as seed(event_type, label)
where project.slug = 'abc-engineering-website-redesign'
on conflict (project_id, event_type, surface) do update
set label = excluded.label,
    client_visible = excluded.client_visible,
    enabled = excluded.enabled,
    updated_at = now();

insert into public.portal_project_requests (
  project_id,
  request_number,
  request_type,
  title,
  affected_area,
  request_detail,
  reason,
  urgency,
  desired_deadline,
  related_item_label,
  attachment_label,
  attachment_url,
  source_channel,
  status,
  classification,
  impact_cost_label,
  impact_time_label,
  launch_impact,
  studio_assessment,
  phase2_option,
  client_decision,
  client_decision_note,
  owner_name,
  owner_role,
  next_action,
  submitted_by_email,
  submitted_by_role,
  submitted_at,
  classified_by_email,
  classified_at,
  client_visible,
  internal_note,
  sort_order
)
select
  project.id,
  seed.request_number,
  seed.request_type,
  seed.title,
  seed.affected_area,
  seed.request_detail,
  seed.reason,
  seed.urgency,
  seed.desired_deadline,
  seed.related_item_label,
  seed.attachment_label,
  seed.attachment_url,
  seed.source_channel,
  seed.status,
  seed.classification,
  seed.impact_cost_label,
  seed.impact_time_label,
  seed.launch_impact,
  seed.studio_assessment,
  seed.phase2_option,
  seed.client_decision,
  seed.client_decision_note,
  seed.owner_name,
  seed.owner_role,
  seed.next_action,
  seed.submitted_by_email,
  seed.submitted_by_role,
  seed.submitted_at,
  seed.classified_by_email,
  seed.classified_at,
  true,
  seed.internal_note,
  seed.sort_order
from public.portal_projects as project
cross join (
  values
    (
      'REQ-001',
      'small_change',
      'Adjust homepage services CTA',
      'Homepage hero and services cards',
      'Client asked whether the CTA can say Request a quote instead of Start project.',
      'They want the button to feel more natural for industrial buyers.',
      'normal',
      date '2026-06-07',
      'Homepage design concept v1',
      'WhatsApp screenshot summary',
      '',
      'whatsapp',
      'triage',
      'included_revision',
      'Included',
      'Same sprint',
      'No launch impact if handled before build lock.',
      'Fits within included copy refinement because it changes wording only.',
      false,
      'not_required',
      '',
      'Kreative Reflow',
      'Studio',
      'Studio will fold this into the next homepage copy pass.',
      'operations@abc-engineering.example',
      'client_owner',
      timestamptz '2026-06-02 10:00:00+02',
      'delite@kreativereflow.com',
      timestamptz '2026-06-02 12:00:00+02',
      'Logged from WhatsApp so the request does not live only in chat.',
      10
    ),
    (
      'REQ-002',
      'scope_change',
      'Add client login for maintenance certificates',
      'Future portal idea',
      'Client asked if customers can log in to download maintenance certificates after launch.',
      'They see this becoming useful for recurring maintenance clients.',
      'high',
      date '2026-06-14',
      'Phase 2 backlog',
      '',
      '',
      'portal',
      'waiting_approval',
      'change_request',
      'Estimate required',
      'Adds discovery and build time',
      'Should be parked for Phase 2 unless approved as paid scope.',
      'This is outside the current SOW and should not start until cost/time impact is approved.',
      true,
      'pending',
      '',
      'ABC Engineering',
      'Client owner',
      'Review the scope impact, then approve, decline, or park this request.',
      'operations@abc-engineering.example',
      'client_owner',
      timestamptz '2026-06-02 15:00:00+02',
      'delite@kreativereflow.com',
      timestamptz '2026-06-03 09:00:00+02',
      'Keep out of active delivery until decision is recorded.',
      20
    ),
    (
      'REQ-003',
      'bug_fix',
      'Mobile contact form spacing looks tight',
      'Contact page mobile form',
      'The form spacing on mobile feels compressed around the upload field.',
      'Client spotted it while reviewing on a phone.',
      'normal',
      date '2026-06-05',
      'Contact page QA',
      'Mobile screenshot in asset library',
      '',
      'phone',
      'in_progress',
      'fix',
      'Included',
      'Same day',
      'No launch impact.',
      'Treat as QA fix, not a billable change.',
      false,
      'not_required',
      '',
      'Kreative Reflow',
      'Studio',
      'Studio is adjusting spacing during the next QA pass.',
      'operations@abc-engineering.example',
      'client_owner',
      timestamptz '2026-06-03 08:30:00+02',
      'delite@kreativereflow.com',
      timestamptz '2026-06-03 10:00:00+02',
      'Phone-reported QA note logged after call.',
      30
    )
) as seed(
  request_number,
  request_type,
  title,
  affected_area,
  request_detail,
  reason,
  urgency,
  desired_deadline,
  related_item_label,
  attachment_label,
  attachment_url,
  source_channel,
  status,
  classification,
  impact_cost_label,
  impact_time_label,
  launch_impact,
  studio_assessment,
  phase2_option,
  client_decision,
  client_decision_note,
  owner_name,
  owner_role,
  next_action,
  submitted_by_email,
  submitted_by_role,
  submitted_at,
  classified_by_email,
  classified_at,
  internal_note,
  sort_order
)
where project.slug = 'abc-engineering-website-redesign'
on conflict (project_id, request_number) do update
set request_type = excluded.request_type,
    title = excluded.title,
    affected_area = excluded.affected_area,
    request_detail = excluded.request_detail,
    reason = excluded.reason,
    urgency = excluded.urgency,
    desired_deadline = excluded.desired_deadline,
    related_item_label = excluded.related_item_label,
    attachment_label = excluded.attachment_label,
    attachment_url = excluded.attachment_url,
    source_channel = excluded.source_channel,
    status = excluded.status,
    classification = excluded.classification,
    impact_cost_label = excluded.impact_cost_label,
    impact_time_label = excluded.impact_time_label,
    launch_impact = excluded.launch_impact,
    studio_assessment = excluded.studio_assessment,
    phase2_option = excluded.phase2_option,
    client_decision = excluded.client_decision,
    client_decision_note = excluded.client_decision_note,
    owner_name = excluded.owner_name,
    owner_role = excluded.owner_role,
    next_action = excluded.next_action,
    submitted_by_email = excluded.submitted_by_email,
    submitted_by_role = excluded.submitted_by_role,
    submitted_at = excluded.submitted_at,
    classified_by_email = excluded.classified_by_email,
    classified_at = excluded.classified_at,
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
  request.project_id,
  request.submitted_at,
  'Jun 2',
  'Request needs scope decision: Add client login for maintenance certificates',
  'This scope-change request is waiting for client approval before any out-of-scope work begins.',
  3,
  'request_classified',
  'portal_project_requests',
  request.id,
  request.classified_by_email,
  true,
  rule.id
from public.portal_project_requests as request
join public.portal_projects as project
  on project.id = request.project_id
left join public.portal_project_notification_rules as rule
  on rule.project_id = request.project_id
  and rule.event_type = 'request_classified'
  and rule.surface = 'portal_activity'
where project.slug = 'abc-engineering-website-redesign'
  and request.request_number = 'REQ-002'
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
