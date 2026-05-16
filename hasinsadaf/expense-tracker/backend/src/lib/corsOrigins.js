/** Origins allowed to call this API with credentials (browser CORS). */
export const DEFAULT_CORS_ORIGIN = "http://localhost:3000";

export const ALLOWED_CORS_ORIGINS = new Set([
  DEFAULT_CORS_ORIGIN,
  "http://127.0.0.1:3000",
  process.env.FRONTEND_URL,
].filter(Boolean));

export function resolveCorsAllowOrigin(originHeader) {
  if (originHeader && ALLOWED_CORS_ORIGINS.has(originHeader)) {
    return originHeader;
  }
  return DEFAULT_CORS_ORIGIN;
}
