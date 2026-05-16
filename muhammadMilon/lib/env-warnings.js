let warned;

/**
 * One-time console hints for missing env (dev server / Node runtime startup).
 * Does not throw — keeps the marketing shell usable while you wire Postgres and secrets.
 */
export function warnEnvOnce() {
  if (warned) return;
  warned = true;

  if (!process.env.DATABASE_URL?.trim()) {
    console.warn(
      "[nexora] DATABASE_URL is not set. Prisma, dashboard, and sign-up/sign-in that touch the DB will fail until you configure it (see .env.example).",
    );
  }

  const authSet = Boolean(
    (process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "").trim(),
  );
  if (!authSet && process.env.NODE_ENV === "production") {
    console.error(
      "[nexora] AUTH_SECRET (or NEXTAUTH_SECRET) must be set in production.",
    );
  }
}
