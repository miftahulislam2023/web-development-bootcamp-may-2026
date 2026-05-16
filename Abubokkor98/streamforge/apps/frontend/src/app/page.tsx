import type { Metadata } from "next"
import { Suspense } from "react"
import { HomeNavbar } from "@/components/views/home/HomeNavbar"
import { HeroSection } from "@/components/views/home/HeroSection"
import { LiveNowSection } from "@/components/views/home/LiveNowSection"
import { FeaturesSection } from "@/components/views/home/FeaturesSection"
import { HomeFooter } from "@/components/views/home/HomeFooter"
import { LiveNowSkeleton } from "@/components/views/home/LiveNowSkeleton"

export const metadata: Metadata = {
  title: "StreamForge — Watch Live Streams & Start Broadcasting",
  description:
    "Discover live streams from creators around the world, or start broadcasting from your browser in seconds. Real-time chat, emoji reactions, and stream analytics.",
}

export default function Page() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <HomeNavbar />

      <main className="flex-1">
        <HeroSection />

        <Suspense fallback={<LiveNowSkeleton />}>
          <LiveNowSection />
        </Suspense>

        <FeaturesSection />
      </main>

      <HomeFooter />
    </div>
  )
}
