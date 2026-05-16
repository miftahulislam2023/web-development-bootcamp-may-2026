"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { axiosInstance } from "@/lib/api-client"
import { useAuthStore } from "@/lib/auth-store"
import { toast } from "sonner"

interface LoginState {
  error: string | null
}

interface LoginResponseData {
  user: {
    id: number
    name: string
    email: string
  }
  accessToken: string
}

const INITIAL_STATE: LoginState = { error: null }
const DASHBOARD_ROUTE = "/dashboard"

export function useLoginAction() {
  const router = useRouter()
  const { setUser, setToken } = useAuthStore()

  async function loginAction(
    _prevState: LoginState,
    formData: FormData,
  ): Promise<LoginState> {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      return { error: "Email and password are required." }
    }

    try {
      const response = await axiosInstance.post<{
        status: string
        data: LoginResponseData
      }>("/api/auth/login", { email, password })

      setToken(response.data.data.accessToken)
      setUser(response.data.data.user)
      toast.success("Welcome back!")
      router.push(DASHBOARD_ROUTE)

      return { error: null }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Login failed. Try again."
      toast.error(message)
      return { error: message }
    }
  }

  const [state, action] = useActionState(loginAction, INITIAL_STATE)

  return { state, action }
}
