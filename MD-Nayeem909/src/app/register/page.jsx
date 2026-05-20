'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet, Mail, KeyRound, User, UserPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { registerUser } from '@/actions/auth';
import Link from 'next/link';

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name cannot exceed 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      const result = await registerUser(data);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Account created successfully! Please sign in.');
        router.push('/login');
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
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl hover:opacity-80 transition-opacity">
            <Wallet className="h-8 w-8 text-primary-foreground" />
            <span>ExpenseTracker</span>
          </Link>
        </div>
        
        <div className="relative z-10 space-y-6 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold tracking-tight mb-4 text-[#f4f3ff]">
              Start your journey to financial freedom.
            </h1>
            <p className="text-[#bfb4fe] text-lg">
              Create an account today and take the first step towards better money management and achieving your goals.
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
              <div className="w-8 h-8 rounded-full bg-[#2e1176] border-2 border-[#130c2c] flex items-center justify-center">💎</div>
              <div className="w-8 h-8 rounded-full bg-[#2e1176] border-2 border-[#130c2c] flex items-center justify-center">🏦</div>
            </div>
            Join thousands of smart savers
          </motion.div>
        </div>
        <div className="relative z-10 text-[#bfb4fe]/60 text-sm">
          © 2026 ExpenseTracker Inc.
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="flex items-center justify-center p-8 bg-background relative overflow-y-auto">
        <div className="w-full max-w-100 space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6">
              <div className="bg-primary/10 p-3 rounded-2xl">
                <Wallet className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Create an account</h2>
            <p className="text-muted-foreground mt-2">
              Enter your details below to create your account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className={`pl-10 h-11 ${errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  {...register('name')}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-destructive font-medium">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className={`pl-10 h-11 ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive font-medium">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className={`pl-10 h-11 ${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  {...register('password')}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive font-medium">{errors.password.message}</p>
              )}
            </div>

            <Button className="w-full h-11 text-base font-medium transition-all active:scale-[0.98] mt-2" type="submit" disabled={isLoading}>
              {isLoading ? (
                'Creating account...'
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" />
                  Sign Up
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground pt-4 border-t">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
