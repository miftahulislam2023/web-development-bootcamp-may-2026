import { Suspense } from "react";
import { Header } from "@/components/header";
import { AuthCard } from "@/components/auth/auth-card";

export const metadata = {
  title: "Auth — Fylestash",
  description: "Sign in or create a Fylestash account.",
};

function AuthPageContent() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="flex items-center justify-center pt-24">
        <div className="w-full max-w-sm border border-zinc-800 p-8 rounded-xl">
          <AuthCard />
        </div>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="text-zinc-500">Loading...</div>}>
      <AuthPageContent />
    </Suspense>
  );
}
