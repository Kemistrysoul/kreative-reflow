insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'client-assets',
  'client-assets',
  false,
  10485760,
  array[
    'application/illustrator',
    'application/msword',
    'application/pdf',
    'application/postscript',
    'application/vnd.ms-excel',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip',
    'image/jpeg',
    'image/png',
    'image/svg+xml',
    'image/webp',
    'text/csv',
    'text/plain'
  ]::text[]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.portal_project_assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.portal_projects(id) on delete cascade,
  bucket_id text not null default 'client-assets',
  storage_path text not null,
  asset_category text not null check (
    asset_category in (
      'logo-files',
      'brand-assets',
      'photos-images',
      'written-content',
      'legal-documents',
      'other'
    )
  ),
  asset_bucket_title text not null,
  original_filename text not null,
  stored_filename text not null,
  content_type text not null,
  file_size_bytes bigint not null check (file_size_bytes > 0 and file_size_bytes <= 10485760),
  upload_status text not null default 'received' check (
    upload_status in ('received', 'accepted', 'needs_replacement', 'quarantined')
  ),
  review_status text not null default 'pending_review' check (
    review_status in ('pending_review', 'approved', 'rejected')
  ),
  uploaded_by_user_id uuid references auth.users(id) on delete set null,
  uploaded_by_email text not null default '',
  review_note text not null default '',
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bucket_id, storage_path)
);

create index if not exists portal_project_assets_project_idx
on public.portal_project_assets (project_id, created_at desc);

create index if not exists portal_project_assets_review_idx
on public.portal_project_assets (review_status, upload_status, created_at desc);

alter table public.portal_project_assets enable row level security;

grant select, insert, update, delete
on table public.portal_project_assets
to service_role;

grant select, insert, update
on table public.portal_project_assets
to authenticated;

drop policy if exists "portal members can view project assets" on public.portal_project_assets;
drop policy if exists "portal contributors can create project assets" on public.portal_project_assets;
drop policy if exists "portal studio admins can update project assets" on public.portal_project_assets;
drop policy if exists "portal members can read client storage objects" on storage.objects;
drop policy if exists "portal contributors can upload client storage objects" on storage.objects;
drop policy if exists "portal studio admins can update client storage objects" on storage.objects;
drop policy if exists "portal studio admins can delete client storage objects" on storage.objects;

create policy "portal members can view project assets"
on public.portal_project_assets
for select
to authenticated
using (
  exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_assets.project_id
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal contributors can create project assets"
on public.portal_project_assets
for insert
to authenticated
with check (
  exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_assets.project_id
      and member.role in ('studio_admin', 'client_owner', 'client_collaborator')
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal studio admins can update project assets"
on public.portal_project_assets
for update
to authenticated
using (
  exists (
    select 1
    from public.portal_project_members as member
    where member.project_id = portal_project_assets.project_id
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
    where member.project_id = portal_project_assets.project_id
      and member.role = 'studio_admin'
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal members can read client storage objects"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'client-assets'
  and (storage.foldername(name))[1] = 'projects'
  and exists (
    select 1
    from public.portal_project_members as member
    where member.project_id::text = (storage.foldername(name))[2]
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal contributors can upload client storage objects"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'client-assets'
  and (storage.foldername(name))[1] = 'projects'
  and exists (
    select 1
    from public.portal_project_members as member
    where member.project_id::text = (storage.foldername(name))[2]
      and member.role in ('studio_admin', 'client_owner', 'client_collaborator')
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal studio admins can update client storage objects"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'client-assets'
  and (storage.foldername(name))[1] = 'projects'
  and exists (
    select 1
    from public.portal_project_members as member
    where member.project_id::text = (storage.foldername(name))[2]
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
  bucket_id = 'client-assets'
  and (storage.foldername(name))[1] = 'projects'
  and exists (
    select 1
    from public.portal_project_members as member
    where member.project_id::text = (storage.foldername(name))[2]
      and member.role = 'studio_admin'
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);

create policy "portal studio admins can delete client storage objects"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'client-assets'
  and (storage.foldername(name))[1] = 'projects'
  and exists (
    select 1
    from public.portal_project_members as member
    where member.project_id::text = (storage.foldername(name))[2]
      and member.role = 'studio_admin'
      and member.revoked_at is null
      and (member.invite_expires_at is null or member.invite_expires_at > now())
      and (
        member.user_id = (select auth.uid())
        or lower(member.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  )
);
