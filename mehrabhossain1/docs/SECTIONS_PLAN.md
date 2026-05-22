# Section Blocks Plan

## 1. Context

The builder ships only four primitive blocks (text, image, button, container).
That is enough to *compose* anything but too low-level to build a real landing
page quickly. This plan adds **section blocks** — Hero, Header, Features, Stats,
Pricing, Testimonials, FAQ, CTA, Footer — so a user can assemble a full landing
page in a few drags.

## 2. Approach — section presets

A section is **not** a new element type. It is a **preset**: a factory that
produces a ready-made subtree of the existing primitives (a `container` with
nested `text` / `image` / `button` / `container` children and well-chosen inline
styles).

Why this works cleanly:
- The page model is already a recursive tree of `BuilderElement`s, and
  `addElement(parentId, element, index)` accepts *any* element — including a
  whole container subtree.
- **Nothing else changes** — `src/types/builder.ts`, the Zod schema
  (`src/lib/builder/schema.ts`), `ElementRenderer`, the Zustand store, the tree
  helpers, and the property editors are all untouched.
- Once dropped, a section is just normal blocks — fully editable, movable, and
  deletable with the existing tools. No fixed/locked layouts.

Trade-off accepted: there is no high-level "Hero" property panel — you edit a
section's inner text/button/image blocks individually. This is the standard
behaviour for group-style sections and keeps the architecture simple.

## 3. Architecture

| File | Change |
| --- | --- |
| `src/lib/builder/presets.ts` *(new)* | `SECTION_PRESETS` registry — each entry: `key`, `label`, `description`, lucide `icon`, and `create(): ContainerElement` (builds the subtree with fresh `crypto.randomUUID()` ids). |
| `src/features/builder/components/Palette.tsx` | Add a second group, **"Sections"**, below "Blocks" — draggable section tiles. |
| `src/features/builder/components/BuilderShell.tsx` | `handleDragStart` / `handleDragEnd` / `DragOverlay` branch on a `preset` drag payload as well as the existing `type` payload. |

Drag payloads: primitives keep `data: { source: "palette", type }`; presets use
`data: { source: "palette", preset }`. `handleDragEnd` calls `createElement` for
the former and the preset's `create()` for the latter — both go through the
existing `addElement` + `resolveDrop`.

Preset subtrees use inline `ElementStyles` (raw CSS strings) — they may use
properties the property panel doesn't expose (`flexWrap`, `textAlign`,
`maxWidth`, `borderRadius`, …) since the renderer applies the full style map.
Colors echo the emerald brand palette so sections look polished on drop.

## 4. The nine sections

Each is a `container` subtree of existing primitives.

| Section | Composition |
| --- | --- |
| **Header / Navbar** | Row container — logo `text` + nav-link `button`s + a CTA `button`; `space-between`. |
| **Hero** | Centered column — eyebrow `text`, large headline `text`, subtitle `text`, a row of two `button`s. |
| **Features** | Column — heading `text` + a wrapping row of three feature `container`s (icon-ish `text` + title `text` + body `text`). |
| **Stats** | Row of three–four `container`s, each a big-number `text` + a label `text`. |
| **Pricing** | Column — heading `text` + a row of three plan `container` cards (name, price, feature `text`s, a `button`). |
| **Testimonials** | Column — heading `text` + a row of quote `container` cards (quote `text` + author `text`). |
| **FAQ** | Column — heading `text` + several Q&A `container`s (question `text` + answer `text`). |
| **CTA banner** | Emerald-filled `container` — headline `text` + a `button`, centered. |
| **Footer** | Dark `container` — a row of link `text` columns + a bottom fine-print `text`. |

A **full landing-page template** preset (Header → Hero → … → Footer in one drag)
is also included.

## 5. Constraints

- **No model/schema/renderer changes** — presets emit standard `BuilderElement`
  trees that already validate against `pageDocumentSchema`.
- `text` always renders as `<p>` — section "headings" are large-styled text, not
  real `<h*>` tags (existing renderer limitation; acceptable for the MVP).
- Every section must drop in, render correctly, and remain fully editable with
  the current select / move / delete / properties tools.
- Per-ticket verification continues (`npm run lint`, then visual check).

## 6. Execution order

See [`SECTIONS_TICKETS.md`](./SECTIONS_TICKETS.md) — EPIC 11, tickets SEC-01 →
SEC-07. Runs **before TICKET-29 (the PR)**: infrastructure first, then sections
in batches, then the template and a clean lint/build.
