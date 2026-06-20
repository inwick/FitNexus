import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-brand to-brand-dark text-brand-foreground shadow-md shadow-brand/20 hover:shadow-lg hover:shadow-brand/30 hover:brightness-105",
  secondary:
    "bg-foreground text-white shadow-sm hover:bg-foreground/90",
  outline:
    "border border-border bg-card text-foreground hover:border-brand/30 hover:bg-brand-light/50",
  ghost: "text-muted hover:bg-black/5 hover:text-foreground",
  danger:
    "bg-red-500 text-white shadow-sm hover:bg-red-600",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

export function buttonClasses(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string
) {
  return cn(base, variants[variant], sizes[size], className);
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button className={buttonClasses(variant, size, className)} {...props} />
  );
}

interface ButtonLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
  size?: Size;
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={buttonClasses(variant, size, className)}
      {...props}
    />
  );
}
