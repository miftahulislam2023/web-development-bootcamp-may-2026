import { ensureSuperAdmin } from "./superAdmin";

import { prisma } from "../../lib/prisma";
import { ensureUsers } from "./ensureUsers";

export async function bootstrapApp() {
  await prisma.$connect();
  console.log("Database connected");

  await ensureSuperAdmin();
  await ensureUsers();
}