import { LandingHeader } from "@/components/landing/LandingHeader";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "How It Works | Nexora Studio",
  description: "Learn how to build stunning websites with Nexora Studio in three simple steps.",
};

export default async function HowItWorksPage() {
  const session = await auth();
  return (
    <div className="relative min-h-screen">
      <LandingHeader session={session} />
      <main className="pt-20">
        <HowItWorksSection />
      </main>
      <LandingFooter />
    </div>
  );
}
