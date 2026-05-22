# Website Builder

A drag-and-drop website builder that runs entirely in the browser. Drag blocks
onto a canvas, edit their properties in a side panel, save your work, share a
clean live preview, and export a standalone HTML file — no code required.

> **Live demo:** [drag-and-drop-website-builder.vercel.app](https://drag-and-drop-website-builder.vercel.app)

## Screenshots

![Landing page](screenshots/landing-page.png)

| Dashboard | Builder |
| --- | --- |
| ![Project dashboard](screenshots/projects-page.png) | ![Builder editor](screenshots/builders-page.png) |

## Features

- **Drag-and-drop canvas** — build pages visually with `@dnd-kit`; drag from the
  palette to add, drag on the canvas to reorder, nest blocks inside containers,
  and select or delete any block.
- **Element blocks** — text, image, button, and container (recursive).
- **Section blocks** — one-drag, ready-made sections: Header, Hero, Features,
  Stats, Pricing, Testimonials, FAQ, CTA banner, and Footer. Each expands into
  fully-editable element blocks, so a whole landing page is just a few drags.
- **Property editor** — per-element panel for content, colors, spacing, image
  URL, and link href, with debounced inputs.
- **Save & load** — each page is stored as a JSON tree in Postgres and reloaded
  into the editor.
- **Authentication** — email + password sign-up / login with hashed passwords;
  every user only sees their own projects.
- **Live preview** — `/preview/[id]` renders a saved page cleanly with no editor
  chrome, on a shareable URL.
- **HTML export** — download any page as a standalone `.html` file with inline
  styles that opens in any browser.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) · React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database / ORM | Neon Postgres · Prisma 7 (with the `@prisma/adapter-pg` driver adapter) |
| Auth | Auth.js v5 (NextAuth) · bcryptjs |
| Validation | Zod |
| Editor state | Zustand |
| Drag and drop | dnd-kit |
| Icons | lucide-react |
| Hosting | Vercel |

## Getting started

### Prerequisites

- **Node.js 20+**
- A **PostgreSQL** database — a free [Neon](https://neon.tech) project works well
  and provides both a pooled and a direct connection string.

### Setup

```bash
# 1. Clone the repository and enter the app directory
git clone <repository-url>
cd <repository>/mehrabhossain1

# 2. Install dependencies (postinstall runs `prisma generate`)
npm install

# 3. Create your local environment file
cp .env.example .env.local
# then open .env.local and fill in real values (see the table below)

# 4. Apply the database schema
npx prisma migrate deploy

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), register an account, and
start building.

## Environment variables

Copy `.env.example` to `.env.local` and fill in real values. `.env.local` is
gitignored — never commit secrets.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | yes | Pooled Postgres connection string — used by the app at runtime. |
| `DIRECT_URL` | yes | Direct (unpooled) connection string — used by Prisma migrations. |
| `AUTH_SECRET` | yes | Secret for Auth.js session encryption. Generate with `openssl rand -base64 33`. |
| `AUTH_URL` | yes | App base URL — `http://localhost:3000` in development; the deployed domain in production. |

## Project structure

```
mehrabhossain1/
├─ prisma/
│  ├─ schema.prisma            # User + Project models
│  └─ migrations/              # SQL migration history
├─ prisma.config.ts            # Prisma CLI config (loads .env.local, direct URL)
├─ proxy.ts                    # Route protection (Next.js 16's renamed middleware)
├─ public/                     # Static assets
└─ src/
   ├─ app/
   │  ├─ layout.tsx  page.tsx  globals.css   # Root layout + landing page
   │  ├─ not-found.tsx                       # Branded 404
   │  ├─ (auth)/login, register/             # Auth pages + forms
   │  ├─ (dashboard)/dashboard/              # Project list (create / open / delete)
   │  ├─ builder/[id]/                       # The drag-and-drop editor
   │  ├─ preview/[id]/                       # Clean public render of a saved page
   │  └─ api/
   │     ├─ auth/[...nextauth]/              # Auth.js route handler
   │     └─ projects/[id]/export/            # HTML file download
   ├─ components/
   │  ├─ BrandMark.tsx                       # Shared brand wordmark
   │  └─ ui/                                 # Button, Field, Card, Badge, ConfirmDialog, Toast
   ├─ features/
   │  ├─ builder/{components,property-editors,store}/   # Editor UI + Zustand store
   │  ├─ renderer/ElementRenderer.tsx        # Recursive element renderer
   │  └─ projects/{actions.ts,queries.ts}    # Server actions + data queries
   ├─ lib/
   │  ├─ prisma.ts   auth.ts   cn.ts         # Prisma client, Auth.js config, class helper
   │  └─ builder/{schema.ts,tree.ts,defaults.ts,presets.ts,htmlExport.ts}
   └─ types/builder.ts                       # Page document model
```

## Database schema

A page is a recursive JSON tree of elements, stored in a single `Json` column.

```prisma
model User {
  id           String    @id @default(cuid())
  name         String
  email        String    @unique
  passwordHash String
  projects     Project[]
  createdAt    DateTime  @default(now())
}

model Project {
  id        String   @id @default(cuid())
  name      String
  tree      Json                       // the page document
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}
```

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server at `localhost:3000`. |
| `npm run build` | Create an optimized production build. |
| `npm run start` | Serve the production build. |
| `npm run lint` | Run ESLint. |

`postinstall` automatically runs `prisma generate` after `npm install`.

## Deployment

The app is hosted on **Vercel**. To deploy your own instance:

1. Import the repository into Vercel.
2. Set **Root Directory** to `mehrabhossain1` and confirm the **Framework
   Preset** is **Next.js**.
3. Override the **Build Command** with `prisma migrate deploy && next build` so
   migrations run before the build.
4. Add the four environment variables from the table above.
5. Deploy. After the first deploy, set `AUTH_URL` to the assigned
   `*.vercel.app` domain and redeploy so Auth.js uses the correct base URL.
