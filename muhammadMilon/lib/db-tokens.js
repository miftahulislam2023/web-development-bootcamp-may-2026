import prisma from "@/lib/prisma";

export function emailVerificationDelegate() {
  const d = prisma.emailVerificationToken;
  return d && typeof d.create === "function" ? d : null;
}

export function passwordResetDelegate() {
  const d = prisma.passwordResetToken;
  return d && typeof d.create === "function" ? d : null;
}
