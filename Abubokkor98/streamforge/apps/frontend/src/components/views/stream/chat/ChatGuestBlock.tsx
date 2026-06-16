import { Button } from "@/components/ui/button"
import { SignIn } from "@phosphor-icons/react"
import Link from "next/link"

function ChatGuestBlock() {
  return (
    <footer className="flex items-center justify-center gap-2 border-t border-border px-4 py-3">
      <SignIn className="size-4 text-muted-foreground" />
      <p className="text-xs text-muted-foreground">
        <Button variant="link" size="xs" asChild className="text-primary">
          <Link href="/login">Login</Link>
        </Button>{" "}
        to join the chat
      </p>
    </footer>
  )
}

export { ChatGuestBlock }
