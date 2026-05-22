import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 flex items-center justify-center">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center text-center space-y-8 max-w-lg mx-auto">
            <div className="space-y-4">
              <h1 className="text-9xl font-bold text-primary/20 select-none">
                404
              </h1>
              <h2 className="text-2xl md:text-3xl font-bold">
                Page Not Found
              </h2>
              <p className="text-muted-foreground text-lg">
                Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/">
                  <Home className="mr-2 w-4 h-4" />
                  Go Home
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  Go to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}