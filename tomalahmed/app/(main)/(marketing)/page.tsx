import { FeaturesSection } from "@/components/features/home/features-section";
import { HeroSection } from "@/components/features/home/hero-section";
import { LifestyleSection } from "@/components/features/home/lifestyle-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <LifestyleSection />
    </>
  );
}
