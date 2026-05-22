import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Canonical origin for NEXTAUTH_URL (no trailing slash, path stripped). */
function getSiteUrlForNextConfig() {
  const pickOrigin = (raw) => {
    if (!raw || typeof raw !== "string") return "";
    const t = raw.trim().replace(/\/$/, "");
    if (!t) return "";
    try {
      const u = new URL(t.includes("://") ? t : `https://${t}`);
      return `${u.protocol}//${u.host}`;
    } catch {
      return "";
    }
  };
  return (
    pickOrigin(process.env.AUTH_URL) ||
    pickOrigin(process.env.NEXTAUTH_URL) ||
    pickOrigin(process.env.NEXT_PUBLIC_APP_URL) ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "")}`
      : "") ||
    "http://localhost:3000"
  );
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Inlines NEXTAUTH_URL for the next-auth/react client bundle so session/csrf
   * requests resolve to the correct origin (avoids HTML error pages / broken JSON).
   */
  env: {
    NEXTAUTH_URL: getSiteUrlForNextConfig(),
  },
  // Pin Turbopack root when another package-lock.json exists higher on the filesystem
  // (e.g. under the user home directory) so the app resolves from this project folder.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
