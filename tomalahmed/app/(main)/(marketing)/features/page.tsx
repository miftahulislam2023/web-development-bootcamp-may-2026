import type { Metadata } from "next";

import { FeaturesPage } from "@/components/features/page";

export const metadata: Metadata = {
  title: "Features — Crimson Connect",
  description: "Discover the tools that make Crimson Connect the leader in secure communication.",
};

export default function FeaturesRoutePage() {
  return (
    <div className="pb-16">
      <FeaturesPage />
    </div>
  );
}
