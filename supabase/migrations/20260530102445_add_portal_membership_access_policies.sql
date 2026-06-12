alter table public.portal_project_members
  add column if not exists invite_expires_at timestamptz,
  add column if not exists revoked_at timestamptz,
  add column if not exists last_accessed_at timestamptz;

alter table public.portal_onboarding_responses
  add column if not exists submitted_by_user_id uuid references auth.users(id) on delete set null,
  add column if not exists submitted_by_email text;

create index if not exists portal_project_members_user_idx
on public.portal_project_members (user_id, project_id)
where revoked_at is null;

create index if not exists portal_project_members_email_idx
on public.portal_project_members (lower(email), project_id)
where revoked_at is null;

create index if not exists portal_project_members_role_idx
on public.portal_project_members (role, project_id)
where revoked_at is null;

create index if not exists portal_onboarding_responses_submitted_by_idx
on public.portal_onboarding_responses (submitted_by_user_id, project_id);

grant select
on table
  public.portal_clients,
  public.portal_projects,
  public.portal_project_members,
  public.portal_project_steps,
  public.portal_project_milestones,
  public.portal_project_asset_buckets,
  public.portal_project_activity
to authenticated;

grant select, insert, update
on table public.portal_onboarding_responses
to authenticated;

drop policy if exists "portal members can view own membership" on public.portal_project_members;
drop policy if exists "portal members can view assigned clients" on public.portal_clients;
drop policy if exists "portal members can view assigned projects" on public.portal_projects;
drop policy if exists "portal members can view project steps" on public.portal_project_steps;
drop policy if exists "portal members can view project milestones" on public.portal_project_milestones;
drop policy if exists "portal members can view asset buckets" on public.portal_project_asset_buckets;
drop policy if exists "portal members can view project activity" on public.portal_project_activity;
drop policy if exists "portal members can view onboarding responses" on public.portal_onboarding_responses;
drop policy if exists "portal contributors can insert onboarding responses" on public.portal_onboarding_responses;
drop policy if exists "portal contributors can update onboarding responses" on public.portal_onboarding_responses;

create policy "portal members can view own membership"
on public.portal_project_members
for select
to authenticated
using (
  (select auth.uid()) is not null
  and revoked_at is null
  and (invite_expires_at is null or invite_expires_at > now())
  and (
    user_id = (select auth.uid())
    or lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
);

create policy "portal members can view assigned clients"
on public.portal_clients
for select
to authenticated
using (
  exists (
    select 1
    from public.portal_projects as project
    join public.portal_project_members as member
      on member.project_id = project.id
    where project.client_id = portal_clients.id
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal members can view assigned projects"
on public.portal_projects
for select
to authenticated
using (
  exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_projects.id
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal members can view project steps"
on public.portal_project_steps
for select
to authenticated
using (
  exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_steps.project_id
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal members can view project milestones"
on public.portal_project_milestones
for select
to authenticated
using (
  exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_milestones.project_id
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal members can view asset buckets"
on public.portal_project_asset_buckets
for select
to authenticated
using (
  exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_asset_buckets.project_id
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
  )
);

create policy "portal members can view onboarding responses"
on public.portal_onboarding_responses
for select
to authenticated
using (
  exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_onboarding_responses.project_id
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal contributors can insert onboarding responses"
on public.portal_onboarding_responses
for insert
to authenticated
with check (
  exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_onboarding_responses.project_id
      and member.role in ('studio_admin', 'client_owner', 'client_collaborator')
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal contributors can update onboarding responses"
on public.portal_onboarding_responses
for update
to authenticated
using (
  exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_onboarding_responses.project_id
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
  exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_onboarding_responses.project_id
      and member.role in ('studio_admin', 'client_owner', 'client_collaborator')
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);
