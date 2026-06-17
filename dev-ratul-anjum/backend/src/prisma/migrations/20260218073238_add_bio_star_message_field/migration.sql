-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "markAsStar" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "bio" TEXT;
