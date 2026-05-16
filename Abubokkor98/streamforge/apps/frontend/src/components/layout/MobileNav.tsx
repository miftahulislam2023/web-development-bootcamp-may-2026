import { SquaresFour, List, ClockCounterClockwise } from "@phosphor-icons/react/dist/ssr"
import { NavLink } from "@/components/shared/nav-link"

interface MobileNavItemConfig {
  label: string
  href: string
  icon: React.ReactNode
}

const MOBILE_NAV_ITEMS: MobileNavItemConfig[] = [
  { label: "Dashboard", href: "/dashboard", icon: <SquaresFour className="size-5" aria-hidden="true" /> },
  { label: "Rooms", href: "/dashboard/rooms", icon: <List className="size-5" aria-hidden="true" /> },
  { label: "History", href: "/dashboard/history", icon: <ClockCounterClockwise className="size-5" aria-hidden="true" /> },
]

/**
 * Bottom navigation bar for mobile — visible only below lg breakpoint.
 * Replaces the sidebar on small screens.
 */
function MobileNav() {
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 flex h-14 items-center justify-around border-t border-sidebar-border bg-sidebar lg:hidden"
    >
      {MOBILE_NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          label={item.label}
          icon={item.icon}
          variant="mobile"
        />
      ))}
    </nav>
  )
}

export { MobileNav }
