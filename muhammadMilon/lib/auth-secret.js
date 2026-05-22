/**
 * Auth.js requires a non-empty `secret` for signing/encrypting cookies and JWTs.
 * Trims whitespace — fixes `.env` lines like `AUTH_SECRET= mysecret` (space after `=`).
 *
 * In development only, a deterministic fallback allows `npm run dev` before `.env` exists.
 * Production must set AUTH_SECRET or NEXTAUTH_SECRET.
 */
const DEV_FALLBACK_SECRET =
  "nexora-studio-local-dev-only-do-not-use-in-production-min-32-chars";

export function getAuthSecret() {
  const raw = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "";
  const secret = typeof raw === "string" ? raw.trim() : "";
  if (secret.length) return secret;
  if (process.env.NODE_ENV === "production") {
    console.error("[auth] CRITICAL: AUTH_SECRET is missing. Authentication will fail.");
    return undefined;
  }
  return DEV_FALLBACK_SECRET;
}
