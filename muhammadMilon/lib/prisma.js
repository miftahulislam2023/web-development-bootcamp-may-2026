import { PrismaClient } from "@prisma/client";

if (process.env.NODE_ENV === "development" && !process.env.DATABASE_URL?.trim()) {
  console.warn(
    "[prisma] DATABASE_URL is empty — database calls will fail until .env is configured.",
  );
}

const globalForPrisma = globalThis;

const REQUIRED_DELEGATES = [
  "projectActivity",
  "canvasRevision",
  "mediaAsset",
  "savedBlock",
  "user",
  "formSubmission",
  "emailVerificationToken",
  "passwordResetToken",
  "page",
  "templatePurchase",
];

function isStaleClient(client) {
  if (!client) return true;
  return REQUIRED_DELEGATES.some(
    (name) => typeof client[name]?.findMany !== "function",
  );
}

function createPrismaClient() {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });
}

function getPrismaClient() {
  const cached = globalForPrisma.prisma;
  if (!isStaleClient(cached)) {
    return cached;
  }

  if (cached && process.env.NODE_ENV === "development") {
    console.warn(
      "[prisma] Refreshing cached client — restart dev server after schema changes.",
    );
    cached.$disconnect().catch(() => null);
  }

  const client = createPrismaClient();
  globalForPrisma.prisma = client;
  return client;
}

export const prisma = getPrismaClient();

export default prisma;
