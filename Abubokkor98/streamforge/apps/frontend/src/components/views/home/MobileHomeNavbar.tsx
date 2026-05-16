"use client"

import { List, X, SquaresFour, SignIn, UserPlus } from "@phosphor-icons/react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useAuthStore } from "@/lib/auth-store"
import { LogoutButton } from "@/components/shared/logout-button"
import { useState } from "react"

function MobileHomeNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const user = useAuthStore((state) => state.user)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden relative group overflow-hidden bg-secondary/30 hover:bg-secondary/50 border border-border/40 transition-all duration-300" 
          aria-label="Open menu"
        >
          <List size={20} weight="bold" className="text-primary transition-transform group-hover:scale-110" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        side="right" 
        showCloseButton={false}
        className="flex flex-col w-[85vw] sm:max-w-sm border-l border-primary/20 bg-background/95 backdrop-blur-2xl p-0 overflow-hidden"
      >
        {/* Animated Background Decoration */}
        <div className="absolute top-[-10%] right-[-10%] size-48 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] size-48 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />

        <SheetHeader className="p-4 border-b border-border/40 relative z-10 space-y-0">
          <div className="flex items-center justify-between gap-4">
            <SheetTitle className="flex items-center gap-2 text-base font-black tracking-tight text-primary uppercase truncate">
              <Image 
                src="/logo.png" 
                alt="StreamForge Logo" 
                width={24} 
                height={24} 
                className="rounded-md shadow-md shadow-primary/10"
              />
              StreamForge
            </SheetTitle>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="size-8 rounded-full hover:bg-primary/10 hover:text-primary shrink-0" aria-label="Close menu">
                <X size={18} weight="bold" aria-hidden="true" />
              </Button>
            </SheetClose>
          </div>
        </SheetHeader>

        <nav className="flex-1 px-4 py-6 relative z-10 flex flex-col gap-5 overflow-y-auto">
          {user ? (
            <div className="flex flex-col gap-1">
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-2">Account</p>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="group flex items-center gap-4 py-3 px-2 rounded-lg transition-all duration-300 hover:bg-primary/5 active:scale-[0.98] animate-fade-in-up"
              >
                <SquaresFour size={22} weight="duotone" className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" aria-hidden="true" />
                <span className="text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors truncate">Dashboard</span>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-2">Join the Forge</p>
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="group flex items-center gap-4 py-3 px-2 rounded-lg transition-all duration-300 hover:bg-primary/5 active:scale-[0.98] animate-fade-in-up"
              >
                <SignIn size={22} weight="duotone" className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" aria-hidden="true" />
                <span className="text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors truncate">Sign In</span>
              </Link>

              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="group flex items-center gap-4 py-3 px-2 rounded-lg transition-all duration-300 hover:bg-primary/5 active:scale-[0.98] animate-fade-in-up"
                style={{ animationDelay: "100ms" }}
              >
                <UserPlus size={22} weight="duotone" className="text-primary transition-colors shrink-0" aria-hidden="true" />
                <span className="text-base font-bold tracking-tight text-primary transition-colors truncate">Get Started</span>
              </Link>
            </div>
          )}
        </nav>

        <footer className="p-4 border-t border-border/40 relative z-10 bg-background/50 backdrop-blur-md mt-auto">
          {user ? (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-9 shrink-0 rounded-full bg-linear-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground text-xs font-black shadow-inner">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold truncate leading-tight">{user.name}</span>
                  <span className="text-[9px] text-muted-foreground truncate leading-tight">{user.email}</span>
                </div>
              </div>
              <LogoutButton />
            </div>
          ) : (
            <div className="flex flex-col gap-1 text-center">
              <p className="text-[9px] text-muted-foreground uppercase tracking-[0.3em] font-bold">StreamForge v1.0</p>
            </div>
          )}
        </footer>
      </SheetContent>
    </Sheet>
  )
}

export { MobileHomeNavbar }
