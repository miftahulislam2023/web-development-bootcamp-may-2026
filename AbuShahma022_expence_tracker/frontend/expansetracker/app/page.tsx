
import About from "@/components/faqs";
import Features from "@/components/features-1";
import FooterSection from "@/components/footer";
import HeroSection from "@/components/hero-section-one";
import Pricing from "@/components/pricing"
import StatsSection from "@/components/stats-two";

export default function Homepage() {
  return (
    <div>
     <HeroSection/>
      <section id="features">
        <StatsSection />
      </section>

      <section id="pricing">
        <Pricing />
      </section>

    
     <section id="features">
         <Features/>

      </section>

       <section id="about">
         <About/>

      </section>

      <FooterSection/>

     
    </div>
  )
}
