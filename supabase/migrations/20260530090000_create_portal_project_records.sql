create extension if not exists pgcrypto;

create table if not exists public.portal_clients (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portal_projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.portal_clients(id) on delete cascade,
  slug text not null unique,
  project_name text not null,
  phase text not null,
  status text not null,
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  started_on date,
  target_launch_on date,
  next_action text not null default '',
  visibility text not null default 'preview' check (visibility in ('preview', 'active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portal_project_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.portal_projects(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  email text not null,
  role text not null check (role in ('studio_admin', 'client_owner', 'client_collaborator', 'viewer')),
  invited_at timestamptz not null default now(),
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  unique (project_id, email)
);

create table if not exists public.portal_project_steps (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.portal_projects(id) on delete cascade,
  title text not null,
  status text not null,
  detail text not null,
  icon_name text not null default 'check',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, title)
);

create table if not exists public.portal_project_milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.portal_projects(id) on delete cascade,
  label text not null,
  state text not null,
  due_on date,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, label)
);

create table if not exists public.portal_project_asset_buckets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.portal_projects(id) on delete cascade,
  title text not null,
  detail text not null,
  file_count integer not null default 0 check (file_count >= 0),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, title)
);

create table if not exists public.portal_project_activity (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.portal_projects(id) on delete cascade,
  occurred_at timestamptz,
  display_time text not null,
  title text not null,
  meta text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, title, display_time)
);

alter table public.portal_clients enable row level security;
alter table public.portal_projects enable row level security;
alter table public.portal_project_members enable row level security;
alter table public.portal_project_steps enable row level security;
alter table public.portal_project_milestones enable row level security;
alter table public.portal_project_asset_buckets enable row level security;
alter table public.portal_project_activity enable row level security;

grant select, insert, update, delete
on table
  public.portal_clients,
  public.portal_projects,
  public.portal_project_members,
  public.portal_project_steps,
  public.portal_project_milestones,
  public.portal_project_asset_buckets,
  public.portal_project_activity
to service_role;

insert into public.portal_clients (slug, name)
values ('abc-engineering', 'ABC Engineering')
on conflict (slug) do update
set name = excluded.name,
    updated_at = now();

insert into public.portal_projects (
  client_id,
  slug,
  project_name,
  phase,
  status,
  progress,
  started_on,
  target_launch_on,
  next_action,
  visibility
)
select
  id,
  'abc-engineering-website-redesign',
  'Website Redesign',
  'Design Phase',
  'In progress',
  42,
  date '2026-05-15',
  date '2026-07-10',
  'Review homepage concept and upload final team photos.',
  'preview'
from public.portal_clients
where slug = 'abc-engineering'
on conflict (slug) do update
set project_name = excluded.project_name,
    phase = excluded.phase,
    status = excluded.status,
    progress = excluded.progress,
    started_on = excluded.started_on,
    target_launch_on = excluded.target_launch_on,
    next_action = excluded.next_action,
    visibility = excluded.visibility,
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
    ('Onboarding', 'Complete', 'Questionnaire submitted and discovery notes captured.', 'check', 10),
    ('Assets', 'Needs files', 'Logo received. Photos, service copy, and certifications still missing.', 'upload', 20),
    ('Milestones', 'Active', 'Sitemap approved. Homepage design is ready for client review.', 'milestones', 30),
    ('Approvals', 'Waiting', 'No active approval yet. Timestamped approvals unlock in phase two.', 'approval', 40)
) as seed(title, status, detail, icon_name, sort_order)
where project.slug = 'abc-engineering-website-redesign'
on conflict (project_id, title) do update
set status = excluded.status,
    detail = excluded.detail,
    icon_name = excluded.icon_name,
    sort_order = excluded.sort_order,
    updated_at = now();

insert into public.portal_project_milestones (
  project_id,
  label,
  state,
  due_on,
  sort_order
)
select
  project.id,
  seed.label,
  seed.state,
  seed.due_on,
  seed.sort_order
from public.portal_projects as project
cross join (
  values
    ('Onboarding complete', 'Done', date '2026-05-15', 10),
    ('Sitemap and wireframes', 'Done', date '2026-05-22', 20),
    ('Homepage design concept', 'Review', date '2026-05-30', 30),
    ('Development sprint', 'Upcoming', date '2026-06-10', 40),
    ('Testing and revisions', 'Upcoming', date '2026-06-28', 50),
    ('Launch and handoff', 'Upcoming', date '2026-07-10', 60)
) as seed(label, state, due_on, sort_order)
where project.slug = 'abc-engineering-website-redesign'
on conflict (project_id, label) do update
set state = excluded.state,
    due_on = excluded.due_on,
    sort_order = excluded.sort_order,
    updated_at = now();

insert into public.portal_project_asset_buckets (
  project_id,
  title,
  detail,
  file_count,
  sort_order
)
select
  project.id,
  seed.title,
  seed.detail,
  seed.file_count,
  seed.sort_order
from public.portal_projects as project
cross join (
  values
    ('Logo Files', 'SVG, PNG, AI, EPS', 3, 10),
    ('Brand Assets', 'Guides, palettes, font files', 1, 20),
    ('Photos & Images', 'Team, office, products, proof', 0, 30),
    ('Written Content', 'About, services, FAQs, bios', 2, 40),
    ('Legal Documents', 'Licenses, policies, compliance', 0, 50),
    ('Other', 'Anything that does not fit above', 0, 60)
) as seed(title, detail, file_count, sort_order)
where project.slug = 'abc-engineering-website-redesign'
on conflict (project_id, title) do update
set detail = excluded.detail,
    file_count = excluded.file_count,
    sort_order = excluded.sort_order,
    updated_at = now();

insert into public.portal_project_activity (
  project_id,
  occurred_at,
  display_time,
  title,
  meta,
  sort_order
)
select
  project.id,
  seed.occurred_at,
  seed.display_time,
  seed.title,
  seed.meta,
  seed.sort_order
from public.portal_projects as project
cross join (
  values
    (timestamptz '2026-05-30 09:15:00+02', 'Today 09:15', 'Homepage design v1 uploaded for review', 'Deliverable added to review queue', 10),
    (timestamptz '2026-05-30 08:30:00+02', 'Today 08:30', 'Client uploaded two service description documents', 'Written content bucket updated', 20),
    (timestamptz '2026-05-29 15:00:00+02', 'Yesterday', 'Milestone completed: Sitemap and wireframes', 'Project tracker updated', 30),
    (timestamptz '2026-05-29 10:30:00+02', 'Yesterday', 'Deposit invoice marked paid', 'Finance status synced to portal', 40)
) as seed(occurred_at, display_time, title, meta, sort_order)
where project.slug = 'abc-engineering-website-redesign'
on conflict (project_id, title, display_time) do update
set occurred_at = excluded.occurred_at,
    meta = excluded.meta,
    sort_order = excluded.sort_order,
    updated_at = now();
