'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, Wallet } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Something went wrong.');
      } else {
        toast.success(data.message || 'Reset link sent!');
        setIsSent(true);
      }
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setIsLoading(false);
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="text-4xl font-bold tracking-tight mb-4 text-[#f4f3ff]">Secure your account</h1>
            <p className="text-[#bfb4fe] text-lg">Don't worry, it happens to the best of us. Let's get you back into your account securely.</p>
          </motion.div>
        </div>
        <div className="relative z-10 text-[#bfb4fe]/60 text-sm">© 2026 ExpenseTracker Inc.</div>
      </div>

      <div className="flex items-center justify-center p-8 bg-background relative">
        <div className="w-full max-w-100 space-y-8">
          <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight">Forgot password?</h2>
            <p className="text-muted-foreground mt-2">Enter your email and we'll send you a reset link.</p>
          </div>

          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
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
              <Button className="w-full h-11 text-base font-medium transition-all active:scale-[0.98]" type="submit" disabled={isLoading}>
                {isLoading ? 'Sending Link...' : 'Send Reset Link'}
              </Button>
            </form>
          ) : (
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-center space-y-4">
              <Mail className="h-10 w-10 text-primary mx-auto" />
              <h3 className="font-semibold text-lg">Check your email</h3>
              <p className="text-sm text-muted-foreground">We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>. Click the link to reset your password.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
