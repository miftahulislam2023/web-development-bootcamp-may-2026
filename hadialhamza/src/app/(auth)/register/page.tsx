"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { customToast } from "@/components/ui/customToast";
import { ArrowLeft, Mail, ArrowRight, User, Loader2 } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import InputGroup from "@/components/ui/InputGroup";
import AuthSidebar from "@/components/auth/AuthSidebar";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        customToast.error(
          "Registration Failed",
          result.message || "Something went wrong",
        );
      } else {
        customToast.success(
          "Account Created",
          "Welcome to SpendSentry! Signing you in...",
        );

        // Auto-login after signup
        const loginResult = await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });

        if (loginResult?.error) {
          router.push("/login");
        } else {
          router.push("/dashboard");
          router.refresh();
        }
      }
    } catch {
      customToast.error(
        "Unexpected Error",
        "Please check your connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background overflow-hidden">
      <AuthSidebar
        title={
          <>
            Build your financial <span className="text-primary">freedom</span>{" "}
            today.
          </>
        }
        subtitle="Create your account in seconds and start taking control of your financial future with our powerful tracking tools."
      />

      {/* Right Side: Register Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-24 xl:px-32 relative overflow-y-auto scrollbar-hide">
        {/* Mobile Logo */}
        <div className="lg:hidden absolute top-8 left-8">
          <Logo hideTagline className="scale-90 origin-left" />
        </div>

        {/* Back Link */}
        <Link
          href="/"
          className="absolute top-8 right-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="max-w-md w-full mx-auto space-y-10 py-12 lg:py-0">
          <div className="space-y-2">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-black text-foreground tracking-tight"
            >
              Create account
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground font-medium"
            >
              Join SpendSentry and start tracking like a pro.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <InputGroup
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  icon={<User className="w-4 h-4" />}
                  {...register("name")}
                  error={errors.name?.message}
                  disabled={isLoading}
                />
                <InputGroup
                  label="Email address"
                  type="email"
                  placeholder="name@example.com"
                  icon={<Mail className="w-4 h-4" />}
                  {...register("email")}
                  error={errors.email?.message}
                  disabled={isLoading}
                />
                <InputGroup
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  error={errors.password?.message}
                  disabled={isLoading}
                  helperText="Must be at least 8 characters."
                />
                <InputGroup
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  error={errors.confirmPassword?.message}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 accent-primary h-4 w-4 rounded-lg border-border"
                  required
                />
                <label
                  htmlFor="terms"
                  className="text-xs text-muted-foreground font-medium leading-relaxed"
                >
                  I agree to the Terms of Services and Privacy Policy .
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full h-12 text-base shadow-lg shadow-primary/20"
                icon={
                  isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ArrowRight className="w-5 h-5" />
                  )
                }
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-sm text-muted-foreground font-medium"
          >
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-black hover:underline uppercase tracking-widest ml-1"
            >
              Sign in here
            </Link>
          </motion.p>
        </div>
      </div>
    </div>
  );
}
