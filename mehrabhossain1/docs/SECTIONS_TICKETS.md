# Trello Tickets — Section Blocks

Companion to [`SECTIONS_PLAN.md`](./SECTIONS_PLAN.md). Adds ready-made section
presets to the builder. Runs **after EPIC 10 and before TICKET-29 (the PR)**.
Numbered `SEC-NN`.

Each ticket: build → verify (`npm run lint`, drop the section on the canvas and
confirm it renders and stays editable) → user review.

---

## EPIC 11 — Section Blocks

### SEC-01 · Preset infrastructure & palette "Sections" group
- **Labels:** `feature` `builder` · **Estimate:** M
- **Checklist:**
  - [ ] `src/lib/builder/presets.ts` — `SectionPreset` type + `SECTION_PRESETS` registry; each preset's `create()` returns a `ContainerElement` subtree with fresh `crypto.randomUUID()` ids
  - [ ] `Palette.tsx` — add a second **"Sections"** group of draggable preset tiles
  - [ ] `BuilderShell.tsx` — `handleDragStart` / `handleDragEnd` / `DragOverlay` handle the `preset` drag payload (alongside `type`)
  - [ ] Ship one preset (Hero) to prove the path end-to-end
- **Acceptance:** Dragging the Hero tile inserts an editable Hero subtree; primitives still drag as before.

### SEC-02 · Header & Footer sections
- **Labels:** `feature` `builder` · **Estimate:** M
- **Checklist:**
  - [ ] Header/Navbar preset — logo + nav links + CTA, `space-between` row
  - [ ] Footer preset — dark container, link columns + fine print
- **Acceptance:** Both drop in, render on-brand, and remain editable.

### SEC-03 · Features & Stats sections
- **Labels:** `feature` `builder` · **Estimate:** M
- **Checklist:**
  - [ ] Features preset — heading + a wrapping row of three feature cards
  - [ ] Stats preset — a row of big-number + label cards
- **Acceptance:** Both drop in, wrap responsibly, and remain editable.

### SEC-04 · Pricing section
- **Labels:** `feature` `builder` · **Estimate:** M
- **Checklist:**
  - [ ] Pricing preset — heading + three plan cards (name, price, feature lines, button)
- **Acceptance:** Drops in as a clean three-tier pricing block; cards editable.

### SEC-05 · Testimonials & FAQ sections
- **Labels:** `feature` `builder` · **Estimate:** M
- **Checklist:**
  - [ ] Testimonials preset — heading + quote cards (quote + author)
  - [ ] FAQ preset — heading + question/answer pairs
- **Acceptance:** Both drop in, render correctly, and remain editable.

### SEC-06 · CTA banner section
- **Labels:** `feature` `builder` · **Estimate:** S
- **Checklist:**
  - [ ] CTA preset — emerald-filled banner, centered headline + button
- **Acceptance:** Drops in as an on-brand call-to-action banner.

### SEC-07 · Landing-page template, lint & build clean
- **Labels:** `feature` `devops` · **Estimate:** S
- **Checklist:**
  - [ ] "Full landing page" preset — Header → Hero → Features → Stats → Pricing → Testimonials → FAQ → CTA → Footer in one drag
  - [ ] `npm run lint` and `npm run build` pass
- **Acceptance:** One drag builds a complete, editable landing page; checks green.

---

After SEC-07, resume **TICKET-29 · Open the pull request**.
