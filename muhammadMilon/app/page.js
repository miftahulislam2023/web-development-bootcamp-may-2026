import { auth } from "@/lib/auth";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { ComponentsSection } from "@/components/landing/ComponentsSection";
import { TemplatesSection } from "@/components/landing/TemplatesSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { TechStackSection } from "@/components/landing/TechStackSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { CtaBannerSection } from "@/components/landing/CtaBannerSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const metadata = {
  title: "Nexora Studio – Professional Visual Website Builder",
  description:
    "Build stunning, responsive websites in minutes with professional drag-and-drop tools. No coding required. Start free today.",
};

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="relative min-h-screen">
      {/* ── Header ── */}
      <LandingHeader session={session} />

      <main>
        {/* 1. Hero */}
        <HeroSection session={session} />

        {/* 2. Features */}
        <FeaturesSection />

        {/* 3. How It Works */}
        <HowItWorksSection />

        {/* 4. Component Library */}
        <ComponentsSection />

        {/* 6. Templates */}
        <TemplatesSection />

        {/* 7. Testimonials */}
        <TestimonialsSection />

        {/* 8. Pricing */}
        <PricingSection />

        {/* 9. Tech Stack */}
        <TechStackSection />

        {/* 10. FAQ */}
        <FaqSection />

        {/* CTA Banner */}
        <CtaBannerSection />
      </main>

      {/* ── Footer ── */}
      <LandingFooter />
    </div>
  );
}
