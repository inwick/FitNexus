"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navIcons } from "@/components/icons";

export function NavLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon?: keyof typeof navIcons;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");
  const Icon = icon ? navIcons[icon] : null;

  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
        active
          ? "bg-brand-light text-brand-dark shadow-sm"
          : "text-muted hover:bg-black/[0.03] hover:text-foreground"
      )}
    >
      {Icon ? (
        <Icon
          className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            active ? "text-brand" : "text-muted group-hover:text-foreground"
          )}
        />
      ) : null}
      <span>{label}</span>
      {active ? (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand" />
      ) : null}
    </Link>
  );
}
