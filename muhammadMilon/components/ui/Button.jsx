import Link from "next/link";
import { cn } from "@/utils/cn";

const variants = {
  primary:
    "bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90 shadow-sm",
  secondary:
    "bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--muted)]/80 border border-[var(--border)]",
  ghost: "hover:bg-[var(--muted)] text-[var(--foreground)]",
  danger: "bg-red-600 text-white hover:bg-red-500",
  outline:
    "border border-[var(--border)] bg-transparent hover:bg-[var(--muted)] text-[var(--foreground)]",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  disabled,
  href,
  ...props
}) {
  const sizes = {
    sm: "h-8 px-3 text-xs rounded-md",
    md: "h-10 px-4 text-sm rounded-lg",
    lg: "h-11 px-6 text-sm rounded-lg",
  };

  const classes = cn(
    "inline-flex items-center justify-center font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
    variants[variant] ?? variants.primary,
    sizes[size] ?? sizes.md,
    className,
  );

  if (href) {
    return <Link href={href} className={classes} {...props} />;
  }

  return (
    <button type={type} disabled={disabled} className={classes} {...props} />
  );
}
