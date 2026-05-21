export interface RegisterPayload {
  name: string
  email: string
  password: string
  image?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface User {
  _id: string
  name: string
  email: string
  image?: string
}

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export interface SendOtpPayload {
  email: string
}

export interface VerifyOtpPayload {
  email: string
  otp: string
}

export interface ResetPasswordPayload {
  email: string
  password: string
}