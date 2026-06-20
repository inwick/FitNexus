import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { PageHeader } from "@/components/dashboard-shell";
import {
  Badge,
  Card,
  CardTitle,
  EmptyState,
  StatCard,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  markPurchasePaid,
  markSubscriptionPaid,
} from "@/server/admin-actions";

export default async function AdminDashboard() {
  await requireRole("ADMIN");

  const [
    memberCount,
    coachCount,
    activeSubs,
    paidPurchases,
    paidSubs,
    pendingPurchases,
    pendingSubs,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "MEMBER" } }),
    prisma.user.count({ where: { role: "COACH" } }),
    prisma.coachProfile.count({ where: { subscriptionStatus: "ACTIVE" } }),
    prisma.purchase.findMany({ where: { status: "PAID" } }),
    prisma.coachSubscription.findMany({ where: { status: "PAID" } }),
    prisma.purchase.findMany({
      where: { status: "PENDING" },
      include: {
        member: true,
        package: true,
        coach: { include: { user: true } },
      },
      orderBy: { purchasedAt: "desc" },
    }),
    prisma.coachSubscription.findMany({
      where: { status: "PENDING" },
      include: { coach: { include: { user: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const packageRevenue = paidPurchases.reduce((s, p) => s + p.amount, 0);
  const subRevenue = paidSubs.reduce((s, p) => s + p.amount, 0);
  const totalRevenue = packageRevenue + subRevenue;

  return (
    <div>
      <PageHeader
        title="Admin dashboard"
        description="Marketplace overview and pending confirmations."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Members" value={memberCount} index={0} />
        <StatCard label="Coaches" value={coachCount} index={1} />
        <StatCard label="Active subscriptions" value={activeSubs} index={2} />
        <StatCard
          label="Total revenue"
          value={formatCurrency(totalRevenue)}
          hint={`${formatCurrency(subRevenue)} subs + ${formatCurrency(packageRevenue)} packages`}
          index={3}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle className="mb-3">Pending coach subscriptions</CardTitle>
          {pendingSubs.length === 0 ? (
            <EmptyState title="All caught up" description="No pending subscriptions." />
          ) : (
            <ul className="space-y-2">
              {pendingSubs.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{s.coach?.user.name ?? "Coach"}</p>
                    <p className="text-xs text-muted">
                      {formatCurrency(s.amount)} - {formatDate(s.createdAt)}
                    </p>
                  </div>
                  <form action={markSubscriptionPaid}>
                    <input type="hidden" name="id" value={s.id} />
                    <Button type="submit" size="sm">
                      Mark paid
                    </Button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardTitle className="mb-3">Pending package purchases</CardTitle>
          {pendingPurchases.length === 0 ? (
            <EmptyState title="All caught up" description="No pending purchases." />
          ) : (
            <ul className="space-y-2">
              {pendingPurchases.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {p.member?.name ?? "Member"}{" "}
                      <span className="font-normal text-muted">
                        - {p.package?.title ?? "Package"}
                      </span>
                    </p>
                    <p className="text-xs text-muted">
                      Coach {p.coach?.user.name ?? "Coach"} - {formatCurrency(p.amount)}
                    </p>
                  </div>
                  <form action={markPurchasePaid}>
                    <input type="hidden" name="id" value={p.id} />
                    <Button type="submit" size="sm">
                      Mark paid
                    </Button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card className="mt-6">
        <div className="flex items-center justify-between">
          <CardTitle>Revenue breakdown</CardTitle>
          <Badge color="indigo">{formatCurrency(totalRevenue)} total</Badge>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-muted">Coach subscriptions</p>
            <p className="text-xl font-bold">{formatCurrency(subRevenue)}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-muted">Package sales</p>
            <p className="text-xl font-bold">{formatCurrency(packageRevenue)}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
