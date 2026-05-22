'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ReceiptText, Wallet, LogIn, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Transactions', href: '/transactions', icon: ReceiptText },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="hidden md:flex fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background flex-col justify-between"
    >
      <div>
        <div className="flex h-16 items-center px-6 border-b">
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg tracking-tight group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Wallet className="h-6 w-6 text-primary" />
            </motion.div>
            <span className="group-hover:text-primary transition-colors">Expense Tracker</span>
          </Link>
        </div>
        <div className="py-6 px-4">
          <nav className="space-y-2">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors overflow-hidden group',
                      isActive 
                        ? 'text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-background"
                        className="absolute inset-0 bg-primary rounded-md"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    {!isActive && (
                      <div className="absolute inset-0 bg-secondary/50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                    <item.icon className="h-4 w-4 relative z-10" />
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                </motion.div>
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
    </motion.aside>
  );
}
