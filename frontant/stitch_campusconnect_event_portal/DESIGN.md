---
name: Academic Kinetic
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#444651'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#757682'
  outline-variant: '#c5c5d3'
  surface-tint: '#4059aa'
  primary: '#00236f'
  on-primary: '#ffffff'
  primary-container: '#1e3a8a'
  on-primary-container: '#90a8ff'
  inverse-primary: '#b6c4ff'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#3e2400'
  on-tertiary: '#ffffff'
  tertiary-container: '#5c3800'
  on-tertiary-container: '#ef9900'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#00164e'
  on-primary-fixed-variant: '#264191'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 3.5rem
    fontWeight: '800'
    lineHeight: 4rem
    letterSpacing: -0.03em
  headline-display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.25rem
    fontWeight: '800'
    lineHeight: 2.75rem
    letterSpacing: -0.025em
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 2.5rem
    fontWeight: '700'
    lineHeight: 3rem
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.75rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.875rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.5rem
    fontWeight: '700'
    lineHeight: 1.875rem
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.625rem
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.5rem
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.025em
  label-badge:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.6875rem
    fontWeight: '700'
    lineHeight: 0.875rem
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

The design system projects an aura of intellectual vitality, collegiate camaraderie, and energetic discovery. Designed for students, faculty, and student organization leaders navigating a bustling university landscape, the experience merges the discipline of academia with the dynamic social pulse of campus life.

The aesthetic philosophy is **Collegiate Modernism**: a high-structure, crisp interface grounded in deep collegiate navy and vibrant academic blue, invigorated by punchy amber accents that signify live happenings, urgency, and student agency. Visuals prioritize high legibility, modular event discovery, and clear temporal hierarchy (what is happening *now*, *today*, and *this semester*). Layouts remain clean, uncluttered, and highly scannable under bright outdoor campus light or dim lecture halls, avoiding gratuitous skeuomorphism in favor of sharp typographic balance and deliberate focal hierarchy.

## Colors

The color architecture is built around academic authority and dynamic event notification:

- **Primary (`#1E3A8A`)**: Deep Collegiate Navy. Serves as the bedrock of navigation bars, primary headers, authoritative branding, and primary structured elements.
- **Secondary (`#2563EB`)**: Academic Royal Blue. Used for core interactive cues, focused states, primary action buttons, event links, and active calendar filters.
- **Tertiary (`#F59E0B`)**: Warm Amber/Gold. A spirited, varsity-inspired accent strictly reserved for urgency badges (e.g., "Happening Now", "Free Food", "RSVP Required", "Last Few Seats"), featured star badges, and dynamic live markers.
- **Neutral (`#0F172A`)**: Midnight Slate. The high-contrast anchor for typography, structural borders, and dark contextual contrast surfaces.

### Semantic & Surface Foundations
- **Canvas Base**: `#F8FAFC` (Slate 50) provides an anti-glare, pristine field that distinguishes content cards from the background.
- **Surface Elevation (Cards & Sheets)**: `#FFFFFF` (Pure White).
- **Surface Muted / Inset**: `#F1F5F9` (Slate 100) for search inputs, secondary chips, and inactive tabs.
- **Border & Rule**: `#E2E8F0` (Slate 200) for structural low-contrast containment; `#CBD5E1` (Slate 300) for active inputs and card hover boundaries.
- **Text Primary**: `#0F172A` (Slate 900) ensuring AA/AAA accessible reading contrast across all light backgrounds.
- **Text Secondary / Metadata**: `#475569` (Slate 600) for dates, locations, timestamps, and organizer handles.
- **Status / Feedback**: Success `#10B981` (Emerald), Warning `#F59E0B` (Amber), Danger `#EF4444` (Rose).

## Typography

The typographic system utilizes **Plus Jakarta Sans** across all hierarchies. Its geometric underpinnings combined with warm, humanist apertures yield clean campus authority at display sizes and superior tracking clarity at micro-label sizes.

- **Headline Hierarchy**: Tightly tracked (`-0.01em` to `-0.03em`) with robust weights (`700` and `800`) to anchor hero discovery banners, organizational profiles, and date milestones.
- **Body Hierarchy**: Standard tracking with balanced line-heights (1.5x) to maintain effortless parsing of event abstracts, speaker bios, and venue directions.
- **Labels & Micro-copy**: Employs bold letterforms (`600` and `700`) with subtle uppercase letter spacing on categorical badges to maintain crisp definition over imagery and colored fills.

## Layout & Spacing

The layout operates on an 8-point rhythmic grid with a 12-column responsive layout for desktop discovery views, reflowing cleanly to a 4-column system on mobile devices.

### Breakpoints & Canvas Bounds
- **Desktop (≥ 1280px)**: 12-column grid, max-container width `1280px`, `margin: 2rem`, `gutter: 1.5rem`. Structured for multi-column discovery: sticky filter rail (3 columns) + event grid (9 columns).
- **Tablet (768px – 1279px)**: 8-column grid, `margin: 1.5rem`, `gutter: 1rem`. Filters collapse into a sticky top-scrolling filter drawer or horizontal chip bar.
- **Mobile (< 768px)**: 4-column grid, `margin: 1rem`, `gutter-sm: 1rem`. Cards span full width (4 columns) with dense vertical rhythm.

### Spacing Application
- Use `space-xs` (4px) and `space-sm` (8px) for internal pill padding, badge spacing, and icon-to-label gaps.
- Use `space-md` (16px) for card body padding, standard input padding, and tight vertical list separations.
- Use `space-lg` (24px) for card grids, modal padding, and intra-section stack distancing.
- Use `space-xl` (32px) and `space-2xl` (48px) for landing page headers, category block separations, and major thematic partitions.

## Elevation & Depth

Visual hierarchy uses crisp boundary delineation paired with delicate, tinted atmospheric depth rather than heavy drop shadows:

- **Level 0 (Flat Ground)**: Neutral canvas `#F8FAFC`. No shadow.
- **Level 1 (Card & Module Resting)**: `#FFFFFF` surface enclosed by a 1px solid `#E2E8F0` border, paired with an ambient shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)`.
- **Level 2 (Hover & Active Selection)**: Transitioned upon hover to `0 8px 24px -4px rgba(30, 58, 138, 0.08), 0 4px 8px -2px rgba(15, 23, 42, 0.04)` with border color shifting to `#CBD5E1`. The subtle navy tint pulls the card forward into active student focus.
- **Level 3 (Flyouts, Popovers & Datepickers)**: `0 12px 32px -4px rgba(15, 23, 42, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.06)`, no outline change.
- **Level 4 (Modals & Registration Drawers)**: Surface floating atop a `rgba(15, 23, 42, 0.6)` backdrop blur (`backdrop-filter: blur(4px)`). Shadow: `0 24px 48px -12px rgba(15, 23, 42, 0.25)`.

## Shapes

The interface balances sharp collegiate discipline with friendly, modern accessibility through `roundedness: 2` (base `0.5rem` / 8px).

- **Cards & Containers**: `rounded-lg` (`1rem` / 16px) creates a balanced, self-contained silhouette for event imagery and card data blocks.
- **Form Fields & Buttons**: `rounded` (`0.5rem` / 8px) gives inputs and interactive triggers crisp, punchy definition.
- **Tags, Badges & Chips**: Strict full pill styling (`rounded-full` / 9999px) to contrast against rectangular layout cards, signaling clickability and categorical identification instantly.
- **Image Thumbnails (inside cards)**: Top corners adopt `rounded-t-lg` (`1rem`), matching the outer container contour, while lower margins remain squared to contact metadata lines directly.

## Components

### Buttons
- **Primary**: Background `#2563EB`, text `#FFFFFF`, font `label-lg`. Hover: `#1E3A8A`. Active: `#1D4ED8`. Height: 44px (touch target compliant). Border: None.
- **Secondary / Collegiate**: Background `#FFFFFF`, text `#1E3A8A`, 1.5px solid border `#CBD5E1`. Hover: `#F1F5F9`, border `#1E3A8A`.
- **Accent / Alert**: Background `#F59E0B`, text `#0F172A`, font `label-lg`. Used for high-priority calls to action (e.g., "Join Waitlist", "Claim Free Ticket").
- **Ghost**: Background transparent, text `#475569`. Hover: `#F1F5F9`, text `#0F172A`.

### Event Badges & Metadata Chips
- **Category Badge**: Pill-shaped (`rounded-full`), padding `0.25rem 0.75rem`, typography `label-badge`. Default: `#EFF6FF` background with `#1D4ED8` text.
- **Dynamic Accent Badge (Happening Now / Free Food)**: `#FEF3C7` background with `#92400E` text and a pulsing 6px `#F59E0B` dot on the left.
- **Filter Chips**: Background `#FFFFFF`, border 1px solid `#E2E8F0`, typography `label-md`. When selected: background `#1E3A8A`, text `#FFFFFF`, border `#1E3A8A`.

### Event Cards
- **Structure**: Vertical flex card with a 16:9 ratio media header, fixed date calendar block (floating top-left: `#FFFFFF` rounded-md box with `#EF4444` month header and `#0F172A` bold day number).
- **Body**: Event title (`headline-md`), location pin with text (`body-sm`, `#475569`), and organizer avatar with name.
- **Footer**: RSVP quick-action button aligned opposite capacity pill ("34 spots left").

### Input Fields & Search
- **Height**: 48px for unified discovery search.
- **Resting**: Background `#FFFFFF`, border 1.5px solid `#E2E8F0`, placeholder `#94A3B8`, text `#0F172A`, typography `body-md`.
- **Focus**: Border 1.5px solid `#2563EB`, box-shadow `0 0 0 3px rgba(37, 99, 235, 0.15)`.
- **Prepend**: Integrated slate-400 campus-search icon or location filter selector.

### Form Controls (Checkboxes & Radios)
- **Checkboxes**: 20x20px, `rounded` (4px), border 1.5px solid `#CBD5E1`. Checked state: background `#2563EB`, border `#2563EB` with bold white checkmark SVG.
- **Radio Buttons**: 20x20px circle, border 1.5px solid `#CBD5E1`. Selected state: `#2563EB` border with a centered 10px `#2563EB` dot.

### Academic Calendar Ribbon / Mini-Calendar Strip
- Horizontal day-picker with weekday initial over date numeral. Current day flagged with an underline dot in `#F59E0B`; active selected day styled in solid `#1E3A8A` background with crisp white typography.