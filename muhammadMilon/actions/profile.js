"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function updateProfileName(name) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Unauthorized" };
  const trimmed = String(name || "").trim();
  if (!trimmed) return { ok: false, error: "Name required" };
  await prisma.user.update({
    where: { id: session.user.id },
    data: { name: trimmed },
  });
  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");
  return { ok: true };
}
