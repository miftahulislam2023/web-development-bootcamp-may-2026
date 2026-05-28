'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, ArrowLeft, Wallet, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Invalid or missing reset token.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Something went wrong.');
      } else {
        toast.success(data.message || 'Password reset successfully!');
        setIsSuccess(true);
      }
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-100 space-y-8 z-10">
      {!isSuccess && (
        <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Link>
      )}
      
      <div className="text-center lg:text-left">
        <h2 className="text-3xl font-bold tracking-tight">Set new password</h2>
        <p className="text-muted-foreground mt-2">Create a new, strong password for your account.</p>
      </div>

      {!isSuccess ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
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
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="pl-10 h-11"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <Button className="w-full h-11 text-base font-medium transition-all active:scale-[0.98]" type="submit" disabled={isLoading}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      ) : (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center space-y-4">
          <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
          <h3 className="font-semibold text-lg">Password Reset Successfully</h3>
          <p className="text-sm text-muted-foreground">Your password has been changed. You can now log in with your new credentials.</p>
          <Button className="w-full mt-4" onClick={() => router.push('/login')}>
            Go to Login
          </Button>
        </div>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="text-4xl font-bold tracking-tight mb-4 text-[#f4f3ff]">Almost there</h1>
            <p className="text-[#bfb4fe] text-lg">Choose a strong password and get back to managing your finances.</p>
          </motion.div>
        </div>
        <div className="relative z-10 text-[#bfb4fe]/60 text-sm">© 2026 ExpenseTracker Inc.</div>
      </div>

      <div className="flex items-center justify-center p-8 bg-background relative">
        <Suspense fallback={<div className="animate-pulse flex items-center gap-2">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
