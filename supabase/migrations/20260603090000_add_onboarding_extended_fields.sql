-- Add extended onboarding fields for foolproof project intake
-- These columns capture competitive context, budget, decision-making,
-- technical integrations, and creative direction before kickoff.

alter table public.portal_onboarding_responses
  add column if not exists current_website text not null default '',
  add column if not exists budget_range text,
  add column if not exists competitors text not null default '',
  add column if not exists decision_process text not null default '',
  add column if not exists specific_features text not null default '',
  add column if not exists social_presence text not null default '',
  add column if not exists tone_style_preferences text not null default '',
  add column if not exists previous_agency_experience text not null default '',
  add column if not exists existing_integrations text[] not null default '{}';

-- Update the demo seed row with realistic extended data
update public.portal_onboarding_responses
set
  current_website = 'https://www.abc-engineering.co.za',
  budget_range = 'R30,000 - R50,000',
  competitors = 'SteelFab SA, ProEng Solutions, and MetalWorks Industrial. Their sites are clean but lack quote request flows.',
  decision_process = 'Operations lead approves. CEO reviews final design before development starts.',
  specific_features = 'Quote request form with project type selection, document upload for RFQs, and certification display section.',
  social_presence = 'LinkedIn company page with 200 followers. No Instagram or Facebook presence.',
  tone_style_preferences = 'Professional, industrial, and trustworthy. Not overly corporate.',
  previous_agency_experience = 'Previous developer built the current site 5 years ago. Slow response times were the main complaint.',
  existing_integrations = array['Analytics (Google Analytics, GTM, Hotjar)']
where contact_email = 'approver@abc-engineering.example';
