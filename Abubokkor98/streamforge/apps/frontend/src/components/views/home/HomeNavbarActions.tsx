"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/auth-store"
import { LogoutButton } from "@/components/shared/logout-button"

function HomeNavbarActions() {
  const user = useAuthStore((state) => state.user)

  if (user) {
    return (
      <>
        <Button size="sm" asChild>
          <Link href="/dashboard">Dashboard</Link>
        </Button>
        <LogoutButton />
      </>
    )
  }

  return (
    <>
      <Button variant="ghost" size="sm" asChild>
        <Link href="/login">Sign In</Link>
      </Button>
      <Button size="sm" asChild>
        <Link href="/register">Get Started</Link>
      </Button>
    </>
  )
}

export { HomeNavbarActions }
