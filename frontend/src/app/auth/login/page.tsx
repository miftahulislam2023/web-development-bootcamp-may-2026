// src/app/auth/login/page.tsx
"use client";

import { useForm } from "react-hook-form";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [generalError, setGeneralError] = useState("");

const onSubmit = async (data: any) => {
  try {
    setGeneralError("");

    await login(data.email, data.password);

    router.push("/dashboard"); // redirect after success
    console.log(data);
  } catch (error: any) {
    setGeneralError(
      error.response?.data?.message || "Login failed"
    );
  }
};

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">FinanceApp</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {generalError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {generalError}
            </div>
          )}

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              placeholder="you@example.com"
              {...register("email", { required: "Email is required" })}
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register("password", { required: "Password is required" })}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>

          <div className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              className="text-primary hover:underline"
            >
              Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
