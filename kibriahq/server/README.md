# Collab Tool Server

Backend API and collaboration server for Collab Tool. This service handles authentication, user profiles, document metadata, document permissions, PostgreSQL persistence, and real-time Yjs document synchronization through Hocuspocus.

## Overview

The server provides:

- REST API under `/api/v1`.
- JWT-based authentication.
- User registration, login, profile update, and account deletion.
- Document creation, listing, lookup, rename, and deletion.
- Document sharing through permission records.
- PostgreSQL persistence through Prisma.
- WebSocket upgrade handling for Hocuspocus/Yjs collaboration.
- Graceful shutdown with Prisma disconnection.

## Tech Stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **API framework:** Express 5
- **Database:** PostgreSQL
- **ORM:** Prisma 7 with `@prisma/adapter-pg`
- **Authentication:** JSON Web Tokens and bcryptjs
- **Validation:** express-validator
- **Realtime collaboration:** Hocuspocus, Yjs, crossws
- **Logging:** Morgan
- **Package manager:** pnpm

## Prerequisites

- Node.js 20 or newer
- pnpm
- PostgreSQL database
- A configured `.env` file

## Environment Variables

Create a `.env` file in the `server` directory:

```bash
cp .env.example .env
```

Required variables:

```env
JWT_SECRET=supersecretkey
PORT=4000
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

| Variable | Purpose |
| --- | --- |
| `JWT_SECRET` | Secret used to sign and verify JWT access tokens. Use a strong private value outside local development. |
| `PORT` | HTTP and WebSocket server port. Defaults to `4000` if omitted. |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma and the PostgreSQL adapter. |

## Installation

Install dependencies from the `server` directory:

```bash
pnpm install
```

`postinstall` runs `prisma generate`, so Prisma Client is generated automatically after install.

## Database Setup

Run migrations against the configured PostgreSQL database:

```bash
pnpm prisma migrate dev
```

Generate Prisma Client manually when needed:

```bash
pnpm prisma generate
```

Inspect or edit data locally with Prisma Studio:

```bash
pnpm prisma studio
```

## Development

Start the development server:

```bash
pnpm dev
```

The API and WebSocket collaboration endpoint run on the same server:

```text
http://localhost:4000
ws://localhost:4000
```

The frontend should point to this server with:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_HOCUSPOCUS_URL=ws://localhost:4000
```

## Production Build

Compile TypeScript:

```bash
pnpm build
```

Start the compiled server:

```bash
pnpm start
```

Compiled output is written to `dist/`.

## Available Scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Runs `src/server.ts` with `tsx` through nodemon and watches `src/`. |
| `pnpm build` | Compiles TypeScript to `dist/`. |
| `pnpm start` | Runs `node dist/server.js`. |
| `pnpm postinstall` | Runs `prisma generate` after dependency installation. |

There is currently no dedicated test script in `package.json`.

## Project Structure

```text
server/
+-- prisma/              # Prisma schema and migrations
+-- src/
|   +-- app/             # Express app setup
|   +-- controllers/     # Request handlers
|   +-- hocuspocus/      # Hocuspocus persistence hooks
|   +-- lib/             # Shared infrastructure, including Prisma client
|   +-- middlewares/     # Express middleware, auth, and validators
|   +-- routes/          # Root and versioned route definitions
|   +-- services/        # Database and domain logic
|   +-- types/           # Shared TypeScript types
|   +-- utils/           # Error, color, and server utilities
|   +-- server.ts        # HTTP server entry point
+-- tests/               # Test workspace
+-- prisma.config.ts     # Prisma CLI configuration
+-- tsconfig.json        # TypeScript configuration
+-- package.json         # Dependencies and scripts
```

## Application Flow

`src/server.ts` creates an HTTP server from the Express app and passes it to `startServer`.

`src/app/app.ts` loads environment variables, creates the Express app, applies global middleware, and registers routes.

`src/utils/startServer.ts` starts the HTTP server and handles WebSocket upgrade requests through `crossws`. WebSocket connections are handed to Hocuspocus.

The server listens for `SIGINT` and `SIGTERM`, closes the HTTP server, disconnects Prisma, and exits.

## Middleware

Global middleware is configured in `src/middlewares/index.ts`:

- `cors()` enables cross-origin requests.
- `express.json()` parses JSON bodies.
- `express.urlencoded({ extended: true })` parses URL-encoded bodies.
- `morgan('dev')` logs HTTP requests in development style.

Protected routes use `src/middlewares/auth.ts`, which expects:

```http
Authorization: Bearer <token>
```

The token is verified with `JWT_SECRET`. The decoded user is attached to `req.user` after confirming the user still exists.

## API Routes

Base URL:

```text
/api/v1
```

### Auth

Public routes:

| Method | Path | Body | Description |
| --- | --- | --- | --- |
| `POST` | `/api/v1/auth/register` | `name`, `email`, `password`, `confirmPassword` | Creates a user. |
| `POST` | `/api/v1/auth/login` | `email`, `password` | Returns a JWT and user profile fields. |

Registration validation:

- `name` is required and must be at least 3 characters.
- `email` is required, must be valid, and must be unique.
- `password` is required and must be at least 8 characters.
- `confirmPassword` must match `password`.

Login validation:

- `email` is required and must belong to an existing user.
- `password` is required and must match the stored bcrypt hash.

Login response shape:

```json
{
  "token": "jwt-token",
  "user": {
    "id": 1,
    "name": "User Name",
    "email": "user@example.com",
    "role": "user",
    "color": "amber"
  }
}
```

Tokens currently expire after 7 days.

### Profile

Protected routes:

| Method | Path | Body | Description |
| --- | --- | --- | --- |
| `GET` | `/api/v1/profile/me` | None | Returns the current user without password. |
| `PUT` | `/api/v1/profile/me` | `name`, `email`, `avatar`, `color`, `currentPassword`, `newPassword`, `confirmNewPassword` | Updates profile fields and optionally password. |
| `DELETE` | `/api/v1/profile/me` | None | Deletes the current user. |

Profile update validation:

- `name` is optional but must be at least 3 characters.
- `email` is optional, must be valid, and must not be used by another user.
- `color` is optional and must be one of the configured colors in `src/utils/colors.ts`.
- `currentPassword` is required only when changing password and must match the current password.
- `newPassword` is optional but must be at least 6 characters.
- `confirmNewPassword` must match `newPassword`.

### Documents

Protected routes:

| Method | Path | Body | Description |
| --- | --- | --- | --- |
| `GET` | `/api/v1/docs/my` | None | Lists documents owned by the current user. |
| `GET` | `/api/v1/docs/shared` | None | Lists documents shared with the current user. |
| `GET` | `/api/v1/docs/:id` | None | Returns a document if the user owns it or has permission. |
| `POST` | `/api/v1/docs` | Optional `name` | Creates a new document for the current user. |
| `POST` | `/api/v1/docs/update/name/:id` | `name` | Renames a document. Owner only. |
| `DELETE` | `/api/v1/docs/:id` | None | Deletes a document. Owner only. |

Document responses map Prisma camelCase fields to frontend-friendly snake_case aliases such as `user_id`, `created_at`, and `updated_at`.

`GET /api/v1/docs/:id` also includes:

- `permissions`: users with access to the document.
- `author`: document owner details.
- `isAuthor`: whether the current user owns the document.

### Document Permissions

Protected under `/api/v1/docs/permissions`:

| Method | Path | Body | Description |
| --- | --- | --- | --- |
| `POST` | `/api/v1/docs/permissions/user-search` | `search`, `docId` | Searches users by name or email and marks whether they already have access. |
| `POST` | `/api/v1/docs/permissions/add` | `docId`, `userId` | Adds edit permission for a user. |
| `DELETE` | `/api/v1/docs/permissions/remove` | `id` | Removes a permission by permission ID. |
| `GET` | `/api/v1/docs/permissions/get-all/:docId` | None | Lists permissions for a document. |

Permission records are unique by `(docId, userId)` in the database.

## Realtime Collaboration

The HTTP server also accepts WebSocket upgrades and passes them to Hocuspocus.

Hocuspocus persistence is configured in `src/hocuspocus/index.ts`:

- `onLoadDocument` loads the matching `Doc` row by document ID.
- If the `body` column contains Yjs binary state, it is applied to a new `Y.Doc`.
- `onStoreDocument` encodes the current Yjs state and stores it in `docs.body`.

The frontend uses the document ID as the Hocuspocus room name. That means WebSocket document names must match existing `docs.id` values.

## Database Schema

Main Prisma models:

| Model | Purpose |
| --- | --- |
| `User` | Stores users, credentials, profile color, and role. |
| `Doc` | Stores document metadata, owner, timestamps, and Yjs binary state in `body`. |
| `DocPermission` | Stores shared document access for users. |

Enums:

- `UserRole`: `user`, `admin`
- `DocPermRole`: `edit`, `view`, `comment`

Current permission creation defaults to `edit`.

## Error Handling

Common route handlers live in `src/routes/common.ts`:

- `GET /` returns `{ "msg": "Hello World!" }`.
- Unknown routes return `{ "msg": "Not found!", "status": 404 }`.
- Errors return `{ "msg": "...", "status": number }`.

Validation errors return:

```json
{
  "errors": {
    "fieldName": {
      "msg": "Validation message"
    }
  }
}
```

## Development Notes

- Keep route definitions in `src/routes/`.
- Keep HTTP request/response handling in `src/controllers/`.
- Keep database and domain logic in `src/services/`.
- Keep validation rules under `src/middlewares/validators/`.
- Keep Prisma schema changes in `prisma/schema.prisma` and create migrations for database changes.
- WebSocket collaboration state is binary Yjs state, not JSON document content.
- Use the same `PORT` for REST and WebSocket traffic.

## Troubleshooting

**Server fails to start**

- Confirm `.env` exists and `DATABASE_URL` is valid.
- Confirm PostgreSQL is running.
- Confirm dependencies are installed with `pnpm install`.

**Prisma errors after schema changes**

- Run `pnpm prisma migrate dev`.
- Run `pnpm prisma generate`.
- Restart the development server.

**Authenticated routes return unauthorized**

- Confirm the request includes `Authorization: Bearer <token>`.
- Confirm `JWT_SECRET` matches the value used when the token was signed.
- Log in again if the token is expired.

**Collaborative editor does not sync**

- Confirm the frontend points `NEXT_PUBLIC_HOCUSPOCUS_URL` to this server.
- Confirm WebSocket traffic can reach the same `PORT`.
- Confirm the document ID exists in the `docs` table.

**Document content is missing after reload**

- Confirm Hocuspocus can update `docs.body`.
- Confirm the database user has update permission on the `docs` table.
- Check server logs for WebSocket or Prisma errors.
