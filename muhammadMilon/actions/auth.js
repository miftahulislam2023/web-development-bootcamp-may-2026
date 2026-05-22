"use server";

import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { emailVerificationDelegate, passwordResetDelegate } from "@/lib/db-tokens";
import { registerSchema, forgotPasswordSchema, resetPasswordSchema } from "@/lib/validations";
import { slugify } from "@/utils/id";
import { sendEmail, appOrigin } from "@/lib/email";
import { createSecureToken, tokenExpires } from "@/lib/tokens";

export async function registerUser(input) {
  try {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten().fieldErrors };
  }
  const { name, email, password } = parsed.data;
  const normalized = email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email: normalized } });
  if (existing) {
    if (existing.deletedAt) {
      return { ok: false, error: { email: ["This account was removed. Contact support."] } };
    }
    return { ok: false, error: { email: ["Email already registered"] } };
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalized,
      password: hashed,
    },
  });

  const sent = await sendVerificationEmailForUser(user.id, normalized);
  if (sent?.ok === false) {
    return { ok: false, error: { email: [sent.error || "Could not send verification email"] } };
  }

  return { ok: true };
  } catch (e) {
    console.error("[registerUser]", e);
    return { ok: false, error: { email: ["Registration failed. Try again."] } };
  }
}

export async function requestPasswordReset(input) {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid email" };
  }

  const email = parsed.data.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email } });

  console.log("[auth] User found for reset:", { 
    exists: !!user, 
    hasPassword: !!user?.password 
  });

  if (!user?.password) {
    console.log("[auth] Reset skipped: User has no password (likely OAuth user)");
    return { ok: true };
  }

  const resetTokens = passwordResetDelegate();
  if (!resetTokens) {
    console.error("[auth] PasswordResetToken model unavailable — run: npx prisma db push && npx prisma generate");
    return { ok: false, error: "Password reset is temporarily unavailable" };
  }

  await resetTokens.deleteMany({ where: { userId: user.id } });

  const token = createSecureToken();
  await resetTokens.create({
    data: {
      userId: user.id,
      token,
      expires: tokenExpires(1),
    },
  });

  const link = `${appOrigin()}/reset-password?token=${token}`;
  await sendEmail({
    to: email,
    subject: "Reset your Nexora Studio password",
    text: `Reset your password: ${link}\n\nThis link expires in 1 hour.`,
    html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <h2 style="color: #6366f1; margin-top: 0;">Nexora Studio</h2>
      <p style="color: #475569; font-size: 16px;">We received a request to reset your password. Click the button below to choose a new one:</p>
      <div style="margin: 30px 0;">
        <a href="${link}" style="display: inline-block; padding: 12px 24px; background-color: #6366f1; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">Reset Password</a>
      </div>
      <p style="color: #64748b; font-size: 14px;">This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="color: #94a3b8; font-size: 12px;">Nexora Studio — The professional visual website builder.</p>
    </div>`,
  });

  return { ok: true };
}

export async function resetPassword(input) {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid password (min 8 characters)" };
  }

  const resetTokens = passwordResetDelegate();
  if (!resetTokens) {
    return { ok: false, error: "Password reset is temporarily unavailable" };
  }

  const record = await resetTokens.findUnique({
    where: { token: parsed.data.token },
    include: { user: true },
  });

  if (!record || record.expires < new Date()) {
    return { ok: false, error: "Invalid or expired reset link" };
  }

  const hashed = await bcrypt.hash(parsed.data.password, 12);
  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { password: hashed },
    }),
    resetTokens.delete({ where: { id: record.id } }),
    resetTokens.deleteMany({ where: { userId: record.userId } }),
  ]);

  return { ok: true };
}

export async function sendVerificationEmailForUser(userId, email) {
  try {
    const verifyTokens = emailVerificationDelegate();
    if (!verifyTokens) {
      console.error("[auth] EmailVerificationToken model unavailable — run: npx prisma db push && npx prisma generate");
      return { ok: false, error: "Email verification is temporarily unavailable" };
    }

    await verifyTokens.deleteMany({ where: { userId } });

    const token = createSecureToken();
    await verifyTokens.create({
      data: {
        userId,
        token,
        expires: tokenExpires(48),
      },
    });

    const link = `${appOrigin()}/verify-email?token=${encodeURIComponent(token)}`;
    const emailResult = await sendEmail({
      to: email,
      subject: "Verify your Nexora Studio email",
      text: `Welcome to Nexora Studio!\n\nVerify your email: ${link}\n\nThis link expires in 48 hours.`,
      html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #6366f1; margin-top: 0;">Nexora Studio</h2>
        <p style="color: #475569; font-size: 16px;">Welcome to Nexora Studio! To get started, please verify your email address by clicking the button below:</p>
        <div style="margin: 30px 0;">
          <a href="${link}" style="display: inline-block; padding: 12px 24px; background-color: #6366f1; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">Verify Email</a>
        </div>
        <p style="color: #64748b; font-size: 14px;">This link will expire in 48 hours. Once verified, you'll have full access to our professional builder.</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="color: #94a3b8; font-size: 12px;">Nexora Studio — The professional visual website builder.</p>
      </div>`,
    });

    if (emailResult?.ok === false) {
      return { ok: false, error: emailResult.error || "Failed to send verification email" };
    }

    return { ok: true };
  } catch (e) {
    console.error("[sendVerificationEmailForUser]", e);
    return { ok: false, error: e instanceof Error ? e.message : "Verification email failed" };
  }
}

export async function resendVerificationEmail(email) {
  try {
    if (!email?.trim()) {
      return { ok: false, error: "Email is required" };
    }
    const normalized = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email: normalized } });
    if (!user || user.deletedAt) return { ok: true };
    if (user.emailVerified) return { ok: true, alreadyVerified: true };

    const result = await sendVerificationEmailForUser(user.id, normalized);
    if (result?.ok === false) {
      return { ok: false, error: result.error || "Could not send verification email" };
    }
    return { ok: true };
  } catch (e) {
    console.error("[resendVerificationEmail]", e);
    return { ok: false, error: "Could not send verification email" };
  }
}

export async function verifyEmail(token) {
  if (!token?.trim()) {
    return { ok: false, error: "Missing token" };
  }

  const verifyTokens = emailVerificationDelegate();
  if (!verifyTokens) {
    return { ok: false, error: "Email verification is temporarily unavailable" };
  }

  const record = await verifyTokens.findUnique({
    where: { token: token.trim() },
    include: { user: true },
  });

  if (!record || record.expires < new Date()) {
    return { ok: false, error: "Invalid or expired verification link" };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { emailVerified: new Date() },
    }),
    verifyTokens.deleteMany({ where: { userId: record.userId } }),
  ]);

  return { ok: true };
}

export async function ensureUniqueSlug(userId, base) {
  const slug = slugify(base) || "project";
  let candidate = slug;
  let n = 0;
  while (
    await prisma.project.findFirst({
      where: { userId, slug: candidate },
    })
  ) {
    n += 1;
    candidate = `${slug}-${n}`;
  }
  return candidate;
}
