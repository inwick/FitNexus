import { notFound } from "next/navigation";
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
import { LineChart, type ChartPoint } from "@/components/ui/line-chart";
import {
  PlanBuilder,
  type ExistingPlan,
} from "@/components/forms/plan-builder";
import { formatCurrency, formatDate } from "@/lib/utils";
import { goalLabels } from "@/lib/validations";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireRole("COACH");
  const profile = await getCoachProfile(user.id);
  const { id: memberId } = await params;

  if (!profile) notFound();

  const purchase = await prisma.purchase.findFirst({
    where: { coachId: profile.id, memberId, status: "PAID" },
    include: {
      package: true,
      member: { include: { memberProfile: true } },
    },
    orderBy: { purchasedAt: "desc" },
  });
  if (!purchase?.member) notFound();

  const member = purchase.member;
  const memberProfile = member.memberProfile;

  const [workoutPlan, mealPlan, logs, progress] = await Promise.all([
    prisma.workoutPlan.findFirst({
      where: { coachId: profile.id, memberId },
      include: { items: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.mealPlan.findFirst({
      where: { coachId: profile.id, memberId },
      include: { items: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.workoutLog.findMany({
      where: { memberId },
      orderBy: { date: "desc" },
      take: 10,
    }),
    prisma.progressEntry.findMany({
      where: { memberId },
      orderBy: { date: "asc" },
      take: 20,
    }),
  ]);

  const isExisting = !!workoutPlan || !!mealPlan;

  const chart: ChartPoint[] = progress.map((p) => ({
    label: formatDate(p.date).replace(/,.*/, ""),
    value: p.weight,
  }));

  const workoutExisting: ExistingPlan | undefined = workoutPlan
    ? {
        id: workoutPlan.id,
        title: workoutPlan.title,
        notes: workoutPlan.notes,
        items: (workoutPlan.items ?? []).map((it) => ({
          day: it.day,
          exercise: it.exercise,
          sets: it.sets,
          reps: it.reps,
          weight: it.weight,
        })),
      }
    : undefined;

  const mealExisting: ExistingPlan | undefined = mealPlan
    ? {
        id: mealPlan.id,
        title: mealPlan.title,
        notes: mealPlan.notes,
        items: (mealPlan.items ?? []).map((it) => ({
          time: it.time,
          meal: it.meal,
          items: it.items,
          calories: it.calories,
        })),
      }
    : undefined;

  return (
    <div>
      <PageHeader
        title={member.name}
        description={member.email}
        action={
          <Badge color={isExisting ? "indigo" : "yellow"}>
            {isExisting ? "Existing client" : "New client"}
          </Badge>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Goal"
          value={memberProfile ? goalLabels[memberProfile.goal] : "-"}
        />
        <StatCard label="Package" value={purchase.package?.title ?? "-"} hint={formatCurrency(purchase.amount)} />
        <StatCard
          label="Current weight"
          value={
            progress.length
              ? `${progress[progress.length - 1].weight}kg`
              : memberProfile
                ? `${memberProfile.weight}kg`
                : "-"
          }
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle className="mb-3">Progress (weight)</CardTitle>
          <LineChart data={chart} unit="kg" />
        </Card>

        <Card>
          <CardTitle className="mb-3">Recent workout logs</CardTitle>
          {logs.length === 0 ? (
            <EmptyState
              title="No logged workouts"
              description="This member hasn't logged any workouts yet."
            />
          ) : (
            <ul className="divide-y divide-border">
              {logs.map((log) => (
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

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle className="mb-1">
            {workoutExisting ? "Update workout plan" : "Create workout plan"}
          </CardTitle>
          <p className="mb-4 text-sm text-muted">
            Build the training plan, then notify the client on WhatsApp.
          </p>
          <PlanBuilder
            kind="workout"
            memberId={memberId}
            memberName={member.name}
            memberMobile={member.mobile}
            coachName={user.name ?? "your coach"}
            existing={workoutExisting}
          />
        </Card>

        <Card>
          <CardTitle className="mb-1">
            {mealExisting ? "Update meal plan" : "Create meal plan"}
          </CardTitle>
          <p className="mb-4 text-sm text-muted">
            Build the nutrition plan, then notify the client on WhatsApp.
          </p>
          <PlanBuilder
            kind="meal"
            memberId={memberId}
            memberName={member.name}
            memberMobile={member.mobile}
            coachName={user.name ?? "your coach"}
            existing={mealExisting}
          />
        </Card>
      </div>
    </div>
  );
}
