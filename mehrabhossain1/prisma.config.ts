import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Prisma CLI reads .env only; load the project's .env.local explicitly.
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Migrations must run on Neon's direct (unpooled) connection.
    url: process.env["DIRECT_URL"],
  },
});
