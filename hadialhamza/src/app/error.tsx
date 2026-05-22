"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { AlertCircle, RefreshCcw, Home, MessageCircle } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[40%] h-[40%] bg-destructive/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-destructive/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center text-center max-w-lg w-full"
      >
        <div className="mb-8">
          <Logo hideTagline={true} className="scale-110" />
        </div>

        <div className="w-24 h-24 bg-destructive/10 rounded-3xl flex items-center justify-center mb-8 border border-destructive/20 shadow-2xl shadow-destructive/10">
          <AlertCircle className="w-12 h-12 text-destructive animate-pulse" />
        </div>

        <h1 className="text-3xl font-black text-foreground tracking-tight mb-4">
          Something went wrong
        </h1>
        <p className="text-muted-foreground font-medium mb-8 leading-relaxed">
          We encountered an unexpected glitch while processing your request. Don&apos;t worry, your data is safe. Let&apos;s try to refresh the connection.
        </p>

        {/* Error Digest (if available) */}
        {error.digest && (
          <div className="mb-10 p-4 bg-muted/50 rounded-xl border border-border w-full">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
              Error Signature
            </p>
            <code className="text-xs font-mono text-foreground break-all">
              {error.digest}
            </code>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:flex-1"
            icon={<RefreshCcw className="w-5 h-5" />}
            onClick={() => reset()}
          >
            Try Again
          </Button>
          
          <Link href="/dashboard" className="w-full sm:flex-1">
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              icon={<Home className="w-5 h-5" />}
            >
              Dashboard
            </Button>
          </Link>
        </div>

        <div className="mt-12 flex items-center gap-6">
          <button className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 uppercase tracking-widest">
            <MessageCircle className="w-4 h-4" />
            Contact Support
          </button>
          <div className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
          <p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
            Protocol Error 500
          </p>
        </div>
      </motion.div>
    </div>
  );
}
