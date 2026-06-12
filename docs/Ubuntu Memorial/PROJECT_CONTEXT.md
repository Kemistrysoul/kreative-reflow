# Ubuntu Memorial Services Project Context

This project is based on prior research and discussion about funeral service providers in Soweto and greater Johannesburg, Gauteng, South Africa.

The source folder the user pointed to was `C:\Users\delit\Documents\New project`. That checkout is mostly the OpenWork repo, so ignore the OpenWork codebase as product context. The useful material came from prior Codex session history attached to that folder: funeral-provider lead research plus a product strategy discussion.

## Core Opportunity

The demo funeral parlour brand is **Ubuntu Memorial Services**. The underlying digital registration, payment, receipt, and dashboard system can still be referred to as **ParlourPay**.

The brand palette is locked in `BRAND_GUIDELINES.md`: Deep Emerald, Antique Gold, Deep Burgundy, Charcoal Black, Soft Cream, and Warm White.

The project should target local and community-based funeral providers, especially those around Soweto, Kagiso, Randfontein, Lenasia, Eldorado Park, Ennerdale, Roodepoort, Meadowlands, and Johannesburg South.

There are two primary offers:

1. Providers without a strong website:
   Build a simple credibility website with packages, branch details, WhatsApp contact, Google/Facebook links, and an enquiry or registration form.

2. Providers with an existing website, Facebook page, or monthly member base:
   Build a member management and payment portal that digitises the existing booklet/stamp process without replacing it.

The preferred positioning is:

> I help funeral parlours keep their trusted booklet system, but add online registration, digital receipts, payment reminders, and monthly reports so members do not always have to travel to the office.

## Product Direction

The strongest demo is a white-label funeral services member management platform, not only a marketing website.

The product should feel practical, local, and familiar to funeral parlour staff. The central idea is to digitise the stamp book while preserving the old process for clients who still want it.

Key flows:

- Public funeral parlour website
- Funeral package browsing
- Online member registration
- Dependants and beneficiaries capture
- Secure document upload, using demo files only in the demo
- Basic South African ID number format and checksum validation
- Demo monthly payment flow
- Digital receipt and digital stamp book
- Client portal
- Admin dashboard
- Paid and unpaid member reports
- Manual cash or in-office payment capture
- WhatsApp/SMS reminder simulation
- CSV or PDF export for office reporting

## Demo Rules

Build the first version as production-shaped but demo-powered.

Use real UI, real flows, realistic data structures, and polished admin/client screens. Mock the integrations:

- Payment gateway: use a "Demo Payment Successful" flow.
- WhatsApp/SMS: use a reminder queue with pending, sent, and failed statuses.
- ID verification: only claim ID format/checksum validation and document review. Do not claim Home Affairs verification unless a licensed verification provider is actually integrated.
- Funeral provider data: use fake demo brand and fake members. Do not use real funeral parlour names, logos, client IDs, or real documents in the demo.

Selected fake demo brand:

- Ubuntu Memorial Services

## Compliance And Trust Guardrails

Do not position this as selling insurance, underwriting funeral cover, or holding client funds. Position it as software, admin, and payment tooling for funeral businesses.

Payments should settle into the funeral business's own merchant or bank account.

Important risks:

- Funeral cover can cross into regulated insurance activity. Keep FSCA risk in mind.
- Client IDs, beneficiary details, payment history, birth certificates, and proofs of address are sensitive personal information. POPIA compliance should be treated as part of the product.
- WhatsApp or SMS reminders should avoid exposing sensitive funeral or cover details.
- Payment fees will be a sales objection. Start with EFT, Instant EFT, or PayShap-style flows conceptually, then add debit orders or DebiCheck later.

## Outreach Angle

The pitch should avoid "you need tech" language. These businesses already have trusted relationships and member routines.

Better angle:

> You already have loyal members. I will help you collect easier, reduce queues, reduce missed payments, and serve members who live far away.

For cold outreach, a working demo is better than explanation. Show:

1. How a member registers.
2. How a member uploads documents.
3. How a member pays.
4. How the receipt or digital stamp book entry appears.
5. What the office sees in the dashboard.

## Research Lead Notes

The first-pass research identified a broad list of funeral providers across Soweto and greater Johannesburg. Some records have conflicting phone or address details and should be verified by phone before outreach.

High-value lead types:

- Local funeral parlours with Facebook activity but weak/no websites.
- Providers with existing websites but no visible member portal or online payment workflow.
- Community burial societies still relying on booklet/stamp payment tracking.
- Providers with multiple branches or high member volume, where monthly payment reconciliation pain is likely.

See `research/funeral-provider-leads.md` for the extracted first-pass lead list and flags.
