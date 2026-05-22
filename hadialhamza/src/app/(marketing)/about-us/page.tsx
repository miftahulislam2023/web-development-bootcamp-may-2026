import { Metadata } from "next";
import AboutContent from "@/components/landing/about/AboutContent";

export const metadata: Metadata = {
  title: "About Us",
};

export default function AboutUsPage() {
  return (
    <main className="pt-32 pb-20">
      <AboutContent />
    </main>
  );
}
