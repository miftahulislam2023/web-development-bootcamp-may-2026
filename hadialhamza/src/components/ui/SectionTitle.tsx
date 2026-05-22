import React from "react";
import ScrollAnimation from "@/components/ui/ScrollAnimation";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  tag?: React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

const alignmentStyles: Record<string, string> = {
  left: "text-left items-start",
  center: "text-center items-center mx-auto",
  right: "text-right items-end ml-auto",
};

function SectionTitle({
  title,
  subtitle,
  tag,
  align = "center",
  className,
  titleClassName,
  subtitleClassName,
}: SectionTitleProps) {
  return (
    <ScrollAnimation
      direction="up"
      staggerChildren={0.15}
      className={cn(
        "flex flex-col max-w-3xl mb-10 w-full",
        alignmentStyles[align],
        className,
      )}
    >
      {tag && (
        <div className="relative inline-block px-4 py-1.5 text-xs font-bold tracking-widest text-primary uppercase bg-primary/10 rounded-full mb-2">
          {tag}
        </div>
      )}

      <h2
        className={cn(
          "my-2 text-4xl md:text-[2.5rem] font-bold tracking-tight text-foreground lg:leading-tight",
          titleClassName,
        )}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={cn(
            "text-sm md:text-base text-muted-foreground leading-relaxed max-w-[90%]",
            align === "center" && "mx-auto",
            align === "right" && "ml-auto",
            subtitleClassName,
          )}
        >
          {subtitle}
        </p>
      )}
    </ScrollAnimation>
  );
}

export default SectionTitle;
export type { SectionTitleProps };
