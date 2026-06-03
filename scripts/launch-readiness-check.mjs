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
