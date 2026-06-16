import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Broadcast,
  Lightning,
} from "@phosphor-icons/react/dist/ssr"

async function HeroSection() {

  return (
    <section className="relative flex flex-col items-center px-6 pb-24 pt-20 text-center md:pb-32 md:pt-28">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute right-1/4 top-0 h-[500px] w-[500px] rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-live/6 blur-[100px]" />
      </div>

      <p className="mb-8 inline-flex animate-fade-in-up items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
        <Broadcast size={16} weight="fill" className="animate-pulse" aria-hidden="true" />
        <span>Live Streaming Platform</span>
      </p>

      <h1 className="mb-6 max-w-4xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-7xl">
        Watch Live.{" "}
        <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Stream Instantly.
        </span>
      </h1>

      <p className="mb-10 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
        Discover live streams from creators around the world, or start
        broadcasting from your browser in seconds. No downloads, no setup —
        just go live.
      </p>

      <div
        className="flex flex-wrap items-center justify-center gap-4"
        role="group"
        aria-label="Primary actions"
      >
        <Button size="lg" className="h-12 gap-2 px-8 text-base shadow-lg shadow-primary/20" asChild>
          <Link href="/dashboard">
            <Lightning size={18} weight="fill" />
            Start Streaming
          </Link>
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-12 px-8 text-base backdrop-blur-sm"
          asChild
        >
          <a href="#live-now">Browse Live Streams</a>
        </Button>
      </div>
    </section>
  )
}

export { HeroSection }
