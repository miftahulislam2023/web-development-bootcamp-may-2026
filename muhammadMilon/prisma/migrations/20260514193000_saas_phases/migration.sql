-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('pending', 'succeeded', 'failed', 'refunded');

-- AlterTable User
ALTER TABLE "User" ADD COLUMN "role" "Role" NOT NULL DEFAULT 'user';
ALTER TABLE "User" ADD COLUMN "blockedAt" TIMESTAMP(3);

CREATE INDEX "User_role_idx" ON "User"("role");

-- AlterTable Project
ALTER TABLE "Project" ADD COLUMN "siteType" TEXT NOT NULL DEFAULT 'saas';

-- AlterTable Template (slug + pricing)
ALTER TABLE "Template" ADD COLUMN "slug" TEXT;
ALTER TABLE "Template" ADD COLUMN "priceCents" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Template" ADD COLUMN "stripePriceId" TEXT;

UPDATE "Template" SET "slug" = 'template-' || REPLACE("id", '-', '')
WHERE "slug" IS NULL;

CREATE UNIQUE INDEX "Template_slug_key" ON "Template"("slug");

ALTER TABLE "Template" ALTER COLUMN "slug" SET NOT NULL;

CREATE INDEX "Template_isPremium_idx" ON "Template"("isPremium");

-- CreateTable TemplatePurchase
CREATE TABLE "TemplatePurchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "stripeSessionId" TEXT,
    "status" "PurchaseStatus" NOT NULL DEFAULT 'pending',
    "amountCents" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplatePurchase_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TemplatePurchase_stripeSessionId_key" ON "TemplatePurchase"("stripeSessionId");

CREATE INDEX "TemplatePurchase_userId_idx" ON "TemplatePurchase"("userId");

CREATE INDEX "TemplatePurchase_templateId_idx" ON "TemplatePurchase"("templateId");

CREATE INDEX "TemplatePurchase_status_idx" ON "TemplatePurchase"("status");

ALTER TABLE "TemplatePurchase" ADD CONSTRAINT "TemplatePurchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TemplatePurchase" ADD CONSTRAINT "TemplatePurchase_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;
