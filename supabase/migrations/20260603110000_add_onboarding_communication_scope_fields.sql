-- Add communication, missing-item owner, and scope-boundary fields to onboarding responses.
-- These fields support the Phase 9 intake gate before active delivery starts.

alter table public.portal_onboarding_responses
  add column if not exists missing_content_owner text not null default '',
  add column if not exists missing_content_due_date date,
  add column if not exists missing_access_owner text not null default '',
  add column if not exists missing_access_due_date date,
  add column if not exists update_cadence text not null default '',
  add column if not exists preferred_update_channel text not null default '',
  add column if not exists urgent_channel text not null default '',
  add column if not exists meeting_availability text not null default '',
  add column if not exists scope_inclusions text not null default '',
  add column if not exists scope_exclusions text not null default '',
  add column if not exists revision_rounds text not null default '',
  add column if not exists change_request_authority text not null default '',
  add column if not exists scope_boundary_accepted boolean not null default false;

update public.portal_onboarding_responses
set
  missing_content_owner = 'ABC Engineering marketing lead',
  missing_content_due_date = date '2026-06-12',
  missing_access_owner = 'ABC Engineering IT manager',
  missing_access_due_date = date '2026-06-07',
  update_cadence = 'Weekly',
  preferred_update_channel = 'Portal',
  urgent_channel = 'WhatsApp',
  meeting_availability = 'Tuesdays or Thursdays after 10:00, with the operations lead and CEO for design sign-off.',
  scope_inclusions = 'Homepage, services overview, RFQ form, certifications section, launch handoff, and one client portal project record.',
  scope_exclusions = 'E-commerce, full CRM replacement, and ERP integration are Phase 2 unless approved as a change request.',
  revision_rounds = '2 included rounds',
  change_request_authority = 'Operations lead can request changes; CEO approves billable scope changes.',
  scope_boundary_accepted = true
where contact_email = 'approver@abc-engineering.example';
