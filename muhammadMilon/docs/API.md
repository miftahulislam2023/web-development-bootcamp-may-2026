# HTTP API

Base URL: your deployment origin (e.g. `https://app.example.com`).

## Authentication

- **Session** — Dashboard and authenticated APIs rely on Auth.js session cookies (JWT strategy).
- **Public** — `GET /api/health` and published pages `GET /p/[subdomain]` do not require a session.

## `POST /api/ai`

Generates builder content with Gemini. **Requires an authenticated session.**

### Request

`Content-Type: application/json`

```json
{
  "type": "section | hero | palette | layout",
  "prompt": "string, 3–2000 chars"
}
```

### Responses

- **`200 OK`** — Shape depends on `type`:
  - `section` → `{ "sections": [ /* builder sections */ ] }`
  - `hero` → `{ "section": { /* single hero section */ } }`
  - `palette` → `{ "palette": { "background", "foreground", "accent", "muted" } }`
  - `layout` → `{ "blueprint": "markdown-ish outline string" }`
- **`401`** — Not signed in.
- **`400`** — Validation error.
- **`502`** — Gemini or configuration error (see JSON `error`).

### Example

```bash
curl -X POST https://your-app.com/api/ai \
  -H "Content-Type: application/json" \
  -b "your-session-cookie" \
  -d '{"type":"hero","prompt":"B2B analytics for retailers, confident tone"}'
```

## `GET /api/health`

Returns `{ "ok": true, "service": "nexora-studio" }` for uptime checks.

## Auth.js routes

- **`GET|POST /api/auth/*`** — Handled by Auth.js (sign in, sign out, OAuth callbacks). Do not modify paths without updating provider settings.

## Server Actions (not REST)

The app uses Next.js Server Actions for most mutations:

- **Projects** — `createProject`, `updateProjectCanvas`, `deleteProject`, `getProjectForUser`, `listProjectsForUser` (`actions/projects.js`).
- **Publish** — `publishProject`, `setCustomDomain` (`actions/publish.js`).
- **Registration** — `registerUser` (`actions/auth.js`).

These are invoked from client components and forms; they are not exposed as separate REST endpoints by default.
