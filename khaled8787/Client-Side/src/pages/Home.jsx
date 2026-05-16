import CTA from "../components/CTA";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Stats from "../components/Stats";

export default function Home() {
  return (
    <div>

      <Hero />

      <Stats></Stats>
      <HowItWorks></HowItWorks>
      <CTA></CTA>
    </div>
  );
}