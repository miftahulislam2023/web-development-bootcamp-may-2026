import { Metadata } from "next";
import AnalyticsPublicContent from "@/components/landing/analytics/AnalyticsContent";

export const metadata: Metadata = {
  title: "Analytics",
};

export default function AnalyticsPublicPage() {
  return (
    <main className="pt-32 pb-20">
      <AnalyticsPublicContent />
    </main>
  );
}
