"use client";

import Link from "next/link";
import { AuthHero } from "@/components/auth/auth-hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setIsSubmitting(true);
    
    try {
      await login(email, password);
    } catch (err: any) {
      setLocalError(err.message || "Login failed");
      setIsSubmitting(false);
    }
  };

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side: Brand/Hero */}
      <AuthHero />

      {/* Right Side: Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-surface">
        <div className="w-full max-w-[400px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
              <MessageSquare size={24} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold text-text-primary tracking-tight">
              DevConnect
            </span>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
              Welcome back
            </h2>
            <p className="text-text-secondary">
              Sign in to your account to continue chatting.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {localError && (
              <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-md border border-red-500/20">
                {localError}
              </div>
            )}
            
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="text-sm font-semibold text-text-primary ml-1"
              >
                Email Address
              </label>
              <Input 
                id="email"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="h-12 bg-muted-surface border-border focus:ring-primary/20"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label 
                  htmlFor="password" 
                  className="text-sm font-semibold text-text-primary"
                >
                  Password
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs font-medium text-primary hover:underline underline-offset-4"
                >
                  Forgot password?
                </Link>
              </div>
              <Input 
                id="password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12 bg-muted-surface border-border focus:ring-primary/20"
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-12 text-base font-bold bg-primary hover:bg-primary-hover text-white transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>



          <p className="text-center text-sm text-text-secondary">
            Don't have an account?{" "}
            <Link 
              href="/register" 
              className="font-bold text-primary hover:underline underline-offset-4"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
