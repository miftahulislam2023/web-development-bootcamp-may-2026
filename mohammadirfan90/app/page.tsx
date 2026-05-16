"use client";

import { ChatProvider } from "@/providers/chat-provider";
import { ChatLayout } from "@/components/chat/chat-layout";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-text-muted">Loading DevConnect...</p>
        </div>
      </div>
    );
  }

  return (
    <ChatProvider>
      <ChatLayout />
    </ChatProvider>
  );
}
