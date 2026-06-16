"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { axiosInstance } from "@/lib/api-client"
import { useAuthStore } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { SignOut } from "@phosphor-icons/react"
import { toast } from "sonner"
import { isAxiosError } from "axios"

const LOGOUT_ENDPOINT = "/api/auth/logout"
const HOME_ROUTE = "/"

/**
 * Client leaf — handles logout.
 * Calls backend FIRST to clear HttpOnly cookies server-side.
 * Only clears client state on success (user stays logged in if backend fails).
 */
function LogoutButton() {
  const router = useRouter()
  const logout = useAuthStore((state) => state.logout)
  const [isPending, setIsPending] = useState(false)

  async function handleLogout() {
    if (isPending) return
    setIsPending(true)
    try {
      await axiosInstance.post(LOGOUT_ENDPOINT)

      logout()
      toast.success("Signed out successfully.")
      router.push(HOME_ROUTE)
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message ?? "Failed to sign out. Please try again."
        : "Failed to sign out. Please try again."

      toast.error(message)
      // Don't clear state — user stays logged in if backend call fails
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      disabled={isPending}
      className="gap-2 text-muted-foreground hover:text-destructive"
    >
      <SignOut className="size-4" aria-hidden="true" />
      {isPending ? "Signing out…" : "Sign out"}
    </Button>
  )
}

export { LogoutButton }
