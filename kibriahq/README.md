# Collab Tool

Collab Tool is a real-time collaborative document editor. It combines a Next.js frontend, an Express/TypeScript backend, PostgreSQL persistence, and Hocuspocus/Yjs WebSocket synchronization so authenticated users can create, share, and co-edit rich text documents.

![Collab Tool](./screenshot.png)

## To The `MiftahCoding` Team
I had selected to build a Next.js project. However, I went beyond the requirements 
and built both frontend and backend. I used Next.js for the frontend, Node.js for 
the backend, and PostgreSQL as the database with Prisma ORM.

> [!NOTE]
>This is not the main repository for this project. 
>The original repository with full git history can be found here:
>https://github.com/kibriahq/realtime-collab-tool

> [!WARNING]
> This project deployed on free hosting services may experience cold starts, leading to `initial load times of 5-10 seconds`. This is expected behavior for free-tier deployments.
> Specifically, the `frontend loads on time`, but the `backend may take time to wake up` and respond to the first request.
> And Sometimes, after `click a button it may take 2 or 3 seconds` to get a response, this is also expected due to the free-tier hosting and should not be considered a bug.


## Live URL
A live version of the app is available at:

[https://collab-z.vercel.app/](https://collab-z.vercel.app/)


## Features

- User signup, login, JWT authentication, and protected routes.
- Personal dashboard with owned and shared documents.
- Rich text editor with headings, lists, task lists, code blocks, blockquotes, tables, links, colors, highlights, and horizontal rules.
- Real-time collaborative editing with Yjs document state.
- Multiplayer cursors using user names and profile colors.
- Document sharing and permission management.
- Profile management, including name, email, color, and password updates.
- PostgreSQL-backed document metadata, permissions, users, and binary Yjs state.

## Architecture

```text
realtime-collab-tool/
+-- client/              # Next.js frontend application
+-- server/              # Express API and Hocuspocus collaboration server
+-- screenshot.png       # Project screenshot used in documentation
+-- README.md            # Main project documentation
```

The frontend and backend are separate applications:

- `client` runs the browser app on `http://localhost:3000`.
- `server` runs both the REST API and WebSocket collaboration endpoint on `http://localhost:4000` by default.

The editor uses the document ID as the Hocuspocus room name. The server stores Yjs binary updates in the `docs.body` column.

### Client Directory

The `client` directory contains the complete browser application. It is a Next.js App Router project responsible for authentication screens, protected app routes, dashboard views, profile management, API consumption, and the collaborative Tiptap editor.

```text
client/
+-- api/                 # Axios wrappers for backend REST endpoints
+-- app/                 # Next.js App Router pages, layouts, and error boundaries
|   +-- (auth)/          # Protected routes such as dashboard, docs, and profile
|   +-- (guest)/         # Public login and signup routes
|   +-- globals.css      # Global styles
|   +-- layout.tsx       # Root layout, providers, fonts, and toaster
|   +-- providers.tsx    # Easy Peasy provider
+-- components/          # Reusable UI, auth, and editor components
|   +-- auth/            # Login/signup form UI
|   +-- editor/          # Tiptap editor shell, toolbar, header, and editor styles
|   +-- ui/              # Shared interface components
+-- hooks/               # Feature hooks for auth, editor, home, profile, and permissions
+-- lib/                 # Shared library code
+-- public/              # Static assets
+-- store/               # Easy Peasy store and persisted auth model
+-- types/               # Shared TypeScript types for docs and users
+-- utils/               # Token, auth, color, and formatting helpers
+-- next.config.ts       # Next.js configuration
+-- tailwind.config.ts   # Tailwind configuration
+-- package.json         # Frontend dependencies and scripts
+-- README.md            # Frontend-specific documentation
```

Important frontend responsibilities:

- `app/(guest)` renders unauthenticated signup and login flows.
- `app/(auth)` guards authenticated routes and redirects unauthenticated users to `/login`.
- `api/` centralizes REST calls for auth, profile, documents, and permissions.
- `store/` persists the logged-in user and JWT token in localStorage.
- `components/editor` and `hooks/useEditor.ts` initialize Tiptap, Yjs, Hocuspocus, collaboration cursors, and editor controls.
- `app/(auth)/docs/[id]` loads document metadata and opens the collaborative editor room for that document ID.

See [client/README.md](./client/README.md) for detailed frontend documentation.

### Server Directory

The `server` directory contains the REST API, Prisma database layer, JWT authentication middleware, route validators, document services, and Hocuspocus collaboration persistence.

```text
server/
+-- prisma/              # Prisma schema and migrations
|   +-- schema.prisma    # User, Doc, and DocPermission models
|   +-- migrations/      # Database migration history
+-- src/
|   +-- app/             # Express app setup
|   +-- controllers/     # Request handlers for auth, docs, permissions, and profile
|   +-- hocuspocus/      # Yjs document load/store hooks
|   +-- lib/             # Prisma client setup
|   +-- middlewares/     # Global middleware, auth guard, and validators
|   +-- routes/          # Root and /api/v1 route definitions
|   +-- services/        # Database and domain logic
|   +-- types/           # Shared backend TypeScript types
|   +-- utils/           # Error, color, and server helpers
|   +-- server.ts        # HTTP server entry point
+-- tests/               # Test workspace
+-- prisma.config.ts     # Prisma CLI configuration
+-- tsconfig.json        # TypeScript configuration
+-- package.json         # Backend dependencies and scripts
+-- README.md            # Backend-specific documentation
```

Important backend responsibilities:

- `src/app/app.ts` creates the Express app, loads environment variables, applies middleware, and mounts routes.
- `src/routes/v1` exposes `/auth`, `/profile`, and `/docs` under `/api/v1`.
- `src/middlewares/auth.ts` verifies JWT bearer tokens and attaches the decoded user to protected requests.
- `src/controllers` handles request/response concerns, while `src/services` contains database and domain operations.
- `prisma/schema.prisma` defines users, documents, permissions, roles, and the Yjs binary document body.
- `src/utils/startServer.ts` starts the HTTP server and upgrades WebSocket requests.
- `src/hocuspocus/index.ts` loads and stores collaborative Yjs document state in PostgreSQL.

See [server/README.md](./server/README.md) for detailed backend documentation.

## Tech Stack

### Frontend

- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Tiptap 3
- Yjs and Hocuspocus provider
- Easy Peasy with localStorage persistence
- React Hook Form
- Axios
- Sonner
- Lucide React

### Backend

- Node.js
- TypeScript
- Express 5
- PostgreSQL
- Prisma 7 with `@prisma/adapter-pg`
- JWT and bcryptjs
- express-validator
- Hocuspocus, Yjs, and crossws
- Morgan

## Prerequisites

- Node.js 20 or newer
- pnpm
- PostgreSQL
- Git

## Quick Start

Clone the repository:

```bash
git clone https://github.com/kibriahq/realtime-collab-tool
cd realtime-collab-tool
```

### 1. Configure the Backend

Install backend dependencies:

```bash
cd server
pnpm install
```

Create the backend environment file:

```bash
cp .env.example .env
```

Set the backend variables:

```env
JWT_SECRET=supersecretkey
PORT=4000
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

Run database migrations:

```bash
pnpm prisma migrate dev
```

Start the backend:

```bash
pnpm dev
```

Backend URLs:

```text
REST API:  http://localhost:4000/api/v1
WebSocket: ws://localhost:4000
```

### 2. Configure the Frontend

Open a second terminal from the repository root:

```bash
cd client
pnpm install
```

Create the frontend environment file:

```bash
cp .env.local.example .env.local
```

Set the frontend variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_HOCUSPOCUS_URL=ws://localhost:4000
```

Start the frontend:

```bash
pnpm dev
```

Open the app:

```text
http://localhost:3000
```

Note: if `client/.env.local.example` contains `NEXT_PUBLIC_WS_URL`, keep that value aligned with `NEXT_PUBLIC_HOCUSPOCUS_URL`. The editor code currently reads `NEXT_PUBLIC_HOCUSPOCUS_URL`.

## Environment Variables

### Server

| Variable | Required | Description |
| --- | --- | --- |
| `JWT_SECRET` | Yes | Secret used to sign and verify JWT tokens. |
| `PORT` | No | Server port. Defaults to `4000`. |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Prisma. |

### Client

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Yes | Base URL for backend REST requests. |
| `NEXT_PUBLIC_HOCUSPOCUS_URL` | Yes | WebSocket URL for Hocuspocus/Yjs collaboration. |

## Development Commands

Run commands from each application directory.

### Backend Commands

```bash
cd server
pnpm dev                 # Start backend in development mode
pnpm build               # Compile TypeScript to dist/
pnpm start               # Run compiled backend
pnpm prisma migrate dev  # Run database migrations
pnpm prisma generate     # Generate Prisma Client
pnpm prisma studio       # Open Prisma Studio
```

### Frontend Commands

```bash
cd client
pnpm dev       # Start Next.js development server
pnpm build     # Build production frontend
pnpm start     # Start production frontend
pnpm lint      # Run ESLint
```

There is no root-level workspace script at the moment, so the frontend and backend are started from separate terminals.

## API Summary

Base URL:

```text
http://localhost:4000/api/v1
```

Public auth routes:

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/auth/register` | Create a user account. |
| `POST` | `/auth/login` | Log in and receive a JWT. |

Protected profile routes:

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/profile/me` | Get the current user profile. |
| `PUT` | `/profile/me` | Update profile fields or password. |
| `DELETE` | `/profile/me` | Delete the current user. |

Protected document routes:

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/docs/my` | List documents owned by the current user. |
| `GET` | `/docs/shared` | List documents shared with the current user. |
| `GET` | `/docs/:id` | Get a document if owned or shared. |
| `POST` | `/docs` | Create a document. |
| `POST` | `/docs/update/name/:id` | Rename a document. Owner only. |
| `DELETE` | `/docs/:id` | Delete a document. Owner only. |

Protected permission routes:

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/docs/permissions/user-search` | Search users for document sharing. |
| `POST` | `/docs/permissions/add` | Add a user permission. |
| `DELETE` | `/docs/permissions/remove` | Remove a permission. |
| `GET` | `/docs/permissions/get-all/:docId` | List document permissions. |

Protected routes require:

```http
Authorization: Bearer <token>
```

## Data Model

The backend uses Prisma with PostgreSQL.

Main models:

| Model | Purpose |
| --- | --- |
| `User` | Stores account, credential, role, avatar, and profile color data. |
| `Doc` | Stores document metadata, owner, timestamps, and binary Yjs state. |
| `DocPermission` | Stores document sharing records by user and document. |

Important enums:

- `UserRole`: `user`, `admin`
- `DocPermRole`: `edit`, `view`, `comment`

Permission creation currently defaults to `edit`.

## Collaboration Flow

1. A user opens `/docs/[id]` in the frontend.
2. The frontend fetches document metadata through the REST API.
3. The editor creates a Yjs document and connects to the backend WebSocket endpoint through Hocuspocus.
4. Hocuspocus loads existing binary Yjs state from `docs.body`.
5. Editor changes sync between connected clients in real time.
6. Hocuspocus stores the updated Yjs state back into PostgreSQL.

## Documentation

Detailed app-specific documentation:

- [Frontend README](./client/README.md)
- [Backend README](./server/README.md)

Use this root README for project setup and overall architecture. Use the app-specific READMEs when working inside one side of the codebase.

## Troubleshooting

**Frontend cannot reach the API**

- Confirm the backend is running on `PORT=4000`.
- Confirm `client/.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:4000`.
- Restart `pnpm dev` after changing frontend environment variables.

**Collaborative editor keeps loading or does not sync**

- Confirm `NEXT_PUBLIC_HOCUSPOCUS_URL=ws://localhost:4000`.
- Confirm the backend WebSocket server is running on the same port as the API.
- Confirm the document exists and the current user has access.

**Backend cannot connect to the database**

- Confirm PostgreSQL is running.
- Confirm `server/.env` has a valid `DATABASE_URL`.
- Run `pnpm prisma migrate dev` from `server/`.

**Protected requests return unauthorized**

- Log in again to get a fresh token.
- Confirm requests include `Authorization: Bearer <token>`.
- Confirm the backend `JWT_SECRET` has not changed since the token was issued.

## Current Limitations

- There is no root-level monorepo script for starting both apps together.
- The backend package currently has no dedicated test script.
- Document permission roles exist in the schema, but new permissions currently default to `edit`.

## Future Plans

- Interactive whiteboarding.
- Collaborative code editing.
- Document suggestions and comments.
