import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole, getCoachProfile } from "@/lib/session";
import { PageHeader } from "@/components/dashboard-shell";
import { Badge, Card, EmptyState } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { goalLabels } from "@/lib/validations";

export default async function CoachClientsPage() {
  const user = await requireRole("COACH");
  const profile = await getCoachProfile(user.id);

  const purchases = profile
    ? await prisma.purchase.findMany({
        where: { coachId: profile.id, status: "PAID" },
        include: {
          package: true,
          member: { include: { memberProfile: true } },
        },
        orderBy: { purchasedAt: "desc" },
      })
    : [];

  // Collapse to one row per member (latest purchase).
  const byMember = new Map<string, (typeof purchases)[number]>();
  for (const p of purchases) {
    if (!byMember.has(p.memberId)) byMember.set(p.memberId, p);
  }
  const clients = [...byMember.values()];

  const memberIds = clients.map((c) => c.memberId);
  const plans = profile
    ? await prisma.workoutPlan.findMany({
        where: { coachId: profile.id, memberId: { in: memberIds } },
      })
    : [];
  const withPlan = new Set(plans.map((p) => p.memberId));

  return (
    <div>
      <PageHeader
        title="Clients"
        description="Members who have purchased one of your packages."
      />

      {clients.length === 0 ? (
        <EmptyState
          title="No clients yet"
          description="When a member's purchase is confirmed as paid, they'll appear here."
        />
      ) : (
        <Card className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase text-muted">
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Goal</th>
                <th className="px-4 py-3">Package</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clients.map((c) => (
                <tr key={c.memberId} className="transition-colors hover:bg-foreground/[0.03]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/coach/clients/${c.memberId}`}
                      className="font-medium text-brand-dark hover:underline dark:text-brand"
                    >
                      {c.member?.name ?? "Member"}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    {c.member?.memberProfile
                      ? goalLabels[c.member.memberProfile.goal]
                      : "-"}
                  </td>
                  <td className="px-4 py-3">{c.package?.title ?? "-"}</td>
                  <td className="px-4 py-3">
                    <Badge color={withPlan.has(c.memberId) ? "indigo" : "yellow"}>
                      {withPlan.has(c.memberId) ? "Existing" : "New"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {formatDate(c.purchasedAt)}
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
