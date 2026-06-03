import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const cwd = process.cwd();
const localBaseUrl = process.env.LAUNCH_CHECK_URL || 'http://localhost:3000';
const envPath = path.join(cwd, '.env.local');
const statuses = [];

function add(level, title, detail = '') {
  statuses.push({ detail, level, title });
}

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;

  for (const line of readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (process.env[key]) continue;

    process.env[key] = rawValue.trim().replace(/^['"]|['"]$/g, '');
  }
}

function hasValue(key) {
  return Boolean(process.env[key]?.trim());
}

function hasAny(keys) {
  return keys.some((key) => hasValue(key));
}

function getGitStatusCount() {
  try {
    return execSync('git status --short', {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .split(/\r?\n/)
      .filter(Boolean).length;
  } catch {
    return null;
  }
}

async function fetchStatus(route) {
  const response = await fetch(`${localBaseUrl}${route}`, { redirect: 'manual' });
  return {
    location: response.headers.get('location'),
    status: response.status,
  };
}

async function checkRoutes() {
  try {
    const health = await fetchStatus('/');
    if (health.status !== 200) {
      add('blocker', 'Homepage route is not healthy', `Expected 200, received ${health.status}.`);
      return;
    }
  } catch {
    add('warn', 'Local route checks skipped', `${localBaseUrl} is not reachable. Start the dev server before route checks.`);
    return;
  }

  const publicRoutes = [
    '/',
    '/about',
    '/services',
    '/work',
    '/tools',
    '/insights',
    '/contact',
    '/privacy',
    '/terms',
    '/robots.txt',
    '/sitemap.xml',
  ];
  const protectedRoutes = ['/portal', '/portal/onboarding', '/studio', '/studio/projects'];

  const publicResults = await Promise.all(publicRoutes.map(async (route) => [route, await fetchStatus(route)]));
  const failedPublicRoutes = publicResults.filter(([, result]) => result.status !== 200);

  if (failedPublicRoutes.length) {
    add(
      'blocker',
      'Public route check failed',
      failedPublicRoutes.map(([route, result]) => `${route} -> ${result.status}`).join(', '),
    );
  } else {
    add('pass', 'Public route check passed', `${publicRoutes.length} public routes returned 200.`);
  }

  const protectedResults = await Promise.all(protectedRoutes.map(async (route) => [route, await fetchStatus(route)]));
  const failedProtectedRoutes = protectedResults.filter(([, result]) => result.status !== 307);

  if (failedProtectedRoutes.length) {
    add(
      'blocker',
      'Protected route gate failed',
      failedProtectedRoutes.map(([route, result]) => `${route} -> ${result.status}`).join(', '),
    );
  } else {
    add('pass', 'Protected route gate passed', `${protectedRoutes.length} protected routes redirected to login.`);
  }
}

async function checkSupabaseOperationalEvents() {
  if (!hasValue('NEXT_PUBLIC_SUPABASE_URL') || !hasValue('SUPABASE_SERVICE_ROLE_KEY')) {
    add('warn', 'Supabase operational check skipped', 'NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing.');
    return;
  }

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await supabase
    .from('portal_operational_events')
    .select('event_type,severity,title,detail,source_route,event_metadata')
    .is('resolved_at', null)
    .order('created_at', { ascending: false })
    .limit(12);

  if (error) {
    add('warn', 'Supabase operational events could not be read', error.message);
    return;
  }

  const unresolved = data ?? [];
  const authRateLimit = unresolved.find((event) => {
    const metadata = event.event_metadata && typeof event.event_metadata === 'object' ? event.event_metadata : {};
    return (
      event.event_type === 'auth_failure' &&
      (event.detail.toLowerCase().includes('rate limit') || metadata.rateLimited === true)
    );
  });

  if (authRateLimit) {
    add(
      'blocker',
      'Portal Auth email delivery is still blocked',
      'Supabase has unresolved Auth rate-limit events. Configure custom SMTP and verify a fresh magic link.',
    );
  } else if (unresolved.length) {
    add('warn', 'Portal operational events need review', `${unresolved.length} unresolved portal event(s) were found.`);
  } else {
    add('pass', 'Portal operational events clear', 'No unresolved portal operational events were found.');
  }

  const bucketName = process.env.SUPABASE_STORAGE_BUCKET_CLIENT_ASSETS || 'client-assets';
  const buckets = await supabase.storage.listBuckets();

  if (buckets.error) {
    add('warn', 'Supabase Storage buckets could not be checked', buckets.error.message);
  } else if (!buckets.data.some((bucket) => bucket.name === bucketName)) {
    add('blocker', 'Client asset bucket is missing', `Expected Supabase Storage bucket "${bucketName}".`);
  } else {
    add('pass', 'Client asset bucket available', `Supabase Storage bucket "${bucketName}" exists.`);
  }

  const readinessResult = await supabase
    .from('portal_project_readiness_items')
    .select('item_key,status,portal_projects!inner(slug)')
    .eq('portal_projects.slug', 'abc-engineering-website-redesign');

  if (readinessResult.error) {
    add(
      'blocker',
      'Portal readiness gate table is unavailable',
      `${readinessResult.error.code || 'unknown'}: ${readinessResult.error.message}`,
    );
  } else {
    const readinessItems = readinessResult.data ?? [];
    const requiredKeys = new Set([
      'agreement_signed',
      'sow_approved',
      'deposit_paid',
      'billing_contact_confirmed',
      'kickoff_completed',
      'approval_owner_confirmed',
      'brand_content_assets_ready',
      'technical_access_ready',
      'timeline_constraints_confirmed',
      'communication_rules_confirmed',
    ]);
    const receivedKeys = new Set(readinessItems.map((item) => item.item_key));
    const missingKeys = [...requiredKeys].filter((key) => !receivedKeys.has(key));

    if (missingKeys.length) {
      add('blocker', 'Portal readiness gate seed is incomplete', `Missing ${missingKeys.join(', ')}.`);
    } else {
      add('pass', 'Portal readiness gate available', `${readinessItems.length} readiness item(s) are available.`);
    }
  }

  const readinessRule = await supabase
    .from('portal_project_notification_rules')
    .select('id')
    .eq('event_type', 'readiness_gate_updated')
    .eq('surface', 'portal_activity')
    .limit(1);

  if (readinessRule.error) {
    add('warn', 'Readiness notification rule could not be checked', readinessRule.error.message);
  } else if (!readinessRule.data?.length) {
    add('blocker', 'Readiness notification rule is missing', 'Expected readiness_gate_updated portal activity rule.');
  } else {
    add('pass', 'Readiness notification rule available', 'Readiness gate updates can be logged to portal activity.');
  }

  const requestResult = await supabase
    .from('portal_project_requests')
    .select('request_number,request_type,status,classification,client_decision,owner_name,next_action,portal_projects!inner(slug)')
    .eq('portal_projects.slug', 'abc-engineering-website-redesign')
    .order('request_number', { ascending: true });

  if (requestResult.error) {
    add(
      'blocker',
      'Portal request center table is unavailable',
      `${requestResult.error.code || 'unknown'}: ${requestResult.error.message}`,
    );
  } else {
    const requests = requestResult.data ?? [];
    const requiredRequestNumbers = new Set(['REQ-001', 'REQ-002', 'REQ-003']);
    const receivedRequestNumbers = new Set(requests.map((request) => request.request_number));
    const missingRequestNumbers = [...requiredRequestNumbers].filter((requestNumber) => !receivedRequestNumbers.has(requestNumber));
    const missingOperationalFields = requests.filter((request) => !request.status || !request.owner_name || !request.next_action);
    const pendingScopeRequest = requests.find((request) => request.request_number === 'REQ-002');

    if (missingRequestNumbers.length) {
      add('blocker', 'Portal request seed is incomplete', `Missing ${missingRequestNumbers.join(', ')}.`);
    } else if (missingOperationalFields.length) {
      add('blocker', 'Portal request operational fields are incomplete', 'Every request needs status, owner, and next action.');
    } else if (
      !pendingScopeRequest ||
      pendingScopeRequest.classification !== 'change_request' ||
      pendingScopeRequest.client_decision !== 'pending' ||
      pendingScopeRequest.status !== 'waiting_approval'
    ) {
      add(
        'blocker',
        'Scope approval guard seed is not intact',
        'REQ-002 must remain a pending change request until the client approves, declines, or parks it.',
      );
    } else {
      add('pass', 'Portal request center available', `${requests.length} request record(s) are available with owner and next action.`);
      add('pass', 'Scope approval guard visible', 'Seeded out-of-scope work is waiting for client approval before delivery.');
    }
  }

  const requestRules = await supabase
    .from('portal_project_notification_rules')
    .select('event_type,portal_projects!inner(slug)')
    .eq('portal_projects.slug', 'abc-engineering-website-redesign')
    .eq('surface', 'portal_activity')
    .in('event_type', ['request_submitted', 'request_classified', 'request_decision_submitted']);

  if (requestRules.error) {
    add('warn', 'Request notification rules could not be checked', requestRules.error.message);
  } else if ((requestRules.data ?? []).length < 3) {
    add('blocker', 'Request notification rules are missing', 'Expected request_submitted, request_classified, and request_decision_submitted rules.');
  } else {
    add('pass', 'Request notification rules available', 'Request activity can be written to the client portal timeline.');
  }

  const meetingResult = await supabase
    .from('portal_project_meeting_requests')
    .select('meeting_number,status,title,next_action,portal_projects!inner(slug)')
    .eq('portal_projects.slug', 'abc-engineering-website-redesign')
    .order('meeting_number', { ascending: true });

  if (meetingResult.error) {
    add(
      'blocker',
      'Portal meeting request table is unavailable',
      `${meetingResult.error.code || 'unknown'}: ${meetingResult.error.message}`,
    );
  } else {
    const meetings = meetingResult.data ?? [];
    const seededMeeting = meetings.find((meeting) => meeting.meeting_number === 'MTG-001');

    if (!seededMeeting || !seededMeeting.status || !seededMeeting.next_action) {
      add('blocker', 'Portal meeting seed is incomplete', 'Expected MTG-001 with status and next action.');
    } else {
      add('pass', 'Portal meeting requests available', `${meetings.length} meeting request record(s) are available.`);
    }
  }

  const threadResult = await supabase
    .from('portal_project_message_threads')
    .select('id,thread_key,status,subject,last_message_at,portal_projects!inner(slug)')
    .eq('portal_projects.slug', 'abc-engineering-website-redesign')
    .order('last_message_at', { ascending: false });

  if (threadResult.error) {
    add(
      'blocker',
      'Portal message thread table is unavailable',
      `${threadResult.error.code || 'unknown'}: ${threadResult.error.message}`,
    );
  } else {
    const threads = threadResult.data ?? [];
    const seededThread = threads.find((thread) => thread.thread_key === 'homepage-review-thread');

    if (!seededThread || !seededThread.status || !seededThread.last_message_at) {
      add('blocker', 'Portal message thread seed is incomplete', 'Expected homepage-review-thread with status and last message timestamp.');
    } else {
      add('pass', 'Portal message threads available', `${threads.length} message thread record(s) are available.`);
    }
  }

  const messageResult = await supabase
    .from('portal_project_messages')
    .select('id,action_required,action_owner,portal_projects!inner(slug)')
    .eq('portal_projects.slug', 'abc-engineering-website-redesign');

  if (messageResult.error) {
    add('warn', 'Portal project messages could not be checked', messageResult.error.message);
  } else {
    const messages = messageResult.data ?? [];
    const actionableMessage = messages.find((message) => message.action_required && message.action_owner);

    if (messages.length < 2 || !actionableMessage) {
      add('blocker', 'Portal message seed is incomplete', 'Expected at least two messages and one action-owner message.');
    } else {
      add('pass', 'Portal project messages available', `${messages.length} client-visible message record(s) are available.`);
    }
  }

  const decisionResult = await supabase
    .from('portal_project_decisions')
    .select('decision_number,decision_type,status,source_channel,outcome,owner_name,portal_projects!inner(slug)')
    .eq('portal_projects.slug', 'abc-engineering-website-redesign')
    .order('decision_number', { ascending: true });

  if (decisionResult.error) {
    add(
      'blocker',
      'Portal decision log table is unavailable',
      `${decisionResult.error.code || 'unknown'}: ${decisionResult.error.message}`,
    );
  } else {
    const decisions = decisionResult.data ?? [];
    const kickoffDecision = decisions.find((decision) => decision.decision_number === 'DEC-001');
    const whatsappDecision = decisions.find((decision) => decision.decision_number === 'DEC-002');

    if (!kickoffDecision || !whatsappDecision) {
      add('blocker', 'Portal decision seed is incomplete', 'Expected DEC-001 and DEC-002 decision records.');
    } else if (whatsappDecision.decision_type !== 'whatsapp_summary' || whatsappDecision.source_channel !== 'whatsapp') {
      add('blocker', 'Outside-channel decision seed is not intact', 'DEC-002 must remain a WhatsApp summary decision.');
    } else {
      add('pass', 'Portal decision log available', `${decisions.length} written decision record(s) are available.`);
    }
  }

  const communicationRules = await supabase
    .from('portal_project_notification_rules')
    .select('event_type,portal_projects!inner(slug)')
    .eq('portal_projects.slug', 'abc-engineering-website-redesign')
    .eq('surface', 'portal_activity')
    .in('event_type', ['meeting_requested', 'meeting_scheduled', 'message_posted', 'decision_logged']);

  if (communicationRules.error) {
    add('warn', 'Communication notification rules could not be checked', communicationRules.error.message);
  } else if ((communicationRules.data ?? []).length < 4) {
    add(
      'blocker',
      'Communication notification rules are missing',
      'Expected meeting_requested, meeting_scheduled, message_posted, and decision_logged rules.',
    );
  } else {
    add('pass', 'Communication notification rules available', 'Meetings, messages, and decisions can write to portal activity.');
  }

  const communicationActivity = await supabase
    .from('portal_project_activity')
    .select('activity_type,portal_projects!inner(slug)')
    .eq('portal_projects.slug', 'abc-engineering-website-redesign')
    .in('activity_type', ['meeting_requested', 'decision_logged']);

  if (communicationActivity.error) {
    add('warn', 'Communication activity could not be checked', communicationActivity.error.message);
  } else if ((communicationActivity.data ?? []).length < 2) {
    add('blocker', 'Communication activity seed is missing', 'Expected client-visible meeting and decision activity records.');
  } else {
    add('pass', 'Communication activity available', 'Meeting and decision records are visible in the portal activity stream.');
  }
}

loadEnvFile(envPath);

if (!existsSync(envPath)) {
  add('warn', '.env.local missing', 'Local checks can still run, but env-dependent checks will be limited.');
}

if (!hasAny(['NEXT_PUBLIC_SITE_URL', 'APP_URL'])) {
  add('blocker', 'Site URL env missing', 'Set NEXT_PUBLIC_SITE_URL or APP_URL in production.');
}

if (!hasValue('BREVO_API_KEY') || !hasValue('BREVO_FROM_EMAIL') || !hasValue('LEAD_NOTIFY_EMAIL')) {
  add('blocker', 'Lead email delivery env missing', 'Set BREVO_API_KEY, BREVO_FROM_EMAIL, and LEAD_NOTIFY_EMAIL.');
} else {
  add('pass', 'Lead email delivery env present', 'Brevo and owner notification variables are configured locally.');
}

if (!hasValue('LEAD_WEBHOOK_URL')) {
  add('warn', 'Lead webhook env missing', 'LEAD_WEBHOOK_URL is optional, but recommended for CRM/automation routing.');
}

if (!hasValue('NEXT_PUBLIC_SUPABASE_URL') || !hasAny(['NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY']) || !hasValue('SUPABASE_SERVICE_ROLE_KEY')) {
  add('blocker', 'Portal Supabase env missing', 'Set Supabase URL, publishable/anon key, and service role key before portal launch.');
} else {
  add('pass', 'Portal Supabase env present', 'Supabase URL, public key, and service role key are configured locally.');
}

if (!existsSync(path.join(cwd, '.vercel', 'project.json'))) {
  add('warn', 'Vercel project link not found locally', 'Run `vercel link` or configure deployment through the Vercel dashboard before launch.');
}

const changedEntries = getGitStatusCount();
if (typeof changedEntries === 'number') {
  if (changedEntries > 0) {
    add('blocker', 'Worktree is not deployment-clean', `${changedEntries} changed or untracked entries need review before release.`);
  } else {
    add('pass', 'Worktree is clean', 'No changed or untracked files detected.');
  }
}

await checkRoutes();
await checkSupabaseOperationalEvents();

const order = { blocker: 0, warn: 1, pass: 2 };
const label = { blocker: 'BLOCKER', pass: 'PASS', warn: 'WARN' };

for (const status of statuses.sort((a, b) => order[a.level] - order[b.level])) {
  console.log(`${label[status.level]}: ${status.title}${status.detail ? ` - ${status.detail}` : ''}`);
}

const blockers = statuses.filter((status) => status.level === 'blocker');
const warnings = statuses.filter((status) => status.level === 'warn');

console.log('');
console.log(`Launch readiness: ${blockers.length ? 'NOT READY' : warnings.length ? 'READY WITH WARNINGS' : 'READY'}`);
console.log(`Blockers: ${blockers.length}`);
console.log(`Warnings: ${warnings.length}`);

if (blockers.length) {
  process.exitCode = 1;
}
