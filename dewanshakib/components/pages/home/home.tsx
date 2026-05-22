import Hero from "./hero";
import Features from "./features";
import Testimonials from "./testimonials";
import FAQ from "./faq";
import CTA from "./cta";
import Footer from "./footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Hero />
        <Features />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
    </div>
  );
}
