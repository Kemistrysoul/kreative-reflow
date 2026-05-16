---
version: alpha
name: Kreative Reflow
description: Premium creative technology studio identity for websites, dashboards, SaaS products, SEO systems, and automation builds.
colors:
  dark_void: "#151419"
  gluon_grey: "#1B1B1E"
  slate_grey: "#262626"
  liquid_lava: "#FC6E20"
  snow: "#FBFBFB"
  warm_neutral: "#F0EFED"
  dusty_grey: "#878787"
typography:
  display:
    fontFamily: Playfair Display
    fontSize: 72px
    fontWeight: "700"
    lineHeight: 0.98
    letterSpacing: 0em
  headline:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: "700"
    lineHeight: 1.05
    letterSpacing: 0em
  body:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 1.7
    letterSpacing: 0em
  label:
    fontFamily: Montserrat
    fontSize: 11px
    fontWeight: "700"
    lineHeight: 1.2
    letterSpacing: 0.22em
  data:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: "500"
    lineHeight: 1.4
    letterSpacing: 0em
rounded:
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  full: 9999px
spacing:
  gutter_mobile: 16px
  gutter_tablet: 24px
  gutter_desktop_left: 88px
  gutter_desktop_right: 75px
  card_gap: 20px
  section_y: 112px
components:
  button_primary:
    backgroundColor: "{colors.liquid_lava}"
    textColor: "{colors.dark_void}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: 0 24px
    height: 56px
  panel_dark:
    backgroundColor: "{colors.gluon_grey}"
    textColor: "{colors.snow}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    padding: 32px
    height: auto
  input_dark:
    backgroundColor: "{colors.dark_void}"
    textColor: "{colors.snow}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 16px
    height: 54px
---

# Overview

Kreative Reflow should feel like a serious creative-technology studio: editorial in its storytelling, precise in its systems thinking, and practical enough for business owners who need working websites, dashboards, and automations. The interface should make complexity feel navigable, never chaotic.

# Colors

Use `dark_void` and `gluon_grey` for premium studio surfaces. Use `liquid_lava` as the single strong action color for buttons, focus states, small markers, and active signals. Use `warm_neutral` for breathing space and `snow` for high-contrast content. Avoid importing unrelated reference colors into the product.

# Typography

Use Playfair Display for large editorial statements and page-level headlines only. Use Montserrat for body copy, labels, navigation, forms, and operational text. Use JetBrains Mono for counts, dates, indexes, compact notes, and system-like details.

# Layout

Layouts should respect the existing gutter system so fixed UI does not collide with page content. Build pages from clear zones: intent, decision support, action, and reassurance. Prefer two-column desktop layouts that collapse into a single purposeful mobile flow.

# Elevation & Depth

Depth should come from borders, contrast, layered surfaces, and restrained shadows. Do not rely on decorative blobs, generic gradients, or visual noise to make a section feel designed.

# Shapes

Use rounded corners intentionally. Keep compact controls at `full`, form inputs at `md`, and major panels between `lg` and `xl`. Avoid stacking cards inside cards unless the inner element is a form control or small data row.

# Components

Primary buttons use `liquid_lava` on `dark_void` text with generous height and compact uppercase labels. Dark panels should feel operational and focused. Forms should be readable first, polished second: clear labels, strong focus states, and enough context for the user to know what to write.

# Do's and Don'ts

Do make each page tell the user what to do next. Do keep brand accents warm and restrained. Do verify mobile layouts before shipping. Don't copy inspiration images directly. Don't add animation unless it improves clarity. Don't make the user hunt for the primary action.
