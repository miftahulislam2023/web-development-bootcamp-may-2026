export interface TokenPayload {
  userId: number;
  email: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: UserProfile;
  accessToken: string;
  refreshToken: string;
}

export interface MessageResponse {
  message: string;
}

export interface ResetTokenResponse {
  resetToken: string;
}

export interface RegisterServiceInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginServiceInput {
  email: string;
  password: string;
}

export interface ForgotPasswordServiceInput {
  email: string;
}

export interface VerifyOtpServiceInput {
  email: string;
  otp: string;
}

export interface ResetPasswordServiceInput {
  resetToken: string;
  newPassword: string;
}
