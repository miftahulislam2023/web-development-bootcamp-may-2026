/**
 * Runs before `npm run dev` (predev). Loads `.env` / `.env.local` into `process.env`
 * when Node was started without `--env-file`, then prints friendly warnings.
 * Never exits with an error so local onboarding stays smooth.
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";

function parseEnvLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;
  const eq = trimmed.indexOf("=");
  if (eq <= 0) return null;
  const key = trimmed.slice(0, eq).trim();
  if (!key) return null;
  let val = trimmed.slice(eq + 1).trim();
  if (
    (val.startsWith('"') && val.endsWith('"')) ||
    (val.startsWith("'") && val.endsWith("'"))
  ) {
    val = val.slice(1, -1);
  }
  return [key, val];
}

function loadEnvFiles() {
  for (const name of [".env", ".env.local", ".env.development"]) {
    const file = join(process.cwd(), name);
    if (!existsSync(file)) continue;
    const text = readFileSync(file, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const pair = parseEnvLine(line);
      if (!pair) continue;
      const [k, v] = pair;
      if (process.env[k] === undefined) {
        process.env[k] = v;
      }
    }
  }
}

loadEnvFiles();

const db = process.env.DATABASE_URL?.trim();
if (!db) {
  console.warn(
    "\n[nexora] DATABASE_URL is not set after reading .env / .env.local.\n" +
      "         Add DATABASE_URL to .env.local for Prisma and the dashboard.\n",
  );
}

const auth = (process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "").trim();
if (!auth) {
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "\n[nexora] AUTH_SECRET (or NEXTAUTH_SECRET) is required in production.\n" +
        "         Set it in your host environment before deploy.\n",
    );
  } else {
    console.warn(
      "[nexora] AUTH_SECRET not set — using the development-only fallback from lib/auth-secret.js.\n" +
        "         For shared sessions across machines, run: npx auth secret\n",
    );
  }
}

function googleId() {
  return (
    process.env.GOOGLE_CLIENT_ID?.trim() ||
    process.env.AUTH_GOOGLE_ID?.trim() ||
    process.env.AUTH_GOOGLE_CLIENT_ID?.trim() ||
    process.env.GOOGLE_ID?.trim() ||
    ""
  );
}

function googleSecret() {
  return (
    process.env.GOOGLE_CLIENT_SECRET?.trim() ||
    process.env.AUTH_GOOGLE_SECRET?.trim() ||
    process.env.AUTH_GOOGLE_CLIENT_SECRET?.trim() ||
    process.env.GOOGLE_SECRET?.trim() ||
    ""
  );
}

const gid = googleId();
const gsec = googleSecret();
if (gid && !gsec) {
  console.warn(
    "[nexora] Google Client ID is set but the client secret is missing — “Continue with Google” stays hidden.\n" +
      "         Set GOOGLE_CLIENT_SECRET (or AUTH_GOOGLE_SECRET) to match your Google Cloud OAuth client.\n",
  );
}
if (!gid && gsec) {
  console.warn(
    "[nexora] Google client secret is set but the Client ID is missing — add GOOGLE_CLIENT_ID or AUTH_GOOGLE_ID.\n",
  );
}
