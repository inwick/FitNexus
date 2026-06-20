import { requireRole } from "@/lib/session";
import { DashboardShell, type NavItem } from "@/components/dashboard-shell";

const navItems: NavItem[] = [
  { href: "/coach/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/coach/profile", label: "Profile", icon: "profile" },
  { href: "/coach/packages", label: "Packages", icon: "packages" },
  { href: "/coach/clients", label: "Clients", icon: "clients" },
];

export default async function CoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole("COACH");
  return (
    <DashboardShell
      brandHref="/coach/dashboard"
      navItems={navItems}
      userName={user.name ?? "Coach"}
      roleLabel="Coach"
    >
      {children}
    </DashboardShell>
  );
}
