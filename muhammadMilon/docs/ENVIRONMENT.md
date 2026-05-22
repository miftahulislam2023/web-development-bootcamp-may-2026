# Environment & setup

## Required variables

- **`DATABASE_URL`** — PostgreSQL URL, including user, password, host, port, database, and optional `?schema=public`.
- **`AUTH_SECRET`** — Long random string used by Auth.js to encrypt cookies. Generate with:
  ```bash
  openssl rand -base64 32
  ```
- **`NEXTAUTH_URL`** — Canonical site URL (e.g. `http://localhost:3000` in dev, `https://your-domain.com` in production).

## Optional variables

- **`GOOGLE_CLIENT_ID`** / **`GOOGLE_CLIENT_SECRET`** — Enable “Continue with Google”. Omit both to hide the button.
- **`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`**, **`NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`** — Required for Cloudinary uploads (unsigned preset, e.g. `nexora_unsigned` on cloud `dlwxbagrn`).
- **`CLOUDINARY_URL`** — Optional; `cloudinary://API_KEY:API_SECRET@CLOUD_NAME` for signed deletes. Uploads work without it when the public preset is set.
- **`NEXT_PUBLIC_APP_URL`** — Optional; use for absolute links in emails or future features.

## Database workflow

1. Install dependencies: `npm install`
2. Push schema: `npx prisma db push` (or `npm run db:migrate` for migration-based workflows)
3. Seed defaults: `npm run db:seed`

## Local troubleshooting

- **Auth errors** — Ensure `AUTH_SECRET` and `NEXTAUTH_URL` match how you access the app (including port).
- **Prisma errors** — Confirm `DATABASE_URL` is reachable from your machine; firewalls and SSL mode (`?sslmode=require`) matter for cloud providers.
- **Google OAuth** — Authorized redirect URI in Google Cloud Console should be `{NEXTAUTH_URL}/api/auth/callback/google`.
- **Turbopack / monorepo layout** — If Next.js warns about multiple lockfiles, either remove stray `package-lock.json` files outside this project or keep `turbopack.root` set in `next.config.mjs` (already pinned to this repo).

## Vercel

Add the same variables under **Project → Settings → Environment Variables**. Use the production `DATABASE_URL` and set `NEXTAUTH_URL` to your Vercel domain (including `https://`).
