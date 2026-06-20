import { prisma } from "@/lib/prisma";
import { requireRole, getCoachProfile } from "@/lib/session";
import { PageHeader } from "@/components/dashboard-shell";
import {
  Badge,
  Card,
  CardTitle,
  EmptyState,
  StatCard,
} from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function CoachDashboard() {
  const user = await requireRole("COACH");
  const profile = await getCoachProfile(user.id);

  if (!profile) {
    return (
      <div>
        <PageHeader title="Dashboard" />
        <EmptyState
          title="Finish setting up"
          description="Complete your coach profile to get started."
          action={<ButtonLink href="/coach/profile">Edit profile</ButtonLink>}
        />
      </div>
    );
  }

  const [paidPurchases, packageCount, recent] = await Promise.all([
    prisma.purchase.findMany({
      where: { coachId: profile.id, status: "PAID" },
    }),
    prisma.package.count({ where: { coachId: profile.id } }),
    prisma.purchase.findMany({
      where: { coachId: profile.id },
      include: { member: true, package: true },
      orderBy: { purchasedAt: "desc" },
      take: 5,
    }),
  ]);

  const revenue = paidPurchases.reduce((sum, p) => sum + p.amount, 0);
  const clientIds = new Set(paidPurchases.map((p) => p.memberId));

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user.name?.split(" ")[0] ?? "Coach"}`}
        description="Your coaching business at a glance."
        action={
          <Badge color={profile.subscriptionStatus === "ACTIVE" ? "green" : "yellow"}>
            {profile.subscriptionStatus === "ACTIVE"
              ? `Active until ${profile.subscriptionExpiry ? formatDate(profile.subscriptionExpiry) : ""}`
              : "Subscription inactive"}
          </Badge>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active clients" value={clientIds.size} index={0} />
        <StatCard label="Packages" value={packageCount} index={1} />
        <StatCard
          label="Revenue (paid)"
          value={formatCurrency(revenue)}
          index={2}
        />
      </div>

      <Card className="mt-6">
        <CardTitle className="mb-3">Recent purchases</CardTitle>
        {recent.length === 0 ? (
          <EmptyState
            title="No purchases yet"
            description="When members buy your packages, they'll show up here."
          />
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between py-2 text-sm"
              >
                <span className="font-medium">{p.member?.name ?? "Member"}</span>
                <span className="text-muted">{p.package?.title ?? "Package"}</span>
                <Badge color={p.status === "PAID" ? "green" : "yellow"}>
                  {p.status}
                </Badge>
                <span className="text-xs text-muted">
                  {formatDate(p.purchasedAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
