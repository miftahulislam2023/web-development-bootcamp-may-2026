"use client"

import Link from "next/link"

import {
  LayoutDashboard,
  Wallet,
  PiggyBank,
  Settings,
  LogOut,
} from "lucide-react"

import { useState } from "react"

import { useRouter }
from "next/navigation"

import { toast }
from "sonner"

import { Logo }
from "@/components/logo"

import { ThemeToggleButton }
from "../ThemeToggleButton"

import BudgetDialog
from "./budget-dialog"

import {
  logout,
} from "@/lib/features/auth/authSlice"

import {
  useAppDispatch,
} from "@/lib/hook"

import {
  logoutApi,
} from "@/services/auth.api"

const links = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Expenses",
    href: "/dashboard/expenses",
    icon: Wallet,
  },
  {
    name: "Budget",
    href: "/dashboard/budget",
    icon: PiggyBank,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export default function Sidebar() {

  const dispatch =
    useAppDispatch()

  const router =
    useRouter()

  const [openBudget,
    setOpenBudget] =
    useState(false)

  const [openMobile,
    setOpenMobile] =
    useState(false)

  const handleLogout =
    async () => {

      try {

        await logoutApi()

        dispatch(logout())

        toast.success(
          "Logged out successfully"
        )

        router.push("/")

      } catch (error) {

        console.log(error)

        toast.error(
          "Logout failed"
        )
      }
    }

  const renderLinks = () => (
    <nav className="space-y-2">

      {links.map((link) => {

        const Icon =
          link.icon

        // Budget Button
        if (
          link.name ===
          "Budget"
        ) {
          return (
            <button
              key={link.name}
              onClick={() => {

                setOpenBudget(
                  true
                )

                setOpenMobile(
                  false
                )
              }}
              className="group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground cursor-pointer">

              <div className="rounded-lg bg-muted p-2 transition group-hover:bg-background">

                <Icon className="size-4" />

              </div>

              {link.name}
            </button>
          )
        }

        // Normal Links
        return (
          <Link
            key={link.name}
            href={link.href}
            onClick={() =>
              setOpenMobile(
                false
              )
            }
            className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground">

            <div className="rounded-lg bg-muted p-2 transition group-hover:bg-background">

              <Icon className="size-4" />

            </div>

            {link.name}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Mobile Topbar */}
      <div className="bg-card flex items-center justify-between border-b p-4 lg:hidden">

        <Logo />

        <button
          onClick={() =>
            setOpenMobile(
              !openMobile
            )
          }
          className="rounded-xl border p-2">

          ☰

        </button>
      </div>

      {/* Mobile Sidebar */}
      {openMobile && (

        <div className="bg-card fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r p-5 shadow-xl lg:hidden">

          {/* Top */}
          <div>

            {/* Logo */}
            <div className="mb-10 px-2">

              <Logo />

            </div>

            {/* Navigation */}
            {renderLinks()}
          </div>

          {/* Bottom */}
          <div className="space-y-3">

            <div className="px-2">

              <ThemeToggleButton />

            </div>

            <button
              onClick={
                handleLogout
              }
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive cursor-pointer">

              <div className="rounded-lg bg-muted p-2">

                <LogOut className="size-4" />

              </div>

              Logout
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="bg-card hidden min-h-screen w-72 flex-col justify-between border-r p-5 lg:flex">

        {/* Top */}
        <div>

          {/* Logo */}
          <div className="mb-10 px-2">

            <Logo />

          </div>

          {/* Navigation */}
          {renderLinks()}
        </div>

        {/* Bottom */}
        <div className="space-y-3">

          <div className="px-2">

            <ThemeToggleButton />

          </div>

          <button
            onClick={
              handleLogout
            }
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive cursor-pointer">

            <div className="rounded-lg bg-muted p-2">

              <LogOut className="size-4" />

            </div>

            Logout
          </button>
        </div>
      </aside>

      {/* Budget Dialog */}
      <BudgetDialog
        open={openBudget}
        setOpen={
          setOpenBudget
        }
      />
    </>
  )
}