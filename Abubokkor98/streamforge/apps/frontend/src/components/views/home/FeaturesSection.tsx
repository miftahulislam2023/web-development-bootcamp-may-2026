import {
  Broadcast,
  ChatCircle,
  ChartBar,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr"

const FEATURES = [
  {
    icon: Broadcast,
    title: "Go Live Instantly",
    description:
      "Start streaming from your browser in seconds. No downloads, no plugins — just click and broadcast.",
    accentClass: "bg-live/10 text-live",
  },
  {
    icon: ChatCircle,
    title: "Real-Time Chat",
    description:
      "Engage your audience with live chat, emoji reactions, message pinning, and host moderation tools.",
    accentClass: "bg-primary/10 text-primary",
  },
  {
    icon: ChartBar,
    title: "Stream Analytics",
    description:
      "Track peak viewers, total duration, and chat activity. Review detailed summaries after every stream.",
    accentClass: "bg-info/10 text-info",
  },
  {
    icon: ShieldCheck,
    title: "Secure by Default",
    description:
      "End-to-end encrypted streams via WebRTC, JWT authentication, and rate-limited APIs to keep you safe.",
    accentClass: "bg-chart-3/10 text-chart-3",
  },
] as const

async function FeaturesSection() {

  return (
    <section className="px-6 py-20 md:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 text-center">
          <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">
            Built for Creators
          </h2>
          <p className="mx-auto max-w-lg text-sm text-muted-foreground md:text-base">
            Everything you need to run professional live streams, all from your
            browser.
          </p>
        </header>

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <li key={feature.title}>
              <article
                className="group h-full rounded-xl border border-border/50 bg-card/40 p-6 backdrop-blur-sm transition-all duration-300 hover:border-border hover:bg-card/70"
              >
              <div
                className={`mb-4 inline-flex size-11 items-center justify-center rounded-lg ${feature.accentClass} transition-transform duration-300 group-hover:scale-110`}
              >
                <feature.icon size={22} weight="duotone" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export { FeaturesSection }
