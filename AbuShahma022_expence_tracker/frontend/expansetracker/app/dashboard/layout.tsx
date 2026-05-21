"use client"

import { useEffect } from "react"

import { useRouter }
from "next/navigation"

import Sidebar
from "@/components/dashboard/sidebar"

import {
  useAppSelector,
} from "@/lib/hook"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const router =
    useRouter()

  const {
    user,
    loading,
  } = useAppSelector(
    (state) => state.auth
  )

  useEffect(() => {

    if (
      !loading &&
      !user
    ) {
      router.push("/login")
    }

  }, [
    user,
    loading,
    router,
  ])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">

        Loading...

      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-background lg:flex">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="min-w-0 flex-1 p-4 sm:p-6">

        {children}

      </main>
    </div>
  )
}