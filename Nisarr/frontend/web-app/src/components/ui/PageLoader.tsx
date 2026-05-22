import { Loader2 } from "lucide-react";

export function PageLoader() {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center space-y-4">
      <div className="relative">
        {/* Outer glowing ring */}
        <div className="absolute -inset-4 rounded-full bg-primary/20 blur-xl animate-pulse" />
        <Loader2 className="h-10 w-10 animate-spin text-primary relative z-10" />
      </div>
      <p className="text-sm font-medium text-muted-foreground animate-pulse">
        Loading orbit...
      </p>
    </div>
  );
}
