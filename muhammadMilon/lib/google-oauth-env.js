/**
 * Server-only: resolves Google OAuth credentials from common env names.
 * Do not import this module from client components (secrets must stay on the server).
 */

function trim(key) {
  const v = process.env[key];
  return typeof v === "string" ? v.trim() : "";
}

/**
 * @returns {{ clientId: string, clientSecret: string }}
 */
export function getGoogleOAuthCredentials() {
  const clientId =
    trim("GOOGLE_CLIENT_ID") ||
    trim("AUTH_GOOGLE_ID") ||
    trim("AUTH_GOOGLE_CLIENT_ID") ||
    trim("GOOGLE_ID");

  const clientSecret =
    trim("GOOGLE_CLIENT_SECRET") ||
    trim("AUTH_GOOGLE_SECRET") ||
    trim("AUTH_GOOGLE_CLIENT_SECRET") ||
    trim("GOOGLE_SECRET");

  return { clientId, clientSecret };
}

export function isGoogleOAuthConfigured() {
  const { clientId, clientSecret } = getGoogleOAuthCredentials();
  return Boolean(clientId && clientSecret);
}
