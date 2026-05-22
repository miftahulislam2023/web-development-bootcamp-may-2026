import { LandingHeader } from "@/components/landing/LandingHeader";
import { FaqSection } from "@/components/landing/FaqSection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "FAQ | Nexora Studio",
  description: "Frequently asked questions about Nexora Studio website builder.",
};

export default async function FaqPage() {
  const session = await auth();
  return (
    <div className="relative min-h-screen">
      <LandingHeader session={session} />
      <main className="pt-20">
        <FaqSection />
      </main>
      <LandingFooter />
    </div>
  );
}
