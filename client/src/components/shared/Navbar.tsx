'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { disconnectSocket } from '@/lib/socket';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/theme-toggle';

function getInitials(username: string) {
  return username.slice(0, 2).toUpperCase();
}

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    disconnectSocket();
    toast.success('Logged out');
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-50 flex h-[60px] items-center justify-between border-b border-border/40 bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Link href="/chat" className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-base shadow-[0_4px_12px_rgba(99,102,241,0.3)]">
          💬
        </div>
        <span className="text-[17px] font-extrabold tracking-tight">
          Chat<span className="bg-gradient-to-br from-indigo-500 to-purple-500 bg-clip-text text-transparent">Sphere</span>
        </span>
      </Link>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        {user && (
          <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 outline-none rounded-full ring-offset-background transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:opacity-90">
            <div className="relative">
              <Avatar className="h-9 w-9 bg-gradient-to-br from-indigo-500 to-purple-500 text-xs font-bold text-white shadow-sm border border-border/50">
                {user.avatar ? (
                  <AvatarImage
                    src={user.avatar.startsWith('http') ? user.avatar : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace('/api', '')}${user.avatar}`}
                    alt={user.username}
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback className="bg-transparent text-white">
                  {getInitials(user.username)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500" />
            </div>
            <span className="hidden text-sm font-semibold sm:inline-block">{user.name}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl dark:border-border/50 dark:bg-black/60 bg-white/60 p-4 backdrop-blur-sm">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-2">
                  <p className="text-sm font-medium leading-none">{user.username}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem className="cursor-pointer font-medium text-red-400 focus:bg-red-500/10 focus:text-red-500 rounded-lg" onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      </div>
    </nav>
  );
}
