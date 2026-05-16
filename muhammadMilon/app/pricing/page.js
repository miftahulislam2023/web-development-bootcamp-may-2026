import { LandingHeader } from "@/components/landing/LandingHeader";
import { PricingSection } from "@/components/landing/PricingSection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "Pricing | Nexora Studio",
  description: "Affordable plans for every project. Choose the right plan for your business.",
};

export default async function PricingPage() {
  const session = await auth();
  return (
    <div className="relative min-h-screen">
      <LandingHeader session={session} />
      <main className="pt-20">
        <PricingSection />
      </main>
      <LandingFooter />
    </div>
  );
}
