import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  href = "/",
  size = "md",
  className,
}: {
  href?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: { icon: "h-8 w-8 text-xs", text: "text-base" },
    md: { icon: "h-9 w-9 text-sm", text: "text-lg" },
    lg: { icon: "h-11 w-11 text-base", text: "text-xl" },
  };
  const s = sizes[size];

  return (
    <Link href={href} className={cn("group flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-dark font-bold text-brand-foreground shadow-md shadow-brand/25 transition-transform group-hover:scale-105",
          s.icon
        )}
      >
        FN
      </span>
      <span className={cn("font-bold tracking-tight text-foreground", s.text)}>
        FitNexus
      </span>
    </Link>
  );
}
