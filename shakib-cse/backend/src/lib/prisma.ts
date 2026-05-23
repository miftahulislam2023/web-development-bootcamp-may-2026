import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaPg } from "@prisma/adapter-pg";
import { neonConfig } from "@neondatabase/serverless";
import { config } from "@/core/config";
import { PrismaClient } from "@/prisma/generated/client";
import ws from "ws";

const connectionString = config.database.url;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to initialize Prisma");
}

neonConfig.webSocketConstructor = ws;

function isNeonConnectionString(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.endsWith(".neon.tech");
  } catch {
    return false;
  }
}

// Augment globalThis to prevent multiple instances during hot-reloads
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  (() => {
    const adapter = isNeonConnectionString(connectionString)
      ? new PrismaNeon({ connectionString })
      : new PrismaPg({ connectionString });

    return new PrismaClient({ adapter });
  })();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
