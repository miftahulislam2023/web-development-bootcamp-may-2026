import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FilmSlate } from "@phosphor-icons/react/dist/ssr"

function EmptyHistory() {
  return (
    <section className="flex flex-col items-center gap-4 py-20 text-center">
      <div className="rounded-full bg-muted p-4">
        <FilmSlate className="size-8 text-muted-foreground" aria-hidden="true" />
      </div>
      <h2 className="text-lg font-semibold text-foreground">
        No stream history yet
      </h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        Your completed streams will appear here with detailed analytics.
      </p>
      <Button asChild>
        <Link href="/dashboard">Go to Dashboard</Link>
      </Button>
    </section>
  )
}

export { EmptyHistory }
