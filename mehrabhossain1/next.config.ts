import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the native pg / Prisma packages out of the bundle (server-only).
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg"],
};

export default nextConfig;
