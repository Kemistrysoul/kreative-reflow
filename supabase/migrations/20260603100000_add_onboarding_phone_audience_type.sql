-- Add contact phone and audience type to onboarding responses
-- Phone provides a backup contact method; audience type distinguishes B2B/B2C delivery.

alter table public.portal_onboarding_responses
  add column if not exists contact_phone text not null default '',
  add column if not exists audience_type text not null default '';

-- Update the demo seed row with realistic data
update public.portal_onboarding_responses
set
  contact_phone = '+27 11 000 0000',
  audience_type = 'B2B (Business to business)'
where contact_email = 'approver@abc-engineering.example';
