# La Prospect — UI Style Guide

## Objective
Define a **consistent, modern, minimal and operational UI system** inspired by:
- ElevenLabs interface (clean, editorial, spacing-first, soft controls)
- POS / product dashboard UI (clear hierarchy, fast scanning, structured lists)

This guide is intended for **Codex implementation + scalable design system**.

---

# 1. Design Principles

## 1.1 Core philosophy
- Functional first
- Minimal but not empty
- Soft UI (no aggressive borders)
- High readability
- Fast scanning for operational use
- Mobile-first for end users
- Desktop efficiency for admin

## 1.2 Visual tone
- Neutral base (grays + whites)
- Subtle accent color (brand-driven)
- Soft shadows instead of borders
- Rounded UI (not overly pill-shaped)
- Calm, professional, slightly editorial feel

---

# 2. Layout System

## 2.1 Admin layout
Structure:
- Top header (fixed)
- Left sidebar (fixed)
- Main content (scrollable)

### Header
- Height: 64px
- Background: white
- Border bottom: very subtle (#f1f1f1)
- Content:
  - Left: "La Prospect"
  - Right: user avatar + dropdown

### Sidebar
- Width: 72px (collapsed) / 240px (expanded optional)
- Background: very light gray (#fafafa)
- Active item:
  - subtle highlight (light accent)
  - vertical indicator line (thin, colored)

### Content area
- Max width: 1200–1400px
- Padding: 24px–32px
- Vertical rhythm: 16–24px spacing blocks

---

## 2.2 User (mobile-first)
Structure:
- No sidebar
- Top minimal header
- Card-based layout

- Padding: 16px
- Sections stacked
- Large tap targets (min 44px height)

---

# 3. Typography

## Font
Use:
- Inter (primary)

## Scale
- H1: 28–32px / semibold
- H2: 22–24px / semibold
- H3: 18–20px / medium
- Body: 14–16px / regular
- Caption: 12–13px / muted

## Style
- Tight line-height for headings
- Generous spacing between sections
- Avoid uppercase except labels

---

# 4. Color System

## Base
- Background: #ffffff
- Secondary background: #fafafa
- Border: #eeeeee
- Text primary: #111111
- Text secondary: #6b7280

## Accent (brand configurable)
- Primary accent: dynamic (from business branding)
- Use sparingly:
  - active states
  - progress bars
  - CTAs

## States
- Success: #16a34a
- Warning: #f59e0b
- Error: #dc2626

---

# 5. Components

## 5.1 Buttons

### Primary
- Background: accent color
- Text: white
- Radius: 10–12px
- Height: 40–44px

### Secondary
- Background: transparent
- Border: 1px solid #e5e7eb
- Text: dark

### Ghost
- No border
- Subtle hover background (#f3f4f6)

---

## 5.2 Inputs
Inspired by ElevenLabs:
- Soft background (#f9fafb)
- No strong borders
- Focus:
  - subtle ring (accent color)

Height: 40px
Radius: 10px

---

## 5.3 Cards

- Background: white
- Radius: 16px
- Shadow: very soft (0 2px 8px rgba(0,0,0,0.04))
- Padding: 16–20px

Used for:
- KPIs
- rewards
- user blocks

---

## 5.4 Tables (Admin critical)
Inspired by POS/product UI:

- Row height: 56–64px
- Divider: subtle (#f1f1f1)
- Hover: light gray
- Clickable rows

Columns:
- left aligned text
- right aligned numeric values

Include:
- search bar (top)
- filter chips
- sortable headers

---

## 5.5 Tabs

Style:
- Underline active (accent color)
- No heavy containers

Example:
- All products | Lunch | Dinner

---

## 5.6 Chips / filters

- Rounded pills
- Light border
- Active = filled or accent outline

---

## 5.7 Progress bar (key component)

- Height: 6–8px
- Background: #e5e7eb
- Fill: accent color
- Rounded ends

Used for:
- points progress
- missions

---

## 5.8 Reward cards

Structure:
- Title
- Points required
- CTA button
- Optional image

Visual:
- clean
- slightly elevated

---

## 5.9 KPI Cards

Structure:
- Label (small, muted)
- Value (large, bold)
- Optional trend indicator

---

# 6. Interaction Design

## Motion
- Subtle only
- 150–250ms transitions
- Use for:
  - hover
  - dropdown
  - modal

## Feedback
- Toast notifications for actions
- Inline validation for forms

---

# 7. Spacing System

Base unit: 4px

Common spacing:
- 8px
- 12px
- 16px
- 24px
- 32px

Use consistent vertical rhythm.

---

# 8. Icons

Use:
- Lucide React

Style:
- 1.5–2px stroke
- Consistent sizing (16 / 20 / 24)

---

# 9. UX Patterns

## Admin
- Always visible search
- Fast actions (edit, delete inline)
- Clear hierarchy
- No deep nesting

## User
- Immediate clarity:
  - points
  - next reward
- Big CTA: "Canjear"
- Minimal cognitive load

---

# 10. Branding System (Multitenant)

Each business can override:
- primary color
- secondary color
- logo
- typography (limited set)

Rules:
- never break readability
- enforce contrast checks
- fallback to system theme if invalid

---

# 11. Accessibility

- Minimum contrast AA
- Buttons ≥ 44px height
- Focus states visible
- Keyboard navigation for admin

---

# 12. Implementation Notes

- Use Tailwind tokens
- Create design tokens layer:
  - colors
  - spacing
  - radius
  - typography

- Build reusable components:
  - Button
  - Input
  - Card
  - Table
  - Modal
  - ProgressBar
  - RewardCard

---

# Final Direction

The UI must feel like:
- ElevenLabs (clean, modern, calm)
+ POS dashboard (structured, fast, operational)

Avoid:
- heavy shadows
- overly colorful UI
- clutter
- inconsistent spacing

Aim for:
- clarity
- speed
- elegance
- scalability

