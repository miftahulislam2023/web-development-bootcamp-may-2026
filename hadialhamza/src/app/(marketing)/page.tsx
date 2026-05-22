import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import AnalyticsPreview from "@/components/landing/AnalyticsPreview";
import CTA from "@/components/landing/CTA";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Hero />
      <Features />
      <AnalyticsPreview />
      <CTA />
    </main>
  );
}
