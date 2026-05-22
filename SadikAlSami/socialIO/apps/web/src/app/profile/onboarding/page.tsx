"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import OnboardingForm from "@/components/onboarding-form";
import { useProfile } from "@/hooks/use-profile";

export default function OnboardingPage() {
  const router = useRouter();
  const { data, isLoading } = useProfile();

  useEffect(() => {
    if (!isLoading && data?.exists) {
      router.push("/chat");
    }
  }, [isLoading, data, router]);

  if (isLoading || data?.exists) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#F9F9F8] dark:bg-[#1C1C1E]">
        <Loader2 className="h-8 w-8 animate-spin text-[#E07A5F]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F9F9F8] dark:bg-[#1C1C1E] p-4 sm:p-8">
      <OnboardingForm />
    </div>
  );
}
