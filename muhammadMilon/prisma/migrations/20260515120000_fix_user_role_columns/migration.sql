-- Fix Auth.js + Prisma adapter crash: schema expects User.role / User.blockedAt but DB may
-- lack these columns if migrations were skipped or only `db push` was used on an older state.
-- Safe to re-run: uses IF NOT EXISTS / duplicate guards.

DO $$
BEGIN
  CREATE TYPE "Role" AS ENUM ('user', 'admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" "Role" NOT NULL DEFAULT 'user'::"Role";
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "blockedAt" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "User_role_idx" ON "User"("role");
