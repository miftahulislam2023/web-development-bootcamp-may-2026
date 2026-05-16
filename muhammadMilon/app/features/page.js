import { LandingHeader } from "@/components/landing/LandingHeader";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "Features | Nexora Studio",
  description: "Explore the powerful features of Nexora Studio visual website builder.",
};

export default async function FeaturesPage() {
  const session = await auth();
  return (
    <div className="relative min-h-screen">
      <LandingHeader session={session} />
      <main className="pt-20">
        <FeaturesSection />
      </main>
      <LandingFooter />
    </div>
  );
}
