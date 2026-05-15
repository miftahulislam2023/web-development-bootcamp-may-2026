"use client"

import Link from "next/link"

import {
  LayoutDashboard,
  Wallet,
  PiggyBank,
  Tags,
  Settings,
  LogOut,
} from "lucide-react"

import { Logo } from "@/components/logo"

import { ThemeToggleButton } from "../ThemeToggleButton"
import BudgetDialog from "./budget-dialog"
import { useState } from "react"
import { useRouter }
from "next/navigation"

import { toast }
from "sonner"

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



  const [openBudget,
  setOpenBudget] =
  useState(false)
  return (
    <>
    <aside className="bg-card flex min-h-screen w-72 flex-col justify-between border-r p-5">

      {/* Top */}
      <div>

        {/* Logo */}
        <div className="mb-10 px-2">

          <Logo />

          
        </div>

        {/* Navigation */}
        <nav className="space-y-2">

         {links.map((link) => {
  const Icon = link.icon

  // Budget Button
  if (link.name === "Budget") {
    return (
      <button
        key={link.name}
        onClick={() =>
          setOpenBudget(true)
        }
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
      className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground">

      <div className="rounded-lg bg-muted p-2 transition group-hover:bg-background">

        <Icon className="size-4" />

      </div>

      {link.name}
    </Link>
  )
})}
        </nav>
      </div>

      {/* Bottom */}
      <div className="space-y-3">

        <div className="px-2 c">
          <ThemeToggleButton  />
        </div>

        <button 
          onClick={handleLogout}
        
        className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive cursor-pointer">

          <div className="rounded-lg bg-muted p-2">

            <LogOut className="size-4" />

          </div>

          Logout
        </button>
      </div>
    </aside>
    <BudgetDialog
        open={openBudget}
        setOpen={setOpenBudget}
      />
    </>
    
  )
}