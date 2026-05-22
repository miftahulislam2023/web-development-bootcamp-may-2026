# Project Plan — Drag-and-Drop Website Builder

## 1. Context

This is a bootcamp/internship evaluation project. The repository
`web-development-bootcamp-may-2026` was forked from
`miftahulislam2023/web-development-bootcamp-may-2026`. The task is to build a
**drag-and-drop website builder** using Next.js + Postgres, following
industry-standard structure and best practices, deploy it to Vercel, and submit
a **high-quality pull request** back to the original repo.

The bootcamp README marks the following, all addressed by this plan:
Main Project · ORM (bonus) · Visual Look · Core Functionalities · GitHub ·
Deployment · Documentation.

**Starting state:** A fresh `create-next-app` (Next.js 16.2.6, App Router,
React 19, TypeScript, Tailwind v4, ESLint) lives in `mehrabhossain1/`. The repo
remote `origin` is the fork; there is no `upstream` remote yet.

## 2. Confirmed decisions

| Area | Choice | Why |
|---|---|---|
| Database / ORM | Neon Postgres + **Prisma** | ORM earns bonus marks; Prisma has the best tooling/docs |
| Drag-and-drop | **dnd-kit** | Modern, accessible, the React DnD standard |
| Scope | **Polished MVP** | Palette, canvas, drag-to-add + reorder, property editor, save/load, live preview, HTML export |
| Auth | **Email + password** | Graders register directly; demonstrates hashing/validation skill |
| Folder layout | **`src/`** directory | Industry-standard, separates code from config |

## 3. Tech stack

Next.js 16.2.6 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
Prisma · Neon Postgres · Auth.js v5 (NextAuth) · bcryptjs · Zod · Zustand ·
dnd-kit · Vercel.

## 4. Architecture

- **App root:** `mehrabhossain1/` (the Next.js app; repo `.git` is one level up).
- **Editor state:** a Zustand store holds the page tree, the selected element, and a dirty flag.
- **Data model:** a page is a JSON tree of `BuilderElement`s (`text | image | button | container`), stored in a Postgres `Json` column.
- **One recursive renderer** drives the editor canvas, the live preview, and HTML export — guaranteeing identical output.
- **Next.js 16 notes:** route `params` is a Promise (must be `await`ed); route protection uses `proxy.ts` (the renamed, formerly `middleware.ts`).

### Folder structure (under `mehrabhossain1/`)

```
mehrabhossain1/
├─ docs/
│  ├─ PROJECT_PLAN.md
│  └─ TRELLO_TICKETS.md
├─ prisma/
│  └─ schema.prisma
├─ public/
├─ proxy.ts                              # route protection (NOT middleware.ts)
├─ .env.example                          # committed
├─ .env.local                            # gitignored
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx  page.tsx  globals.css
│  │  ├─ (auth)/login/page.tsx
│  │  ├─ (auth)/register/page.tsx
│  │  ├─ (dashboard)/layout.tsx           # protected; await auth()
│  │  ├─ (dashboard)/dashboard/page.tsx   # lists the user's projects
│  │  ├─ builder/[id]/page.tsx            # the editor
│  │  ├─ preview/[id]/page.tsx            # clean render of a saved tree
│  │  └─ api/
│  │     ├─ auth/[...nextauth]/route.ts
│  │     └─ projects/[id]/export/route.ts # HTML file download
│  ├─ components/ui/                      # shared primitives
│  ├─ features/
│  │  ├─ builder/{components,property-editors,store,hooks}/
│  │  ├─ renderer/ElementRenderer.tsx
│  │  └─ projects/{actions.ts,queries.ts}
│  ├─ lib/
│  │  ├─ prisma.ts        # Prisma client singleton
│  │  ├─ auth.ts          # Auth.js config
│  │  ├─ validations.ts   # Zod schemas
│  │  └─ builder/{schema.ts,tree.ts,defaults.ts,styles.ts,htmlExport.ts}
│  └─ types/builder.ts
```

## 5. Execution phases

### Phase 0 — Git hygiene & restructure
1. Move `mehrabhossain1/app/` → `mehrabhossain1/src/app/`.
2. Edit `tsconfig.json`: change alias `"@/*": ["./*"]` → `"@/*": ["./src/*"]`.
3. Confirm `.gitignore` ignores `.env*`; add a committed `.env.example`.
4. Commit: `chore: restructure to src/ directory`.

### Phase 1 — Database (Neon + Prisma) — *ORM bonus*
- Create a Neon project; copy the pooled and direct connection strings.
- `npm i prisma @prisma/client`, then `npx prisma init --datasource-provider postgresql`.
- `schema.prisma`: `datasource` with `url` (pooled) + `directUrl` (unpooled).
  - **User**: `id, name, email @unique, passwordHash, projects[], createdAt`.
  - **Project**: `id, name, tree Json, userId, user relation onDelete: Cascade, createdAt, updatedAt @updatedAt, @@index([userId])`.
- `src/lib/prisma.ts`: Prisma client cached on `globalThis`.
- Add `"postinstall": "prisma generate"` to `package.json`.
- `npx prisma migrate dev --name init`.

### Phase 2 — Authentication (Auth.js v5, email + password)
- `npm i next-auth@beta bcryptjs zod` and `npm i -D @types/bcryptjs`.
- `src/lib/auth.ts`: `NextAuth` with the Credentials provider; `session: { strategy: "jwt" }`; `authorize()` verifies `bcrypt.compare`.
- `src/app/api/auth/[...nextauth]/route.ts`: `export const { GET, POST } = handlers`.
- Register: `(auth)/register/page.tsx` form → server action that Zod-validates, bcrypt-hashes, creates the `User`.
- Login: `(auth)/login/page.tsx` calling `signIn("credentials", …)`.
- `proxy.ts`: protect `/dashboard` and `/builder`; definitive `await auth()` check inside `(dashboard)/layout.tsx`.

### Phase 3 — Builder core logic (pure, no UI)
- `schema.ts`: `PageDocument { version: 1; root: ContainerElement }`; `BuilderElement` discriminated union; matching Zod schema.
- `tree.ts`: pure helpers — `addElement`, `moveElement`, `removeElement`, `updateProps`, `updateStyles`, `findElement`.
- `defaults.ts`: default props/styles per type + palette metadata.
- `ElementRenderer.tsx`: recursive renderer with `mode: 'edit' | 'preview'` and an element registry. Elements use inline styles (no Tailwind runtime needed for preview/export).

### Phase 4 — Builder UI + dnd-kit
- `editorStore.ts`: Zustand store (`doc`, `selectedId`, `isDirty`) delegating to `tree.ts`.
- `BuilderShell` (`'use client'`): 3-column layout — palette (240) · canvas (1fr) · properties (320) + a top toolbar (Save / Preview / Export).
- dnd-kit: one `<DndContext>`; palette items `useDraggable`, canvas elements `useSortable`, containers are scoped `<SortableContext>` + `useDroppable`. `onDragEnd` branches on drag source: palette → `addElement`, canvas → `moveElement`. `<DragOverlay>` ghost; `PointerSensor` ~6px activation.
- `property-editors/`: per-type panels (text, colors, spacing, image URL, link href) from shared field primitives; debounced text inputs.

### Phase 5 — Persistence & pages
- `features/projects/actions.ts` (`"use server"`): `createProject`, `updateProject` (Save), `deleteProject`. Every action: `await auth()`, reject if no session, scope by `userId`, Zod-validate, `revalidatePath`.
- `features/projects/queries.ts`: `listProjects()`, `getProject(id)` scoped by `userId`.
- `(dashboard)/dashboard/page.tsx`: list/create/delete projects.
- `builder/[id]/page.tsx`: Server Component — `await params`, fetch project, pass JSON into `BuilderShell`.

### Phase 6 — Live preview & HTML export
- `preview/[id]/page.tsx`: Server Component renders `ElementRenderer` in `preview` mode.
- `htmlExport.ts`: pure `serializeToHtml(doc)` → standalone `<!doctype html>` string, escaped, inline styles.
- `api/projects/[id]/export/route.ts`: GET returns it with `Content-Disposition: attachment`.

### Phase 7 — Polish & documentation — *Visual Look + Documentation marks*
- Style landing, dashboard, and auth pages with Tailwind; responsive and clean.
- `npm run lint` clean; `npm run build` passes.
- Write `mehrabhossain1/README.md`: pitch + live demo link, features, tech stack, screenshots/GIF, getting started, env vars table, project structure, DB schema, deployment notes, scripts.

### Phase 8 — Deploy to Vercel — *Deployment marks*
- Vercel → New Project → import the fork.
- **Set Root Directory = `mehrabhossain1`** (the app is in a subfolder).
- Env vars: `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `AUTH_URL` (Vercel domain).
- Build command: `prisma migrate deploy && next build`.
- Verify the live URL end-to-end.

### Phase 9 — Open the pull request — *GitHub marks*
- Commit in small Conventional-Commit chunks (`chore:`, `feat:`, `docs:`).
- `git push origin main`.
- Open the PR against the **upstream** repo:
  ```bash
  gh pr create --repo miftahulislam2023/web-development-bootcamp-may-2026 \
    --base main --head mehrabhossain1:main
  ```
- PR body: summary, tech stack, live Vercel link, setup instructions, screenshots/GIF, routes map, note the app lives in `mehrabhossain1/`.
- Confirm `.env.local` is not tracked before pushing.

## 6. Environment variables

| Name | Description |
|---|---|
| `DATABASE_URL` | Neon pooled connection string (app runtime) |
| `DIRECT_URL` | Neon direct/unpooled connection string (migrations) |
| `AUTH_SECRET` | Random secret — `openssl rand -base64 33` |
| `AUTH_URL` | `http://localhost:3000` locally; the Vercel domain in production |

## 7. Verification checklist

1. `npm run dev` — register a user, log in, land on `/dashboard`.
2. Create a project → opens `/builder/[id]`; drag text/image/button/container onto the canvas; reorder; edit properties.
3. Click **Save**, reload — the tree persists (confirm in `npx prisma studio`).
4. `/preview/[id]` renders cleanly with no editor chrome.
5. **Export** downloads a standalone `.html` file that opens correctly.
6. A second user cannot see the first user's projects.
7. `npm run lint` and `npm run build` pass.
8. Repeat the smoke test on the live Vercel URL.

## 8. Build order

Pure `lib/builder` logic → renderer/registry → Zustand store → static UI shell →
dnd-kit wiring → property editors → server actions/persistence → preview/export →
polish & docs → deploy → PR.
