import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  hideText?: boolean;
  hideTagline?: boolean;
  inverted?: boolean;
}

export default function Logo({
  className,
  hideText = false,
  hideTagline = false,
  inverted = false,
}: LogoProps) {
  return (
    <div className={cn("inline-flex items-center select-none", className)}>
      {/* Logo icon */}
      <Image
        src="/logo/spend-sentry-logo.png"
        alt="SpendSentry Logo icon"
        width={44}
        height={44}
        className={cn("object-contain shrink-0", inverted && "brightness-0 invert")}
        priority
      />

      {/* Text block */}
      {!hideText && (
        <div className="flex flex-col font-logo items-center">
          <span className={cn("font-bold text-3xl leading-none", inverted ? "text-white" : "text-foreground")}>
            <span>Spend</span>
            <span className={inverted ? "text-white/90" : "text-primary"}>Sentry</span>
          </span>

          {/* Tagline */}
          {!hideTagline && (
            <span className={cn("font-semibold uppercase text-[10px] tracking-widest mt-0.5", inverted ? "text-white/60" : "text-primary")}>
              Track ● Analyze ● Save
            </span>
          )}
        </div>
      )}
    </div>
  );
}
