'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, Mail, KeyRound, ArrowRight, Sparkles, UserCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error('Invalid credentials. Please try again.');
      } else {
        toast.success('Welcome back!');
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsGuest = async () => {
    setIsGuestLoading(true);
    try {
      const res = await signIn('credentials', {
        email: 'guest@expensetracker.app',
        password: 'guestlogin',
        redirect: false,
      });

      if (res?.error) {
        toast.error('Guest login failed.');
      } else {
        toast.success('Logged in as Guest!');
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setIsGuestLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 relative">
      <div className="hidden lg:flex flex-col justify-between bg-[#130c2c] p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-1/4 -right-1/4 w-200 h-200 bg-primary/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -left-1/4 w-150 h-150 bg-primary/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 font-bold text-2xl">
            <Wallet className="h-8 w-8 text-primary-foreground" />
            <span>ExpenseTracker</span>
          </div>
        </div>
        
        <div className="relative z-10 space-y-6 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold tracking-tight mb-4 text-[#f4f3ff]">
              Take control of your finances, beautifully.
            </h1>
            <p className="text-[#bfb4fe] text-lg">
              Track your daily expenses, monitor your income, and achieve your financial goals with our intuitive dashboard.
            </p>
          </motion.div>
          <motion.div 
            className="flex items-center gap-4 text-sm font-medium text-[#dad5ff]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#2e1176] border-2 border-[#130c2c] flex items-center justify-center">🚀</div>
              <div className="w-8 h-8 rounded-full bg-[#2e1176] border-2 border-[#130c2c] flex items-center justify-center">💰</div>
              <div className="w-8 h-8 rounded-full bg-[#2e1176] border-2 border-[#130c2c] flex items-center justify-center">📈</div>
            </div>
            Join thousands of smart savers
          </motion.div>
        </div>
        <div className="relative z-10 text-[#bfb4fe]/60 text-sm">
          © 2026 ExpenseTracker Inc.
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex items-center justify-center p-8 bg-background relative">
        <div className="w-full max-w-100 space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6">
              <div className="bg-primary/10 p-3 rounded-2xl">
                <Wallet className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground mt-2">
              Enter your credentials to access your account
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-12 border-muted hover:bg-muted/50 transition-colors" onClick={() => signIn('github', { callbackUrl: '/' })}>
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </Button>
            <Button variant="outline" className="h-12 border-muted hover:bg-muted/50 transition-colors" onClick={() => signIn('google', { callbackUrl: '/' })}>
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground font-medium">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleCredentialsLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10 h-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button className="w-full h-11 text-base font-medium transition-all active:scale-[0.98]" type="submit" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="bg-muted/30 rounded-2xl p-5 border border-muted/50 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="bg-primary/20 p-2 rounded-full mt-0.5">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-1">Exploring the app?</h4>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  You can use the guest access to explore all premium features of the Expense Tracker instantly.
                </p>
                <Button 
                  type="button"
                  variant="secondary" 
                  size="sm"
                  className="w-full font-medium shadow-sm hover:shadow transition-all" 
                  onClick={loginAsGuest}
                  disabled={isGuestLoading}
                >
                  <UserCircle2 className="mr-2 h-4 w-4" />
                  {isGuestLoading ? 'Connecting...' : 'Continue as Guest'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account? <Link href="/register" className="text-primary font-medium cursor-pointer hover:underline">Sign up for free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
