# Trello Tickets — Drag-and-Drop Website Builder

These are execution tickets, organized **feature by feature**. Create one Trello
card per ticket below. Suggested board lists: **Backlog → In Progress → Review → Done**.

**Label legend:** `setup` · `backend` · `auth` · `feature` · `ui` · `docs` · `devops`

**Estimate legend:** S = ≤2 h · M = half-day · L = full day · XL = multi-day

---

## EPIC 0 — Project Setup & Git Hygiene

### TICKET-02 · Restructure project to `src/` directory
- **Labels:** `setup` · **Estimate:** S
- **Description:** Adopt the industry-standard `src/` layout.
- **Checklist:**
  - [ ] Move `mehrabhossain1/app/` → `mehrabhossain1/src/app/`
  - [ ] Update `tsconfig.json` alias `"@/*"` from `["./*"]` to `["./src/*"]`
  - [ ] Run `npm run dev` and confirm the boilerplate page still loads
- **Acceptance:** App runs from `src/app/`; `@/` imports resolve correctly.

### TICKET-03 · Environment files and git ignore
- **Labels:** `setup` `devops` · **Estimate:** S
- **Description:** Document required env vars without committing secrets.
- **Checklist:**
  - [ ] Confirm `.gitignore` ignores `.env*`
  - [ ] Create committed `.env.example` with `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `AUTH_URL`
  - [ ] Create local `.env.local` (gitignored) with real values
- **Acceptance:** `.env.example` is tracked; `.env.local` is NOT tracked.

---

## EPIC 1 — Database (Neon + Prisma) — *ORM bonus*

### TICKET-04 · Provision Neon Postgres database
- **Labels:** `backend` `devops` · **Estimate:** S
- **Description:** Create the cloud database.
- **Checklist:**
  - [ ] Create a Neon project
  - [ ] Copy the pooled connection string → `DATABASE_URL`
  - [ ] Copy the direct (unpooled) string → `DIRECT_URL`
- **Acceptance:** Both connection strings are saved in `.env.local`.

### TICKET-05 · Install and initialize Prisma
- **Labels:** `backend` · **Estimate:** S
- **Checklist:**
  - [ ] `npm i prisma @prisma/client`
  - [ ] `npx prisma init --datasource-provider postgresql`
  - [ ] Add `"postinstall": "prisma generate"` to `package.json`
- **Acceptance:** `prisma/schema.prisma` exists; Prisma CLI runs.

### TICKET-06 · Define schema and run initial migration
- **Labels:** `backend` · **Estimate:** M
- **Description:** Model `User` and `Project`; `Project.tree` stores the page JSON.
- **Checklist:**
  - [ ] `datasource` uses `url` (pooled) + `directUrl` (unpooled)
  - [ ] `User` model: `id, name, email @unique, passwordHash, projects[], createdAt`
  - [ ] `Project` model: `id, name, tree Json, userId, user relation onDelete: Cascade, createdAt, updatedAt @updatedAt, @@index([userId])`
  - [ ] `src/lib/prisma.ts` — Prisma client cached on `globalThis`
  - [ ] `npx prisma migrate dev --name init`
- **Acceptance:** Tables exist in Neon (verify with `npx prisma studio`).

---

## EPIC 2 — Authentication (Email + Password)

### TICKET-07 · Install and configure Auth.js
- **Labels:** `auth` `backend` · **Estimate:** M
- **Checklist:**
  - [ ] `npm i next-auth@beta bcryptjs zod` and `npm i -D @types/bcryptjs`
  - [ ] `src/lib/auth.ts` — `NextAuth` with Credentials provider, `session: { strategy: "jwt" }`
  - [ ] `authorize()` looks up user by email, verifies with `bcrypt.compare`
  - [ ] `src/app/api/auth/[...nextauth]/route.ts` — `export const { GET, POST } = handlers`
  - [ ] Generate `AUTH_SECRET` via `openssl rand -base64 33`
- **Acceptance:** Auth handler responds; config compiles with no type errors.

### TICKET-08 · Registration flow
- **Labels:** `auth` `feature` · **Estimate:** M
- **Checklist:**
  - [ ] `src/app/(auth)/register/page.tsx` — name/email/password form
  - [ ] Server action: Zod-validate input, reject duplicate email
  - [ ] Hash password with bcrypt, create `User`
  - [ ] Redirect to `/login` (or auto sign-in) on success
- **Acceptance:** A new user can register; the password is stored hashed.

### TICKET-09 · Login flow
- **Labels:** `auth` `feature` · **Estimate:** S
- **Checklist:**
  - [ ] `src/app/(auth)/login/page.tsx` — email/password form
  - [ ] Calls `signIn("credentials", …)`; shows an error on bad credentials
  - [ ] Redirects to `/dashboard` on success
- **Acceptance:** Valid credentials log in; invalid ones show an error.

### TICKET-10 · Route protection
- **Labels:** `auth` `backend` · **Estimate:** S
- **Checklist:**
  - [ ] `proxy.ts` at project root protects `/dashboard` and `/builder`
  - [ ] `(dashboard)/layout.tsx` does a definitive `await auth()` check, redirects to `/login`
  - [ ] `/preview` stays public (shareable)
  - [ ] Add a sign-out control
- **Acceptance:** Unauthenticated users are redirected away from protected routes.

---

## EPIC 3 — Builder Core Logic

### TICKET-11 · Page document schema and types
- **Labels:** `feature` · **Estimate:** M
- **Checklist:**
  - [ ] `src/lib/builder/schema.ts` — `PageDocument`, `BuilderElement` union (`text|image|button|container`)
  - [ ] Matching Zod schema for load/save validation
  - [ ] `src/types/builder.ts` — exported TS types
- **Acceptance:** A page document round-trips through `JSON.stringify`/Zod parse.

### TICKET-12 · Tree manipulation helpers
- **Labels:** `feature` · **Estimate:** M
- **Checklist:**
  - [ ] `src/lib/builder/tree.ts` — `addElement`, `moveElement`, `removeElement`, `updateProps`, `updateStyles`, `findElement`
  - [ ] All helpers are pure (no mutation of input)
- **Acceptance:** Helpers handle nested containers correctly.

### TICKET-13 · Element defaults and registry
- **Labels:** `feature` · **Estimate:** S
- **Checklist:**
  - [ ] `src/lib/builder/defaults.ts` — default props/styles per element type
  - [ ] Palette metadata (label, icon) per type
- **Acceptance:** Each element type has sensible defaults.

### TICKET-14 · Recursive element renderer
- **Labels:** `feature` `ui` · **Estimate:** L
- **Checklist:**
  - [ ] `src/features/renderer/ElementRenderer.tsx` — recursive, `mode: 'edit' | 'preview'`
  - [ ] Element registry maps type → render function
  - [ ] Elements use inline styles (no Tailwind runtime dependency)
- **Acceptance:** The same renderer produces identical output for canvas and preview.

---

## EPIC 4 — Builder UI + Drag & Drop

### TICKET-15 · Editor state store (Zustand)
- **Labels:** `feature` · **Estimate:** M
- **Checklist:**
  - [ ] `npm i zustand`
  - [ ] `src/features/builder/store/editorStore.ts` — `doc`, `selectedId`, `isDirty`
  - [ ] Actions delegate to `tree.ts` helpers
- **Acceptance:** Selecting/editing elements updates state predictably.

### TICKET-16 · Builder shell layout
- **Labels:** `ui` `feature` · **Estimate:** M
- **Checklist:**
  - [ ] `BuilderShell` (`'use client'`) — 3-column grid: palette / canvas / properties
  - [ ] Top toolbar with Save / Preview / Export buttons
  - [ ] Responsive, clean styling
- **Acceptance:** The builder layout renders with all three panes and the toolbar.

### TICKET-17 · Drag-to-add from palette
- **Labels:** `feature` `ui` · **Estimate:** L
- **Checklist:**
  - [ ] `npm i @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`
  - [ ] One `<DndContext>`; palette items use `useDraggable`
  - [ ] `onDragEnd` for palette source → `addElement`
  - [ ] `<DragOverlay>` shows a drag ghost
- **Acceptance:** Dragging a palette item onto the canvas adds that element.

### TICKET-18 · Reorder and nest elements
- **Labels:** `feature` `ui` · **Estimate:** L
- **Checklist:**
  - [ ] Canvas elements use `useSortable`; containers are scoped `<SortableContext>` + `useDroppable`
  - [ ] `onDragEnd` for canvas source → `moveElement`
  - [ ] `PointerSensor` with ~6px activation so click-to-select still works
  - [ ] Empty containers accept drops
- **Acceptance:** Elements reorder and nest into containers via drag.

### TICKET-19 · Property editor panel
- **Labels:** `feature` `ui` · **Estimate:** L
- **Checklist:**
  - [ ] Shared field primitives: text, color, spacing, URL
  - [ ] Per-type editors: text (content/color), image (URL/alt), button (label/href/color), container (layout/spacing/background)
  - [ ] Debounce text inputs; writes go through the store
- **Acceptance:** Editing any selected element's properties updates the canvas live.

---

## EPIC 5 — Persistence & Pages

### TICKET-20 · Project CRUD server actions
- **Labels:** `backend` `feature` · **Estimate:** M
- **Checklist:**
  - [ ] `src/features/projects/actions.ts` (`"use server"`) — `createProject`, `updateProject`, `deleteProject`
  - [ ] Every action: `await auth()`, reject if no session, scope by `userId`, Zod-validate, `revalidatePath`
  - [ ] `src/features/projects/queries.ts` — `listProjects()`, `getProject(id)` scoped by `userId`
- **Acceptance:** Users can only read/write their own projects.

### TICKET-21 · Dashboard page
- **Labels:** `ui` `feature` · **Estimate:** M
- **Checklist:**
  - [ ] `(dashboard)/dashboard/page.tsx` — lists the user's projects
  - [ ] Create-project and delete-project controls
  - [ ] Empty state when there are no projects
- **Acceptance:** The dashboard lists, creates, and deletes projects.

### TICKET-22 · Builder route wiring + Save
- **Labels:** `feature` · **Estimate:** M
- **Checklist:**
  - [ ] `builder/[id]/page.tsx` — Server Component: `await params`, fetch project, pass JSON to `BuilderShell`
  - [ ] Toolbar **Save** calls `updateProject` with the current tree
  - [ ] `isDirty` flag reflects unsaved changes
- **Acceptance:** Saving then reloading `/builder/[id]` restores the exact page tree.

---

## EPIC 6 — Preview & HTML Export

### TICKET-23 · Live preview route
- **Labels:** `feature` · **Estimate:** S
- **Checklist:**
  - [ ] `preview/[id]/page.tsx` — Server Component renders `ElementRenderer` in `preview` mode
  - [ ] No editor chrome, no builder JS
- **Acceptance:** `/preview/[id]` shows the saved page cleanly.

### TICKET-24 · HTML export
- **Labels:** `feature` · **Estimate:** M
- **Checklist:**
  - [ ] `src/lib/builder/htmlExport.ts` — pure `serializeToHtml(doc)` → standalone `<!doctype html>` string, content escaped, inline styles
  - [ ] `api/projects/[id]/export/route.ts` — GET returns it with `Content-Disposition: attachment`
  - [ ] Toolbar **Export** triggers the download
- **Acceptance:** Exported `.html` opens standalone in a browser and matches the preview.

---

## EPIC 7 — Polish & Documentation

### TICKET-25 · Visual polish
- **Labels:** `ui` · **Estimate:** M
- **Checklist:**
  - [ ] Style landing, dashboard, login, register pages with Tailwind
  - [ ] Consistent spacing, colors, responsive behavior
  - [ ] Loading and error states
- **Acceptance:** The app looks clean and intentional on desktop and mobile.

### TICKET-26 · Lint and build clean
- **Labels:** `devops` · **Estimate:** S
- **Checklist:**
  - [ ] `npm run lint` passes with no errors
  - [ ] `npm run build` succeeds
- **Acceptance:** CI-equivalent checks are green locally.

### TICKET-27 · Write README
- **Labels:** `docs` · **Estimate:** M
- **Checklist:**
  - [ ] Pitch + live demo link, features, tech stack
  - [ ] Screenshots / demo GIF
  - [ ] Getting started, env vars table, project structure, DB schema, scripts
- **Acceptance:** A new developer can run the project from the README alone.

---

## EPIC 8 — Deployment

### TICKET-28 · Deploy to Vercel
- **Labels:** `devops` · **Estimate:** M
- **Checklist:**
  - [ ] Import the fork into Vercel
  - [ ] Set **Root Directory = `mehrabhossain1`**
  - [ ] Add env vars: `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `AUTH_URL`
  - [ ] Build command: `prisma migrate deploy && next build`
  - [ ] Verify the live URL end-to-end
- **Acceptance:** The live site works: register, build, save, preview, export.

---

## EPIC 9 — Pull Request

### TICKET-29 · Open the pull request
- **Labels:** `devops` `docs` · **Estimate:** S
- **Checklist:**
  - [ ] Commits follow Conventional Commits (`feat:`, `chore:`, `docs:`)
  - [ ] `git push origin main`
  - [ ] Open the PR against the upstream repo (`miftahulislam2023/...`, base `main`)
  - [ ] PR body: summary, tech stack, live link, setup steps, screenshots, routes map
  - [ ] Confirm `.env.local` is not tracked
- **Acceptance:** A clean, well-described PR is open against the upstream repo.

---

## Suggested sprint order

1. **Sprint 1 — Foundation:** EPIC 0, EPIC 1, EPIC 2
2. **Sprint 2 — Builder:** EPIC 3, EPIC 4
3. **Sprint 3 — Data & Output:** EPIC 5, EPIC 6
4. **Sprint 4 — Ship:** EPIC 7, EPIC 8, EPIC 9
