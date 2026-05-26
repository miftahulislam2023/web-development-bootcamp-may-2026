// src/app/modules/auth/auth.service.ts
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import { prisma } from "../../../lib/prisma";
import ApiError from "../../../utils/apiErrors";
import { setAuthCookies } from "../../../utils/cookieHelpers";
import { sendEmail } from "../../../utils/sendEmail";
import config from "../../config/index";
import { Role } from ".prisma/client/default";

// ── Token helpers ─────────────────────────────────────────────────────────────

const ACCESS_EXPIRES = (process.env.JWT_ACCESS_EXPIRES ||
  "15m") as SignOptions["expiresIn"];
const REFRESH_EXPIRES = (process.env.JWT_REFRESH_EXPIRES ||
  "7d") as SignOptions["expiresIn"];

const generateAccessToken = (userId: string, role: string) =>
  jwt.sign({ sub: userId, role }, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: ACCESS_EXPIRES,
  });

const generateRefreshToken = (userId: string) =>
  jwt.sign({ sub: userId }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: REFRESH_EXPIRES,
  });

// ── Signup ────────────────────────────────────────────────────────────────────

export const signup = async (data: {
  name: string;
  email: string;
  password: string;
  role?: Role;
}) => {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existing) throw new ApiError(409, "Email already in use");

  const hashedPassword = await bcrypt.hash(data.password, 10);

  // generate email verification token
  const emailVerifyToken = crypto.randomBytes(32).toString("hex");
  const emailVerifyExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24hrs

  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
      emailVerifyToken,
      emailVerifyExpiry,
    },
    select: { id: true, name: true, email: true, role: true },
  });

const verifyUrl = `${process.env.APP_URL}/api/v1/auth/verify-email?token=${emailVerifyToken}`;

sendEmail({
  to: user.email,
  subject: "Verify your account",
  html: `<p>Hi ${user.name},</p>
         <p>Click the link below to verify your email:</p>
         <a href="${verifyUrl}">${verifyUrl}</a>
         <p>This link expires in 24 hours.</p>`,
}).catch((err) => console.error("Email send failed:", err));

  return user;
};

// ── Verify Email ──────────────────────────────────────────────────────────────

export const verifyEmail = async (token: string) => {
  const user = await prisma.user.findFirst({
    where: {
      emailVerifyToken: token,
      emailVerifyExpiry: { gt: new Date() },
    },
  });

  if (!user) throw new ApiError(400, "Invalid or expired verification token");

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      emailVerifyToken: null,
      emailVerifyExpiry: null,
    },
  });

  return { message: "Email verified successfully" };
};

// ── Resend Verification ───────────────────────────────────────────────────────

export const resendEmailVerification = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(404, "User not found");
  if (user.isEmailVerified) throw new ApiError(400, "Email already verified");

  const emailVerifyToken = crypto.randomBytes(32).toString("hex");
  const emailVerifyExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerifyToken, emailVerifyExpiry },
  });

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${emailVerifyToken}`;

  await sendEmail({
    to: user.email,
    subject: "Verify your  account",
    html: `<p>New verification link: <a href="${verifyUrl}">${verifyUrl}</a></p>`,
  });

  return { message: "Verification email resent" };
};

// ── Signin ────────────────────────────────────────────────────────────────────

export const signin = async (
  email: string,
  password: string,
  res: Response,
) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(401, "Invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new ApiError(401, "Invalid email or password");

  if (!user.isEmailVerified)
    throw new ApiError(403, "Please verify your email before signing in");

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id);

  setAuthCookies(res, accessToken, refreshToken); // ✅ both in cookies

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
};

// ── Refresh Token ─────────────────────────────────────────────────────────────

export const refreshToken = async (token: string) => {
  try {
    const payload = jwt.verify(token, config.refreshSecret as string) as {
      sub: string;
    };

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new ApiError(401, "User not found");

    const accessToken = generateAccessToken(user.id, user.role);
    return { accessToken };
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
};

// ─── Logout ───────────────────────────────────────────────────────────────────

export const logout = async () => {
  return { message: "Logged out successfully" };
};

// ── Forgot Password ───────────────────────────────────────────────────────────

export const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  // always return same message — don't reveal if email exists
  if (!user) return { message: "If that email exists, a reset code was sent" };

  const resetToken = crypto.randomInt(100000, 999999).toString(); // 6-digit code
  const resetExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: resetToken,
      passwordResetExpiry: resetExpiry,
    },
  });

  await sendEmail({
    to: user.email,
    subject: " Password Reset Code",
    html: `<p>Your password reset code is: <strong>${resetToken}</strong></p>
           <p>This code expires in 15 minutes.</p>`,
  });

  return { message: "If that email exists, a reset code was sent" };
};

// ── Verify Reset Code ─────────────────────────────────────────────────────────

export const verifyResetCode = async (email: string, code: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
      passwordResetToken: code,
      passwordResetExpiry: { gt: new Date() },
    },
  });

  if (!user) throw new ApiError(400, "Invalid or expired reset code");
  return { message: "Code verified. You can now reset your password." };
};

// ── Reset Password ────────────────────────────────────────────────────────────

export const resetPassword = async (
  email: string,
  code: string,
  newPassword: string,
) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
      passwordResetToken: code,
      passwordResetExpiry: { gt: new Date() },
    },
  });

  if (!user) throw new ApiError(400, "Invalid or expired reset code");

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashed,
      passwordResetToken: null,
      passwordResetExpiry: null,
    },
  });

  return { message: "Password reset successful" };
};

// ── Change Password ───────────────────────────────────────────────────────────

export const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, "User not found");

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new ApiError(400, "Old password is incorrect");

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });

  return { message: "Password changed successfully" };
};

// ── Get Me ────────────────────────────────────────────────────────────────────

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isEmailVerified: true,
      createdAt: true,
    },
  });
  if (!user) throw new ApiError(404, "User not found");
  return user;
};
