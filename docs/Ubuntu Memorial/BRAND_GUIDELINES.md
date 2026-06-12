# Ubuntu Memorial Services Brand Guidelines

These guidelines define the visual direction for **Ubuntu Memorial Services**, the demo funeral parlour brand used in this project. **ParlourPay** remains the underlying platform name for registration, monthly contributions, digital receipts, and dashboard workflows.

## Brand Feeling

Ubuntu Memorial Services should feel:

- Dignified
- Compassionate
- Trustworthy
- Community-rooted
- Premium, but not flashy
- Calm and practical for families under stress

The brand should not feel like a generic luxury product, a hospital system, or a cold financial app. The tone is respectful and human first, polished second.

## Core Palette

| Role | Name | Hex | Usage |
|---|---|---:|---|
| Primary | Deep Emerald | `#154230` | Main brand colour, headers, footer, navigation, key panels |
| Accent | Antique Gold | `#A6824A` | Buttons, icons, dividers, active states, subtle highlights |
| Emotional Accent | Deep Burgundy | `#5D1E21` | Important notices, selected highlights, ceremonial details |
| Text / Dark | Charcoal Black | `#101111` | Body text, headings on light backgrounds |
| Main Background | Soft Cream | `#E6E2DA` | Page backgrounds, soft sections, cards |
| Light Background | Warm White | `#F7F4EF` | Form surfaces, dashboard panels, content areas |

## Colour Usage Rules

Use **Soft Cream** and **Warm White** as the dominant surfaces. This keeps the experience calm and approachable.

Use **Deep Emerald** as the main identity colour. It should appear in the header, footer, primary brand blocks, key trust sections, and selected dashboard accents.

Use **Antique Gold** sparingly. It should feel like a refined detail, not a loud yellow. Best uses:

- Primary CTA background on light surfaces
- Icon accents
- Thin dividers
- Active nav indicator
- Small badges
- Receipt/stamp-book highlights

Use **Deep Burgundy** carefully. It adds emotional warmth and ceremony, but too much can feel heavy. Best uses:

- Important callouts
- Memorial/service accents
- Warning or follow-up status, when softened
- Secondary decorative details

Use **Charcoal Black** for serious readability. Avoid pure black backgrounds across large sections unless paired with enough spacing and soft cream text.

## Suggested Proportions

- 45% Soft Cream / Warm White
- 25% Deep Emerald
- 20% Charcoal / dark text
- 7% Antique Gold
- 3% Deep Burgundy

## Accessibility Notes

- Do not place Antique Gold text on Soft Cream for body copy. It is too low contrast.
- Use Charcoal or Deep Emerald for readable text on light backgrounds.
- Use Warm White or Soft Cream text on Deep Emerald and Charcoal backgrounds.
- Use Burgundy mostly as background or accent, not small body text.
- Primary buttons should have strong contrast: Antique Gold background with Charcoal text, or Deep Emerald background with Warm White text.

## Typography Direction

The typography should balance dignity and clarity.

Recommended pairing:

- Display / headings: a refined serif for warmth and ceremony.
- Body / interface: a clean sans-serif for readability and modern product feel.

Suggested font direction:

- Headings: `Cormorant Garamond`, `Playfair Display`, or `Libre Baskerville`
- Body/UI: `Inter`, `Source Sans 3`, or `Lato`

Use serif headings on the public funeral website. Use mostly sans-serif typography inside the dashboard so it feels practical and easy for staff.

## Public Website Style

The public website should feel like a real funeral parlour website, not a SaaS landing page.

Visual direction:

- Soft cream backgrounds
- Deep emerald header/footer
- Antique gold accents
- Gentle photography or realistic service imagery
- Calm section spacing
- Rounded corners only where useful, not overly playful
- Clear WhatsApp/phone CTAs
- Packages shown clearly with monthly contribution pricing

Avoid:

- Overly dark luxury styling on every section
- Generic corporate stock imagery
- Bright gradients
- Tech startup language
- Overusing gold
- Making the site feel like a bank or insurance company

## Dashboard Style

The dashboard should feel quiet, organised, and operational.

Visual direction:

- Warm White app background
- Charcoal text
- Emerald sidebar or top nav
- Gold used only for active states and important metrics
- Burgundy reserved for lapsed, flagged, or follow-up statuses
- Compact tables with clear filters
- Friendly empty states

Status colours:

- Active / Paid: Deep Emerald
- Pending Review: Antique Gold
- Flagged / Follow-up: Deep Burgundy
- Neutral / Inactive: muted charcoal or grey

## Brand Voice

The writing should sound respectful, practical, and reassuring.

Use:

- "We help families prepare with dignity."
- "Pay your monthly contribution without travelling to the office."
- "Your booklet can still be stamped when you visit."
- "Your records are kept safely and clearly."
- "Register online and our team will review your details."

Avoid:

- "Buy now"
- "Disrupt funeral services"
- "Automate grief"
- "Replace your booklet"
- "Instant approval"
- "Verified by Home Affairs" unless a licensed verification provider is actually integrated

## Naming Lock

Public funeral parlour brand:

> Ubuntu Memorial Services

Underlying platform/system:

> ParlourPay

Portfolio framing:

> Ubuntu Memorial Services, powered by ParlourPay

## Logo Direction

The logo direction is locked in `LOGO_DIRECTION.md`.

The recommended route is a dignified wordmark plus simple emblem:

- `Ubuntu Memorial` as the main wordmark
- `Services` as a smaller supporting line
- A simple arched memorial emblem with a subtle leaf or joined-hands shape

Avoid literal coffins, crosses, angels, wings, or overly religious imagery as the default brand mark.

## Implementation Tokens

Use these values as the source of truth when implementing the frontend:

```css
:root {
  --ums-emerald: #154230;
  --ums-burgundy: #5D1E21;
  --ums-charcoal: #101111;
  --ums-gold: #A6824A;
  --ums-cream: #E6E2DA;
  --ums-warm-white: #F7F4EF;
}
```

## Current Decision

The brand is locked to an emerald, antique gold, charcoal, burgundy, and cream palette. This direction is chosen because it feels dignified, local, ceremonial, and warm enough for a South African community funeral parlour while still being strong enough for a polished portfolio piece.
