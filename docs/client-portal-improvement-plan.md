# Client Portal Improvement Plan

Living document for turning the current `/portal` preview into a usable Kreative Reflow client portal.

Last updated: 2026-06-03

## Status Legend

- `[x]` Done
- `[~]` In progress
- `[ ]` Not started
- `[!]` Blocked or needs a decision

## Current Portal Dashboard Audit - 2026-06-03

Source checked in this pass:

- `app/portal/(workspace)/page.tsx`
- `components/portal/PortalChrome.tsx`
- `app/portal/onboarding/onboarding-form.tsx`
- `components/studio/projects-workspace.tsx`
- `lib/portal-onboarding.ts`
- `lib/portal-onboarding-types.ts`
- `lib/portal-onboarding-reviews.ts`
- `supabase/migrations/20260603090000_add_onboarding_extended_fields.sql`
- `supabase/migrations/20260603100000_add_onboarding_phone_audience_type.sql`
- `docs/agency-onboarding-and-client-portal-research.md`

What is already present on the portal/dashboard:

- `[x]` Client portal is protected behind Supabase Auth.
- `[x]` Client dashboard is no longer one endless scroll. It has section navigation for Overview, Project Plan, Onboarding, Files, Reviews, Billing & Launch, and Activity.
- `[x]` Overview summarizes the current milestone, onboarding state, asset gaps, approvals, billing/launch action, and latest update.
- `[x]` Project Plan groups guided flow and milestones.
- `[x]` Files section uses the secure asset library with private upload/download/review behavior.
- `[x]` Reviews section supports deliverable approval and revision notes.
- `[x]` Billing & Launch section shows invoices, handoff checklist, and support next steps.
- `[x]` Activity section shows client-visible project activity and POPIA-aware portal guidance.
- `[x]` Studio Projects dashboard has queues for onboarding responses, asset reviews, approvals, finance/handoff, operational events, launch readiness, and client activity.
- `[~]` Extended onboarding fields are already in the current working tree: phone, approval role options, audience type, current website, budget range, competitors, decision process, feature needs, tone/style, social presence, previous agency experience, and integrations.

What is still missing or not tight enough:

- `[ ]` No formal onboarding gate blocks or flags `Active delivery` until agreement, SOW, deposit, kickoff, key contacts, assets, access, and timeline constraints are complete.
- `[ ]` No Contract/SOW status exists in the client portal yet.
- `[ ]` No client Request Center exists for small changes, support requests, meeting requests, or scope-change requests.
- `[ ]` No scope classification workflow exists for fix vs included revision vs paid change request vs maintenance request.
- `[ ]` No revision-round counter exists. Current approval flow can record revision requests, but it does not enforce included rounds or consolidated feedback.
- `[ ]` No meeting request flow exists.
- `[ ]` No project-linked message threads exist.
- `[ ]` No decision log exists for approvals, calls, WhatsApp summaries, and scope decisions.
- `[ ]` No weekly client update generator exists.
- `[ ]` No client task list exists for missing client actions, owners, due dates, and blockers.
- `[~]` Dashboard activity automation exists for approvals, uploads, invoices, handoff, and project events, but it does not yet cover requests, messages, meetings, decisions, weekly updates, or readiness gate changes.
- `[!]` The extended onboarding migrations are present in the working tree but still need to be applied and verified in Supabase before those fields are production-ready.

## Portal Operating-System Implementation Tracker

This section extends the completed launch foundation into the stricter agency workflow described in `docs/agency-onboarding-and-client-portal-research.md`.

### Phase 9: Research-Aligned Onboarding Intake

Goal: make onboarding collect enough information for delivery to begin without repeated back-and-forth.

- `[x]` Change service option from `Website redesign` to `New website / redesign`.
- `[~]` Add extended intake fields to the onboarding form, API payload, validation, Studio review types, and Supabase migrations.
- `[ ]` Apply and verify `20260603090000_add_onboarding_extended_fields.sql` in Supabase.
- `[ ]` Apply and verify `20260603100000_add_onboarding_phone_audience_type.sql` in Supabase.
- `[ ]` Surface every extended field in the Studio onboarding review card, not only in storage/types.
- `[ ]` Add a clearer client-facing completion summary after final submission.
- `[ ]` Add missing-content and missing-access owner/due-date fields.
- `[ ]` Add communication preference fields: portal, email, WhatsApp, phone, update cadence, urgent channel, meeting availability.
- `[ ]` Add scope-boundary acknowledgement: included work, excluded work, revision rounds, and paid change request agreement.

Acceptance checks:

- Client can submit a new website or redesign intake with all delivery-critical information.
- Studio can review every submitted answer without opening the database.
- Required fields are enforced only when final submission happens, while drafts remain saveable.
- The form stays usable on mobile and does not become an endless, confusing wall of fields.

### Phase 10: Contract, SOW, And Commercial Readiness Gate

Goal: prevent projects from moving into active delivery before the business side is ready.

- `[ ]` Add project readiness checklist records for agreement signed, SOW approved, deposit paid, billing contact confirmed, kickoff completed, approval owner confirmed, brand/content/assets ready, technical access ready, timeline constraints confirmed, and communication rules confirmed.
- `[ ]` Display readiness checklist inside the client portal Onboarding section.
- `[ ]` Display readiness checklist inside Studio Projects with edit controls for studio admins.
- `[ ]` Connect deposit/payment readiness to the existing invoice records where possible.
- `[ ]` Add Contract/SOW status to the portal dashboard.
- `[ ]` Add a visible `Ready for active delivery` state once required gate items are complete.
- `[ ]` Add blocked-state copy when the project cannot start because client action is missing.

Acceptance checks:

- The portal can clearly answer: "Can this project start yet?"
- Studio can update gate items without editing seed data manually.
- Client sees what they need to do next without seeing internal notes.

### Phase 11: Request Center And Scope Control

Goal: give clients one clean place to ask for changes without creating invisible scope creep.

- `[ ]` Add request data model for `portal_project_requests`.
- `[ ]` Support request types: small change, support request, meeting request, scope change, bug/fix, maintenance request, and question.
- `[ ]` Add client-facing Request Center tab or section.
- `[ ]` Add request form fields: affected page/feature, requested change, reason, urgency, deadline, screenshot/file, and related milestone/deliverable.
- `[ ]` Add studio classification: fix, included revision, change request, maintenance, or out-of-scope.
- `[ ]` Add impact assessment fields: cost, time, launch impact, notes, and Phase 2 parking option.
- `[ ]` Add client approval/decline/park flow before out-of-scope work begins.
- `[ ]` Log request events into portal activity.
- `[ ]` Add Studio request queue.

Acceptance checks:

- WhatsApp or phone requests can be logged into the portal afterward.
- Out-of-scope work cannot be treated as approved until the client accepts cost/time impact.
- Every request has a status, owner, and next action.

### Phase 12: Meetings, Messages, And Decision Log

Goal: keep communication human without losing the official project record.

- `[ ]` Add meeting request data model.
- `[ ]` Add client-facing meeting request form with topic type, reason, preferred slots, attendees, agenda, and related project item.
- `[ ]` Add message/thread data model tied to milestone, deliverable, request, or project.
- `[ ]` Add Messages section or contextual message threads.
- `[ ]` Add decision log records for approvals, phone calls, WhatsApp summaries, scope decisions, and kickoff outcomes.
- `[ ]` Add studio action to summarize an outside-channel decision into the portal.
- `[ ]` Add post-call summary fields: decision, action items, owner, due date.

Acceptance checks:

- Client can request a meeting without bypassing scope/change workflow.
- Important WhatsApp or phone decisions become written portal records.
- The dashboard can answer: "What was decided, by whom, and when?"

### Phase 13: Revision Round Tracking And Approval Tightening

Goal: make revisions fair, trackable, and protected by the agreed scope.

- `[x]` Deliverable approvals and revision notes exist.
- `[ ]` Add revision round count per deliverable or project phase.
- `[ ]` Add included revision limit from the SOW or readiness gate.
- `[ ]` Show remaining revision rounds in the client review workspace.
- `[ ]` Require consolidated feedback for each revision round.
- `[ ]` Convert extra rounds into a change request automatically or through Studio review.
- `[ ]` Add optional deemed-approval logic after an agreed response window.

Acceptance checks:

- Client understands whether a revision is included or billable.
- Studio can defend scope with a clear record instead of memory.
- Approval history remains versioned and readable.

### Phase 14: Dashboard Automation And Weekly Updates

Goal: reduce manual client updates by making project actions create dashboard movement.

- `[x]` Activity logging exists for several portal events.
- `[~]` Notification rules exist for current approval/asset/invoice/handoff events.
- `[ ]` Extend event types for requests, request classification, meeting requests, messages, decision log entries, readiness gate updates, and weekly updates.
- `[ ]` Add `update client` quick action in Studio.
- `[ ]` Add weekly update generator that summarizes completed work, current focus, blockers, client actions, and next milestone.
- `[ ]` Allow studio admin to edit the generated update before publishing.
- `[ ]` Publish weekly updates to portal activity and optionally email the client.
- `[ ]` Add client-facing "latest weekly update" card in Overview.

Acceptance checks:

- Studio updates one operational action and the client dashboard moves automatically.
- Weekly updates are reviewable before publishing.
- Client can see progress without needing to ask for a phone call every time.

### Phase 15: Client Task List And Missing Items

Goal: make client responsibilities visible and actionable.

- `[ ]` Add `portal_tasks` data model with owner type, due date, priority, status, related item, and visibility.
- `[ ]` Add client task summary in Overview.
- `[ ]` Add task list in Onboarding or Project Plan.
- `[ ]` Generate tasks from missing assets, missing access, pending approvals, unpaid invoices, meeting follow-ups, and change request decisions.
- `[ ]` Add Studio controls to create, edit, complete, and hide client tasks.

Acceptance checks:

- Client can see exactly what they owe the project.
- Studio can separate client blockers from internal blockers.
- Tasks appear in activity when completed or overdue.

### Phase 16: Compliance, Security, And Launch Verification

Goal: keep the portal safe enough for real client work.

- `[x]` POPIA-aware portal copy exists.
- `[x]` Protected routes, role checks, and RLS policies exist for the current portal tables.
- `[ ]` Document retention expectations for portal records, files, messages, decisions, and requests.
- `[ ]` Add audit coverage for request classification, readiness gate changes, decision log entries, and message publishing.
- `[ ]` Confirm no sensitive credentials are stored in ordinary portal notes/messages.
- `[ ]` Run focused lint after each implementation phase.
- `[ ]` Run production build after each major implementation phase.
- `[ ]` Run route checks for `/portal`, `/portal/onboarding`, `/studio`, `/studio/projects`, and new API routes.
- `[ ]` Run Supabase database lint/advisors once the database is available.

Acceptance checks:

- Role-scoped clients cannot see other client records.
- Studio-only notes and internal decisions do not leak into client views.
- New tables have RLS, indexes, grants, and server-only service-role usage.

## Recommended Execution Order

1. `[~]` Finish Phase 9 extended onboarding intake currently in the working tree.
2. `[ ]` Add Phase 10 readiness gate and Contract/SOW status.
3. `[ ]` Add Phase 11 Request Center and scope classification.
4. `[ ]` Add Phase 12 meeting requests, message threads, and decision log.
5. `[ ]` Add Phase 13 revision-round tracking.
6. `[ ]` Add Phase 14 weekly update generator and expanded automation events.
7. `[ ]` Add Phase 15 client task list.
8. `[ ]` Run Phase 16 verification and Supabase checks.

## Next Task To Execute

`[~]` Phase 9 - finish the extended onboarding intake.

Detailed next step:

- Review the current uncommitted onboarding changes.
- Make sure the new fields are displayed in the client form and Studio review.
- Apply or prepare the Supabase migrations.
- Verify validation for draft save vs final submit.
- Run focused lint/build checks.

## Current State

- `[x]` Audit complete: `/portal` is a polished static preview, not a production portal.
- `[x]` Verified public route health before auth hardening: `/studio`, `/studio/projects`, `/studio/crm?compose=intake`, `/start`, and `/contact` returned `200`.
- `[x]` Verified auth route gates: unauthenticated `/portal`, `/portal/onboarding`, `/studio`, and `/studio/projects` redirect to secure login/setup before project or dashboard content renders.
- `[x]` Verified build health: `npm run build` passed.
- `[x]` Verified focused lint health: portal, onboarding, studio, and related shared files passed targeted ESLint.
- `[~]` Production-ready status: Phase 8 launch-readiness code is wired; production activation still needs Supabase env vars, migrations applied, and database lint/advisors against a running Supabase database.
- `[x]` Supabase activation check: hosted project is reachable, portal tables/storage are available, seed project data exists, and initial studio/client memberships are active.
- `[x]` Auth email delivery check: Supabase custom SMTP is configured through Brevo, the server-side Magic Link template is updated, and local portal login has been verified.

## Stack Decision

- `[x]` Chosen stack: Supabase Auth, Supabase Postgres, and Supabase Storage.
- `[x]` Next.js integration path: use server-side Supabase clients in route handlers/server components, with browser clients only for authenticated client-side interactions that respect Row Level Security.
- `[x]` Auth approach: email magic links for clients first, with studio/admin access controlled by role membership in project tables.
- `[x]` Auth delivery dependency: Supabase custom SMTP is configured for magic links; keep the verified sender active and avoid SMTP key IP restrictions unless Supabase sending IPs are explicitly allowed.
- `[x]` Data approach: Postgres is the source of truth for clients, projects, membership, milestones, onboarding, approvals, activity, invoices, and asset metadata.
- `[x]` Storage approach: private Supabase Storage buckets for client uploads, exposed through signed URLs or authenticated download routes.
- `[x]` Access approach: Row Level Security on all portal tables and storage objects; access flows through `project_members`.
- `[x]` Server-only rule: service-role access belongs only in server code and must never be exposed to browser components.
- `[x]` Existing lead workflow rule: keep `/api/leads` as the public intake capture for now, then add a studio-side conversion step that creates client/project records from qualified leads.
- `[x]` Rejected for this portal: Firebase is not the primary app runtime despite `firebase-tools` being present as a dev dependency; local JSONL files are not acceptable for authenticated portal data.

Environment variables to add when implementation starts:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET_CLIENT_ASSETS`

Implementation packages added for portal auth/data wiring:

- `@supabase/supabase-js`
- `@supabase/ssr`

## Phase 1: Tighten The Current Preview

Goal: make the existing preview less misleading while the real portal is being built.

- `[x]` Remove public footer exposure for the unfinished client portal.
- `[x]` Remove the client-facing portal header link into the internal studio dashboard.
- `[x]` Fix studio navigation so `/studio/projects`, `/studio/crm`, and other subpages show the correct active section.
- `[x]` Clean up portal demo dates so the active project timeline is internally consistent.
- `[x]` Keep `/portal` noindexed while it remains a preview.
- `[x]` Add clearer internal-only language if the preview remains accessible before auth is ready.

Acceptance checks:

- Footer should not invite public visitors into an unfinished portal.
- Portal preview should not route clients into the internal studio dashboard.
- Studio subpages should show their actual section name in the top bar.
- Portal timeline should not claim progress before the project start date.
- Build and focused lint should pass.

## Phase 2: Define Portal Data Model

Goal: replace hardcoded preview data with real project and client records.

- `[~]` Define `clients`, `projects`, `project_members`, `milestones`, `asset_buckets`, `project_assets`, `approvals`, `portal_activity`, and `invoices` records.
- `[x]` Create first server-backed portal project seed: `abc-engineering-website-redesign`.
- `[x]` Add server-side portal project loader with demo fallback until Supabase env vars are configured.
- `[x]` Add project-aware loading for portal steps, milestones, asset buckets, and activity with demo fallback.
- `[ ]` Decide which data belongs in the client-facing portal versus internal studio dashboard.
- `[ ]` Add status values for project phase, asset state, approval state, invoice state, and onboarding state.
- `[ ]` Add audit fields for created by, updated by, timestamps, and activity provenance.
- `[ ]` Document POPIA-sensitive fields and retention expectations.

Acceptance checks:

- Every portal card maps to a real data source.
- Client-facing data is separate from internal notes and operational commentary.
- The data model supports multiple clients and multiple projects per client.

## Phase 3: Authentication And Access Control

Goal: make the portal private and client-specific.

- `[x]` Choose auth approach for this app.
- `[x]` Protect `/portal`, `/portal/onboarding`, and future `/portal/*` routes behind Supabase Auth.
- `[x]` Protect `/studio` and future `/studio/*` routes behind Supabase Auth plus studio-admin membership.
- `[x]` Add role checks for studio admin, client owner, client collaborator, and read-only viewer.
- `[x]` Ensure a user can only see projects they are assigned to.
- `[x]` Add safe empty, unauthorized, and expired-invite states.
- `[x]` Add membership expiry/revocation fields and Row Level Security policies for portal project tables and onboarding responses.
- `[x]` Store authenticated submitter identity with onboarding responses for auditability.

Acceptance checks:

- `[x]` Unauthenticated visitors cannot view project data.
- `[x]` A client cannot access another client's project.
- `[x]` Studio users can access the internal dashboard only with `studio_admin` membership.

Latest verification:

- `[x]` `curl.exe --max-redirs 0 http://localhost:3000/portal` returned `307` to `/portal/login?next=%2Fportal&reason=setup` while Supabase env vars are missing.
- `[x]` `curl.exe --max-redirs 0 http://localhost:3000/portal/onboarding` returned `307` to `/portal/login?next=%2Fportal%2Fonboarding&reason=setup`.
- `[x]` `curl.exe --max-redirs 0 http://localhost:3000/studio` returned `307` to `/portal/login?next=%2Fstudio&reason=setup`.
- `[x]` `curl.exe --max-redirs 0 http://localhost:3000/studio/projects` returned `307` to `/portal/login?next=%2Fstudio%2Fprojects&reason=setup`.
- `[x]` Browser check confirmed the secure setup login renders without `ABC Engineering` project data or studio dashboard copy.
- `[x]` `POST /api/portal/onboarding` returns `503` while Supabase Auth is not configured.

## Phase 4: Onboarding Workflow

Goal: turn onboarding from a status label into a usable client workflow.

- `[x]` Add project onboarding questionnaire with project goals, audience, services, access needs, brand assets, technical accounts, deadlines, and approval contacts.
- `[x]` Save partial onboarding progress server-side through the portal onboarding API when Supabase env vars are configured.
- `[x]` Show required versus optional onboarding tasks.
- `[x]` Add client-side confirmation after draft save and final submission.
- `[x]` Surface completed onboarding in the studio project dashboard with demo fallback until Supabase env vars are configured.

Acceptance checks:

- A new client can complete onboarding without using the generic `/contact` form.
- The studio can see onboarding answers tied to the correct project.
- The client can return later and see what is still missing.

## Phase 5: Secure Asset Uploads

Goal: make the asset library functional and safe.

- `[x]` Add upload support for logo files, brand assets, photos, written content, legal documents, and miscellaneous files.
- `[x]` Enforce file type and size limits.
- `[x]` Store files in a private bucket or equivalent protected storage.
- `[x]` Add a manual review gate before using uploaded assets.
- `[x]` Log upload, delete, and download activity.

Acceptance checks:

- `[x]` Clients can upload files into the correct bucket after authentication and project membership checks.
- `[x]` Uploaded files are stored in a private Supabase Storage bucket with project-member RLS policies.
- `[x]` The studio can review and mark assets as received, accepted, needing replacement, or held for manual review.
- `[x]` Assigned project members can download assets through a protected route that creates a short-lived signed URL.
- `[x]` Studio admins can delete assets through a protected route that removes the private object, metadata, and updates bucket counts.

Latest verification:

- `[x]` `npx.cmd eslint ...` passed for portal, studio, auth, and portal asset files.
- `[x]` `npm run build` passed and registered `/api/portal/assets`.
- `[x]` `curl.exe --max-redirs 0 http://localhost:3000/portal` returned `307` to `/portal/login?next=%2Fportal&reason=setup` while Supabase env vars are missing.
- `[x]` `curl.exe --max-redirs 0 http://localhost:3000/studio/projects` returned `307` to `/portal/login?next=%2Fstudio%2Fprojects&reason=setup`.
- `[x]` `POST /api/portal/assets` with a valid test file returns `503` while Supabase Auth is not configured.
- `[x]` `PATCH /api/portal/assets` returns `503` while Supabase Auth is not configured.
- `[x]` `GET /api/portal/assets/:assetId` returns `503` while Supabase Storage is not configured.
- `[x]` `DELETE /api/portal/assets/:assetId` returns `503` while Supabase Auth is not configured.
- `[x]` Browser check confirmed setup login renders without `Asset Library`, `Download`, `Delete`, `ABC Engineering`, `Asset review queue`, or studio dashboard copy.

## Phase 6: Milestones, Approvals, And Activity

Goal: make project movement visible and trustworthy.

- `[x]` Convert milestones into server-backed records with due dates, owners, details, completion timestamps, and states.
- `[x]` Add timestamped approvals for versioned deliverables.
- `[x]` Add approval notes and revision requests.
- `[x]` Generate portal activity from real approval, milestone, upload, and review events instead of static copy.
- `[x]` Add simple notification rules for client-visible changes.

Acceptance checks:

- `[x]` Clients can approve or request changes on a deliverable.
- `[x]` Approvals include who approved, when, and what version was approved.
- `[x]` Recent activity reflects real project events.

Latest verification:

- `[x]` `npx.cmd eslint ...` passed for portal, studio, auth, asset, approval, and portal workflow files.
- `[x]` `npm run build` passed and registered `/api/portal/approvals`.
- `[x]` `curl.exe --max-redirs 0 http://localhost:3000/portal` returned `307` to `/portal/login?next=%2Fportal&reason=setup` while Supabase env vars are missing.
- `[x]` `curl.exe --max-redirs 0 http://localhost:3000/studio/projects` returned `307` to `/portal/login?next=%2Fstudio%2Fprojects&reason=setup`.
- `[x]` `POST /api/portal/approvals` returns `503` while Supabase project data is not configured.
- `[x]` Browser check confirmed setup login renders without `ABC Engineering`, `Approvals`, `Asset Library`, `Recent Activity`, `Approval queue`, or studio dashboard copy.

## Phase 7: Finance And Handoff

Goal: support the minimum useful commercial workflow without overbuilding.

- `[x]` Show invoice status when safe and relevant.
- `[x]` Link payment references without exposing sensitive accounting data.
- `[x]` Add launch and handoff checklist.
- `[x]` Add final asset delivery, credentials handoff notes, and maintenance/support next steps.
- `[x]` Keep automated invoice reminders out until the core portal workflow is stable.

Acceptance checks:

- `[x]` Clients can see what is paid, due, or waiting without seeing internal finance notes.
- `[x]` Launch handoff has a clear checklist and completion state.
- `[x]` Maintenance or support next steps are visible after launch.

Latest verification:

- `[x]` `npx.cmd eslint ...` passed for portal, studio, auth, asset, approval, finance, handoff, and portal workflow files.
- `[x]` `npm run build` passed with the finance/handoff portal and studio surfaces included.
- `[x]` `curl.exe --max-redirs 0 http://localhost:3000/portal` returned `307` to `/portal/login?next=%2Fportal&reason=setup` while Supabase env vars are missing.
- `[x]` `curl.exe --max-redirs 0 http://localhost:3000/studio/projects` returned `307` to `/portal/login?next=%2Fstudio%2Fprojects&reason=setup`.
- `[x]` `curl.exe --max-redirs 0 http://localhost:3000/studio/finance` returned `307` to `/portal/login?next=%2Fstudio%2Ffinance&reason=setup`.
- `[x]` Browser check confirmed setup login renders without `ABC Engineering`, `Finance`, `Launch Handoff`, `INV-007`, `Payment reference`, `Finance status`, or studio dashboard copy.
- `[!]` `supabase db lint --local --fail-on error` could not run because local Postgres is not running on `127.0.0.1:54322`.

## Phase 8: Polish, Compliance, And Launch Readiness

Goal: make the portal professional, secure, and maintainable.

- `[x]` Add privacy policy and terms links before collecting portal data.
- `[x]` Add POPIA-aware copy around data use, access, retention, and deletion requests.
- `[x]` Test mobile, desktop, keyboard navigation, and reduced-motion behavior.
- `[x]` Add route-level error states and loading states.
- `[x]` Add monitoring for failed uploads, auth failures, and project data errors.
- `[x]` Run production build, focused lint, and route checks before launch.

Phase 8 implementation notes:

- `[x]` Added client-facing POPIA-aware portal copy covering project data use, invite-only access, retention/deletion expectations, privacy/terms links, and credential-hand-off boundaries.
- `[x]` Added `/portal`, `/portal/onboarding`, and `/studio/projects` loading and retry error states.
- `[x]` Added `portal_operational_events` migration with explicit Supabase grants, RLS, and studio-admin visibility for auth, upload, asset, onboarding, approval, and project-data failures.
- `[x]` Added Studio launch-readiness and operations panels so unresolved auth/upload/project-data issues have a visible maintenance path.
- `[x]` Added a clear login rate-limit response and resend cooldown so testers are not told to check email when Supabase has rejected the send.
- `[x]` Verified responsive layout at 390px mobile and desktop widths, visible keyboard tab order, reduced-motion emulation, focused lint, production build, route redirects, and API setup-mode responses.
- `[!]` `supabase db lint --local --fail-on error` still cannot run because local Postgres is not running on `127.0.0.1:54322`.

Acceptance checks:

- `[x]` Portal has protected routes, role-aware server code, RLS migrations, noindex metadata, and no setup-mode protected data leaks.
- `[x]` The setup/login experience is calm and usable on mobile and desktop, with no horizontal overflow at 390px.
- `[x]` The studio has a visible operations/readiness path for failed uploads, auth failures, project data errors, and launch handoff follow-up.

## Immediate Next Improvements

1. `[x]` Finish Phase 1 tightening.
2. `[x]` Decide database/auth stack for the portal.
3. `[x]` Create the first server-backed project record.
4. `[x]` Replace `/portal` with project-aware data loading.
5. `[x]` Add the onboarding questionnaire as the first real client action.
6. `[x]` Surface submitted onboarding responses in the studio project dashboard.
7. `[x]` Protect `/portal` and `/portal/onboarding` behind client authentication.
8. `[x]` Add project-member role checks so clients only see assigned projects.
9. `[x]` Add safe empty, unauthorized, and expired-invite states.
10. `[x]` Add secure asset upload support with private storage, file validation, upload metadata, and studio review actions.
11. `[x]` Add protected asset download/delete routes and log download/delete activity.
12. `[x]` Convert milestones into server-backed records with owners and richer activity generation.
13. `[x]` Add finance status and launch handoff workflow.
14. `[x]` Add monitoring, POPIA-aware launch copy, and route-level error/loading states.
15. `[x]` Configure custom SMTP for Supabase Auth before real client/studio login testing.
16. `[~]` Finish the research-aligned onboarding intake currently in the working tree.
