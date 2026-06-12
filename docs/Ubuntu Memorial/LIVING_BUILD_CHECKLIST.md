# Ubuntu Memorial Services Living Build Checklist

This document is the working checklist for building **Ubuntu Memorial Services** as a real, portfolio-grade funeral parlour website and operations demo. **ParlourPay** remains the underlying platform/system name for registration, monthly contributions, receipts, and the admin dashboard.

The goal is not a tiny mockup. The goal is a production-shaped, demo-safe platform:

- A real public website that could stand alone for a funeral parlour with no website.
- A working registration flow for new members.
- A working monthly contribution/payment demo flow.
- A working admin dashboard for staff and owners.
- A reusable portfolio case study and sales demo for Kreative Reflow.

## Product North Star

Build it like it is being delivered to a real funeral parlour, but keep high-risk integrations demo-safe until a real client signs off.

The promise:

> Keep the trusted booklet and stamp system, but add online registration, digital receipts, payment visibility, and monthly reports.

## Research: What Funeral Parlour Websites Need

Based on the first scan of South African funeral parlour websites and funeral-home platform providers, the website needs to support both emotional trust and practical action.

Required public-site patterns:

- Clear funeral parlour name, location, and contact details.
- WhatsApp or direct phone CTA visible early.
- Funeral packages or plans with prices and benefits.
- "How to join" or "how to sign up" section.
- Payment convenience messaging.
- About/history section with dignity, compassion, trust, and community language.
- Branches, service areas, or physical address.
- Testimonials or family appreciation notes where appropriate.
- Contact or quote form.
- Mobile-first layout.

Optional but valuable:

- Obituaries or memorial notices.
- Service planning / arrangement request form.
- Gallery showing real service setup style.
- FAQs about waiting periods, documents, payments, and claims.
- Blog/resources for funeral planning.
- Online payments and digital receipts.
- Admin integration with member/payment records.

## Phase 1: Real Public Website

Purpose: create a full website that can be shown to a funeral parlour with no website and still feel complete.

- [x] Define demo brand name: Ubuntu Memorial Services.
- [x] Define brand colours and tone. See `BRAND_GUIDELINES.md`.
- [x] Define logo direction. See `LOGO_DIRECTION.md`.
- [x] Create homepage hero with funeral parlour identity and primary CTAs.
- [x] Add package/plan preview section with pricing.
- [x] Add "How It Works" section for joining and paying.
- [x] Add trust section covering dignity, privacy, secure records, and community care.
- [ ] Add services page covering funeral arrangements, transport, burial support, tombstone/grocery/casket benefits if used in demo packages.
- [ ] Add packages page with detailed plan cards and benefit breakdowns.
- [ ] Add about page with founder/community story.
- [ ] Add contact/branches page with phone, WhatsApp, address, map placeholder, and contact form.
- [ ] Add FAQ page for joining, documents, monthly contributions, receipts, walk-in payments, and support.
- [x] Add Register Online CTA on relevant pages.
- [ ] Add Pay Monthly Contribution CTA on relevant pages.
- [x] Make the whole website mobile-first.
- [ ] Add SEO metadata for local funeral services demo.
- [x] QA desktop and mobile layouts.

## Phase 2: Client Registration Flow

Purpose: let a new member register online in a believable, working flow.

- [ ] Step 1: personal details.
- [ ] Step 2: contact details and physical address.
- [ ] Step 3: package selection.
- [ ] Step 4: document upload demo for ID and proof of address.
- [ ] Step 5: review and submit.
- [ ] Generate member/reference number.
- [ ] Show confirmation screen.
- [ ] Store registration as pending review.
- [ ] Add consent/privacy copy before submission.
- [ ] Add South African ID format/checksum validation only.
- [ ] Do not claim Home Affairs verification.
- [ ] Add clear demo-only file upload handling.

## Phase 3: Monthly Contribution / Payment Flow

Purpose: demonstrate the digital version of the booklet payment process.

- [ ] Member enters reference number.
- [ ] Add second safety check for live-readiness, such as surname, phone, or OTP placeholder.
- [ ] Display package and amount due.
- [ ] Select payment method.
- [ ] Use demo/sandbox payment state, not real money.
- [ ] Generate receipt number.
- [ ] Create digital stamp-book entry.
- [ ] Show payment success screen.
- [ ] Add receipt download/print option.
- [ ] Add email receipt only if email exists; keep email optional.
- [ ] Prepare gateway abstraction for PayFast/Yoco later.

## Phase 4: Business Dashboard

Purpose: show what the funeral parlour owner or staff member gets after the client-facing flow.

- [ ] Dashboard login.
- [ ] Overview cards: active members, paid this month, unpaid this month, pending registrations.
- [ ] Member records table with search and filters.
- [ ] Member profile with package, contact details, documents, and payment history.
- [ ] Pending registrations review screen.
- [ ] Approve, flag, or reject pending registration.
- [ ] Payment log with online/demo and walk-in cash entries.
- [ ] Walk-in cash payment capture with reference, amount, and date.
- [ ] Digital stamp book view per member.
- [ ] CSV export for monthly reconciliation.
- [ ] Basic audit log for sensitive staff actions.
- [ ] Empty states and error states.

## Phase 5: Portfolio And Sales Demo Layer

Purpose: make the build useful for Kreative Reflow pitches and public portfolio work.

- [ ] Create case study outline.
- [ ] Create one-page leave-behind summary.
- [ ] Add demo data reset process.
- [ ] Add brand/package swap notes for personalising a pitch within 20 minutes.
- [ ] Add script for demo walkthrough.
- [ ] Add screenshots for portfolio.
- [ ] Add short portfolio copy explaining the business problem and solution without pretending it was a real client.

## Technical Decisions To Make

- [ ] Choose framework.
- [ ] Choose backend/database.
- [ ] Choose auth approach.
- [ ] Choose storage approach for demo document uploads.
- [ ] Choose payment gateway demo approach.
- [ ] Choose deployment target.
- [ ] Decide whether portfolio version exposes admin demo publicly or behind demo credentials.

Recommended direction for this project:

- Next.js or React app for frontend.
- Supabase for database, auth, and storage because the data is relational.
- Vercel for hosting.
- Demo/sandbox payment adapter first, PayFast/Yoco later.

## Trust And Compliance Requirements

- [ ] Avoid positioning the product as selling insurance or underwriting funeral cover.
- [ ] Prefer "member", "package", "monthly contribution", and "payment record" language.
- [ ] Use "policy" only where needed for industry familiarity.
- [ ] Add POPIA-aligned consent language.
- [ ] Add privacy policy page.
- [ ] Restrict document access to authorised admin users.
- [ ] Add data export capability.
- [ ] Add deletion/retention notes.
- [ ] Avoid exposing sensitive details in SMS/WhatsApp reminder copy.
- [ ] Make live payment settlement go directly to the parlour's own merchant/bank account in future live versions.

## Research Sources Used In This Checklist

- Rekathusa Funeral Parlour: https://rekathusa-kld.co.za/
- Ndabe Dignified Funerals: https://ndabedignified.co.za/
- MWD Funerals: https://www.mwdfunerals.co.za/
- AVBOB: https://www.avbob.co.za/
- CFS funeral home website platform features: https://www.runcfs.com/features
- Project context: `PROJECT_CONTEXT.md`
- Existing scope document: `ParlourPay_Scope_Document_v1.docx`
- Brand guidelines: `BRAND_GUIDELINES.md`
- Logo direction: `LOGO_DIRECTION.md`
