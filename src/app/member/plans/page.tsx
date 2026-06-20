import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { PageHeader } from "@/components/dashboard-shell";
import { Card, CardTitle, EmptyState } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export default async function MemberPlansPage() {
  const user = await requireRole("MEMBER");

  const [workoutPlans, mealPlans] = await Promise.all([
    prisma.workoutPlan.findMany({
      where: { memberId: user.id },
      include: { items: true, coach: { include: { user: true } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.mealPlan.findMany({
      where: { memberId: user.id },
      include: { items: true, coach: { include: { user: true } } },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="My plans"
        description="Workout and meal plans created by your coaches."
      />

      <div className="space-y-8">
        <section>
          <h2 className="mb-3 text-lg font-semibold">Workout plans</h2>
          {workoutPlans.length === 0 ? (
            <EmptyState
              title="No workout plans yet"
              description="Your coach will create a plan once you've hired them."
            />
          ) : (
            <div className="space-y-4">
              {workoutPlans.map((plan) => (
                <Card key={plan.id}>
                  <div className="flex items-center justify-between">
                    <CardTitle>{plan.title}</CardTitle>
                    <span className="text-xs text-muted">
                      by {plan.coach?.user.name ?? "Coach"} - {formatDate(plan.updatedAt)}
                    </span>
                  </div>
                  {plan.notes ? (
                    <p className="mt-1 text-sm text-muted">{plan.notes}</p>
                  ) : null}
                  <table className="mt-3 w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase text-muted">
                        <th className="pb-2">Day</th>
                        <th className="pb-2">Exercise</th>
                        <th className="pb-2">Sets</th>
                        <th className="pb-2">Reps</th>
                        <th className="pb-2">Weight</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {(plan.items ?? []).map((it) => (
                        <tr key={it.id}>
                          <td className="py-2">{it.day}</td>
                          <td className="py-2 font-medium">{it.exercise}</td>
                          <td className="py-2">{it.sets}</td>
                          <td className="py-2">{it.reps}</td>
                          <td className="py-2">
                            {it.weight ? `${it.weight}kg` : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Meal plans</h2>
          {mealPlans.length === 0 ? (
            <EmptyState
              title="No meal plans yet"
              description="Your coach will create a meal plan for you."
            />
          ) : (
            <div className="space-y-4">
              {mealPlans.map((plan) => (
                <Card key={plan.id}>
                  <div className="flex items-center justify-between">
                    <CardTitle>{plan.title}</CardTitle>
                    <span className="text-xs text-muted">
                      by {plan.coach?.user.name ?? "Coach"} - {formatDate(plan.updatedAt)}
                    </span>
                  </div>
                  {plan.notes ? (
                    <p className="mt-1 text-sm text-muted">{plan.notes}</p>
                  ) : null}
                  <table className="mt-3 w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase text-muted">
                        <th className="pb-2">Time</th>
                        <th className="pb-2">Meal</th>
                        <th className="pb-2">Items</th>
                        <th className="pb-2">Calories</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {(plan.items ?? []).map((it) => (
                        <tr key={it.id}>
                          <td className="py-2">{it.time}</td>
                          <td className="py-2 font-medium">{it.meal}</td>
                          <td className="py-2 text-muted">{it.items}</td>
                          <td className="py-2">{it.calories} kcal</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
