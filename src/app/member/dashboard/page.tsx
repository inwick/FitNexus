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
          tier="volt"
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zm0-4.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9zm0-3a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
          }
        />
        <StatCard
          label="Coaches hired"
          value={activeCoaches.length}
          tier="violet"
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          }
        />
        <StatCard
          label="Workouts logged"
          value={workoutCount}
          tier="cyan"
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 9v6m10.5-6v6M4.5 9.75h3m9 0h3M4.5 14.25h3m9 0h3M9 6.75v10.5m6-10.5v10.5" />
            </svg>
          }
        />
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
