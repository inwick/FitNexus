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
        hover && "transition-all duration-200 hover:border-brand/20 hover:shadow-md hover:shadow-black/[0.06]",
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
      className={cn("text-base font-semibold tracking-tight text-foreground", className)}
      {...props}
    />
  );
}

const statAccents = [
  "from-emerald-500/10 to-transparent border-emerald-500/20",
  "from-indigo-500/10 to-transparent border-indigo-500/20",
  "from-amber-500/10 to-transparent border-amber-500/20",
  "from-rose-500/10 to-transparent border-rose-500/20",
];

export function StatCard({
  label,
  value,
  hint,
  index = 0,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  index?: number;
}) {
  const accent = statAccents[index % statAccents.length];
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5",
        accent
      )}
    >
      <div className="relative z-10 flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wider text-muted">
          {label}
        </span>
        <span className="text-3xl font-bold tracking-tight text-foreground">
          {value}
        </span>
        {hint ? <span className="text-xs text-muted">{hint}</span> : null}
      </div>
    </div>
  );
}

type BadgeColor = "green" | "yellow" | "red" | "indigo" | "slate";

const badgeColors: Record<BadgeColor, string> = {
  green: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10",
  yellow: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/10",
  red: "bg-red-50 text-red-700 ring-1 ring-red-600/10",
  indigo: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/10",
  slate: "bg-slate-100 text-slate-600 ring-1 ring-slate-600/10",
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
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light text-brand">
        {icon ?? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        )}
      </div>
      <p className="font-semibold text-foreground">{title}</p>
      {description ? (
        <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-muted">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
