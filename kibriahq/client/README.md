# Collab Tool Client

Frontend application for Collab Tool, a real-time collaborative document editor. The client is built with Next.js App Router, React, Tailwind CSS, Tiptap, Yjs, and Hocuspocus.

## Overview

The client provides:

- Authentication screens for signup and login.
- Protected dashboard with owned and shared documents.
- Rich text editing with headings, lists, task lists, code blocks, blockquotes, tables, links, colors, highlights, and horizontal rules.
- Real-time document collaboration through Yjs and Hocuspocus.
- Collaboration cursors with user display names and profile colors.
- Document sharing and permission management.
- Profile management.

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **UI:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Editor:** Tiptap 3
- **Realtime collaboration:** Yjs and Hocuspocus
- **State management:** Easy Peasy with localStorage persistence
- **Forms:** React Hook Form
- **HTTP client:** Axios
- **Notifications:** Sonner
- **Icons:** Lucide React
- **Package manager:** pnpm

## Prerequisites

- Node.js 20 or newer
- pnpm
- Running Collab Tool backend API
- Running Hocuspocus/WebSocket collaboration server

The backend is expected to expose REST endpoints under `/api/v1` and a Hocuspocus-compatible WebSocket endpoint.

## Environment Variables

Create a `.env.local` file in this directory:

```bash
cp .env.local.example .env.local
```

Configure these values:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_HOCUSPOCUS_URL=ws://localhost:4000
```

Variable usage:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL for REST API calls such as auth, profile, documents, and permissions. |
| `NEXT_PUBLIC_HOCUSPOCUS_URL` | WebSocket URL used by the Tiptap/Yjs collaboration provider. |

> Note: if `.env.local.example` contains `NEXT_PUBLIC_WS_URL`, keep the value aligned with `NEXT_PUBLIC_HOCUSPOCUS_URL`. The editor code currently reads `NEXT_PUBLIC_HOCUSPOCUS_URL`.

## Installation

Install dependencies from the `client` directory:

```bash
pnpm install
```

## Development

Start the development server:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

The frontend expects the backend API and collaboration server to be available before using authenticated document features.

## Production Build

Create a production build:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

Run linting:

```bash
pnpm lint
```

## Available Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Runs the Next.js development server. |
| `pnpm build` | Builds the production application. |
| `pnpm start` | Starts the built Next.js application. |
| `pnpm lint` | Runs ESLint. |

## Project Structure

```text
client/
+-- api/                 # Axios wrappers for backend REST endpoints
+-- app/                 # Next.js App Router pages, layouts, and error boundaries
|   +-- (auth)/          # Protected routes
|   +-- (guest)/         # Login and signup routes
+-- components/          # Reusable UI, auth, and editor components
+-- hooks/               # Feature hooks for auth, profile, home, editor, and permissions
+-- lib/                 # Shared library code
+-- public/              # Static assets
+-- store/               # Easy Peasy store and auth model
+-- types/               # Shared TypeScript types
+-- utils/               # Token, auth, color, and formatting helpers
+-- next.config.ts       # Next.js configuration
+-- tailwind.config.ts   # Tailwind configuration
+-- package.json         # Dependencies and scripts
```

## Routing

The app uses Next.js route groups:

| Route | Access | Description |
| --- | --- | --- |
| `/login` | Guest | User login form. |
| `/signup` | Guest | User registration form. |
| `/` | Authenticated | Home/dashboard with owned and shared documents. |
| `/docs/[id]` | Authenticated | Collaborative document editor. |
| `/profile` | Authenticated | Profile settings. |

Protected routes are wrapped by `app/(auth)/layout.tsx`, which uses `useCheckAuth` to wait for persisted auth state and redirect unauthenticated or expired-token users to `/login`.

## Authentication Flow

Authentication state is stored in the Easy Peasy auth model and persisted to `localStorage`.

Main pieces:

- `api/auth.ts` sends login and signup requests.
- `hooks/useAuth.ts` handles form submission, server validation errors, token storage, and redirects.
- `store/auth-model.ts` stores `user`, `token`, and computed `isAuth`.
- `utils/token.ts` reads and writes the bearer token used by API calls.
- `hooks/useCheckAuth.ts` validates persisted auth state before rendering protected routes.

Authenticated API requests send:

```http
Authorization: Bearer <token>
```

## Document Flow

Document actions are implemented in `api/doc.ts` and consumed by hooks and pages:

- Create a document.
- Fetch documents owned by the current user.
- Fetch documents shared with the current user.
- Fetch a single document by ID.
- Rename a document.
- Delete a document.

The dashboard uses `hooks/useHome.ts` to load owned and shared documents and create new documents.

## Collaboration Editor

The editor is rendered on `/docs/[id]`.

Key files:

- `app/(auth)/docs/[id]/EditorWrapper.tsx` fetches document metadata and dynamically loads the editor without SSR.
- `components/editor/Editor.tsx` renders the editor shell, document header, toolbar, and editor content.
- `hooks/useEditor.ts` creates the Yjs document, connects to Hocuspocus, configures Tiptap extensions, and enables collaboration cursors.
- `components/editor/Controls.tsx` contains formatting controls.
- `components/editor/Header.tsx` contains title editing, document deletion, avatars, and sharing controls.

The editor uses:

- `Y.Doc` for shared document state.
- `HocuspocusProvider` for WebSocket synchronization.
- Tiptap `Collaboration` for document updates.
- Tiptap `CollaborationCursor` for presence and user cursors.

The collaboration room name is the document ID from `/docs/[id]`.

## Permissions and Sharing

Permission-related API calls live in `api/docPermission.ts`:

- Search users for sharing.
- Add a document permission.
- Remove a permission.
- Fetch all permissions for a document.

Only document authors can update the title, delete the document, or add users from the editor header.

## Styling

Global styles are defined in `app/globals.css`. Editor-specific styles live in `components/editor/Editor.css`.

Tailwind configuration is in `tailwind.config.ts`. Components generally use Tailwind utility classes directly.

## Error Handling

The app includes:

- `app/global-error.tsx` for global runtime errors.
- `app/(auth)/error.tsx` for authenticated route errors.
- `app/not-found.tsx` for missing routes or documents.
- Reusable error UI components under `components/ui/errors/`.

Toast notifications are handled through Sonner and mounted in `app/layout.tsx`.

## Development Notes

- Keep API calls inside `api/` modules and consume them from hooks or components.
- Keep route-level data loading and redirect behavior close to the relevant route wrapper.
- Use existing hooks before adding new stateful logic to components.
- Keep editor behavior in `hooks/useEditor.ts` and editor UI in `components/editor/`.
- Client-only code that reads `localStorage`, uses browser APIs, or depends on the editor provider must stay in client components.

## Troubleshooting

**Editor keeps loading**

- Confirm `NEXT_PUBLIC_HOCUSPOCUS_URL` is set.
- Confirm the Hocuspocus/WebSocket server is running.
- Confirm the document ID exists and the current user has access.

**API requests fail**

- Confirm `NEXT_PUBLIC_API_URL` points to the backend server.
- Confirm the backend is running and exposes `/api/v1`.
- Confirm the user is logged in and the token is not expired.

**Authenticated pages redirect to `/login`**

- The token may be missing, expired, or invalid.
- Clear localStorage and log in again.

**Environment variable changes are ignored**

- Restart `pnpm dev` after editing `.env.local`.
