"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { axiosInstance } from "@/lib/api-client"
import { safeSessionStorage } from "@/lib/safe-storage"
import { toast } from "sonner"

interface VerifyOtpState {
  error: string | null
}

interface VerifyOtpResponse {
  resetToken: string
}

const INITIAL_STATE: VerifyOtpState = { error: null }
const RESET_PASSWORD_ROUTE = "/reset-password"
const STORAGE_KEY_EMAIL = "reset-email"
const STORAGE_KEY_TOKEN = "reset-token"
const OTP_FORMAT = /^\d{6}$/

export function useVerifyOtpAction() {
  const router = useRouter()

  async function verifyOtpAction(
    _prevState: VerifyOtpState,
    formData: FormData,
  ): Promise<VerifyOtpState> {
    const rawOtp = formData.get("otp")

    if (typeof rawOtp !== "string") {
      return { error: "OTP code is required." }
    }

    const otp = rawOtp.trim()
    const email = safeSessionStorage.getItem(STORAGE_KEY_EMAIL)

    if (!email) {
      return { error: "Session expired. Please restart the password reset." }
    }

    if (!otp) {
      return { error: "OTP code is required." }
    }

    if (!OTP_FORMAT.test(otp)) {
      return { error: "OTP must be a 6-digit number." }
    }

    try {
      const response = await axiosInstance.post<{
        status: string
        data: VerifyOtpResponse
      }>("/api/auth/verify-otp", { email, otp })

      safeSessionStorage.setItem(STORAGE_KEY_TOKEN, response.data.data.resetToken)
      safeSessionStorage.removeItem(STORAGE_KEY_EMAIL)
      router.push(RESET_PASSWORD_ROUTE)

      return { error: null }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Invalid OTP."
      toast.error(message)
      return INITIAL_STATE
    }
  }

  const [state, action] = useActionState(verifyOtpAction, INITIAL_STATE)

  return { state, action }
}
