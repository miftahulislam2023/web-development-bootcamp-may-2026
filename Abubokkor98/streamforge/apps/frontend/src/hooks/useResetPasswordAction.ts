"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { axiosInstance } from "@/lib/api-client"
import { toast } from "sonner"
import { validatePassword, validatePasswordMatch } from "@/lib/validation"
import { safeSessionStorage } from "@/lib/safe-storage"

interface ResetPasswordState {
  error: string | null
  fieldErrors: {
    newPassword?: string
    confirmPassword?: string
  }
}

const INITIAL_STATE: ResetPasswordState = { error: null, fieldErrors: {} }
const LOGIN_ROUTE = "/login"
const STORAGE_KEY_TOKEN = "reset-token"

export function useResetPasswordAction() {
  const router = useRouter()

  async function resetPasswordAction(
    _prevState: ResetPasswordState,
    formData: FormData,
  ): Promise<ResetPasswordState> {
    const rawPassword = formData.get("newPassword")
    const rawConfirm = formData.get("confirmPassword")

    if (typeof rawPassword !== "string" || typeof rawConfirm !== "string") {
      return {
        error: null,
        fieldErrors: { newPassword: "Password is required." },
      }
    }

    const newPassword = rawPassword
    const confirmPassword = rawConfirm
    const resetToken = safeSessionStorage.getItem(STORAGE_KEY_TOKEN)

    if (!resetToken) {
      return {
        error: "Session expired. Please restart the password reset.",
        fieldErrors: {},
      }
    }

    const fieldErrors: ResetPasswordState["fieldErrors"] = {}

    const passwordError = validatePassword(newPassword)
    if (passwordError) {
      fieldErrors.newPassword = passwordError
    }

    const matchError = validatePasswordMatch(newPassword, confirmPassword)
    if (matchError) {
      fieldErrors.confirmPassword = matchError
    }

    if (Object.keys(fieldErrors).length > 0) {
      return { error: null, fieldErrors }
    }

    try {
      await axiosInstance.post("/api/auth/reset-password", {
        resetToken,
        newPassword,
      })

      safeSessionStorage.removeItem(STORAGE_KEY_TOKEN)
      toast.success("Password reset successfully. Please sign in.")
      router.push(LOGIN_ROUTE)

      return INITIAL_STATE
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Reset failed."
      toast.error(message)
      return { error: message, fieldErrors: {} }
    }
  }

  const [state, action] = useActionState(resetPasswordAction, INITIAL_STATE)

  return { state, action }
}
