import { Button } from "@/components/ui/button"
import { WifiSlash } from "@phosphor-icons/react"
import Link from "next/link"

interface WaitingForHostProps {
  roomTitle: string
  hostName: string
}

function WaitingForHost({ roomTitle, hostName }: WaitingForHostProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-4 text-center">
      <div className="rounded-full bg-muted p-4">
        <WifiSlash className="size-8 text-muted-foreground" weight="bold" />
      </div>
      <h1 className="text-lg font-semibold text-foreground">{roomTitle}</h1>
      <p className="text-sm text-muted-foreground">
        {hostName} is not streaming right now. Check back later.
      </p>
      <Button variant="outline" asChild>
        <Link href="/">Back to Home</Link>
      </Button>
    </main>
  )
}

export { WaitingForHost }
