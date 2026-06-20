import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { PageHeader } from "@/components/dashboard-shell";
import { Badge, Card, EmptyState } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { toggleUserActive } from "@/server/admin-actions";
import type { Role } from "@/lib/db-types";

const roleColor: Record<Role, "indigo" | "green" | "slate"> = {
  MEMBER: "green",
  COACH: "indigo",
  ADMIN: "slate",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const admin = await requireRole("ADMIN");
  const { role } = await searchParams;
  const roleFilter =
    role === "MEMBER" || role === "COACH" || role === "ADMIN"
      ? (role as Role)
      : undefined;

  const users = await prisma.user.findMany({
    where: roleFilter ? { role: roleFilter } : undefined,
    orderBy: { createdAt: "desc" },
  });

  const filters: { label: string; value?: string }[] = [
    { label: "All" },
    { label: "Members", value: "MEMBER" },
    { label: "Coaches", value: "COACH" },
    { label: "Admins", value: "ADMIN" },
  ];

  return (
    <div>
      <PageHeader
        title="User management"
        description="View and manage all FitNexus accounts."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = (f.value ?? undefined) === roleFilter;
          return (
            <a
              key={f.label}
              href={f.value ? `/admin/users?role=${f.value}` : "/admin/users"}
              className={
                active
                  ? "rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-brand-foreground"
                  : "rounded-lg border border-border bg-white px-3 py-1.5 text-sm font-medium text-muted hover:bg-slate-50"
              }
            >
              {f.label}
            </a>
          );
        })}
      </div>

      {users.length === 0 ? (
        <EmptyState title="No users found" />
      ) : (
        <Card className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase text-muted">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-muted">{u.email}</td>
                  <td className="px-4 py-3">
                    <Badge color={roleColor[u.role]}>{u.role}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge color={u.active ? "green" : "red"}>
                      {u.active ? "Active" : "Disabled"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.role === "ADMIN" || u.id === admin.id ? (
                      <span className="text-xs text-muted">-</span>
                    ) : (
                      <form action={toggleUserActive} className="inline">
                        <input type="hidden" name="id" value={u.id} />
                        <Button
                          type="submit"
                          size="sm"
                          variant={u.active ? "danger" : "outline"}
                        >
                          {u.active ? "Disable" : "Enable"}
                        </Button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
