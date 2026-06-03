# Launch Readiness

Last updated: 2026-06-03

## Current Decision

The selected launch path is **marketing-only first**.

The public marketing website can move toward launch after the changed files are reviewed and committed.

The full website with client portal and studio access should not be announced until the portal release set is reviewed, deployed, and verified in production.

Provided Vercel deployment target:

- `https://kreative-reflow-e32zn2lk6-delite-kemistrysouls-projects.vercel.app`

Vercel check on 2026-06-03: the provided URL is reachable, but it is still serving an older build where `/` redirects to `/start` and responds with `X-Robots-Tag: noindex`. Redeploy this release branch before treating that URL as launch-ready.

## What I Need From You

1. Confirm whether I should prepare the current release set for commit after review.
2. Ignore or delete the earlier "Launch Check" test enquiry that was sent while verifying lead delivery.

## Launch Modes

### Marketing-Only Launch

This is acceptable when:

- Public pages build and return `200`.
- `/portal` and `/studio` stay protected and out of the sitemap.
- Contact and tool lead delivery are configured in production.
- The worktree has been reviewed and committed.
- Vercel environment variables match the local production env requirements.

### Full Portal Launch

This requires everything above plus:

- Supabase Auth custom SMTP enabled.
- A fresh magic link works for a studio user and a client member.
- `portal_operational_events` has no unresolved auth delivery blockers.
- Supabase Storage bucket `client-assets` is available.
- Portal table/storage RLS checks have been verified after deployment.

## Required Production Environment

Set these in Vercel or the production host:

- `NEXT_PUBLIC_SITE_URL`
- `APP_URL`
- `BREVO_API_KEY`
- `BREVO_FROM_EMAIL`
- `BREVO_FROM_NAME`
- `LEAD_NOTIFY_EMAIL`
- `LEAD_WEBHOOK_URL` if using Make/Zapier/CRM routing
- `LEAD_WEBHOOK_SECRET` if the webhook expects bearer auth
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET_CLIENT_ASSETS` if not using the default `client-assets`

Supabase Auth SMTP is configured in Supabase Auth settings, not as a Next.js runtime variable. Use a dedicated auth sender such as `no-reply@auth.kreativereflow.com` where possible.

Verified on 2026-06-03: Supabase Auth custom SMTP sends fresh magic links through Brevo, the server-side magic-link template is configured, and local portal login succeeds.

## Supabase SMTP Setup

Supabase Auth needs a real SMTP sender before the client portal is production-ready. The default Supabase sender is only suitable for testing and has strict sending limits.

Use Brevo, Resend, Postmark, SendGrid, Zoho ZeptoMail, AWS SES, or another provider that supports SMTP.

Brevo fast path:

- SMTP host: `smtp-relay.brevo.com`
- SMTP port: `587`
- SMTP username: the Brevo SMTP login email address
- SMTP password: the Brevo SMTP key, not the Brevo API key and not the account password

Recommended auth sender:

- Sender name: `Kreative Reflow`
- Sender email: `no-reply@auth.kreativereflow.com` if the domain can be verified
- Fallback sender email: a verified existing domain sender in the email provider

Current Brevo note: use one of the active verified `@kreativereflow.com` Brevo senders until `no-reply@auth.kreativereflow.com` or the `auth.kreativereflow.com` sender domain is verified.

Dashboard setup:

1. Open the Supabase project dashboard.
2. Go to **Authentication**.
3. Open **Settings**.
4. Find **SMTP Settings** or **Custom SMTP**.
5. Enable custom SMTP.
6. Enter the SMTP host, port, username, password, sender email, and sender name.
7. Save the settings.
8. Check the provider's domain authentication status: SPF, DKIM, and DMARC should be passing where available.
9. Request a fresh magic link for one studio user.
10. Request a fresh magic link for one client portal user.
11. Run `npm run launch:check` again after both emails arrive and login works.

Magic link email template for this Next.js server-side portal:

```html
<h2>Your sign-in link</h2>

<p>Follow the link below to sign in. This link expires shortly and can only be used once.</p>
<p><a href="{{ .RedirectTo }}&token_hash={{ .TokenHash }}&type=email">Sign in</a></p>
```

The portal passes a `next` parameter in `RedirectTo`, so the template appends `token_hash` with `&`.

If I configure it for you, I need one of these:

- Temporary access to the Supabase project with permission to edit Auth settings, plus access to the email provider's SMTP credentials.
- Or a Supabase Management API access token, the project ref, and the SMTP credentials.
- Or you can configure it yourself and send me only "done" once both test emails arrive.

## Repeatable Check

With the local dev server running:

```bash
npm run launch:check
```

The command checks:

- Required launch env vars are present without printing secrets.
- Lead delivery env is configured.
- Public routes return `200`.
- Protected portal/studio routes redirect to login.
- Supabase portal operational events do not contain unresolved Auth rate-limit blockers.
- The client asset storage bucket exists.
- The git worktree is clean enough for release.

The command exits non-zero when blockers remain.

## Immediate Fix Order

1. Review and commit the current worktree.
2. Configure Vercel project/env values for the provided deployment target.
3. Deploy the marketing-only site with portal and studio routes still protected.
4. Verify one fresh studio magic link and one fresh client magic link in production after deploy.
5. Run `npm run lint`, `npm run build`, and `npm run launch:check`.
