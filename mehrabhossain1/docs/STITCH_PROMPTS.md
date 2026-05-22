# Google Stitch Prompts — UI/UX Redesign

Copy-paste prompts for [Google Stitch](https://stitch.withgoogle.com) to generate
the redesign screen by screen and component by component. Each maps to a ticket
in [`UI_UX_TICKETS.md`](./UI_UX_TICKETS.md).

## How to use

1. In Stitch, start a **web / desktop** design.
2. **Always paste the _Style preamble_ first**, then the screen/component prompt
   below it — this keeps every screen visually consistent.
3. Generate, then iterate with short follow-ups ("make the hero taller",
   "add a mobile version", "tighten the card spacing").
4. Export the design (or screenshot/Figma) and hand it back — it's the
   *reference* for implementation, adapted to the code's design system.

---

## Style preamble (prepend to every prompt)

```
Style: a modern SaaS web application in a vibrant, polished visual style
inspired by Stripe and Framer. Light theme only. Primary accent is emerald
green (#059669) with a signature diagonal gradient running from emerald
#34D399 through #10B981 to teal #14B8A6. Neutrals are cool slate greys:
near-black text #0F172A, secondary text #475569, hairline borders #E2E8F0,
surfaces in white and #F8FAFC, with soft emerald-tinted #ECFDF5 accent panels.
Typography: a clean geometric sans-serif (Geist / Inter style) — bold headings
with tight letter-spacing, relaxed readable body text. Generous rounded corners
(12–16px), layered soft shadows for gentle depth, airy spacing, crisp 1px
borders. Consistent thin line icons (Lucide style). Mood: premium, friendly,
confident, uncluttered.
```

---

## UX-03 — Landing page

```
Design a desktop landing page for "Website Builder", a drag-and-drop website
builder. Sections top to bottom:
- A sticky translucent nav bar with a blur effect: gradient square logo mark +
  "Website Builder" wordmark on the left; a ghost "Log in" link and an emerald
  gradient "Get started" button on the right.
- A hero: a small pill badge "Drag-and-drop website builder", a large bold
  headline "Build web pages without writing code", a one-paragraph subheading,
  two CTAs (emerald gradient "Get started — it's free" and an outlined "Log in"),
  and a thin trust line. Beside or below it, a product visual: a stylised
  mockup of the builder app (a 3-panel editor with a canvas).
- A feature section with three elevated cards, each with a line icon, a title,
  and a short description: "Drag & drop", "Live preview", "HTML export".
- A simple footer with the wordmark and a short tagline.
Make it fully responsive — also produce a mobile version where the nav collapses
and sections stack.
```

## UX-04 — Login (split layout)

```
Design a desktop login screen for "Website Builder" as a split layout:
- Left panel (~45% width): a full-height emerald-to-teal gradient brand panel
  with the logo mark + wordmark, a short value proposition headline, and subtle
  abstract geometric shapes for depth.
- Right panel: a centered white card titled "Welcome back" with a subtitle
  "Log in to continue building", an Email field and a Password field (each with
  a label and a rounded input), a full-width emerald gradient "Log in" button,
  and a footer line "Don't have an account? Sign up".
Show an inline error state variant (a soft red banner above the fields).
Provide a mobile version where the gradient panel becomes a compact top header.
```

## UX-04 — Register (split layout)

```
Design a desktop sign-up screen for "Website Builder", matching the login
screen's split layout. The right card is titled "Create your account" with
subtitle "Start building websites in minutes" and three fields: Name, Email,
Password (with a hint "at least 8 characters"). Full-width emerald gradient
"Create account" button and a footer line "Already have an account? Log in".
Include a mobile version.
```

## UX-05 — Dashboard

```
Design a desktop dashboard for a logged-in user of "Website Builder":
- A top app bar: gradient logo mark + wordmark on the left; on the right a user
  name with a circular avatar and an outlined "Sign out" button.
- A page header row: "Your projects" title with a subtitle, and on the right a
  text input "Project name" plus an emerald gradient "New project" button.
- A responsive grid (2–3 columns) of project cards. Each card: a small
  gradient/abstract thumbnail header, the project name, an "Updated 3 days ago"
  metadata line, and on hover a subtle lift with a delete (trash) action.
Also generate an empty-state variant: a friendly centered illustration, the
text "No projects yet", a short prompt, and a "New project" CTA.
Include a mobile version with a single-column card list.
```

## UX-06 — Builder shell (full editor screen)

```
Design a desktop web-app screen for a drag-and-drop website builder editor.
Full-height, three-column layout under a top toolbar:
- Top toolbar: gradient logo mark + wordmark on the left; the project name in
  the center looking lightly editable; on the right a save-state indicator
  ("All changes saved" / "Saving…") and two buttons — an outlined "Preview" and
  an emerald gradient "Export".
- Left panel (~240px): "Blocks" — a library of draggable block tiles.
- Center: a canvas area on a soft slate background, showing a web page being
  built inside a subtle device frame.
- Right panel (~320px): "Properties" — grouped form controls for the selected
  element.
Clean dividers between panels, light surfaces, professional and focused. This
is a desktop-only tool — also show a small-screen message "Open on a larger
screen to use the builder".
```

## UX-07 — Palette (component)

```
Design a vertical "Blocks" palette panel for a website builder. A small section
heading "Blocks", then a stack of four draggable block tiles — Text, Image,
Button, Container. Each tile: a thin line icon in an emerald-tinted rounded
square, the block name, a one-line description, and a subtle drag-dots handle on
the right. Show a default state, a hover state (slight lift, emerald border),
and a "currently dragging" ghost state.
```

## UX-08 — Canvas (component)

```
Design the central canvas of a website builder editor. A web page being built,
sitting inside a soft device frame on a slate background. Show: one element
selected with a crisp emerald outline and a small floating action toolbar
(drag handle, delete); a container element highlighted with a dashed emerald
drop zone while something is dragged over it; and a separate empty-canvas state
with a centered dashed placeholder reading "Drag a block here to start".
```

## UX-09 — Properties panel (component)

```
Design a right-hand "Properties" panel for a website builder editor. A header
"Properties", then grouped sections with small uppercase labels: Content,
Typography, Colors, Spacing, Link. Controls include labelled text inputs, a
row of color swatches with a current-color preview, a four-side spacing input
(top/right/bottom/left), and a dropdown select. Compact, scannable, well-spaced.
Also design a "no element selected" empty state with a small icon and the text
"Select an element to edit its properties".
```

## UX-10 — Feedback components (toasts & dialog)

```
Design a set of UI feedback components for a modern SaaS web app, light theme,
emerald accent:
- A success toast (bottom-right): a green check icon, "Project saved", a close
  button, soft shadow, rounded corners.
- An error toast: a red alert icon, "Couldn't save — try again", a close button.
- A centered confirm dialog with a dimmed backdrop: title "Delete project?",
  body "This permanently deletes \"My Portfolio\". This cannot be undone.", and
  two buttons — an outlined "Cancel" and a solid red "Delete".
```

## UX-10 — 404 & error states

```
Design two friendly full-page system states for a modern SaaS web app, light
theme with emerald accent:
- A 404 "Page not found" page: a tasteful illustration or large gradient "404",
  a short message, and an emerald gradient "Back to dashboard" button.
- An error page: an illustration, the text "Something went wrong", a short
  reassuring message, and a "Try again" button.
Both centered, calm, on-brand.
```

---

## Tips

- Generate **desktop first**, then ask Stitch for a **mobile variant** of the
  same screen (marketing, auth, and dashboard need it; the builder is
  desktop-only).
- Keep the **Style preamble identical** every time — that is what makes the
  screens feel like one product.
- For components (UX-07–10), if Stitch insists on a full screen, prompt it to
  "show this component on a plain neutral background, close-up".
- Iterate in small steps; export each approved screen and bring it back so it
  can be implemented against the design system in `UI_UX_REDESIGN_PLAN.md`.
