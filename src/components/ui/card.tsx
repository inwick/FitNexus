import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  hover,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-6 shadow-sm shadow-black/[0.03]",
        hover &&
          "transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md hover:shadow-black/[0.06]",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-display text-base font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  );
}

type StatTier = "volt" | "flare" | "cyan" | "violet";

const statAccents: Record<
  StatTier,
  { wrap: string; icon: string; glow: string }
> = {
  volt: {
    wrap: "from-brand/12 to-transparent border-brand/25",
    icon: "bg-brand/15 text-brand-dark dark:text-brand",
    glow: "bg-brand/20",
  },
  flare: {
    wrap: "from-flare/12 to-transparent border-flare/25",
    icon: "bg-flare/15 text-flare",
    glow: "bg-flare/20",
  },
  cyan: {
    wrap: "from-cyan/12 to-transparent border-cyan/25",
    icon: "bg-cyan/15 text-cyan",
    glow: "bg-cyan/20",
  },
  violet: {
    wrap: "from-accent/12 to-transparent border-accent/25",
    icon: "bg-accent/15 text-accent",
    glow: "bg-accent/20",
  },
};

const tierOrder: StatTier[] = ["volt", "violet", "flare", "cyan"];

export function StatCard({
  label,
  value,
  hint,
  icon,
  trend,
  tier,
  index = 0,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon?: React.ReactNode;
  trend?: { value: string; direction: "up" | "down" | "neutral" };
  tier?: StatTier;
  index?: number;
}) {
  const accent = statAccents[tier ?? tierOrder[index % tierOrder.length]];
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 transition-all duration-200 hover:-translate-y-0.5",
        accent.wrap
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-40 blur-2xl transition-opacity group-hover:opacity-70",
          accent.glow
        )}
      />
      <div className="relative z-10 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted">
            {label}
          </span>
          {icon ? (
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg",
                accent.icon
              )}
            >
              {icon}
            </span>
          ) : null}
        </div>
        <span className="font-display text-3xl font-bold tracking-tight text-foreground">
          {value}
        </span>
        <div className="flex items-center gap-2">
          {trend ? (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 text-xs font-semibold",
                trend.direction === "up" && "text-brand-dark dark:text-brand",
                trend.direction === "down" && "text-flare",
                trend.direction === "neutral" && "text-muted"
              )}
            >
              {trend.direction === "up"
                ? "▲"
                : trend.direction === "down"
                  ? "▼"
                  : "•"}{" "}
              {trend.value}
            </span>
          ) : null}
          {hint ? <span className="text-xs text-muted">{hint}</span> : null}
        </div>
      </div>
    </div>
  );
}

type BadgeColor = "green" | "yellow" | "red" | "indigo" | "slate";

const badgeColors: Record<BadgeColor, string> = {
  green:
    "bg-brand-light text-brand-dark ring-1 ring-brand/25 dark:text-brand",
  yellow:
    "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20 dark:bg-amber-500/15 dark:text-amber-300",
  red: "bg-red-50 text-red-700 ring-1 ring-red-600/20 dark:bg-red-500/15 dark:text-red-300",
  indigo:
    "bg-accent/10 text-accent ring-1 ring-accent/25",
  slate:
    "bg-foreground/5 text-muted ring-1 ring-foreground/10",
};

export function Badge({
  children,
  color = "slate",
}: {
  children: React.ReactNode;
  color?: BadgeColor;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        badgeColors[color]
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-8 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light text-brand-dark dark:text-brand">
        {icon ?? (
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        )}
      </div>
      <p className="font-display font-semibold text-foreground">{title}</p>
      {description ? (
        <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-muted">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
