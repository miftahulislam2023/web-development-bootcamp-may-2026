import type { Metadata } from "next";
import Link from "next/link";

import { Card } from "@/components/ui/Card";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Log in",
};

export default function LoginPage() {
  return (
    <Card className="w-full p-8">
      <h1 className="text-2xl font-bold tracking-tight text-fg">
        Welcome back
      </h1>
      <p className="mt-1.5 text-sm text-fg-muted">
        Log in to continue building.
      </p>

      <LoginForm />

      <p className="mt-6 text-center text-sm text-fg-muted">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-primary hover:text-primary-hover"
        >
          Sign up
        </Link>
      </p>
    </Card>
  );
}
