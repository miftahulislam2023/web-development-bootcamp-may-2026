"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [buttonLoading, setButtonLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const {
    register,
    handleSubmit,
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (
    data: LoginFormData
  ) => {
    // Required field validation
    if (
      !data.email ||
      !data.password
    ) {
      toast.error(
        "Please fill all required fields"
      );
      return;
    }

    try {
      setButtonLoading(true);

      // Login API
      const res =
        await login(
          data.email,
          data.password
        );

      // Success message
      toast.success(
        res?.message ||
          "Login successful 🎉"
      );

      // Redirect
      setTimeout(() => {
        router.push(
          "/dashboard"
        );
      }, 1000);
    } catch (error: any) {
      // Backend message
      const backendMessage =
        error?.response?.data
          ?.error?.message;

      toast.error(
        backendMessage ||
          "Login failed"
      );
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          FinanceApp
        </CardTitle>

        <CardDescription>
          Sign in to your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(
            onSubmit
          )}
          className="space-y-4"
        >
          {/* Email */}
          <div className="space-y-2">
            <Label>Email</Label>

            <Input
              type="email"
              placeholder="you@example.com"
              {...register(
                "email"
              )}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label>
              Password
            </Label>

            <div className="relative">
              <Input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="••••••••"
                className="pr-12"
                {...register(
                  "password"
                )}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff
                    size={18}
                  />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={
              buttonLoading
            }
          >
            {buttonLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Signing in...
              </div>
            ) : (
              "Sign in"
            )}
          </Button>

          {/* Register Link */}
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an
            account?{" "}
            <Link
              href="/auth/register"
              className="text-primary underline"
            >
              Sign up
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}