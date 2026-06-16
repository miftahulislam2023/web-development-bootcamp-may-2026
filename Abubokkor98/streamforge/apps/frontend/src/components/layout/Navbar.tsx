import Link from "next/link"
import Image from "next/image"
import { LogoutButton } from "@/components/shared/logout-button"

function Navbar() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-sidebar-border bg-sidebar px-4 lg:px-6">
      <Link
        href="/"
        className="flex items-center gap-2 text-lg font-bold tracking-tight text-sidebar-primary"
      >
        <Image 
          src="/logo.png" 
          alt="StreamForge Logo" 
          width={28} 
          height={28} 
          className="rounded-md"
        />
        StreamForge
      </Link>

      <LogoutButton />
    </header>
  )
}

export { Navbar }
