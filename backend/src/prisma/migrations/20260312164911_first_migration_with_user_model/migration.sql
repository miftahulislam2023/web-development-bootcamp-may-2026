-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "username" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "displayName" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "status" "AccountStatus" NOT NULL DEFAULT 'pending_verification',
    "password" TEXT NOT NULL,
    "emailVerifiedAt" TIMESTAMP(3),
    "bio" TEXT,
    "avatarUrl" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
