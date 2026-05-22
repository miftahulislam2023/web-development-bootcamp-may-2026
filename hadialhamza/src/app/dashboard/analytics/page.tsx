import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AnalyticsContent from "./AnalyticsContent";

// This is a Server Component
export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">
            Financial Analytics
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            Deep dive into your spending habits and smart insights.
          </p>
        </div>

        <div />
      </div>

      <AnalyticsContent />
    </div>
  );
}
