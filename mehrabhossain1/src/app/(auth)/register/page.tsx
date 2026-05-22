import type { Metadata } from "next";
import Link from "next/link";

import { Card } from "@/components/ui/Card";

import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Create account",
};

export default function RegisterPage() {
  return (
    <Card className="w-full p-8">
      <h1 className="text-2xl font-bold tracking-tight text-fg">
        Create your account
      </h1>
      <p className="mt-1.5 text-sm text-fg-muted">
        Start building websites in minutes.
      </p>

      <RegisterForm />

      <p className="mt-6 text-center text-sm text-fg-muted">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:text-primary-hover"
        >
          Log in
        </Link>
      </p>
    </Card>
  );
}
