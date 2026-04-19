# Submission Management UI Kit

Pixel-faithful recreation of the Submission Management pages, styled to match Material Dashboard 3 PRO React (Analytics preset).

## Components
- **Sidenav.jsx** — floating 220 px nav with active-state gradient pill
- **Navbar.jsx** — sticky glass top bar with breadcrumbs + search + icons
- **StatCards.jsx** — 4-up KPI cards with signature "floating gradient icon" above white card
- **SubmissionsList.jsx** — UC_004 list with filters, tabs, state pills, gradient-header table
- **SubmissionDetail.jsx** — UC_005 single submission with Details / Emails / Files / Activity tabs + phase stepper
- **NewSubmission.jsx** — UC_014 Step 1 submission creation form (article + author + co-authors + files + consents)

## Interactive demo
Open `index.html`. The starting page is the Submissions list; click any row to jump to the detail view, or use the sidenav to switch to "New Submission". Page selection persists in `localStorage`.
