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
import { ArrowLeft, Mail, ArrowRight, Loader2 } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import InputGroup from "@/components/ui/InputGroup";
import AuthSidebar from "@/components/auth/AuthSidebar";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        customToast.error("Authentication Failed", result.error);
      } else {
        customToast.success(
          "Welcome back!",
          "Redirecting you to the dashboard...",
        );
        router.push("/dashboard");
        router.refresh();
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
      <AuthSidebar />

      {/* Right Side: Login Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-24 xl:px-32 relative">
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

        <div className="max-w-md w-full mx-auto space-y-10">
          <div className="space-y-2">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-black text-foreground tracking-tight"
            >
              Welcome back
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground font-medium"
            >
              Please enter your details to sign in to your account.
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
                  label="Email address"
                  type="email"
                  placeholder="name@example.com"
                  icon={<Mail className="w-4 h-4" />}
                  {...register("email")}
                  error={errors.email?.message}
                  disabled={isLoading}
                />
                <div className="space-y-2">
                  <InputGroup
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                    error={errors.password?.message}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full h-12 text-base shadow-md shadow-primary/20 mt-2"
                icon={
                  isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ArrowRight className="w-5 h-5" />
                  )
                }
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-sm text-muted-foreground font-medium"
          >
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-primary font-black hover:underline uppercase tracking-widest ml-1"
            >
              Sign up for free
            </Link>
          </motion.p>
        </div>
      </div>
    </div>
  );
}
