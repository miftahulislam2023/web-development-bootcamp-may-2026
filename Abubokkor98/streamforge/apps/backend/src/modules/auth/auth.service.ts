import { prisma } from '@/config/prisma';
import { ApiError } from '@/utils/api-error';
import { hashPassword, verifyPassword } from '@/utils/password';
import { signToken, verifyToken } from '@/utils/jwt';
import { generateOtp, OTP_EXPIRY_MINUTES, RESET_TOKEN_EXPIRY_MINUTES, REFRESH_TOKEN_EXPIRY_DAYS, MS_PER_MINUTE, MS_PER_DAY, RESET_TOKEN_PURPOSE } from '@/utils/otp';
import { generateRefreshToken, hashRefreshToken } from '@/utils/refresh-token';
import { sendEmail } from '@/utils/mailer';
import { passwordResetEmailHtml } from '@/templates/email.template';
import { buildAuthResponse } from '@/helpers/auth.helpers';
import type {
  AuthResponse,
  MessageResponse,
  ResetTokenResponse,
  RegisterServiceInput,
  LoginServiceInput,
  ForgotPasswordServiceInput,
  VerifyOtpServiceInput,
  ResetPasswordServiceInput,
} from '@/modules/auth/auth.types';

const MAX_SESSIONS = 5;

async function createRefreshTokenForUser(userId: number): Promise<string> {
  const refreshToken = generateRefreshToken();
  const tokenHash = hashRefreshToken(refreshToken);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * MS_PER_DAY);

  await prisma.refreshToken.create({
    data: {
      user_id: userId,
      token_hash: tokenHash,
      expires_at: expiresAt,
    },
  });

  // Post-create prune to enforce MAX_SESSIONS and avoid TOCTOU races
  const tokensToKeep = await prisma.refreshToken.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
    take: MAX_SESSIONS,
    select: { id: true },
  });

  if (tokensToKeep.length === MAX_SESSIONS) {
    const keepIds = tokensToKeep.map(t => t.id);
    await prisma.refreshToken.deleteMany({
      where: {
        user_id: userId,
        id: { notIn: keepIds },
      },
    });
  }

  return refreshToken;
}

export async function register(input: RegisterServiceInput): Promise<AuthResponse> {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw ApiError.conflict('Email already registered');
  }

  const hashedPassword = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
    },
  });

  const refreshToken = await createRefreshTokenForUser(user.id);

  return buildAuthResponse(user, refreshToken);
}

export async function login(input: LoginServiceInput): Promise<AuthResponse> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isPasswordValid = await verifyPassword(input.password, user.password);

  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const refreshToken = await createRefreshTokenForUser(user.id);

  return buildAuthResponse(user, refreshToken);
}

export async function refreshAccessToken(currentRefreshToken: string): Promise<AuthResponse> {
  const tokenHash = hashRefreshToken(currentRefreshToken);

  const storedToken = await prisma.refreshToken.findFirst({
    where: { token_hash: tokenHash },
    include: { user: true },
  });

  if (!storedToken) {
    throw ApiError.unauthorized('Invalid refresh token');
  }

  if (new Date() > storedToken.expires_at) {
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    throw ApiError.unauthorized('Refresh token has expired. Please login again.');
  }

  // Token rotation: delete old, create new
  await prisma.refreshToken.delete({ where: { id: storedToken.id } });

  const newRefreshToken = await createRefreshTokenForUser(storedToken.user.id);

  return buildAuthResponse(storedToken.user, newRefreshToken);
}

export async function logout(refreshToken: string): Promise<MessageResponse> {
  const tokenHash = hashRefreshToken(refreshToken);

  await prisma.refreshToken.deleteMany({
    where: { token_hash: tokenHash },
  });

  return { message: 'Logged out successfully' };
}

export async function logoutAllDevices(userId: number): Promise<MessageResponse> {
  await prisma.refreshToken.deleteMany({
    where: { user_id: userId },
  });

  return { message: 'Logged out from all devices' };
}

export async function forgotPassword(input: ForgotPasswordServiceInput): Promise<MessageResponse> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    return { message: 'If the email exists, a reset code has been sent' };
  }

  await prisma.passwordResetOtp.deleteMany({
    where: { user_id: user.id },
  });

  const otp = generateOtp();
  const otpHash = await hashPassword(otp);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * MS_PER_MINUTE);

  await prisma.passwordResetOtp.create({
    data: {
      user_id: user.id,
      otp_hash: otpHash,
      expires_at: expiresAt,
    },
  });

  await sendEmail({
    to: user.email,
    subject: 'StreamForge — Password Reset Code',
    html: passwordResetEmailHtml(user.name, otp),
  });

  return { message: 'If the email exists, a reset code has been sent' };
}

export async function verifyOtp(input: VerifyOtpServiceInput): Promise<ResetTokenResponse> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw ApiError.badRequest('Invalid reset code');
  }

  const otpRecord = await prisma.passwordResetOtp.findFirst({
    where: { user_id: user.id },
    orderBy: { created_at: 'desc' },
  });

  if (!otpRecord) {
    throw ApiError.badRequest('Invalid or expired reset code');
  }

  if (new Date() > otpRecord.expires_at) {
    await prisma.passwordResetOtp.delete({ where: { id: otpRecord.id } });
    throw ApiError.badRequest('Invalid or expired reset code');
  }

  const isCodeValid = await verifyPassword(input.otp, otpRecord.otp_hash);

  if (!isCodeValid) {
    throw ApiError.badRequest('Invalid reset code');
  }

  await prisma.passwordResetOtp.delete({ where: { id: otpRecord.id } });

  const resetTokenPayload = {
    userId: user.id,
    email: user.email,
    purpose: RESET_TOKEN_PURPOSE,
  };

  return {
    resetToken: signToken(resetTokenPayload, RESET_TOKEN_EXPIRY_MINUTES),
  };
}

export async function resetPassword(input: ResetPasswordServiceInput): Promise<MessageResponse> {
  let decoded: Record<string, unknown>;

  try {
    decoded = verifyToken(input.resetToken);
  } catch {
    throw ApiError.badRequest('Invalid or expired reset token');
  }

  if (decoded.purpose !== RESET_TOKEN_PURPOSE) {
    throw ApiError.badRequest('Invalid reset token');
  }

  const userId = decoded.userId;

  if (typeof userId !== 'number') {
    throw ApiError.badRequest('Invalid reset token');
  }

  const hashedPassword = await hashPassword(input.newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  // Invalidate all refresh tokens on password reset
  await prisma.refreshToken.deleteMany({
    where: { user_id: userId },
  });

  return { message: 'Password reset successfully' };
}
