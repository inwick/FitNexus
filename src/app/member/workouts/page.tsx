import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { PageHeader } from "@/components/dashboard-shell";
import { Card, CardTitle, EmptyState } from "@/components/ui/card";
import { WorkoutLogForm } from "@/components/forms/log-forms";
import { formatDate } from "@/lib/utils";

export default async function WorkoutsPage() {
  const user = await requireRole("MEMBER");
  const logs = await prisma.workoutLog.findMany({
    where: { memberId: user.id },
    orderBy: { date: "desc" },
    take: 50,
  });

  return (
    <div>
      <PageHeader
        title="Workouts"
        description="Log your training sessions and review your history."
      />

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card>
          <CardTitle className="mb-4">Log a workout</CardTitle>
          <WorkoutLogForm />
        </Card>

        <Card>
          <CardTitle className="mb-3">History</CardTitle>
          {logs.length === 0 ? (
            <EmptyState
              title="No workouts yet"
              description="Your logged workouts will appear here."
            />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-muted">
                  <th className="pb-2">Exercise</th>
                  <th className="pb-2">Sets</th>
                  <th className="pb-2">Reps</th>
                  <th className="pb-2">Weight</th>
                  <th className="pb-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="py-2 font-medium">{log.exercise}</td>
                    <td className="py-2">{log.sets}</td>
                    <td className="py-2">{log.reps}</td>
                    <td className="py-2">{log.weight ? `${log.weight}kg` : "-"}</td>
                    <td className="py-2 text-muted">{formatDate(log.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  );
}
