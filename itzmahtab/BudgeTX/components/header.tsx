'use client'

import { useState } from 'react'
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'
import { LayoutDashboard, Menu, PenBox, X } from 'lucide-react'
import { ModeToggle } from './mode-toggle'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className='fixed top-0 w-full bg-background/80 backdrop-blur-md z-50 border-b border-border'>
      <nav className='container mx-auto px-4 h-16 flex items-center justify-between'>
        <Link href='/' className='flex-shrink-0'>
          <Image src="/logo.svg" alt="BudgeTX" width={100} height={40} />
        </Link>

        <div className='hidden md:flex items-center gap-3'>
          <Show when="signed-out">
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <Button variant="ghost">Sign In</Button>
            </SignInButton>

            <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
              <Button>Sign Up</Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/transaction/create">
              <Button size="sm" className="gap-2">
                <PenBox className="h-4 w-4" />
                Add Transaction
              </Button>
            </Link>
            <ModeToggle />
            <UserButton />
          </Show>
        </div>

        <button 
          className='md:hidden p-2' 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className='md:hidden border-t border-border px-4 py-4 space-y-3 bg-background'>
          <Show when="signed-out">
            <div className='flex flex-col gap-2'>
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <Button variant="ghost" className="w-full justify-start">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                <Button className="w-full justify-start">Sign Up</Button>
              </SignUpButton>
            </div>
          </Show>
          <Show when="signed-in">
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
             <Link href="/transaction/create">
              <Button variant="ghost" size="sm" className="gap-2">
                <PenBox className="h-4 w-4" />
                Add Transaction
              </Button>
            </Link>
            <div className='pt-2 flex items-center gap-4'>
              <ModeToggle />
              <UserButton />
            </div>
          </Show>
        </div>
      )}
    </div>
  )
}

export default Header
