import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ErrorDisplay } from "@/components/shared/error-display"

function HostViewError({ message }: { message: string }) {
  return (
    <ErrorDisplay
      title="Broadcast Error"
      message={message}
      fullPage
      action={
        <Button variant="outline" asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      }
    />
  )
}

export { HostViewError }
