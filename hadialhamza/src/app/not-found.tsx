"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, Home, Search } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center text-center max-w-md"
      >
        <div className="mb-8">
          <Logo hideTagline={true} className="scale-110" />
        </div>

        <div className="relative mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="text-[12rem] font-black text-primary/10 select-none leading-none"
          >
            404
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-background/80 backdrop-blur-sm p-4 rounded-full border border-border shadow-xl">
              <Search className="w-12 h-12 text-primary animate-pulse" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-black text-foreground tracking-tight mb-4">
          Lost in the Data?
        </h1>
        <p className="text-muted-foreground font-medium mb-10 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved
          to a new vault. Let&apos;s get you back on track with your finances.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
          <Link href="/dashboard" className="w-full sm:flex-1">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              icon={<Home className="w-5 h-5" />}
            >
              Dashboard
            </Button>
          </Link>

          <Button
            variant="outline"
            size="lg"
            className="w-full sm:flex-1"
            icon={<ArrowLeft className="w-5 h-5" />}
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>

        <p className="mt-12 text-xs font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">
          SpendSentry Secure Protocol 404
        </p>
      </motion.div>
    </div>
  );
}
