# Trello Tickets — UI/UX Redesign

Companion to [`UI_UX_REDESIGN_PLAN.md`](./UI_UX_REDESIGN_PLAN.md). These run
**after TICKET-28 and before TICKET-29 (PR)**. Numbered `UX-NN` to avoid
colliding with the main `TICKET-NN` board.

Each ticket: generate the matching Google Stitch design (see
[`STITCH_PROMPTS.md`](./STITCH_PROMPTS.md)) → implement → verify
(`npm run lint` + `npm run build`, desktop + mobile, keyboard) → user review.

---

## EPIC 10 — UI/UX Redesign (Vibrant SaaS · light · emerald)

### UX-01 · Design system foundations
- **Labels:** `ui` `foundation` · **Estimate:** S
- **Checklist:**
  - [ ] Rebuild `src/app/globals.css` tokens — emerald palette, slate neutrals, signature gradient, layered shadows, radii, type scale
  - [ ] Expose tokens via Tailwind v4 `@theme` so utilities (`bg-primary`, `shadow-card`, etc.) are available
  - [ ] Add `prefers-reduced-motion` handling
- **Acceptance:** Tokens resolve in any component; no visual regressions yet.

### UX-02 · Shared UI primitives
- **Labels:** `ui` `foundation` · **Estimate:** M
- **Checklist:**
  - [ ] `src/components/ui/`: `Button` (primary/secondary/ghost/danger + sizes + loading), `Field` (label/input/error), `Card`, `Badge`
  - [ ] Install `lucide-react`; standardize icon usage
  - [ ] Every primitive has hover / active / focus-visible / disabled states
- **Acceptance:** Primitives render in isolation and are reused by all later tickets.

### UX-03 · Landing page redesign
- **Labels:** `ui` · **Estimate:** M
- **Checklist:**
  - [ ] Gradient hero with headline, sub-copy, dual CTA, and a product visual/mockup
  - [ ] Feature section — elevated cards with icons and depth
  - [ ] Polished sticky nav (blur) + footer
  - [ ] Fully responsive
- **Acceptance:** `/` looks like a real SaaS landing page on desktop and mobile.

### UX-04 · Auth pages redesign
- **Labels:** `ui` · **Estimate:** M
- **Checklist:**
  - [ ] Split layout — branded emerald gradient panel + form card
  - [ ] Restyle login & register forms with `Field` primitives, inline errors, loading button
  - [ ] Responsive (panel collapses on mobile)
- **Acceptance:** `/login` and `/register` feel premium and consistent.

### UX-05 · Dashboard redesign
- **Labels:** `ui` · **Estimate:** M
- **Checklist:**
  - [ ] Refined app header (brand mark, user, sign out)
  - [ ] Richer project cards — hover lift, metadata, actions
  - [ ] Inviting empty state with illustration/CTA
  - [ ] Real loading skeletons matching the new card
- **Acceptance:** `/dashboard` looks intentional with 0, 1, and many projects.

### UX-06 · Builder shell & toolbar redesign
- **Labels:** `ui` `builder` · **Estimate:** M
- **Checklist:**
  - [ ] Modern toolbar — brand, editable-looking project name, save state indicator, Preview/Export
  - [ ] Polished 3-pane frame (palette / canvas / properties) with refined dividers and surfaces
  - [ ] Small-screen notice for the desktop-only editor
- **Acceptance:** The builder frame looks like a professional editor; dnd still works.

### UX-07 · Palette redesign
- **Labels:** `ui` `builder` · **Estimate:** S
- **Checklist:**
  - [ ] Draggable block tiles — lucide icon, label, description, grab affordance
  - [ ] Section heading; clear hover and dragging states
- **Acceptance:** The palette reads as a tidy block library; dragging unaffected.

### UX-08 · Canvas redesign
- **Labels:** `ui` `builder` · **Estimate:** M
- **Checklist:**
  - [ ] Canvas surface with device-frame feel; clear drop zones
  - [ ] Obvious selected / hover outlines, element drag handles, container drop highlight
  - [ ] Designed empty-canvas state
- **Acceptance:** Editing affordances are obvious; selection/drag/drop verified.

### UX-09 · Properties panel redesign
- **Labels:** `ui` `builder` · **Estimate:** M
- **Checklist:**
  - [ ] Grouped sections (content / typography / colors / spacing / link)
  - [ ] Refined controls — color swatches, spacing inputs, selects; debounce preserved
  - [ ] Designed no-selection state
- **Acceptance:** The panel is scannable and easy to use; edits still apply live.

### UX-10 · Feedback, dialogs & system states
- **Labels:** `ui` `ux` · **Estimate:** M
- **Checklist:**
  - [ ] `Toast` system — replace `alert()` (save success/failure) with toasts
  - [ ] `Dialog` — replace the delete `confirm()` with a styled confirm modal
  - [ ] Redesign `not-found.tsx` and `error.tsx`
- **Acceptance:** No native `alert`/`confirm`; all feedback is in-app and on-brand.

### UX-11 · Responsive & accessibility polish
- **Labels:** `ui` `a11y` `devops` · **Estimate:** S
- **Checklist:**
  - [ ] Audit every page at mobile / tablet / desktop
  - [ ] WCAG AA contrast, visible focus, labelled controls, keyboard paths
  - [ ] `npm run lint` and `npm run build` clean
- **Acceptance:** The whole app is polished, accessible, and responsive.

---

After UX-11, resume **TICKET-29 · Open the pull request**.
