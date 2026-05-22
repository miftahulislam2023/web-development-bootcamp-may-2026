import Link from "next/link";
import { cn } from "@/utils/cn";

export function Logo({ className = "", size = "md", href = "/" }) {
  const sizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  const iconSizes = {
    sm: "h-8 w-8",
    md: "h-9 w-9",
    lg: "h-11 w-11",
    xl: "h-14 w-14",
  };

  const svgSizes = {
    sm: 14,
    md: 18,
    lg: 22,
    xl: 28,
  };

  return (
    <Link 
      href={href} 
      className={cn("flex items-center gap-2.5 group transition-opacity hover:opacity-95", className)}
    >
      <div className={cn(
        "relative flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md group-hover:shadow-indigo-500/40 transition-all duration-300",
        iconSizes[size]
      )}>
        <svg 
          width={svgSizes[size]} 
          height={svgSizes[size]} 
          viewBox="0 0 16 16" 
          fill="none"
          className="text-white"
        >
          <path d="M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM11 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="currentColor"/>
        </svg>
      </div>
      <span className={cn("font-display font-bold tracking-tight text-[var(--foreground)]", sizes[size])}>
        Nexora <span className="text-[var(--accent)]">Studio</span>
      </span>
    </Link>
  );
}
