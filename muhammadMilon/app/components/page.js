import { LandingHeader } from "@/components/landing/LandingHeader";
import { ComponentsSection } from "@/components/landing/ComponentsSection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "Components | Nexora Studio",
  description: "Browse our library of professional, responsive components for your website.",
};

export default async function ComponentsPage() {
  const session = await auth();
  return (
    <div className="relative min-h-screen">
      <LandingHeader session={session} />
      <main className="pt-20">
        <ComponentsSection />
      </main>
      <LandingFooter />
    </div>
  );
}
