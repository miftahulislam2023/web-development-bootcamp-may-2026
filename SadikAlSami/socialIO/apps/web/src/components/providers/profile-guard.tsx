"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useProfile } from "@/hooks/use-profile";

export function ProfileGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data, isLoading } = useProfile();

  useEffect(() => {
    if (!isLoading && data?.exists === false) {
      router.push("/profile/onboarding" as any);
    }
  }, [isLoading, data, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F9F9F8] dark:bg-[#1C1C1E]">
        <Loader2 className="h-8 w-8 animate-spin text-[#E07A5F]" />
      </div>
    );
  }

  // If exists is undefined but not loading, it means there was an error fetching the profile.
  // We'll still render nothing or maybe children, but generally data.exists is boolean.
  if (data?.exists === false) {
    return null; // Prevents flashing the dashboard before redirect
  }

  return <>{children}</>;
}
