# UI/UX Redesign Plan

## 1. Context

The app is feature-complete and deployed, but the UI is a functional-but-plain
zinc/black theme. Before opening the final PR, every surface gets a deliberate
redesign so the project reads as senior frontend-engineering work.

**Direction (locked):**
- **Style:** Vibrant modern SaaS — Stripe / Framer energy: gradient accents,
  layered depth, soft tinted surfaces, generous radius, purposeful motion.
- **Theming:** Light only (one polished theme everywhere, builder included).
- **Accent:** Emerald / green.

**Workflow:** for each page/component, generate a design in **Google Stitch**
using the prompts in [`STITCH_PROMPTS.md`](./STITCH_PROMPTS.md), then implement
it in code — ticket by ticket per [`UI_UX_TICKETS.md`](./UI_UX_TICKETS.md) —
adapting Stitch output to the design system below and to React/Tailwind/a11y
best practices. Stitch output is a *reference*, not a drop-in.

## 2. Design system

A single source of truth, implemented as CSS variables + Tailwind v4 `@theme`
tokens in `src/app/globals.css`.

### Color

| Role | Token | Value |
| --- | --- | --- |
| Primary | `--color-primary` | emerald-600 `#059669` |
| Primary hover | `--color-primary-hover` | emerald-500 `#10b981` |
| Primary active | `--color-primary-active` | emerald-700 `#047857` |
| Accent surface | `--color-accent-soft` | emerald-50 `#ecfdf5` |
| Neutral text | `--color-fg` | slate-900 `#0f172a` |
| Secondary text | `--color-fg-muted` | slate-600 `#475569` |
| Faint text | `--color-fg-subtle` | slate-400 `#94a3b8` |
| Surface | `--color-bg` / `--color-surface` | white / slate-50 `#f8fafc` |
| Border | `--color-border` | slate-200 `#e2e8f0` |
| Danger | `--color-danger` | rose-600 `#e11d48` |

- **Signature gradient:** `linear-gradient(135deg, #34d399 0%, #10b981 45%, #14b8a6 100%)`
  (emerald → teal) — used on the landing hero, primary CTAs, and brand mark.
- **Neutral scale:** slate (cooler than the current zinc — pairs better with
  emerald). Replaces all `zinc-*` usage.

### Typography

- Family: **Geist Sans** (already loaded), Geist Mono for code/JSON.
- Scale: display `clamp(2.5rem,5vw,3.75rem)` · h1 `2.25rem` · h2 `1.5rem` ·
  h3 `1.125rem` · body `1rem`/`0.875rem` · caption `0.75rem`.
- Headings: `tracking-tight`, weight 600–700. Body: weight 400–500,
  `leading-relaxed`.

### Shape, elevation, motion

- **Radius:** inputs `0.625rem` · buttons `0.75rem` · cards `1rem` · modals
  `1.25rem`.
- **Elevation (layered, soft):**
  - `--shadow-card`: `0 1px 3px rgba(15,23,42,.06), 0 12px 28px -16px rgba(15,23,42,.18)`
  - `--shadow-pop`: `0 8px 32px -8px rgba(15,23,42,.22)` (overlays, dropdowns)
  - `--shadow-glow`: `0 10px 30px -10px rgba(16,185,129,.55)` (primary CTA)
- **Motion:** 150–200ms `ease-out`. Cards/buttons lift `translateY(-2px)` on
  hover. Always `focus-visible` ring in emerald. Respect
  `prefers-reduced-motion`.
- **Icons:** one consistent set — `lucide-react` (replaces the emoji icons in
  the palette/landing for a professional look).

## 3. UX principles applied throughout

- **Visual hierarchy** — one clear primary action per view; secondary/tertiary
  actions visibly de-emphasized.
- **Consistency** — every button/input/card comes from shared primitives, never
  ad-hoc class strings.
- **Feedback** — every action has a visible result: hover, active, loading,
  success, error. Replace `alert()`/`confirm()` with inline toasts + a styled
  confirm dialog.
- **Affordance** — drag handles, drop zones, and selected states are obvious in
  the builder.
- **Empty & edge states** — first-run, loading (skeletons), error, and 404 are
  all designed, not afterthoughts.
- **Accessibility** — WCAG AA contrast, visible focus, labelled controls,
  keyboard paths, `aria-live` for async feedback.
- **Responsive** — mobile-first for marketing/auth/dashboard; the builder is
  desktop-first with a graceful small-screen notice.

## 4. Page & component inventory

| Surface | Files | Redesign intent |
| --- | --- | --- |
| Design tokens | `src/app/globals.css` | Emerald system, gradients, shadows, type scale |
| UI primitives | `src/components/ui/*` (new) | `Button`, `Input`/`Field`, `Card`, `Badge`, `Toast`, `Dialog` |
| Landing | `src/app/page.tsx` | Gradient hero with product visual, feature cards with depth, polished nav + footer |
| Auth | `src/app/(auth)/login`, `register` (+ forms) | Split layout: branded gradient panel + clean form card |
| Dashboard | `src/app/(dashboard)/layout.tsx`, `dashboard/page.tsx`, `DeleteProjectButton.tsx`, `loading.tsx` | Refined app header, richer project cards, inviting empty state, real skeletons |
| Builder shell | `src/features/builder/components/BuilderShell.tsx` | Modern toolbar (brand, project name, Save state, Preview/Export), 3-pane polish |
| Palette | `src/features/builder/components/Palette.tsx` | Card-like draggable blocks, lucide icons, section heading |
| Canvas | `Canvas.tsx`, `CanvasElement.tsx`, `ContainerBody.tsx` | Clear drop zones, selected/hover outlines, drag handles, empty hint |
| Properties | `property-editors/PropertiesPanel.tsx`, `fields.tsx` | Grouped sections, refined field controls, color swatches |
| Feedback | new `Toast`/`Dialog`, `not-found.tsx`, `error.tsx` | Toasts, styled confirm dialog, branded 404/error |
| Preview | `src/app/preview/[id]/page.tsx` | Untouched chrome (renders user content only) |

**Out of scope:** `src/features/renderer/ElementRenderer.tsx` renders the
end-user's page content — it must not be restyled.

## 5. Execution order

Tokens → primitives → page-level work → builder → feedback → polish. See
[`UI_UX_TICKETS.md`](./UI_UX_TICKETS.md) (UX-01 → UX-11). Each ticket: generate
the Stitch design → implement → verify (`npm run lint` + `npm run build`,
desktop + mobile, keyboard) → user review → next.

## 6. Constraints

- **Don't break behavior** — dnd-kit drag/drop/reorder, the Zustand store,
  server actions, and auth must keep working. This is a visual layer change.
- **Light-only** — no dark theme work.
- **Verify per ticket** — never batch; the existing one-ticket-at-a-time,
  approve-then-execute workflow continues.
- **New dependency** — `lucide-react` (icons). Confirm before installing.
