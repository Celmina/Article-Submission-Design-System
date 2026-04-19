---
name: article-submission-design
description: Use this skill to generate well-branded interfaces and assets for the Article Submission Management System (a university coursework project styled after Material Dashboard 3 PRO React by Creative Tim), either for production or throwaway prototypes / mocks / slides. Contains essential design guidelines, colors, type, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this system.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Core files to consult:
- `README.md` — product context, content fundamentals, visual foundations, iconography
- `colors_and_type.css` — all design tokens as CSS custom properties
- `ui_kits/submission-management/` — pixel-faithful recreation of the submissions list, single submission form, and new-submission form. Copy these JSX components as a starting point.
- `preview/` — small card specimens showing individual tokens / components.

Visual rules in one line: flat white cards (radius 16, soft shadow, no gradient headers), charcoal `#1a1a1a` icon tiles on stat cards, light `#fff` sidenav with collapsible groups and `#f4f4f5` active background, Roboto 14 px base, text `#1a1a1a`, muted `#6b6b6b`, page bg `#f4f4f5`. Material Icons only. No emoji. No gradients anywhere.
