import { requireRole } from "@/lib/session";
import { DashboardShell, type NavItem } from "@/components/dashboard-shell";

const navItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/users", label: "Users", icon: "users" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole("ADMIN");
  return (
    <DashboardShell
      brandHref="/admin/dashboard"
      navItems={navItems}
      userName={user.name ?? "Admin"}
      roleLabel="Administrator"
    >
      {children}
    </DashboardShell>
  );
}
