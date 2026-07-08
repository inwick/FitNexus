import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui/button";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand-light px-4 py-1.5 text-sm font-medium text-brand-dark dark:text-brand">
      <span className="h-1.5 w-1.5 animate-glow-pulse rounded-full bg-brand" />
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left"
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="font-display max-w-2xl text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const loop = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
      <div className="flex w-max animate-marquee items-center gap-12">
        {loop.map((item, i) => (
          <span
            key={i}
            className="font-display whitespace-nowrap text-lg font-semibold tracking-tight text-muted/70"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function FeatureCard({
  icon,
  title,
  desc,
  points,
  accent = "volt",
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  points: string[];
  accent?: "volt" | "violet" | "flare";
}) {
  const accents = {
    volt: "bg-brand/15 text-brand-dark dark:text-brand group-hover:shadow-brand/20",
    violet: "bg-accent/15 text-accent group-hover:shadow-accent/20",
    flare: "bg-flare/15 text-flare group-hover:shadow-flare/20",
  };
  return (
    <div className="group flex flex-col rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/25 hover:shadow-xl hover:shadow-black/[0.06]">
      <div
        className={cn(
          "mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg",
          accents[accent]
        )}
      >
        {icon}
      </div>
      <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mt-1.5 text-sm text-muted">{desc}</p>
      <ul className="mt-5 space-y-2.5">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2.5 text-sm text-muted">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-brand-dark dark:text-brand"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StepCard({
  step,
  title,
  desc,
}: {
  step: number;
  title: string;
  desc: string;
}) {
  return (
    <div className="relative rounded-2xl border border-border bg-card p-7">
      <span className="font-display text-5xl font-bold text-brand/25">
        {String(step).padStart(2, "0")}
      </span>
      <h3 className="font-display mt-3 text-lg font-bold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{desc}</p>
    </div>
  );
}

export function Testimonial({
  quote,
  name,
  role,
  initials,
}: {
  quote: string;
  name: string;
  role: string;
  initials: string;
}) {
  return (
    <figure className="flex flex-col rounded-2xl border border-border bg-card p-7 shadow-sm">
      <div className="flex gap-0.5 text-brand-dark dark:text-brand" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.36 4.18a1 1 0 00.95.69h4.4c.97 0 1.37 1.24.59 1.81l-3.56 2.59a1 1 0 00-.36 1.12l1.36 4.18c.3.92-.76 1.68-1.54 1.11l-3.56-2.59a1 1 0 00-1.18 0l-3.56 2.59c-.78.57-1.84-.19-1.54-1.11l1.36-4.18a1 1 0 00-.36-1.12L1.15 9.61c-.78-.57-.38-1.81.59-1.81h4.4a1 1 0 00.95-.69L9.05 2.93z" />
          </svg>
        ))}
      </div>
      <blockquote className="mt-4 flex-1 text-base leading-relaxed text-foreground/90">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-strong to-brand-dark text-sm font-bold text-brand-foreground">
          {initials}
        </span>
        <div>
          <p className="text-sm font-semibold text-foreground">{name}</p>
          <p className="text-xs text-muted">{role}</p>
        </div>
      </figcaption>
    </figure>
  );
}

export function PricingCard({
  name,
  price,
  cadence,
  description,
  features,
  cta,
  href,
  featured = false,
}: {
  name: string;
  price: string;
  cadence?: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-3xl border p-8",
        featured
          ? "border-brand/40 bg-card shadow-xl glow-brand"
          : "border-border bg-card shadow-sm"
      )}
    >
      {featured ? (
        <span className="absolute -top-3 left-8 inline-flex items-center rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-foreground">
          Most popular
        </span>
      ) : null}
      <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
        {name}
      </h3>
      <p className="mt-1 text-sm text-muted">{description}</p>
      <div className="mt-5 flex items-baseline gap-1">
        <span className="font-display text-4xl font-bold tracking-tight text-foreground">
          {price}
        </span>
        {cadence ? <span className="text-sm text-muted">{cadence}</span> : null}
      </div>
      <ul className="mt-6 flex-1 space-y-3">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/80">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-brand-dark dark:text-brand"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <ButtonLink
        href={href}
        variant={featured ? "primary" : "outline"}
        className="mt-8 w-full"
      >
        {cta}
      </ButtonLink>
    </div>
  );
}

export function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="group rounded-2xl border border-border bg-card px-6 py-1 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 text-left font-semibold text-foreground">
        {question}
        <svg
          className="h-5 w-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </summary>
      <p className="pb-5 text-sm leading-relaxed text-muted">{answer}</p>
    </details>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto w-full max-w-6xl px-6 py-14">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Logo href="/" />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              The fitness coaching marketplace. Train harder, coach smarter, and
              reach your goals — together.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <FooterCol
              title="Product"
              links={[
                { label: "Features", href: "#features" },
                { label: "How it works", href: "#how" },
                { label: "Pricing", href: "#pricing" },
              ]}
            />
            <FooterCol
              title="Get started"
              links={[
                { label: "Join as member", href: "/register" },
                { label: "Become a coach", href: "/register?role=coach" },
                { label: "Log in", href: "/login" },
              ]}
            />
            <FooterCol
              title="Company"
              links={[
                { label: "About", href: "#" },
                { label: "Contact", href: "#" },
                { label: "Privacy", href: "#" },
              ]}
            />
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted sm:flex-row">
          <p>© {year} FitNexus. All rights reserved.</p>
          <p>Built for people who move.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">
        {title}
      </p>
      <ul className="mt-4 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-sm text-foreground/80 transition-colors hover:text-brand-dark dark:hover:text-brand"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
