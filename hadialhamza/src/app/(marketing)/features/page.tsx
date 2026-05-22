import { Metadata } from "next";
import FeaturesContent from "@/components/landing/features/FeaturesContent";

export const metadata: Metadata = {
  title: "Features",
};

export default function FeaturesPage() {
  return (
    <main className="pt-32 pb-20">
      <FeaturesContent />
    </main>
  );
}
