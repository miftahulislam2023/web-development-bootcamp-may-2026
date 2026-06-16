"use client"

import { useState } from "react"
import { SquaresFour, ClockCounterClockwise, SidebarSimple } from "@phosphor-icons/react"
import { NavLink } from "@/components/shared/nav-link"
import { Button } from "@/components/ui/button"

interface NavItemConfig {
  label: string
  href: string
  icon: React.ReactNode
}

const NAV_ITEMS: NavItemConfig[] = [
  { label: "Dashboard", href: "/dashboard", icon: <SquaresFour className="size-4 shrink-0" aria-hidden="true" /> },
  // { label: "My Rooms", href: "/dashboard/rooms", icon: <List className="size-4 shrink-0" aria-hidden="true" /> },
  { label: "Stream History", href: "/dashboard/history", icon: <ClockCounterClockwise className="size-4 shrink-0" aria-hidden="true" /> },
]

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <aside className={`group relative hidden shrink-0 border-r border-sidebar-border bg-sidebar transition-[width] duration-300 ease-in-out lg:flex lg:flex-col ${isCollapsed ? "w-16" : "w-56"}`}>
      
      {/* Top Toggle Area */}
      <div className={`mt-2 flex h-10 items-center px-3 ${isCollapsed ? "justify-center" : "justify-end"}`}>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="size-8 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <SidebarSimple className="size-5" />
        </Button>
      </div>

      <nav aria-label="Dashboard navigation" className="mt-2 flex flex-col gap-1 p-3 flex-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>
    </aside>
  )
}

export { Sidebar }
