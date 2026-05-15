import { api } from "./api"

import {
  LoginPayload,
  RegisterPayload,
  SendOtpPayload,
  VerifyOtpPayload,
  ResetPasswordPayload,
} from "@/types/auth.types"

export const registerUserApi = async (
  data: RegisterPayload
) => {
  const response = await api.post(
    "/auth/register",
    data
  )

  return response.data
}

export const loginUserApi = async (
  data: LoginPayload
) => {
  const response = await api.post(
    "/auth/login",
    data
  )

  return response.data
}

export const sendOtpApi = async (
  data: SendOtpPayload
) => {
  const response = await api.post(
    "/auth/send-otp",
    data
  )

  return response.data
}

export const verifyOtpApi = async (
  data: VerifyOtpPayload
) => {
  const response = await api.post(
    "/auth/verify-otp",
    data
  )

  return response.data
}

export const resetPasswordApi = async (
  data: ResetPasswordPayload
) => {
  const response = await api.post(
    "/auth/reset-password",
    data
  )

  return response.data
}
export const getCurrentUserApi =
  async () => {
    const response =
      await api.get(
        "/auth/current_user"
      )

    return response.data
  }

  export const updateProfileApi =
  async (data: {
    firstName: string
    lastName: string
    email: string
    image?: string
  }) => {

    const response =
      await api.patch(
        "/auth/update-profile",
        data
      )

    return response.data
  }

  export const logoutApi =
  async () => {

    const response =
      await api.post(
        "/auth/logout"
      )

    return response.data
  }