# Article Submission Design System

A design system for the **Article Management System – Submission Management** module, a university coursework project.

The visual language is inspired by the **Material Dashboard 3 PRO React — "Analytics" preset** (Creative Tim), but executed in a **flat, charcoal-first monochrome style** — white cards, no floating gradient headers, dark charcoal icon tiles, a light collapsible sidenav, and a single pink accent reserved for system highlights only where truly needed.

---

## Sources

- **Visual reference (layout DNA only):** <https://demos.creative-tim.com/material-dashboard-pro-react/#/dashboards/analytics>
- **Visual direction:** user-supplied screenshot — flat white cards, charcoal stat-card icons, light sidenav with collapsible groups.
- **Functional spec:** Article Management System PMT 26 — UC_001-003 (Authentication), UC_004/005/014 (Submission Management), UC_015 (Initial Review), UC_017 (Plagiarism), UC_019 (Desk Review), UC_022 (Peer Review), UC_030 (Decision Making), plus the 8-step workflow.

---

## Product context

The **Article Management System** is a multi-role scientific journal workflow platform. Authors submit articles; Managing Editors, Editorial Board Members, Reviewers and Admins advance them through the 8-step review lifecycle:

1. Submission creation (Author)
2. Initial review (Managing Editor)
3. Plagiarism check
4. Desk review + peer review transfer
5. Double-blind peer review
6. Decision making
7. Author's response
8. Publishing process

Roles: Admin, Chief Managing Editor, Managing Editor, Editorial Board Member, Editor (read-only), Author, Reviewer, Publisher's Office.

This design system focuses on **Submission Management** — the submissions list, single submission detail (Details / Emails / Files / Activity Log tabs), and new submission form. The sidenav exposes the full product map (Dashboard, Submissions, Reviews, Journals, Users, Reports, Settings) with collapsible groups, but only Submission Management pages are fully designed here.

---

## Visual foundations

### Color
**Monochrome charcoal.** Text and icon containers use `#1a1a1a → #2c2c2c`. Page background is a warm off-white `#f4f4f5`. Cards are pure white. No brand accent gradient — everything is flat. Status chips are the only color in the UI: blue (info), green (success), amber (warning), red (error), plus a muted amber "overdue" variant.

### Type
**Roboto** at four sizes: 0.78 / 0.875 / 1 / 1.25 rem. Body is `0.875rem` (14px). Headings are weight 700, color `#1a1a1a`. Secondary text at `#6b6b6b`. Meta/labels at `#8e8e93`. Letter-spacing is neutral — no wide tracking on titles.

### Spacing
8px base grid. Page gutters `24px`. Card internal padding `20–24px`. Sidenav is `256px` wide, anchored to the viewport edge (not a floating pill). Content gets a top navbar `64px` tall.

### Cards
White background, radius `16px`, soft shadow `0 2px 6px rgba(0,0,0,.05)`. **No floating gradient headers.** Section titles live inside the card at the top. Stat cards carry a small charcoal square icon tile (48×48, radius 8) in the top-right corner, with a subtle shadow.

### Sidenav
Full-height white surface, `256px` wide, pinned to the left edge. Top area holds a brand lockup + a user profile chip with a chevron. Below that, grouped nav: group labels in tiny caps (`PAGES`, `DOCS`), items in normal weight with a leading Material Icon and trailing chevron for expandable groups. Active item: light gray background (`#f4f4f5`), charcoal text, no gradient. Hover on inactive items: `rgba(0,0,0,0.04)`.

### Navbar
Sits flush at the top of the content area (not a glass pill). Breadcrumbs on the left in tiny gray text, page title one line below in h5 bold. Right side: a pill-shaped search input with gray border, plus three icon buttons (account, settings, notifications-with-dot).

### Buttons
- **Primary (contained):** flat charcoal `#1a1a1a` background, white text, radius `8px`, weight 600, padding `9px 22px`. Hover: black + subtle shadow.
- **Outlined:** `1.5px` border charcoal, charcoal text, transparent bg.
- **Text:** charcoal or gray, no background.
- **Danger / Success / Info:** reserved for destructive or status actions only — flat solid fills, not gradients.
- **Disabled:** 40% opacity.

### Inputs
White, radius `8px`, `1px` border `#e4e4e7`. Focus: border becomes `#1a1a1a`, no colored ring. Labels sit above the input in 12px gray.

### Tables
Zebra-free. Header row: light gray `#fafafa` background, uppercase labels at 0.7rem `#8e8e93` weight 600. Body rows: 14px text, 1px bottom border `#eeeeee`. First column (Submission ID) is a plain charcoal link with a bottom underline.

### Chips / status badges
Rounded `8px`, weight 600, 0.72rem. Colors match the semantic palette using muted pastel backgrounds + dark text (e.g. `#e8f5e9` bg / `#2e7d32` text for success).

### Elevation
Three steps — `--shadow-sm` for inputs and the navbar, `--shadow-md` for cards at rest, `--shadow-lg` for elevated tiles (stat-card icons). No colored shadows.

### Transitions
`240ms cubic-bezier(0.4, 0, 0.2, 1)` on backgrounds, borders, and shadows. No bounces, no scale-on-hover.

---

## Iconography

**Material Icons** (filled) at 20–24px. Stat-card icon tiles use a charcoal square (`#1a1a1a`, radius 8, shadow-md) with a white glyph. Sidenav glyphs are charcoal at `#6b6b6b`, filling to `#1a1a1a` when active. No emoji, no outline icons, no dual-tone.

---

## Sidenav map (derived from the functional spec)

The full product exposes these top-level nav groups. Only **Submission Management** is designed in detail here.

- **Dashboard** — overview landing
- **SUBMISSION MANAGEMENT** (the scope of this kit)
  - Submissions (UC_004)
  - New Submission (UC_014)
  - Submission Detail (UC_005)
- **Review Workflow** (placeholder — not designed)
  - Initial Review · Plagiarism · Desk Review · Peer Review · Decision Making
- **Journals** (placeholder)
- **Users & Roles** (placeholder)
- **Reports** (placeholder)
- **DOCS**
  - Functional Spec · Change Log

---

## Content fundamentals

- **Voice:** third-person / system-voice.
- **Casing:** Title Case for titles, tab labels, buttons. `UPPER CASE` for sidenav group headers and table column headers.
- **Tone:** neutral-formal, clinical.
- **Emoji:** never.
- **Terminology:** Submission, Author-Correspondent, Co-Author, Initial Review, Desk Review, Double Blind Peer Review, Phase, Status. Submission IDs prefixed `MA`.

---

## Index

| File / folder | Purpose |
| --- | --- |
| `README.md` | You are here |
| `SKILL.md` | Agent-skill manifest |
| `colors_and_type.css` | All tokens as CSS custom properties |
| `preview/` | Standalone HTML cards for the Design System tab |
| `ui_kits/submission-management/` | Full JSX UI kit |
