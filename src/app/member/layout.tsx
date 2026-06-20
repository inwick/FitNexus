import { requireRole } from "@/lib/session";
import { DashboardShell, type NavItem } from "@/components/dashboard-shell";

const navItems: NavItem[] = [
  { href: "/member/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/member/coaches", label: "Find Coaches", icon: "coaches" },
  { href: "/member/plans", label: "My Plans", icon: "plans" },
  { href: "/member/workouts", label: "Workouts", icon: "workouts" },
  { href: "/member/progress", label: "Progress", icon: "progress" },
];

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole("MEMBER");
  return (
    <DashboardShell
      brandHref="/member/dashboard"
      navItems={navItems}
      userName={user.name ?? "Member"}
      roleLabel="Member"
    >
      {children}
    </DashboardShell>
  );
}
