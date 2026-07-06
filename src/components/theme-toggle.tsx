"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "fitnexus-theme";

export function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // ignore write failures (e.g. private mode)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={cn(
        "relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-border bg-card text-muted transition-all duration-200 hover:border-brand/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 active:scale-95",
        className
      )}
    >
      <span className="sr-only">Toggle theme</span>
      {/* Sun (light) */}
      <svg
        className={cn(
          "absolute h-[18px] w-[18px] transition-all duration-300",
          mounted && isDark
            ? "scale-0 -rotate-90 opacity-0"
            : "scale-100 rotate-0 opacity-100"
        )}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v1.5m0 15V21m9-9h-1.5m-15 0H3m15.364 6.364l-1.06-1.06M6.696 6.696l-1.06-1.06m12.728 0l-1.06 1.06M6.696 17.304l-1.06 1.06M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
        />
      </svg>
      {/* Moon (dark) */}
      <svg
        className={cn(
          "absolute h-[18px] w-[18px] transition-all duration-300",
          mounted && isDark
            ? "scale-100 rotate-0 opacity-100"
            : "scale-0 rotate-90 opacity-0"
        )}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.75}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
        />
      </svg>
    </button>
  );
}
