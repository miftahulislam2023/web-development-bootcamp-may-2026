import Link from "next/link"
import Image from "next/image"
import { HomeNavbarActions } from "@/components/views/home/HomeNavbarActions"
import { MobileHomeNavbar } from "@/components/views/home/MobileHomeNavbar"

function HomeNavbar() {
  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between border-b border-border/40 bg-background/80 px-6 py-4 backdrop-blur-xl md:px-8"
      aria-label="Main navigation"
    >
      <Link
        href="/"
        className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-primary"
      >
        <Image 
          src="/logo.png" 
          alt="StreamForge Logo" 
          width={32} 
          height={32} 
          className="rounded-lg"
        />
        StreamForge
      </Link>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex md:items-center md:gap-3">
          <HomeNavbarActions />
        </div>
        <MobileHomeNavbar />
      </div>
    </nav>
  )
}

export { HomeNavbar }
