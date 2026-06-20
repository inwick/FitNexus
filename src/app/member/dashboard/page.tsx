import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard-shell";
import {
  Badge,
  Card,
  CardTitle,
  EmptyState,
  StatCard,
} from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { LineChart, type ChartPoint } from "@/components/ui/line-chart";
import { formatCurrency, formatDate } from "@/lib/utils";
import { goalLabels } from "@/lib/validations";

export default async function MemberDashboard() {
  const user = await requireRole("MEMBER");

  const [profile, purchases, recentLogs, progress, workoutCount] =
    await Promise.all([
      prisma.memberProfile.findUnique({ where: { userId: user.id } }),
      prisma.purchase.findMany({
        where: { memberId: user.id },
        include: { package: true, coach: { include: { user: true } } },
        orderBy: { purchasedAt: "desc" },
      }),
      prisma.workoutLog.findMany({
        where: { memberId: user.id },
        orderBy: { date: "desc" },
        take: 5,
      }),
      prisma.progressEntry.findMany({
        where: { memberId: user.id },
        orderBy: { date: "asc" },
        take: 12,
      }),
      prisma.workoutLog.count({ where: { memberId: user.id } }),
    ]);

  const activeCoaches = purchases.filter((p) => p.status === "PAID");
  const chart: ChartPoint[] = progress.map((p) => ({
    label: formatDate(p.date).replace(/,.*/, ""),
    value: p.weight,
  }));

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user.name?.split(" ")[0] ?? "there"}`}
        description="Your fitness journey at a glance."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Goal"
          value={profile ? goalLabels[profile.goal] : "-"}
          index={0}
        />
        <StatCard label="Coaches hired" value={activeCoaches.length} index={1} />
        <StatCard label="Workouts logged" value={workoutCount} index={2} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle className="mb-3">Your coaches & packages</CardTitle>
          {purchases.length === 0 ? (
            <EmptyState
              title="No coaches yet"
              description="Find a coach to start your program."
              action={
                <ButtonLink href="/member/coaches" size="sm">
                  Find coaches
                </ButtonLink>
              }
            />
          ) : (
            <ul className="space-y-3">
              {purchases.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{p.package?.title ?? "Package"}</p>
                    <p className="text-xs text-muted">
                      Coach {p.coach?.user.name ?? "Coach"} - {formatCurrency(p.amount)}
                    </p>
                  </div>
                  <Badge color={p.status === "PAID" ? "green" : "yellow"}>
                    {p.status === "PAID" ? "Active" : "Pending"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardTitle className="mb-3">Weight trend</CardTitle>
          <LineChart data={chart} unit="kg" />
        </Card>
      </div>

      <Card className="mt-6">
        <CardTitle className="mb-3">Recent workouts</CardTitle>
        {recentLogs.length === 0 ? (
          <EmptyState
            title="No workouts logged"
            description="Log your first workout to track your training."
            action={
              <ButtonLink href="/member/workouts" size="sm">
                Log workout
              </ButtonLink>
            }
          />
        ) : (
          <ul className="divide-y divide-border">
            {recentLogs.map((log) => (
              <li
                key={log.id}
                className="flex items-center justify-between py-2 text-sm"
              >
                <span className="font-medium">{log.exercise}</span>
                <span className="text-muted">
                  {log.sets} x {log.reps}
                  {log.weight ? ` @ ${log.weight}kg` : ""}
                </span>
                <span className="text-xs text-muted">
                  {formatDate(log.date)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
