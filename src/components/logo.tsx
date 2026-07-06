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
    sm: { icon: "h-8 w-8", glyph: "h-4 w-4", text: "text-base" },
    md: { icon: "h-9 w-9", glyph: "h-[18px] w-[18px]", text: "text-lg" },
    lg: { icon: "h-11 w-11", glyph: "h-5 w-5", text: "text-xl" },
  };
  const s = sizes[size];

  return (
    <Link
      href={href}
      className={cn("group flex items-center gap-2.5", className)}
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-xl bg-gradient-to-br from-brand-strong to-brand-dark text-brand-foreground shadow-md shadow-brand/30 transition-transform group-hover:scale-105",
          s.icon
        )}
      >
        <svg
          className={s.glyph}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.25}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 9v6m10.5-6v6M4.5 9.75h3m9 0h3M4.5 14.25h3m9 0h3M9 6.75v10.5m6-10.5v10.5"
          />
        </svg>
      </span>
      <span
        className={cn(
          "font-display font-bold tracking-tight text-foreground",
          s.text
        )}
      >
        Fit<span className="text-brand-dark dark:text-brand">Nexus</span>
      </span>
    </Link>
  );
}
