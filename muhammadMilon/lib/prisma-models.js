import prisma from "@/lib/prisma";

function delegate(name) {
  const d = prisma[name];
  return d && typeof d.findMany === "function" ? d : null;
}

export const savedBlock = () => delegate("savedBlock");
export const templatePurchase = () => delegate("templatePurchase");
export const emailVerificationToken = () => delegate("emailVerificationToken");
export const passwordResetToken = () => delegate("passwordResetToken");
