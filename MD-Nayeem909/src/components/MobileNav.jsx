'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ReceiptText, Wallet, Menu, LogIn, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSession, signIn, signOut } from 'next-auth/react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: ReceiptText },
];

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  // Close the sheet when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 sm:max-w-sm p-0 flex flex-col h-full">
          <div>
            <SheetHeader className="p-6 border-b text-left">
              <SheetTitle className="flex items-center gap-2 font-semibold text-lg tracking-tight">
                <Wallet className="h-6 w-6" />
                <span>Expense Tracker</span>
              </SheetTitle>
            </SheetHeader>
            <div className="py-6 px-4">
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        isActive 
                          ? 'bg-secondary text-secondary-foreground' 
                          : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="p-4 border-t mt-auto">
            {session ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium truncate max-w-30">{session.user?.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-30">{session.user?.email}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => signOut()}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button className="w-full gap-2" onClick={() => signIn()}>
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
